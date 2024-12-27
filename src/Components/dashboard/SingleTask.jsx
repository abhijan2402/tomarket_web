import React, { useContext, useEffect, useState } from "react";
import "../../Style/Dashboard.css";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  increment,
} from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";
import { db, storage } from "../../firebase";
import SkeletonList from "../SkeletonList/SkeletonList";
import { AppContext, useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import MyTask from "../MyTask";
import { platformIcons } from "../../constant/icons";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ProofModal from "./ProofModal";

const fetchTasks = async (userUid) => {
  const q = query(
    collection(db, "singletasks"),
    where("status", "==", "approved"),
    where("category", "in", ["OnChain", "Socials"]),
    where("createdBy", "!=", userUid),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  const tasks = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(tasks);

  return tasks;
};

function SingleTask() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("OnChain");
  const { categories } = useContext(AppContext);
  const [selectedTask, setSelectedTask] = useState(null);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [proofLink, setProofLink] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [btnLoading, setBtnLoading] = useState({});
  const [proofBtnLoading, setProofBtnLoading] = useState(false);
  const { mySingleStasks } = useApp();

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", user.uid],
    queryFn: () => fetchTasks(user.uid),
    staleTime: 300000,
  });

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  const openProofModal = (task) => {
    setSelectedTask(task);
    setProofModalOpen(true);
  };

  const handleStartTask = async (taskId, link) => {
    window.open(link, "_blank");

    setBtnLoading((prev) => ({ ...prev, [taskId]: true }));

    try {
      const taskDocRef = doc(db, "singletasks", taskId);
      const taskDoc = await getDoc(taskDocRef);

      let existingUserTasks = [];

      if (taskDoc.exists()) {
        existingUserTasks = taskDoc.data().userTasks || [];
      }

      const newUserTask = {
        userId: user.uid,
        status: "started",
        proofUrl: "",
        timestamp: new Date(),
      };

      const updatedUserTasks = [...existingUserTasks, newUserTask];

      await updateDoc(taskDocRef, { userTasks: updatedUserTasks });

      toast.info("Task is completed and tracked.");
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, userTasks: updatedUserTasks } : task
        )
      );
    } catch (error) {
      toast.error("Failed to process the task.");
      console.error(error);
    } finally {
      setBtnLoading((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const handleProofFileChange = (event) => {
    setProofFile(event.target.files[0]);
  };

  const submitProof = async (selectedTaskId) => {
    if (!selectedTask) {
      toast.error("Invalid proof data.");
      return;
    }

    setProofBtnLoading(true);

    try {
      const taskDocRef = doc(db, "singletasks", selectedTaskId);
      const taskDoc = await getDoc(taskDocRef);

      if (!taskDoc.exists()) {
        toast.error("Task not found.");
        return;
      }

      const existingUserTasks = taskDoc.data().userTasks || [];
      const userTaskIndex = existingUserTasks.findIndex(
        (task) => task.userId === user.uid
      );

      if (userTaskIndex === -1) {
        toast.error("User task not found.");
        return;
      }

      const updateTaskProof = async (proofUrl) => {
        existingUserTasks[userTaskIndex].proofUrl = proofUrl;
        existingUserTasks[userTaskIndex].status = "submitted";
        existingUserTasks[userTaskIndex].timestamp = new Date();

        await updateDoc(taskDocRef, { userTasks: existingUserTasks });
        toast.success("Proof submitted successfully!");
        setProofModalOpen(false);

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === selectedTaskId
              ? { ...task, userTasks: existingUserTasks }
              : task
          )
        );
      };

      if (taskDoc.data().proof === "link") {
        await updateTaskProof(proofLink);
      } else if (taskDoc.data().proof === "screenshot") {
        if (proofFile && proofFile.type.startsWith("image/")) {
          const proofRef = ref(
            storage,
            `proofs/${selectedTaskId}/${proofFile.name}-${Date.now()}`
          );
          const uploadResult = await uploadBytes(proofRef, proofFile);
          const proofURL = await getDownloadURL(uploadResult.ref);
          await updateTaskProof(proofURL);
        } else {
          toast.error("Invalid proof file.");
        }
      } else {
        toast.error("Proof is not required.");
      }
    } catch (error) {
      toast.error("Failed to submit proof.");
      console.error(error);
    } finally {
      setProofBtnLoading(false);
    }
  };

  const handleClaimTask = async (task) => {
    setBtnLoading((prev) => ({ ...prev, [task.id]: true }));
    try {
      const taskDocRef = doc(db, "singletasks", task.id);
      const taskDoc = await getDoc(taskDocRef);

      if (!taskDoc.exists()) {
        toast.error("Task not found.");
        return;
      }

      const existingUserTasks = taskDoc.data().userTasks || [];
      const userTaskIndex = existingUserTasks.findIndex(
        (task) => task.userId === user.uid
      );

      if (userTaskIndex === -1) {
        toast.error("User task not found.");
        return;
      }

      existingUserTasks[userTaskIndex].status = "claimed";
      existingUserTasks[userTaskIndex].timestamp = new Date();

      await updateDoc(taskDocRef, { userTasks: existingUserTasks });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        wallet: increment(Number(task.reward)),
      });

      toast.success("Reward claimed successfully!");

      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          item.id === task.id ? { ...item, userTasks: existingUserTasks } : item
        )
      );
    } catch (error) {
      console.error("Failed to claim the task:", error);
      toast.error("Failed to claim the reward.");
    } finally {
      setBtnLoading((prev) => ({ ...prev, [task.id]: false }));
    }
  };

  const renderTasks = () => {
    let filteredTasks = [];

    if (activeTab === "OnChain") {
      filteredTasks = tasks?.filter((task) => task.category === "OnChain");
    } else if (activeTab === "Socials") {
      filteredTasks = tasks?.filter((task) => task.category === "Socials");
    }

    return (
      <ul className="task-list">
        {filteredTasks.map((task) => {
          const userTask = task.userTasks?.find(
            (task) => task.userId === user.uid
          );

          return (
            <li key={task.id} className="task-list-item">
              {task.platformLogo.toLowerCase() === "twitter" ||
              task.platformLogo.toLowerCase() === "facebook" ||
              task.platformLogo.toLowerCase() === "instagram" ||
              task.platformLogo.toLowerCase() === "reddit" ||
              task.platformLogo.toLowerCase() === "youtube" ? (
                <i
                  className={`bi ${
                    platformIcons[task.platformLogo?.toLowerCase()] ||
                    platformIcons.defaultIcon
                  }`}
                ></i>
              ) : (
                <img
                  style={{
                    width: 45,
                    height: 45,
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  src={task.platformLogo}
                  alt=""
                />
              )}

              <div className="task-details">
                <h4 className="task-title">{task.title}</h4>
                <p style={{ color: "greenyellow", fontSize: "12px" }}>
                  +{task.reward} $
                </p>
              </div>
              <div>
                {userTask?.status === "started" ? (
                  task.proof === "screenshoot" || task.proof === "link" ? (
                    <button
                      disabled={proofBtnLoading}
                      className="redirect-icon"
                      onClick={() => openProofModal(task)}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      Proof
                      <i
                        className="bi bi-upload"
                        style={{
                          fontSize: "14px",
                          color: "#000",
                          marginLeft: "8px",
                        }}
                      ></i>
                    </button>
                  ) : (
                    <button
                      disabled={btnLoading[task.id]}
                      className="redirect-icon"
                      onClick={() => handleClaimTask(task)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        border: "none",
                        textWrap: "nowrap",
                      }}
                    >
                      {btnLoading[task.id] ? (
                        <div
                          class="spinner-border text-light spinner-border-sm"
                          role="status"
                        ></div>
                      ) : (
                        <>
                          Claim
                          <i
                            className="bi bi-currency-dollar"
                            style={{
                              fontSize: "16px",
                              marginLeft: "8px",
                            }}
                          ></i>
                        </>
                      )}
                    </button>
                  )
                ) : userTask?.status === "submitted" ? (
                  <div
                    className={`start-redirect-icon`}
                    style={{
                      textWrap: "nowrap",
                      opacity: "0.8",
                      cursor: "not-allowed",
                    }}
                  >
                    Under Review
                  </div>
                ) : userTask?.status === "approved" ? (
                  <button
                    disabled={btnLoading[task.id]}
                    className="redirect-icon"
                    onClick={() => handleClaimTask(task)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#4caf50",
                      color: "#fff",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      border: "none",
                      textWrap: "nowrap",
                    }}
                  >
                    {btnLoading[task.id] ? (
                      <div
                        class="spinner-border text-light spinner-border-sm"
                        role="status"
                      ></div>
                    ) : (
                      <>
                        Claim
                        <i
                          className="bi bi-currency-dollar"
                          style={{
                            fontSize: "16px",
                            marginLeft: "8px",
                          }}
                        ></i>
                      </>
                    )}
                  </button>
                ) : userTask?.status === "claimed" ? (
                  <div
                    className={`start-redirect-icon disabled`}
                    style={{
                      cursor: "not-allowed",
                      borderRadius: "10px",
                      padding: "4px 10px",
                      // backgroundColor:"transparent",
                    }}
                  >
                    <i
                      class="bi bi-check2-circle"
                      style={{ fontSize: "20px" }}
                    ></i>
                  </div>
                ) : (
                  <button
                    disabled={btnLoading[task.id]}
                    className={`start-redirect-icon`}
                    onClick={() => {
                      handleStartTask(task.id, task.link);
                    }}
                  >
                    {btnLoading[task.id] ? (
                      <div
                        class="spinner-border text-light spinner-border-sm"
                        role="status"
                      ></div>
                    ) : (
                      "Start"
                    )}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      {isLoading ? (
        <SkeletonList />
      ) : (
        <>
          <div className="tabs-container">
            {categories
              ?.filter((category) => category.name !== "Weekly")
              .map((category) => {
                const hasIncompleteTasks = tasks.some(
                  (task) =>
                    task.category === category.name &&
                    !task.userTasks?.some(
                      (userTask) =>
                        userTask.userId === user.uid &&
                        userTask.status === "claimed"
                    )
                );

                return (
                  <button
                    key={category.name}
                    className={activeTab === category.name ? "active" : ""}
                    onClick={() => setActiveTab(category.name)}
                  >
                    {category.name}
                    {hasIncompleteTasks && (
                      <i
                        className="bi bi-dot"
                        style={{
                          color: "goldenrod",
                          fontSize: "24px",
                          position: "absolute",
                          right: "-15px",
                          top: "-16px",
                        }}
                      ></i>
                    )}
                  </button>
                );
              })}
            <button
              className={activeTab === "mytask" ? "active" : ""}
              onClick={() => setActiveTab("mytask")}
              style={{ textWrap: "nowrap" }}
            >
              My task
            </button>
          </div>

          {/* Tab Content */}
          <div className="task-container">
            {activeTab === "mytask" ? (
              <MyTask DetailedUserTasks={mySingleStasks} />
            ) : (
              renderTasks()
            )}
          </div>
        </>
      )}

      <ProofModal
        proofModalOpen={proofModalOpen}
        setProofModalOpen={setProofModalOpen}
        setProofLink={setProofLink}
        selectedTask={selectedTask}
        btnLoading={proofBtnLoading}
        submitProof={submitProof}
        handleProofFileChange={handleProofFileChange}
      />
    </>
  );
}

export default SingleTask;

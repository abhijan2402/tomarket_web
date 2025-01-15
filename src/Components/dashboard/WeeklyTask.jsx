import React, { useContext, useEffect, useState } from "react";
import "../../Style/Dashboard.css";
import "../../Components/Cards/Card.css";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  doc,
  addDoc,
  where,
  getDoc,
  setDoc,
  orderBy,
  increment,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db, storage } from "../../firebase";
import Card from "../Cards/Card";
import SkeletonList from "../SkeletonList/SkeletonList";
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import MyTask from "../MyTask";
import { useQuery } from "@tanstack/react-query";
import { platformIcons } from "../../constant/icons";
import WeeklySkeleton from "../SkeletonList/WeeklySkeleton";
import ProofModal from "./ProofModal";

const fetchTasks = async (userUid) => {
  const q = query(
    collection(db, "singletasks"),
    where("status", "==", "approved"),
    where("category", "==", "Weekly"),
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

function WeeklyTask() {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [proofLink, setProofLink] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [btnLoading, setBtnLoading] = useState({});
  const [proofBtnLoading, setProofBtnLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["weekly-tasks", user.uid],
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
        userName: user.name,
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

  return (
    <>
      {isLoading ? (
        <WeeklySkeleton />
      ) : (
        <div>
          <div>
            <h6 style={{ color: "#FFF", padding: "8px 0px" }}>Weekly</h6>
          </div>
          <div className="weekly_Card">
            {tasks?.map((item, index) => {
              const userTask = item.userTasks?.find(
                (task) => task.userId === user.uid
              );

              return (
                <div className="card-space" key={index}>
                  <div
                    className="card_space_details"
                    style={{ display: "flex", gap: "10px" }}
                  >
                    {item.platformLogo.toLowerCase() === "twitter" ||
                    item.platformLogo.toLowerCase() === "facebook" ||
                    item.platformLogo.toLowerCase() === "instagram" ||
                    item.platformLogo.toLowerCase() === "reddit" ||
                    item.platformLogo.toLowerCase() === "youtube" ? (
                      <i
                        className={`bi ${
                          platformIcons[item.platformLogo?.toLowerCase()] ||
                          platformIcons.defaultIcon
                        }`}
                      ></i>
                    ) : (
                      <div>
                      <img
                        style={{
                          width: 45,
                          height: 45,
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                        src={item.platformLogo}
                        alt=""
                      />
                      </div>
                    )}

                    <div>
                      <h5>{item?.title || "Untitled Task"}</h5>
                      <p>+ {item?.reward || 0} $</p>
                    </div>
                  </div>
                  <div className="card_space_btn">
                    {userTask?.status === "started" ? (
                      item.proof === "screenshot" || item.proof === "link" ? (
                        <button
                          disabled={proofBtnLoading}
                          className="redirect-icon"
                          onClick={() => openProofModal(item)}
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
                        className={`start-redirect-icon`}
                          disabled={btnLoading[item.id]}
                          onClick={() => handleClaimTask(item)}
                          style={{
                            color: "#fff",
                            textWrap: "nowrap",
                            paddingLeft: 15,
                                paddingRight: 15
                          }}
                        >
                          {btnLoading[item.id] ? (
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
                        disabled={btnLoading[item.id]}
                        className={`start-redirect-icon`}
                        onClick={() => handleClaimTask(item)}
                        style={{
                          color: "#fff",
                          textWrap: "nowrap",
                          paddingLeft: 15,
                                paddingRight: 15
                        }}
                      >
                        {btnLoading[item.id] ? (
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
                              }}
                            ></i>
                          </>
                        )}
                      </button>
                    ) : userTask?.status === "claimed" ? (
                      <a href={item.link} target="_blank"
                        className={`start-redirect-icon disabled`}
                        style={{
                          cursor: "not-allowed",
                          borderRadius: "10px",
                          padding: "4px 10px",
                          color: "#fff",
                          backgroundColor:"transparent",
                        }}
                      >
                        <i
                          class="bi bi-check2-circle"
                          style={{ fontSize: "20px" }}
                        ></i>
                      </a>
                    ) : (
                      <button
                        disabled={btnLoading[item.id]}
                        className={`start-redirect-icon`}
                        onClick={() => {
                          handleStartTask(item.id, item.link);
                        }}
                      >
                        {btnLoading[item.id] ? (
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
                </div>
              );
            })}
          </div>
        </div>
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

export default WeeklyTask;

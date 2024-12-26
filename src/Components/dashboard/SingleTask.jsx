import React, { useContext, useState } from "react";
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
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import MyTask from "../MyTask";
import { platformIcons } from "../../constant/icons";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { use } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
  const [singleTasks, setSingleTasks] = useState([]);
  const { categories } = useContext(AppContext);
  const [DetailedUserTasks, setDetailedUserTasks] = useState();
  const [selectedTask, setSelectedTask] = useState(null);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [proofLink, setProofLink] = useState(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", user.uid],
    queryFn: () => fetchTasks(user.uid),
    staleTime: 300000,
  });

  const openProofModal = (task) => {
    setSelectedTask(task);
    setProofModalOpen(true);
  };

  const handleCompleteTask = async (taskId, link) => {
    window.open(link, "_blank");

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
    } catch (error) {
      toast.error("Failed to process the task.");
      console.error(error);
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

      if (proofFile && proofFile.type.startsWith("image/")) {
        const proofRef = ref(
          storage,
          `proofs/${selectedTaskId}/${proofFile.name}`
        );
        const uploadResult = await uploadBytes(proofRef, proofFile);
        const proofURL = await getDownloadURL(uploadResult.ref);

        existingUserTasks[userTaskIndex].proofUrl = proofURL;
        existingUserTasks[userTaskIndex].status = "submitted";
        existingUserTasks[userTaskIndex].timestamp = new Date();

        await updateDoc(taskDocRef, { userTasks: existingUserTasks });

        toast.success("Proof file submitted successfully!");
        setProofModalOpen(false);
      } else {
        toast.error("Invalid proof file.");
      }
    } catch (error) {
      toast.error("Failed to submit proof.");
      console.error(error);
    }
  };

  const handleClaimTask = async (task) => {
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

      // // Update the user's wallet in the users table
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        wallet: increment(Number(task.reward)),
      });

      toast.success("Reward claimed successfully!");
    } catch (error) {
      console.error("Failed to claim the task:", error);
      toast.error("Failed to claim the reward.");
    }
  };

  const renderTasks = () => {
    let filteredTasks = [];

    if (activeTab === "OnChain") {
      filteredTasks = tasks.filter((task) => task.category === "OnChain");
    } else if (activeTab === "Socials") {
      filteredTasks = tasks.filter((task) => task.category === "Socials");
    }

    return (
      <ul className="task-list">
        {filteredTasks.map((task) => {
          const userTask = task.userTasks?.find(
            (task) => task.userId === user.uid
          );

          return (
            <li key={task.id} className="task-list-item">
              <i
                className={`bi ${
                  platformIcons[task.platformLogo?.toLowerCase()] ||
                  platformIcons.defaultIcon
                }`}
              ></i>
              <div className="task-details">
                <h4 className="task-title">{task.title}</h4>
                <p style={{ color: "greenyellow", fontSize: "12px" }}>
                  +{task.reward} $
                </p>
              </div>
              <div>
                {userTask?.status === "started" ? (
                  task.proof !== "no" ? (
                    <button
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
                  ) : null
                ) : userTask.status === "submitted" ? (
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
                ) : userTask.status === "approved" ? (
                  <button
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
                    Claim
                    <i
                      className="bi bi-currency-dollar"
                      style={{
                        fontSize: "16px",
                        marginLeft: "8px",
                      }}
                    ></i>
                  </button>
                ) : userTask.status === "claimed" ? (
                  <div
                    className="redirect-icon"
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
                    Claimed
                  </div>
                ) : (
                  <button
                    className={`start-redirect-icon`}
                    onClick={() => {
                      handleCompleteTask(task.id, task.link);
                    }}
                  >
                    Start
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
                const hasIncompleteTasks = singleTasks.some(
                  (task) =>
                    task.category === category.name &&
                    task.status === "approved"
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
                          position: "relative",
                          right: "6px",
                          top: "-6px",
                        }}
                      ></i>
                    )}
                  </button>
                );
              })}
            <p
              className={activeTab === "mytask" ? "active" : ""}
              onClick={() => setActiveTab("mytask")}
            >
              My task
            </p>
          </div>

          {/* Tab Content */}
          <div className="task-container">
            {activeTab === "mytask" ? (
              <MyTask DetailedUserTasks={DetailedUserTasks} />
            ) : (
              renderTasks()
            )}
          </div>
        </>
      )}

      {proofModalOpen && (
        <div className="modal-overlay" onClick={() => setProofModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "18px",
              }}
            >
              Upload Proof{" "}
              <span
                onClick={() => setProofModalOpen(false)}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-x-square"></i>
              </span>
            </h4>
            {selectedTask?.proof === "link" ? (
              <input
                type="text"
                placeholder="Enter the link for proof"
                onChange={(e) => setProofLink(e.target.value)}
              />
            ) : selectedTask?.proof === "screenshot" ? (
              <input type="file" onChange={handleProofFileChange} />
            ) : (
              <p>Proof is not required</p>
            )}

            <button
              className="modal_submit_btn"
              onClick={() => submitProof(selectedTask.id)}
            >
              Submit Proof
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SingleTask;

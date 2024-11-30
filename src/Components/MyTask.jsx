import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const MyTask = ({ DetailedUserTasks }) => {
  const [showModal, setShowModal] = useState(false);
  const [UserSingleTasks, setUserSingleTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [loading, setLoading] = useState(true);

  const platformIcons = {
    youtube: "bi-youtube",
    twitter: "bi-twitter",
    instagram: "bi-instagram",
    facebook: "bi-facebook",
    reddit: "bi bi-reddit",
  };
  const defaultIcon = "bi bi-card-checklist";

  const handleOpenModal = (taskId) => {
    setSelectedTaskId(taskId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTaskId(null);
  };

  const getUserSingleTasks = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "UserSingleTasks"));
      const querySnapshot = await getDocs(q);

      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserSingleTasks(tasks);
    } catch (error) {
      toast.error("Failed to load user-single-tasks-details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserSingleTasks();
  }, []);

  // Ask Proof Form User
  const updateProofStatus = async (taskId) => {
    alert("hello");
    try {
      const taskDoc = doc(db, "UserSingleTasks", taskId);
      await updateDoc(taskDoc, {
        isProof: "askProof",
      });
      toast.success("Proof status updated successfully!");
      // Update state to reflect the change
      setUserSingleTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, isProof: "askProof" } : task
        )
      );
    } catch (error) {
      toast.error("Failed to update proof status.");
      console.error(error);
    }
  };

  // Give Reward to User

  const updateRewardStatus = async (taskId) => {
    console.log("Attempting to update task:", taskId);
    try {
      const taskRef = doc(db, "singletasks", taskId);

      // Check if the document exists
      const taskDoc = await getDoc(taskRef);
      if (!taskDoc.exists()) {
        console.error("Task not found in Firestore:", taskId);
        toast.error("Task does not exist in Firestore!");
        return;
      }

      console.log("Task found, updating status...");
      await updateDoc(taskRef, { status: "claimAward" });
      console.log("Status updated successfully!");
      toast.success("Reward status updated successfully!");
    } catch (error) {
      console.error("Failed to update reward status:", error);
      toast.error("Failed to update reward status.");
    }
    handleCloseModal();
  };

  const filteredUsers = UserSingleTasks.filter(
    (userTask) => userTask.TaskId === selectedTaskId
  );

  return (
    <>
      <ul className="task-list">
        {DetailedUserTasks?.map((userTask) => {
          const task = userTask;
          return (
            <li key={userTask.id} className="task-list-item">
              <i
                className={`bi ${
                  platformIcons[task?.platformLogo?.toLowerCase()] ||
                  defaultIcon
                }`}
              ></i>
              <div className="task-details">
                <h4 className="task-title">{task?.title}</h4>
                <p style={{ color: "greenyellow", fontSize: "12px" }}>
                  +{task?.reward} BP
                </p>
              </div>
              <div className="task-actions">
                <button
                  className="redirect-icon"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpenModal(userTask.id)}
                >
                  Task Details
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {showModal && (
        <div
          className="modal fade show custom-modal"
          style={{
            display: "block",
          }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content modal-tsk-content">
              <div className="modal-header">
                <h5 className="modal-title">Single Tasks Completion Details</h5>
                <i
                  className="bi bi-x-square"
                  style={{ fontSize: "1.5rem", cursor: "pointer" }}
                  onClick={handleCloseModal}
                ></i>
              </div>
              <div className="modal-body">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((item, index) => (
                    <div key={index} className="custome-card">
                      <div className="grp-tsk-desc">
                        <h6
                          className="card-title fs-5"
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {item.UserObject?.name || "No Name Provided"}
                        </h6>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        {/* Add Proof Button */}
                        <button
                          className="add-proof-btn"
                          style={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            marginRight: "10px",
                            border: "none",
                            padding: "5px 10px",
                            cursor: "pointer",
                            borderRadius: "5px",
                          }}
                          onClick={() => updateProofStatus(item.id)}
                          // disabled={item.isProof}
                        >
                          {item.isProof === "proofAdded" ? (
                            <i class="bi bi-check-all"></i>
                          ) : (
                            <i class="bi bi-cloud-arrow-up"></i>
                          )}
                        </button>

                        {/* Claim Button */}
                        <button
                          className="claim-btn"
                          style={{
                            backgroundColor: " #4caf50",
                            color: "#fff",
                            border: "none",
                            padding: "5px 10px",
                            cursor: "pointer",
                            borderRadius: "5px",
                          }}
                          onClick={() => updateRewardStatus(item.TaskId)}
                        >
                          <i
                            className="bi bi-currency-bitcoin"
                            style={{ fontSize: "20px" }}
                          ></i>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No users have completed this task yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyTask;

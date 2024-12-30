import React, { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { useApp } from "../context/AppContext";

const MyTask = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [approvedLoading, setApprovedLoading] = React.useState({});
  const [rejectedLoading, setRejectedLoading] = React.useState({});
  const { setMySingleTasks, mySingleStasks } = useApp();

  const platformIcons = {
    youtube: "bi-youtube",
    twitter: "bi-twitter",
    instagram: "bi-instagram",
    facebook: "bi-facebook",
    reddit: "bi bi-reddit",
  };

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const approveProof = async (index) => {
    setApprovedLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const taskDocRef = doc(db, "singletasks", selectedTask.id);
      const taskDoc = await getDoc(taskDocRef);

      if (!taskDoc.exists()) {
        toast.error("Task not found.");
        return;
      }

      const existingUserTasks = taskDoc.data().userTasks || [];

      existingUserTasks[index].status = "approved";
      existingUserTasks[index].timestamp = new Date();

      await updateDoc(taskDocRef, { userTasks: existingUserTasks });

      toast.success("Approvred successfully!");

      setMySingleTasks((prevTasks) =>
        prevTasks.map((item) =>
          item.id === selectedTask.id
            ? { ...item, userTasks: existingUserTasks }
            : item
        )
      );
      setSelectedTask({
        ...selectedTask,
        userTasks: existingUserTasks,
      });
    } catch (error) {
      console.error("Failed to claim the task:", error);
      toast.error("Failed to claim the reward.");
    } finally {
      setApprovedLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const rejectProof = async (index) => {
    setRejectedLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const taskDocRef = doc(db, "singletasks", selectedTask.id);
      const taskDoc = await getDoc(taskDocRef);

      if (!taskDoc.exists()) {
        toast.error("Task not found.");
        return;
      }

      const existingUserTasks = taskDoc.data().userTasks || [];

      existingUserTasks[index].status = "rejected";
      existingUserTasks[index].timestamp = new Date();

      await updateDoc(taskDocRef, { userTasks: existingUserTasks });

      toast.success("Rejected!");

      setMySingleTasks((prevTasks) =>
        prevTasks.map((item) =>
          item.id === selectedTask.id
            ? { ...item, userTasks: existingUserTasks }
            : item
        )
      );

      setSelectedTask({
        ...selectedTask,
        userTasks: existingUserTasks,
      });
    } catch (error) {
      console.error("Failed to claim the task:", error);
      toast.error("Failed to claim the reward.");
    } finally {
      setRejectedLoading((prev) => ({ ...prev, [index]: false }));
    }
  };


  return (
    <>
      <ul className="task-list">
        {mySingleStasks?.map((task) => {
          return (
            <li key={task.id} className="task-list-item">
              <div style={{ position: "relative" }}>
                {task.platformLogo.toLowerCase() === "twitter" ||
                task.platformLogo.toLowerCase() === "facebook" ||
                task.platformLogo.toLowerCase() === "instagram" ||
                task.platformLogo.toLowerCase() === "reddit" ||
                task.platformLogo.toLowerCase() === "youtube" ? (
                  <div style={{ width: 45, height: 45 }}>
                    <i
                      className={`bi ${
                        platformIcons[task.platformLogo?.toLowerCase()] ||
                        platformIcons.defaultIcon
                      }`}
                    ></i>
                  </div>
                ) : (
                  <div>
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
                  </div>
                )}

                <div
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor:
                      task.status === "approved"
                        ? "greenyellow"
                        : task.status === "reject"
                        ? "red"
                        : "gray",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    borderRadius: 999,
                  }}
                ></div>
              </div>

              <div className="task-details">
                <h4 className="task-title">{task?.title}</h4>
                <p style={{ color: "greenyellow", fontSize: "12px" }}>
                  +{task?.reward || 0} $,
                </p>
              </div>
              <div className="task-actions">
                <button
                  className="redirect-icon"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                  onClick={() => handleOpenModal(task)}
                >
                  <i
                    class="bi bi-list-check"
                    style={{ fontSize: "14px", color: "#000" }}
                  ></i>
                  Detail
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
                {selectedTask?.userTasks?.length > 0 ? (
                  selectedTask?.userTasks?.map((item, index) => (
                    <div key={index} className="custome-card">
                      <div className="grp-tsk-desc">
                        <h6
                          className="card-title fs-5"
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {item.userName || "No Name Provided"}
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
                        {item.proofUrl ? (
                          <a
                            href={item.proofUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <button
                              className="add-proof-btn"
                              style={{
                                backgroundColor: "#007bff",
                                color: "#fff",
                                marginRight: "10px",
                                border: "none",
                                padding: "8px 14px",
                                cursor: "pointer",
                                borderRadius: "5px",
                              }}
                            >
                              {item.status === "claimed" ? (
                                <i class="bi bi-check-all"></i>
                              ) : (
                                <i class="bi bi-cloud-arrow-up"></i>
                              )}
                            </button>
                          </a>
                        ) : null}

                        {item?.status === "started" ? (
                          <div
                            className={`start-redirect-icon`}
                            style={{
                              color: "#fff",
                              textWrap: "nowrap",
                              paddingLeft: 15,
                              textTransform: "capitalize",
                              paddingRight: 15,
                              cursor: "not-allowed",
                              opacity: "0.8",
                            }}
                          >
                            {item?.status}
                          </div>
                        ) : item.status === "submitted" ? (
                          <>
                            <button
                              className="claim-btn"
                              style={{
                                backgroundColor: "red",
                                color: "#fff",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer",
                                borderRadius: "5px",
                              }}
                              disabled={
                                approvedLoading[index] || rejectedLoading[index]
                              }
                              onClick={() => rejectProof(index)}
                            >
                              {rejectedLoading[index] ? (
                                <div
                                  class="spinner-border text-light spinner-border-sm my-1"
                                  role="status"
                                ></div>
                              ) : (
                                <i
                                  class="bi bi-x"
                                  style={{ fontSize: "20px" }}
                                ></i>
                              )}
                            </button>{" "}
                            <button
                              className="claim-btn"
                              disabled={
                                approvedLoading[index] || rejectedLoading[index]
                              }
                              style={{
                                backgroundColor: " #4caf50",
                                color: "#fff",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer",
                                borderRadius: "5px",
                              }}
                              onClick={() => approveProof(index)}
                            >
                              {approvedLoading[index] ? (
                                <div
                                  class="spinner-border text-light spinner-border-sm my-1"
                                  role="status"
                                ></div>
                              ) : (
                                <i
                                  class="bi bi-check"
                                  style={{ fontSize: "20px" }}
                                ></i>
                              )}
                            </button>{" "}
                          </>
                        ) : item.status === "approved" ? (
                          <div
                            className={`start-redirect-icon`}
                            style={{
                              color: "#fff",
                              textWrap: "nowrap",
                              paddingLeft: 15,
                              textTransform: "capitalize",
                              paddingRight: 15,
                              cursor: "not-allowed",
                              opacity: "0.8",
                            }}
                          >
                            {item?.status}
                          </div>
                        ) : item.status === "rejected" ? (
                          <div
                            className={`start-redirect-icon`}
                            style={{
                              color: "#fff",
                              textWrap: "nowrap",
                              background: "red",
                              paddingLeft: 15,
                              textTransform: "capitalize",
                              paddingRight: 15,
                              cursor: "not-allowed",
                              opacity: "0.8",
                            }}
                          >
                            {item?.status}
                          </div>
                        ) : null}

                        {/* Claim Button */}
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

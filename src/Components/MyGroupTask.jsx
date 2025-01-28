import React, { useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { useApp } from "../context/AppContext";
import ProofButtons from "./buttons/ProofButtons";

const MyGroupTask = () => {
  const [showModal, setShowModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [approvedLoading, setApprovedLoading] = React.useState({});
  const [rejectedLoading, setRejectedLoading] = React.useState({});
  const { setMyGroupTasks, myGrouptasks } = useApp();
  const [selectedGroup, setSelectedGroup] = useState();

  const platformIcons = {
    youtube: "bi-youtube",
    twitter: "bi-twitter",
    instagram: "bi-instagram",
    facebook: "bi-facebook",
    reddit: "bi bi-reddit",
  };

  const handleOpenModal = (task, index) => {
    setOpenModal(false);
    setSelectedTask(task);
    setSelectedTaskIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOpenModal(true);
  };

  const approveProof = async (index) => {
    setApprovedLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const taskDocRef = doc(db, "tasks", selectedGroup.id);
      const taskDoc = await getDoc(taskDocRef);

      if (!taskDoc.exists()) {
        toast.error("Task not found.");
        return;
      }

      const data = taskDoc.data();

      const task = data.tasks[selectedTaskIndex];

      const existingUserTasks = task.userTasks || [];

      existingUserTasks[index].status = "approved";
      existingUserTasks[index].timestamp = new Date();

      const updatedTasks = data.tasks.map((task, idx) =>
        idx === selectedTaskIndex
          ? { ...task, userTasks: existingUserTasks }
          : task
      );

      await updateDoc(taskDocRef, { tasks: updatedTasks });
      toast.success("Approvred successfully!");

      setMyGroupTasks((prevTasks) =>
        prevTasks.map((item) =>
          item.id === selectedTask.id ? { ...item, tasks: updatedTasks } : item
        )
      );
      setSelectedGroup({ ...selectedGroup, tasks: updatedTasks });
      setSelectedTask({ ...selectedTask, userTasks: existingUserTasks });
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
      const taskDocRef = doc(db, "tasks", selectedGroup.id); // Use selectedGroup.id for consistency
      const taskDoc = await getDoc(taskDocRef);

      if (!taskDoc.exists()) {
        toast.error("Task not found.");
        return;
      }

      const data = taskDoc.data();
      const task = data.tasks[selectedTaskIndex];

      if (!task) {
        toast.error("Selected task not found.");
        return;
      }

      const existingUserTasks = task.userTasks || [];

      if (!existingUserTasks[index]) {
        console.error(`No user task found at index ${index}`);
        toast.error("Task not found at the specified index.");
        return;
      }

      // Update the status and timestamp
      existingUserTasks[index].status = "rejected";
      existingUserTasks[index].timestamp = new Date();

      const updatedTasks = data.tasks.map((task, idx) =>
        idx === selectedTaskIndex
          ? { ...task, userTasks: existingUserTasks }
          : task
      );

      // Update Firestore document
      await updateDoc(taskDocRef, { tasks: updatedTasks });
      toast.success("Rejected successfully!");

      // Update local state
      setMyGroupTasks((prevTasks) =>
        prevTasks.map((item) =>
          item.id === selectedTask.id ? { ...item, tasks: updatedTasks } : item
        )
      );
      setSelectedGroup({ ...selectedGroup, tasks: updatedTasks });
      setSelectedTask({ ...selectedTask, userTasks: existingUserTasks });
    } catch (error) {
      console.error("Failed to reject the task:", error);
      toast.error("Failed to reject the task.");
    } finally {
      setRejectedLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <>
      <ul className="task-list">
        {myGrouptasks?.map((task) => {
          const platformLogo = task?.tasks[0]?.platformLogo || "";
          const title = task?.tasks[0]?.title || "";
          return (
            <li key={task.id} className="task-list-item">
              <div style={{ position: "relative" }}>
                {platformLogo?.toLowerCase() === "twitter" ||
                platformLogo?.toLowerCase() === "facebook" ||
                platformLogo?.toLowerCase() === "instagram" ||
                platformLogo?.toLowerCase() === "reddit" ||
                platformLogo?.toLowerCase() === "youtube" ? (
                  <div style={{ width: 45, height: 45 }}>
                    <i
                      className={`bi ${
                        platformIcons[platformLogo?.toLowerCase()] ||
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
                      src={platformLogo}
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
                <h4 className="task-title">{title}</h4>
                <p style={{ color: "greenyellow", fontSize: "12px" }}>
                  total Task - {task.tasks.length}
                </p>
              </div>
              <div className="task-actions">
                <button
                  style={{
                    textWrap: "nowrap",
                    marginLeft: "auto",
                    color: "#000",
                    padding: "8px 20px",
                    backgroundColor: "#fcc419",
                    borderRadius: 30,
                    fontSize: 14,
                    textDecoration: "none",
                    color: "#fff",
                  }}
                  onClick={() => {
                    setOpenModal(true);
                    setSelectedGroup(task);
                  }}
                >
                  <i
                    class="bi bi-list-check"
                    style={{ fontSize: "14px", color: "#fff" }}
                  ></i>
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
                <h5 className="modal-title">Tasks Completion Details</h5>
                <i
                  className="bi bi-x-square"
                  style={{ fontSize: "1.5rem", cursor: "pointer" }}
                  onClick={handleCloseModal}
                ></i>
              </div>
              <div
                style={{
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <p>Participants </p>{" "}
                <p>{selectedTask?.userTasks?.length || "0"}</p>
              </div>
              <div
                className="modal-body scrollable-container"
                style={{ maxHeight: "60vh", overflowY: "auto" }}
              >
                {selectedTask?.userTasks?.length > 0 ? (
                  selectedTask?.userTasks?.map((item, index) => (
                    <div
                      key={index}
                      className="custome-card"
                      style={{
                        borderBottom: "0.5px solid #ccc",
                        padding: "10px 0",
                        marginBottom: 10,
                      }}
                    >
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

                      <ProofButtons
                        item={item}
                        approveProofHandle={() => approveProof(index)}
                        rejectProofHandle={() => rejectProof(index)}
                        approvedLoading={approvedLoading[index]}
                        rejectedLoading={rejectedLoading[index]}
                      />
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

      {openModal && (
        <div
          className="modal fade show custom-modal"
          style={{
            display: "block",
          }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content modal-tsk-content">
              <div className="modal-header">
                <h5 className="modal-title">Group Tasks</h5>
                <i
                  className="bi bi-x-square"
                  style={{ fontSize: "1.5rem", cursor: "pointer" }}
                  onClick={() => setOpenModal(false)}
                ></i>
              </div>

              <div></div>
              <div className="modal-body">
                <div>
                  {selectedGroup?.thumbnail ? (
                    <div>
                      <img
                        style={{
                          width: "100%",
                          height: 160,
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                        src={selectedGroup?.thumbnail}
                      />
                    </div>
                  ) : null}

                  <p style={{ marginTop: "10px", textAlign: "left" }}>
                    {selectedGroup?.description}
                  </p>
                </div>

                <hr />
                {selectedGroup?.tasks?.map((task, index) => {
                  return (
                    <div className="mb-2" key={index}>
                      <div className="custome-card">
                        <div className="grp-tsk-desc">
                          <h6
                            className="card-title fs-5"
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                marginRight: "10px",
                                display: "flex",
                              }}
                            >
                              {task.platformLogo.toLowerCase() === "twitter" ||
                              task.platformLogo.toLowerCase() === "facebook" ||
                              task.platformLogo.toLowerCase() === "instagram" ||
                              task.platformLogo.toLowerCase() === "reddit" ||
                              task.platformLogo.toLowerCase() === "youtube" ? (
                                <i
                                  className={`bi ${
                                    platformIcons[
                                      task.platformLogo?.toLowerCase()
                                    ] || platformIcons.defaultIcon
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
                            </span>
                            {task?.title || "Untitled Task"}
                          </h6>
                          <p
                            className="text-success fs-6 pt-1"
                            style={{ textAlign: "left", paddingLeft: "30px" }}
                          >
                            Participate By - {task.userTasks?.length || 0}
                          </p>
                        </div>

                        <div>
                          <button
                            style={{
                              textWrap: "nowrap",
                              marginLeft: "auto",
                              color: "#000",
                              padding: "8px 20px",
                              backgroundColor: "#fcc419",
                              borderRadius: 30,
                              fontSize: 14,
                              textDecoration: "none",
                              color: "#fff",
                            }}
                            onClick={() => handleOpenModal(task, index)}
                          >
                            <i
                              class="bi bi-list-check"
                              style={{ fontSize: "14px", color: "#fff" }}
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyGroupTask;

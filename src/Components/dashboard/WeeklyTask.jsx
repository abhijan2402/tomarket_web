import React, { useContext, useEffect, useState } from "react";
import "../../Style/Dashboard.css";
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
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../firebase";
import Card from "../Cards/Card";
import SkeletonList from "../SkeletonList/SkeletonList";
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import MyTask from "../MyTask";

function WeeklyTask() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("OnChain");
  const [singleTasks, setSingleTasks] = useState([]);
  const [multiTasks, setMultiTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categories } = useContext(AppContext);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [proofLink, setProofLink] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [selectedGroupTasks, setSelectedGroupTasks] = useState([]);
  const [groupTaskId, setGroupTaskId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [DetailedUserTasks, setDetailedUserTasks] = useState();
  const [selectedTask, setSelectedTask] = useState(null);

  // Instruction Modal
  const [instructionModal, setInstructionModal] = useState(false);
  const [instructiontaskId, setInstructiontaskId] = useState(null);
  const [instructiontaskLink, setInstructionLink] = useState(null);
  const [instructionDetails, setInstructionDetails] = useState(null);
  console.log("details user", DetailedUserTasks);

  const storage = getStorage();

  const handleTaskDetailsInstructionModal = (taskId, link, desc) => {
    setInstructionModal(true);
    setInstructiontaskId(taskId);
    setInstructionLink(link);
    setInstructionDetails(desc);
  };
  const handleTaskDetailsInstructionModalClose = () => {
    setInstructionModal(false);
  };

  const handleOpenModal = (tasks, taskId) => {
    setGroupTaskId(taskId);
    setSelectedGroupTasks(tasks);
    setShowModal(true);
  };

  const handleOpenSingleTaskDetailsModal = (tasks, taskId) => {
    const task = singleTasks.find((t) => t.id === taskId);
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGroupTasks([]);
  };

  // Filter Weekly task

  const filter_weekly_task = singleTasks.filter(
    (task) =>
      task.status === "approved" ||
      (task.category === "Weekly" && task.status === "completed")
  );

  console.log(filter_weekly_task);

  const openProofModal = (taskId) => {
    setSelectedTaskId(taskId);
    setProofModalOpen(true);
  };

  const handleProoflink = (event) => {
    setProofLink(event.target.value);
  };

  const handleProofFileChange = (event) => {
    setProofFile(event.target.files[0]);
  };

  const submitProof = async () => {
    if (!selectedTaskId) {
      toast.error("Task ID is required.");
      return;
    }

    try {
      const taskDocRef = doc(db, "UserSingleTasks", selectedTaskId);

      if (currentTaskUserTask?.isProof === "proof") {
        // Handle file upload proof
        if (!proofFile) {
          toast.error("Please upload a proof file.");
          return;
        }

        const proofRef = ref(
          storage,
          `proofs/${selectedTaskId}/${proofFile.name}`
        );
        const uploadResult = await uploadBytes(proofRef, proofFile);
        const proofURL = await getDownloadURL(uploadResult.ref);

        // Update Firestore with proof URL
        await updateDoc(taskDocRef, { proofURL, isProof: "proofAdded" });

        toast.success("Proof file submitted successfully!");
      } else if (currentTaskUserTask?.isProof === "link") {
        // Handle proof link submission
        if (!proofLink) {
          toast.error("Please provide a proof link.");
          return;
        }

        // Update Firestore with proof link
        await updateDoc(taskDocRef, { proofLink, isProof: "proofLinkAdded" });

        toast.success("Proof link submitted successfully!");
      } else {
        toast.info("No proof required for this task.");
        return;
      }

      // Reset states and close modal
      setProofModalOpen(false);
      setProofFile(null);
      setProofLink(null);
    } catch (error) {
      toast.error("Failed to submit proof. Please try again.");
      console.error(error);
    }
  };

  const currentTaskUserTask = userTasks.find(
    (ut) => ut.TaskId === selectedTaskId
  );

  // Icon Mapping based on platform
  const platformIcons = {
    youtube: "bi-youtube",
    twitter: "bi-twitter",
    instagram: "bi-instagram",
    facebook: "bi-facebook",
    reddit: "bi bi-reddit",
  };

  // Default icon if `platformLogo` is not specified
  const defaultIcon = "bi bi-card-checklist";

  // Fetching Single
  const getSingleTasks = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "singletasks"));
      const querySnapshot = await getDocs(q);

      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSingleTasks(tasks);
    } catch (error) {
      toast.error("Failed to load tasks.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetching MultiTask
  const getMultiTasks = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "tasks"));
      const querySnapshot = await getDocs(q);

      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMultiTasks(tasks);
    } catch (error) {
      toast.error("Failed to load multi-tasks.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch UserTasks for the logged-in user
  const fetchUserTasks = async () => {
    if (!user) return;

    try {
      const userTasksQuery = query(collection(db, "UserSingleTasks"));
      const querySnapshot = await getDocs(userTasksQuery);
      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserTasks(tasks);
    } catch (error) {
      console.error("Error fetching UserTasks:", error);
    }
  };

  const fetchUserTaskDetails = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Query `singletasks` collection directly, filtering by the logged-in user's ID
      const tasksQuery = query(
        collection(db, "singletasks"),
        where("createdBy", "==", user.uid) // Filter by logged-in user's ID
      );

      const tasksSnapshot = await getDocs(tasksQuery);

      // Map the task documents to an array
      const tasksWithDetails = tasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Set the fetched tasks in state
      setDetailedUserTasks(tasksWithDetails);
    } catch (error) {
      console.error("Error fetching user tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("singletask", singleTasks);
  console.log("userTask", userTasks);

  useEffect(() => {
    getSingleTasks();
    getMultiTasks();
    fetchUserTasks();
  }, []);
  useEffect(() => {
    fetchUserTaskDetails();
  }, [userTasks]);

  // Handling the Individual task in a new tab and saving the details in UserTasks collection
  const handleCompleteTask = async (taskId, youtubeLink) => {
    // Open the YouTube link in a new tab
    window.open(youtubeLink, "_blank");
    console.log(taskId);

    try {
      // Reference to the task document in `singletasks` collection
      const taskDocRef = doc(db, "singletasks", taskId);

      // Update the task status to 'completed'
      await updateDoc(taskDocRef, { status: "completed" });

      // Add/Update the document in the `UserSingleTasks` collection
      const userSingleTaskDocRef = doc(
        db,
        "UserSingleTasks",
        `${user.uid}_${taskId}`
      );
      await setDoc(userSingleTaskDocRef, {
        UserId: user.uid,
        TaskId: taskId,
        UserObject: {
          name: user.name,
          email: user.email,
          wallet: user.wallet,
        },
        CurrentStatus: "completed",
        isProof: "notRequired",
        CompletedAt: new Date(),
      });

      // Update local state to reflect the changes
      setSingleTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: "completed" } : task
        )
      );
      handleTaskDetailsInstructionModalClose();
      toast.info("Task is completed and tracked.");
    } catch (error) {
      toast.error("Failed to process the task.");
      console.error(error);
    }
  };

  // Handle Calim Reward
  const handleClaimTask = async (taskId) => {
    try {
      // Update the task status in Firebase to "claimed" or perform any other logic
      const taskRef = doc(db, "UserSingleTasks", taskId);
      await updateDoc(taskRef, { status: "claimed" });
      toast.success("Reward claimed successfully!");
    } catch (error) {
      console.error("Failed to claim the task:", error);
      toast.error("Failed to claim the reward.");
    }
  };

  // Render Tasks on the Basis of Category and Filters
  const renderTasks = () => {
    let filteredTasks = [];

    // if (activeTab === "New") {
    //   filteredTasks = singleTasks.filter(
    //     (task) =>
    //       (task.status === "approved" ||
    //         task.status === "completed" ||
    //         task.status === "claimAward") &&
    //       task.createdBy !== user.uid
    //   );
    // }
    if (activeTab === "OnChain") {
      filteredTasks = singleTasks.filter(
        (task) =>
          (task.status === "completed" ||
            task.status === "claimAward" ||
            (task.status === "approved" && task.category === "OnChain")) &&
          task.createdBy !== user.uid
      );
    } else if (activeTab === "Socials") {
      filteredTasks = singleTasks.filter(
        (task) =>
          (task.status === "approved" ||
            task.status === "claimAward" ||
            (task.status === "completed" && task.category === "Socials")) &&
          task.createdBy !== user.uid
      );
    }

    return (
      <ul className="task-list">
        {filteredTasks.map((task) => {
          const userTask = userTasks.find((ut) => ut.TaskId === task.id);

          return (
            <li key={task.id} className="task-list-item">
              <i
                className={`bi ${
                  platformIcons[task.platformLogo?.toLowerCase()] || defaultIcon
                }`}
              ></i>
              <div className="task-details">
                <h4 className="task-title">{task.title}</h4>
                <p style={{ color: "greenyellow", fontSize: "12px" }}>
                  +{task.reward} $
                </p>
              </div>
              <div>
                {userTask?.isProof === "link" && "screenshot" ? (
                  <button
                    className="redirect-icon"
                    onClick={() => openProofModal(task.id)}
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
                  <>
                    {task.status === "claimAward" ? (
                      <button
                        className="redirect-icon"
                        onClick={() => handleClaimTask(task.id)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#4caf50",
                          color: "#fff",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          border: "none",
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
                    ) : (
                      <button
                        className={`start-redirect-icon ${
                          task.status === "completed" ? "disabled" : ""
                        }`}
                        onClick={() =>
                          task.status === "approved" &&
                          handleTaskDetailsInstructionModal(
                            task.id,
                            task.link,
                            task.title
                          )
                        }
                        disabled={task.status === "completed"}
                        style={{
                          cursor:
                            task.status === "completed"
                              ? "not-allowed"
                              : "pointer",
                          borderRadius:
                            task.status === "completed" ? "10px" : "",
                          padding:
                            task.status === "completed" ? "4px 10px" : "",
                          backgroundColor:
                            task.status === "completed" ? "transparent" : null,
                        }}
                      >
                        {task.status === "completed" ? (
                          <i
                            class="bi bi-check2-circle"
                            style={{ fontSize: "20px" }}
                          ></i>
                        ) : (
                          "Start"
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  // Multi Group task approved tasks into a single array
  const approvedTasks = multiTasks.filter(
    (taskGroup) =>
      (taskGroup.status === "approved" ||
        taskGroup.status === "claimAward" ||
        (taskGroup.status === "completed" && taskGroup.category === "Socials")) &&
      taskGroup.createdBy !== user.uid
  );
  
  return (
    <>
      {loading ? (
        <SkeletonList />
      ) : (
        <div className="dashboard-container">
          {/* Adverts Section */}
          <div className="advert-container ">
            {approvedTasks.length > 0 &&
              approvedTasks.map((group, index) => {
                if (
                  !group.tasks ||
                  !Array.isArray(group.tasks) ||
                  group.tasks.length === 0
                ) {
                  return null;
                }
                const firstTask = group.tasks[0];
                return (
                  <div
                    className="advert-space card m-2 p-3"
                    key={group.id || index}
                  >
                    <div className="advert_space_img">
                      <i
                        className={`bi ${
                          platformIcons[
                            firstTask.platformLogo?.toLowerCase()
                          ] || defaultIcon
                        }`}
                      ></i>
                    </div>
                    <div className="advert_space_details card-body">
                      <h5 className="card-title fs-4">
                        {firstTask?.title || "Untitled Task"}
                      </h5>
                      <p className="text-success fs-5">{`+${
                        firstTask?.reward || 0
                      } $`}</p>
                    </div>
                    <div className="advert_space_btn  d-flex justify-content-between align-items-center">
                      <button
                        className="advert_space_btn1"
                        onClick={() => handleOpenModal(group.tasks, group?.id)}
                      >
                        Open
                      </button>
                      <p className="advert_space_card_count mb-0">{`${group?.tasks.length}`}</p>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Cards */}
          <div>
            <div>
              <h6 style={{ color: "#FFF", padding: "8px 0px" }}>Weekly</h6>
            </div>
            <div className="weekly_Card">
              <Card
                card_data={filter_weekly_task}
                handleCompleteTask={handleCompleteTask}
                openProofModal={openProofModal}
                userTasks={userTasks}
              />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tabs-container">
            {categories
              ?.filter(
                (category) =>
                  category.name !== "Weekly" && category.name !== "New"
              )
              .map((category) => {
                // Check if there are any incomplete tasks for this category
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
                    {hasIncompleteTasks && ( // Show dot only if there are incomplete tasks
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

          {/* Proof Uploading Modal */}
          {proofModalOpen && (
            <div
              className="modal-overlay"
              onClick={() => setProofModalOpen(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
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
                {currentTaskUserTask?.isProof === "link" ? (
                  <input
                    type="text"
                    placeholder="Enter the link for proof"
                    onChange={handleProoflink}
                  />
                ) : currentTaskUserTask?.isProof === "screenshot" ? (
                  <input type="file" onChange={handleProofFileChange} />
                ) : (
                  <p>No proof required</p>
                )}

                <button className="modal_submit_btn" onClick={submitProof}>
                  Submit Proof
                </button>
              </div>
            </div>
          )}

          {/* MultiTask ---> Group Task Modal */}
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
                    <h5 className="modal-title">Group Tasks</h5>
                    <i
                      className="bi bi-x-square"
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                      onClick={handleCloseModal}
                    ></i>
                  </div>
                  <div className="modal-body">
                    {selectedGroupTasks.map((task, index) => {
                      // Find the corresponding UserTask with isProof = true
                      const userTask = userTasks?.find(
                        (ut) => ut.TaskId === groupTaskId
                      );
                      const showAddProof = userTask?.isProof;
                      console.log("userproof", showAddProof);

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
                                    marginRight: "14px",
                                    display: "flex",
                                  }}
                                >
                                  <i
                                    className={`bi ${
                                      platformIcons[
                                        task.platformLogo?.toLowerCase()
                                      ] || defaultIcon
                                    }`}
                                  ></i>
                                </span>
                                {task?.title || "Untitled Task"}
                              </h6>
                              <p className="text-success fs-6 pt-1">
                                +{task?.reward || 0} $
                              </p>
                            </div>
                            <div>
                              {showAddProof ? (
                                <button
                                  className="redirect-icon"
                                  onClick={() => openProofModal(task.id)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
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
                                  className={`redirect-icon ${
                                    task.status === "completed"
                                      ? "disabled"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleCompleteTask(groupTaskId, task.link)
                                  }
                                  disabled={task.status === "completed"}
                                  style={{
                                    cursor:
                                      task.status === "completed"
                                        ? "not-allowed"
                                        : "pointer",
                                  }}
                                >
                                  {task.status === "completed" ? (
                                    <i
                                      className="bi bi-check2-all"
                                      style={{
                                        fontSize: "20px",
                                        color: "#000",
                                      }}
                                    ></i>
                                  ) : (
                                    "Start"
                                  )}
                                </button>
                              )}
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

          {showModal && selectedTask && (
            <div
              className="modal fade show custom-modal"
              style={{
                display: "block",
              }}
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content modal-tsk-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Task Instructions</h5>
                    <i
                      className="bi bi-x-square"
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                      onClick={handleCloseModal}
                    ></i>
                  </div>
                  <div className="modal-body">
                    <h6>{selectedTask.title}</h6>
                    <p>
                      {selectedTask.instructions ||
                        "No detailed instructions provided."}
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        handleCompleteTask(selectedTask.id, selectedTask.link);
                        handleCloseModal();
                      }}
                    >
                      Start Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Task Complition Instruction */}
          {instructionModal && (
            <div
              className="modal fade show custom-modal"
              style={{
                display: "block",
              }}
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content modal-tsk-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Tasks Instructions Completion Details
                    </h5>
                    <i
                      className="bi bi-x-square"
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                      onClick={() => handleTaskDetailsInstructionModalClose()}
                    ></i>
                  </div>
                  <div className="modal-body">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "left",
                      }}
                    >
                      <p>{instructionDetails}</p>
                      <div className="task-btn-complication-proceed">
                        <button
                          className="start-redirect-icon"
                          onClick={() =>
                            handleCompleteTask(
                              instructiontaskId,
                              instructiontaskLink
                            )
                          }
                        >
                          Complete Task
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default WeeklyTask;

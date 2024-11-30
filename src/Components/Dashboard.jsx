import React, { useContext, useEffect, useState } from "react";
import "../Style/Dashboard.css";
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
import { db } from "../firebase";
import Card from "./Cards/Card";
import SkeletonList from "./SkeletonList/SkeletonList";
import { AppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import MyTask from "./MyTask";

function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("New");
  const [singleTasks, setSingleTasks] = useState([]);
  const [multiTasks, setMultiTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categories } = useContext(AppContext);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [selectedGroupTasks, setSelectedGroupTasks] = useState([]);
  const [groupTaskId, setGroupTaskId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [DetailedUserTasks, setDetailedUserTasks] = useState();
  console.log("details user", DetailedUserTasks);

  const storage = getStorage();

  const handleOpenModal = (tasks, taskId) => {
    setGroupTaskId(taskId);
    setSelectedGroupTasks(tasks);
    setShowModal(true);
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

  const handleProofFileChange = (event) => {
    setProofFile(event.target.files[0]);
  };

  const submitProof = async () => {
    if (!proofFile || !selectedTaskId) {
      toast.error("Please upload a proof file.");
      return;
    }

    const proofRef = ref(storage, `proofs/${selectedTaskId}/${proofFile.name}`);

    try {
      // Upload file to Firebase Storage
      const uploadResult = await uploadBytes(proofRef, proofFile);
      const proofURL = await getDownloadURL(uploadResult.ref);

      // Update Firestore with proof URL
      const taskDocRef = doc(db, "UserSingleTasks", selectedTaskId);
      await updateDoc(taskDocRef, { proofURL, isProof: "proofAdded" });

      setProofModalOpen(false);
      setProofFile(null);
      toast.success("Proof submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit proof. Please try again.");
      console.error(error);
    }
  };

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
    alert("hake");
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

    if (activeTab === "New") {
      filteredTasks = singleTasks.filter(
        (task) =>
          (task.status === "approved" ||
            task.status === "completed" ||
            task.status === "claimAward") &&
          task.createdBy !== user.uid
      );
    } else if (activeTab === "OnChain") {
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
          // Check if the current task has a corresponding UserTask with isProof = true
          const userTask = userTasks.find((ut) => ut.TaskId === task.id);
          const showAddProof = userTask?.isProof === "askProof";

          return (
            <li key={task.id} className="task-list-item">
              <i
                className={`bi ${
                  platformIcons[task.platformLogo?.toLowerCase()] || defaultIcon
                }`}
              ></i>
              {/* Task details */}
              <div className="task-details">
                <h4 className="task-title">{task.title}</h4>
                <p style={{ color: "greenyellow", fontSize: "12px" }}>
                  +{task.reward} BP
                </p>
              </div>
              {/* Add proof or start/claim task */}
              <div>
                {showAddProof ? (
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
                    {/* Claim Button */}
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
                          className="bi bi-currency-bitcoin"
                          style={{
                            fontSize: "18px",
                            marginLeft: "8px",
                          }}
                        ></i>
                      </button>
                    ) : (
                      <>
                        {/* Start or Completed Task Button */}
                        <button
                          className={`redirect-icon ${
                            task.status === "completed" ? "disabled" : ""
                          }`}
                          onClick={() =>
                            task.status === "approved" &&
                            handleCompleteTask(task.id, task.link)
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
                              style={{ fontSize: "20px", color: "#000" }}
                            ></i>
                          ) : (
                            "Start"
                          )}
                        </button>
                      </>
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
    (taskGroup) => taskGroup.status === "approved"
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
                console.log("g id", group);
                // Ensure tasks exist and it's an array with at least one element
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
                        {firstTask?.description || "Untitled Task"}
                      </h5>
                      <p className="text-success fs-5">{`+${
                        firstTask?.reward || 0
                      } BP`}</p>
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
              ?.filter((category) => category.name !== "Weekly") // Filter out "Weekly"
              .map((category) => (
                <button
                  key={category.name} // Add a key for React's reconciliation
                  className={activeTab === category.name ? "active" : ""}
                  onClick={() => setActiveTab(category.name)}
                >
                  {category.name}
                </button>
              ))}
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
                    <i class="bi bi-x-square"></i>
                  </span>
                </h4>
                <input type="file" onChange={handleProofFileChange} />
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
                                {task?.description || "Untitled Task"}
                              </h6>
                              <p className="text-success fs-6 pt-1">
                                +{task?.reward || 0} BP
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
        </div>
      )}
    </>
  );
}

export default Dashboard;

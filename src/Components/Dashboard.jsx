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
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase";
import Card from "./Cards/Card";
import SkeletonList from "./SkeletonList/SkeletonList";
import { AppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("New");
  const [completedTasks, setCompletedTasks] = useState([]);
  const [singleTasks, setSingleTasks] = useState([]);
  const [multiTasks, setMultiTasks] = useState([]);
  const [taskStates, setTaskStates] = useState({});
  const [loading, setLoading] = useState(true);
  const { categories } = useContext(AppContext);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const storage = getStorage();

  const filter_weekly_task = singleTasks.filter(
    (task) =>
      task.status === "approved" ||
      (task.status === "completed" && task.category === "Weekly")
  );

  console.log("weekly", filter_weekly_task);

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
      const taskDocRef = doc(db, "singletasks", selectedTaskId);
      await updateDoc(taskDocRef, { proofURL, status: "proofSubmitted" });

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
      const userTasksQuery = query(
        collection(db, "UserTasks"),
        where("UserId", "==", user.uid)
      );
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

  console.log("singletask", singleTasks);

  useEffect(() => {
    getSingleTasks();
    getMultiTasks();
    fetchUserTasks();
  }, []);

  // Handling the Individual task in a new tab and saving the details in UserTasks collection
  const handleCompleteTask = async (taskId, youtubeLink) => {
    // Open the task link in a new tab
    window.open(youtubeLink, "_blank");

    try {
      // Update the status of the task in the Firestore collection
      const taskDocRef = doc(db, "singletasks", taskId);
      await updateDoc(taskDocRef, { status: "completed" });

      // Save the user's progress in UserTasks collection
      if (!user) throw new Error("User not logged in.");
      const userTaskData = {
        UserTaskId: `UT${Date.now()}`,
        UserId: user.uid,
        TaskId: taskId,
        UserObject: {
          name: user.displayName || "John Doe",
          role: "Designer",
        },
        CurrentStatus: "pending",
        isProof: true,
      };

      await addDoc(collection(db, "UserTasks"), userTaskData);

      // Update local state to reflect changes
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

  // Render Tasks on the Basis of Category and Filters
  const renderTasks = () => {
    let filteredTasks = [];

    if (activeTab === "New") {
      filteredTasks = singleTasks.filter(
        (task) => task.status === "approved" || task.status === "completed"
      );
    } else if (activeTab === "OnChain") {
      filteredTasks = singleTasks.filter(
        (task) =>
          task.status === "completed" ||
          (task.status === "approved" && task.category === "OnChain")
      );
    } else if (activeTab === "Socials") {
      filteredTasks = singleTasks.filter(
        (task) =>
          task.status === "approved" ||
          (task.status === "completed" && task.category === "Socials")
      );
    }

    return (
      <ul className="task-list">
        {filteredTasks.map((task) => {
          // Check if the current task has a corresponding UserTask with isProof = true
          const userTask = userTasks.find((ut) => ut.TaskId === task.id);
          const showAddProof = userTask?.isProof;

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
                {showAddProof === true ? (
                  <button
                    className="redirect-icon"
                    onClick={() => openProofModal(task.id)}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    Proof
                    <i
                      class="bi bi-upload"
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
                      task.status === "completed" ? "disabled" : ""
                    }`}
                    onClick={() =>
                      task.status === "approved" &&
                      handleCompleteTask(task.id, task.link)
                    }
                    disabled={task.status === "completed"}
                    style={{
                      cursor:
                        task.status === "completed" ? "not-allowed" : "pointer",
                    }}
                  >
                    {task.status === "completed" ? "Completed" : "Start"}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const card_data = {
    id: 1,
    title: "Weekly",
    desc: "Earn for checking socials",
    bonus: "+0/540",
    card_bg: "#000",
    background: "#fff",
    color: "#000",
  };

  // Combine all approved tasks into a single array
  const approvedTasks = multiTasks
    .filter((taskGroup) => taskGroup.status === "approved")
    .flatMap((taskGroup) => taskGroup.tasks);

  return (
    <>
      {loading ? (
        <SkeletonList />
      ) : (
        <div className="dashboard-container">
          {/* Adverts Section */}
          <div className="advert-container">
            {approvedTasks.length > 0
              ? approvedTasks.map((task, index) => (
                  <div className="advert-space" key={task?.id || index}>
                    <div className="advert_space_img">
                      <img
                        src="https://www.iconeasy.com/icon/png/Application/Adobe%20CS5/ai.png"
                        alt="img"
                      />
                    </div>
                    <div className="advert_space_details">
                      <h5>{task?.title || "Untitled Task"}</h5>
                      <p style={{ color: "green" }}>{`+${
                        task?.reward || 0
                      } BP`}</p>
                      <p>{task?.description || "No description available"}</p>
                    </div>
                    <div className="advert_space_btn">
                      {task?.link ? (
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="advert_space_btn1">Open</button>
                        </a>
                      ) : (
                        <button className="advert_space_btn1" disabled>
                          No Link
                        </button>
                      )}
                      <p className="advert_space_card_count">{`${index + 1}/${
                        approvedTasks.length
                      }`}</p>
                    </div>
                  </div>
                ))
              : null}
          </div>

          {/* Cards */}
          <div>
            <div>
              <h6 style={{ color: "#FFF", padding: "8px 0px" }}>Weekly</h6>
            </div>
            <div className="weekly_Card">
              <Card card_data={filter_weekly_task} />
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
          </div>

          {/* Tab Content */}
          <div className="task-container">{renderTasks()}</div>

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
        </div>
      )}
    </>
  );
}

export default Dashboard;

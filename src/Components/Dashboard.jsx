import React, { useContext, useEffect, useState } from "react";
import "../Style/Dashboard.css";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import Card from "./Cards/Card";
import SkeletonList from "./SkeletonList/SkeletonList";
import { AppContext } from "../context/AppContext";

function Dashboard() {
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

  const openProofModal = (taskId) => {
    setSelectedTaskId(taskId);
    setProofModalOpen(true);
  };

  const handleProofFileChange = (event) => {
    setProofFile(event.target.files[0]);
  };

  const submitProof = async () => {
    if (!proofFile || !selectedTaskId) return;

    // Handle file upload logic here
    // e.g., uploading to Firebase storage and saving the proof URL

    setProofModalOpen(false);
    setProofFile(null);
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

  const handleCompleteTask = (taskId, youtubeLink) => {
    window.open(youtubeLink, "_blank");
    setCompletedTasks([...completedTasks, taskId]);
  };

  const getSingleTasks = async () => {
    setLoading(true);
    let resultArray = [];
    const q = query(collection(db, "singletasks"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      resultArray.push({ id: doc.id, ...doc.data() });
    });
    setSingleTasks(resultArray);
    setLoading(false);
  };

  const getMultiTasks = async () => {
    setLoading(true);
    let resultArray = [];
    const q = query(collection(db, "tasks"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      resultArray.push({ id: doc.id, ...doc.data() });
    });
    setMultiTasks(resultArray);
    setLoading(false);
  };

  console.log("singletask", singleTasks);

  useEffect(() => {
    getSingleTasks();
    getMultiTasks();
  }, []);

  const isTaskCompleted = (taskId) => completedTasks.includes(taskId);

  const handleStartClick = (taskId, link) => {
    handleCompleteTask(taskId, link);
    setTaskStates((prev) => ({
      ...prev,
      [taskId]: { loading: true, claimed: false },
    }));

    setTimeout(() => {
      setTaskStates((prev) => ({
        ...prev,
        [taskId]: { loading: false, claimed: true },
      }));
    }, 3000);
  };

  // Rendering the Task List
  const renderTasks = () => {
    let filteredTasks = [];
    if (activeTab === "New") {
      filteredTasks = singleTasks.filter((task) => task.status === "approved");
    } else if (activeTab === "OnChain") {
      filteredTasks = singleTasks.filter(
        (task) => task.status === "approved" && task.category === "OnChain"
      );
    } else if (activeTab === "Socials") {
      filteredTasks = singleTasks.filter(
        (task) => task.category === "Socials" && task.status === "approved"
      );
    } else if (activeTab === "Weekly") {
      filteredTasks = singleTasks.filter(
        (task) => task.category === "Weekly" && task.status === "approved"
      );
    }

    return (
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className="task-list-item">
            <i
              className={`bi ${
                platformIcons[task.platformLogo?.toLowerCase()] || defaultIcon
              }`}
            ></i>
            <div className="task-details">
              <h4 className="task-title">{task.title}</h4>
              <div style={{ display: "flex", gap: "5px" }}>
                <p
                  className="task-time"
                  style={{ color: "greenyellow", fontSize: "12px" }}
                >
                  +{task.reward} BP
                </p>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {/* Conditionally Render "Add Proof" Button */}
              {task.isProof && !taskStates[task.id]?.proofAdded && (
                <button
                  onClick={() => openProofModal(task.id)}
                  className="proof-button"
                  style={{
                    backgroundColor: "#FCC419",
                    color: "#000",
                    marginRight: "5px",
                  }}
                >
                  Add Proof
                </button>
              )}
              {/* Claim or Start Button */}
              <button
                onClick={() => handleStartClick(task.id, task.link)}
                disabled={isTaskCompleted(task.id)}
                className={`redirect-icon ${
                  isTaskCompleted(task.id) ? "task-completed" : ""
                } ${taskStates[task.id]?.claimed ? "claim-button" : ""}`}
                style={{
                  backgroundColor: taskStates[task.id]?.loading
                    ? "grey"
                    : taskStates[task.id]?.claimed
                    ? "greenyellow"
                    : "#FCC419",
                  color: "#000",
                }}
              >
                {taskStates[task.id]?.loading ? (
                  <div className="spinner"></div>
                ) : taskStates[task.id]?.claimed ? (
                  "Claim"
                ) : isTaskCompleted(task.id) ? (
                  "Task Completed"
                ) : (
                  "Start"
                )}
              </button>
            </div>
          </li>
        ))}
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
            <Card card_data={card_data} />
          </div>

          {/* Tab Navigation */}
          <div className="tabs-container">
            {categories?.map((category) => (
              <button
                className={activeTab === category.name ? "active" : ""}
                onClick={() => setActiveTab(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="task-container">{renderTasks()}</div>

          {proofModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h3>Upload Proof</h3>
                <input type="file" onChange={handleProofFileChange} />
                <button onClick={submitProof}>Submit Proof</button>
                <button onClick={() => setProofModalOpen(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Dashboard;

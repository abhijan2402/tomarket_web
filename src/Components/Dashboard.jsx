import React, { useEffect, useState } from "react";
import "../Style/Dashboard.css";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import Card from "./Cards/Card";

const tasks = [
  {
    id: 1,
    title: "Morning Run",
    description: "Go for a 5km run in the park.",
    time: "6:00 AM",
    image: "https://via.placeholder.com/150",
    youtubeLink: "https://www.youtube.com",
  },
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState("new");
  const [completedTasks, setCompletedTasks] = useState([]);
  const [dataImg, setdataImg] = useState([]);
  const [loadingTaskId, setLoadingTaskId] = useState(null); // Track task being loaded
  const [claimedTaskId, setClaimedTaskId] = useState(null); // Track task claimed

  const handleCompleteTask = (taskId, youtubeLink) => {
    window.open(youtubeLink, "_blank");
    setCompletedTasks([...completedTasks, taskId]);
  };

  const getData = async () => {
    let resultArray = [];
    const q = query(collection(db, "tasks"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      resultArray.push({ id: doc.id, ...doc.data() });
    });
    setdataImg(resultArray);
  };

  useEffect(() => {
    getData();
  }, []);

  const isTaskCompleted = (taskId) => completedTasks.includes(taskId);

  const handleStartClick = (taskId) => {
    setLoadingTaskId(taskId); // Set loading state

    // Simulate loading with a timeout
    setTimeout(() => {
      setLoadingTaskId(null); // Remove loading state
      setClaimedTaskId(taskId); // Mark task as claimable
    }, 3000); // 3 seconds delay for the spinner
  };

  // Tab Content components
  const renderNewTasks = () => (
    <ul className="task-list">
      {dataImg.map((task) => (
        <li key={task.id} className="task-list-item">
          <i className="bi bi-youtube"></i>
          <div className="task-details">
            <h4 className="task-title">
              {task.title.length > 20
                ? `${task.title.substring(0, 20)}...`
                : task.title}
            </h4>
            <p className="task-time">{"+250 BP"}</p>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => handleStartClick(task.id)}
              disabled={isTaskCompleted(task?.id)}
              className={`redirect-icon ${
                isTaskCompleted(task.id) ? "task-completed" : ""
              } ${claimedTaskId === task.id ? "claim-button" : ""}`}
              style={{
                backgroundColor:
                  loadingTaskId === task.id
                    ? "grey"
                    : claimedTaskId === task.id
                    ? "greenyellow"
                    : "#434343",
              }}
            >
              {loadingTaskId === task.id ? (
                <div className="spinner"></div>
              ) : claimedTaskId === task.id ? (
                "Claim"
              ) : isTaskCompleted(task?.id) ? (
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

  const renderCompletedTasks = () => (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-list-item">
          <i className="bi bi-youtube"></i>

          <div className="task-details">
            <h4 className="task-title">
              {task.title.length > 20
                ? `${task.title.substring(0, 20)}...`
                : task.title}
            </h4>
            <p className="task-time">+250 BP</p>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => {
                window.open(task?.link, "_blank", "noopener,noreferrer");
                handleCompleteTask(task?.id);
              }}
              className="redirect-icon"
            >
              Start
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

  const renderPendingTasks = () => (
    <ul className="task-list">
      {dataImg
        .filter((task) => !isTaskCompleted(task.id))
        .map((task) => (
          <li key={task.id} className="task-list-item">
            <i className="bi bi-youtube"></i>

            <div className="task-details">
              <h4 className="task-title">
                {task.title.length > 20
                  ? `${task.title.substring(0, 20)}...`
                  : task.title}
              </h4>
              <p className="task-time">{"+250 BP"}</p>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => handleStartClick(task.id)}
                className="redirect-icon"
              >
                Start
              </button>
            </div>
          </li>
        ))}
    </ul>
  );

  const card_data = {
    id: 1,
    title: "Weekly",
    desc: "Earn for checking socials",
    bonus: "+0/540",
    card_bg: "#000",
    background: "#fff",
    color: "#000",
  };

  return (
    <div className="dashboard-container">
      {/* Adverts Section */}
      <div className="advert-container">
        <div className="advert-space">
          <div className="advert_space_img">
            <img
              src="https://www.iconeasy.com/icon/png/Application/Adobe%20CS5/ai.png"
              alt="img"
            />
          </div>
          <div className="advert_space_details">
            <h5>ForU AI Quest</h5>
            <p>+999 BP</p>
          </div>
          <div className="advert_space_btn">
            <button className="advert_space_btn1">Open</button>
            <p className="advert_space_card_count">0/2</p>
          </div>
        </div>

        <div className="advert-space">
          <div className="advert_space_img">
            <img
              src="https://www.iconeasy.com/icon/png/Application/Adobe%20CS5/ai.png"
              alt="img"
            />
          </div>
          <div className="advert_space_details">
            <h5>ForU AI Quest</h5>
            <p>+999 BP</p>
          </div>
          <div className="advert_space_btn">
            <button className="advert_space_btn1">Open</button>
            <p className="advert_space_card_count">0/2</p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div>
        <Card card_data={card_data} />
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <button
          className={activeTab === "new" ? "active" : ""}
          onClick={() => setActiveTab("new")}
        >
          New
        </button>
        <button
          className={activeTab === "completed" ? "active" : ""}
          onClick={() => setActiveTab("completed")}
        >
          OnChain
        </button>
        <button
          className={activeTab === "pending" ? "active" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Socials
        </button>
      </div>

      {/* Tab Content */}
      <div className="task-container">
        {activeTab === "new" && renderNewTasks()}
        {activeTab === "completed" && renderCompletedTasks()}
        {activeTab === "pending" && renderPendingTasks()}
      </div>
    </div>
  );
}

export default Dashboard;

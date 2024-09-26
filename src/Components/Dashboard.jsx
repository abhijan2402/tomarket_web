import React, { useEffect, useState } from "react";
import "../Style/Dashboard.css";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";

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

  // Tab Content Renderers
  const renderNewTasks = () => (
    <ul className="task-list">
      {dataImg.map((task) => (
        <li key={task.id} className="task-list-item">
          <img
            src="https://via.placeholder.com/150"
            alt={task.title}
            className="task-image"
          />
          <div className="task-details">
            <h4 className="task-title">{task.title}</h4>
            <p className="task-description">{task.description}</p>
            <p className="task-time">
              <i className="bi bi-clock"></i> {"5:30 PM"}
            </p>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => {
                window.open(task?.link, "_blank", "noopener,noreferrer");
                handleCompleteTask(task?.id);
              }}
              disabled={isTaskCompleted(task?.id)}
              className={`redirect-icon ${
                isTaskCompleted(task.id) ? "task-completed" : ""
              }`}
            >
              {isTaskCompleted(task?.id) ? (
                <>
                  Task Completed <i className="bi bi-check-circle-fill"></i>
                </>
              ) : (
                <>
                  Start Task <i className="bi bi-arrow-right-circle-fill"></i>
                </>
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
          <img src={task.image} alt={task.title} className="task-image" />
          <div className="task-details">
            <h4 className="task-title">{task.title}</h4>
            <p className="task-description">{task.description}</p>
            <p className="task-time">
              <i className="bi bi-clock"></i> {task.time}
            </p>
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
            <img
              src="https://via.placeholder.com/150"
              alt={task.title}
              className="task-image"
            />
            <div className="task-details">
              <h4 className="task-title">{task.title}</h4>
              <p className="task-description">{task.description}</p>
              <p className="task-time">
                <i className="bi bi-clock"></i> {task.time || "5:30 PM"}
              </p>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  window.open(task?.link, "_blank", "noopener,noreferrer");
                  handleCompleteTask(task?.id);
                }}
                className="redirect-icon"
              >
                Start Task <i className="bi bi-arrow-right-circle-fill"></i>
              </button>
            </div>
          </li>
        ))}
    </ul>
  );

  return (
    <div className="dashboard-container">
      {/* Adverts Section */}
      <div className="advert-container">
        <div className="advert-space">Advert Space 1</div>

        <div className="advert-space">Advert Space 2</div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <button
          className={activeTab === "new" ? "active" : ""}
          onClick={() => setActiveTab("new")}
        >
          New Tasks
        </button>
        <button
          className={activeTab === "completed" ? "active" : ""}
          onClick={() => setActiveTab("completed")}
        >
          Completed Tasks
        </button>
        <button
          className={activeTab === "pending" ? "active" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending Tasks
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

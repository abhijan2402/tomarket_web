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
    image: "https://via.placeholder.com/150", // Replace with actual image
    youtubeLink: "https://www.youtube.com", // Replace with actual YouTube link
  },
  {
    id: 2,
    title: "Team Meeting",
    description: "Daily standup meeting with the team.",
    time: "9:30 AM",
    image: "https://via.placeholder.com/150",
    youtubeLink: "https://www.youtube.com",
  },
  {
    id: 3,
    title: "Project Work",
    description: "Focus on the frontend development of the project.",
    time: "11:00 AM",
    image: "https://via.placeholder.com/150",
    youtubeLink: "https://www.youtube.com",
  },
  {
    id: 4,
    title: "Gym Session",
    description: "Strength training session at the gym.",
    time: "5:30 PM",
    image: "https://via.placeholder.com/150",
    youtubeLink: "https://www.youtube.com",
  },
];

function Dashboard() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [dataImg, setdataImg] = useState([]);

  const handleCompleteTask = (taskId, youtubeLink) => {
    window.open(youtubeLink, "_blank"); // Open YouTube link in a new tab
    setCompletedTasks([...completedTasks, taskId]); // Mark task as completed
  };
  const getData = async () => {
    let resultArray = [];
    const q = query(collection(db, "tasks"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      resultArray.push({ id: doc.id, ...doc.data() });
    });
    console.log(resultArray, "ARRAY");
    setdataImg(resultArray);
    console.log(dataImg);
  };

  useEffect(() => {
    getData();
  }, []);

  const isTaskCompleted = (taskId) => completedTasks.includes(taskId);

  return (
    <div className="dashboard-container">
      {/* Adverts Section */}
      <div className="advert-container row">
        <div className="col-6">
          <div className="advert-space">Advert Space 1</div>
        </div>
        <div className="col-6">
          <div className="advert-space">Advert Space 2</div>
        </div>
      </div>

      <div className="task_container_main">
        {/* New Tasks Section */}
        <div className="task-section">
          <h3>New Tasks</h3>
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
                      Start Task{" "}
                      <i className="bi bi-arrow-right-circle-fill"></i>
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Recently Completed Tasks Section */}
        <div className="task-section">
          <h3>Recently Completed Tasks</h3>
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
                <button
                  onClick={() => handleCompleteTask(task.id)}
                  disabled={isTaskCompleted(task.id)}
                  className={`redirect-icon ${
                    isTaskCompleted(task.id) ? "task-completed" : ""
                  }`}
                >
                  {isTaskCompleted(task.id) ? (
                    <>
                      Task Completed <i className="bi bi-check-circle-fill"></i>
                    </>
                  ) : (
                    <>
                      Start Task{" "}
                      <i className="bi bi-arrow-right-circle-fill"></i>
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

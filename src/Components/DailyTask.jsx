import React from "react";
import { Link } from "react-router-dom";
import "../Style/DailyTask.css";

const tasks = [
  {
    id: 1,
    title: "Morning Run",
    description: "Go for a 5km run in the park.",
    time: "6:00 AM",
    image: "https://via.placeholder.com/150", // Replace with actual image
  },
  {
    id: 2,
    title: "Team Meeting",
    description: "Daily standup meeting with the team.",
    time: "9:30 AM",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    title: "Project Work",
    description: "Focus on the frontend development of the project.",
    time: "11:00 AM",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    title: "Gym Session",
    description: "Strength training session at the gym.",
    time: "5:30 PM",
    image: "https://via.placeholder.com/150",
  },
];

function DailyTask() {
  return (
    <div className="daily-task-container">
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
            <Link to={`/task/${task.id}`} className="redirect-icon">
              <i className="bi bi-arrow-right-circle-fill"></i>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DailyTask;

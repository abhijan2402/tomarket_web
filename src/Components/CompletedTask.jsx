import React, { useState } from "react";

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

function CompletedTask() {
  const [completedTasks, setCompletedTasks] = useState([]);

  const handleCompleteTask = (taskId) => {
    setCompletedTasks([...completedTasks, taskId]);
  };

  const isTaskCompleted = (taskId) => completedTasks.includes(taskId);
  return (
    <div className="daily-task-container">
      <h1>Completed Task</h1>
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
                  Start Task <i className="bi bi-arrow-right-circle-fill"></i>
                </>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompletedTask;

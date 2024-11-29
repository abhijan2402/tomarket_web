import React from "react";

const MyTask = ({ DetailedUserTasks }) => {
  console.log("d", DetailedUserTasks);

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

  return (
    <ul className="task-list">
      {DetailedUserTasks?.map((userTask) => {
        const task = userTask.taskDetails; // Access the task details
        return (
          <li key={userTask.id} className="task-list-item">
            <i
              className={`bi ${
                platformIcons[task?.platformLogo?.toLowerCase()] || defaultIcon
              }`}
            ></i>
            {/* Task details */}
            <div className="task-details">
              <h4 className="task-title">{task?.title}</h4>
              <p style={{ color: "greenyellow", fontSize: "12px" }}>
                +{task?.reward} BP
              </p>
            </div>
            {/* Buttons for task actions */}
            <div className="task-actions">
              {task?.status === "completed" ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {/* Add Proof Button */}
                    <button
                      className="add-proof-btn"
                      style={{
                        backgroundColor: "#007bff",
                        color: "#fff",
                        marginRight: "10px",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                    >
                      <i
                        class="bi bi-cloud-arrow-up"
                        style={{ fontSize: "20px" }}
                      ></i>
                    </button>

                    {/* Claim Button */}
                    <button
                      className="claim-btn"
                      style={{
                        backgroundColor: " #4caf50",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                    >
                      <i
                        class="bi bi-currency-bitcoin"
                        style={{ fontSize: "20px" }}
                      ></i>
                    </button>
                  </div>
                </>
              ) : (
                // Start Button for other statuses
                <button
                  className={`redirect-icon ${
                    task?.status === "completed" ? "disabled" : ""
                  }`}
                  disabled={task?.status === "completed"}
                  style={{
                    cursor:
                      task?.status === "completed" ? "not-allowed" : "pointer",
                  }}
                >
                  Start
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default MyTask;

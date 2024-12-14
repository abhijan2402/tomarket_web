import React from "react";
import "./Card.css";

const Card = ({ card_data, handleCompleteTask, openProofModal, userTasks }) => {
  return (
    <>
      {card_data.map((item, index) => {
        // Safely find the userTask corresponding to the current item
        const userTask = userTasks?.find((ut) => ut.TaskId === item.id);
        const showAddProof = userTask?.isProof;

        return (
          <div className="card-space" key={index}>
            <div className="card_space_details">
              <h5>{item?.title || "Untitled Task"}</h5>
              <p>+ {item?.reward || 0} BP</p>
            </div>
            <div className="card_space_btn">
              {showAddProof ? (
                <button
                  className="redirect-icons"
                  onClick={() => openProofModal(item.id)}
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
                <button
                  className={`start-redirect-icons ${
                    item.status === "completed" ? "disabled" : ""
                  }`}
                  onClick={() =>
                    item.status === "approved" &&
                    handleCompleteTask(item.id, item.link)
                  }
                  disabled={item.status === "completed"}
                  style={{
                    cursor:
                      item.status === "completed" ? "not-allowed" : "pointer",
                  }}
                >
                  {item.status === "completed" ? (
                    <i class="bi bi-check2-all"></i>
                  ) : (
                    "Start"
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Card;

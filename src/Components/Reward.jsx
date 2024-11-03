import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import CustomPopup from "./Popups/CustomPopup";
import "react-toastify/dist/ReactToastify.css";
import "../Style/Reward.css";

function Reward() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isGroupTask, setIsGroupTask] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(""); // New state to determine popup type

  const addTaskToList = (task) => {
    setTasks((prev) => [...prev, task]);
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    toast.info("Task removed");
  };

  const handleSubmitGroup = async () => {
    try {
      if (!tasks.length) {
        return toast.error("Please add tasks first");
      }

      await addDoc(collection(db, "tasks"), {
        tasks,
        createdAt: new Date(),
        createdBy: "User",
        status: "pending",
        type: "group",
      });

      setTasks([]);
      toast.success("Tasks have been submitted for review!");
    } catch (error) {
      toast.error("Error adding document: " + error.message);
    }
  };

  const handleSubmitSingle = async (task) => {
    try {
      await addDoc(collection(db, "singletasks"), {
        ...task,
        createdAt: new Date(),
        createdBy: "User",
        status: "pending",
        type: "single",
      });

      toast.success("Task added successfully!");
    } catch (error) {
      toast.error("Error adding document: " + error.message);
    }
  };

  const handleTabSwitch = (isGroup) => {
    if (isGroup === isGroupTask) {
      setShowForm(!showForm);
    } else {
      setShowForm(true);
      setIsGroupTask(isGroup);
    }
  };

  const handleShowPopup = (type) => {
    setPopupType(type);
    setShowPopup(true);
  };

  return (
    <div className="task_Container">
      <ToastContainer />
      <div className="task_form">
        {tasks.length === 0 ? null : (
          <TaskList
            tasks={tasks}
            removeTask={removeTask}
            isGroupTask={isGroupTask}
            handleSubmitGroup={handleSubmitGroup}
          />
        )}

        <div className="task_buttons">
          <div>
            <button
              onClick={() => handleTabSwitch(false)}
              className={`add-btn ${!isGroupTask && showForm ? "active" : ""}`}
            >
              <i
                className="bi bi-plus-circle"
                onClick={() => handleShowPopup("single")} // Show single task popup
              ></i>
            </button>

            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              Add Task{" "}
              <span>
                <i
                  className="bi bi-exclamation-circle-fill"
                  onClick={() => handleShowPopup("single")} // Show single task popup
                  style={{ cursor: "pointer" }}
                ></i>
              </span>
            </p>
          </div>
          <div>
            <button
              onClick={() => handleTabSwitch(true)}
              className={`add-btn ${isGroupTask && showForm ? "active" : ""}`}
            >
              <i className="bi bi-collection-fill"></i>
            </button>
            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              Group Task{" "}
              <span>
                <i
                  className="bi bi-exclamation-circle-fill"
                  onClick={() => handleShowPopup("group")} // Show group task popup
                  style={{ cursor: "pointer" }}
                ></i>
              </span>
            </p>
          </div>
        </div>

        {showForm && (
          <TaskForm
            addTaskToList={isGroupTask ? addTaskToList : handleSubmitSingle}
          />
        )}
      </div>

      {/* Custom Popup */}
      <CustomPopup show={showPopup} onClose={() => setShowPopup(false)}>
        {popupType === "single" ? (
          <>
            <h6>Add Task Information</h6>
            <p>Quickly add a personal task for individual tracking.</p>
          </>
        ) : popupType === "group" ? (
          <>
            <h6>Group Task Information</h6>
            <p>
              Create a set of tasks for collaborative projects or team efforts.
            </p>
          </>
        ) : null}
      </CustomPopup>
    </div>
  );
}

export default Reward;

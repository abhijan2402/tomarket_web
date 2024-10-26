import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import "react-toastify/dist/ReactToastify.css";
import "../Style/Reward.css";

function Reward() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isGroupTask, setIsGroupTask] = useState(false);

  const addTaskToList = (task) => {
    setTasks((prev) => [...prev, task]);
    toast.success("Task added to the list");
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
      toast.success("Group tasks added successfully!");
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

  return (
    <div className="task_Container">
      <ToastContainer />
      <div className="task_form">
        <h1>Create Task</h1>

        {/* Task list component with remove functionality */}
        {tasks.length === 0 ? null : (
          <TaskList
            tasks={tasks}
            removeTask={removeTask}
            isGroupTask={isGroupTask}
            handleSubmitGroup={handleSubmitGroup}
          />
        )}

        {/* Toggle buttons for task type */}
        <div className="task_buttons">
          <button
            onClick={() => handleTabSwitch(false)}
            className={`add-btn ${!isGroupTask && showForm ? "active" : ""}`}
          >
            <i className="bi bi-plus-circle"></i> Add Task
          </button>
          <button
            onClick={() => handleTabSwitch(true)}
            className={`add-btn ${isGroupTask && showForm ? "active" : ""}`}
          >
            <i className="bi bi-plus-circle"></i> Group Task
          </button>
        </div>

        {/* Task form (only show when needed) */}
        {showForm && (
          <TaskForm
            addTaskToList={isGroupTask ? addTaskToList : handleSubmitSingle}
          />
        )}
      </div>
    </div>
  );
}

export default Reward;

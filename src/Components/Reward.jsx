import React, { useState } from "react";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import CustomPopup from "./Popups/CustomPopup";
import "react-toastify/dist/ReactToastify.css";
import "../Style/Reward.css";
import { useAuth } from "../context/AuthContext";

function Reward() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isGroupTask, setIsGroupTask] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupMsgType, setPopupMsgType] = useState("");
  const taskCount = tasks.length;
  console.log(taskCount);

  const addTaskToList = (task) => {
    setTasks((prev) => [...prev, task]);
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    toast.info("Task removed");
  };

  // Handling Group task
  const handleSubmitGroup = async () => {
    try {
      if (!tasks.length) {
        return toast.error("Please add tasks first");
      }

      const grpTask = await addDoc(collection(db, "tasks"), {
        tasks,
        createdAt: new Date(),
        createdBy: "User",
        status: "pending",
        type: "group",
      });

      setTasks([]);

      await addDoc(collection(db, "userGroupTask"), {
        UserGroupTaskId: `UGT${Date.now()}`,
        UserId: user.uid,
        TaskId: grpTask.id,
        UserObject: {
          name: user.displayName || "John Doe",
          role: "Designer",
        },
        TotalTask: taskCount,
        NumberOfTaskCompleted: 0,
        CurrentStatus: "pending",
        isAllCompleted: false,
      });

      toast.success("Tasks have been submitted for review!");
    } catch (error) {
      toast.error("Error adding document: " + error.message);
    }
  };

  // Handle submitting a single task
  const handleSubmitSingle = async (task) => {
    try {
      if (!user) {
        return toast.error("User is not logged in");
      }

      const taskRef = await addDoc(collection(db, "singletasks"), {
        ...task,
        createdAt: new Date(),
        createdBy: user.uid,
        status: "pending",
        type: "single",
      });

      // Fetch user details from the `users` collection
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("User details not found in the database.");
      }

      const userData = userDoc.data();

      // Track User's progress in UserTasks collection
      await addDoc(collection(db, "UserTasks"), {
        UserTaskId: `UT${Date.now()}`,
        TaskId: taskRef.id,
        UserId: user.uid,
        UserObject: {
          ...userData,
        }
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
  };

  const handleShowMsgPopup = (type) => {
    setPopupMsgType(type);
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
                  onClick={() => handleShowMsgPopup("single")} // Show single task popup
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
              <i
                className="bi bi-collection-fill"
                onClick={() => handleShowPopup("group")}
              ></i>
            </button>
            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              Group Task{" "}
              <span>
                <i
                  className="bi bi-exclamation-circle-fill"
                  onClick={() => handleShowMsgPopup("group")}
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
        {popupMsgType === "single" ? (
          <>
            <h6>Add Task Information</h6>
            <p>Quickly add a personal task for individual tracking.</p>
          </>
        ) : popupMsgType === "group" ? (
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

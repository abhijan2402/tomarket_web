import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import CustomPopup from "./Popups/CustomPopup";
import "react-toastify/dist/ReactToastify.css";
import "../Style/create-task.css";
import { useAuth } from "../context/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useApp } from "../context/AppContext";

function CreateTask() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [isGroupTask, setIsGroupTask] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsgType, setPopupMsgType] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoaidng] = useState(false);
  const { setMySingleTasks, setMyGroupTasks } = useApp();

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
    setLoaidng(true);
    try {
      if (!tasks.length) {
        return toast.error("Please add tasks first");
      }

      if (!description) {
        return toast.error("Please add a description");
      }

      if (!thumbnail) {
        return toast.error("Please add a thumbnail");
      }

      const storageRef = ref(
        storage,
        `thumbnail/${thumbnail.name}-${Date.now()}`
      );
      const uploadResult = await uploadBytes(storageRef, thumbnail);
      const thumbnailUrl = await getDownloadURL(uploadResult.ref);

      await addDoc(collection(db, "tasks"), {
        tasks,
        createdAt: new Date(),
        createdBy: user.uid,
        status: "pending",
        type: "group",
        thumbnail: thumbnailUrl,
        description,
      });

      setTasks([]);
      setDescription("");
      setThumbnail(null);
      setMyGroupTasks();

      toast.success("Tasks have been submitted for review!");
    } catch (error) {
      toast.error("Error adding document: " + error.message);
      console.log(error);
    } finally {
      setLoaidng(false);
    }
  };

  // Handle submitting a single task
  const handleSubmitSingle = async (task) => {
    setLoaidng(true);
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

      setMySingleTasks();
      toast.success("Task added successfully!");
    } catch (error) {
      toast.error("Error adding document: " + error.message);
    } finally {
      setLoaidng(false);
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

      <div style={{ padding: "20px 10px 0" }}>
        <h1 style={{ textTransform: "uppercase", color: "white" }}>Task</h1>

        <h3
          style={{
            textTransform: "uppercase",
            color: "white",
            letterSpacing: 1,
          }}
        >
          Create task <span style={{ opacity: 0.4 }}> with simple system</span>
        </h3>
      </div>
      <div className="task_form">
        <div className="task_buttons">
          <div>
            <button
              onClick={() => handleTabSwitch(false)}
              className={`add-btn ${!isGroupTask && showForm ? "active" : ""}`}
            >
              <i className="bi bi-plus-circle"></i> Task
            </button>

            {/* <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              Add Task{" "}
              <span>
                <i
                  className="bi bi-exclamation-circle-fill"
                  onClick={() => handleShowMsgPopup("single")}
                  style={{ cursor: "pointer" }}
                ></i>
              </span>
            </p> */}
          </div>
          <div>
            <button
              onClick={() => handleTabSwitch(true)}
              className={`add-btn ${isGroupTask && showForm ? "active" : ""}`}
            >
              <i className="bi bi-collection-fill"></i> Group Task
            </button>
            {/* <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              Group Task{" "}
              <span>
                <i
                  className="bi bi-exclamation-circle-fill"
                  onClick={() => handleShowMsgPopup("group")}
                  style={{ cursor: "pointer" }}
                ></i>
              </span>
            </p> */}
          </div>
        </div>

        {isGroupTask && (
          <div style={{ marginTop: 15 }}>
            <div className="task_form_field">
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                id="description"
                placeholder="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="task_form_field">
              <label htmlFor="thumbnail">Thumbnail</label>
              <div className="file-upload">
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  style={{ display: "none" }}
                />
                <label htmlFor="thumbnail" className="file-upload-label">
                  {thumbnail ? thumbnail.name : "Choose File"}
                </label>
                <span className="upload-icon">
                  <i class="bi bi-upload"></i>
                </span>
              </div>
            </div>
          </div>
        )}

        {tasks.length === 0 ? null : (
          <TaskList
            loading={loading}
            tasks={tasks}
            removeTask={removeTask}
            isGroupTask={isGroupTask}
            handleSubmitGroup={handleSubmitGroup}
          />
        )}

        {showForm && (
          <TaskForm
            loading={loading}
            addTaskToList={isGroupTask ? addTaskToList : handleSubmitSingle}
            isGroupTask={isGroupTask}
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

export default CreateTask;

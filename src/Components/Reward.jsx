import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Style/Reward.css";

function Reward() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [reward, setReward] = useState("");

  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async () => {
    
    try {
      const DataResp = await addDoc(collection(db, "tasks"), {
        tasks,
        createdAt: new Date(),
        createdBy: "User",
        status: "Pending Approval",
        type: "default",
      });

      setTitle("");
      setDescription("");
      setLink("");
      setReward("");

      toast.success("Task added successfully!");
    } catch (error) {
      toast.error("Error adding document: " + error.message);
    }
  };

  const addTask = () => {
    if(!title || !description || !link || reward) {
      return toast.error("All filed is required")
    }
    setTasks((prev) => [
      ...prev,
      {
        title,
        description,
        link,
        reward,
      },
    ]);
    setTitle("");
    setDescription("");
    setLink("");
    setReward("");
    setShowForm(false);
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((task, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div className="task_Container">
      <ToastContainer />
      <div className="task_form">
        <h1>Create Task</h1>

        <div>
          {tasks?.map((task, i) => (
            <div key={i} className="task_item">
              <p>{task.title}</p>
              <div onClick={() => removeTask(i)} className="delete-icon">
                <i className="bi bi-trash"></i>
              </div>
            </div>
          ))}
        </div>
        <div className="task_buttons">
          <button onClick={() => setShowForm(true)} className="add-btn">
            <i class="bi bi-plus-circle"></i> Add
          </button>
          <button onClick={handleSubmit} className="add-btn">
            Submit
          </button>
        </div>

        {showForm ? (
          <div style={{paddingTop: 20}}>
            <div className="task_form_field">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="task_form_field">
              <label htmlFor="desc">Description</label>
              <textarea
                id="desc"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="task_form_field">
              <label htmlFor="link">Link</label>
              <input
                type="text"
                id="link"
                placeholder="Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div className="task_form_field">
              <label htmlFor="reward">Reward</label>
              <input
                type="text"
                id="reward"
                placeholder="$5"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
              />
            </div>
          
            <button onClick={addTask} style={{ marginTop: "10px" }}>
              Add
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Reward;

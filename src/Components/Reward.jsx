import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Style/Reward.css";

function Reward() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("");
  const [reward, setReward] = useState("");

  const AddTask = async () => {
    if (!title || !description || !link || type === "select") {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const DataResp = await addDoc(collection(db, "tasks"), {
        title,
        description,
        reward,
        link,
        type,
        createdAt: new Date(),
        createdBy: "User",
        status: "Pending Approval",
      });

      setTitle("");
      setDescription("");
      setLink("");
      setType("");
      setReward("");

      toast.success("Task added successfully!");
    } catch (error) {
      toast.error("Error adding document: " + error.message);
    }
  };

  return (
    <div className="task_Container">
      <ToastContainer />
      <div className="task_form">
        <h1>Create Task</h1>
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
        <div className="task_form_field">
          <label htmlFor="type">Task Category</label>
          <select
            id="type"
            name="task_type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="select">Select</option>
            <option value="OnChain">OnChain</option>
            <option value="Social">Social</option>
          </select>
        </div>

        <button onClick={AddTask} style={{ marginTop: "10px" }}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Reward;

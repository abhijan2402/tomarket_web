import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";

function TaskForm({ addTaskToList }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [reward, setReward] = useState("");
  const [category, setCategory] = useState("");
  const { categories } = useContext(AppContext);

  const handleAddTask = () => {
    if (!title || !description || !link || !reward || !category) {
      return toast.error("All fields are required");
    }

    // Send task back to parent component
    addTaskToList({
      title,
      description,
      link,
      reward,
      category,
    });

    // Reset form fields
    setTitle("");
    setDescription("");
    setLink("");
    setReward("");
    setCategory("");
  };

  return (
    <div style={{ paddingTop: 20 }}>
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
          type="number"
          id="reward"
          placeholder="$5"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
        />
      </div>
      <div className="task_form_field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories?.map((category) => (
            <option value={category.name}>{category.name}</option>
          ))}
        </select>
      </div>
      <button onClick={handleAddTask} style={{ marginTop: "10px" }}>
        Add Task
      </button>
    </div>
  );
}

export default TaskForm;

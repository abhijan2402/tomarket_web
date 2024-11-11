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
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [customLogo, setCustomLogo] = useState(null); // For custom image upload
  const { categories } = useContext(AppContext);

  const handleAddTask = () => {
    if (
      !title ||
      !description ||
      !link ||
      !reward ||
      !category ||
      !selectedPlatform
    ) {
      return toast.error("All fields are required");
    }

    // Send task back to parent component
    addTaskToList({
      title,
      description,
      link,
      reward,
      category,
      platformLogo:
        selectedPlatform === "Other" ? customLogo : selectedPlatform,
    });

    // Reset form fields
    setTitle("");
    setDescription("");
    setLink("");
    setReward("");
    setCategory("");
    setSelectedPlatform("");
    setCustomLogo(null);
  };

  const handlePlatformChange = (e) => {
    const platform = e.target.value;
    setSelectedPlatform(platform);
    if (platform !== "Other") {
      setCustomLogo(null); // Reset custom logo if not "Other"
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setCustomLogo(URL.createObjectURL(e.target.files[0]));
    }
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
          {categories?.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="task_form_field">
        <label htmlFor="platform">Task Logo</label>
        <select
          id="platform"
          value={selectedPlatform}
          onChange={handlePlatformChange}
        >
          <option value="">Select a logo</option>
          <option value="Facebook">Facebook</option>
          <option value="YouTube">YouTube</option>
          <option value="Instagram">Instagram</option>
          <option value="Twitter">Twitter</option>
          <option value="Reddit">Reddit</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {selectedPlatform === "Other" && (
        <div className="task_form_field">
          <label htmlFor="customLogo">Upload Custom Logo</label>
          <div className="file-upload">
            <input
              type="file"
              id="customLogo"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <label htmlFor="customLogo" className="file-upload-label">
              Choose File
            </label>
            <span className="upload-icon">
              <i class="bi bi-upload"></i>
            </span>
          </div>
        </div>
      )}

      <button onClick={handleAddTask} style={{ marginTop: "10px" }}>
        Add Task
      </button>
    </div>
  );
}

export default TaskForm;

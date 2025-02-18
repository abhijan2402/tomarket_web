import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function TaskForm({ addTaskToList, isGroupTask, loading }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [reward, setReward] = useState("");
  const [category, setCategory] = useState("");
  const [proof, setProof] = useState("no");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [customLogo, setCustomLogo] = useState(null);
  const [numberOfParticipants, setNumberOfParticipants] = useState(10);
  const { categories } = useContext(AppContext);

  const handleAddTask = async () => {
    if (
      title === "" ||
      link === "" ||
      reward === "" ||
      proof === "" ||
      (!isGroupTask && (description === "" || category === "")) ||
      selectedPlatform === ""
    ) {
      return toast.error("All required fields must be filled");
    }


    let platformLogo = selectedPlatform;

    if (selectedPlatform === "Other") {
      if (!customLogo) {
        return toast.error("Please upload a custom logo");
      }

      const storageRef = ref(
        storage,
        `platformLogo/${customLogo.name}-${Date.now()}`
      );
      const uploadResult = await uploadBytes(storageRef, customLogo);
      platformLogo = await getDownloadURL(uploadResult.ref);
    }

    addTaskToList({
      title,
      description,
      link,
      reward,
      category,
      proof,
      platformLogo,
      numberOfParticipants
    });

    // Reset form fields
    setTitle("");
    setDescription("");
    setLink("");
    setReward("");
    setCategory("");
    setSelectedPlatform("");
    setProof("no");
    setCustomLogo(null);
  };

  const handlePlatformChange = (e) => {
    const platform = e.target.value;
    setSelectedPlatform(platform);
    if (platform !== "Other") {
      setCustomLogo(null);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setCustomLogo(e.target.files[0]);
    }
  };

  return (
    <div style={{ paddingTop: 20 }}>
      <div className="task_form_field">
        <label htmlFor="title">Title</label>
        <input
          // style={{backgroundColor: "red"}}
          type="text"
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {!isGroupTask && (
        <div className="task_form_field">
          <label htmlFor="desc">Description</label>
          <textarea
            id="desc"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      )}

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

    

      {!isGroupTask && (
        <>
          <div className="task_form_field">
        <label htmlFor="numberOfParticipants">Number of Participants</label>
        <input
          type="number"
          id="numberOfParticipants"
          placeholder="10"
          value={numberOfParticipants}
          onChange={(e) => setNumberOfParticipants(e.target.value)}
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
        </>
        
      )}

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

      <div className="task_form_field">
        <label htmlFor="proof">Proof</label>
        <select
          id="proof"
          value={proof}
          onChange={(e) => setProof(e.target.value)}
        >
          <option value="" disabled>
            Select a proof
          </option>
          <option value="no">No</option>
          <option value="screenshot">Screenshot</option>
          <option value="link">Link</option>
        </select>
      </div>

      <button
        disabled={loading}
        onClick={handleAddTask}
        style={{
          marginTop: "10px",
          backgroundColor: "#fcc419",
          color: "black",
          marginLeft: -3,
        }}
      >
        {loading ? "Adding..." : "Add Task"}
      </button>
    </div>
  );
}

export default TaskForm;

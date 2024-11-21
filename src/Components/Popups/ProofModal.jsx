import React, { useState } from "react";
import "./ProofModal.css"

const ProofModal = ({ isOpen, onClose, onSubmit, taskId }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!file) {
      alert("Please upload a file.");
      return;
    }
    onSubmit(file, taskId); // Pass file and taskId to the parent
    setFile(null);
    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Proof</h3>
        <p>Upload your proof file for the task.</p>
        <input type="file" onChange={handleFileChange} />
        <div className="modal-actions">
          <button onClick={handleSubmit} className="btn-submit">
            Submit
          </button>
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProofModal;

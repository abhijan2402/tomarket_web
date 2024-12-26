import React from "react";

const ProofModal = ({
  proofModalOpen,
  setProofModalOpen,
  setProofLink,
  selectedTask,
  btnLoading,
  submitProof,
  handleProofFileChange,
}) => {
  if (!proofModalOpen) return null;
  return (
    <div className="modal-overlay" onClick={() => setProofModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h4
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "18px",
          }}
        >
          Upload Proof{" "}
          <span
            onClick={() => setProofModalOpen(false)}
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-x-square"></i>
          </span>
        </h4>
        {selectedTask?.proof === "link" ? (
          <input
            type="text"
            placeholder="Enter the link for proof"
            onChange={(e) => setProofLink(e.target.value)}
          />
        ) : selectedTask?.proof === "screenshot" ? (
          <input type="file" onChange={handleProofFileChange} />
        ) : (
          <p>Proof is not required</p>
        )}

        <button
          disabled={btnLoading}
          className="modal_submit_btn"
          onClick={() => submitProof(selectedTask.id)}
        >
          {btnLoading ? "Submitting..." : "Submit Proof"}
        </button>
      </div>
    </div>
  );
};

export default ProofModal;

import React from "react";

const ProofButtons = ({item, approvedLoading, rejectedLoading, rejectProofHandle, approveProofHandle}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      {item.proofUrl ? (
        <a href={item.proofUrl} target="_blank" rel="noreferrer">
          <button
            className="add-proof-btn"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              marginRight: "10px",
              border: "none",
              padding: "8px 14px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            {item.status === "claimed" ? (
              <i class="bi bi-check-all"></i>
            ) : (
              <i class="bi bi-cloud-arrow-up"></i>
            )}
          </button>
        </a>
      ) : null}

      {item?.status === "started" ? (
        <div
          className={`start-redirect-icon`}
          style={{
            color: "#fff",
            textWrap: "nowrap",
            paddingLeft: 15,
            textTransform: "capitalize",
            paddingRight: 15,
            cursor: "not-allowed",
            opacity: "0.8",
          }}
        >
          {item?.status}
        </div>
      ) : item.status === "submitted" ? (
        <>
          <button
            className="claim-btn"
            style={{
              backgroundColor: "red",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
            disabled={approvedLoading || rejectedLoading}
            onClick={rejectProofHandle}
          >
            {rejectedLoading ? (
              <div
                class="spinner-border text-light spinner-border-sm my-1"
                role="status"
              ></div>
            ) : (
              <i class="bi bi-x" style={{ fontSize: "20px" }}></i>
            )}
          </button>{" "}
          <button
            className="claim-btn"
            disabled={approvedLoading || rejectedLoading}
            style={{
              backgroundColor: " #4caf50",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
            onClick={approveProofHandle}
          >
            {approvedLoading ? (
              <div
                class="spinner-border text-light spinner-border-sm my-1"
                role="status"
              ></div>
            ) : (
              <i class="bi bi-check" style={{ fontSize: "20px" }}></i>
            )}
          </button>{" "}
        </>
      ) : item.status === "approved" ? (
        <div
          className={`start-redirect-icon`}
          style={{
            color: "#fff",
            textWrap: "nowrap",
            paddingLeft: 15,
            textTransform: "capitalize",
            paddingRight: 15,
            cursor: "not-allowed",
            opacity: "0.8",
          }}
        >
          {item?.status}
        </div>
      ) : item.status === "rejected" ? (
        <div
          className={`start-redirect-icon`}
          style={{
            color: "#fff",
            textWrap: "nowrap",
            background: "red",
            paddingLeft: 15,
            textTransform: "capitalize",
            paddingRight: 15,
            cursor: "not-allowed",
            opacity: "0.8",
          }}
        >
          {item?.status}
        </div>
      ) : null}
    </div>
  );
};

export default ProofButtons;

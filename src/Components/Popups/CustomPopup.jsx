// CustomPopup.js
import React from "react";
import "../../Style/CustomPopup.css";

function CustomPopup({ show, onClose, children }) {
  return (
    <div className={`popup ${show ? "show" : ""}`}>
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default CustomPopup;

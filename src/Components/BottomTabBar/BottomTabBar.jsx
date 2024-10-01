import React, { useState } from "react";
import "./BottomTabBar.css";
import { useNavigate } from "react-router-dom";

const BottomTabBar = () => {
  const [activeTab, setActiveTab] = useState("/"); // Default active tab
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "/") {
      navigate("/");
    } else {
      navigate(`/${tab}`);
    }
  };

  return (
    <div className="bottom-tab-bar">
      <div
        className={`tab-item ${activeTab === "/" ? "active" : ""}`}
        onClick={() => handleTabClick("/")}
      >
        <i className="bi bi-house tab-icon"></i>
        <p>Home</p>
      </div>

      <div
        className={`tab-item ${activeTab === "Earn" ? "active" : ""}`}
        onClick={() => handleTabClick("task")}
      >
        <i className="bi bi-currency-dollar tab-icon"></i>
        <p>Task</p>
      </div>

      <div
        className={`tab-item ${activeTab === "Frens" ? "active" : ""}`}
        onClick={() => handleTabClick("Frens")}
      >
        <i className="bi bi-people tab-icon"></i>
        <p>Frens</p>
      </div>

      <div
        className={`tab-item ${activeTab === "Wallet" ? "active" : ""}`}
        onClick={() => handleTabClick("Wallet")}
      >
        <i className="bi bi-wallet tab-icon"></i>
        <p>Wallet</p>
      </div>
    </div>
  );
};

export default BottomTabBar;

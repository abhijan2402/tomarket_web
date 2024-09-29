import React, { useState } from "react";
import "../Style/Wallet.css";

const tasks = [
  {
    id: 1,
    title: "Bulm points",
    description: "Go for a 5km run in the park.",
  },
  {
    id: 1,
    title: "Bulm points",
    description: "Go for a 5km run in the park.",
  },
  {
    id: 1,
    title: "Bulm points",
    description: "Go for a 5km run in the park.",
  },
];

function Wallet() {
  // State to keep track of the active tab
  const [activeTab, setActiveTab] = useState("Balance");

  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Tab Content components
  const renderNewTasks = () => (
    <ul className="wallet-task-list">
      {tasks.map((task) => (
        <li key={task.id} className="wallet-task-list-item">
          <p className="wallet_coin">
            <i class="bi bi-currency-bitcoin"></i>
          </p>
          <div className="wallet-task-details">
            <h4 className="wallet-task-title">
              {task.title.length > 20
                ? `${task.title.substring(0, 20)}...`
                : task.title}
            </h4>
            <p className="wallet-task-time">{"+250 BP"}</p>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <button className="wallet_btn"> Ready to claim</button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="wallet_header">
        <h3>Points</h3>
        <p>$0</p>
      </div>

      <div className="wallet_tab">
        {/* Tabs for Balance and History */}
        <div
          className={`tab_item ${activeTab === "Balance" ? "active" : ""}`}
          onClick={() => handleTabClick("Balance")}
        >
          Balance
        </div>
        <div
          className={`tab_item ${activeTab === "History" ? "active" : ""}`}
          onClick={() => handleTabClick("History")}
        >
          History
        </div>
      </div>

      {/* Conditional rendering of tab content */}
      <div className="tab_content">
        {activeTab === "Balance" ? (
          <div className="balance_content">
            {/* Replace this with actual Balance content */}
            {/* <p>Your current balance is $0.</p> */}
            {renderNewTasks()}
          </div>
        ) : (
          <div className="history_content">
            {/* Replace this with actual History content */}
            <p>No transaction history available.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Wallet;

import React, { useState, useEffect } from "react";
import "../Style/Wallet.css";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const tasks = [
  {
    id: 1,
    title: "Bulm points",
    description: "Go for a 5km run in the park.",
  },
  {
    id: 2,
    title: "Bulm points",
    description: "Do 10 push-ups.",
  },
];

function Wallet() {
  const { user } = useAuth();
  const [walletAmount, setWalletAmount] = useState(null);
  const [activeTab, setActiveTab] = useState("Balance");

  useEffect(() => {
    const fetchWalletAmount = async () => {
      if (user?.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setWalletAmount(userData.wallet || 0);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching wallet amount:", error);
        }
      }
    };

    fetchWalletAmount();
  }, [user]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderNewTasks = () => (
    <ul className="wallet-task-list">
      {tasks.map((task) => (
        <li key={task.id} className="wallet-task-list-item">
          <p className="wallet_coin">
            <i className="bi bi-currency-bitcoin"></i>
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
            <button className="wallet_btn">Ready to claim</button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="wallet_header">
        <h3>Points</h3>
        <p>{walletAmount !== null ? `$${walletAmount}` : "0"}</p>
      </div>

      <div className="wallet_tab">
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

      <div className="tab_content">
        {activeTab === "Balance" ? (
          <div className="balance_content">{renderNewTasks()}</div>
        ) : (
          <div className="history_content">
            <p>No transaction history available.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Wallet;

import React, { useState } from "react";
import MyTask from "../Components/MyTask";
import { useApp } from "../context/AppContext";
import "../Style/mytask.css";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import MyGroupTask from "../Components/MyGroupTask";

const MyTaskPage = () => {

  const [activeTab, setActiveTab] = useState("single_task");

  return (
    <div>
      <div className="tabs-container">
        <button
          className={activeTab === "single_task" ? "active" : ""}
          onClick={() => setActiveTab("single_task")}
          style={{ textWrap: "nowrap" }}
        >
          Single Task
        </button>

        <button
          className={activeTab === "group_task" ? "active" : ""}
          onClick={() => setActiveTab("group_task")}
          style={{ textWrap: "nowrap" }}
        >
          Group Task
        </button>

        <Link
          to="/task"
          style={{
            textWrap: "nowrap",
            marginLeft: "auto",
            color: "#000",
            padding: "8px 20px",
            backgroundColor: "#fcc419",
            borderRadius: 30,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          Create Task
        </Link>
      </div>

      {activeTab === "single_task" ? (
        <div>
          <MyTask />
        </div>
      ) : (
        <div>
          <MyGroupTask  />
          </div>
      )}
    </div>
  );
};

export default MyTaskPage;

import React, { useState } from "react";
import MyTask from "../Components/MyTask";
import { useApp } from "../context/AppContext";
import "../Style/mytask.css";
import { useAuth } from "../context/AuthContext";

const MyTaskPage = () => {
  const { mySingleStasks } = useApp();
  
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
      </div>

      {activeTab === "single_task" ? (
        <div>
          <MyTask />
        </div>
      ) : (
        <div>{/* <MyTask DetailedUserTasks={mySingleStasks} /> */}</div>
      )}
    </div>
  );
};

export default MyTaskPage;

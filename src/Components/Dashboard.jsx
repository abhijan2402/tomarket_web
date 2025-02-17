import React from "react";
import GroupTask from "./dashboard/GroupTask";
import WeeklyTask from "./dashboard/WeeklyTask";
import SingleTask from "./dashboard/SingleTask";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
       <h1 style={{ textTransform: "uppercase", color: "white" }}>Tasks</h1>

       <h3 style={{ textTransform: "uppercase", color: "white", letterSpacing: 1 }}>
          Complete tasks{" "}
          <span style={{ opacity: 0.4 }}> to earn rewards</span>
        </h3>

      <GroupTask />
      <WeeklyTask />
      <SingleTask />
    </div>
  );
};

export default Dashboard;

import React from "react";
import GroupTask from "./dashboard/GroupTask";
import WeeklyTask from "./dashboard/WeeklyTask";
import SingleTask from "./dashboard/SingleTask";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <GroupTask />
      {/* <WeeklyTask /> */}
      <SingleTask />
    </div>
  );
};

export default Dashboard;

import React from 'react';
import "../Style/Dashboard.css"

const tasks = [
  { id: 1, title: 'Pending Task', icon: 'bi-hourglass-split' },
  { id: 2, title: 'Completed Task', icon: 'bi-check-circle' },
  { id: 3, title: 'Daily Task', icon: 'bi-list-task' },
  { id: 4, title: 'Reward', icon: 'bi-trophy' },
//   { id: 5, title: 'Wallet', icon: 'bi-wallet' }
];

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="task-slider row">
        {tasks.map((task) => (
          <div key={task.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="task-card">
              <i className={`bi ${task.icon} task-icon`}></i>
              <h5 className="task-title">{task.title}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

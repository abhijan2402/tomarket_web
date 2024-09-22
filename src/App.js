import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

import Dashboard from "./Components/Dashboard";
import DailyTask from "./Components/DailyTask";
import CompletedTask from "./Components/CompletedTask";
import PendingTask from "./Components/PendingTask";
import Reward from "./Components/Reward";
import Wallet from "./Components/Wallet";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <Router>
        <div className="d-flex">
          <nav
            className="sidebar"
            style={{ backgroundColor: "#12192C", color: "#fff" }}
          >
            <div>
              <img src="" alt="Logo"></img>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <NavLink
                  to="/"
                  className="nav-link"
                  style={({ isActive }) =>
                    isActive ? { backgroundColor: "#1D263E" } : undefined
                  }
                >
                  <i className="bi bi-house-door"></i> Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/daily-task"
                  className="nav-link"
                  style={({ isActive }) =>
                    isActive ? { backgroundColor: "#1D263E", color:"#7460E5" } : undefined
                  }
                >
                  <i className="bi bi-list-task"></i> Daily Task
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/completed-task"
                  className="nav-link"
                  style={({ isActive }) =>
                    isActive ? { backgroundColor: "#1D263E" } : undefined
                  }
                >
                  <i className="bi bi-check-circle"></i> Completed Task
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/pending-task"
                  className="nav-link"
                  style={({ isActive }) =>
                    isActive ? { backgroundColor: "#1D263E" } : undefined
                  }
                >
                  <i className="bi bi-hourglass-split"></i> Pending Task
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/reward"
                  className="nav-link"
                  style={({ isActive }) =>
                    isActive ? { backgroundColor: "#1D263E" } : undefined
                  }
                >
                  <i className="bi bi-trophy"></i> Reward
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/wallet"
                  className="nav-link"
                  style={({ isActive }) =>
                    isActive ? { backgroundColor: "#1D263E" } : undefined
                  }
                >
                  <i className="bi bi-wallet"></i> Wallet
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="content flex-grow-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/daily-task" element={<DailyTask />} />
              <Route path="/completed-task" element={<CompletedTask />} />
              <Route path="/pending-task" element={<PendingTask />} />
              <Route path="/reward" element={<Reward />} />
              <Route path="/wallet" element={<Wallet />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;

import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import "./App.css";

import Dashboard from "./Components/Dashboard";
import DailyTask from "./Components/DailyTask";
import CompletedTask from "./Components/CompletedTask";
import PendingTask from "./Components/PendingTask";
import Reward from "./Components/Reward";
import Wallet from "./Components/Wallet";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div>
      <Router>
        <header className="navbar">
          <div className="logo">
            <h2 style={{ color: "#fff" }}>LOGO</h2>
          </div>
          <button className="hamburger" onClick={toggleMobileMenu}>
            ☰
          </button>
          <ul className={`nav-items ${isMobileMenuOpen ? "open" : ""}`}>
            <li>
              <NavLink to="/" className="nav-link" onClick={toggleMobileMenu}>
                Dashboard
              </NavLink>
            </li>
            {/* <li>
              <NavLink to="/daily-task" className="nav-link" onClick={toggleMobileMenu}>
                Daily Task
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink to="/completed-task" className="nav-link" onClick={toggleMobileMenu}>
                Completed Task
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink to="/pending-task" className="nav-link" onClick={toggleMobileMenu}>
                Pending Task
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="/reward"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                Reward
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wallet"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                Wallet
              </NavLink>
            </li>
          </ul>
        </header>
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/daily-task" element={<DailyTask />} />
            <Route path="/completed-task" element={<CompletedTask />} />
            <Route path="/pending-task" element={<PendingTask />} />
            <Route path="/reward" element={<Reward />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

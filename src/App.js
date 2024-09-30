import React, { useEffect, useState } from "react";
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
import BottomTabBar from "./Components/BottomTabBar/BottomTabBar";
import Fren from "./Components/Fren";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "./firebase";
import SignIn from "./Components/Auth/SignIn";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [Logo, setLogo] = useState([])
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const getData = async () => {
    let resultArray = [];
    const q = query(collection(db, "settings"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      resultArray.push({ id: doc.id, ...doc.data() });
    });
    setLogo(resultArray)
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Router>
        <header className="navbar">
          <div className="logo">
            {/* <h2 style={{ color: "#fff" }}>LOGO</h2> */}
            <img
              src={Logo[0]?.value}
              alt="Description of the image"
              width="60"
              height="60"
              style={{ objectFit: "cover", borderRadius: "5px" }} // Ensures the image covers the space without distortion
            />
          </div>
          {/* <button className="hamburger" onClick={toggleMobileMenu}>
            ☰
          </button>
          <ul className={`nav-items ${isMobileMenuOpen ? "open" : ""}`}>
            <li>
              <NavLink to="/" className="nav-link" onClick={toggleMobileMenu}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/daily-task" className="nav-link" onClick={toggleMobileMenu}>
                Daily Task
              </NavLink>
            </li>
            <li>
              <NavLink to="/completed-task" className="nav-link" onClick={toggleMobileMenu}>
                Completed Task
              </NavLink>
            </li>
            <li>
              <NavLink to="/pending-task" className="nav-link" onClick={toggleMobileMenu}>
                Pending Task
              </NavLink>
            </li>
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
          </ul> */}
        </header>
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/daily-task" element={<DailyTask />} />
            <Route path="/completed-task" element={<CompletedTask />} />
            <Route path="/pending-task" element={<PendingTask />} />
            <Route path="/earn" element={<Reward />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/frens" element={<Fren />} />
            <Route path="/Login" element={<SignIn />} />
          </Routes>
        </div>
        <BottomTabBar />
      </Router>
    </div>
  );
}

export default App;

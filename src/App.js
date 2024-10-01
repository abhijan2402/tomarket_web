import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
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
import SignUp from "./Components/Auth/SignUp";
import ForgotPassword from "./Components/Auth/ForgotPassword";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [Logo, setLogo] = useState([]);

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
    setLogo(resultArray);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Router>
      <div>
        <header className="navbar">
          <div className="logo">
            <Link to="/">
              <img
                src={Logo[0]?.value}
                alt="Description of the image"
                width="60"
                height="60"
                style={{ objectFit: "cover", borderRadius: "5px" }}
              />
            </Link>
          </div>
          <div className="header_log">
            <Link to="/Login">
              <button>Login</button>
            </Link>
          </div>
        </header>
        <AppContent />
      </div>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/daily-task" element={<DailyTask />} />
          <Route path="/completed-task" element={<CompletedTask />} />
          <Route path="/pending-task" element={<PendingTask />} />
          <Route path="/earn" element={<Reward />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/frens" element={<Fren />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
        </Routes>
      </div>

      {/* Conditionally render BottomTabBar only if not on certain routes */}
      {!["/Login", "/signup", "/forgot_password"].includes(
        location.pathname
      ) && <BottomTabBar />}
    </>
  );
}

export default App;

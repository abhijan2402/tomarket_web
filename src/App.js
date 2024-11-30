// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import Topbar from "./Components/Topbar/Topbar";
import Profile from "./Components/Profile";
import Home from "./Components/Home";
import { AuthProvider, useAuth } from "./context/AuthContext"; // import AuthProvider and useAuth
import PrivateRoute from "./Components/PrivateRoute";
import LandingPage from "./Components/LandingPage";

function App() {
  const [Logo, setLogo] = useState([]);

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
    <AuthProvider>
      <Router>
        <AppContent Logo={Logo} />
      </Router>
    </AuthProvider>
  );
}

function AppContent({ Logo }) {
  const location = useLocation();
  const { user, loading } = useAuth();

  return (
    <>
      {!loading && (
        <>
          {!["/login", "/signup", "/forgot_password"].includes(
            location.pathname.toLowerCase()
          ) && <Topbar Logo={Logo} />}

          <div className="content">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot_password" element={<ForgotPassword />} />

              <Route element={<PrivateRoute />}>
                {/* Protected Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/taskdashboard" element={<Dashboard />} />
                <Route path="/daily-task" element={<DailyTask />} />
                <Route path="/completed-task" element={<CompletedTask />} />
                <Route path="/pending-task" element={<PendingTask />} />
                <Route path="/task" element={<Reward />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/frens" element={<Fren />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Catch-all route for unauthenticated users */}
              <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/home" />} />
            </Routes>
          </div>

          {!["/login", "/signup", "/forgot_password", "/home"].includes(
            location.pathname.toLowerCase()
          ) && <BottomTabBar />}
        </>
      )}
    </>
  );
}

export default App;

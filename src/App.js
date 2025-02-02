// src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./App.css";

import Dashboard from "./Components/Dashboard";
import DailyTask from "./Components/DailyTask";
import CompletedTask from "./Components/CompletedTask";
import PendingTask from "./Components/PendingTask";
import CreateTask from "./Components/create-task";
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
import { useAuth } from "./context/AuthContext"; // import AuthProvider and useAuth
import PrivateRoute from "./Components/PrivateRoute";
import LandingPage from "./Components/LandingPage";
import MyTaskPage from "./pages/MyTaskPage";
import HowItsWork from "./pages/HowItsWork";
import Support from "./pages/Support";
import SupportQuery from "./pages/SupportQuery";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const { user, loading } = useAuth();

  return (
    <>
      {!loading && (
        <>
          <div className="content">
            <Routes>
              <Route path="/" element={<PrivateRoute />}>
                <Route path="" element={<LandingPage />} />
               
                <Route path="taskdashboard" element={<Dashboard />} />
                <Route path="my-task" element={<MyTaskPage />} />
                <Route path="daily-task" element={<DailyTask />} />
                <Route path="completed-task" element={<CompletedTask />} />
                <Route path="pending-task" element={<PendingTask />} />
                <Route path="task" element={<CreateTask />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="frens" element={<Fren />} />
                <Route path="how-its-work" element={<HowItsWork />} />
                <Route path="profile" element={<Profile />} />
                <Route path="support" element={<Support />} />
                <Route path="support/query" element={<SupportQuery />} />
              </Route>

              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot_password" element={<ForgotPassword />} />

              <Route
                path="*"
                element={user ? <Navigate to="/" /> : <Navigate to="/" />}
              />
            </Routes>
          </div>
        </>
      )}
    </>
  );
}

export default App;

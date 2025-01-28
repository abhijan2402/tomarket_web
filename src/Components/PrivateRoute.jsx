// src/components/PrivateRoute.js
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Topbar from "./Topbar/Topbar";
import BottomTabBar from "./BottomTabBar/BottomTabBar";
import { AppContext } from "../context/AppContext";

const PrivateRoute = () => {
  const { user } = useAuth();
  const { Logo } = useContext(AppContext);
  return user ? (
    <>
      <Topbar Logo={Logo} />
      <Outlet />
      <BottomTabBar />
    </>
  ) : (
    <Navigate to="/home" replace />
  );
};

export default PrivateRoute;

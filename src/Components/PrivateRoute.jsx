// src/components/PrivateRoute.js
import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Topbar from "./Topbar/Topbar";
import BottomTabBar from "./BottomTabBar/BottomTabBar";
import { AppContext } from "../context/AppContext";

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const { Logo } = useContext(AppContext);
  const { pathname } = useLocation();

  console.log(user)
  console.log(loading)

  return user ? (
      <>
        {pathname !== "/" && <Topbar Logo={Logo} />}

        <Outlet />
      <BottomTabBar />
    </>
  ) : (
    <Navigate to="/home" replace />
  );
};

export default PrivateRoute;

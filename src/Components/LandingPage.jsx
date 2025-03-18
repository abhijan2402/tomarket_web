import React, { useContext, useEffect, useState } from "react";
import "../Style/LandingPage.css";
import { AppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/helper";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const { Logo } = useContext(AppContext);
  const { user } = useAuth();

  const [walletAmount, setWalletAmount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const fetchWalletAmount = async () => {
      if (user?.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setWalletAmount(userData.wallet || 0);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching wallet amount:", error);
        }
      }
    };

    const fetchCounts = async () => {
      try {
        // Count total users and referrals
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        let userCount = 0;
        let referralCount = 0;

        usersSnapshot.forEach((doc) => {
          userCount++;
          const userData = doc.data();
          if (userData.referredBy) {
            referralCount++;
          }
        });

        setTotalUsers(userCount);
        setTotalReferrals(referralCount);

        // Count total tasks
        const tasksCollection = collection(db, "tasks");
        const singleTasksCollection = collection(db, "singletasks");

        const tasksSnapshot = await getDocs(tasksCollection);
        const singleTasksSnapshot = await getDocs(singleTasksCollection);

        setTotalTasks(tasksSnapshot.size + singleTasksSnapshot.size);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchWalletAmount();
    fetchCounts();
  }, [user]);

  return (
    <div className="video-container">
      <div className="l-header">
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <div className="l-avtar">{getInitials(user?.name)}</div>

          <div>
            <p style={{ color: "gray" }}>Total balance</p>
            <h3>{walletAmount} points</h3>
          </div>
        </div>

        <div>
          <img
            style={{ width: 50, margin: "auto" }}
            src={Logo[0]?.value}
            alt=""
          />
        </div>
      </div>

      <div className="l-stats">
        <div className="l-stats-box">
          <div className="l-stat-number">{totalUsers}</div>
          <p>Total Users</p>
        </div>

        <div className="l-stats-box">
          <div className="l-stat-number">{totalTasks}</div>
          <p>Total Tasks Created</p>
        </div>

        <div className="l-stats-box">
          <div className="l-stat-number">{totalReferrals}</div>
          <p>Total Referrals</p>
        </div>
      </div>

      <div
        style={{
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div className="l-card-2">
          <h2>Complete Your Tasks</h2>
          <p>
            Earn points by completing tasks and redeem exciting rewards. Explore
            the task dashboard to get started!
          </p>

          <Link to="/taskdashboard">
            <button>Start Task</button>
          </Link>
        </div>

        <div className="l-card">
          <h2>Refer Your Friends</h2>
          <p>
            Invite your friends and earn referral bonuses when they join and
            complete tasks. Spread the word and grow together!
          </p>

          <Link to="/Frens">
            <button>How It Works?</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

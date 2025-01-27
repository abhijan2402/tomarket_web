import React from "react";
import "../Style/Fren.css";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Fren = () => {
  const { user } = useAuth();

  const handleInviteClick = () => {
    const referralLink = `https://tomarket-web.cineview.tech/signup?referralCode=${user?.referralCode}`;
    const referralText = `Join Blum using my referral code (${user?.referralCode}) and earn rewards!`;

    // Check if the Web Share API is available
    if (navigator.share) {
      navigator
        .share({
          title: "Invite a friend to Blum!",
          text: referralText,
          url: referralLink,
        })
        .then(() => console.log("Referral link shared successfully!"))
        .catch((error) => console.error("Error sharing referral link:", error));
    } else {
      // Fallback: Copy the referral text with the referral link to clipboard
      const fallbackText = `${referralText}\nSign up here: ${referralLink}`;
      navigator.clipboard
        .writeText(fallbackText)
        .then(() => alert("Referral text and link copied to clipboard!"))
        .catch((error) => console.error("Error copying referral link:", error));
    }
  };

  return (
    <>
      <div className="invite_fren">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            marginTop: 20,
            gap: 12,
            marginBottom: 20,
          }}
        >
          <i style={{ fontSize: 30 }} className="bi bi-people-fill"></i>
          <i
            style={{ fontSize: 20, color: "#fff" }}
            class="bi bi-arrow-right"
          ></i>
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              width: 30,
              height: 30,
              borderRadius: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <i
              style={{ fontSize: 20, color: "white" }}
              class="bi bi-currency-dollar"
            ></i>
          </div>
        </div>

        <h1>Invite frens. Earn points</h1>
        <p className="invite_desc">
          Spread the crypto among friends, let them join to-market and earn % of
          their farmed points.
        </p>

        <div className="invite_score">
          <div className="invite_score_item">
            <h3>Score</h3>
            <h2>10%</h2>
            <p>of farmed by frens</p>
          </div>

          <div className="invite_score_item">
            <h3>Score</h3>
            <h2>2.5%</h2>
            <p>from their refs</p>
          </div>
        </div>

        <Link to="/how-its-work" className="how_it_works">
          <div style={{ fontSize: 30 }}>📖</div>
          <div>
            <h3>How it works</h3>
            <p>Referral program rules</p>
          </div>

          <i
            style={{ fontSize: 20, color: "#fff", marginLeft: "auto" }}
            class="bi bi-chevron-right"
          ></i>
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          position: "fixed",
          bottom: 0,
          backgroundColor: "#000",
          paddingLeft: 5,
          paddingRight: 15,
          paddingBottom: 60,
        }}
      >
        <div className="invite_btn" onClick={handleInviteClick}>
          Invite a fren
        </div>
      </div>
    </>
  );
};

export default Fren;

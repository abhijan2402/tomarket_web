import React from "react";
import "../Style/Fren.css";
import { useAuth } from "../context/AuthContext";

const Fren = () => {
  const { user } = useAuth();

  const handleInviteClick = () => {
    const referralLink = `http://localhost:3000/signup?referralCode=${user?.referralCode}`;
    const referralText = `Join Blum using my referral code (${user?.referralCode}) and earn rewards!`;

    // Check if the Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: "Invite a friend to Blum!",
        text: referralText,
        url: referralLink,
      })
        .then(() => console.log("Referral link shared successfully!"))
        .catch((error) => console.error("Error sharing referral link:", error));
    } else {
      // Fallback: Copy the referral text with the referral link to clipboard
      const fallbackText = `${referralText}\nSign up here: ${referralLink}`;
      navigator.clipboard.writeText(fallbackText)
        .then(() => alert("Referral text and link copied to clipboard!"))
        .catch((error) => console.error("Error copying referral link:", error));
    }
  };

  return (
    <>
      <div className="invite_fren">
        <i className="bi bi-people-fill"></i>
        <h1>Invite frens. Earn points</h1>

        <div style={{ color: "#fff", textAlign: "center" }}>
          <p style={{ opacity: 0.8, fontSize: 20, marginBottom: 10 }}>Referral Code</p>
          <h2>{user?.referralCode}</h2>
        </div>
      </div>
      <div className="invite_working">
        <h6>How it works</h6>

        {/* How it Works Timeline */}
        <div className="timeline">
          <div className="timeline_item">
            <div className="timeline_dot"></div>
            <div className="timeline_content">
              <strong>Share your invitation link</strong>
              <p>Get a 🎟️ play pass for each fren</p>
            </div>
          </div>

          <div className="timeline_item">
            <div className="timeline_dot"></div>
            <div className="timeline_content">
              <strong>Your friends join Blum</strong>
              <p>And start farming points</p>
            </div>
          </div>

          <div className="timeline_item">
            <div className="timeline_dot"></div>
            <div className="timeline_content">
              <strong>Score 10% from buddies</strong>
              <p>Plus an extra 2.5% from their referrals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="invite_btn" onClick={handleInviteClick}>
        Invite a fren
      </div>
    </>
  );
};

export default Fren;

import React, { useContext, useState } from "react";
import "../Style/Fren.css";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Fren = () => {
  const { user } = useAuth();
  const { refferalPoint } = useContext(AppContext);
  const [isCopied, setIsCopied] = useState(false); // State to track copy action

  const referralLink = `https://tomarket-web.cineview.tech/signup?referralCode=${user?.referralCode}`;

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        setIsCopied(true); // Set copied state to true
        setTimeout(() => setIsCopied(false), 2000); // Reset state after 2 seconds
      })
      .catch((error) =>
        console.error("Error copying referral link:", error)
      );
  };

  const handleInviteClick = () => {
    const referralText = `Join Blum using my referral code (${user?.referralCode}) and earn rewards!`;

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
        <h1 style={{ marginTop: 30, marginBottom: 20 }}>
          Your Invitation Link
        </h1>

        <div className="invite_link">
          <p>{referralLink.slice(0, 23)}...</p>

          <div style={{ display: "flex" }}>
            <button onClick={handleCopyClick}>
              {isCopied ? (
                <i className="bi bi-clipboard-check-fill"></i>
              ) : (
                <i className="bi bi-copy"></i>
              )}
            </button>
            <button
              onClick={handleInviteClick}
              style={{ backgroundColor: "#fab005" }}
            >
              <i className="bi bi-box-arrow-up-right"></i>
            </button>
          </div>
        </div>

        <div className="invite_fren_stats">
          <div className="invite_fren_stats_item">
            <h2>{user?.referralCount || 0}</h2>
            <p>Friends Invited</p>
          </div>

          <div className="invite_fren_stats_item">
            <h2>{user?.points || 0}</h2>
            <p>DOGS Rewards</p>
          </div>
        </div>

        <h1 style={{ marginTop: 20, marginBottom: 20 }}>Invitation Reward</h1>

        <div className="invite_fren_reward">
          <div>
            <div className="invite_fren_reward_icon">🐶</div>
          </div>

          <h3>
            Receive {refferalPoint || 0} DOGS for every referral that makes a
            claim.
          </h3>
        </div>

        <div className="hr" />

        <div className="invite_fren_reward">
          <div>
            <div className="invite_fren_reward_icon">
              <i className="bi bi-graph-up-arrow"></i>
            </div>
          </div>

          <h3>
            Receive 100 AIGO Tokens for every invite.{" "}
            <i className="bi bi-info-circle"></i>
          </h3>
        </div>

        <div className="hr" />

        <div className="invite_fren_reward">
          <div>
            <div className="invite_fren_reward_icon">
              <i className="bi bi-triangle-half"></i>
            </div>
          </div>

          <h3>
            Additional Working Capital from every friend that makes a claim.{" "}
            <i className="bi bi-info-circle"></i>
          </h3>
        </div>

        <div className="hr" />

        <div className="invite_fren_reward">
          <div>
            <div className="invite_fren_reward_icon">
              <i className="bi bi-triangle-half"></i>
            </div>
          </div>

          <h3>Receive 50% of friend's contract value as commission.</h3>
        </div>
      </div>
    </>
  );
};

export default Fren;

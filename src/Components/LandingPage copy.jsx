import React from "react";
import "../Style/LandingPage.css"; // Import your CSS file
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="video-container">
      <video autoPlay muted loop playsInline className="background-video">
        <source src="galaxy.mp4" type="video/mp4" />
        {/* Add fallback content if the video does not load */}
        Your browser does not support the video tag.
      </video>
      <div className="overlay-text">
        <h1>Unlock Rewards with Simple Social Media Tasks</h1>
        <p>
          Engage, Earn, and Grow – Complete tasks across platforms like YouTube,
          Instagram, TikTok, and more.
        </p>
        <button
          className="call-to-action-btn"
          onClick={() => navigate("/taskdashboard")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;

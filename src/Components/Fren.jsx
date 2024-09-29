import React from "react";
import "../Style/Fren.css";

const Fren = () => {
  return (
    <>
      <div className="invite_fren">
        <i className="bi bi-people-fill"></i>
        <h1>Invite frens. Earn points</h1>
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
      
      <div className="invite_btn">
        Invite a fren
      </div>
    </>
  );
};

export default Fren;

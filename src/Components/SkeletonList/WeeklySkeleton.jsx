import React from "react";
import "../../Style/Dashboard.css";
import "../../Style/Skeleton.css";

function WeeklySkeleton() {
  return (
    <>
      <div className="weekly_Card skeleton-weekly-card mt-2">
        {[...Array(3)].map((_, index) => (
          <div className="skeleton-card-space" key={index}>
            <div className="skeleton-details">
              <div className="skeleton skeleton-avatar"></div>
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-reward"></div>
              </div>
            </div>
            <div>
              <div className="skeleton skeleton-btn"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default WeeklySkeleton;

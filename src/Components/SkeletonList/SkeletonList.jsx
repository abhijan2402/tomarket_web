import React from "react";
import "../../Style/Skeleton.css";

const SkeletonList = () => {
  return (
    <div className="skeleton-container">
      {Array(8)
        .fill()
        .map((_, index) => (
          <div key={index} className="skeleton-list-item ">
            <div>
              <div>
              <div className="skeleton-avatar skeleton"></div>
              </div>
            </div>
            <div className="skeleton-text">
              <div className="skeleton-line full skeleton"></div>
              <div className="skeleton-line short skeleton"></div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SkeletonList;

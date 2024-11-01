import React from 'react';
import '../../Style/Skeleton.css';

const SkeletonList = () => {
  return (
    <div className="skeleton-container">
      {Array(8).fill().map((_, index) => (
        <div key={index} className="skeleton-list-item">
          <div>
          <div className="skeleton-avatar"></div>
          </div>
          <div className="skeleton-text">
            <div className="skeleton-line full"></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonList;

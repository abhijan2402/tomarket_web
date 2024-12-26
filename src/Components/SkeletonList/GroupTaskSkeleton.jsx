import React from "react";
import "../../Style/Dashboard.css";
import "../../Style/Skeleton.css";

function GroupTaskSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="advert-space card m-2 p-3 skeleton" key={index}>
          <div className="advert_space_img skeleton"></div>
          <div className="advert_space_details card-body">
            <h5 className="skeleton"></h5>
            <p className="skeleton"></p>
          </div>
          <div className="advert_space_btn d-flex justify-content-between align-items-center">
            <button className="advert_space_btn1 skeleton"></button>
            <p className="advert_space_card_count skeleton"></p>
          </div>
        </div>
      ))}
    </>
  );
}

export default GroupTaskSkeleton;

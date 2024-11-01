import React from "react";
import "./Card.css";

const Card = ({ title, card_data }) => {
  return (
    <>
      <div className="card-space">
        <div className="card_space_details">
          <h5>{card_data?.title}</h5>
          <p>+ {card_data?.reward} BP</p>
        </div>
        <div className="card_space_btn">
          <button className="card_space_btn1">Open</button>
          <p className="card_space_card_count">
            0/{card_data?.tasks?.length || 0}
          </p>
        </div>
      </div>
    </>
  );
};

export default Card;

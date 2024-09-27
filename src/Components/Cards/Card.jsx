import React from "react";
import "./Card.css"

const Card = ({ title,card_data }) => {
  return (
    <>
    <h3 className="card_title">{card_data.title}</h3>
    <div className="card-space">
      <div className="card_space_details">
        <h5>{card_data.desc}</h5>
        <p>{card_data.bonus} BP</p>
      </div>
      <div className="card_space_btn">
        <button className="card_space_btn1" style={{backgroundColor:card_data.background, color:card_data.color}}>Open</button>
        <p className="card_space_card_count">0/2</p>
      </div>
    </div>
    </>
  );
};

export default Card;

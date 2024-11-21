import React from "react";
import "./Card.css";

const Card = ({ card_data }) => {
  return (
    <>
      {card_data.map((item, index) => (
        <div className="card-space" key={index}>
          <div className="card_space_details">
            <h5>{item?.title}</h5>
            <p>+ {item?.reward} BP</p>
          </div>
          <div className="card_space_btn">
            <button className="card_space_btn1">Open</button>
            <p className="card_space_card_count">
              {item?.tasks?.length || 0}/{item?.tasks?.length || 0}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Card;

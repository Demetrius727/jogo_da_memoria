import React from "react";

const Card = ({ card, onClick }) => {
  return (
    <div
      className={`card ${card.isFlipped ? "flipped" : ""}`}
      onClick={() => onClick(card)}
    >
      {card.isFlipped ? <img src={card.image} alt={card.value} /> : "?"}
    </div>
  );
};

export default Card;

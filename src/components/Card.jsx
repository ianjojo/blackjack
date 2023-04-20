import React from "react";
import styled from "styled-components";
import { Card } from "deck-of-cards";

const StyledCard = styled.img`
  height: 150px;
  margin: 10px;
`;

const CardComp = ({ card }) => {
  const { rank, suit } = card;
  const image = new Card(rank, suit).getImageUrl();
  return <StyledCard src={image} alt={`${rank} of ${suit}`} />;
};

export default CardComp;

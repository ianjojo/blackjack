import React from "react";
import styled from "styled-components";
import CardComp from "./Card";

const StyledHand = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Hand = ({ cards }) => {
  return (
    <StyledHand>
      {cards.map((card, index) => (
        <Card key={index} card={card} />
      ))}
    </StyledHand>
  );
};

export default Hand;

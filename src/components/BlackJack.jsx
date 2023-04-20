import React, { useState } from "react";

const CARD_VALUES = {
  ACE: 11,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
  JACK: 10,
  QUEEN: 10,
  KING: 10,
};

const SUITS = ["HEARTS", "DIAMONDS", "SPADES", "CLUBS"];

const generateDeck = () => {
  let deck = [];

  for (let i = 0; i < SUITS.length; i++) {
    for (let card in CARD_VALUES) {
      deck.push({ value: card, suit: SUITS[i] });
    }
  }

  return shuffleDeck(deck);
};

const shuffleDeck = (deck) => {
  let shuffledDeck = [...deck];

  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }

  return shuffledDeck;
};

const getHandValue = (hand) => {
  let value = hand.reduce((total, card) => total + CARD_VALUES[card.value], 0);

  if (value > 21 && hand.some((card) => card.value === "ACE")) {
    value -= 10;
  }

  return value;
};

const initialDeck = generateDeck();
const initialPlayerHand = [initialDeck.pop(), initialDeck.pop()];
const initialDealerHand = [initialDeck.pop()];

const BlackJack = () => {
  const [deck, setDeck] = useState(initialDeck);
  const [playerHand, setPlayerHand] = useState(initialPlayerHand);
  const [dealerHand, setDealerHand] = useState(initialDealerHand);
  const [isGameOver, setIsGameOver] = useState(false);

  const playerHandValue = getHandValue(playerHand);
  const dealerHandValue = getHandValue(dealerHand);

  const hit = () => {
    if (isGameOver) return;

    const newCard = deck.pop();

    setPlayerHand([...playerHand, newCard]);

    if (getHandValue([...playerHand, newCard]) > 21) {
      setIsGameOver(true);
    }
  };

  const stand = () => {
    if (isGameOver) return;

    const delay = 1000;
    let i = 0;

    const drawCard = () => {
      if (i < 4 && dealerHandValue < 17) {
        const newCard = deck.pop();
        setDealerHand([...dealerHand, newCard]);
        i++;
        setTimeout(drawCard, delay);
      } else {
        setIsGameOver(true);
      }
    };

    drawCard();
  };

  return (
    <div>
      <div>
        Player Hand:{" "}
        {playerHand.map((card) => `${card.value} of ${card.suit}`).join(", ")}
      </div>
      <div>
        Dealer Hand:{" "}
        {isGameOver
          ? dealerHand.map((card) => `${card.value} of ${card.suit}`).join(", ")
          : `${dealerHand[0].value} of ${dealerHand[0].suit}`}
      </div>
      <div>Player Hand Value: {playerHandValue}</div>
      <div>Dealer Hand Value: {isGameOver ? dealerHandValue : "?"}</div>
      <button onClick={hit}>Hit</button>
      <button onClick={stand}>Stand</button>
      {isGameOver && (
        <div>
          {playerHandValue > 21
            ? "You Lose"
            : dealerHandValue > 21
            ? "You Win"
            : playerHandValue > dealerHandValue
            ? "You Win"
            : "You Lose"}
        </div>
      )}
    </div>
  );
};

export default BlackJack;

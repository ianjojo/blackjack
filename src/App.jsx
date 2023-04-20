import React, { useEffect, useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerCount, setPlayerCount] = useState(0);
  const [dealerCount, setDealerCount] = useState(0);
  const [wallet, setWallet] = useState(100);
  const [currentBet, setCurrentBet] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const placeBet = (e) => {
    const value = parseInt(e.currentTarget.getAttribute("data-value"));

    if (value > wallet) {
      alert("You don't have enough money");
    } else {
      setCurrentBet(Number(value));
      setWallet(wallet - value);

      setGameStarted(true);
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const generateDeck = () => {
    const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
    const suits = ["♦", "♣", "♥", "♠"];
    const deck = [];
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < suits.length; j++) {
        deck.push({ number: cards[i], suit: suits[j], isFirst: false });
      }
    }
    return deck;
  };
  const endGame = () => {
    const dealerFinalHand = [...dealerHand];
    dealerFinalHand[0].isFirst = false;
    setDealerHand(dealerFinalHand);
    setGameStarted(false);
    if (playerCount > 21) {
      setMessage("You lose");

      if (wallet < 0) {
        setWallet(0);
        setMessage("You are out of money");
      }
    } else if (dealerCount > 21) {
      setMessage("You win");
      setWallet(wallet + currentBet + currentBet);
      if (wallet < 0) {
        setWallet(0);
        setMessage("You are out of money");
      }
    } else if (playerCount > dealerCount) {
      setMessage("You win");
      setWallet(wallet + currentBet + currentBet);
      if (wallet < 0) {
        setWallet(0);
        setMessage("You are out of money");
      }
    } else if (playerCount < dealerCount) {
      setMessage("You lose");

      if (wallet < 0) {
        setWallet(0);
        setMessage("You are out of money");
      }
    } else {
      setMessage("Draw");
    }
  };
  const hit = () => {
    if (dealerCount < 17) {
      const dealerCard1 = getRandomCard(deck);
      const dealerNewHand = [...dealerHand, dealerCard1.randomCard];
      setDealerHand(dealerNewHand);
    }
    const playerCard1 = getRandomCard(deck);
    const playerNewHand = [playerCard1.randomCard, ...playerHand];
    setPlayerHand(playerNewHand);

    setDeck(playerCard1.updatedDeck);
  };
  const stand = () => {
    if (dealerCount < 17) {
      const dealerCard1 = getRandomCard(deck);
      const dealerNewHand = [...dealerHand, dealerCard1.randomCard];
      setDealerHand(dealerNewHand);

      setDeck(dealerCard1.updatedDeck);
    } else {
      endGame();
    }
  };

  useEffect(() => {
    if (gameOver) {
      endGame();

      return;
    }
  }, [gameOver]);

  const calculateScore = (hand) => {
    let score = 0;
    let numAces = 0;

    for (let card of hand) {
      // Get the value of the card (Ace is worth 1 by default)
      let value = 0;

      if (isNaN(card.number)) {
        // Face cards and 10
        if (["J", "Q", "K"].includes(card.number)) {
          value = 10;
        } else if (card.number === "A") {
          value = 1;
          numAces++;
        }
      } else {
        value = Number(card.number);
      }

      score += value;
    }

    // Handle Aces
    while (numAces > 0 && score + 10 <= 21) {
      score += 10;
      numAces--;
    }

    return score;
  };

  const PlayerHand = ({ cards }) => {
    return (
      <div className='player-hand flex justify-center items-center'>
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <div
              className='card border border-solid rounded-lg h-32   w-20 shadow-lg bg-white mx-1 my-2'
              key={index}
            >
              <div className={`card-${card.suit.toLowerCase()}`}>
                {card.number} {card.suit}
              </div>
            </div>
          ))
        ) : (
          <div className='no-cards'></div>
        )}
      </div>
    );
  };
  const DealerHand = ({ cards }) => {
    return (
      <div className='player-hand flex justify-center items-center'>
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <div
              className={` ${
                card.isFirst ? "bg-blue-300" : "bg-white"
              } card border border-solid rounded-lg h-32   w-20 shadow-lg  mx-1 my-2`}
              key={index}
            >
              <div
                className={`${
                  card.isFirst ? "hidden" : ""
                } card-${card.suit.toLowerCase()} ${
                  card.suit === "♦" || card.suit === "♥"
                    ? "text-red-700"
                    : "card"
                }`}
              >
                {card.number} {card.suit}
              </div>
            </div>
          ))
        ) : (
          <div className='no-cards'></div>
        )}
      </div>
    );
  };

  const shuffleDeck = (deck) => {
    // Make a copy of the original deck to avoid modifying it directly
    const newDeck = [...deck];

    // Shuffle the deck using the Fisher-Yates algorithm
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    // Return the shuffled deck
    return newDeck;
  };

  const dealCards = (deck) => {
    const playerCard1 = getRandomCard(deck);

    const dealerCard1 = getRandomCard(deck);
    const playerCard2 = getRandomCard(deck);

    const dealerCard2 = getRandomCard(deck);

    const playerStartingHand = [playerCard1.randomCard, playerCard2.randomCard];
    const dealerStartingHand = [dealerCard1.randomCard, dealerCard2.randomCard];
    dealerStartingHand[0].isFirst = true;

    setDeck(dealerCard2.updatedDeck);
    setPlayerHand(playerStartingHand);
    setDealerHand(dealerStartingHand);
  };

  const startNewGame = (type) => {
    setMessage("");
    setGameStarted(true);
    setGameOver(false);
    const deck = generateDeck();
    const shuffledDeck = shuffleDeck(deck);

    setDeck(shuffledDeck);

    dealCards(deck);
  };

  const getRandomCard = (deck) => {
    const updatedDeck = deck;
    const randomIndex = Math.floor(Math.random() * updatedDeck.length);
    const randomCard = updatedDeck[randomIndex];
    updatedDeck.splice(randomIndex, 1);
    return { randomCard, updatedDeck };
  };

  const Card = ({ number, suit }) => {
    const combo = number ? `${number}${suit}` : null;
    const color = suit === "♦" || suit === "♥" ? "text-red-400" : "card";

    return (
      <td>
        <div className={color}>{combo}</div>
      </td>
    );
  };

  useEffect(() => {
    let currentPlayerScore = calculateScore(playerHand);
    setPlayerCount(currentPlayerScore);
    let currentDealerScore = calculateScore(dealerHand);
    setDealerCount(currentDealerScore);
    if (currentPlayerScore > 21) {
      setGameOver(true);
      setMessage("You busted!");
    } else if (currentDealerScore > 21) {
      setGameOver(true);
      setMessage("Dealer busted!");
      setWallet(wallet + currentBet * 2);
    } else if (playerHand.length === 2 && currentPlayerScore === 21) {
      setGameOver(true);
      setMessage("You got blackjack!");
      setWallet(wallet + currentBet * 2);
    } else if (dealerHand.length === 2 && currentDealerScore === 21) {
      setGameOver(true);
      setMessage("Dealer got blackjack!");
    } else if (currentPlayerScore === 21 && currentDealerScore === 21) {
      setGameOver(true);
      setMessage("Push!");
      setWallet(wallet + currentBet);
    } else if (currentPlayerScore === 21 && currentDealerScore !== 21) {
      setGameOver(true);
      setMessage("You got blackjack!");
      setWallet(wallet + currentBet * 2);
    } else if (currentDealerScore === 21 && currentPlayerScore !== 21) {
      setGameOver(true);
      setMessage("Dealer got blackjack!");
    }
  }, [playerHand, dealerHand, gameOver]);
  return (
    <div className='flex flex-col justify-center items-center'>
      <h2 className='text-2xl'>Blackjack!</h2>
      <p>
        by{" "}
        <a href='https://ianjojo.dev' className='underline' target='_blank'>
          ianjojo
        </a>
      </p>
      <div className='cardbox flex flex-col items-center space-evenly relative w-[90%] lg:h-[28rem] bg-gradient-to-br from-green-200 to-green-600 bg-cover bg-blur rounded-lg p-4 mt-4'>
        <p className='absolute -top-1 lg:top-0'>Dealer</p>
        <p className='absolute -bottom-0 lg:bottom-2'>Your Hand</p>
        <div className='w-full h-[2px] bg-black/20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'></div>
        <div className='flex flex-col justify-evenly h-full'>
          <div className='dealer-hand flex-col justify-center items-center'>
            <DealerHand cards={dealerHand} />
          </div>
          <div className='dealer-hand flex-col justify-center items-center'>
            <PlayerHand cards={playerHand} />
          </div>
        </div>
      </div>

      {/* CHIPS */}

      {gameStarted && !gameOver && (
        <div className='scores flex flex-col lg:flex-row justify-evenly  p-2 lg:p-6 items-center bg-violet-200 mt-4 w-[90%] rounded-xl'>
          <div
            className='flex flex-col justify-center w-full lg:w-[30%] items-center
          '
          >
            <p>Current hand score: {playerCount}</p>
            <p>Your wallet: {wallet}</p>
          </div>
          <div className='flex justify-center my-2'>
            <button
              className='bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 active:from-yellow-600 active:to-yellow-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out mx-4'
              onClick={hit}
            >
              hit
            </button>
            <button
              className='bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 active:from-yellow-600 active:to-yellow-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out'
              onClick={stand}
            >
              stay
            </button>
          </div>

          <div className='flex flex-row items-center justify-center space-x-4 '>
            <div
              className='relative rounded-full border-4 border-gray-400 w-16 h-16 flex items-center justify-center cursor-pointer transition duration-200 transform-gpu hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 '
              data-value='1'
              onClick={placeBet}
            >
              <div className='absolute inset-0 flex items-center justify-center'>
                <p className='text-white font-bold text-sm'>1</p>
              </div>
              <div className='rounded-full bg-red-500 w-10 h-10'></div>
            </div>
            <div
              className='relative rounded-full border-4 border-gray-400 w-16 h-16 flex items-center justify-center cursor-pointer transition duration-200 transform-gpu hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
              data-value='5'
              onClick={placeBet}
            >
              <div className='absolute inset-0 flex items-center justify-center'>
                <p className='text-white font-bold text-sm'>5</p>
              </div>
              <div className='rounded-full bg-blue-500 w-10 h-10'></div>
            </div>
            <div
              className='relative rounded-full border-4 border-gray-400 w-16 h-16 flex items-center justify-center cursor-pointer transition duration-200 transform-gpu hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
              data-value='10'
              onClick={placeBet}
            >
              <div className='absolute inset-0 flex items-center justify-center'>
                <p className='text-white font-bold text-sm'>10</p>
              </div>
              <div className='rounded-full bg-green-500 w-10 h-10'></div>
            </div>
            <div
              className='relative rounded-full border-4 border-gray-400 w-16 h-16 flex items-center justify-center cursor-pointer transition duration-200 transform-gpu hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
              data-value='25'
              onClick={placeBet}
            >
              <div className='absolute inset-0 flex items-center justify-center'>
                <p className='text-white font-bold text-sm'>25</p>
              </div>
              <div className='rounded-full bg-yellow-500 w-10 h-10'></div>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={startNewGame}
        disabled={gameStarted}
        className={`${
          gameStarted ? "hidden" : ""
        } mt-4 bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 active:from-yellow-600 active:to-yellow-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out`}
      >
        {!gameStarted ? "New Game" : "Deal again"}
      </button>
      {/* <p>Dealer: {dealerCount}</p> */}

      {/* <div className='buttons'>
        <button
          onClick={() => {
            startNewGame();
          }}
        >
          New Game
        </button>
        <button
          onClick={() => {
            hit();
          }}
        >
          Hit
        </button>
        <button
          onClick={() => {
            stand();
          }}
        >
          Stand
        </button>
      </div>

      <p>Wallet: ${wallet}</p>
      {!currentBet ? (
        <div className='input-bet'>
          <form>
            <input type='text' name='bet' placeholder='' value={inputValue} />
          </form>
          <button
            onClick={() => {
              placeBet();
            }}
          >
            Place Bet
          </button>
        </div>
      ) : null}
      {gameOver ? (
        <div className='buttons'>
          <button
            onClick={() => {
              startNewGame("continue");
            }}
          >
            Continue
          </button>
        </div>
      ) : null}
      <p>Your Hand ({player.count})</p>
      <table className='cards'>
        <tr>
          {player.cards.map((card, i) => {
            return <Card key={i} number={card.number} suit={card.suit} />;
          })}
        </tr>
      </table>

      <p>Dealer's Hand ({dealer.count})</p>
      <table className='cards'>
        <tr>
          {this.state.dealer.cards.map((card, i) => {
            return <Card key={i} number={card.number} suit={card.suit} />;
          })}
        </tr>
      </table> */}

      <p>{message}</p>
    </div>
  );
};

export default App;
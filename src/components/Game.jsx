import { useState } from "react";
import Board from "./Board";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

const generateCards = () => {
  const images = import.meta.glob("../assets/*.png", { eager: true });

  const imageMap = new Map(
    Object.entries(images).map(([path, module]) => {
      const fileName = path.split("/").pop().replace(".png", "");
      return [fileName, module.default];
    })
  );

  const cards = Array.from(imageMap, ([value, image]) => ({
    value,
    isFlipped: false,
    image,
  }));

  const duplicatedCards = shuffleArray(
    cards.concat(cards).map((card, index) => ({ ...card, id: index }))
  );

  return duplicatedCards;
};

const Game = () => {
  const [cards, setCards] = useState(generateCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const playerChances = 6;
  const [chances, setChances] = useState(6);
  const result = cards.filter((card) => card.isFlipped).length;

  const handleCardClick = (clickedCard) => {
    if (chances === 0) return;
    if (flippedCards.length === 2) return;

    const newCards = cards.map((card) => {
      return card.id === clickedCard.id ? { ...card, isFlipped: true } : card;
    });

    setCards(newCards);

    setFlippedCards([...flippedCards, clickedCard]);

    if (flippedCards.length === 1) {
      setTimeout(() => {
        const [firstCard] = flippedCards;

        if (firstCard.value !== clickedCard.value) {
          const resetCards = cards.map((card) => {
            return card.id === firstCard.id || card.id === clickedCard.id
              ? { ...card, isFlipped: false }
              : card;
          });

          setCards(resetCards);
          setChances((prev) => prev - 1);
        }

        setFlippedCards([]);
      }, 600);
    }
  };

  const resetGame = () => {
    setChances(playerChances);
    setFlippedCards([]);
    setCards(generateCards());
  };

  return (
    <div className="game">
      <Board cards={cards} onCardClick={handleCardClick} />
      {chances === 0 ? (
        <p>Suas chances Acabaram!</p>
      ) : result === cards.length ? (
        <h2>Parabéns você ganhou</h2>
      ) : (
        <p>Você possui {chances} tentativas</p>
      )}
      <button className="btn" onClick={resetGame}>
        Reiniciar o Jogo
      </button>
    </div>
  );
};

export default Game;

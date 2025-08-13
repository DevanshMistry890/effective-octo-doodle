import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Game1.css';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const Game1: React.FC = () => {
  const { updateGameStats } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

  useEffect(() => {
    if (gameWon) {
      updateGameStats('game1', 'Memory Game');
    }
  }, [gameWon, updateGameStats]);

  const initializeGame = () => {
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
    setGameStarted(true);
    
    // Don't update stats when starting - only when completing
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || cards[cardId].isMatched || cards[cardId].isFlipped) {
      return;
    }

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards[firstId];
      const secondCard = newCards[secondId];

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        newCards[firstId].isMatched = true;
        newCards[secondId].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);

        // Check if game is won
        if (newCards.every(card => card.isMatched)) {
          setGameWon(true);
          // Update game stats when game is won
          updateGameStats('game1', 'Memory Game');
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.id === firstId || card.id === secondId 
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCards([]);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>🧠 Memory Game</h1>
        <p>Find matching pairs of cards. Test your memory!</p>
      </div>

      {!gameStarted ? (
        <div className="game-start">
          <button onClick={initializeGame} className="start-button">
            Start New Game
          </button>
        </div>
      ) : (
        <>
          <div className="game-info">
            <div className="info-item">
              <span>Moves:</span>
              <span className="info-value">{moves}</span>
            </div>
            <div className="info-item">
              <span>Pairs Found:</span>
              <span className="info-value">
                {cards.filter(card => card.isMatched).length / 2}
              </span>
            </div>
          </div>

          <div className="game-board">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                onClick={() => handleCardClick(card.id)}
              >
                <div className="card-inner">
                  <div className="card-front">❓</div>
                  <div className="card-back">{card.emoji}</div>
                </div>
              </div>
            ))}
          </div>

          {gameWon && (
            <div className="game-won">
              <h2>🎉 Congratulations!</h2>
              <p>You completed the Memory Game in {moves} moves!</p>
              <button onClick={resetGame} className="play-again-button">
                Play Again
              </button>
            </div>
          )}

          <div className="game-controls">
            <button onClick={resetGame} className="reset-button">
              New Game
            </button>
          </div>
        </>
      )}

      {/* Developer comment */}
      <div className="developer-comment">
        <p>Memory Game Component</p>
      </div>
    </div>
  );
};

export default Game1;

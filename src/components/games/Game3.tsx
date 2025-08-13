import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Game3.css';

interface Position {
  x: number;
  y: number;
}

const Game3: React.FC = () => {
  const { updateGameStats } = useAuth();
  const [snake, setSnake] = useState<Position[]>([]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(150);
  const [gameStarted, setGameStarted] = useState(false);

  const BOARD_SIZE = 20;

  // Update game stats when game is over
  useEffect(() => {
    if (gameOver) {
      updateGameStats('game3', 'Snake Game');
    }
  }, [gameOver, updateGameStats]);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    };
    setFood(newFood);
  }, []);

  const moveSnake = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y = (head.y - 1 + BOARD_SIZE) % BOARD_SIZE;
          break;
        case 'DOWN':
          head.y = (head.y + 1) % BOARD_SIZE;
          break;
        case 'LEFT':
          head.x = (head.x - 1 + BOARD_SIZE) % BOARD_SIZE;
          break;
        case 'RIGHT':
          head.x = (head.x + 1) % BOARD_SIZE;
          break;
        default:
          break;
      }

      // Check collision with self
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        generateFood();
        // Increase speed every 50 points
        if (score > 0 && score % 50 === 0) {
          setGameSpeed(prev => Math.max(50, prev - 10));
        }
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameStarted, gameOver, direction, food, score, generateFood]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, gameSpeed]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, direction]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setGameSpeed(150);
    setGameStarted(true);
    
    // Don't update stats when starting - only when completing
  };

  const resetGame = () => {
    setGameStarted(false);
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setGameSpeed(150);
  };

  const renderBoard = () => {
    const board = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;
        const isHead = snake[0]?.x === x && snake[0]?.y === y;

        let className = 'board-cell';
        if (isSnake) className += isHead ? ' snake-head' : ' snake-body';
        if (isFood) className += ' food';

        board.push(
          <div
            key={`${x}-${y}`}
            className={className}
            style={{
              gridColumn: x + 1,
              gridRow: y + 1
            }}
          />
        );
      }
    }
    return board;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>🐍 Snake Game</h1>
        <p>Use arrow keys to control the snake. Eat food to grow and score points!</p>
      </div>

      {!gameStarted ? (
        <div className="game-start">
          <div className="game-instructions">
            <h3>How to Play:</h3>
            <ul>
              <li>Use arrow keys to control the snake</li>
              <li>Eat the red food to grow and score points</li>
              <li>Avoid hitting yourself</li>
              <li>Snake can pass through walls</li>
            </ul>
          </div>
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="game-info">
            <div className="info-item">
              <span>Score:</span>
              <span className="info-value">{score}</span>
            </div>
            <div className="info-item">
              <span>Length:</span>
              <span className="info-value">{snake.length}</span>
            </div>
            <div className="info-item">
              <span>Speed:</span>
              <span className="info-value">{Math.round(1000 / gameSpeed)}</span>
            </div>
          </div>

          <div className="game-board-container">
            <div 
              className="game-board"
              style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`
              }}
            >
              {renderBoard()}
            </div>
          </div>

          {gameOver && (
            <div className="game-over">
              <h2>💀 Game Over!</h2>
              <p>Final Score: {score}</p>
              <p>Snake Length: {snake.length}</p>
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
        <p>Snake Game Component</p>
      </div>
    </div>
  );
};

export default Game3;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Game4.css';

const Game4: React.FC = () => {
  const { updateGameStats } = useAuth();
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Update game stats when game is won
  useEffect(() => {
    if (gameWon) {
      updateGameStats('game4', 'Puzzle Game');
    }
  }, [gameWon, updateGameStats]);

  const BOARD_SIZE = 3;
  const TOTAL_TILES = BOARD_SIZE * BOARD_SIZE;

  useEffect(() => {
    let interval: number;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const initializeGame = () => {
    const newTiles = Array.from({ length: TOTAL_TILES - 1 }, (_, i) => i + 1);
    newTiles.push(0); // 0 represents the empty space
    
    // Shuffle tiles
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }
    
    setTiles(newTiles);
    setMoves(0);
    setGameWon(false);
    setTimeElapsed(0);
    setTimerRunning(true);
    setGameStarted(true);
    
    // Don't update stats when starting - only when completing
  };

  const isSolvable = (tiles: number[]): boolean => {
    let inversions = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i] !== 0 && tiles[j] !== 0 && tiles[i] > tiles[j]) {
          inversions++;
        }
      }
    }
    
    // For 3x3 puzzle, it's solvable if inversions are even
    return inversions % 2 === 0;
  };

  const canMoveTile = (index: number): boolean => {
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const emptyRow = Math.floor(emptyIndex / BOARD_SIZE);
    const emptyCol = emptyIndex % BOARD_SIZE;
    
    // Can move if tile is adjacent to empty space
    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const moveTile = (index: number) => {
    if (!canMoveTile(index) || !gameStarted || gameWon) return;

    const emptyIndex = tiles.indexOf(0);
    const newTiles = [...tiles];
    
    // Swap tile with empty space
    [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
    
    setTiles(newTiles);
    setMoves(prev => prev + 1);
    
    // Check if puzzle is solved
    if (newTiles.every((tile, i) => tile === (i === TOTAL_TILES - 1 ? 0 : i + 1))) {
      setGameWon(true);
      setTimerRunning(false);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setTiles([]);
    setMoves(0);
    setGameWon(false);
    setTimeElapsed(0);
    setTimerRunning(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderTile = (value: number, index: number) => {
    if (value === 0) {
      return (
        <div key={index} className="tile empty" />
      );
    }

    return (
      <button
        key={index}
        className={`tile ${canMoveTile(index) ? 'movable' : ''}`}
        onClick={() => moveTile(index)}
        disabled={!canMoveTile(index)}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>🧩 Sliding Puzzle</h1>
        <p>Arrange the numbers in order by sliding tiles into the empty space!</p>
      </div>

      {!gameStarted ? (
        <div className="game-start">
          <div className="game-instructions">
            <h3>How to Play:</h3>
            <ul>
              <li>Click on tiles adjacent to the empty space to move them</li>
              <li>Arrange numbers 1-8 in order with empty space at bottom right</li>
              <li>Try to solve it in as few moves as possible</li>
              <li>Timer tracks how long you take to solve</li>
            </ul>
          </div>
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
              <span>Time:</span>
              <span className="info-value">{formatTime(timeElapsed)}</span>
            </div>
            <div className="info-item">
              <span>Status:</span>
              <span className="info-value">{gameWon ? 'Solved!' : 'Playing'}</span>
            </div>
          </div>

          <div className="puzzle-container">
            <div 
              className="puzzle-board"
              style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`
              }}
            >
              {tiles.map((tile, index) => renderTile(tile, index))}
            </div>
          </div>

          {gameWon && (
            <div className="game-won">
              <h2>🎉 Puzzle Solved!</h2>
              <p>Completed in {moves} moves</p>
              <p>Time: {formatTime(timeElapsed)}</p>
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
        <p>Puzzle Game Component</p>
      </div>
    </div>
  );
};

export default Game4;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Game2.css';

type Player = 'X' | 'O' | null;

const Game2: React.FC = () => {
  const { updateGameStats } = useAuth();
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<Player>(null);
  const [gameMode, setGameMode] = useState<'player' | 'ai'>('ai');

  // Update game stats when game is won
  useEffect(() => {
    if (winner && winner !== 'draw') {
      updateGameStats('game2', 'Tic Tac Toe');
    }
  }, [winner, updateGameStats]);

  const calculateWinner = (squares: Player[]): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (squares: Player[]): boolean => {
    return squares.every(square => square !== null);
  };

  const getBestMove = (squares: Player[]): number => {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        const score = minimax(squares, 0, false);
        squares[i] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const minimax = (squares: Player[], depth: number, isMaximizing: boolean): number => {
    const winner = calculateWinner(squares);
    
    if (winner === 'O') return 1;
    if (winner === 'X') return -1;
    if (isBoardFull(squares)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          const score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          const score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const handleClick = (i: number) => {
    if (board[i] || winner || !gameStarted) return;

    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    setXIsNext(false);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner('draw');
      return;
    }

    // AI move
    if (gameMode === 'ai' && !newWinner) {
      setTimeout(() => {
        const aiMove = getBestMove(newBoard);
        if (aiMove !== -1) {
          newBoard[aiMove] = 'O';
          setBoard([...newBoard]);
          setXIsNext(true);

          const aiWinner = calculateWinner(newBoard);
          if (aiWinner) {
            setWinner(aiWinner);
          } else if (isBoardFull(newBoard)) {
            setWinner('draw');
          }
        }
      }, 500);
    }
  };

  const startGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setGameStarted(true);
    
    // Don't update stats when starting - only when completing
  };

  const resetGame = () => {
    setGameStarted(false);
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };

  const renderSquare = (i: number) => (
    <button
      key={i}
      className={`square ${board[i] ? 'filled' : ''}`}
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </button>
  );

  const getStatus = () => {
    if (winner === 'X') return '🎉 You win!';
    if (winner === 'O') return '🤖 AI wins!';
    if (winner === 'draw') return '🤝 It\'s a draw!';
    if (!gameStarted) return 'Choose game mode and start playing!';
    return `Next player: ${xIsNext ? 'You (X)' : 'AI (O)'}`;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>⭕ Tic Tac Toe</h1>
        <p>Play against the AI or another player!</p>
      </div>

      {!gameStarted ? (
        <div className="game-setup">
          <div className="mode-selection">
            <h3>Select Game Mode:</h3>
            <div className="mode-buttons">
              <button
                className={`mode-btn ${gameMode === 'ai' ? 'active' : ''}`}
                onClick={() => setGameMode('ai')}
              >
                🧠 vs AI
              </button>
              <button
                className={`mode-btn ${gameMode === 'player' ? 'active' : ''}`}
                onClick={() => setGameMode('player')}
              >
                👥 vs Player
              </button>
            </div>
          </div>
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="game-status">
            <h2>{getStatus()}</h2>
          </div>

          <div className="game-board">
            <div className="board-row">
              {renderSquare(0)}
              {renderSquare(1)}
              {renderSquare(2)}
            </div>
            <div className="board-row">
              {renderSquare(3)}
              {renderSquare(4)}
              {renderSquare(5)}
            </div>
            <div className="board-row">
              {renderSquare(6)}
              {renderSquare(7)}
              {renderSquare(8)}
            </div>
          </div>

          <div className="game-controls">
            <button onClick={resetGame} className="reset-button">
              New Game
            </button>
          </div>
        </>
      )}

      {/* Developer comment */}
      <div className="developer-comment">
        <p>Tic Tac Toe Component</p>
      </div>
    </div>
  );
};

export default Game2;

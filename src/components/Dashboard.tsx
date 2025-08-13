import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, gameStats } = useAuth();

  const games = [
    { id: 'game1', name: 'Memory Game', path: '/game1', description: 'Test your memory with this classic card matching game', icon: '🧠' },
    { id: 'game2', name: 'Tic Tac Toe', path: '/game2', description: 'Play the classic X and O game against the computer', icon: '⭕' },
    { id: 'game3', name: 'Snake Game', path: '/game3', description: 'Control the snake and eat food to grow longer', icon: '🐍' },
    { id: 'game4', name: 'Puzzle Game', path: '/game4', description: 'Solve sliding puzzles to arrange numbers in order', icon: '🧩' }
  ];

  const getGameStats = (gameId: string) => {
    return gameStats.find(stat => stat.gameId === gameId);
  };

  const totalGamesPlayed = gameStats.reduce((total, stat) => total + stat.timesPlayed, 0);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🎮 Welcome to GameHub, {user?.username}!</h1>
        <p className="dashboard-subtitle">Your gaming dashboard and statistics</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Games Played</h3>
          <p className="stat-number">{totalGamesPlayed}</p>
        </div>
        <div className="stat-card">
          <h3>Games Available</h3>
          <p className="stat-number">{games.length}</p>
        </div>
        <div className="stat-card">
          <h3>Member Since</h3>
          <p className="stat-number">Today</p>
        </div>
      </div>
      
      <div className="games-section">
        <h2>🎯 Available Games</h2>
        <div className="games-grid">
          {games.map((game) => {
            const stats = getGameStats(game.id);
            return (
              <div key={game.id} className="game-card">
                <div className="game-icon">{game.icon}</div>
                <h3>{game.name}</h3>
                <p>{game.description}</p>
                <div className="game-stats">
                  <span>Played: {stats ? stats.timesPlayed : 0} times</span>
                  {stats?.lastPlayed && (
                    <span>Last: {new Date(stats.lastPlayed).toLocaleDateString()}</span>
                  )}
                </div>
                <Link to={game.path} className="play-button">
                  {stats ? 'Play Again' : 'Start Playing'}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="recent-activity">
        <h2>📊 Recent Activity</h2>
        {gameStats.length > 0 ? (
          <div className="activity-list">
            {gameStats
              .sort((a, b) => new Date(b.lastPlayed || 0).getTime() - new Date(a.lastPlayed || 0).getTime())
              .slice(0, 5)
              .map((stat, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-game">{stat.gameName}</span>
                  <span className="activity-time">
                    {new Date(stat.lastPlayed || 0).toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="no-activity">No games played yet. Start playing to see your activity!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

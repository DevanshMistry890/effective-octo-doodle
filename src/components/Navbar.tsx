import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          🎮 GameHub
        </Link>
        
        <div className="nav-menu">
          {user ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link to="/game1" className={`nav-link ${isActive('/game1') ? 'active' : ''}`}>
                Memory Game
              </Link>
              <Link to="/game2" className={`nav-link ${isActive('/game2') ? 'active' : ''}`}>
                Tic Tac Toe
              </Link>
              <Link to="/game3" className={`nav-link ${isActive('/game3') ? 'active' : ''}`}>
                Snake Game
              </Link>
              <Link to="/game4" className={`nav-link ${isActive('/game4') ? 'active' : ''}`}>
                Puzzle Game
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                Login
              </Link>
              <Link to="/signup" className={`nav-link ${isActive('/signup') ? 'active' : ''}`}>
                Sign Up
              </Link>
            </>
          )}
        </div>
        
        {user && (
          <div className="user-section">
            <span className="username">Welcome, {user.username}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

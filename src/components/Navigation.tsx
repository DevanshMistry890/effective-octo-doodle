import { Link } from 'react-router-dom';

const Navigation = () => {

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <h2>MovieInfo</h2>
        </Link>
        
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/watched" className="nav-link">Watched</Link>
          </li>
          <li>
            <Link to="/want-to-watch" className="nav-link">Want to Watch</Link>
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default Navigation;
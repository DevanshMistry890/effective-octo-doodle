import { Link } from 'react-router-dom';
import tmdbApi from '../services/tmdbApi';
import localStorageService from '../services/localStorage';

const MovieCard = ({ movie, onMovieUpdate, showRemoveButtons = false }) => {
  const isWatched = localStorageService.isMovieWatched(movie.id);
  const isInWantToWatch = localStorageService.isMovieInWantToWatch(movie.id);

  const handleMarkWatched = (e) => {
    e.preventDefault();
    const success = localStorageService.addToWatched(movie);
    if (success && onMovieUpdate) {
      onMovieUpdate();
    }
  };

  const handleAddToWantToWatch = (e) => {
    e.preventDefault();
    const success = localStorageService.addToWantToWatch(movie);
    if (success && onMovieUpdate) {
      onMovieUpdate();
    }
  };

  const handleRemoveFromWatched = (e) => {
    e.preventDefault();
    const success = localStorageService.removeFromWatched(movie.id);
    if (success && onMovieUpdate) {
      onMovieUpdate();
    }
  };

  const handleRemoveFromWantToWatch = (e) => {
    e.preventDefault();
    const success = localStorageService.removeFromWantToWatch(movie.id);
    if (success && onMovieUpdate) {
      onMovieUpdate();
    }
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.getFullYear();
  };

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-link">
        <div className="movie-poster">
          {movie.poster_path ? (
            <img
              src={tmdbApi.getImageUrl(movie.poster_path)}
              alt={movie.title}
              loading="lazy"
            />
          ) : (
            <div className="no-poster">
              <span>No Image</span>
            </div>
          )}
          <div className="movie-rating">
            <span>★ {formatRating(movie.vote_average)}</span>
          </div>
        </div>
      </Link>
      
      <div className="movie-info">
        <Link to={`/movie/${movie.id}`} className="movie-link">
          <h3 className="movie-title">{movie.title}</h3>
        </Link>
        <p className="movie-year">{formatDate(movie.release_date)}</p>
        <p className="movie-overview">
          {movie.overview ? 
            (movie.overview.length > 120 ? 
              `${movie.overview.substring(0, 120)}...` : 
              movie.overview
            ) : 
            'No description available.'
          }
        </p>
        
        <div className="movie-actions">
          {showRemoveButtons ? (
            <>
              {isWatched && (
                <button 
                  className="btn btn-remove"
                  onClick={handleRemoveFromWatched}
                >
                  Remove from Watched
                </button>
              )}
              {isInWantToWatch && (
                <button 
                  className="btn btn-remove"
                  onClick={handleRemoveFromWantToWatch}
                >
                  Remove from Want to Watch
                </button>
              )}
            </>
          ) : (
            <>
              {!isWatched && !isInWantToWatch && (
                <>
                  <button 
                    className="btn btn-primary"
                    onClick={handleMarkWatched}
                  >
                    Mark as Watched
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleAddToWantToWatch}
                  >
                    Add to Want to Watch
                  </button>
                </>
              )}
              {isWatched && (
                <span className="status-badge watched">Watched</span>
              )}
              {isInWantToWatch && (
                <span className="status-badge want-to-watch">Want to Watch</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tmdbApi from '../services/tmdbApi';
import localStorageService from '../services/localStorage';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const movieData = await tmdbApi.getMovieDetails(id);
      setMovie(movieData);
    } catch (err) {
      setError('Failed to fetch movie details. Please try again.');
      console.error('Error fetching movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkWatched = () => {
    const success = localStorageService.addToWatched(movie);
    if (success) {
      setMovie(prev => ({ ...prev })); // Force re-render
    }
  };

  const handleAddToWantToWatch = () => {
    const success = localStorageService.addToWantToWatch(movie);
    if (success) {
      setMovie(prev => ({ ...prev })); // Force re-render
    }
  };

  const handleRemoveFromWatched = () => {
    const success = localStorageService.removeFromWatched(movie.id);
    if (success) {
      setMovie(prev => ({ ...prev })); // Force re-render
    }
  };

  const handleRemoveFromWantToWatch = () => {
    const success = localStorageService.removeFromWantToWatch(movie.id);
    if (success) {
      setMovie(prev => ({ ...prev })); // Force re-render
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="movie-details-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-details-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-container">
        <div className="no-results">
          <h3>Movie not found</h3>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isWatched = localStorageService.isMovieWatched(movie.id);
  const isInWantToWatch = localStorageService.isMovieInWantToWatch(movie.id);

  return (
    <div className="movie-details-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="movie-details">
        <div className="movie-poster-large">
          {movie.poster_path ? (
            <img
              src={tmdbApi.getImageUrl(movie.poster_path, 'w780')}
              alt={movie.title}
            />
          ) : (
            <div className="no-poster-large">
              <span>No Image</span>
            </div>
          )}
        </div>

        <div className="movie-info-detailed">
          <h1 className="movie-title-large">{movie.title}</h1>
          
          {movie.tagline && (
            <p className="movie-tagline">"{movie.tagline}"</p>
          )}

          <div className="movie-meta">
            <span className="rating">★ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
            <span className="separator">•</span>
            <span>{formatDate(movie.release_date)}</span>
            <span className="separator">•</span>
            <span>{formatRuntime(movie.runtime)}</span>
          </div>

          <div className="movie-genres">
            {movie.genres?.map((genre) => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>

          <div className="movie-actions-detailed">
            {!isWatched && !isInWantToWatch && (
              <>
                <button className="btn btn-primary" onClick={handleMarkWatched}>
                  Mark as Watched
                </button>
                <button className="btn btn-secondary" onClick={handleAddToWantToWatch}>
                  Add to Want to Watch
                </button>
              </>
            )}
            {isWatched && (
              <div className="status-section">
                <span className="status-badge watched">Watched</span>
                <button className="btn btn-remove" onClick={handleRemoveFromWatched}>
                  Remove from Watched
                </button>
              </div>
            )}
            {isInWantToWatch && (
              <div className="status-section">
                <span className="status-badge want-to-watch">Want to Watch</span>
                <button className="btn btn-remove" onClick={handleRemoveFromWantToWatch}>
                  Remove from Want to Watch
                </button>
              </div>
            )}
          </div>

          <div className="movie-overview-detailed">
            <h3>Overview</h3>
            <p>{movie.overview || 'No overview available.'}</p>
          </div>

          <div className="movie-details-grid">
            <div className="detail-item">
              <strong>Release Date:</strong>
              <span>{formatDate(movie.release_date)}</span>
            </div>
            <div className="detail-item">
              <strong>Runtime:</strong>
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
            <div className="detail-item">
              <strong>Budget:</strong>
              <span>{formatCurrency(movie.budget)}</span>
            </div>
            <div className="detail-item">
              <strong>Revenue:</strong>
              <span>{formatCurrency(movie.revenue)}</span>
            </div>
            <div className="detail-item">
              <strong>Status:</strong>
              <span>{movie.status || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <strong>Original Language:</strong>
              <span>{movie.original_language?.toUpperCase() || 'N/A'}</span>
            </div>
          </div>

          {movie.production_companies && movie.production_companies.length > 0 && (
            <div className="production-companies">
              <h3>Production Companies</h3>
              <div className="companies-list">
                {movie.production_companies.map((company) => (
                  <span key={company.id} className="company-tag">
                    {company.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
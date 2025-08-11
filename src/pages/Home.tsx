import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import tmdbApi from '../services/tmdbApi';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('popular');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchMovies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, page]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;
      
      switch (category) {
        case 'popular':
          response = await tmdbApi.getPopularMovies(page);
          break;
        case 'top_rated':
          response = await tmdbApi.getTopRatedMovies(page);
          break;
        case 'now_playing':
          response = await tmdbApi.getNowPlayingMovies(page);
          break;
        case 'upcoming':
          response = await tmdbApi.getUpcomingMovies(page);
          break;
        default:
          response = await tmdbApi.getPopularMovies(page);
      }
      
      if (page === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      
      setTotalPages(response.total_pages || 0);
    } catch (err) {
      setError('Failed to fetch movies. Please check your API key and try again.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    setMovies([]);
    setTotalPages(0);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleMovieUpdate = () => {
    // Force re-render to update button states
    setMovies(prev => [...prev]);
  };

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchMovies} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Discover Movies</h1>
        <p>Find your next favorite movie</p>
      </div>

      <div className="category-tabs">
        <button
          className={`tab-button ${category === 'popular' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('popular')}
        >
          Popular
        </button>
        <button
          className={`tab-button ${category === 'top_rated' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('top_rated')}
        >
          Top Rated
        </button>
        <button
          className={`tab-button ${category === 'now_playing' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('now_playing')}
        >
          Now Playing
        </button>
        <button
          className={`tab-button ${category === 'upcoming' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('upcoming')}
        >
          Upcoming
        </button>
      </div>

      {loading && movies.length === 0 ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading movies...</p>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onMovieUpdate={handleMovieUpdate}
              />
            ))}
          </div>

          {movies.length > 0 && !tmdbApi.shouldUseMockData() && page < totalPages && (
            <div className="load-more">
              <button
                onClick={handleLoadMore}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}

      {movies.length === 0 && !loading && !error && (
        <div className="no-results">
          <h3>No movies found</h3>
          <p>Please check your internet connection and try again.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
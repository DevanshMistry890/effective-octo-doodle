import React, { useState, useEffect } from 'react'
import type { TMDBMovie, MovieCategory, TMDBResponse } from '../types/movie'
import { tmdbApi } from '../services/tmdbApi'
import MovieCard from '../components/MovieCard'
import '../assets/css/Home.css'

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MovieCategory>('popular')
  const [movies, setMovies] = useState<TMDBMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categories = [
    { key: 'popular' as MovieCategory, label: 'Popular' },
    { key: 'top_rated' as MovieCategory, label: 'Top Rated' },
    { key: 'now_playing' as MovieCategory, label: 'Now Playing' },
    { key: 'upcoming' as MovieCategory, label: 'Upcoming' },
  ]

  useEffect(() => {
    fetchMovies(activeCategory, 1, true)
  }, [activeCategory])

  const fetchMovies = async (
    category: MovieCategory,
    page: number,
    reset: boolean = false
  ) => {
    try {
      setLoading(true)
      setError(null)

      let response: TMDBResponse

      switch (category) {
        case 'popular':
          response = await tmdbApi.getPopularMovies(page)
          break
        case 'top_rated':
          response = await tmdbApi.getTopRatedMovies(page)
          break
        case 'now_playing':
          response = await tmdbApi.getNowPlayingMovies(page)
          break
        case 'upcoming':
          response = await tmdbApi.getUpcomingMovies(page)
          break
        default:
          throw new Error('Invalid category')
      }

      if (reset) {
        setMovies(response.results)
      } else {
        setMovies((prevMovies) => [...prevMovies, ...response.results])
      }

      setCurrentPage(page)
      setTotalPages(response.total_pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movies')
      console.error('Error fetching movies:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category: MovieCategory) => {
    if (category !== activeCategory) {
      setActiveCategory(category)
      setCurrentPage(1)
    }
  }

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchMovies(activeCategory, currentPage + 1, false)
    }
  }

  const renderTabButtons = () => (
    <div className='category-tabs'>
      {categories.map((category) => (
        <button
          key={category.key}
          className={`tab-button ${activeCategory === category.key ? 'active' : ''}`}
          onClick={() => handleCategoryChange(category.key)}
          disabled={loading}
        >
          {category.label}
        </button>
      ))}
    </div>
  )

  const renderMoviesGrid = () => (
    <div className='movies-grid'>
      {movies.map((movie) => (
        <MovieCard
          key={`${movie.id}-${currentPage}`}
          movie={movie}
        />
      ))}
    </div>
  )

  const renderLoadingState = () => (
    <div className='loading-container'>
      <div className='loading-spinner'></div>
      <p>Loading movies...</p>
    </div>
  )

  const renderErrorState = () => (
    <div className='error-container'>
      <h3>Oops! Something went wrong</h3>
      <p>{error}</p>
      <button
        className='btn btn-primary'
        onClick={() => fetchMovies(activeCategory, 1, true)}
      >
        Try Again
      </button>
    </div>
  )

  const renderEmptyState = () => (
    <div className='empty-container'>
      <div className='empty-icon' role="img" aria-label="Empty state">
        🎬
      </div>
      <h3>No Movies Available</h3>
      <p>
        {!import.meta.env.VITE_TMDB_API_KEY ? (
          <>
            No API key is configured and mock data is empty. 
            <br />
            Please add your TMDB API key or add some mock data to see movies.
          </>
        ) : (
          <>
            We couldn't find any movies in the "{categories.find(c => c.key === activeCategory)?.label}" category.
            <br />
            Try switching to a different category or check your internet connection.
          </>
        )}
      </p>
      <div className="empty-actions">
        <button
          className='btn btn-primary'
          onClick={() => fetchMovies(activeCategory, 1, true)}
          disabled={loading}
        >
          {loading ? 'Retrying...' : 'Try Again'}
        </button>
        {categories.length > 1 && activeCategory !== 'popular' && (
          <button
            className='btn btn-secondary'
            onClick={() => handleCategoryChange('popular')}
            disabled={loading}
          >
            View Popular Movies
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className='home-page'>
      <header className='page-header page-header--animated'>
        <h1>Discover Movies</h1>
        <p>
          Explore popular movies, top-rated films, current releases, and
          upcoming attractions
        </p>
      </header>

      {renderTabButtons()}

      <main className='page-content'>
        {loading && movies.length === 0 ? (
          renderLoadingState()
        ) : error && movies.length === 0 ? (
          renderErrorState()
        ) : movies.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {renderMoviesGrid()}

            {currentPage < totalPages && (
              <div className='load-more-container'>
                <button
                  className='btn btn-secondary load-more-btn'
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More Movies'}
                </button>
              </div>
            )}

            {loading && movies.length > 0 && (
              <div className='loading-more'>
                <div className='loading-spinner small'></div>
                <p>Loading more movies...</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Home

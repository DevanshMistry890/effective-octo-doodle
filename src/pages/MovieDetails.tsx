import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { MovieDetails as MovieDetailsType } from '../types/movie'
import { tmdbApi } from '../services/tmdbApi'
import { localStorageService } from '../services/localStorage'
import '../assets/css/MovieDetails.css'

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<MovieDetailsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isWatched, setIsWatched] = useState(false)
  const [isInWantToWatch, setIsInWantToWatch] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!id) {
      setError('Movie ID not provided')
      setLoading(false)
      return
    }

    fetchMovieDetails(parseInt(id))
  }, [id])

  useEffect(() => {
    if (movie) {
      setIsWatched(localStorageService.isMovieWatched(movie.id))
      setIsInWantToWatch(localStorageService.isMovieInWantToWatch(movie.id))
    }
  }, [movie])

  const fetchMovieDetails = async (movieId: number) => {
    try {
      setLoading(true)
      setError(null)

      const movieData = await tmdbApi.getMovieDetails(movieId)
      setMovie(movieData)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch movie details'
      )
      console.error('Error fetching movie details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsWatched = async () => {
    if (!movie) return

    setActionLoading(true)
    const success = localStorageService.addToWatched(movie)
    if (success) {
      setIsWatched(true)
      setIsInWantToWatch(false)
    }
    setActionLoading(false)
  }

  const handleAddToWantToWatch = async () => {
    if (!movie) return

    setActionLoading(true)
    const success = localStorageService.addToWantToWatch(movie)
    if (success) {
      setIsInWantToWatch(true)
    }
    setActionLoading(false)
  }

  const handleRemoveFromWatched = () => {
    if (!movie) return

    const success = localStorageService.removeFromWatched(movie.id)
    if (success) {
      setIsWatched(false)
    }
  }

  const handleRemoveFromWantToWatch = () => {
    if (!movie) return

    const success = localStorageService.removeFromWantToWatch(movie.id)
    if (success) {
      setIsInWantToWatch(false)
    }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatRuntime = (minutes: number | null): string => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatRating = (rating: number): string => {
    return `★ ${rating.toFixed(1)}`
  }

  if (loading) {
    return (
      <div className='movie-details-page'>
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className='movie-details-page'>
        <div className='error-container'>
          <h3>Oops! Something went wrong</h3>
          <p>{error || 'Movie not found'}</p>
          <div className='error-actions'>
            <button
              className='btn btn-primary'
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
            <button
              className='btn btn-secondary'
              onClick={() => navigate('/')}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const backdropUrl = tmdbApi.getBackdropUrl(movie.backdrop_path)
  const posterUrl = tmdbApi.getPosterUrl(movie.poster_path)

  return (
    <div className='movie-details-page'>
      <div
        className='movie-backdrop'
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className='backdrop-overlay'></div>
      </div>

      <div className='movie-details-container'>
        <button
          className='back-button'
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className='movie-details-content'>
          <div className='movie-poster-large'>
            <img
              src={posterUrl}
              alt={movie.title}
              onError={(e) => {
                e.currentTarget.src = '/no-image-placeholder.jpg'
              }}
            />
          </div>

          <div className='movie-info-detailed'>
            <h1 className='movie-title-large'>{movie.title}</h1>

            {movie.tagline && (
              <p className='movie-tagline'>"{movie.tagline}"</p>
            )}

            <div className='movie-meta-large'>
              <span className='movie-rating-large'>
                {formatRating(movie.vote_average)}
              </span>
              <span className='movie-year-large'>
                {formatDate(movie.release_date)}
              </span>
              <span className='movie-runtime'>
                {formatRuntime(movie.runtime)}
              </span>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className='movie-genres'>
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className='genre-tag'
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div className='movie-overview-large'>
              <h3>Overview</h3>
              <p>{movie.overview}</p>
            </div>

            <div className='movie-actions-large'>
              {isWatched ? (
                <button
                  className='btn btn-remove'
                  onClick={handleRemoveFromWatched}
                  disabled={actionLoading}
                >
                  Remove from Watched
                </button>
              ) : (
                <button
                  className='btn btn-primary'
                  onClick={handleMarkAsWatched}
                  disabled={actionLoading}
                >
                  Mark as Watched
                </button>
              )}

              {!isWatched &&
                (isInWantToWatch ? (
                  <button
                    className='btn btn-remove'
                    onClick={handleRemoveFromWantToWatch}
                    disabled={actionLoading}
                  >
                    Remove from Want to Watch
                  </button>
                ) : (
                  <button
                    className='btn btn-secondary'
                    onClick={handleAddToWantToWatch}
                    disabled={actionLoading}
                  >
                    Add to Want to Watch
                  </button>
                ))}
            </div>

            <div className='movie-details-grid'>
              <div className='detail-section'>
                <h4>Status</h4>
                <p>{movie.status}</p>
              </div>

              <div className='detail-section'>
                <h4>Budget</h4>
                <p>{movie.budget > 0 ? formatCurrency(movie.budget) : 'N/A'}</p>
              </div>

              <div className='detail-section'>
                <h4>Revenue</h4>
                <p>
                  {movie.revenue > 0 ? formatCurrency(movie.revenue) : 'N/A'}
                </p>
              </div>

              <div className='detail-section'>
                <h4>Original Language</h4>
                <p>{movie.original_language.toUpperCase()}</p>
              </div>
            </div>

            {movie.production_companies &&
              movie.production_companies.length > 0 && (
                <div className='production-companies'>
                  <h4>Production Companies</h4>
                  <div className='companies-list'>
                    {movie.production_companies.map((company) => (
                      <span
                        key={company.id}
                        className='company-tag'
                      >
                        {company.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails

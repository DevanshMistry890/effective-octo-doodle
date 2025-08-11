import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { TMDBMovie } from '../types/movie'
import { tmdbApi } from '../services/tmdbApi'
import { localStorageService } from '../services/localStorage'
import '../assets/css/MovieCard.css'

interface MovieCardProps {
  movie: TMDBMovie
  showRemoveButtons?: boolean
  onRemove?: (movieId: number) => void
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  showRemoveButtons = false,
  onRemove,
}) => {
  const [isWatched, setIsWatched] = useState(false)
  const [isInWantToWatch, setIsInWantToWatch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsWatched(localStorageService.isMovieWatched(movie.id))
    setIsInWantToWatch(localStorageService.isMovieInWantToWatch(movie.id))
  }, [movie.id])

  const handleMarkAsWatched = async () => {
    setIsLoading(true)
    const success = localStorageService.addToWatched(movie)
    if (success) {
      setIsWatched(true)
      setIsInWantToWatch(false)
    }
    setIsLoading(false)
  }

  const handleAddToWantToWatch = async () => {
    setIsLoading(true)
    const success = localStorageService.addToWantToWatch(movie)
    if (success) {
      setIsInWantToWatch(true)
    }
    setIsLoading(false)
  }

  const handleRemoveFromWatched = () => {
    const success = localStorageService.removeFromWatched(movie.id)
    if (success) {
      setIsWatched(false)
      onRemove?.(movie.id)
    }
  }

  const handleRemoveFromWantToWatch = () => {
    const success = localStorageService.removeFromWantToWatch(movie.id)
    if (success) {
      setIsInWantToWatch(false)
      onRemove?.(movie.id)
    }
  }

  const formatYear = (dateString: string): string => {
    return new Date(dateString).getFullYear().toString()
  }

  const formatRating = (rating: number): string => {
    return `★ ${rating.toFixed(1)}`
  }

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  const posterUrl = tmdbApi.getPosterUrl(movie.poster_path)

  return (
    <div className='movie-card'>
      <div className='movie-poster'>
        <Link to={`/movie/${movie.id}`}>
          <img
            src={posterUrl}
            alt={movie.title}
            onError={(e) => {
              e.currentTarget.src = '/no-image-placeholder.jpg'
            }}
          />
        </Link>

        {(isWatched || isInWantToWatch) && (
          <div className='movie-status-badges'>
            {isWatched && <span className='status-badge watched'>Watched</span>}
            {isInWantToWatch && (
              <span className='status-badge want-to-watch'>Want to Watch</span>
            )}
          </div>
        )}
      </div>

      <div className='movie-info'>
        <h3 className='movie-title'>
          <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
        </h3>

        <div className='movie-meta'>
          <span className='movie-year'>{formatYear(movie.release_date)}</span>
          <span className='movie-rating'>
            {formatRating(movie.vote_average)}
          </span>
        </div>

        <p className='movie-overview'>{truncateText(movie.overview, 120)}</p>

        <div className='movie-actions'>
          {showRemoveButtons ? (
            <>
              {isWatched && (
                <button
                  className='btn btn-remove'
                  onClick={handleRemoveFromWatched}
                >
                  Remove from Watched
                </button>
              )}
              {isInWantToWatch && (
                <button
                  className='btn btn-remove'
                  onClick={handleRemoveFromWantToWatch}
                >
                  Remove from Want to Watch
                </button>
              )}
            </>
          ) : (
            <>
              {!isWatched && (
                <button
                  className='btn btn-primary'
                  onClick={handleMarkAsWatched}
                  disabled={isLoading}
                >
                  Mark as Watched
                </button>
              )}
              {!isWatched && !isInWantToWatch && (
                <button
                  className='btn btn-secondary'
                  onClick={handleAddToWantToWatch}
                  disabled={isLoading}
                >
                  Add to Want to Watch
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard

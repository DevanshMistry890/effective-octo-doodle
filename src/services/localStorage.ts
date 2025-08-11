import type { WatchlistMovie, TMDBMovie } from '../types/movie'

class LocalStorageService {
  private readonly WATCHED_MOVIES_KEY = 'movieapp_watched_movies'
  private readonly WANT_TO_WATCH_MOVIES_KEY = 'movieapp_want_to_watch_movies'

  private convertToWatchlistMovie(movie: TMDBMovie): WatchlistMovie {
    return {
      ...movie,
      addedAt: new Date().toISOString(),
    }
  }

  private getStoredMovies(key: string): WatchlistMovie[] {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return []
    }
  }

  private saveMovies(key: string, movies: WatchlistMovie[]): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(movies))
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  }

  addToWatched(movie: TMDBMovie): boolean {
    try {
      const watchedMovies = this.getStoredMovies(this.WATCHED_MOVIES_KEY)
      const wantToWatchMovies = this.getStoredMovies(
        this.WANT_TO_WATCH_MOVIES_KEY
      )

      if (watchedMovies.some((m) => m.id === movie.id)) {
        return false
      }

      const watchlistMovie = this.convertToWatchlistMovie(movie)
      watchedMovies.push(watchlistMovie)

      const updatedWantToWatch = wantToWatchMovies.filter(
        (m) => m.id !== movie.id
      )

      const watchedSaved = this.saveMovies(
        this.WATCHED_MOVIES_KEY,
        watchedMovies
      )
      const wantToWatchSaved = this.saveMovies(
        this.WANT_TO_WATCH_MOVIES_KEY,
        updatedWantToWatch
      )

      return watchedSaved && wantToWatchSaved
    } catch (error) {
      console.error('Error adding movie to watched list:', error)
      return false
    }
  }

  addToWantToWatch(movie: TMDBMovie): boolean {
    try {
      const wantToWatchMovies = this.getStoredMovies(
        this.WANT_TO_WATCH_MOVIES_KEY
      )

      if (wantToWatchMovies.some((m) => m.id === movie.id)) {
        return false
      }

      if (this.isMovieWatched(movie.id)) {
        return false
      }

      const watchlistMovie = this.convertToWatchlistMovie(movie)
      wantToWatchMovies.push(watchlistMovie)

      return this.saveMovies(this.WANT_TO_WATCH_MOVIES_KEY, wantToWatchMovies)
    } catch (error) {
      console.error('Error adding movie to want to watch list:', error)
      return false
    }
  }

  removeFromWatched(movieId: number): boolean {
    try {
      const watchedMovies = this.getStoredMovies(this.WATCHED_MOVIES_KEY)
      const updatedMovies = watchedMovies.filter(
        (movie) => movie.id !== movieId
      )
      return this.saveMovies(this.WATCHED_MOVIES_KEY, updatedMovies)
    } catch (error) {
      console.error('Error removing movie from watched list:', error)
      return false
    }
  }

  removeFromWantToWatch(movieId: number): boolean {
    try {
      const wantToWatchMovies = this.getStoredMovies(
        this.WANT_TO_WATCH_MOVIES_KEY
      )
      const updatedMovies = wantToWatchMovies.filter(
        (movie) => movie.id !== movieId
      )
      return this.saveMovies(this.WANT_TO_WATCH_MOVIES_KEY, updatedMovies)
    } catch (error) {
      console.error('Error removing movie from want to watch list:', error)
      return false
    }
  }

  isMovieWatched(movieId: number): boolean {
    const watchedMovies = this.getStoredMovies(this.WATCHED_MOVIES_KEY)
    return watchedMovies.some((movie) => movie.id === movieId)
  }

  isMovieInWantToWatch(movieId: number): boolean {
    const wantToWatchMovies = this.getStoredMovies(
      this.WANT_TO_WATCH_MOVIES_KEY
    )
    return wantToWatchMovies.some((movie) => movie.id === movieId)
  }

  getWatchedMovies(): WatchlistMovie[] {
    return this.getStoredMovies(this.WATCHED_MOVIES_KEY)
  }

  getWantToWatchMovies(): WatchlistMovie[] {
    return this.getStoredMovies(this.WANT_TO_WATCH_MOVIES_KEY)
  }

  clearAllData(): boolean {
    try {
      localStorage.removeItem(this.WATCHED_MOVIES_KEY)
      localStorage.removeItem(this.WANT_TO_WATCH_MOVIES_KEY)
      return true
    } catch (error) {
      console.error('Error clearing localStorage data:', error)
      return false
    }
  }
}

export const localStorageService = new LocalStorageService()
export default LocalStorageService

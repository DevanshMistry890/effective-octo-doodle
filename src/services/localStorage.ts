class LocalStorageService {
  constructor() {
    this.WATCHED_MOVIES_KEY = 'movieApp_watchedMovies';
    this.WANT_TO_WATCH_KEY = 'movieApp_wantToWatch';
  }

  getWatchedMovies() {
    try {
      const movies = localStorage.getItem(this.WATCHED_MOVIES_KEY);
      return movies ? JSON.parse(movies) : [];
    } catch (error) {
      console.error('Error getting watched movies from localStorage:', error);
      return [];
    }
  }

  getWantToWatchMovies() {
    try {
      const movies = localStorage.getItem(this.WANT_TO_WATCH_KEY);
      return movies ? JSON.parse(movies) : [];
    } catch (error) {
      console.error('Error getting want to watch movies from localStorage:', error);
      return [];
    }
  }

  addToWatched(movie) {
    try {
      const watchedMovies = this.getWatchedMovies();
      const isAlreadyWatched = watchedMovies.some(m => m.id === movie.id);
      
      if (!isAlreadyWatched) {
        const updatedMovies = [...watchedMovies, movie];
        localStorage.setItem(this.WATCHED_MOVIES_KEY, JSON.stringify(updatedMovies));
        
        this.removeFromWantToWatch(movie.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding movie to watched list:', error);
      return false;
    }
  }

  addToWantToWatch(movie) {
    try {
      const wantToWatchMovies = this.getWantToWatchMovies();
      const watchedMovies = this.getWatchedMovies();
      
      const isAlreadyWantToWatch = wantToWatchMovies.some(m => m.id === movie.id);
      const isAlreadyWatched = watchedMovies.some(m => m.id === movie.id);
      
      if (!isAlreadyWantToWatch && !isAlreadyWatched) {
        const updatedMovies = [...wantToWatchMovies, movie];
        localStorage.setItem(this.WANT_TO_WATCH_KEY, JSON.stringify(updatedMovies));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding movie to want to watch list:', error);
      return false;
    }
  }

  removeFromWatched(movieId) {
    try {
      const watchedMovies = this.getWatchedMovies();
      const updatedMovies = watchedMovies.filter(movie => movie.id !== movieId);
      localStorage.setItem(this.WATCHED_MOVIES_KEY, JSON.stringify(updatedMovies));
      return true;
    } catch (error) {
      console.error('Error removing movie from watched list:', error);
      return false;
    }
  }

  removeFromWantToWatch(movieId) {
    try {
      const wantToWatchMovies = this.getWantToWatchMovies();
      const updatedMovies = wantToWatchMovies.filter(movie => movie.id !== movieId);
      localStorage.setItem(this.WANT_TO_WATCH_KEY, JSON.stringify(updatedMovies));
      return true;
    } catch (error) {
      console.error('Error removing movie from want to watch list:', error);
      return false;
    }
  }

  isMovieWatched(movieId) {
    const watchedMovies = this.getWatchedMovies();
    return watchedMovies.some(movie => movie.id === movieId);
  }

  isMovieInWantToWatch(movieId) {
    const wantToWatchMovies = this.getWantToWatchMovies();
    return wantToWatchMovies.some(movie => movie.id === movieId);
  }

  clearAllData() {
    try {
      localStorage.removeItem(this.WATCHED_MOVIES_KEY);
      localStorage.removeItem(this.WANT_TO_WATCH_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }
}

const localStorageService = new LocalStorageService();
export default localStorageService;
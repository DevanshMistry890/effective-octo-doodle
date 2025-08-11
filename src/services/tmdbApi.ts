const API_KEY = process.env.REACT_APP_TMDB_API_KEY
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL

// Import mock data for development
const mockData = require('../data/mockMovies.json')

class TMDBApi {
  // Check if we should use mock data
  shouldUseMockData() {
    return !API_KEY || API_KEY.trim() === ''
  }

  async fetchMovies(endpoint) {
    // Use mock data if no API key
    if (this.shouldUseMockData()) {
      return this.getMockData(endpoint)
    }

    try {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
      const response = await fetch(`${BASE_URL}${endpoint}`, options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching movies:', error)
      throw error
    }
  }

  getMockData(endpoint) {
    console.log('Using mock data for development (no API key provided)')

    // Parse endpoint to determine what mock data to return
    if (endpoint.includes('/movie/popular')) {
      return Promise.resolve(mockData.popular)
    } else if (endpoint.includes('/movie/top_rated')) {
      return Promise.resolve(mockData.top_rated)
    } else if (endpoint.includes('/movie/now_playing')) {
      return Promise.resolve(mockData.now_playing)
    } else if (endpoint.includes('/movie/upcoming')) {
      return Promise.resolve(mockData.upcoming)
    } else if (
      endpoint.includes('/discover/movie') &&
      endpoint.includes('release_date.gte')
    ) {
      // This is the upcoming movies discover endpoint
      return Promise.resolve(mockData.upcoming)
    } else if (endpoint.includes('/movie/')) {
      // Movie details - extract movie ID
      const movieId = endpoint.split('/movie/')[1].split('?')[0]
      const movieDetails = mockData.movie_details[movieId]
      if (movieDetails) {
        return Promise.resolve(movieDetails)
      } else {
        return Promise.resolve(mockData.movie_details['1']) // fallback to first movie
      }
    }

    // Default fallback
    return Promise.resolve(mockData.popular)
  }

  async getPopularMovies(page = 1) {
    return this.fetchMovies(
      `/movie/popular?language=en-US&page=${page}&region=CA`
    )
  }

  async getTopRatedMovies(page = 1) {
    return this.fetchMovies(
      `/movie/top_rated?language=en-US&page=${page}&region=CA`
    )
  }

  async getNowPlayingMovies(page = 1) {
    return this.fetchMovies(
      `/movie/now_playing?language=en-US&page=${page}&region=CA`
    )
  }

  async getUpcomingMovies(page = 1) {
    // Use discover endpoint for better upcoming movie filtering
    const today = new Date()
    const minDate = today.toISOString().split('T')[0]

    const endpoint = `/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_date.gte=${minDate}&region=CA&sort_by=popularity.desc`
    return this.fetchMovies(endpoint)
  }

  async getMovieDetails(movieId) {
    return this.fetchMovies(`/movie/${movieId}?language=en-US`)
  }


  getImageUrl(imagePath, size = 'w500') {
    if (!imagePath) return null
    return `https://image.tmdb.org/t/p/${size}${imagePath}`
  }

  getFullImageUrl(imagePath) {
    return this.getImageUrl(imagePath, 'original')
  }
}

const tmdbApi = new TMDBApi()
export default tmdbApi

import type {
  MovieDetails,
  TMDBResponse,
  MovieCategory,
  MockMovieData,
  MockSearchResult,
} from '../types/movie'
import mockData from '../data/mockMovies.json'

class TMDBApiService {
  private readonly baseURL: string
  private readonly apiKey: string
  private readonly imageBaseURL: string

  constructor() {
    this.baseURL =
      import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3'
    this.apiKey = import.meta.env.VITE_TMDB_API_KEY || ''
    this.imageBaseURL = 
      import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'
  }

  // Fallback sample data for when both API and mockData are unavailable
  private getFallbackData(category: MovieCategory): TMDBResponse {
    const fallbackMovies = [
      {
        id: 1,
        title: 'Sample Movie',
        overview: 'This is a sample movie shown when no data is available.',
        poster_path: null,
        backdrop_path: null,
        release_date: '2024-01-01',
        vote_average: 7.5,
        vote_count: 100,
        genre_ids: [28, 12],
        adult: false,
        original_language: 'en',
        original_title: 'Sample Movie',
        popularity: 100.0,
        video: false
      }
    ]

    return {
      page: 1,
      results: fallbackMovies,
      total_pages: 1,
      total_results: fallbackMovies.length,
    }
  }

  private async fetchFromAPI<T>(endpoint: string): Promise<T> {
    if (!this.apiKey) {
      throw new Error('No API key provided, using mock data')
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  private getMockData(category: MovieCategory, page: number = 1): TMDBResponse {
    try {
      // Safe access to mockData with fallbacks
      const typedMockData = (mockData as unknown as MockMovieData) || {}
      const movies = typedMockData[category] || []
      
      // Handle empty or invalid data
      if (!Array.isArray(movies) || movies.length === 0) {
        console.warn(`Mock data for category "${category}" is empty or invalid, using fallback data`)
        // Only use fallback if no API key is available
        if (!this.apiKey) {
          return this.getFallbackData(category)
        }
        return {
          page,
          results: [],
          total_pages: 1,
          total_results: 0,
        }
      }

      return {
        page,
        results: movies,
        total_pages: Math.max(1, Math.ceil(movies.length / 20)), // Assume 20 movies per page
        total_results: movies.length,
      }
    } catch (error) {
      console.warn(`Error accessing mock data for category "${category}":`, error)
      // Only use fallback if no API key is available
      if (!this.apiKey) {
        console.info('Using fallback sample data since no API key is available')
        return this.getFallbackData(category)
      }
      return {
        page,
        results: [],
        total_pages: 1,
        total_results: 0,
      }
    }
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse> {
    try {
      return await this.fetchFromAPI<TMDBResponse>(
        `/movie/popular?page=${page}`
      )
    } catch (error) {
      console.warn('Using mock data for popular movies:', error)
      return this.getMockData('popular', page)
    }
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse> {
    try {
      return await this.fetchFromAPI<TMDBResponse>(
        `/movie/top_rated?page=${page}`
      )
    } catch (error) {
      console.warn('Using mock data for top rated movies:', error)
      return this.getMockData('top_rated', page)
    }
  }

  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse> {
    try {
      return await this.fetchFromAPI<TMDBResponse>(
        `/movie/now_playing?page=${page}`
      )
    } catch (error) {
      console.warn('Using mock data for now playing movies:', error)
      return this.getMockData('now_playing', page)
    }
  }

  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse> {
    try {
      return await this.fetchFromAPI<TMDBResponse>(
        `/movie/upcoming?page=${page}`
      )
    } catch (error) {
      console.warn('Using mock data for upcoming movies:', error)
      return this.getMockData('upcoming', page)
    }
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    try {
      return await this.fetchFromAPI<MovieDetails>(`/movie/${movieId}`)
    } catch (error) {
      console.warn('Using mock data for movie details:', error)
      
      try {
        const typedMockData = (mockData as unknown as MockMovieData) || {}
        const movieDetails = typedMockData.movie_details || {}
        const mockDetails = movieDetails[movieId.toString()]
        
        if (mockDetails) {
          return mockDetails
        }
        
        throw new Error(`Movie details not found for ID: ${movieId}`)
      } catch (mockError) {
        console.error('Error accessing mock movie details:', mockError)
        throw new Error(`Movie details not found for ID: ${movieId}. Mock data is unavailable.`)
      }
    }
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse> {
    try {
      const encodedQuery = encodeURIComponent(query)
      return await this.fetchFromAPI<TMDBResponse>(
        `/search/movie?query=${encodedQuery}&page=${page}`
      )
    } catch (error) {
      console.warn('Using mock data for search:', error)
      
      try {
        const typedMockData = (mockData as unknown as MockMovieData) || {}
        const searchResults = typedMockData.search || []
        
        if (!Array.isArray(searchResults)) {
          console.warn('Mock search data is not an array, returning empty results')
          return {
            page: 1,
            results: [],
            total_pages: 0,
            total_results: 0,
          }
        }
        
        const searchResult = searchResults.find((s: MockSearchResult) =>
          s.query && s.query.toLowerCase().includes(query.toLowerCase())
        )
        
        if (searchResult && Array.isArray(searchResult.results)) {
          return {
            page: 1,
            results: searchResult.results,
            total_pages: 1,
            total_results: searchResult.results.length,
          }
        }
        
        return {
          page: 1,
          results: [],
          total_pages: 0,
          total_results: 0,
        }
      } catch (mockError) {
        console.error('Error accessing mock search data:', mockError)
        return {
          page: 1,
          results: [],
          total_pages: 0,
          total_results: 0,
        }
      }
    }
  }

  /**
   * Get image URL with specified size
   * @param path - Image path from TMDB API
   * @param size - Image size (w92, w154, w185, w342, w500, w780, original for posters; w300, w780, w1280, original for backdrops)
   */
  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return '/no-image-placeholder.jpg'
    return `${this.imageBaseURL}/${size}${path}`
  }

  /** Get original/full resolution image */
  getFullImageUrl(path: string | null): string {
    return this.getImageUrl(path, 'original')
  }

  /** Get poster image (default w500) */
  getPosterUrl(path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    return this.getImageUrl(path, size)
  }

  /** Get backdrop image (default w1280) */
  getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
    return this.getImageUrl(path, size)
  }

  /** Get small poster for thumbnails */
  getThumbnailUrl(path: string | null): string {
    return this.getImageUrl(path, 'w185')
  }

  /** Get large poster for detailed views */
  getLargePosterUrl(path: string | null): string {
    return this.getImageUrl(path, 'w780')
  }
}

export const tmdbApi = new TMDBApiService()
export default TMDBApiService

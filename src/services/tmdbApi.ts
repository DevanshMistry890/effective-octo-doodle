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
  private readonly imageBaseURL = 'https://image.tmdb.org/t/p'

  constructor() {
    this.baseURL =
      import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3'
    this.apiKey = import.meta.env.VITE_TMDB_API_KEY || ''
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
    const typedMockData = mockData as MockMovieData
    const movies = typedMockData[category] || []
    return {
      page,
      results: movies,
      total_pages: 1,
      total_results: movies.length,
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
      const typedMockData = mockData as MockMovieData
      const mockDetails = typedMockData.movie_details[movieId.toString()]
      if (mockDetails) {
        return mockDetails
      }
      throw new Error(`Movie details not found for ID: ${movieId}`)
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
      const typedMockData = mockData as MockMovieData
      const searchResults = typedMockData.search || []
      const searchResult = searchResults.find((s: MockSearchResult) =>
        s.query.toLowerCase().includes(query.toLowerCase())
      )
      if (searchResult) {
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
    }
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return '/no-image-placeholder.jpg'
    return `${this.imageBaseURL}/${size}${path}`
  }

  getFullImageUrl(path: string | null): string {
    return this.getImageUrl(path, 'original')
  }

  getPosterUrl(path: string | null): string {
    return this.getImageUrl(path, 'w500')
  }

  getBackdropUrl(path: string | null): string {
    return this.getImageUrl(path, 'w1280')
  }
}

export const tmdbApi = new TMDBApiService()
export default TMDBApiService

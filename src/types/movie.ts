export interface TMDBMovie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  adult: boolean
  genre_ids: number[]
  original_language: string
  popularity: number
  vote_average: number
  vote_count: number
}

export interface MovieDetails extends TMDBMovie {
  budget: number
  revenue: number
  runtime: number | null
  status: string
  tagline: string | null
  homepage: string | null
  imdb_id: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  genres: Genre[]
  belongs_to_collection: Collection | null
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface Collection {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

export interface TMDBResponse {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

export interface SearchResult {
  query: string
  results: TMDBMovie[]
}

export type MovieCategory = 'popular' | 'top_rated' | 'now_playing' | 'upcoming'

export interface WatchlistMovie extends TMDBMovie {
  addedAt: string
}

export interface MockSearchResult {
  query: string
  results: TMDBMovie[]
}

export interface MockMovieData {
  popular: TMDBMovie[]
  top_rated: TMDBMovie[]
  now_playing: TMDBMovie[]
  upcoming: TMDBMovie[]
  movie_details: Record<string, MovieDetails>
  search: MockSearchResult[]
}

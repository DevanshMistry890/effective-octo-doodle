import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY || '';
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'mockMovies.json');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TMDBDataGenerator {
  constructor() {
    if (!API_KEY) {
      console.warn('No TMDB_API_KEY found in environment variables');
      process.exit(1);
    }
    
    this.headers = {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, { headers: this.headers });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.warn(`Attempt ${i + 1} failed for ${url}:`, error.message);
        if (i === retries - 1) throw error;
        await delay(1000 * (i + 1)); // Exponential backoff
      }
    }
  }

  async fetchMoviesByCategory(category, page = 1) {
    console.log(`Fetching ${category} movies (page ${page})...`);
    const url = `${BASE_URL}/movie/${category}?page=${page}`;
    await delay(250); // Rate limiting
    return this.fetchWithRetry(url);
  }

  async fetchMovieDetails(movieId) {
    console.log(`Fetching details for movie ${movieId}...`);
    const url = `${BASE_URL}/movie/${movieId}`;
    await delay(250); // Rate limiting
    return this.fetchWithRetry(url);
  }

  async searchMovies(query, page = 1) {
    console.log(`Searching for "${query}"...`);
    const encodedQuery = encodeURIComponent(query);
    const url = `${BASE_URL}/search/movie?query=${encodedQuery}&page=${page}`;
    await delay(250); // Rate limiting
    return this.fetchWithRetry(url);
  }

  async generateMockData() {
    const mockData = {
      popular: [],
      top_rated: [],
      now_playing: [],
      upcoming: [],
      movieDetails: {},
      search: []
    };

    try {
      // Fetch movie categories
      const categories = ['popular', 'top_rated', 'now_playing', 'upcoming'];
      
      for (const category of categories) {
        try {
          const response = await this.fetchMoviesByCategory(category);
          mockData[category] = response.results.slice(0, 10); // Take first 10 movies
          console.log(`✅ Fetched ${mockData[category].length} ${category} movies`);
        } catch (error) {
          console.error(`❌ Failed to fetch ${category}:`, error.message);
        }
      }

      // Fetch detailed info for first 5 popular movies
      if (mockData.popular.length > 0) {
        console.log('\nFetching detailed movie information...');
        
        for (let i = 0; i < Math.min(5, mockData.popular.length); i++) {
          const movie = mockData.popular[i];
          try {
            const details = await this.fetchMovieDetails(movie.id);
            mockData.movieDetails[movie.id] = details;
            console.log(`✅ Fetched details for "${movie.title}"`);
          } catch (error) {
            console.error(`❌ Failed to fetch details for movie ${movie.id}:`, error.message);
          }
        }
      }

      // Perform sample searches
      const searchQueries = ['batman', 'star wars', 'marvel', 'comedy', 'horror'];
      console.log('\nPerforming sample searches...');
      
      for (const query of searchQueries) {
        try {
          const searchResults = await this.searchMovies(query);
          mockData.search.push({
            query,
            results: searchResults.results.slice(0, 5) // Take first 5 results
          });
          console.log(`✅ Search results for "${query}": ${searchResults.results.length} movies`);
        } catch (error) {
          console.error(`❌ Failed to search for "${query}":`, error.message);
        }
      }

      return mockData;

    } catch (error) {
      console.error('❌ Error generating mock data:', error.message);
      throw error;
    }
  }

  async saveMockData(data) {
    try {
      // Ensure directory exists
      const dir = path.dirname(OUTPUT_FILE);
      await fs.mkdir(dir, { recursive: true });

      // Save data with pretty formatting
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(OUTPUT_FILE, jsonData, 'utf8');
      
      console.log(`\n✅ Mock data saved to: ${OUTPUT_FILE}`);
      console.log(`📊 Data summary:
        - Popular movies: ${data.popular.length}
        - Top rated movies: ${data.top_rated.length}
        - Now playing movies: ${data.now_playing.length}
        - Upcoming movies: ${data.upcoming.length}
        - Movie details: ${Object.keys(data.movieDetails).length}
        - Search queries: ${data.search.length}
      `);
    } catch (error) {
      console.error('❌ Failed to save mock data:', error.message);
      throw error;
    }
  }
}

// Main execution
async function main() {
  console.log('🎬 TMDB Mock Data Generator\n');
  console.log('This script will fetch data from TMDB API and save it as mock data.');
  console.log('Rate limiting: 250ms delay between requests\n');

  const generator = new TMDBDataGenerator();
  
  try {
    const mockData = await generator.generateMockData();
    await generator.saveMockData(mockData);
    
    console.log('\n🎉 Mock data generation completed successfully!');
    console.log('You can now run your React app without needing a TMDB API key.');
    
  } catch (error) {
    console.error('\n💥 Mock data generation failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure you have a valid TMDB API key');
    console.log('2. Set the TMDB_API_KEY environment variable');
    console.log('3. Check your internet connection');
    console.log('4. Verify the TMDB API is accessible');
    
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbService = {
  searchMovies: async (query) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data.results.slice(0, 4);
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  },

  getPopularMovies: async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      return data.results.slice(0, 4);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  }
}; 
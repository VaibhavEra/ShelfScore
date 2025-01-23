const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export const tmdbService = {
  getPopularMovies: async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();
      return data.results.slice(0, 8); // Return 8 movies
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  searchMovies: async (query) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`
      );
      const data = await response.json();
      return data.results.slice(0, 8); // Return 8 search results
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  getMovieDetails: async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },
}; 
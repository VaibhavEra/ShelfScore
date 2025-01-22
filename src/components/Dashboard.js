import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import MovieCard from './MovieCard';
import { tmdbService } from '../services/tmdbService';

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async () => {
    try {
      const popularMovies = await tmdbService.getPopularMovies();
      setMovies(popularMovies);
      setLoading(false);
    } catch (err) {
      setError('Failed to load popular movies');
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const searchResults = await tmdbService.searchMovies(query);
      setMovies(searchResults);
      setError(null);
    } catch (err) {
      setError('Failed to search movies');
    }
    setLoading(false);
  };

  return (
    <div className="dashboard">
      <SearchBar onSearch={handleSearch} />
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 
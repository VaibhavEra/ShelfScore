import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import MovieCard from './MovieCard';
import { tmdbService } from '../services/tmdbService';

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialMovies();
  }, []);

  const loadInitialMovies = async () => {
    try {
      const popularMovies = await tmdbService.getPopularMovies();
      setMovies(popularMovies);
    } catch (err) {
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setIsSearching(true);
    setLoading(true);
    try {
      const searchResults = await tmdbService.searchMovies(query);
      setMovies(searchResults);
    } catch (err) {
      setError('Failed to search movies');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard">
      <SearchBar onSearch={handleSearch} />
      
      <div className="movies-grid">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard; 
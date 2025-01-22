import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdbService } from '../services/tmdbService';
import LogMovieForm from './LogMovieForm';
import '../styles/LogMovieForm.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await tmdbService.getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleLogMovie = async (movieData) => {
    // TODO: Replace with actual API call when backend is ready
    console.log('Logging movie:', movieData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    setShowSuccessMessage(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!movie) return null;

  return (
    <div className="movie-details">
      {showSuccessMessage && (
        <div className="success-message">
          Movie logged successfully!
        </div>
      )}
      
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="movie-details-content">
        <div className="movie-poster-section">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/placeholder-poster.png'
            }
            alt={movie.title}
            className="movie-poster-large"
          />
        </div>

        <div className="movie-info-section">
          <div className="title-container">
            <h1>{movie.title} <span className="year">({new Date(movie.release_date).getFullYear()})</span></h1>
          </div>

          <div className="genres-list">
            {movie.genres?.map(genre => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>

          {movie.tagline && (
            <p className="tagline">"{movie.tagline}"</p>
          )}

          <p className="overview">{movie.overview}</p>

          <div className="additional-info">
            <p><strong>Runtime:</strong> {formatRuntime(movie.runtime)}</p>
            <p><strong>Original Language:</strong> {movie.original_language?.toUpperCase()}</p>
            {movie.budget > 0 && (
              <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
            )}
            {movie.revenue > 0 && (
              <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
      
      <LogMovieForm movie={movie} onSubmit={handleLogMovie} />
    </div>
  );
};

export default MovieDetails;
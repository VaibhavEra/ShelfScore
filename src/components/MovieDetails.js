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
          <h1>{movie.title}</h1>
          <p className="release-date">
            Released: {new Date(movie.release_date).getFullYear()}
          </p>
          <p className="overview">{movie.overview}</p>
          
          <div className="additional-info">
            <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
            <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(', ')}</p>
            {movie.tagline && (
              <p className="tagline">"{movie.tagline}"</p>
            )}
          </div>
        </div>
      </div>
      
      <LogMovieForm movie={movie} onSubmit={handleLogMovie} />
    </div>
  );
};

export default MovieDetails; 
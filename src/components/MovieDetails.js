import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdbService } from '../services/tmdbService';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!movie) return null;

  return (
    <div className="movie-details">
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
    </div>
  );
};

export default MovieDetails; 
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-poster.png';

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleClick} role="button" tabIndex={0}>
      <img src={posterUrl} alt={movie.title} className="movie-poster" />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.split('-')[0]}</p>
      </div>
    </div>
  );
};

export default MovieCard; 
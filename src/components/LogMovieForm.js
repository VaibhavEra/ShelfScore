import React, { useState } from 'react';

const SHELF_SCORES = [
  'Top Shelf',
  'Second Shelf',
  'Third Shelf',
  'The Drawer',
  'Trash Bin'
];
const RATING_CATEGORIES = [
  'visuals',
  'story',
  'direction',
  'acting',
  'sound',
  'editing'
];

const LogMovieForm = ({ movie, onSubmit }) => {
  const [ratings, setRatings] = useState({
    visuals: 0,
    story: 0,
    direction: 0,
    acting: 0,
    sound: 0,
    editing: 0
  });
  const [notablePoints, setNotablePoints] = useState('');
  const [shelfScore, setShelfScore] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({
      ...prev,
      [category]: parseInt(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const movieData = {
      movieId: movie.id,
      title: movie.title,
      posterUrl: movie.poster_path,
      synopsis: movie.overview,
      ratings,
      notablePoints,
      shelfScore
    };

    try {
      await onSubmit(movieData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="log-movie-form">
      <h2>Log Movie</h2>
      
      <div className="ratings-section">
        <h3>Ratings</h3>
        {RATING_CATEGORIES.map(category => (
          <div key={category} className="rating-item">
            <label htmlFor={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}:
            </label>
            <div className="rating-buttons">
              {[1, 2, 3].map(value => (
                <button
                  key={value}
                  type="button"
                  className={`rating-button ${ratings[category] === value ? 'active' : ''}`}
                  onClick={() => handleRatingChange(category, value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="shelf-score-section">
        <h3>Shelf Score</h3>
        <div className="shelf-buttons">
          {SHELF_SCORES.map(score => (
            <button
              key={score}
              type="button"
              className={`shelf-button ${shelfScore === score ? 'active' : ''}`}
              onClick={() => setShelfScore(score)}
            >
              {score}
            </button>
          ))}
        </div>
      </div>

      <div className="notable-points-section">
        <h3>Notable Points</h3>
        <textarea
          value={notablePoints}
          onChange={(e) => setNotablePoints(e.target.value)}
          placeholder="What stood out about this movie?"
          rows={4}
        />
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={isSubmitting || !shelfScore}
      >
        {isSubmitting ? 'Logging...' : 'Log Movie'}
      </button>
    </form>
  );
};

export default LogMovieForm; 
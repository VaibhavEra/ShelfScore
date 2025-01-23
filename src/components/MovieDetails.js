import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { tmdbService } from '../services/tmdbService';
import {
  Container,
  Content,
  PosterWrapper,
  Poster,
  InfoSection,
  Title,
  Year,
  Overview,
  MetadataBox,
  MetadataItem,
  GenresList,
  GenreTag,
  Tagline,
  Icon
} from '../styles/MovieDetails.styles';

const tiers = [
  { name: "Top Shelf", color: "bg-yellow-400 text-gray-900" },
  { name: "Second Shelf", color: "bg-gray-300 text-gray-900" },
  { name: "Third Shelf", color: "bg-amber-600 text-white" },
  { name: "The Drawer", color: "bg-gray-500 text-white" },
  { name: "Trash Bin", color: "bg-red-500 text-white" },
];

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({
    visuals: 0,
    direction: 0,
    story: 0,
    acting: 0,
    sound: 0,
    editing: 0,
  });
  const [selectedTier, setSelectedTier] = useState("");
  const [review, setReview] = useState("");

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

  const handleRatingChange = (category, rating) => {
    setRatings(prev => ({ ...prev, [category]: rating }));
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">{error}</div>;
  if (!movie) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Background Image Section with darker vignette */}
      <div className="fixed inset-0 z-0">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={`${movie.title} backdrop`}
          className="w-full h-full object-cover object-top opacity-75"
        />
        {/* Multiple gradient layers for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 from-5% via-gray-900/90 to-transparent to-50%" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-gray-900/90" />
        <div className="absolute inset-0 bg-gray-900/30" />
      </div>

      {/* Content Section with enhanced text visibility */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-8 pt-8">
            <div className="md:w-1/4 flex-shrink-0">
              <div className="relative w-full max-w-[225px] mx-auto md:mx-0">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : '/placeholder-poster.png'
                  }
                  alt={`${movie.title} poster`}
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              </div>
            </div>

            <div className="md:w-3/4 space-y-6">
              <header>
                <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">
                  {movie.title} <span className="text-xl font-normal text-gray-200">({new Date(movie.release_date).getFullYear()})</span>
                </h1>
                {movie.tagline && (
                  <p className="text-lg italic text-gray-200 mb-3 drop-shadow-md">{movie.tagline}</p>
                )}
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-gray-200 drop-shadow-md">{formatRuntime(movie.runtime)}</span>
                  <span className="text-gray-200 drop-shadow-md">{movie.original_language.toUpperCase()}</span>
                </div>
              </header>

              <div className="bg-gray-800/70 backdrop-blur-md rounded-lg p-6 shadow-lg space-y-3">
                <h2 className="text-xl font-semibold text-white">Synopsis</h2>
                <p className="text-gray-100 leading-relaxed text-sm">{movie.overview}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="bg-blue-600/90 px-2 py-0.5 rounded-full text-xs font-medium">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/70 backdrop-blur-md rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Your Review</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(ratings).map(([category, rating]) => (
                    <div key={category} className="space-y-1.5">
                      <span className="capitalize text-xs text-gray-400">{category}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`w-4 h-4 cursor-pointer transition-colors ${
                              star <= rating ? "text-yellow-400" : "text-gray-600"
                            }`}
                            onClick={() => handleRatingChange(category, star)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/70 backdrop-blur-md rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Movie Tier</h2>
                <div className="relative max-w-sm">
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 appearance-none cursor-pointer text-sm"
                  >
                    <option value="">Select a tier</option>
                    {tiers.map((tier) => (
                      <option key={tier.name} value={tier.name}>
                        {tier.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedTier && (
                  <div
                    className={`mt-3 p-2 rounded-md text-center font-semibold text-sm ${
                      tiers.find((t) => t.name === selectedTier)?.color
                    }`}
                  >
                    {selectedTier}
                  </div>
                )}
              </div>

              <div className="bg-gray-800/70 backdrop-blur-md rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white resize-none text-sm"
                  placeholder="Write your thoughts about the movie..."
                />
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-base shadow-lg">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
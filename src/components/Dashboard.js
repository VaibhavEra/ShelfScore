import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { tmdbService } from "../services/tmdbService";

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
      console.log("Fetched movies:", popularMovies.length);
      setMovies(popularMovies.slice(0, 8)); // Changed to 8 movies
      setLoading(false);
    } catch (err) {
      console.error("Error loading movies:", err);
      setError("Failed to load popular movies");
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const searchResults = await tmdbService.searchMovies(query);
      setMovies(searchResults); // Will get 8 from the service
      setError(null);
    } catch (err) {
      setError("Failed to search movies");
    }
    setLoading(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-['Playfair_Display']">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-8 tracking-tight">
            Movie Library
          </h1>
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8 tracking-wide">
            {movies.length === 8 ? "Top Search Results" : "Popular Movies"}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {movies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="group relative transform hover:scale-105 transition-all duration-200"
              >
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                  <div className="relative pb-[150%]">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/placeholder-poster.png"
                      }
                      alt={movie.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                        <h3 className="text-base font-semibold text-white mb-2 line-clamp-2">
                          {movie.title}
                        </h3>
                        <span className="text-sm text-gray-300">
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

"use client"

import { useState } from "react"
import Image from "next/image"
import { StarIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid"

// Placeholder for movie data (this would be fetched from TMDB API in a real application)
const movie = {
  id: 27205,
  title: "Inception",
  releaseYear: 2010,
  synopsis:
    "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
  tagline: "Your mind is the scene of the crime.",
  runtime: 148,
  language: "English",
  budget: 160000000,
  revenue: 836836967,
  posterPath: "/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg",
  backdropPath: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
  voteAverage: 8.4,
  genres: ["Action", "Science Fiction", "Adventure"],
  director: "Christopher Nolan",
}

const tiers = [
  { name: "Top Shelf", color: "bg-yellow-400 text-gray-900" },
  { name: "Second Shelf", color: "bg-gray-300 text-gray-900" },
  { name: "Third Shelf", color: "bg-amber-600 text-white" },
  { name: "The Drawer", color: "bg-gray-500 text-white" },
  { name: "Trash Bin", color: "bg-red-500 text-white" },
]

export default function MoviePage() {
  const [ratings, setRatings] = useState({
    visuals: 0,
    direction: 0,
    story: 0,
    acting: 0,
    sound: 0,
    editing: 0,
  })
  const [selectedTier, setSelectedTier] = useState("")
  const [review, setReview] = useState("")

  const handleRatingChange = (category: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [category]: rating }))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative h-[50vh] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
          alt={`${movie.title} backdrop`}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="relative h-[450px] w-[300px] mx-auto md:mx-0 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                alt={`${movie.title} poster`}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>

          <div className="md:w-2/3 space-y-6">
            <header>
              <h1 className="text-4xl font-bold mb-2">
                {movie.title} <span className="text-2xl font-normal text-gray-400">({movie.releaseYear})</span>
              </h1>
              <p className="text-xl italic text-gray-400 mb-4">{movie.tagline}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded">{movie.voteAverage.toFixed(1)}</span>
                <span>{movie.runtime} min</span>
                <span>{movie.language}</span>
              </div>
            </header>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg space-y-4">
              <h2 className="text-2xl font-semibold">Synopsis</h2>
              <p className="text-gray-300">{movie.synopsis}</p>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span key={genre} className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
              <p>
                <span className="font-semibold">Director:</span> {movie.director}
              </p>
              <p>
                <span className="font-semibold">Budget:</span> ${movie.budget.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Revenue:</span> ${movie.revenue.toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Your Review</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(ratings).map(([category, rating]) => (
                  <div key={category} className="space-y-2">
                    <span className="capitalize text-sm text-gray-400">{category}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-6 h-6 cursor-pointer transition-colors ${
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

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Movie Tier</h2>
              <div className="relative">
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 appearance-none cursor-pointer"
                >
                  <option value="">Select a tier</option>
                  {tiers.map((tier) => (
                    <option key={tier.name} value={tier.name}>
                      {tier.name}
                    </option>
                  ))}
                </select>
                <ChevronUpDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {selectedTier && (
                <div
                  className={`mt-2 p-2 rounded-md text-center font-semibold ${tiers.find((t) => t.name === selectedTier)?.color}`}
                >
                  {selectedTier}
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Additional Notes</h2>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-2 text-white resize-none"
                placeholder="Write your thoughts about the movie..."
              ></textarea>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg">
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


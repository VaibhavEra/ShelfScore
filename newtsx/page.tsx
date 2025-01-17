import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import MoviePoster from './MoviePoster'
import MovieInfo from './MovieInfo'
import LogMovieForm from './LogMovieForm'

export default function MovieDetails() {
  // In a real application, you'd fetch this data from the TMDB API
  const movieData = {
    title: "Inception",
    releaseYear: 2010,
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    runtime: 148,
    genres: ["Action", "Sci-Fi", "Thriller"],
    tagline: "Your mind is the scene of the crime.",
    posterUrl: "/placeholder.svg?height=600&width=400"
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <Link href="/movies" className="inline-flex items-center mb-6 text-blue-400 hover:text-blue-300 transition-colors">
        <ArrowLeft className="mr-2" size={20} />
        Back
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <MoviePoster posterUrl={movieData.posterUrl} title={movieData.title} />
        <MovieInfo movie={movieData} />
      </div>
      <LogMovieForm />
    </div>
  )
}


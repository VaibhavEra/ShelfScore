import { Clock, Film } from 'lucide-react'

interface MovieInfoProps {
  movie: {
    title: string
    releaseYear: number
    overview: string
    runtime: number
    genres: string[]
    tagline: string
  }
}

function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export default function MovieInfo({ movie }: MovieInfoProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">{movie.title} <span className="text-2xl font-normal text-gray-400">({movie.releaseYear})</span></h1>
      <p className="text-lg">{movie.overview}</p>
      <div className="bg-gray-800 p-4 rounded-lg space-y-2">
        <div className="flex items-center">
          <Clock className="mr-2" size={20} />
          <span>{formatRuntime(movie.runtime)}</span>
        </div>
        <div className="flex items-center">
          <Film className="mr-2" size={20} />
          <span>{movie.genres.join(', ')}</span>
        </div>
        <p className="italic text-gray-400">&quot;{movie.tagline}&quot;</p>
      </div>
    </div>
  )
}


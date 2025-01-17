import Image from 'next/image'

export default function MoviePoster({ posterUrl, title }: { posterUrl: string, title: string }) {
  return (
    <div className="w-full max-w-md mx-auto md:mx-0">
      <Image
        src={posterUrl || "/placeholder.svg"}
        alt={`${title} poster`}
        width={400}
        height={600}
        className="rounded-lg shadow-lg w-full h-auto"
      />
    </div>
  )
}


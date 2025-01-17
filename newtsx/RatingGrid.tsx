'use client'

import { useState } from 'react'
import { Camera, BookOpen, Video, Users, Music, Scissors } from 'lucide-react'

const categories = [
  { name: 'Visuals', icon: Camera, emoji: '🎬' },
  { name: 'Story', icon: BookOpen, emoji: '📖' },
  { name: 'Direction', icon: Video, emoji: '🎥' },
  { name: 'Acting', icon: Users, emoji: '🎭' },
  { name: 'Sound', icon: Music, emoji: '🎵' },
  { name: 'Editing', icon: Scissors, emoji: '✂️' },
]

export default function RatingGrid() {
  const [ratings, setRatings] = useState<{ [key: string]: number }>({})
  const [hoveredRatings, setHoveredRatings] = useState<{ [key: string]: number }>({})

  const handleRatingChange = (category: string, rating: number) => {
    setRatings(prev => ({ ...prev, [category]: rating }))
  }

  const handleRatingHover = (category: string, rating: number) => {
    setHoveredRatings(prev => ({ ...prev, [category]: rating }))
  }

  const handleRatingLeave = (category: string) => {
    setHoveredRatings(prev => ({ ...prev, [category]: 0 }))
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.name} className="flex items-center space-x-4">
          <category.icon className="w-6 h-6 text-gray-400" />
          <span className="w-24">{category.name}</span>
          <div className="flex space-x-1">
            {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => (
              <label
                key={rating}
                className="flex items-center cursor-pointer"
                onMouseEnter={() => handleRatingHover(category.name, rating)}
                onMouseLeave={() => handleRatingLeave(category.name)}
              >
                <input
                  type="radio"
                  name={`rating-${category.name}`}
                  value={rating}
                  className="sr-only"
                  onChange={() => handleRatingChange(category.name, rating)}
                />
                <span
                  className={`text-2xl transition-opacity duration-200 ${
                    (hoveredRatings[category.name] || ratings[category.name] || 0) >= rating
                      ? 'opacity-100'
                      : 'opacity-30'
                  }`}
                  style={{
                    clipPath: rating % 1 === 0 ? 'none' : 'inset(0 50% 0 0)',
                  }}
                >
                  {category.emoji}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}


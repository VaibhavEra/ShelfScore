'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import RatingGrid from './RatingGrid'
import ShelfScore from './ShelfScore'
import SuccessNotification from './SuccessNotification'

export default function LogMovieForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 space-y-8">
      <h2 className="text-2xl font-semibold">Add Your ShelfScore</h2>
      <RatingGrid />
      <ShelfScore />
      <div>
        <label htmlFor="notable-points" className="block mb-2 font-medium">Notable Points</label>
        <Textarea
          id="notable-points"
          placeholder="What stood out about this movie?"
          className="w-full bg-gray-800 text-white border-gray-700"
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? "Logging..." : "Log Movie"}
      </Button>
      {showSuccess && <SuccessNotification />}
    </form>
  )
}


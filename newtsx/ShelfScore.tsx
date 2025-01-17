'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

const shelfOptions = [
  { value: "top", label: "Top Shelf", color: "bg-green-500 hover:bg-green-600" },
  { value: "second", label: "Second Shelf", color: "bg-blue-500 hover:bg-blue-600" },
  { value: "third", label: "Third Shelf", color: "bg-yellow-500 hover:bg-yellow-600" },
  { value: "drawer", label: "The Drawer", color: "bg-orange-500 hover:bg-orange-600" },
  { value: "trash", label: "Trash Bin", color: "bg-red-500 hover:bg-red-600" }
]

export default function ShelfScore() {
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Shelf Score</h3>
      <div className="flex flex-wrap gap-2">
        {shelfOptions.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            className={`${
              selectedShelf === option.value
                ? `${option.color} text-white`
                : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
            onClick={() => setSelectedShelf(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}


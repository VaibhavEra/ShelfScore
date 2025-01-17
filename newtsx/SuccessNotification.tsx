import { useState, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

export default function SuccessNotification() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => setIsVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <CheckCircle className="w-6 h-6" />
      <span>Movie logged successfully!</span>
    </div>
  )
}


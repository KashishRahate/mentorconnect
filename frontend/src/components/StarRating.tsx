"use client"

import type React from "react"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readOnly?: boolean
  size?: "sm" | "md" | "lg"
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, readOnly = false, size = "md" }) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onRatingChange?.(star)}
          disabled={readOnly}
          className={`${sizeClasses[size]} transition ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          } ${!readOnly && "hover:text-yellow-300 cursor-pointer"}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default StarRating

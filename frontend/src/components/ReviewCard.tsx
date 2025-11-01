"use client"

import type React from "react"
import StarRating from "./StarRating"

interface ReviewCardProps {
  menteeId: string
  menteeName?: string
  rating: number
  feedback: string
  createdAt: string
}

const ReviewCard: React.FC<ReviewCardProps> = ({ menteeId, menteeName, rating, feedback, createdAt }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-gray-900">{menteeName || "Anonymous"}</p>
          <p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
        </div>
        <StarRating rating={rating} readOnly size="sm" />
      </div>
      <p className="text-gray-700 leading-relaxed">{feedback}</p>
    </div>
  )
}

export default ReviewCard

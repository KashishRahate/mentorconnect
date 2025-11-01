"use client";

import React, { useState, useEffect, useContext } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";

interface BookingInfo {
  id: string;
  mentor_id: string;
  mentee_id: string;
  booking_date: string;
  booking_time: string;
  status: string;
}

const ReviewPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch booking");

      const data = await response.json();
      setBooking(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load booking");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!booking) throw new Error("Booking not found");

      const response = await fetch("http://localhost:5000/api/reviews/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mentor_id: booking.mentor_id,
          booking_id: bookingId,
          rating,
          feedback,
        }),
      });

      if (!response.ok) throw new Error("Review submission failed");

      setSuccess(true);
      setTimeout(() => {
        navigate("/mentee/dashboard");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <p className="text-gray-600">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-2">Leave a Review</h1>
          <p className="text-gray-600 mb-8">
            Share your experience from the session on{" "}
            {new Date(booking.booking_date).toLocaleDateString()}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              Thank you! Your review has been submitted successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                How would you rate this session?
              </label>
              <div className="flex items-center gap-4">
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size="lg"
                />
                <span className="text-2xl font-bold text-gray-900">
                  {rating}/5
                </span>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                {rating === 1 && "Poor - Needs improvement"}
                {rating === 2 && "Fair - Could be better"}
                {rating === 3 && "Good - Satisfactory"}
                {rating === 4 && "Very Good - Impressed"}
                {rating === 5 && "Excellent - Highly recommended"}
              </div>
            </div>

            {/* Feedback Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Your Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience. What did you learn? How was the mentor's teaching style? Any suggestions for improvement?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                rows={6}
              />
              <p className="text-sm text-gray-500 mt-2">
                {feedback.length}/500 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || success}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
              >
                {submitting
                  ? "Submitting..."
                  : success
                  ? "Review Submitted"
                  : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/mentee/dashboard")}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition"
              >
                Skip
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;

"use client";

import React, { useState, useEffect, useContext } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Calendar from "../components/Calendar";

interface TimeSlot {
  time: string;
  available: boolean;
}

const BookingPage: React.FC = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [mentorInfo, setMentorInfo] = useState<any>(null);

  useEffect(() => {
    if (date) {
      generateTimeSlots();
    }
  }, [date]);

  useEffect(() => {
    fetchMentorInfo();
  }, [mentorId]);

  const fetchMentorInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/mentors/${mentorId}`
      );
      const data = await response.json();
      setMentorInfo(data);
    } catch (err) {
      console.error("Failed to fetch mentor info:", err);
    }
  };

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 18; hour++) {
      const timeString = `${String(hour).padStart(2, "0")}:00`;
      slots.push({
        time: timeString,
        available: true,
      });
    }
    setTimeSlots(slots);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mentor_id: mentorId,
          booking_date: date,
          booking_time: time,
          notes,
        }),
      });

      if (!response.ok) throw new Error("Booking failed");

      const data = await response.json();
      navigate(`/session/${data.booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book a Session</h1>
          {mentorInfo && (
            <p className="text-gray-600">
              with{" "}
              <span className="font-semibold">{mentorInfo.users?.name}</span> -
              ${mentorInfo.hourly_rate}/hour
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Calendar */}
          <div>
            <Calendar
              onDateSelect={setDate}
              selectedDate={date}
              minDate={today}
            />
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Date
                </label>
                <input
                  type="text"
                  value={
                    date
                      ? new Date(date).toLocaleDateString()
                      : "No date selected"
                  }
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Slot
                </label>
                {date ? (
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setTime(slot.time)}
                        disabled={!slot.available}
                        className={`py-2 px-3 rounded-lg font-medium text-sm transition ${
                          time === slot.time
                            ? "bg-emerald-600 text-white"
                            : slot.available
                            ? "bg-gray-100 hover:bg-emerald-100 text-gray-900"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Select a date first</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell the mentor what you'd like to discuss..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  rows={4}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !date || !time}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

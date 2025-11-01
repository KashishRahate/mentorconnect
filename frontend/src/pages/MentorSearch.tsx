"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Mentor {
  id: string;
  user_id: string;
  expertise: string[] | string; // handle both array or string formats
  hourly_rate: number;
  average_rating: number;
  users?: {
    name?: string;
    bio?: string;
    profile_pic_url?: string;
  };
}

const MentorSearch: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [expertise, setExpertise] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMentors();
  }, [expertise]);

  // const fetchMentors = async () => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const url = new URL("http://localhost:5000/api/mentors/search");
  //     if (expertise) url.searchParams.append("expertise", expertise);

  //     const response = await fetch(url);
  //     const data = await response.json();

  //     if (!response.ok) {
  //       setError(data.error || data.message || "Failed to fetch mentors");
  //       setMentors([]);
  //       return;
  //     }

  //     // Ensure consistent structure for frontend
  //     const normalized = (Array.isArray(data) ? data : []).map((m) => ({
  //       ...m,
  //       users: m.users || { name: "Unknown", bio: "", profile_pic_url: "" },
  //       expertise: Array.isArray(m.expertise)
  //         ? m.expertise
  //         : typeof m.expertise === "string"
  //         ? m.expertise.split(",").map((s) => s.trim())
  //         : [],
  //     }));

  //     setMentors(normalized);
  //   } catch (error) {
  //     console.error("Failed to fetch mentors:", error);
  //     setError("Something went wrong while fetching mentors.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchMentors = async () => {
    // If user hasn’t typed anything, don’t send the request
    if (!expertise || expertise.trim() === "") {
      setMentors([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL("http://localhost:5000/api/mentors/search");
      url.searchParams.append("expertise", expertise.trim());

      const response = await fetch(url.toString());
      const data = await response.json();

      // If backend returns an error response
      if (!response.ok) {
        setError(data.error || data.message || "Failed to fetch mentors");
        setMentors([]);
        return;
      }

      // ✅ Normalize mentor data to prevent “undefined” errors
      const normalized = (Array.isArray(data) ? data : []).map((m: any) => ({
        id: m.id || m.mentor_id || Math.random().toString(36).substring(2),
        users: {
          name: m.users?.name || "Unknown",
          bio: m.users?.bio || "No bio available.",
          profile_pic_url: m.users?.profile_pic_url || "/default-avatar.png",
        },
        expertise: Array.isArray(m.expertise)
          ? m.expertise
          : typeof m.expertise === "string"
          ? m.expertise.split(",").map((s) => s.trim())
          : [],
        hourly_rate: m.hourly_rate || 0,
        rating: m.rating || 0.0,
      }));

      setMentors(normalized);
    } catch (error) {
      console.error("Failed to fetch mentors:", error);
      setError("Something went wrong while fetching mentors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchMentors();
    }, 400); // debounce for better UX
    return () => clearTimeout(delayDebounce);
  }, [expertise]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Find Your Mentor</h1>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by expertise..."
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600">
            Loading mentors...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No mentors found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* {mentors.map((mentor) => (
              <Link
                key={mentor.user_id}
                to={`/mentor/${mentor.user_id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              > */}
            {mentors.map((mentor, idx) => (
              <Link
                key={mentor.user_id || mentor.id || `mentor-${idx}`}
                to={`/mentor/${mentor.user_id || mentor.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={mentor.users?.profile_pic_url || "/placeholder.svg"}
                    alt={mentor.users?.name || "Mentor"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {mentor.users?.name || "Unnamed Mentor"}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm">
                        {mentor.average_rating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {mentor.users?.bio || "No bio available."}
                </p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(mentor.expertise) &&
                      mentor.expertise.slice(0, 3).map((exp, idx) => (
                        <span
                          key={idx}
                          className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded"
                        >
                          {exp}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="text-lg font-bold text-emerald-600">
                  ${mentor.hourly_rate}/hour
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorSearch;

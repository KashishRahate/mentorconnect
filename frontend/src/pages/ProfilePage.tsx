"use client";

import React, { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  profile_pic_url: string;
  linkedin_url: string;
  role: "mentor" | "mentee";
}

interface MentorProfile {
  expertise: string[];
  hourly_rate: number;
  years_of_experience: number;
  company: string;
}

interface MenteeProfile {
  learning_goals: string[];
  interests: string[];
}

const ProfilePage: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mentorData, setMentorData] = useState<MentorProfile | null>(null);
  const [menteeData, setMenteeData] = useState<MenteeProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profile_pic_url: "",
    linkedin_url: "",
    expertise: "",
    hourly_rate: 0,
    years_of_experience: 0,
    company: "",
    learning_goals: "",
    interests: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      setProfile(data);

      // Fetch role-specific data
      if (user?.role === "mentor") {
        const mentorRes = await fetch(
          `http://localhost:5000/api/mentors/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (mentorRes.ok) {
          const mentorInfo = await mentorRes.json();
          setMentorData(mentorInfo);
          setFormData((prev) => ({
            ...prev,
            expertise: mentorInfo.expertise?.join(", ") || "",
            hourly_rate: mentorInfo.hourly_rate || 0,
            years_of_experience: mentorInfo.years_of_experience || 0,
            company: mentorInfo.company || "",
          }));
        }
      } else {
        const menteeRes = await fetch(
          `http://localhost:5000/api/users/${user?.id}/mentee-profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (menteeRes.ok) {
          const menteeInfo = await menteeRes.json();
          setMenteeData(menteeInfo);
          setFormData((prev) => ({
            ...prev,
            learning_goals: menteeInfo.learning_goals?.join(", ") || "",
            interests: menteeInfo.interests?.join(", ") || "",
          }));
        }
      }

      setFormData((prev) => ({
        ...prev,
        name: data.name || "",
        bio: data.bio || "",
        profile_pic_url: data.profile_pic_url || "",
        linkedin_url: data.linkedin_url || "",
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "hourly_rate" || name === "years_of_experience"
          ? Number(value)
          : value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Update basic profile
      const profileUpdate = {
        name: formData.name,
        bio: formData.bio,
        profile_pic_url: formData.profile_pic_url,
        linkedin_url: formData.linkedin_url,
      };

      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileUpdate),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      // Update role-specific data
      if (user?.role === "mentor") {
        const mentorUpdate = {
          expertise: formData.expertise.split(",").map((e) => e.trim()),
          hourly_rate: formData.hourly_rate,
          years_of_experience: formData.years_of_experience,
          company: formData.company,
        };

        const mentorRes = await fetch(
          `http://localhost:5000/api/mentors/${user.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(mentorUpdate),
          }
        );

        if (!mentorRes.ok) throw new Error("Failed to update mentor profile");
      } else {
        const menteeUpdate = {
          learning_goals: formData.learning_goals
            .split(",")
            .map((g) => g.trim()),
          interests: formData.interests.split(",").map((i) => i.trim()),
        };

        const menteeRes = await fetch(
          `http://localhost:5000/api/users/${user?.id}/mentee-profile`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(menteeUpdate),
          }
        );

        if (!menteeRes.ok) throw new Error("Failed to update mentee profile");
      }

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      await fetchProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Profile not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex gap-8 mb-8">
            {profile.profile_pic_url && (
              <img
                src={profile.profile_pic_url || "/placeholder.svg"}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
              <p className="text-gray-600 mb-2">{profile.email}</p>
              <p className="text-gray-600 mb-4 capitalize">
                Role: {profile.role}
              </p>
              {profile.bio && <p className="text-gray-700">{profile.bio}</p>}
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          ) : (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture URL
                    </label>
                    <input
                      type="url"
                      name="profile_pic_url"
                      value={formData.profile_pic_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Mentor-specific fields */}
              {user?.role === "mentor" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Mentor Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expertise (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="expertise"
                        value={formData.expertise}
                        onChange={handleInputChange}
                        placeholder="e.g., React, Node.js, Python"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hourly Rate ($)
                      </label>
                      <input
                        type="number"
                        name="hourly_rate"
                        value={formData.hourly_rate}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        name="years_of_experience"
                        value={formData.years_of_experience}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mentee-specific fields */}
              {user?.role === "mentee" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Mentee Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Learning Goals (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="learning_goals"
                        value={formData.learning_goals}
                        onChange={handleInputChange}
                        placeholder="e.g., Learn React, Build projects"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interests (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="interests"
                        value={formData.interests}
                        onChange={handleInputChange}
                        placeholder="e.g., Web Development, AI"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

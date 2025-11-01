import React, { useState, useEffect, useContext } from "react";

import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect with Expert Mentors
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            MentorConnect bridges the gap between experienced professionals and
            eager learners. Find your perfect mentor or share your expertise
            with the next generation.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Get Started
            </Link>
            <Link
              to="/mentors"
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-lg font-semibold"
            >
              Browse Mentors
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose MentorConnect?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Expert Matching</h3>
              <p className="text-gray-600">
                Find mentors based on expertise, experience, and learning goals.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-4">📹</div>
              <h3 className="text-xl font-semibold mb-2">Video Sessions</h3>
              <p className="text-gray-600">
                Seamless video conferencing with integrated Jitsi Meet.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Verified Reviews</h3>
              <p className="text-gray-600">
                Build trust through transparent ratings and feedback.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

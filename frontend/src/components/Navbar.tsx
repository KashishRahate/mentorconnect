"use client";

import React, { useState, useEffect, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            MentorConnect
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <span className="text-sm">Welcome, {user?.name}</span>
                <Link to="/profile" className="hover:text-emerald-100">
                  Profile
                </Link>
                {user?.role === "mentor" && (
                  <Link
                    to="/mentor/dashboard"
                    className="hover:text-emerald-100"
                  >
                    Dashboard
                  </Link>
                )}
                {user?.role === "mentee" && (
                  <>
                    <Link to="/mentors" className="hover:text-emerald-100">
                      Find Mentors
                    </Link>
                    <Link
                      to="/mentee/dashboard"
                      className="hover:text-emerald-100"
                    >
                      Dashboard
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-emerald-100">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

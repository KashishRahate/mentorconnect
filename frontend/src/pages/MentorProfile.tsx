// "use client";

// import React, { useState, useEffect, useContext } from "react";

// import { useParams, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// interface MentorData {
//   user_id: string;
//   expertise: string[];
//   hourly_rate: number;
//   average_rating: number;
//   years_of_experience: number;
//   company: string;
//   users: {
//     name: string;
//     bio: string;
//     profile_pic_url: string;
//     linkedin_url: string;
//   };
// }

// interface Review {
//   id: string;
//   rating: number;
//   feedback: string;
//   mentee_id: string;
// }

// const MentorProfile: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const { isAuthenticated, user } = useAuth();
//   const [mentor, setMentor] = useState<MentorData | null>(null);
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchMentorData();
//   }, [id]);

//   const fetchMentorData = async () => {
//     try {
//       const mentorRes = await fetch(`http://localhost:5000/api/mentors/${id}`);
//       const mentorData = await mentorRes.json();
//       setMentor(mentorData);

//       const reviewsRes = await fetch(
//         `http://localhost:5000/api/reviews/mentor/${id}`
//       );
//       const reviewsData = await reviewsRes.json();
//       setReviews(reviewsData);
//     } catch (error) {
//       console.error("Failed to fetch mentor data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="text-center py-12">Loading...</div>;
//   if (!mentor) return <div className="text-center py-12">Mentor not found</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Profile Header */}
//         <div className="bg-white rounded-lg shadow p-8 mb-8">
//           <div className="flex gap-8 mb-8">
//             {mentor.users.profile_pic_url && (
//               <img
//                 src={mentor.users.profile_pic_url || "/placeholder.svg"}
//                 alt={mentor.users.name}
//                 className="w-32 h-32 rounded-full"
//               />
//             )}
//             <div className="flex-1">
//               <h1 className="text-4xl font-bold mb-2">{mentor.users.name}</h1>
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="flex items-center gap-1">
//                   <span className="text-yellow-500 text-xl">★</span>
//                   <span className="text-lg font-semibold">
//                     {mentor.average_rating.toFixed(1)}
//                   </span>
//                 </div>
//                 <span className="text-gray-600">{mentor.company}</span>
//               </div>
//               <p className="text-gray-600 mb-4">{mentor.users.bio}</p>
//               <div className="flex gap-4">
//                 {mentor.users.linkedin_url && (
//                   <a
//                     href={mentor.users.linkedin_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:text-blue-800"
//                   >
//                     LinkedIn Profile
//                   </a>
//                 )}
//                 {isAuthenticated &&
//                   user?.role === "mentee" &&
//                   user?.id !== mentor.user_id && (
//                     <Link
//                       to={`/booking/${mentor.user_id}`}
//                       className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
//                     >
//                       Book Session
//                     </Link>
//                   )}
//               </div>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6 border-t pt-8">
//             <div>
//               <p className="text-gray-600 text-sm">Experience</p>
//               <p className="text-2xl font-bold">
//                 {mentor.years_of_experience} years
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm">Hourly Rate</p>
//               <p className="text-2xl font-bold">${mentor.hourly_rate}</p>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm">Expertise Areas</p>
//               <p className="text-lg font-semibold">
//                 {mentor.expertise.length} topics
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Expertise */}
//         <div className="bg-white rounded-lg shadow p-8 mb-8">
//           <h2 className="text-2xl font-bold mb-4">Areas of Expertise</h2>
//           <div className="flex flex-wrap gap-3">
//             {mentor.expertise.map((exp, idx) => (
//               <span
//                 key={idx}
//                 className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full"
//               >
//                 {exp}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Reviews */}
//         <div className="bg-white rounded-lg shadow p-8">
//           <h2 className="text-2xl font-bold mb-6">Reviews</h2>
//           {reviews.length === 0 ? (
//             <p className="text-gray-600">No reviews yet</p>
//           ) : (
//             <div className="space-y-6">
//               {reviews.map((review) => (
//                 <div key={review.id} className="border-b pb-6 last:border-b-0">
//                   <div className="flex items-center gap-2 mb-2">
//                     <span className="text-yellow-500">★</span>
//                     <span className="font-semibold">{review.rating}/5</span>
//                   </div>
//                   <p className="text-gray-700">{review.feedback}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorProfile;

// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// interface MentorData {
//   user_id: string;
//   expertise: string[];
//   hourly_rate: number;
//   average_rating: number;
//   years_of_experience: number;
//   company: string;
//   users?: {
//     name?: string;
//     bio?: string;
//     profile_pic_url?: string;
//     linkedin_url?: string;
//   };
// }

// interface Review {
//   id: string;
//   rating: number;
//   feedback: string;
//   mentee_id: string;
// }

// const MentorProfile: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const { isAuthenticated, user } = useAuth();

//   const [mentor, setMentor] = useState<MentorData | null>(null);
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (id) fetchMentorData();
//   }, [id]);

//   const fetchMentorData = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const mentorRes = await fetch(`http://localhost:5000/api/mentors/${id}`);
//       const mentorData = await mentorRes.json();

//       if (!mentorRes.ok) {
//         setError(mentorData.error || "Mentor not found");
//         setMentor(null);
//         return;
//       }

//       // Normalize to prevent undefined access
//       const safeMentor: MentorData = {
//         ...mentorData,
//         users: mentorData.users || {
//           name: "Unknown",
//           bio: "No bio available.",
//           profile_pic_url: "",
//           linkedin_url: "",
//         },
//         expertise: Array.isArray(mentorData.expertise)
//           ? mentorData.expertise
//           : typeof mentorData.expertise === "string"
//           ? mentorData.expertise.split(",").map((s: string) => s.trim())
//           : [],
//       };

//       setMentor(safeMentor);

//       // Fetch reviews only after mentor is confirmed valid
//       const reviewsRes = await fetch(
//         `http://localhost:5000/api/reviews/mentor/${id}`
//       );
//       const reviewsData = await reviewsRes.json();
//       setReviews(Array.isArray(reviewsData) ? reviewsData : []);
//     } catch (err) {
//       console.error("Failed to fetch mentor data:", err);
//       setError("Something went wrong while fetching mentor data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UI States
//   if (loading) return <div className="text-center py-12">Loading...</div>;
//   if (error)
//     return <div className="text-center py-12 text-red-500">{error}</div>;
//   if (!mentor) return <div className="text-center py-12">Mentor not found</div>;

//   const userInfo = mentor.users || {};

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Profile Header */}
//         <div className="bg-white rounded-lg shadow p-8 mb-8">
//           <div className="flex flex-col md:flex-row gap-8 mb-8">
//             <img
//               src={userInfo.profile_pic_url || "/placeholder.svg"}
//               alt={userInfo.name || "Unknown"}
//               className="w-32 h-32 rounded-full object-cover"
//             />
//             <div className="flex-1">
//               <h1 className="text-4xl font-bold mb-2">
//                 {userInfo.name || "Unknown"}
//               </h1>
//               <div className="flex flex-wrap items-center gap-4 mb-4">
//                 <div className="flex items-center gap-1">
//                   <span className="text-yellow-500 text-xl">★</span>
//                   <span className="text-lg font-semibold">
//                     {mentor.average_rating
//                       ? mentor.average_rating.toFixed(1)
//                       : "0.0"}
//                   </span>
//                 </div>
//                 {mentor.company && (
//                   <span className="text-gray-600">{mentor.company}</span>
//                 )}
//               </div>
//               <p className="text-gray-600 mb-4">
//                 {userInfo.bio || "No bio available."}
//               </p>
//               <div className="flex flex-wrap gap-4">
//                 {userInfo.linkedin_url && (
//                   <a
//                     href={userInfo.linkedin_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:text-blue-800"
//                   >
//                     LinkedIn Profile
//                   </a>
//                 )}
//                 {isAuthenticated &&
//                   user?.role === "mentee" &&
//                   user?.id !== mentor.user_id && (
//                     <Link
//                       to={`/booking/${mentor.user_id}`}
//                       className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
//                     >
//                       Book Session
//                     </Link>
//                   )}
//               </div>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6 border-t pt-8">
//             <div>
//               <p className="text-gray-600 text-sm">Experience</p>
//               <p className="text-2xl font-bold">
//                 {mentor.years_of_experience || 0} years
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm">Hourly Rate</p>
//               <p className="text-2xl font-bold">${mentor.hourly_rate || 0}</p>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm">Expertise Areas</p>
//               <p className="text-lg font-semibold">
//                 {mentor.expertise.length} topics
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Expertise */}
//         <div className="bg-white rounded-lg shadow p-8 mb-8">
//           <h2 className="text-2xl font-bold mb-4">Areas of Expertise</h2>
//           {mentor.expertise.length > 0 ? (
//             <div className="flex flex-wrap gap-3">
//               {mentor.expertise.map((exp, idx) => (
//                 <span
//                   key={`${exp}-${idx}`}
//                   className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full"
//                 >
//                   {exp}
//                 </span>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-600">No expertise listed.</p>
//           )}
//         </div>

//         {/* Reviews */}
//         <div className="bg-white rounded-lg shadow p-8">
//           <h2 className="text-2xl font-bold mb-6">Reviews</h2>
//           {reviews.length === 0 ? (
//             <p className="text-gray-600">No reviews yet</p>
//           ) : (
//             <div className="space-y-6">
//               {reviews.map((review) => (
//                 <div key={review.id} className="border-b pb-6 last:border-b-0">
//                   <div className="flex items-center gap-2 mb-2">
//                     <span className="text-yellow-500">★</span>
//                     <span className="font-semibold">{review.rating}/5</span>
//                   </div>
//                   <p className="text-gray-700">{review.feedback}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorProfile;

"use client";

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import md5 from "md5"; // ✅ For generating Gravatar hash

interface MentorData {
  user_id: string;
  expertise: string[];
  hourly_rate: number;
  average_rating: number;
  years_of_experience: number;
  company: string;
  users?: {
    name?: string;
    bio?: string;
    profile_pic_url?: string;
    linkedin_url?: string;
    email?: string;
  };
}

interface Review {
  id: string;
  rating: number;
  feedback: string;
  mentee_id: string;
}

const MentorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();

  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchMentorData();
  }, [id]);

  const fetchMentorData = async () => {
    setLoading(true);
    setError(null);

    try {
      const mentorRes = await fetch(`http://localhost:5000/api/mentors/${id}`);
      const mentorData = await mentorRes.json();

      if (!mentorRes.ok) {
        setError(mentorData.error || "Mentor not found");
        setMentor(null);
        return;
      }

      // Normalize to prevent undefined access
      const safeMentor: MentorData = {
        ...mentorData,
        users: mentorData.users || {
          name: "Unknown",
          bio: "No bio available.",
          profile_pic_url: "",
          linkedin_url: "",
          email: "",
        },
        expertise: Array.isArray(mentorData.expertise)
          ? mentorData.expertise
          : typeof mentorData.expertise === "string"
          ? mentorData.expertise.split(",").map((s: string) => s.trim())
          : [],
      };

      setMentor(safeMentor);

      // Fetch reviews only after mentor is confirmed valid
      const reviewsRes = await fetch(
        `http://localhost:5000/api/reviews/mentor/${id}`
      );
      const reviewsData = await reviewsRes.json();
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error("Failed to fetch mentor data:", err);
      setError("Something went wrong while fetching mentor data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Generate avatar URL (Gravatar fallback)
  const getAvatarUrl = (profilePicUrl?: string, email?: string) => {
    if (profilePicUrl) return profilePicUrl;
    const hash = email
      ? md5(email.trim().toLowerCase())
      : md5("default@example.com");
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&size=200`;
  };

  // UI States
  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error)
    return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!mentor) return <div className="text-center py-12">Mentor not found</div>;

  const userInfo = mentor.users || {};

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* ✅ Avatar with Gravatar Fallback */}
            <img
              src={getAvatarUrl(userInfo.profile_pic_url, userInfo.email)}
              alt={userInfo.name || "Unknown"}
              className="w-32 h-32 rounded-full object-cover border border-gray-200 shadow-sm"
            />

            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">
                {userInfo.name || "Unknown"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="text-lg font-semibold">
                    {mentor.average_rating
                      ? mentor.average_rating.toFixed(1)
                      : "0.0"}
                  </span>
                </div>
                {mentor.company && (
                  <span className="text-gray-600">{mentor.company}</span>
                )}
              </div>
              <p className="text-gray-600 mb-4">
                {userInfo.bio || "No bio available."}
              </p>
              <div className="flex flex-wrap gap-4">
                {userInfo.linkedin_url && (
                  <a
                    href={userInfo.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    LinkedIn Profile
                  </a>
                )}
                {isAuthenticated &&
                  user?.role === "mentee" &&
                  user?.id !== mentor.user_id && (
                    <Link
                      to={`/booking/${mentor.user_id}`}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
                    >
                      Book Session
                    </Link>
                  )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 border-t pt-8">
            <div>
              <p className="text-gray-600 text-sm">Experience</p>
              <p className="text-2xl font-bold">
                {mentor.years_of_experience || 0} years
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Hourly Rate</p>
              <p className="text-2xl font-bold">${mentor.hourly_rate || 0}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Expertise Areas</p>
              <p className="text-lg font-semibold">
                {mentor.expertise.length} topics
              </p>
            </div>
          </div>
        </div>

        {/* Expertise */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Areas of Expertise</h2>
          {mentor.expertise.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {mentor.expertise.map((exp, idx) => (
                <span
                  key={`${exp}-${idx}`}
                  className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full"
                >
                  {exp}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No expertise listed.</p>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{review.rating}/5</span>
                  </div>
                  <p className="text-gray-700">{review.feedback}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;

// "use client";

// import React, { useState, useEffect, useContext } from "react";

// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import JitsiMeeting from "../components/JitsiMeeting";

// interface BookingInfo {
//   id: string;
//   mentor_id: string;
//   mentee_id: string;
//   booking_date: string;
//   booking_time: string;
//   jitsi_room_id: string;
//   status: string;
//   notes: string;
// }

// interface SessionInfo {
//   id: string;
//   booking_id: string;
//   mentor_id: string;
//   mentee_id: string;
//   start_time: string;
//   status: string;
// }

// const SessionPage: React.FC = () => {
//   const { bookingId } = useParams<{ bookingId: string }>();
//   const { user, token } = useAuth();
//   const navigate = useNavigate();
//   const [booking, setBooking] = useState<BookingInfo | null>(null);
//   const [session, setSession] = useState<SessionInfo | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [sessionActive, setSessionActive] = useState(false);
//   const [showEndConfirm, setShowEndConfirm] = useState(false);

//   useEffect(() => {
//     fetchBookingAndStartSession();
//   }, [bookingId]);

//   const fetchBookingAndStartSession = async () => {
//     try {
//       setLoading(true);
//       // Fetch booking details
//       const bookingRes = await fetch(
//         `http://localhost:5000/api/bookings/${bookingId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (!bookingRes.ok) throw new Error("Failed to fetch booking");

//       const bookingData = await bookingRes.json();
//       setBooking(bookingData);

//       // Start session
//       const sessionRes = await fetch("http://localhost:5000/api/sessions/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ booking_id: bookingId }),
//       });

//       if (sessionRes.ok) {
//         const sessionData = await sessionRes.json();
//         setSession(sessionData.session);
//         setSessionActive(true);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to start session");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEndSession = async () => {
//     try {
//       if (!session) return;

//       const response = await fetch(
//         `http://localhost:5000/api/sessions/${session.id}/end`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({}),
//         }
//       );

//       if (response.ok) {
//         // Update booking status to completed
//         await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ status: "completed" }),
//         });

//         setSessionActive(false);
//         navigate("/mentee/dashboard");
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to end session");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//           <p className="text-white text-lg">Loading session...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-400 text-lg mb-4">{error}</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!booking) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <p className="text-white text-lg">Booking not found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col">
//       {/* Header */}
//       <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
//         <div>
//           <h1 className="text-white text-xl font-semibold">Video Session</h1>
//           <p className="text-gray-400 text-sm mt-1">
//             {new Date(booking.booking_date).toLocaleDateString()} at{" "}
//             {booking.booking_time}
//           </p>
//         </div>
//         <div className="flex items-center gap-4">
//           {sessionActive && (
//             <button
//               onClick={() => setShowEndConfirm(true)}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
//             >
//               End Session
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Jitsi Meeting */}
//       <div className="flex-1 relative">
//         {booking.jitsi_room_id && (
//           <JitsiMeeting
//             roomName={booking.jitsi_room_id}
//             userName={user?.name || "User"}
//             userEmail={user?.email || ""}
//             onConferenceJoined={() => setSessionActive(true)}
//             onConferenceLeft={() => setSessionActive(false)}
//           />
//         )}
//       </div>

//       {/* End Session Confirmation Modal */}
//       {showEndConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
//             <h2 className="text-xl font-bold mb-4">End Session?</h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to end this session? This action cannot be
//               undone.
//             </p>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setShowEndConfirm(false)}
//                 className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEndSession}
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
//               >
//                 End Session
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SessionPage;

// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import JitsiMeeting from "../components/JitsiMeeting";

// interface BookingInfo {
//   id: string;
//   mentor_id: string;
//   mentee_id: string;
//   booking_date: string;
//   booking_time: string;
//   jitsi_room_id: string;
//   status: string;
//   notes: string;
// }

// interface SessionInfo {
//   id: string;
//   booking_id: string;
//   mentor_id: string;
//   mentee_id: string;
//   start_time: string;
//   status: string;
// }

// const SessionPage: React.FC = () => {
//   const { bookingId } = useParams<{ bookingId: string }>();
//   const { user, token } = useAuth();
//   const navigate = useNavigate();
//   const [booking, setBooking] = useState<BookingInfo | null>(null);
//   const [session, setSession] = useState<SessionInfo | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [sessionActive, setSessionActive] = useState(false);
//   const [showEndConfirm, setShowEndConfirm] = useState(false);

//   useEffect(() => {
//     fetchBookingAndStartSession();
//   }, [bookingId]);

//   const fetchBookingAndStartSession = async () => {
//     try {
//       setLoading(true);

//       // ✅ 1. Fetch booking details
//       const bookingRes = await fetch(
//         `http://localhost:5000/api/bookings/${bookingId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (!bookingRes.ok) throw new Error("Failed to fetch booking");

//       const bookingData = await bookingRes.json();
//       setBooking(bookingData);

//       // ✅ 2. If session doesn't exist yet, create it
//       const sessionRes = await fetch("http://localhost:5000/api/sessions/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ booking_id: bookingId }),
//       });

//       if (sessionRes.ok) {
//         const sessionData = await sessionRes.json();
//         setSession(sessionData.session);
//         setSessionActive(true);
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err instanceof Error ? err.message : "Failed to start session");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEndSession = async () => {
//     try {
//       if (!session) return;

//       // ✅ End session
//       const response = await fetch(
//         `http://localhost:5000/api/sessions/${session.id}/end`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.ok) {
//         // ✅ Mark booking completed
//         await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ status: "completed" }),
//         });

//         setSessionActive(false);

//         // ✅ Redirect based on role
//         if (user?.role === "mentor") navigate("/mentor/dashboard");
//         else navigate("/mentee/dashboard");
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err instanceof Error ? err.message : "Failed to end session");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//           <p className="text-white text-lg">Loading session...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-400 text-lg mb-4">{error}</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!booking) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <p className="text-white text-lg">Booking not found</p>
//       </div>
//     );
//   }

//   // ✅ Generate room name (fallback if jitsi_room_id missing)
//   const roomName = booking.jitsi_room_id || `mentorconnect_${booking.id}`;

//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col">
//       {/* Header */}
//       <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
//         <div>
//           <h1 className="text-white text-xl font-semibold">Video Session</h1>
//           <p className="text-gray-400 text-sm mt-1">
//             {new Date(booking.booking_date).toLocaleDateString()} at{" "}
//             {booking.booking_time}
//           </p>
//         </div>
//         <div className="flex items-center gap-4">
//           {sessionActive && (
//             <button
//               onClick={() => setShowEndConfirm(true)}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
//             >
//               End Session
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ✅ Jitsi Meeting */}
//       <div className="flex-1 relative">
//         <JitsiMeeting
//           roomName={roomName}
//           userName={user?.name || "User"}
//           userEmail={user?.email || ""}
//           onConferenceJoined={() => setSessionActive(true)}
//           onConferenceLeft={() => setSessionActive(false)}
//         />
//       </div>

//       {/* ✅ End Session Confirmation Modal */}
//       {showEndConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
//             <h2 className="text-xl font-bold mb-4">End Session?</h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to end this session? This action cannot be
//               undone.
//             </p>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setShowEndConfirm(false)}
//                 className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEndSession}
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
//               >
//                 End Session
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SessionPage;

// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import JitsiMeeting from "../components/JitsiMeeting";

// interface BookingInfo {
//   id: string;
//   mentor_id: string;
//   mentee_id: string;
//   booking_date: string;
//   booking_time: string;
//   jitsi_room_id: string;
//   status: string;
//   notes: string;
// }

// interface SessionInfo {
//   id: string;
//   booking_id: string;
//   mentor_id: string;
//   mentee_id: string;
//   start_time: string;
//   status: string;
// }

// const SessionPage: React.FC = () => {
//   const { bookingId } = useParams<{ bookingId: string }>();
//   const { user, token } = useAuth();
//   const navigate = useNavigate();
//   const [booking, setBooking] = useState<BookingInfo | null>(null);
//   const [session, setSession] = useState<SessionInfo | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [sessionActive, setSessionActive] = useState(false);
//   const [showEndConfirm, setShowEndConfirm] = useState(false);

//   useEffect(() => {
//     fetchBookingAndStartSession();
//   }, [bookingId]);

//   const fetchBookingAndStartSession = async () => {
//     try {
//       setLoading(true);
//       const bookingRes = await fetch(
//         `http://localhost:5000/api/bookings/${bookingId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (!bookingRes.ok) throw new Error("Failed to fetch booking");

//       const bookingData = await bookingRes.json();
//       setBooking(bookingData);

//       const sessionRes = await fetch("http://localhost:5000/api/sessions/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ booking_id: bookingId }),
//       });

//       if (sessionRes.ok) {
//         const sessionData = await sessionRes.json();
//         setSession(sessionData.session);
//         setSessionActive(true);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to start session");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEndSession = async () => {
//     try {
//       if (!session) return;

//       const response = await fetch(
//         `http://localhost:5000/api/sessions/${session.id}/end`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({}),
//         }
//       );

//       if (response.ok) {
//         await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ status: "completed" }),
//         });

//         setSessionActive(false);
//         navigate("/mentee/dashboard");
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to end session");
//     }
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//           <p className="text-white text-lg">Loading session...</p>
//         </div>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-400 text-lg mb-4">{error}</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );

//   if (!booking)
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <p className="text-white text-lg">Booking not found</p>
//       </div>
//     );

//   const isMentor = user?.role === "mentor";
//   const roomPath = isMentor
//     ? `mod/${booking.jitsi_room_id}`
//     : booking.jitsi_room_id;

//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col">
//       <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
//         <div>
//           <h1 className="text-white text-xl font-semibold">Video Session</h1>
//           <p className="text-gray-400 text-sm mt-1">
//             {new Date(booking.booking_date).toLocaleDateString()} at{" "}
//             {booking.booking_time}
//           </p>
//         </div>
//         {sessionActive && (
//           <button
//             onClick={() => setShowEndConfirm(true)}
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
//           >
//             End Session
//           </button>
//         )}
//       </div>

//       <div className="flex-1 relative">
//         {booking.jitsi_room_id && (
//           <JitsiMeeting
//             roomName={roomPath}
//             userName={user?.name || "User"}
//             userEmail={user?.email || ""}
//             onConferenceJoined={() => setSessionActive(true)}
//             onConferenceLeft={() => setSessionActive(false)}
//           />
//         )}
//       </div>

//       {showEndConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
//             <h2 className="text-xl font-bold mb-4">End Session?</h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to end this session? This action cannot be
//               undone.
//             </p>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setShowEndConfirm(false)}
//                 className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEndSession}
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
//               >
//                 End Session
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SessionPage;

// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import JitsiMeeting from "../components/JitsiMeeting";

// interface BookingInfo {
//   id: string;
//   mentor_id: string;
//   mentee_id: string;
//   booking_date: string;
//   booking_time: string;
//   jitsi_room_id: string;
//   status: string;
//   notes: string;
// }

// const SessionPage: React.FC = () => {
//   const { bookingId } = useParams<{ bookingId: string }>();
//   const { user, token } = useAuth();
//   const navigate = useNavigate();

//   const [booking, setBooking] = useState<BookingInfo | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [waitingForMentor, setWaitingForMentor] = useState(false);
//   const [error, setError] = useState("");
//   const [showEndConfirm, setShowEndConfirm] = useState(false);

//   useEffect(() => {
//     fetchBooking();
//   }, [bookingId]);

//   const fetchBooking = async () => {
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/bookings/${bookingId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (!res.ok) throw new Error("Failed to fetch booking");
//       const data = await res.json();
//       setBooking(data);
//       if (user?.role === "mentee" && data.status !== "confirmed") {
//         setWaitingForMentor(true);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEndSession = async () => {
//     try {
//       if (!booking) return;

//       const response = await fetch(
//         `http://localhost:5000/api/bookings/${booking.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ status: "completed" }),
//         }
//       );

//       if (response.ok) {
//         navigate(
//           user?.role === "mentor" ? "/mentor/dashboard" : "/mentee/dashboard"
//         );
//       }
//     } catch {
//       setError("Failed to end session");
//     }
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
//         Loading session...
//       </div>
//     );

//   if (error)
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400">
//         {error}
//       </div>
//     );

//   if (!booking)
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
//         Booking not found
//       </div>
//     );

//   // ✅ Mentee waits until mentor confirms and joins
//   if (user?.role === "mentee" && booking.status !== "confirmed") {
//     return (
//       <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
//         <p className="text-xl mb-4">
//           ⏳ Waiting for Mentor to Start the Session
//         </p>
//         <p className="text-gray-400">Please wait until your mentor joins...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col">
//       {/* Header */}
//       <div className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
//         <h1 className="text-white text-xl font-semibold">
//           Video Session ({user?.role === "mentor" ? "Moderator" : "Participant"}
//           )
//         </h1>
//         <button
//           onClick={() => setShowEndConfirm(true)}
//           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
//         >
//           End Session
//         </button>
//       </div>

//       {/* Jitsi Video */}
//       <div className="flex-1">
//         <JitsiMeeting
//           roomName={booking.jitsi_room_id}
//           userName={user?.name || "User"}
//           userEmail={user?.email || ""}
//           isModerator={user?.role === "mentor"}
//         />
//       </div>

//       {/* End Confirmation */}
//       {showEndConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
//             <h2 className="text-xl font-bold mb-4">End Session?</h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to end this session? This cannot be undone.
//             </p>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setShowEndConfirm(false)}
//                 className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEndSession}
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
//               >
//                 End
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SessionPage;

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import JitsiMeeting from "../components/JitsiMeeting";

interface BookingInfo {
  id: string;
  mentor_id: string;
  mentee_id: string;
  booking_date: string;
  booking_time: string;
  jitsi_room_id: string;
  status: string;
  notes: string;
}

const SessionPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [error, setError] = useState("");

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
      setError("Unable to load booking details.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!booking) return;
    try {
      await fetch(`http://localhost:5000/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "completed" }),
      });
      setSessionActive(false);
      navigate("/mentor/dashboard");
    } catch {
      setError("Failed to end session");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading session...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400">
        {error}
      </div>
    );

  if (!booking)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Booking not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-white text-xl font-semibold">
            Video Session {user?.id === booking.mentor_id ? "(Moderator)" : ""}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {new Date(booking.booking_date).toLocaleDateString()} at{" "}
            {booking.booking_time}
          </p>
        </div>
        {sessionActive && (
          <button
            onClick={() => setShowEndConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            End Session
          </button>
        )}
      </div>

      {/* Video Meeting */}
      <div className="flex-1">
        <JitsiMeeting
          roomName={booking.jitsi_room_id}
          userName={user?.name || "User"}
          userEmail={user?.email || ""}
          isModerator={user?.id === booking.mentor_id}
          onConferenceJoined={() => setSessionActive(true)}
          onConferenceLeft={() => setSessionActive(false)}
        />
      </div>

      {/* Confirm End */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h2 className="text-lg font-bold mb-4">End Session?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to end this session?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEndSession}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionPage;

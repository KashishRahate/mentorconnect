// "use client";

// import React, { useState, useEffect, useContext } from "react";

// import { useAuth } from "../context/AuthContext";
// import Calendar from "../components/Calendar";

// interface Booking {
//   id: string;
//   mentee_id: string;
//   booking_date: string;
//   booking_time: string;
//   status: string;
//   notes: string;
// }

// const MentorDashboard: React.FC = () => {
//   const { user, token } = useAuth();
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [availability, setAvailability] = useState<{ [key: string]: boolean }>(
//     {}
//   );

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/bookings/mentor/${user?.id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await response.json();
//       setBookings(data);
//     } catch (error) {
//       console.error("Failed to fetch bookings:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredBookings = selectedDate
//     ? bookings.filter((b) => b.booking_date === selectedDate)
//     : bookings.filter(
//         (b) => b.status === "confirmed" || b.status === "pending"
//       );

//   const upcomingCount = bookings.filter((b) => b.status === "confirmed").length;
//   const completedCount = bookings.filter(
//     (b) => b.status === "completed"
//   ).length;

//   const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/bookings/${bookingId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       if (response.ok) {
//         await fetchBookings();
//       }
//     } catch (error) {
//       console.error("Failed to update booking:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-4xl font-bold mb-8">Mentor Dashboard</h1>

//         <div className="grid md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Total Bookings</p>
//             <p className="text-3xl font-bold">{bookings.length}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Confirmed</p>
//             <p className="text-3xl font-bold">{upcomingCount}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Completed</p>
//             <p className="text-3xl font-bold">{completedCount}</p>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 mb-8">
//           {/* Calendar */}
//           <div className="md:col-span-1">
//             <Calendar
//               onDateSelect={setSelectedDate}
//               selectedDate={selectedDate}
//             />
//           </div>

//           {/* Bookings List */}
//           <div className="md:col-span-2 bg-white rounded-lg shadow">
//             <div className="p-6 border-b">
//               <h2 className="text-2xl font-bold">
//                 {selectedDate
//                   ? `Sessions on ${new Date(selectedDate).toLocaleDateString()}`
//                   : "Upcoming Sessions"}
//               </h2>
//             </div>
//             {loading ? (
//               <div className="p-6 text-center">Loading...</div>
//             ) : filteredBookings.length === 0 ? (
//               <div className="p-6 text-center text-gray-600">
//                 {selectedDate ? "No sessions on this date" : "No bookings yet"}
//               </div>
//             ) : (
//               <div className="divide-y">
//                 {filteredBookings.map((booking) => (
//                   <div key={booking.id} className="p-6 hover:bg-gray-50">
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <p className="font-semibold text-lg">
//                           {new Date(booking.booking_date).toLocaleDateString()}{" "}
//                           at {booking.booking_time}
//                         </p>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {booking.notes}
//                         </p>
//                       </div>
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                           booking.status === "confirmed"
//                             ? "bg-green-100 text-green-800"
//                             : booking.status === "pending"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {booking.status}
//                       </span>
//                     </div>
//                     {booking.status === "pending" && (
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() =>
//                             handleStatusUpdate(booking.id, "confirmed")
//                           }
//                           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Confirm
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleStatusUpdate(booking.id, "cancelled")
//                           }
//                           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Decline
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorDashboard;

// "use client";

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { Link } from "react-router-dom";
// import Calendar from "../components/Calendar";

// interface Booking {
//   id: string;
//   mentee_id: string;
//   booking_date: string;
//   booking_time: string;
//   status: string;
//   notes: string;
//   jitsi_room_id?: string; // ✅ Add room ID support
// }

// const MentorDashboard: React.FC = () => {
//   const { user, token } = useAuth();
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `http://localhost:5000/api/bookings/mentor/${user?.id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch bookings");
//       const data = await response.json();
//       setBookings(data);
//     } catch (error) {
//       console.error("Failed to fetch bookings:", error);
//       setError("Unable to load bookings.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredBookings = selectedDate
//     ? bookings.filter((b) => b.booking_date === selectedDate)
//     : bookings.filter(
//         (b) => b.status === "confirmed" || b.status === "pending"
//       );

//   const upcomingCount = bookings.filter((b) => b.status === "confirmed").length;
//   const completedCount = bookings.filter(
//     (b) => b.status === "completed"
//   ).length;

//   const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/bookings/${bookingId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       if (response.ok) {
//         await fetchBookings();
//       } else {
//         console.error("Failed to update booking");
//       }
//     } catch (error) {
//       console.error("Error updating booking:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-4xl font-bold mb-8">Mentor Dashboard</h1>

//         {/* Summary Cards */}
//         <div className="grid md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Total Bookings</p>
//             <p className="text-3xl font-bold">{bookings.length}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Confirmed</p>
//             <p className="text-3xl font-bold">{upcomingCount}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Completed</p>
//             <p className="text-3xl font-bold">{completedCount}</p>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 mb-8">
//           {/* Calendar */}
//           <div className="md:col-span-1">
//             <Calendar
//               onDateSelect={setSelectedDate}
//               selectedDate={selectedDate}
//             />
//           </div>

//           {/* Bookings List */}
//           <div className="md:col-span-2 bg-white rounded-lg shadow">
//             <div className="p-6 border-b">
//               <h2 className="text-2xl font-bold">
//                 {selectedDate
//                   ? `Sessions on ${new Date(selectedDate).toLocaleDateString()}`
//                   : "Upcoming Sessions"}
//               </h2>
//             </div>

//             {loading ? (
//               <div className="p-6 text-center">Loading...</div>
//             ) : error ? (
//               <div className="p-6 text-center text-red-500">{error}</div>
//             ) : filteredBookings.length === 0 ? (
//               <div className="p-6 text-center text-gray-600">
//                 {selectedDate ? "No sessions on this date" : "No bookings yet"}
//               </div>
//             ) : (
//               <div className="divide-y">
//                 {filteredBookings.map((booking) => (
//                   <div key={booking.id} className="p-6 hover:bg-gray-50">
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <p className="font-semibold text-lg">
//                           {new Date(booking.booking_date).toLocaleDateString()}{" "}
//                           at {booking.booking_time}
//                         </p>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {booking.notes || "No additional notes"}
//                         </p>
//                       </div>
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                           booking.status === "confirmed"
//                             ? "bg-green-100 text-green-800"
//                             : booking.status === "pending"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : booking.status === "completed"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {booking.status}
//                       </span>
//                     </div>

//                     {/* ✅ Approve / Decline Buttons */}
//                     {booking.status === "pending" && (
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() =>
//                             handleStatusUpdate(booking.id, "confirmed")
//                           }
//                           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Confirm
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleStatusUpdate(booking.id, "cancelled")
//                           }
//                           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Decline
//                         </button>
//                       </div>
//                     )}

//                     {/* ✅ Join Session Button for Confirmed Sessions */}
//                     {booking.status === "confirmed" && (
//                       <div className="mt-4">
//                         <Link
//                           to={`/session/${booking.id}`}
//                           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Join Session
//                         </Link>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorDashboard;

// "use client";

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { Link } from "react-router-dom";
// import Calendar from "../components/Calendar";

// interface Booking {
//   id: string;
//   mentee_id: string;
//   booking_date: string;
//   booking_time: string;
//   status: string;
//   notes: string;
// }

// const MentorDashboard: React.FC = () => {
//   const { user, token } = useAuth();
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `http://localhost:5000/api/bookings/mentor/${user?.id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch bookings");
//       const data = await response.json();
//       setBookings(data);
//     } catch (error) {
//       console.error("Failed to fetch bookings:", error);
//       setError("Unable to load bookings.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredBookings = selectedDate
//     ? bookings.filter((b) => b.booking_date === selectedDate)
//     : bookings.filter(
//         (b) => b.status === "confirmed" || b.status === "pending"
//       );

//   const upcomingCount = bookings.filter((b) => b.status === "confirmed").length;
//   const completedCount = bookings.filter(
//     (b) => b.status === "completed"
//   ).length;

//   const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/bookings/${bookingId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       if (response.ok) {
//         await fetchBookings();
//       } else {
//         console.error("Failed to update booking");
//       }
//     } catch (error) {
//       console.error("Error updating booking:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-4xl font-bold mb-8">Mentor Dashboard</h1>

//         {/* Summary Cards */}
//         <div className="grid md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Total Bookings</p>
//             <p className="text-3xl font-bold">{bookings.length}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Confirmed</p>
//             <p className="text-3xl font-bold">{upcomingCount}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Completed</p>
//             <p className="text-3xl font-bold">{completedCount}</p>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 mb-8">
//           <div className="md:col-span-1">
//             <Calendar
//               onDateSelect={setSelectedDate}
//               selectedDate={selectedDate}
//             />
//           </div>

//           <div className="md:col-span-2 bg-white rounded-lg shadow">
//             <div className="p-6 border-b">
//               <h2 className="text-2xl font-bold">
//                 {selectedDate
//                   ? `Sessions on ${new Date(selectedDate).toLocaleDateString()}`
//                   : "Upcoming Sessions"}
//               </h2>
//             </div>

//             {loading ? (
//               <div className="p-6 text-center">Loading...</div>
//             ) : error ? (
//               <div className="p-6 text-center text-red-500">{error}</div>
//             ) : filteredBookings.length === 0 ? (
//               <div className="p-6 text-center text-gray-600">
//                 {selectedDate ? "No sessions on this date" : "No bookings yet"}
//               </div>
//             ) : (
//               <div className="divide-y">
//                 {filteredBookings.map((booking) => (
//                   <div key={booking.id} className="p-6 hover:bg-gray-50">
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <p className="font-semibold text-lg">
//                           {new Date(booking.booking_date).toLocaleDateString()}{" "}
//                           at {booking.booking_time}
//                         </p>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {booking.notes || "No additional notes"}
//                         </p>
//                       </div>
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                           booking.status === "confirmed"
//                             ? "bg-green-100 text-green-800"
//                             : booking.status === "pending"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : booking.status === "completed"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {booking.status}
//                       </span>
//                     </div>

//                     {booking.status === "pending" && (
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() =>
//                             handleStatusUpdate(booking.id, "confirmed")
//                           }
//                           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Confirm
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleStatusUpdate(booking.id, "cancelled")
//                           }
//                           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Decline
//                         </button>
//                       </div>
//                     )}

//                     {booking.status === "confirmed" && (
//                       <div className="mt-4">
//                         <Link
//                           to={`/session/${booking.id}?room=mentorconnect_${booking.id}`}
//                           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Join Session
//                         </Link>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorDashboard;

// "use client";

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { Link, useNavigate } from "react-router-dom";
// import Calendar from "../components/Calendar";

// interface Booking {
//   id: string;
//   mentee_id: string;
//   booking_date: string;
//   booking_time: string;
//   status: string;
//   notes: string;
//   jitsi_room_id?: string;
// }

// const MentorDashboard: React.FC = () => {
//   const { user, token } = useAuth();
//   const navigate = useNavigate();
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `http://localhost:5000/api/bookings/mentor/${user?.id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch bookings");
//       const data = await response.json();
//       setBookings(data);
//     } catch (error) {
//       console.error("Failed to fetch bookings:", error);
//       setError("Unable to load bookings.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/bookings/${bookingId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       if (response.ok) {
//         await fetchBookings();

//         // ✅ Automatically redirect mentor to session page after confirming
//         if (newStatus === "confirmed") {
//           navigate(`/session/${bookingId}`);
//         }
//       } else {
//         console.error("Failed to update booking");
//       }
//     } catch (error) {
//       console.error("Error updating booking:", error);
//     }
//   };

//   const filteredBookings = selectedDate
//     ? bookings.filter((b) => b.booking_date === selectedDate)
//     : bookings.filter(
//         (b) => b.status === "confirmed" || b.status === "pending"
//       );

//   const upcomingCount = bookings.filter((b) => b.status === "confirmed").length;
//   const completedCount = bookings.filter(
//     (b) => b.status === "completed"
//   ).length;

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-4xl font-bold mb-8">Mentor Dashboard</h1>

//         {/* Summary Cards */}
//         <div className="grid md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Total Bookings</p>
//             <p className="text-3xl font-bold">{bookings.length}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Confirmed</p>
//             <p className="text-3xl font-bold">{upcomingCount}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Completed</p>
//             <p className="text-3xl font-bold">{completedCount}</p>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 mb-8">
//           {/* Calendar */}
//           <div className="md:col-span-1">
//             <Calendar
//               onDateSelect={setSelectedDate}
//               selectedDate={selectedDate}
//             />
//           </div>

//           {/* Bookings List */}
//           <div className="md:col-span-2 bg-white rounded-lg shadow">
//             <div className="p-6 border-b">
//               <h2 className="text-2xl font-bold">
//                 {selectedDate
//                   ? `Sessions on ${new Date(selectedDate).toLocaleDateString()}`
//                   : "Upcoming Sessions"}
//               </h2>
//             </div>

//             {loading ? (
//               <div className="p-6 text-center">Loading...</div>
//             ) : error ? (
//               <div className="p-6 text-center text-red-500">{error}</div>
//             ) : filteredBookings.length === 0 ? (
//               <div className="p-6 text-center text-gray-600">
//                 {selectedDate ? "No sessions on this date" : "No bookings yet"}
//               </div>
//             ) : (
//               <div className="divide-y">
//                 {filteredBookings.map((booking) => (
//                   <div key={booking.id} className="p-6 hover:bg-gray-50">
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <p className="font-semibold text-lg">
//                           {new Date(booking.booking_date).toLocaleDateString()}{" "}
//                           at {booking.booking_time}
//                         </p>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {booking.notes || "No additional notes"}
//                         </p>
//                       </div>
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                           booking.status === "confirmed"
//                             ? "bg-green-100 text-green-800"
//                             : booking.status === "pending"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : booking.status === "completed"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {booking.status}
//                       </span>
//                     </div>

//                     {/* ✅ Approve / Decline Buttons */}
//                     {booking.status === "pending" && (
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() =>
//                             handleStatusUpdate(booking.id, "confirmed")
//                           }
//                           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Confirm & Join
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleStatusUpdate(booking.id, "cancelled")
//                           }
//                           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Decline
//                         </button>
//                       </div>
//                     )}

//                     {/* ✅ Join Session Button for Confirmed Sessions */}
//                     {booking.status === "confirmed" && (
//                       <div className="mt-4">
//                         <Link
//                           to={`/session/${booking.id}`}
//                           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Join Session
//                         </Link>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorDashboard;

// "use client";

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { Link } from "react-router-dom";
// import Calendar from "../components/Calendar";

// interface Booking {
//   id: string;
//   mentee_id: string;
//   booking_date: string;
//   booking_time: string;
//   status: string;
//   notes: string;
//   jitsi_room_id?: string;
// }

// const MentorDashboard: React.FC = () => {
//   const { user, token } = useAuth();
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `http://localhost:5000/api/bookings/mentor/${user?.id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (!response.ok) throw new Error("Failed to fetch bookings");
//       const data = await response.json();
//       setBookings(data);
//     } catch (error) {
//       console.error("Failed to fetch bookings:", error);
//       setError("Unable to load bookings.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/bookings/${bookingId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       if (response.ok) {
//         await fetchBookings();
//       } else {
//         console.error("Failed to update booking");
//       }
//     } catch (error) {
//       console.error("Error updating booking:", error);
//     }
//   };

//   const filteredBookings = selectedDate
//     ? bookings.filter((b) => b.booking_date === selectedDate)
//     : bookings.filter(
//         (b) => b.status === "confirmed" || b.status === "pending"
//       );

//   const upcomingCount = bookings.filter((b) => b.status === "confirmed").length;
//   const completedCount = bookings.filter(
//     (b) => b.status === "completed"
//   ).length;

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-4xl font-bold mb-8">Mentor Dashboard</h1>

//         {/* Summary */}
//         <div className="grid md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Total Bookings</p>
//             <p className="text-3xl font-bold">{bookings.length}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Confirmed</p>
//             <p className="text-3xl font-bold">{upcomingCount}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Completed</p>
//             <p className="text-3xl font-bold">{completedCount}</p>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 mb-8">
//           <div className="md:col-span-1">
//             <Calendar
//               onDateSelect={setSelectedDate}
//               selectedDate={selectedDate}
//             />
//           </div>

//           <div className="md:col-span-2 bg-white rounded-lg shadow">
//             <div className="p-6 border-b">
//               <h2 className="text-2xl font-bold">
//                 {selectedDate
//                   ? `Sessions on ${new Date(selectedDate).toLocaleDateString()}`
//                   : "Upcoming Sessions"}
//               </h2>
//             </div>

//             {loading ? (
//               <div className="p-6 text-center">Loading...</div>
//             ) : error ? (
//               <div className="p-6 text-center text-red-500">{error}</div>
//             ) : filteredBookings.length === 0 ? (
//               <div className="p-6 text-center text-gray-600">
//                 {selectedDate ? "No sessions on this date" : "No bookings yet"}
//               </div>
//             ) : (
//               <div className="divide-y">
//                 {filteredBookings.map((booking) => (
//                   <div key={booking.id} className="p-6 hover:bg-gray-50">
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <p className="font-semibold text-lg">
//                           {new Date(booking.booking_date).toLocaleDateString()}{" "}
//                           at {booking.booking_time}
//                         </p>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {booking.notes || "No additional notes"}
//                         </p>
//                       </div>
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                           booking.status === "confirmed"
//                             ? "bg-green-100 text-green-800"
//                             : booking.status === "pending"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : booking.status === "completed"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {booking.status}
//                       </span>
//                     </div>

//                     {/* ✅ Pending Requests */}
//                     {booking.status === "pending" && (
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() =>
//                             handleStatusUpdate(booking.id, "confirmed")
//                           }
//                           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Confirm
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleStatusUpdate(booking.id, "cancelled")
//                           }
//                           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Decline
//                         </button>
//                       </div>
//                     )}

//                     {/* ✅ Join Button for Confirmed */}
//                     {booking.status === "confirmed" && (
//                       <div className="mt-4">
//                         <Link
//                           to={`/session/${booking.id}`}
//                           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Start Session (Moderator)
//                         </Link>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorDashboard;

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Calendar from "../components/Calendar";

interface Booking {
  id: string;
  mentee_id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  notes: string;
  jitsi_room_id?: string;
}

const MentorDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/mentor/${user?.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setBookings(data);
    } catch (e) {
      console.error("Failed to fetch:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = selectedDate
    ? bookings.filter((b) => b.booking_date === selectedDate)
    : bookings;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Mentor Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Bookings</p>
            <p className="text-3xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Confirmed</p>
            <p className="text-3xl font-bold">
              {bookings.filter((b) => b.status === "confirmed").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-3xl font-bold">
              {bookings.filter((b) => b.status === "completed").length}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Calendar
              onDateSelect={setSelectedDate}
              selectedDate={selectedDate}
            />
          </div>

          <div className="md:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
            </div>

            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : (
              <div className="divide-y">
                {filtered.map((b) => (
                  <div key={b.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">
                          {b.booking_date} at {b.booking_time}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">{b.notes}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          b.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : b.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    {b.status === "pending" && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(b.id, "confirmed")}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(b.id, "cancelled")}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {b.status === "confirmed" && (
                      <div className="mt-4">
                        <Link
                          to={`/session/${b.id}`}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Start Session
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;

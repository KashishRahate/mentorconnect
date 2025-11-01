// "use client";

// import React, { useState, useEffect, useContext } from "react";

// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import Calendar from "../components/Calendar";

// interface Booking {
//   id: string;
//   mentor_id: string;
//   booking_date: string;
//   booking_time: string;
//   status: string;
// }

// const MenteeDashboard: React.FC = () => {
//   const { user, token } = useAuth();
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState("");

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/bookings/mentee/${user?.id}`,
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

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-4xl font-bold">Mentee Dashboard</h1>
//           <Link
//             to="/mentors"
//             className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
//           >
//             Find Mentors
//           </Link>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Total Sessions</p>
//             <p className="text-3xl font-bold">{bookings.length}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Upcoming</p>
//             <p className="text-3xl font-bold">
//               {bookings.filter((b) => b.status === "confirmed").length}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Completed</p>
//             <p className="text-3xl font-bold">
//               {bookings.filter((b) => b.status === "completed").length}
//             </p>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8">
//           {/* Calendar */}
//           <div className="md:col-span-1">
//             <Calendar
//               onDateSelect={setSelectedDate}
//               selectedDate={selectedDate}
//             />
//           </div>

//           {/* Sessions List */}
//           <div className="md:col-span-2 bg-white rounded-lg shadow">
//             <div className="p-6 border-b">
//               <h2 className="text-2xl font-bold">
//                 {selectedDate
//                   ? `Sessions on ${new Date(selectedDate).toLocaleDateString()}`
//                   : "Your Sessions"}
//               </h2>
//             </div>
//             {loading ? (
//               <div className="p-6 text-center">Loading...</div>
//             ) : filteredBookings.length === 0 ? (
//               <div className="p-6 text-center text-gray-600">
//                 {selectedDate ? (
//                   "No sessions on this date"
//                 ) : (
//                   <>
//                     No sessions booked yet.{" "}
//                     <Link
//                       to="/mentors"
//                       className="text-emerald-600 hover:text-emerald-700 font-semibold"
//                     >
//                       Find a mentor
//                     </Link>
//                   </>
//                 )}
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
//                           Mentor ID: {booking.mentor_id}
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
//                     <div className="flex gap-2">
//                       {booking.status === "completed" ? (
//                         <Link
//                           to={`/review/${booking.id}`}
//                           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Leave Review
//                         </Link>
//                       ) : (
//                         <Link
//                           to={`/session/${booking.id}`}
//                           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Join Session
//                         </Link>
//                       )}
//                     </div>
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

// export default MenteeDashboard;

// "use client";

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import Calendar from "../components/Calendar";

// interface Booking {
//   id: string;
//   mentor_id: string;
//   booking_date: string;
//   booking_time: string;
//   status: string;
// }

// const MenteeDashboard: React.FC = () => {
//   const { user, token } = useAuth();
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState("");

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/bookings/mentee/${user?.id}`,
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

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-4xl font-bold">Mentee Dashboard</h1>
//           <Link
//             to="/mentors"
//             className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
//           >
//             Find Mentors
//           </Link>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Total Sessions</p>
//             <p className="text-3xl font-bold">{bookings.length}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Upcoming</p>
//             <p className="text-3xl font-bold">
//               {bookings.filter((b) => b.status === "confirmed").length}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Completed</p>
//             <p className="text-3xl font-bold">
//               {bookings.filter((b) => b.status === "completed").length}
//             </p>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8">
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
//                   : "Your Sessions"}
//               </h2>
//             </div>

//             {loading ? (
//               <div className="p-6 text-center">Loading...</div>
//             ) : filteredBookings.length === 0 ? (
//               <div className="p-6 text-center text-gray-600">
//                 {selectedDate ? (
//                   "No sessions on this date"
//                 ) : (
//                   <>
//                     No sessions booked yet.{" "}
//                     <Link
//                       to="/mentors"
//                       className="text-emerald-600 hover:text-emerald-700 font-semibold"
//                     >
//                       Find a mentor
//                     </Link>
//                   </>
//                 )}
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
//                           Mentor ID: {booking.mentor_id}
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
//                     <div className="flex gap-2">
//                       {booking.status === "completed" ? (
//                         <Link
//                           to={`/review/${booking.id}`}
//                           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Leave Review
//                         </Link>
//                       ) : (
//                         <Link
//                           to={`/session/${booking.id}?room=mentorconnect_${booking.id}`}
//                           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Join Session
//                         </Link>
//                       )}
//                     </div>
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

// export default MenteeDashboard;

// "use client";

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import Calendar from "../components/Calendar";

// interface Booking {
//   id: string;
//   mentor_id: string;
//   booking_date: string;
//   booking_time: string;
//   status: string;
// }

// const MenteeDashboard: React.FC = () => {
//   const { user, token } = useAuth();
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState("");

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/bookings/mentee/${user?.id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
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

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-4xl font-bold">Mentee Dashboard</h1>
//           <Link
//             to="/mentors"
//             className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
//           >
//             Find Mentors
//           </Link>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Total Sessions</p>
//             <p className="text-3xl font-bold">{bookings.length}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Upcoming</p>
//             <p className="text-3xl font-bold">
//               {bookings.filter((b) => b.status === "confirmed").length}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <p className="text-gray-600 text-sm">Completed</p>
//             <p className="text-3xl font-bold">
//               {bookings.filter((b) => b.status === "completed").length}
//             </p>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8">
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
//                   : "Your Sessions"}
//               </h2>
//             </div>

//             {loading ? (
//               <div className="p-6 text-center">Loading...</div>
//             ) : filteredBookings.length === 0 ? (
//               <div className="p-6 text-center text-gray-600">
//                 {selectedDate ? (
//                   "No sessions on this date"
//                 ) : (
//                   <>
//                     No sessions booked yet.{" "}
//                     <Link
//                       to="/mentors"
//                       className="text-emerald-600 hover:text-emerald-700 font-semibold"
//                     >
//                       Find a mentor
//                     </Link>
//                   </>
//                 )}
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
//                           Mentor ID: {booking.mentor_id}
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

//                     <div className="flex gap-2">
//                       {booking.status === "completed" ? (
//                         <Link
//                           to={`/review/${booking.id}`}
//                           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Leave Review
//                         </Link>
//                       ) : (
//                         <Link
//                           to={`/session/${booking.id}`}
//                           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
//                         >
//                           Join Session
//                         </Link>
//                       )}
//                     </div>
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

// export default MenteeDashboard;

"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Calendar from "../components/Calendar";

interface Booking {
  id: string;
  mentor_id: string;
  booking_date: string;
  booking_time: string;
  status: string;
}

const MenteeDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/mentee/${user?.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = selectedDate
    ? bookings.filter((b) => b.booking_date === selectedDate)
    : bookings.filter(
        (b) => b.status === "confirmed" || b.status === "pending"
      );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Mentee Dashboard</h1>
          <Link
            to="/mentors"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
          >
            Find Mentors
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Sessions</p>
            <p className="text-3xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Upcoming</p>
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

        {/* Calendar and Session List */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Calendar
              onDateSelect={setSelectedDate}
              selectedDate={selectedDate}
            />
          </div>

          <div className="md:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {selectedDate
                  ? `Sessions on ${new Date(selectedDate).toLocaleDateString()}`
                  : "Your Sessions"}
              </h2>
            </div>

            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                No sessions booked yet.
              </div>
            ) : (
              <div className="divide-y">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold text-lg">
                          {new Date(booking.booking_date).toLocaleDateString()}{" "}
                          at {booking.booking_time}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          Mentor ID: {booking.mentor_id}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {booking.status === "completed" ? (
                        <Link
                          to={`/review/${booking.id}`}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Leave Review
                        </Link>
                      ) : booking.status === "confirmed" ? (
                        <Link
                          to={`/session/${booking.id}`}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Join Session
                        </Link>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Awaiting mentor confirmation
                        </p>
                      )}
                    </div>
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

export default MenteeDashboard;

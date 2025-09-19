import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "@clerk/clerk-react";

const Mybookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const { user } = useUser();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bookings from backend
  const fetchBookings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/mybooking/user/${user.id}`);
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings); // Assuming backend sends { bookings: [...] }
      } else {
        console.error(data.message || "Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchBookings();
  }, [user]);

  if (isLoading) return <Loading />;

  return (
    <div className="relative flex flex-col min-h-screen px-6 md:px-16 lg:px-40 pt-24 bg-black">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle top="0px" right="0px" />

      <h2 className="text-3xl font-bold text-center mb-10 text-purple-600">
        My Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings found.</p>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 text-black"
            >
              <p>
                <strong>Restaurant:</strong> {booking.restaurantName}
              </p>
              <p>
                <strong>Seats:</strong> {booking.seatNumbers.join(", ")}
              </p>
              <p>
                <strong>From:</strong>{" "}
                {new Date(booking.bookingFrom).toLocaleString()}
              </p>
              <p>
                <strong>To:</strong>{" "}
                {new Date(booking.bookingTo).toLocaleString()}
              </p>
              <p>
                <strong>Amount Paid:</strong> ₹
                {booking.amount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mybookings;

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlurCircle from "../components/BlurCircle"; // import your BlurCircle

function Success() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const confirmBooking = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/confirm-booking`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();
        if (res.ok) {
          setMessage("Payment Successful 🎉");
          setBooking(data.booking);
        } else {
          setMessage(data.message || "Error confirming booking.");
        }
      } catch (err) {
        setMessage("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) confirmBooking();
  }, [sessionId]);

  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden">
      <BlurCircle top="-150px" left="-100px" />
      <BlurCircle bottom="-150px" right="-100px" />


      <div className="flex-1 flex items-center justify-center px-4 py-10 relative z-10">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-200 text-center transform transition duration-500 hover:scale-105">
          {loading ? (
            <h2 className="text-xl font-semibold text-gray-700 animate-pulse">
              Finalizing Booking...
            </h2>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-6 text-green-600">{message}</h2>

              {booking && (
                <div className="space-y-3 text-left bg-blue-50 p-6 rounded-xl shadow-inner border border-blue-100 text-gray-800">
                  <p><strong>Restaurant:</strong> {booking.restaurantName}</p>
                  <p><strong>Seats:</strong> {booking.seatNumbers.join(", ")}</p>
                  <p><strong>From:</strong> {new Date(booking.bookingFrom).toLocaleString()}</p>
                  <p><strong>To:</strong> {new Date(booking.bookingTo).toLocaleString()}</p>
                </div>
              )}

              <button
                onClick={() => navigate("/")}
                className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-8 rounded-xl font-semibold shadow-lg transition transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go Home
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
}

export default Success;

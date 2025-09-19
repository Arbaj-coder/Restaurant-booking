import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

function Payment() {
  const { count } = useParams(); // seat count from URL
  const location = useLocation();
  const { seatCount, seatNumbers, restaurantId, bookingFrom, bookingTo } = location.state || {};
  const { user } = useUser(); // ✅ correct hook

  const seatPrice = 300;
  const gstRate = 0.18;

  const [subtotal, setSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sub = seatCount * seatPrice;
    const gstAmount = sub * gstRate;
    setSubtotal(sub);
    setGst(gstAmount);
    setTotal(sub + gstAmount);
  }, [seatCount]);

  const handlePayment = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/create-checkout-session`, {
        userId: user?.id,     // ✅ Clerk se userId bhejna
        restaurantId,
        seatNumbers,
        seatCount: seatNumbers.length,
        bookingFrom,
        bookingTo,
        totalAmount: total,
      });

      const data = res.data; // ✅ axios ka response
      if (data.url) {
        window.location.href = data.url; // Stripe redirect
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Payment error, please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Payment Box */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border">
          <h2 className="text-2xl font-semibold mb-6 text-center">Payment Summary</h2>

          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Seats Selected</span>
              <span>{seatCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Price per Seat</span>
              <span>₹{seatPrice}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition active:scale-95"
          >
            Pay Now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Payment;

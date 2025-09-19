import React from "react";
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-3xl font-bold text-red-600">❌ Payment Cancelled</h1>
      <p className="mt-3 text-gray-700">Your booking was not completed.</p>
      <Link to="/" className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Back to Home
      </Link>
    </div>
  );
};

export default Cancel;

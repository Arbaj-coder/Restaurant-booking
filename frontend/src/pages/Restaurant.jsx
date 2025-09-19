import React, { useState, useEffect } from "react";
import axios from "axios";
import ResturantCard from "../components/ResturantCard";
import BlurCircle from "../components/BlurCircle";

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 search input

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/restaurants`);
        setRestaurants(res.data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // ✅ filter restaurants by name/title
  const filteredRestaurants = restaurants.filter((rest) =>
    rest.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-semibold">⏳ Loading Restaurants...</h1>
      </div>
    );
  }

  return (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="150px" right="0px" />

      {/* 🔍 Search Input */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search restaurants by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <h1 className="text-lg font-medium my-4">Now Showing</h1>

      {filteredRestaurants.length > 0 ? (
        <div className="flex flex-wrap max-sm:justify-center gap-8">
          {filteredRestaurants.map((rest) => (
            <ResturantCard rest={rest} key={rest._id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold text-center text-gray-400">
            🚫 No restaurants match your search
          </h1>
        </div>
      )}
    </div>
  );
};

export default Restaurant;

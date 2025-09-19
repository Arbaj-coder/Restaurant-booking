import React, { useState, useEffect } from "react";
import axios from "axios";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

const TrailersSection = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [currentIframe, setCurrentIframe] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/restaurants`);
        setRestaurants(res.data);

        // Default: pehla restaurant ka iframe
        if (res.data.length > 0) {
          setCurrentIframe(res.data[0].youtubeLink);
        }
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
        Previews
      </p>

      <div className="relative mt-6">
        <BlurCircle left="-100px" bottom="100px" />
        <BlurCircle right="-100px" top="100px" />

        {/* Show iframe */}
        {currentIframe && (
          <div
            className="mx-auto max-w-full"
            style={{ width: "960px", height: "400px" }}
            dangerouslySetInnerHTML={{ __html: currentIframe }}
          />
        )}

        {/* Thumbnails */}
        <div className="group grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
          {restaurants
            .filter((r) => r.youtubeLink && r.youtubeLink !== currentIframe)
            .slice(0, 4)
            .map((restaurant) => (
              <div
                key={restaurant._id}
                className="relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition max-md:h-60 cursor-pointer"
                onClick={() => setCurrentIframe(restaurant.youtubeLink)}
              >
                <img
                  src={restaurant.poster_path}
                  alt={restaurant.title}
                  className="rounded-lg w-full h-full object-cover brightness-75"
                />
                <PlayCircleIcon
                  strokeWidth={1.6}
                  className="absolute top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TrailersSection;

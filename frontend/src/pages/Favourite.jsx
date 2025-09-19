import React, { useEffect, useState } from "react";
import ResturantCard from "../components/ResturantCard";
import BlurCircle from "../components/BlurCircle";
import { useUser } from "@clerk/clerk-react";

const Favourite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Destructure from Clerk
  const { isLoaded, isSignedIn, user } = useUser();

  const fetchFavorites = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/isfav/${user.id}`);
      const data = await res.json();

      if (res.ok) {
        setFavorites(data.favorites || []);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchFavorites();
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || loading) {
    return (
      <h1 className="text-center animate-pulse text-lg text-primary mt-40 min-h-screen">
        Loading Favorites...
      </h1>
    );
  }

  if (!isSignedIn) {
    return (
      <h1 className="text-center text-lg text-red-500 mt-40 min-h-screen">
        Please sign in to see your favorites
      </h1>
    );
  }

  return favorites.length > 0 ? (
    <div className="flex flex-col min-h-screen mt-40 gap-5 flex-wrap w-full">
      <BlurCircle top="100px" left="300px" />
      <BlurCircle top="600px" right="400px" />

      <p className="md:mx-15 mx-5 font-semibold">Your Favorite Restaurants</p>

      <div className="flex flex-wrap gap-5 max-md:justify-center md:mx-15 mx-5">
        {favorites.map((restaurant) => (
          <ResturantCard key={restaurant._id} rest={restaurant} />
        ))}
      </div>
    </div>
  ) : (
    <div>
      <BlurCircle top="100px" left="300px" />
      <BlurCircle top="600px" right="400px" />
      <h1 className="text-center animate-pulse text-lg text-primary mt-40 min-h-screen">
        No Favorite Restaurant Added Yet
      </h1>
    </div>
  );
};

export default Favourite;

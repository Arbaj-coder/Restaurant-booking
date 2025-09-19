import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";   // 👈 Clerk
import BlurCircle from '../components/BlurCircle';
import { ArrowRight, Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import DateSeleect from '../components/DateSeleect';
import ResturantCard from '../components/ResturantCard';
import Loading from '../components/Loading';
import { Star } from "lucide-react";

const RestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();   // 👈 Clerk user

  const [restaurant, setRestaurant] = useState(null);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        // fetch single restaurant
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/restaurants/${id}`);
        const data = await res.json();
        setRestaurant(data);

        // fetch all restaurants for "You may also like"
        const resAll = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/restaurants`);
        const allData = await resAll.json();
        setAllRestaurants(allData.filter(r => r._id !== id));

        // check if favorite
       // check if favorite
if (user?.id) {
  const favRes = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/isfav/${user.id}`);
  const favData = await favRes.json();

  const favIds = favData.favorites.map(f => f._id?.toString() || f.toString());
  setIsFavorite(favIds.includes(id));
}

      } catch (err) {
        console.error("Error fetching restaurant:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id, user]);

  const handleFavorite = async (id) => {
    if (!user) return alert("Please login to favorite!");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/isfav/${user.id}/favorite/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setIsFavorite(data.isFavorite);
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };

  if (loading) return <Loading />;
  if (!restaurant) return <p className='text-center mt-20'>Restaurant not found</p>;
  
const handleRating = async (rating) => {
  if (!user) return alert("Please login to rate!");

  setUserRating(rating);
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/ratings/${id}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });

    const data = await res.json();
    setRestaurant((prev) => ({
      ...prev,
      vote_average: data.vote_average,
      vote_count: data.vote_count,
    }));
  } catch (err) {
    console.error("Error submitting rating:", err);
  }
};

  return (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto pb-30'>
        <img src={restaurant.poster_path} alt={restaurant.title} className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'/>
        <div className='relative flex flex-col gap-3'>  
          <BlurCircle top="-100px" left="-500px"/>
          <p className='text-primary'>CUISINES: {restaurant.cuisines.map(c=>c.name).join(", ")}</p>
          <h1 className='text-4xl font-semibold max-w-96 text-balance'>{restaurant.title}</h1>
          <div className='flex items-center gap-2 text-gray-300'>
            <StarIcon className='w-5 h-5 text-primary fill-primary'/>
            {restaurant.vote_average.toFixed(1)} User Rating
          </div>
          <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>{restaurant.overview}</p>
          <div className='flex items-center gap-4 mt-4'>
            <button className='flex items-center gap-2 px-10 py-3 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer text-sm text-white active:scale-95'>
              <PlayCircleIcon className='w-5 h-5'/> 
              Watch Preview
            </button>
            <a href="#dateselect" className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'>
              Reserve Table
            </a>
            <button 
              onClick={()=>handleFavorite(restaurant._id)} 
              className='flex items-center cursor-pointer gap-2 px-2 py-2 bg-gray-800 hover:bg-gray-700 transition rounded-full active:scale-95'
            >
              <Heart className={`w-7 h-7 ${isFavorite ? 'fill-pink-500 text-pink-500' : 'text-white'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Favorite Foods */}
      <p className='text-lg font-medium mt-10 mb-4'>Favorite Foods</p>
      <div className='overflow-x-auto mt-2 pb-4 no-scrollbar'>
        <div className='flex items-center gap-4 w-max px-4'>
          {restaurant.favFoods.map((food, index) => (
            <div key={index} className='flex flex-col items-center gap-2'>
              <img src={food.profile_path} alt={food.name} className='w-20 h-20 rounded-full aspect-square object-cover'/>
              <p className='text-xs text-center'>{food.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSeleect id={restaurant._id}/>

      {/* You may also like */}
      <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {allRestaurants.slice(0,4).map((rest)=>(
          <ResturantCard 
            key={rest._id} 
            rest={rest} 
            onClick={() => { navigate(`/restaurant/${rest._id}`); scrollTo(0,0); }}
          />
        ))}
      </div>

      <div className='group flex justify-center mt-20'>
        <button onClick={()=>{ navigate('/restaurant'); scrollTo(0,0); }} className='flex gap-2 px-10 py-3 text-md bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95'>
          Show More <ArrowRight className='text-xs group-hover:translate-x-0.5 transition'/>
        </button>
      </div>
      <div className="flex items-center gap-2 text-gray-300">
  {[1, 2, 3, 4, 5].map((star) => (
    <Star
      key={star}
      className={`w-6 h-6 cursor-pointer transition
        ${ (hoverRating || userRating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-400" }`}
      onMouseEnter={() => setHoverRating(star)}
      onMouseLeave={() => setHoverRating(0)}
      onClick={() => handleRating(star)}
    />
  ))}
  <span className="ml-2">
    {restaurant.vote_average.toFixed(1)} ({restaurant.vote_count} votes)
  </span>
</div>

    </div>
  );
}

export default RestaurantPage;

import { ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from './BlurCircle';
import ResturantCard from './ResturantCard';

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);

 useEffect(() => {
  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/restaurants`);
      const data = await res.json();
      console.log("Fetched restaurants:", data);
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setRestaurants([]);
    }
  };

  fetchRestaurants();
}, []);

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>
      <div className='relative flex items-center justify-between pt-20 pb-10'>
        <BlurCircle top='0' right='-80px' />
        <BlurCircle left='-100px' bottom='-100px' />
        <p>Now Available</p>
        <button
          onClick={() => navigate('/restaurant')}
          className='group flex items-center gap-2 text-sm text-gray-300 cursor-pointer'
        >
          View All
          <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5' />
        </button>
      </div>

      <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
        {restaurants.slice(0, 5).map((rest) => (
          <ResturantCard key={rest._id} rest={rest} />
        ))}
      </div>

      <div className='flex justify-center m-20'>
        <button
          onClick={() => { navigate('/restaurant'); scrollTo(0, 0); }}
          className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;

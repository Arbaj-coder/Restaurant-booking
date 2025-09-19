import { StarIcon } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeformat from '../lib/timeformate';

const ResturantCard = ({rest}) => {
    const navigate=useNavigate();
  return (
    <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66'>
      <img onClick={()=>{navigate(`/restaurant/${rest._id}`); scrollTo(0,0)}} src={rest.poster_path} alt="" className='rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer' />

      <p className='font-semibold mt-2 truncate'>{rest.title}</p>


      <div className='flex item-center justify-between mt-4 pb-3'>
        <button onClick={()=>{navigate(`/restaurant/${rest._id}`); scrollTo(0,0)}} className='px-4 py-2 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Reserve Table</button>
        <p className='flex items-center gap-1 text-sm text-primary mt-1 pr-1 '>
            <StarIcon className="w-4 h-4 text-primary fill-primary"/>
            {(rest.vote_count%5).toFixed(1)}
        </p>
      </div>

    </div>
  )
}

export default ResturantCard

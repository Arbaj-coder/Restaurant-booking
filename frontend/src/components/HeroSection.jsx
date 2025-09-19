import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const navigate = useNavigate();
  return (<>
    <div className='flex flex-col items-start gap-4 px-6 md:px-16 lg:px-36 bg-[url("./assets/hotel.avif")] bg-cover bg-center h-screen'>
        {/* <img src={assets.logoj} alt="" />
        <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'>Jurassic World <br />Rebirth</h1> */}
        <div className='w-screen h-[85%]'></div>
        <div className='flex items-center gap-4 text-gray-300'>
          <span>Authentic | Indian</span>
        </div>
        <button onClick={()=>{ navigate('/restaurant')}} className='flex items-center gap-1 px-6 py-3 text-lg  bg-primary hover:bg-primary-dull transition font-medium rounded-full cursor-pointer'>
          Reserve Table
          <ArrowRight className='h-5 w-5'/>
          </button>
    </div>
    
    {/* <div className='flex flex-col justify-centergap-4 px-6 md:px-16 lg:px-36 bg-[url("./assets/jurrasic.png")] bg-cover bg-center h-screen'></div> */}
    </>
  )
}

export default HeroSection

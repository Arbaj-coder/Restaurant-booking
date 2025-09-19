import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.jsx'
import { MenuIcon, Scroll, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { useState } from 'react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
const Navbar = () => {
  const [isOpen, setisOpen] = useState(false);
  const {user}=useUser();
  const {openSignIn}=useClerk();
  const navigate=useNavigate();
  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>
      <Link to='/' className='max-md:flex-1'>
        <img src={assets.logo} alt="" className='w-40 h-auto'/>
      </Link>
      <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row  md:item-center max-md:justify-center gap-8 min-md:px-8 py-3 mr-10 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/220 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full':'max-md:w-0' }`}>
        <XIcon onClick={()=>{setisOpen(!isOpen)}}
          className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer'/>
        <Link onClick={()=>{scrollTo(0,0);setisOpen(false)}} className='text-center' to='/'>Home</Link>
        <Link onClick={()=>{scrollTo(0,0);setisOpen(false)}} className='text-center' to='/restaurant'>Restaurants</Link>
        <Link onClick={()=>{scrollTo(0,0);setisOpen(false)}} className='text-center' to='/my-bookings'>My Bookings</Link>
        
        <Link onClick={()=>{scrollTo(0,0);setisOpen(false)}} className='text-center ' to='/favourite'>Favorites</Link>
        <Link onClick={()=>{scrollTo(0,0);setisOpen(false)}} className='text-center  ' to='/admin'>Admin</Link>
        </div>

        <div className='flex items-center gap-8'>
            <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer'/>
            {
              !user ? (<button onClick={openSignIn} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary
            hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Login</button>
              ):(
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action label="My Bookings" labelIcon=
                    {<TicketPlus width={15}/>} onClick={()=>navigate('/my-bookings')}/>
                  </UserButton.MenuItems>
                </UserButton>
              )
            }
      </div>
      <MenuIcon onClick={()=>{setisOpen(!isOpen)}} className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer'/>
    </div>
  )
}

export default Navbar

import {React,useState,useContext } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import RestaurantPage from './pages/RestaurantPage'
import Restaurant from './pages/Restaurant'
import SeatLayout from './pages/SeatLayout'
import Mybookings from './pages/Mybookings'
import Favourite from './pages/Favourite'
import {Toaster} from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Admin from './pages/admin'
import Payment from './pages/Payment'
import Success from './pages/success'
import Cancel from './pages/Cancel'
import { createContext } from 'react'
const App = () => {
  const isAdminRoute=useLocation().pathname.startsWith('/admin');
  return (
    <>
    <Toaster/>
    {!isAdminRoute && <Navbar/>}
  
    <Routes>    
      <Route path="/" element={<Home/>}/>
      <Route path="/restaurant" element={<Restaurant/>}/>
      <Route path="/restaurant/:id" element={<RestaurantPage/>}/>
      <Route path="/restaurant/:id/:date" element={<SeatLayout/>}/>
      <Route path="/my-bookings" element={<Mybookings/>}/>
      <Route path="/favourite" element={<Favourite/>}/>
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/payment/:id" element={<Payment/>}/>
      <Route path="/success" element={<Success/>}/>
      <Route path="/cancel" element={<Cancel/>}/>
    </Routes>
    
    {!isAdminRoute && <Footer/>}
    </>
  )
}

export default App

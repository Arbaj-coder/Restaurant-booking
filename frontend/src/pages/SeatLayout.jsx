import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import { ArrowRightIcon } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'
import { toast } from 'react-hot-toast'
import { useUser } from '@clerk/clerk-react';

const SeatLayout = () => {
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [show, setShow] = useState(null);
  const navigate = useNavigate();
  const groupRows = [['A','B'],['C','D'],['E','F'],['G','H'],['I','J']];

  const getShow = async () => {
    // Demo movie info
    setTimeout(() => {
      setShow({
        movie: { _id: id, title: "Demo Restaurant" }
      });
    }, 1000);
  };

  const handleSeatClick = (seatId) => {
    if (!timeFrom || !timeTo) {
      return toast.error('Please select time from & to first');
    }
    if (selectedSeats.length > 4 && !selectedSeats.includes(seatId)) {
      return toast.error('You can only select up to 5 seats');
    }
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const user = useUser()
 const handleCheckout = async () => {
  if (!timeFrom || !timeTo) return toast.error("Please select timings first");
  if (selectedSeats.length === 0) return toast.error("Please select at least 1 seat");

  // Combine date + time into Date objects
  const bookingFromTime = new Date(`${date}T${timeFrom}:00`);
  const bookingToTime = new Date(`${date}T${timeTo}:00`);

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,        // Clerk user id
        restaurantId: id,       // Restaurant id
        seatNumbers: selectedSeats,
        bookingFrom: bookingFromTime,
        bookingTo: bookingToTime,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return toast.error(
        data.unavailableSeats
          ? `Unavailable: ${data.unavailableSeats.join(", ")}`
          : data.message
      );
    }

    toast.success("Booking Successful ✅");
navigate(`/payment/${selectedSeats.length}`, {
  state: {
    seatCount: selectedSeats.length,
    seatNumbers: selectedSeats,
    restaurantId: id,
    bookingFrom: bookingFromTime,
    bookingTo: bookingToTime,
  },
});
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};



  const renderSeates = (row, count = 9) => (
    <div className='flex gap-2 mt-2' key={row}>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border text-gray-500 border-primary/60 cursor-pointer ${
                selectedSeats.includes(seatId)
                  ? 'bg-primary text-white'
                  : 'hover:bg-primary-dull/20 hover:text-white'
              }`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  useEffect(() => {
    getShow();
  }, [id]);

  return show ? (
    <div className='flex flex-col gap-y-2 md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50 md:gap-5 gap-10'>
      {/* Sidebar - Custom Timing */}
      <div className='flex flex-col w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Select Timing</p>
        <div className='mt-5 space-y-3 px-6'>
          <div>
            <label className='block text-sm'>Time From:</label>
            <input
              type="time"
              value={timeFrom}
              onChange={(e) => setTimeFrom(e.target.value)}
              className="w-full border rounded p-1"
            />
          </div>
          <div>
            <label className='block text-sm'>Time To:</label>
            <input
              type="time"
              value={timeTo}
              onChange={(e) => setTimeTo(e.target.value)}
              className="w-full border rounded p-1"
            />
          </div>
        </div>
      </div>

      {/* Seat Layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16 gap-5'>
        <BlurCircle top='-100px' left='-400px' />
        <BlurCircle bottom='0px' right='100px' />
        <h1 className='text-2xl font-semibold mb-4'>Select Your Seat</h1>
        <img src={assets.screen} alt="screen" className='fill-primary' />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

        <div className='flex flex-col item-center justify-center mt-10 text-xs text-gray-300'>
          <div className='flex flex-row md:flex-col items-center gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row => renderSeates(row))}
          </div>
          <div className='grid grid-cols-2 gap-11'>
            {groupRows.slice(1).map((group, index) => (
              <div key={index}>
                {group.map(row => renderSeates(row))}
              </div>
            ))}
          </div>
        </div>

        <button
  onClick={handleCheckout}
  className='group flex hover:bg-primary-dull transition active:scale-95 items-center justify-center w-70 h-10 rounded-full bg-primary gap-2 p-5 md:mt-20 mt-15 cursor-pointer'
>
  <p>Proceed To Checkout</p>
  <ArrowRightIcon className='group-hover:translate-x-0.5' strokeWidth={3} />
</button>

      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;


import { Restaurant, User } from "../models/restaurant.model.js";


// GET /restaurants/:id
// GET /restaurants/:id
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createOrGetUser = async (req, res) => {
  try {
    const { clerkId, name, email } = req.body;

    // check if user already exists
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = new User({ clerkId, name, email });
      const savedUser = await user.save();
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /restaurants
export const createRestaurant = async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.status(201).json({ success: true, data: newRestaurant });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /restaurants
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find(); // returns array
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/book
export const bookSeats = async (req, res) => {
  try {
    const { userId, restaurantId, seatNumbers, bookingFrom, bookingTo } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const from = new Date(bookingFrom);
    const to = new Date(bookingTo);

    // 1️⃣ Check seat availability
    const unavailableSeats = [];
    restaurant.seats.forEach(seat => {
      if (seatNumbers.includes(seat.seatNumber)) {
        if (seat.reservedFrom && seat.reservedTo) {
          const reservedFrom = new Date(seat.reservedFrom);
          const reservedTo = new Date(seat.reservedTo);

          // overlap condition (date + time)
          if (!(to <= reservedFrom || from >= reservedTo)) {
            unavailableSeats.push(seat.seatNumber);
          }
        }
      }
    });

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Seats not available for the selected date/time",
        unavailableSeats
      });
    }

    // 2️⃣ Mark seats as reserved
    restaurant.seats.forEach(seat => {
      if (seatNumbers.includes(seat.seatNumber)) {
        seat.isAvailable = false;
        seat.reservedFrom = from;
        seat.reservedTo = to;
      }
    });

    await restaurant.save();

    // 3️⃣ Save booking in User
    const booking = {
      restaurant: restaurantId,
      seatsBooked: seatNumbers.length,
      seatNumbers,
      bookingFrom: from,
      bookingTo: to,
    };

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.bookings.push(booking);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Booking successful",
      booking
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

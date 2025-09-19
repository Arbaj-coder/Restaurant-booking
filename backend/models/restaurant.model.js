import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profile_path: { type: String } // image url
});

const cuisineSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

// Seat Schema → to track availability
const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  isAvailable: { type: Boolean, default: true }, 
  reservedFrom: { type: Date }, 
  reservedTo: { type: Date }    
});

// 👉 Function to auto-generate seats (A1..A9, B1..B9, ... J1..J9)
function generateSeats() {
  const rows = ['A','B','C','D','E','F','G','H','I','J'];
  const seats = [];
  rows.forEach(row => {
    for (let i = 1; i <= 9; i++) {
      seats.push({ seatNumber: `${row}${i}`, isAvailable: true });
    }
  });
  return seats;
}

const restaurantSchema = new mongoose.Schema({
  title: { type: String, required: true },
  overview: { type: String },
  poster_path: { type: String },
  cuisines: [cuisineSchema],
  favFoods: [foodSchema],
  establish_date: { type: Date },
  tagline: { type: String },
  vote_average: { type: Number, default: 0 },
  vote_count: { type: Number, default: 0 },
  opening_time: { type: String },
  closing_time: { type: String },
  address: { type: String },
  youtubeLink: { type: String },

  // New → seats availability
  seats: {
    type: [seatSchema],
    default: generateSeats   // 👈 Auto fill seats
  }
}, { timestamps: true });

export const Restaurant =
  mongoose.models.Restaurant || mongoose.model("Restaurant", restaurantSchema);

// Booking Schema with timing
const bookingSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  seatsBooked: { type: Number, required: true },
  seatNumbers: [{ type: String, required: true }], // array of seat numbers

  bookingDate: { type: Date, default: Date.now },
  bookingFrom: { type: Date, required: true }, // booking start time
  bookingTo: { type: Date, required: true }    // booking end time
});

const userSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true },
  name: { type: String },
  email: { type: String, unique: true },

  bookings: {
    type: [bookingSchema],
    default: []   // agar na mile to empty array
  },

  favorites: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }],
    default: []   // agar na mile to empty array
  }
}, { timestamps: true });

export const User =
  mongoose.models.User || mongoose.model("User", userSchema);

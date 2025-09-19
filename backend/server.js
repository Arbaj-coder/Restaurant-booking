import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import restaurantsRoute from './routes/restaurants.js';
import cors from 'cors';
import morgan from 'morgan';
import userRoute from './routes/user.js';
import bookSeatsRoute from './routes/book.js';
// import paymentRoute from './routes/payment.js';
import Stripe from "stripe";
import Booking from "./models/Booking.js";
import { Restaurant } from "./models/restaurant.model.js";
import Mybookings from './routes/mybooking.js';
import myfavRoutes from "./routes/isfav.js";
import adminpayment from "./routes/adminpayment.js"
import rateRoute from "./routes/rate.js"

dotenv.config();
const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Middlewares
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/restaurants', restaurantsRoute);
app.use('/api/user', userRoute);
app.use('/api/book', bookSeatsRoute);
app.use('/api/mybooking', Mybookings);
app.use("/api/isfav", myfavRoutes);
app.use("/api/payment", adminpayment);
app.use("/api/ratings", rateRoute);


app.post("/api/create-checkout-session", async (req, res) => {
  const { userId ,restaurantId, seatNumbers, seatCount, bookingFrom, bookingTo, totalAmount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: `Seat Booking (${seatCount} seats)` },
            unit_amount: Math.round(totalAmount * 100), // Stripe takes in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
  success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        restaurantId,
         userId,
        seatNumbers: JSON.stringify(seatNumbers),
        bookingFrom,
        bookingTo,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Confirm booking after payment
app.post("/api/confirm-booking", async (req, res) => {
  const { sessionId } = req.body;
  console.log("hello1")
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed." });
    }

    // Extract metadata
    const { restaurantId, userId, seatNumbers, bookingFrom, bookingTo } = session.metadata;
console.log("hello2")
    const restaurant = await Restaurant.findById(restaurantId);

    const booking = await Booking.create({
      restaurant: restaurantId,
      user: userId,
      seatNumbers: JSON.parse(seatNumbers),
      seatsBooked: JSON.parse(seatNumbers).length,
      bookingFrom,
      bookingTo,
      amount: session.amount_total / 100,
      paymentId: session.id,
    });
console.log("hello3")
    // ✅ Update restaurant seat availability
    await Restaurant.updateOne(
      { _id: restaurantId, "seats.seatNumber": { $in: JSON.parse(seatNumbers) } },
      {
        $set: {
          "seats.$[elem].isAvailable": false,
          "seats.$[elem].reservedFrom": bookingFrom,
          "seats.$[elem].reservedTo": bookingTo,
        },
      },
      { arrayFilters: [{ "elem.seatNumber": { $in: JSON.parse(seatNumbers) } }] }
    );

    // ✅ Response me restaurant ka naam bhejo (Success.jsx ko chahiye)
    res.json({
      booking: {
        ...booking.toObject(),
        restaurantName: restaurant.title,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


app.get('/', (req, res) => res.send('Restaurant API is running'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();

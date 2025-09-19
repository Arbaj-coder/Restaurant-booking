// backend/routes/book.js
import express from "express";
import Booking from "../models/Booking.js";
const router = express.Router();

router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("restaurant", "title") // optional, if you want restaurant details
      .lean();
    // Add restaurantName field for frontend
    const result = bookings.map((b) => ({
      ...b,
      restaurantName: b.restaurant.title || b.restaurant,
    }));
    res.json({ bookings: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

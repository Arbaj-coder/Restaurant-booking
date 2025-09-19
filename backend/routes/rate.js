import express from "express";
import { Restaurant } from "../models/restaurant.model.js";
const router = express.Router();

// rate restaurant
router.post("/:id/rate", async (req, res) => {
  try {
    const { rating } = req.body; // ⭐ user rating (1–5)

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating" });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Update formula → IMDb style
    restaurant.vote_average =
      (restaurant.vote_average * restaurant.vote_count + rating) /
      (restaurant.vote_count + 1);

    restaurant.vote_count += 1;

    await restaurant.save();

    res.json({
      message: "Rating added successfully",
      vote_average: restaurant.vote_average,
      vote_count: restaurant.vote_count,
    });
  } catch (err) {
    res.status(500).json({ message: "Error rating restaurant", error: err });
  }
});

export default router;

// routes/user.js
import express from "express";
import { User }from "../models/restaurant.model.js";
const router = express.Router();

// Get user + favorites
router.get("/:clerkId", async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId })
      .populate("favorites");  // ✅ populate restaurants

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle favorite
router.post("/:userId/favorite/:restaurantId", async (req, res) => {
  try {
    const { userId, restaurantId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ convert ObjectIds to string for comparison
    const index = user.favorites.findIndex(
      fav => fav.toString() === restaurantId
    );

    let isFavorite;
    if (index === -1) {
      user.favorites.push(restaurantId);
      isFavorite = true;
    } else {
      user.favorites.splice(index, 1);
      isFavorite = false;
    }

    await user.save();

    res.json({
      favorites: user.favorites,
      isFavorite
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
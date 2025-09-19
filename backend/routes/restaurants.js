import express from "express";
import { createRestaurant, getRestaurants, getRestaurantById} from "../controllers/restaurant.controller.js";

const router = express.Router();

router.post("/", createRestaurant); // ✅ admin can add new restaurant
router.get("/", getRestaurants); // existing route
router.get("/:id", getRestaurantById); 

export default router;
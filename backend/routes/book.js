import express from "express";
import {bookSeats} from "../controllers/restaurant.controller.js";

const router = express.Router();

router.post("/", bookSeats); 

export default router;

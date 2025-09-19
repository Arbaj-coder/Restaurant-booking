import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  user: {
    type: String,  // Clerk userId ko string me store karenge
    required: true,
},

  seatsBooked: { type: Number, required: true },
  seatNumbers: [{ type: String, required: true }],

  bookingDate: { type: Date, default: Date.now },
  bookingFrom: { type: Date, required: true },
  bookingTo: { type: Date, required: true },

  amount: { type: Number, required: true }, // 💰 total charged
  paymentId: { type: String }, // Stripe session id
}, { timestamps: true });

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;

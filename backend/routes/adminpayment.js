// routes/payment.js
import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session-admin", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Add Restaurant Listing" },
            unit_amount: 2000, // $20 fee
          },
          quantity: 1,
        },
      ],
  success_url: `${process.env.FRONTEND_URL}/admin?success=true`,
  cancel_url: `${process.env.FRONTEND_URL}/admin?success=true`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

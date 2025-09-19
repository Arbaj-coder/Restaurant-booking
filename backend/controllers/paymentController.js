app.post("/api/create-checkout-session", async (req, res) => {
  const { restaurantId, seatNumbers, seatCount, bookingFrom, bookingTo, totalAmount } = req.body;

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

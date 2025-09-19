import React, { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import "../Admin.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // replace with your test publishable key

function Admin() {
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    poster_path: "",
    cuisines: "",
    favFoods: [],
    establish_date: "",
    tagline: "",
    opening_time: "",
    closing_time: "",
    address: "",
    youtubeLink: ""
  });

  const [food, setFood] = useState({ name: "", profile_path: "" });
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    // Check query params after redirect
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setPaymentDone(true);
      alert("✅ Payment successful, now you can add your restaurant!");
    }
    if (query.get("canceled")) {
      alert("❌ Payment canceled!");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFoodChange = (e) => {
    const { name, value } = e.target;
    setFood((prev) => ({ ...prev, [name]: value }));
  };

  const addFood = () => {
    if (!food.name.trim()) return alert("Please enter a food name!");
    setFormData((prev) => ({
      ...prev,
      favFoods: [...prev.favFoods, food],
    }));
    setFood({ name: "", profile_path: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentDone) return alert("⚠️ Please complete payment first!");

    const cuisinesArray = formData.cuisines
      .split(",")
      .map((c) => ({ name: c.trim() }));

    const payload = { ...formData, cuisines: cuisinesArray };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/restaurants`, payload);
      alert("✅ Restaurant added successfully!");
    } catch (err) {
      alert("❌ Error: " + err.response?.data?.message || err.message);
    }
  };

  const handlePayment = async () => {
    const stripe = await stripePromise;
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/payment/create-checkout-session-admin`);
    window.location.href = res.data.url; // redirect to Stripe checkout
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <h2 className="form-title">Add Restaurant</h2>

        {!paymentDone && (
          <button onClick={handlePayment} className="btn-primary">
            💳 Pay $20 to Add Restaurant
          </button>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <label>Restaurant Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="text-black"/>

          <label>Overview</label>
          <textarea name="overview" value={formData.overview} onChange={handleChange} className="text-black"></textarea>

          <label>Poster Image URL</label>
          <input type="text" name="poster_path" value={formData.poster_path} onChange={handleChange} className="text-black"/>

          <label>Cuisines (comma separated)</label>
          <input type="text" name="cuisines" value={formData.cuisines} onChange={handleChange} className="text-black"/>

          <h3>Favorite Foods</h3>
          <div className="food-section">
            <input type="text" name="name" placeholder="Food Name" value={food.name} onChange={handleFoodChange} className="text-black"/>
            <input type="text" name="profile_path" placeholder="Food Image URL" value={food.profile_path} onChange={handleFoodChange} className="text-black" />
            <button type="button" onClick={addFood} className="btn-secondary">➕ Add</button>
          </div>

          <ul className="food-list">
            {formData.favFoods.map((f, index) => (
              <li key={index} className="text-black">
                {f.name} <img src={f.profile_path} alt={f.name} />
              </li>
            ))}
          </ul>

          <label>Establish Date</label>
          <input type="date" name="establish_date" value={formData.establish_date} onChange={handleChange} className="text-black"/>

          <label>Tagline</label>
          <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="text-black"/>

          <label>Opening Time</label>
          <input type="time" name="opening_time" value={formData.opening_time} onChange={handleChange} className="text-black"/>

          <label>Closing Time</label>
          <input type="time" name="closing_time" value={formData.closing_time} onChange={handleChange} className="text-black"/>

          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="text-black"/>

          <label>Youtube URL</label>
          <input type="text" name="youtubeLink" value={formData.youtubeLink} onChange={handleChange} className="text-black"/>

          <button 
    type="submit" 
    className="btn-primary" 
    disabled={!paymentDone}  
  >
    Add Restaurant
  </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Admin;

import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedSection from '../components/FeaturedSection';
import TrailersSection from '../components/TrailersSection';
import { useUser } from '@clerk/clerk-react';

const Home = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetch(`${import.meta.env.VITE_BACKEND_URI}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        }),
      });
    }
  }, [user]);

  return (
    <div>
      <HeroSection />
      <FeaturedSection />
      <TrailersSection />
    </div>
  );
};

export default Home;

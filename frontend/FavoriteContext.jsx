// FavoriteContext.js
import { createContext, useState, useContext } from 'react';
import { dummyShowsData } from './src/assets/assets';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [shows, setShows] = useState(dummyShowsData);

  const toggleFavorite = (id) => {
    setShows(prev =>
      prev.map(show =>
        show._id === id ? { ...show, isFavorite: !show.isFavorite } : show
      )
    );
  };

  return (
    <FavoriteContext.Provider value={{ shows, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => useContext(FavoriteContext);

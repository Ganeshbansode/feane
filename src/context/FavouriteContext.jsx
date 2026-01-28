import { createContext, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const FavouriteContext = createContext();

export const FavouriteProvider = ({ children }) => {
  const { user } = useAuth();
  const isFirstRender = useRef(true);

  const [favourites, setFavourites] = useState([]);

  // 🔑 user-wise storage key
  const favKey = user ? `favourites_${user.email}` : null;

  // 🔄 LOAD / CLEAR based on login
  useEffect(() => {
    if (user) {
      const saved = JSON.parse(localStorage.getItem(favKey)) || [];
      setFavourites(saved);
    } else {
      // logout → clear UI only
      setFavourites([]);
    }
  }, [user, favKey]);

  // ⭐ toggle favourite
  const toggleFavourite = (item) => {
    setFavourites((prev) => {
      const exists = prev.find((f) => f.id === item.id);

      if (exists) {
        return prev.filter((f) => f.id !== item.id);
      }

      return [
        ...prev,                 // old state  ...pre  we return new state 
        {
          id: item.id,
          title: item.title,
          price: item.price,
          img: item.img || item.image || "",
        },
      ];
    });
  };

  const isFavourite = (id) => favourites.some((f) => f.id === id);

  //  SAVE only for logged-in user
  useEffect(() => {
    if (!user || !favKey) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    localStorage.setItem(favKey, JSON.stringify(favourites));
    toast.dismiss();
    toast.success("Favourite updated ❤️");
  }, [favourites, user, favKey]);

  return (
    <FavouriteContext.Provider
      value={{ favourites, toggleFavourite, isFavourite }}
    >
      {children}
    </FavouriteContext.Provider>
  );
};

export const useFavourite = () => useContext(FavouriteContext);

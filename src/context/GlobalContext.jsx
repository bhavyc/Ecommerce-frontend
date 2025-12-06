import { createContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const refreshUserData = async () => {
    try {
      const { data } = await api.get("/auth/profile");
      setUser(data.data.user);
      const cartRes = await api.get("/api/cart");
      if(cartRes.data.success) {
        setCartCount(cartRes.data.cart.items.length);
      }
    } catch (err) {
      console.log("Session expired or not logged in");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) refreshUserData();
    else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    await refreshUserData();
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCartCount(0);
    window.location.href = "/login";
  };

  return (
    <GlobalContext.Provider value={{ user, login, logout, loading, cartCount, refreshUserData }}>
      {children}
    </GlobalContext.Provider>
  );
};

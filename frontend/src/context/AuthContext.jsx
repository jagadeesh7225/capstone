import React, { createContext, useContext, useState, useEffect } from "react";
import { checkAuth, logoutUser } from "../api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

// Safe JSON decode
const safeJSONParse = (value) => {
  if (!value || value === "undefined" || value === "null") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const stored = safeJSONParse(localStorage.getItem("user"));

  const [user, setUser] = useState(stored);
  const [isAuthenticated, setIsAuthenticated] = useState(!!stored);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = safeJSONParse(localStorage.getItem("user"));

    // 🔥 If Google Login → skip backend verification
    if (storedUser?.authType === "google") {
      setUser(storedUser);
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // 🟦 Normal backend login
    const verify = async () => {
      try {
        const res = await checkAuth();
        if (res.data.isAuthenticated) {
          setUser(res.data.user);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("user");
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {}

    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

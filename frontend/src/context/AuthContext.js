import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  // Login
  const login = async (inputUsername, password) => {
    await api.post("/auth/login", { username: inputUsername, password });
    setUsername(inputUsername);
    setIsAuthenticated(true);
  };

  // Register
  const register = async (inputUsername, password) => {
    await api.post("/auth/register", { username: inputUsername, password });
  };

  // Logout
  const logout = async () => {
    await api.post("/auth/logout");
    setIsAuthenticated(false);
    setUsername("");
  };

  // Auto-check auth on page load / refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setIsAuthenticated(true);
        setUsername(res.data.username || "User");
      } catch {
        setIsAuthenticated(false);
        setUsername("");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, loading, username }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

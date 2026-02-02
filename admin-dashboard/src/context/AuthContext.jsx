// src/context/AuthContext.jsx
import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../services/api.js";

const AuthContext = createContext();

export { AuthContext };

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (res.status === 200 && res.data) {
        // Store user data and token
        const userData = {
          _id: res.data._id,
          name: res.data.name || "Admin",
          email: res.data.email,
          token: res.data.token,
        };
        
        setUser(userData);
        
        // Store token if provided
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        
        toast.success("✅ Login successful");
        return userData;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      
      let errorMessage = "Login failed. Please check your credentials.";
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.message || 
                       `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Cannot connect to server. Please check if the backend is running.";
      } else {
        // Something else happened
        errorMessage = err.message || "An unexpected error occurred";
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.displayName = "AuthProvider";

export { AuthProvider };

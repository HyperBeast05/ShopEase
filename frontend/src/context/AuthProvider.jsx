import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { useEffect } from "react";

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const isLoggedIn = !!user && !!token;

  //Login function
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setToken(token);
  };

  //Logout function

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  };

  //update user function
  const updateUser = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  //Automatically logout when authentication expires
  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
      setToken(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

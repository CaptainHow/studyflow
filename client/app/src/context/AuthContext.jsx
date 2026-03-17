const BASE_URL = process.env.REACT_APP_BASE_URL;
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const refresh = localStorage.getItem("refresh");
        const res = await fetch(`${BASE_URL}/token/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh }),
        });

        if (!res.ok) {
          throw new Error("Refresh failed");
        }

        const data = await res.json();

        // Save new access token
        localStorage.setItem("access", data.access);
        setSuccess(true);
      } catch (err) {
        console.log(err);
        console.log("Invalid token, logging out");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ success, setSuccess }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

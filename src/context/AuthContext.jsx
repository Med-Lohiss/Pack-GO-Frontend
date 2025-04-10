import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, refreshAuthToken } from "../api/api"; // Importamos la función de login y refresh
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      console.log("Login Response:", response);

      const { jwt, role } = response;

      if (!jwt || !role) {
        throw new Error("Error en la autenticación. No se recibió el token o el rol.");
      }

      const loggedUser = { email, role };

      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("token", jwt);
      localStorage.setItem("role", role);

      Cookies.set('jwt', jwt, { expires: 1 });
      Cookies.set('refreshToken', response.refreshToken, { expires: 7 });

      return loggedUser;
    } catch (error) {
      console.error("Login Error:", error.message);
      throw new Error(error.message);
    }
  };

  // 🔥 Nuevo método para login con Google
  const loginWithGoogle = async (jwt) => {
    try {
      const response = await fetch(import.meta.env.VITE_GOOGLE_OAUTH2_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      const { email, role } = data;

      if (!email || !role) {
        throw new Error("Error en la autenticación con Google.");
      }

      const loggedUser = { email, role };
      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("jwt", jwt);

      return loggedUser;
    } catch (error) {
      console.error("Error en login con Google:", error.message);
      throw new Error("Fallo en autenticación con Google");
    }
  };

  const verifyAndRefreshToken = async () => {
    const jwt = Cookies.get('jwt');

    if (jwt) {
      try {
        const newJwt = await refreshAuthToken();
        console.log("Token renovado:", newJwt);
        setUser(prevState => ({ ...prevState, token: newJwt }));
        localStorage.setItem('token', newJwt);

        Cookies.set('jwt', newJwt, { expires: 1 });

      } catch (error) {
        console.error("Error al renovar el token:", error);
        logout();
      }
    } else {
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    Cookies.remove("jwt");
    Cookies.remove("refreshToken");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    verifyAndRefreshToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

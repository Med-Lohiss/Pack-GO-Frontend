import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, refreshAuthToken } from "../api/api"; // Importamos la función de login y refresh
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Función de login
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

      // Configuración de cookies con atributos de seguridad
      Cookies.set('jwt', jwt, { expires: 1, secure: true, sameSite: 'Strict' });
      Cookies.set('refreshToken', response.refreshToken, { expires: 7, secure: true, sameSite: 'Strict' });

      return loggedUser;
    } catch (error) {
      console.error("Login Error:", error.message);
      throw new Error(error.message);
    }
  };

  // Método para login con Google
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

  // Función para verificar y refrescar el token
  const verifyAndRefreshToken = async () => {
    const jwt = Cookies.get('jwt');
    const refreshToken = Cookies.get('refreshToken');

    if (jwt) {
      try {
        // Usar el refreshToken para obtener un nuevo JWT
        const newJwt = await refreshAuthToken(refreshToken); 
        setUser(prevState => ({ ...prevState, token: newJwt }));
        localStorage.setItem('token', newJwt);

        // Actualizar las cookies con el nuevo token
        Cookies.set('jwt', newJwt, { expires: 1, secure: true, sameSite: 'Strict' });
      } catch (error) {
        console.error("Error al renovar el token:", error);
        logout();
      }
    } else {
      logout();
    }
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    Cookies.remove("jwt");
    Cookies.remove("refreshToken");
  };

  // useEffect para verificar si el usuario ya está autenticado
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

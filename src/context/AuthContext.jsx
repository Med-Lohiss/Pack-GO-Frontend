import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, refreshAuthToken } from "../api/api";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);

      const { jwt, role, refreshToken, cuentaBloqueada } = response;

      if (cuentaBloqueada) {
        throw new Error("Cuenta bloqueada. Contacta con la administración.");
      }

      if (!jwt || !role) {
        throw new Error("Error en la autenticación. No se recibió el token o el rol.");
      }

      const loggedUser = { email, role };

      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("token", jwt);
      localStorage.setItem("role", role);

      Cookies.set("jwt", jwt, { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("refreshToken", refreshToken, { expires: 7, secure: true, sameSite: "Strict" });

      return loggedUser;
    } catch (error) {
      console.error("Login Error:", error.message);
      throw new Error(error.message);
    }
  };

  const loginWithGoogle = (jwt) => {
    localStorage.setItem("jwt", jwt);
  };

  const verifyAndRefreshToken = async () => {
    const jwt = Cookies.get("jwt");
    const refreshToken = Cookies.get("refreshToken");

    if (jwt) {
      try {
        const newJwt = await refreshAuthToken(refreshToken);
        setUser((prevState) => ({ ...prevState, token: newJwt }));
        localStorage.setItem("token", newJwt);
        Cookies.set("jwt", newJwt, { expires: 1, secure: true, sameSite: "Strict" });
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
    navigate("/auth");
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

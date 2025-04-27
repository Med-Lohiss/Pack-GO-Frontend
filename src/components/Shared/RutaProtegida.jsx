import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RutaProtegida = ({ children, rolRequerido }) => {
  const token = localStorage.getItem("jwt");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const roles = decoded.roles || [];

    const tieneAcceso = roles.includes(rolRequerido);

    if (!tieneAcceso) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return <Navigate to="/" replace />;
  }
};

export default RutaProtegida;


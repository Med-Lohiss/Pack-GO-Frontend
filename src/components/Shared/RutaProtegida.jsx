import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RutaProtegida = ({ children, rolRequerido }) => {
  const location = useLocation();
  const token = localStorage.getItem("jwt");

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  try {
    const decoded = jwtDecode(token);
    const roles = decoded.roles || [];

    const tieneAcceso = roles.includes(rolRequerido);

    if (!tieneAcceso) {
      return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <>{children}</>;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return <Navigate to="/" replace state={{ from: location }} />;
  }
};

export default RutaProtegida;

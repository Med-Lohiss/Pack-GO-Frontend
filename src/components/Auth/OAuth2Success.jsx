import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      alert("No se encontró el token de Google");
      navigate("/auth");
      return;
    }

    localStorage.setItem("jwt", token);

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const { email, rolUsuario: role } = payload;

      const loggedUser = { email, role };
      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("role", role);

      const pendingToken = sessionStorage.getItem("pendingInvitationToken");
      if (pendingToken) {
        sessionStorage.removeItem("pendingInvitationToken");
        navigate(`/invitacion/${pendingToken}`);
        return;
      }

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "EMPLEADO") {
        navigate("/empleado/dashboard");
      } else if (role === "CLIENTE") {
        navigate("/cliente/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error al procesar el token JWT:", err);
      alert("Token inválido. Intenta iniciar sesión de nuevo.");
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ fontSize: "1.2rem", color: "#333" }}>
        Procesando inicio de sesión con Google...
      </p>
    </div>
  );
};

export default OAuth2Success;

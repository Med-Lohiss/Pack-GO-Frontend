import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OAuth2Success = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      alert("No se encontró el token de Google");
      navigate("/auth");
      return;
    }

    const handleLoginWithGoogle = async () => {
      try {
        const user = await loginWithGoogle(token);

        const pendingToken = sessionStorage.getItem("pendingInvitationToken");
        if (pendingToken) {
          sessionStorage.removeItem("pendingInvitationToken");
          navigate(`/invitacion/${pendingToken}`);
          return;
        }

        if (user.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (user.role === "EMPLEADO") {
          navigate("/empleado/dashboard");
        } else if (user.role === "CLIENTE") {
          navigate("/cliente/dashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error en login con Google:", error.message);
        alert("Error al iniciar sesión con Google");
        navigate("/auth");
      }
    };

    handleLoginWithGoogle();
  }, [loginWithGoogle, navigate]);

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <p style={{ fontSize: "1.2rem", color: "#333" }}>Procesando inicio de sesión con Google...</p>
    </div>
  );
};

export default OAuth2Success;

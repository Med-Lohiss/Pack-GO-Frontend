import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import * as Components from "../AuthComponents";

const RestablecerContraseña = ({ onFinish, setStep }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // Estado para errores

  const navigate = useNavigate(); // Inicializa useNavigate

  // Obtener el correo y el código almacenado en localStorage
  const email = localStorage.getItem("recoveryEmail");
  const recoveryCode = localStorage.getItem("recoveryCode");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("No se pudo recuperar el correo. Intenta de nuevo.");
      return;
    }

    if (!recoveryCode) {
      setError("El código de recuperación no se encontró.");
      return;
    }

    // Validar si las contraseñas coinciden
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    console.log({
      email,
      recoveryCode,
      password
    });

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // Usamos el correo obtenido de localStorage
          codigo: recoveryCode, // Enviamos el código de recuperación
          nuevaPassword: password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(errorMessage);
        return;
      }

      console.log("Contraseña restablecida con éxito.");

      // Si se pasó la función onFinish, ejecutarla
      if (onFinish) {
        onFinish();
      } else {
        console.warn("No se pasó la función onFinish. Redirigiendo a /auth...");
        navigate("/auth"); // Redirigir a la página de autenticación
      }
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
      setError("Hubo un error al restablecer la contraseña.");
    }
  };

  return (
    <Components.Form onSubmit={handleSubmit}>
      <Components.Title>Restablecer Contraseña</Components.Title>

      <Components.Input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Components.Input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Components.Button type="submit">Restablecer Contraseña</Components.Button>

      {/* Enlace Volver */}
      <Components.StyledRecoverLink
        to="#"
        onClick={(e) => {
          e.preventDefault();
          setStep(prevStep => prevStep - 1); // Retroceder al paso anterior
        }}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          color: '#007BFF', 
          textDecoration: 'none', 
          fontSize: '14px'
        }}
      >
        Volver
      </Components.StyledRecoverLink>
    </Components.Form>
  );
};

export default RestablecerContraseña;

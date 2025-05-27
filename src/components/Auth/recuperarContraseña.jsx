import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Components from "../../components/AuthComponents";
import { CircularProgress } from "@mui/material"; // Solo necesitamos CircularProgress para el spinner

const RecuperarContraseña = ({ onNext, setStep }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Activamos el estado de carga

    console.log("Email para recuperar contraseña:", email);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/auth/recover-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json(); 
      console.log("Respuesta del servidor:", data);

      if (!response.ok) throw new Error(data.mensaje || "Error al enviar el correo");

      alert(data.mensaje);

      localStorage.setItem("recoveryEmail", email);

      if (data.codigo) {
        localStorage.setItem("recoveryCode", data.codigo);
      } else {
        throw new Error("Código de recuperación no recibido.");
      }

      if (onNext) {
        onNext();
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Desactivamos el estado de carga
    }
  };

  return (
    <Components.Form onSubmit={handleSubmit}>
      <Components.Title>Recuperar Contraseña</Components.Title>

      <Components.Input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Botón con spinner cargando */}
      <Components.Button type="submit" disabled={loading} style={{ position: 'relative' }}>
        {loading ? (
          <>
            <CircularProgress size={24} style={{ position: 'absolute', left: '50%', top: '50%', marginTop: '-12px', marginLeft: '-12px' }} />
            Enviando código...
          </>
        ) : (
          "Enviar Código"
        )}
      </Components.Button>

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

export default RecuperarContraseña;

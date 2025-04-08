import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Components from "../AuthComponents";

const VerificarCodigo = ({ onNext, setStep }) => {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState(""); // Para manejar errores de código
  const [infoMessage, setInfoMessage] = useState(""); // Para el mensaje de info sobre spam

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Código de verificación:", codigo);

    // Simulando validación del código (puedes cambiarlo por una validación real)
    if (codigo.length === 6) {
      // Si el código es válido, pasamos al siguiente paso
      if (onNext) {
        onNext();
      }
    } else {
      setError("El código de verificación es incorrecto o está incompleto.");
    }
  };

  return (
    <Components.Form onSubmit={handleSubmit}>
      <Components.Title>Verificar Código</Components.Title>

      <Components.Input
        type="text"
        placeholder="Código de verificación"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        required
      />

      {/* Mensaje de advertencia sobre spam */}
      <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
        Si no has recibido el código, revisa tu carpeta de <strong>spam</strong> o <strong>correo no deseado</strong>.
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Mostrar mensaje de error si es necesario */}
      
      <Components.Button type="submit">Verificar Código</Components.Button>

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

export default VerificarCodigo;

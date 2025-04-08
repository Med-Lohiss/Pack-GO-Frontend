import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as Components from "../components/AuthComponents";
import logo from "../assets/logo.png";
import { register as apiRegister } from "../api/api"; // Importamos la función de registro
import RecuperarContraseña from "../components/Auth/recuperarContraseña";
import VerificarCodigo from "../components/Auth/verificarCodigo";
import RestablecerContraseña from "../components/Auth/restablecerContraseña";
import googleLogo from "../assets/google-logo.png";

const AuthPage = () => {
  const [signIn, setSignIn] = useState(true);
  const [step, setStep] = useState(0); // Cambio: iniciar en 0
  const { login } = useAuth();
  const navigate = useNavigate();

  // Función para manejar el login
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const user = await login(email, password);

      console.log("Usuario logueado:", user);

      if (!user || !user.role) {
        alert("Error en autenticación. No se recibió el rol.");
        return;
      }

      alert("¡Login exitoso!");

      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "EMPLEADO") {
        navigate("/empleado/dashboard");
      } else {
        navigate("/");
      }

      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  // Función para manejar el registro
  const handleRegister = async (e) => {
    e.preventDefault();
    const nombre = e.target.nombre.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!password) {
      alert("La contraseña es obligatoria");
      return;
    }

    try {
      const response = await apiRegister(nombre, email, password);

      console.log("Registro exitoso:", response);

      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setSignIn(true);
    } catch (error) {
      console.error("Error en el registro:", error.message);
      alert(error.message);
    }
  };

  // 🚀 Nueva función para manejar el inicio de sesión con Google
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleFinish = () => {
    setStep(0);
    setSignIn(true);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#f0f8ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Components.Container>
        <Components.SignUpContainer signin={signIn}>
          <Components.Form onSubmit={handleRegister}>
            <Components.StyledImage src={logo} alt="PackAndGo" width="100" />
            <Components.Title>Regístrate</Components.Title>
            <Components.Input type="text" name="nombre" placeholder="Nombre" required />
            <Components.Input type="email" name="email" placeholder="Correo" required />
            <Components.Input type="password" name="password" placeholder="Contraseña" required />
            <Components.Button type="submit">Registrarse</Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        <Components.SignInContainer signin={signIn}>
  {step > 0 ? (
    // Flujo de recuperación
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%", marginTop: "35px" }}>
      {step === 1 && <RecuperarContraseña setStep={setStep} onNext={handleNextStep} />}
      {step === 2 && <VerificarCodigo setStep={setStep} onNext={handleNextStep} />}
      {step === 3 && <RestablecerContraseña setStep={setStep} onFinish={handleFinish} />}
    </div>
  ) : (
    // Formulario de inicio de sesión
    <Components.Form onSubmit={handleLogin}>
      <Components.StyledImage src={logo} alt="PackAndGo" width="100" />
      <Components.Title>Inicia Sesión</Components.Title>
      <Components.Input type="email" name="email" placeholder="Correo" required />
      <Components.Input type="password" name="password" placeholder="Contraseña" required />
      <Components.Button type="submit">Iniciar Sesión</Components.Button>

      <p style={{ margin: "1px 0", color: "#999" }}>ó</p>

      <Components.GhostButton
        onClick={handleGoogleLogin}
        style={{
          backgroundColor: '#fff',
          color: '#444',
          border: '1px solid #ccc',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '4px 20px',
        }}
      >
        Inicia sesión con <img src={googleLogo} alt="Google" width="20" height="20" />
      </Components.GhostButton>

      <Components.StyledRecoverLink
        to="#"
        onClick={(e) => {
          e.preventDefault();
          setStep(1); // Aquí empieza el flujo de recuperación
        }}
      >
        ¿Olvidaste tu contraseña?
      </Components.StyledRecoverLink>
    </Components.Form>
  )}
</Components.SignInContainer>


        <Components.OverlayContainer signin={signIn}>
          <Components.Overlay signin={signIn}>
            <Components.LeftOverlayPanel signin={signIn}>
              <Components.Title>¡Bienvenido de nuevo!</Components.Title>
              <Components.Paragraph>Inicia sesión para continuar</Components.Paragraph>
              <Components.GhostButton onClick={() => setSignIn(true)}>Iniciar Sesión</Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signin={signIn}>
              <Components.Title>¡Hola, viajero!</Components.Title>
              <Components.Paragraph>Regístrate y empieza a explorar</Components.Paragraph>
              <Components.GhostButton onClick={() => setSignIn(false)}>Regístrate</Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </div>
  );
};

export default AuthPage;

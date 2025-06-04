import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as Components from "../components/AuthComponents";
import logo from "../assets/logo.png";
import { register as apiRegister } from "../api/api";
import RecuperarContraseña from "../components/Auth/recuperarContraseña";
import VerificarCodigo from "../components/Auth/verificarCodigo";
import RestablecerContraseña from "../components/Auth/restablecerContraseña";
import googleLogo from "../assets/google-logo.png";
import Navbar from "../components/Viajes/Navbar";
import api from "../api/api";
import PasswordInput from "../components/Auth/PasswordInput";

const AuthPage = () => {
  const [signIn, setSignIn] = useState(true);
  const [step, setStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndRedirectWithInvitationToken = async () => {
      const justLoggedIn = sessionStorage.getItem("justLoggedIn");
      const token = sessionStorage.getItem("pendingInvitationToken");

      if (justLoggedIn && token) {
        try {
          const { data: viaje } = await api.get(`/cliente/invitaciones/viaje-por-token/${token}`);
          sessionStorage.removeItem("pendingInvitationToken");
          sessionStorage.removeItem("justLoggedIn");
          navigate(`/invitado/viajes/${viaje.id}?token=${token}`);
        } catch (err) {
          console.error("Error al redirigir con token de invitación:", err);
          sessionStorage.removeItem("pendingInvitationToken");
          sessionStorage.removeItem("justLoggedIn");
        }
      }
    };

    checkAndRedirectWithInvitationToken();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const user = await login(email, password);
      sessionStorage.setItem("justLoggedIn", "true");

      if (!user || !user.role) {
        setErrorMessage("Error en autenticación. No se recibió el rol.");
        return;
      }

      const pendingToken = sessionStorage.getItem("pendingInvitationToken");
      if (pendingToken) return;

      if (user.role === "ADMIN") navigate("/admin/dashboard");
      else if (user.role === "EMPLEADO") navigate("/empleado/dashboard");
      else if (user.role === "CLIENTE") navigate("/cliente/dashboard");
      else navigate("/");

    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const nombre = e.target.nombre.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!password) {
      setErrorMessage("La contraseña es obligatoria");
      return;
    }

    try {
      await apiRegister(nombre, email, password);
      const user = await login(email, password);
      sessionStorage.setItem("justLoggedIn", "true");

      const pendingToken = sessionStorage.getItem("pendingInvitationToken");
      if (pendingToken) return;

      if (user.role === "ADMIN") navigate("/admin/dashboard");
      else if (user.role === "EMPLEADO") navigate("/empleado/dashboard");
      else if (user.role === "CLIENTE") navigate("/cliente/dashboard");
      else navigate("/");

      window.location.reload();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_LOGIN_URL;
  };

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handleFinish = () => {
    setStep(0);
    setSignIn(true);
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          width: "100vw",
          minHeight: "100vh",
          backgroundColor: "#e3f2fd",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: "20px",
          overflowX: "hidden"
        }}
      >
        <Components.Container>
          <Components.SignUpContainer signin={signIn}>
            <Components.Form onSubmit={handleRegister}>
              <Components.StyledImage src={logo} alt="PackAndGo" width="100" />
              <Components.Title>Regístrate</Components.Title>
              <Components.Input type="text" name="nombre" placeholder="Nombre" required />
              <Components.Input type="email" name="email" placeholder="Correo" required />
              <PasswordInput name="password" placeholder="Contraseña" required minLength={6} />
              <Components.Button type="submit">Registrarse</Components.Button>
            </Components.Form>
          </Components.SignUpContainer>

          <Components.SignInContainer signin={signIn}>
            {step > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%", marginTop: "35px" }}>
                {step === 1 && <RecuperarContraseña setStep={setStep} onNext={handleNextStep} />}
                {step === 2 && <VerificarCodigo setStep={setStep} onNext={handleNextStep} />}
                {step === 3 && <RestablecerContraseña setStep={setStep} onFinish={handleFinish} />}
              </div>
            ) : (
              <Components.Form onSubmit={handleLogin}>
                <Components.StyledImage src={logo} alt="PackAndGo" width="100" />
                <Components.Title>Inicia Sesión</Components.Title>
                <Components.Input type="email" name="email" placeholder="Correo" required />
                <PasswordInput name="password" placeholder="Contraseña" required />
                <Components.Button type="submit">Iniciar Sesión</Components.Button>

                <p style={{ margin: "1px 0", color: "#999" }}>ó</p>

                <Components.GhostButton onClick={handleGoogleLogin} style={{
                  backgroundColor: "#fff",
                  color: "#1976d2",
                  border: "1px solid #ccc",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "4px 20px",
                }}>
                  Inicia sesión con <img src={googleLogo} alt="Google" width="20" height="20" />
                </Components.GhostButton>

                <Components.StyledRecoverLink to="#" onClick={(e) => {
                  e.preventDefault();
                  setStep(1);
                }}>
                  ¿Olvidaste tu contraseña?
                </Components.StyledRecoverLink>
              </Components.Form>
            )}
          </Components.SignInContainer>

          <Components.OverlayContainer signin={signIn}>
            <Components.Overlay signin={signIn}>
              <Components.LeftOverlayPanel signin={signIn}>
                <Components.Title overlayTitle>¡Bienvenido de nuevo!</Components.Title>
                <Components.Paragraph>Inicia sesión para continuar</Components.Paragraph>
                <Components.GhostButton onClick={() => setSignIn(true)}>Iniciar Sesión</Components.GhostButton>
              </Components.LeftOverlayPanel>

              <Components.RightOverlayPanel signin={signIn}>
                <Components.Title overlayTitle>¡Hola, viajero!</Components.Title>
                <Components.Paragraph>Regístrate y empieza a explorar</Components.Paragraph>
                <Components.GhostButton onClick={() => setSignIn(false)}>Regístrate</Components.GhostButton>
              </Components.RightOverlayPanel>
            </Components.Overlay>
          </Components.OverlayContainer>
        </Components.Container>

        {errorMessage && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "400px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
            }}>
              <p>{errorMessage}</p>
              <button
                onClick={() => setErrorMessage(null)}
                style={{
                  marginTop: "15px",
                  padding: "8px 20px",
                  border: "none",
                  backgroundColor: "#1976d2",
                  color: "white",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AuthPage;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import HomePage from "./views/HomePage";
import AdminDashboardPage from "./views/AdminDashboardPage";
import EmpleadoDashboardPage from "./views/EmpleadoDashboardPage";
import AuthPage from "./views/AuthPage";
import RecuperarContraseña from "./components/Auth/recuperarContraseña";
import RestablecerContraseña from "./components/Auth/restablecerContraseña";
import VerificarCodigo from "./components/Auth/verificarCodigo";
import AdminEmpleadosPage from "./views/AdminEmpleadosPage";

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/empleado/dashboard" element={<EmpleadoDashboardPage />} />
        <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
        <Route path="/restablecer-contraseña" element={<RestablecerContraseña />} />
        <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/admin/empleados" element={<AdminEmpleadosPage />} />
      </Routes>
    </Router>
  );
};

export default App;


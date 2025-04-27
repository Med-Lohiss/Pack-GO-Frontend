import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import HomePage from "./views/HomePage";
import AuthPage from "./views/AuthPage";
import AdminDashboardPage from "./views/AdminDashboardPage";
import EmpleadoDashboardPage from "./views/EmpleadoDashboardPage";
import ClienteDashboardPage from "./views/ClienteDashboardPage";
import AdminEmpleadosPage from "./views/AdminEmpleadosPage";
import AdminEmpresaPage from "./views/AdminEmpresaPage";

import RecuperarContraseña from "./components/Auth/recuperarContraseña";
import RestablecerContraseña from "./components/Auth/restablecerContraseña";
import VerificarCodigo from "./components/Auth/verificarCodigo";
import OAuth2Success from "./components/Auth/OAuth2Success";
import ViajeDetalle from "./components/Cliente/ViajeDetalle";
import ViajeDetalleEmpleado from './components/Empleado/ViajeDetalleEmpleado';
import ViajeDetalleCliente from './components/Empleado/ViajeDetalleCliente';

import RutaProtegida from "./components/Shared/RutaProtegida";

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
        <Route path="/restablecer-contraseña" element={<RestablecerContraseña />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/oauth2/success" element={<OAuth2Success />} />
        <Route
          path="/admin/dashboard"
          element={
            <RutaProtegida rolRequerido="ADMIN">
              <AdminDashboardPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/empleados"
          element={
            <RutaProtegida rolRequerido="ADMIN">
              <AdminEmpleadosPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/empresa"
          element={
            <RutaProtegida rolRequerido="ADMIN">
              <AdminEmpresaPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/empleado/dashboard"
          element={
            <RutaProtegida rolRequerido="EMPLEADO">
              <EmpleadoDashboardPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/cliente/dashboard"
          element={
            <RutaProtegida rolRequerido="CLIENTE">
              <ClienteDashboardPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/cliente/viajes/:id"
          element={
            <RutaProtegida rolRequerido="CLIENTE">
              <ViajeDetalle />
            </RutaProtegida>
          }
        />
        <Route
          path="/empleado/viajes/:id"
          element={
            <RutaProtegida rolRequerido="EMPLEADO">
              <ViajeDetalleEmpleado />
            </RutaProtegida>
          }
        />
        <Route
          path="/empleado/viajes/:id"
          element={
            <RutaProtegida rolRequerido="EMPLEADO">
              <ViajeDetalleCliente />
            </RutaProtegida>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

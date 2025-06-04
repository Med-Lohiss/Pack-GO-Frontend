import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import HomePage from "./views/HomePage";
import AuthPage from "./views/AuthPage";
import AdminDashboardPage from "./views/AdminDashboardPage";
import AdminEmpleadosPage from "./views/AdminEmpleadosPage";
import AdminEmpresaPage from "./views/AdminEmpresaPage";
import AdminReportes from "./views/AdminReportes";
import ClienteList from "./components/Admin/Clientes/ClienteList";

import EmpleadoMenuPage from "./views/EmpleadoDashboardPage";
import ClienteDashboardPage from "./views/ClienteDashboardPage";

import RecuperarContraseña from "./components/Auth/recuperarContraseña";
import RestablecerContraseña from "./components/Auth/restablecerContraseña";
import VerificarCodigo from "./components/Auth/verificarCodigo";
import OAuth2Success from "./components/Auth/OAuth2Success";

import ViajeDetalle from "./components/Cliente/ViajeDetalle";
import ViajeDetalleEmpleado from "./components/Empleado/ViajeDetalleEmpleado";
import ViajeDetalleCliente from "./components/Empleado/ViajeDetalleCliente";
import ViajeDetalleInvitado from "./components/Cliente/ViajeDetalleInvitado";
import Invitacion from "./components/Cliente/Invitacion";

import PerfilCliente from "./components/Cliente/PerfilCliente";

import RutaProtegida from "./components/Shared/RutaProtegida";

// Importamos las nuevas páginas informativas de Viajes
import Contacto from "./components/Viajes/Contacto";
import Careers from "./components/Viajes/Careers";
import ComoFunciona from "./components/Viajes/ComoFunciona";
import Privacidad from "./components/Viajes/Privacidad";
import Terminos from "./components/Viajes/Terminos";

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

        {/* Invitación */}
        <Route path="/invitacion/:token" element={<Invitacion />} />

        {/* Invitado */}
        <Route path="/invitado/viajes/:id" element={<ViajeDetalleInvitado />} />

        {/* Páginas públicas informativas */}
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/terminos" element={<Terminos />} />

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
          path="/admin/clientes"
          element={
            <RutaProtegida rolRequerido="ADMIN">
              <ClienteList />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/reportes"
          element={
            <RutaProtegida rolRequerido="ADMIN">
              <AdminReportes />
            </RutaProtegida>
          }
        />

        <Route
          path="/empleado/dashboard"
          element={
            <RutaProtegida rolRequerido="EMPLEADO">
              <EmpleadoMenuPage />
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
          path="/empleado/viajes/:id/cliente"
          element={
            <RutaProtegida rolRequerido="EMPLEADO">
              <ViajeDetalleCliente />
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
          path="/cliente/viajes-invitado/:id"
          element={
            <RutaProtegida rolRequerido="CLIENTE">
              <ViajeDetalleInvitado />
            </RutaProtegida>
          }
        />
        <Route
          path="/cliente/perfil"
          element={
            <RutaProtegida rolRequerido="CLIENTE">
              <PerfilCliente />
            </RutaProtegida>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

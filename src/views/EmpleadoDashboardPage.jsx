import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import Sidebar from "../components/Empleado/Sidebar";
import Navbar from "../components/Empleado/Navbar";
import EmpleadoDashboardContent from "../components/Empleado/EmpleadoDashboardContent";

const EmpleadoMenuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabIndex, setTabIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("jwt");
  let nombreEmpleado = "";

  if (token) {
    const decodedToken = jwtDecode(token);
    nombreEmpleado = decodedToken.nombre || "";
  }

  if (role !== "EMPLEADO") {
    navigate("/");
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'clientes') {
      setTabIndex(1);
    } else {
      setTabIndex(0);
    }
  }, [location.search]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar toggleSidebar={toggleSidebar} />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div style={{ flex: 1, padding: "20px", marginTop: "30px" }}>
          <h2>¡Bienvenido {nombreEmpleado}!</h2>
          <EmpleadoDashboardContent tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </div>
      </div>
    </div>
  );
};

export default EmpleadoMenuPage;

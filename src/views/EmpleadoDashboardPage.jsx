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
  const [showAlert, setShowAlert] = useState(false);

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
    const alertShown = localStorage.getItem("alertShown");
    if (!alertShown) {
      setShowAlert(true);
      localStorage.setItem("alertShown", "true");
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");

    let newIndex = 0;
    switch (tab) {
      case "empresa":
        newIndex = 0;
        break;
      case "clientes":
        newIndex = 1;
        break;
      case "comentarios":
        newIndex = 2;
        break;
      default:
        newIndex = 0;
        break;
    }

    setTabIndex(newIndex);
  }, [location.search]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar toggleSidebar={toggleSidebar} />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          style={{
            flex: 1,
            padding: "20px",
            paddingTop: "50px",
            marginTop: "30px",
            backgroundColor: "#f0fdf4",
            position: "relative",
          }}
        >
          {showAlert && (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#065f46",
                color: "#bbf7d0",
                padding: "20px 40px",
                fontWeight: "bold",
                fontSize: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
                textAlign: "center",
                zIndex: 1500,
              }}
            >
              ¡Bienvenido {nombreEmpleado}!
            </div>
          )}
          <EmpleadoDashboardContent tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </div>
      </div>
    </div>
  );
};

export default EmpleadoMenuPage;

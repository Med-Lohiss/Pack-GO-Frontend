import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Empleado/Sidebar";
import Navbar from "../components/Empleado/Navbar";
import DashboardContent from "../components/Empleado/DashboardContent"

const EmpleadoMenuPage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  if (role !== "EMPLEADO") {
    navigate("/");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px", transition: "margin-left 0.3s ease", marginTop: "30px"}}>
          <h2>Bienvenido al Dashboard del empleado</h2>
          <DashboardContent />
        </div>
      </div>
    </div>
  );
};

export default EmpleadoMenuPage;

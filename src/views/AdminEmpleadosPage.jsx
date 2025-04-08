import React from "react";
import Sidebar from "../components/Admin/Sidebar";
import Navbar from "../components/Admin/Navbar";
import EmpleadoList from "../components/Admin/Empleados/EmpleadoList";

const AdminEmpleadosPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px", marginTop: "30px" }}>
          <h2>Gestión de empleados</h2>
          <EmpleadoList />
        </div>
      </div>
    </div>
  );
};

export default AdminEmpleadosPage;

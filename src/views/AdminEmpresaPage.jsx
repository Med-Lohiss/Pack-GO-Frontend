import React from "react";
import Sidebar from "../components/Admin/Sidebar";
import Navbar from "../components/Admin/Navbar";
import EmpresaList from "../components/Admin/Empresa/EmpresaList";

const AdminEmpresaPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px", marginTop: "30px" }}>
          <h2>Información de la empresa</h2>
          <EmpresaList />
        </div>
      </div>
    </div>
  );
};

export default AdminEmpresaPage;

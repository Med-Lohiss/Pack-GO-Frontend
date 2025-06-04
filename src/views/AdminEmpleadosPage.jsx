import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar";
import Navbar from "../components/Admin/Navbar";
import EmpleadoList from "../components/Admin/Empleados/EmpleadoList";
import { IconButton, Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const AdminEmpleadosPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", boxSizing: "border-box" }}>
  <Navbar />
  <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
    <Sidebar />
    <div
      style={{
        flex: 1,
        padding: "20px",
        paddingTop: "70px",
        backgroundColor: "#f0fdf4",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <Box mb={3}>
        <IconButton sx={{ color: "#065f46" }} onClick={handleBackClick}>
          <ArrowBack />
        </IconButton>
      </Box>
      <EmpleadoList />
    </div>
  </div>
</div>
  );
};

export default AdminEmpleadosPage;

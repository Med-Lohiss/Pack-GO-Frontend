import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar";
import Navbar from "../components/Admin/Navbar";
import EmpresaList from "../components/Admin/Empresa/EmpresaList";
import { IconButton, Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const AdminEmpresaPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div
          style={{
            flex: 1,
            padding: "20px",
            marginTop: "50px",
            backgroundColor: "#f0fdf4",
          }}
        >
          <Box mb={3}>
            <IconButton sx={{ color: "#065f46" }} onClick={handleBackClick}>
              <ArrowBack />
            </IconButton>
          </Box>
          <EmpresaList />
        </div>
      </div>
    </div>
  );
};

export default AdminEmpresaPage;

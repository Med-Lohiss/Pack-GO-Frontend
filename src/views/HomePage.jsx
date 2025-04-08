import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const HomePage = () => {
  return (
    <>
      <Header />

      {/* Navbar debajo del header */}
      <Box sx={{ display: "flex", justifyContent: "center", bgcolor: "#eee", p: 2 }}>
        <Button component={Link} to="/" color="primary">Inicio</Button>
        <Button component={Link} to="/register" color="primary">Registrarse</Button>
      </Box>

      {/* Main content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          height: "70vh", 
          px: 2,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Bienvenido a PackAndGo
        </Typography>
        <Typography variant="h6">
          Por favor, inicie sesión o regístrese para continuar.
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 5, py: 2, textAlign: "center", bgcolor: "#ccc" }}>
        <Typography variant="body2">© 2024 PackAndGo. Todos los derechos reservados.</Typography>
      </Box>
    </>
  );
};

export default HomePage;

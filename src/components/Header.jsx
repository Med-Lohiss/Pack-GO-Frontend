import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { useTheme } from "@mui/material/styles";
import heroImage from "../assets/header-hero.jpg"; // Reemplaza por tu imagen

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {/* AppBar fijo y claro */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#e3f2fd", // tono azul MUY claro
          color: "#1976D2", // azul MUI como texto
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 600,
            }}
          >
            PackAndGo
          </Typography>

          <IconButton component={Link} to="/auth" color="inherit">
            <AiOutlineUser size={24} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Imagen justo después del AppBar (sólo escritorio) */}
      {!isMobile && (
        <Box
          component="img"
          src={heroImage}
          alt="Hero Banner"
          sx={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
          }}
        />
      )}
    </>
  );
};

export default Header;

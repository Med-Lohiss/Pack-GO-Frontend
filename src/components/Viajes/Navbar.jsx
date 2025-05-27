import React from "react";
import { AppBar, Toolbar, IconButton, Box, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { useTheme } from "@mui/material/styles";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#e3f2fd",
        color: "#1976D2",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo PackAndGO"
            sx={{ height: 40 }}
          />
        </Box>

        <IconButton component={Link} to="/auth" color="inherit">
          <AiOutlineUser size={24} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

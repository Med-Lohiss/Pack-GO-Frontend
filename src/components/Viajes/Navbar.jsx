import { AppBar, Toolbar, IconButton, Box, Tooltip, useMediaQuery } from "@mui/material";
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
        zIndex: 1300, // Asegura que los Tooltips se vean por encima
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Tooltip title="Logo Pack & GO" arrow>
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo PackAndGO"
              sx={{ height: 40 }}
            />
          </Box>
        </Tooltip>

        <Tooltip title="Iniciar sesión" arrow>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <IconButton component={Link} to="/auth" color="inherit" aria-label="Iniciar sesión">
              <AiOutlineUser size={24} />
            </IconButton>
          </span>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

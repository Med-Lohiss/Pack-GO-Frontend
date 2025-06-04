import { AppBar, Toolbar, Box, Tooltip, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import logo from "../../assets/logo.png";
import { FaSignOutAlt } from "react-icons/fa";

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
        zIndex: 1300, // asegura que el tooltip quede por encima
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
              cursor: "pointer", // mejora accesibilidad y usabilidad
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

        <Tooltip title="Cerrar sesión" arrow>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Link
              to="/"
              className="logout-button"
              style={{ color: '#0d47a1' }}
              aria-label="Cerrar sesión"
            >
              <FaSignOutAlt size={24} />
            </Link>
          </span>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

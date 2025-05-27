import { AppBar, Toolbar, Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { FaSignOutAlt } from 'react-icons/fa';
import NotificacionesCliente from './NotificacionesCliente';

const NavbarCliente = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  const handlePerfilClick = () => {
    navigate('/cliente/perfil');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#e3f2fd",
        color: "#0d47a1",
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo Pack & GO"
            sx={{ height: 40 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <NotificacionesCliente onPerfilClick={handlePerfilClick} />

          <Tooltip title="Cerrar sesión" arrow>
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#0d47a1",
                border: "1px solid #90caf9",
                borderRadius: 2,
                transition: "background-color 0.3s",
                '&:hover': {
                  backgroundColor: "#bbdefb",
                },
              }}
              aria-label="Cerrar sesión"
            >
              <FaSignOutAlt size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarCliente;

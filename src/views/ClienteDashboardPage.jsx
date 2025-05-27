import React, { useEffect, useState } from 'react';
import { Container, Box, Tabs, Tab, Alert } from '@mui/material';
import Viajes from '../components/Cliente/Viajes';
import ViajesInvitado from '../components/Cliente/ViajesInvitado';
import ListaChats from '../components/Cliente/ListaChats';
import NavbarCliente from '../components/Cliente/NavbarCliente';
import api from '../api/api';
import fondo from '../assets/fondo.jpg'; // Imagen de fondo

const ClienteDashboardPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const res = await api.get('/cliente/perfil');
        setUserName(res.data.nombre);
        setUserId(res.data.id);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      }
    };

    fetchUserName();

    if (sessionStorage.getItem("justLoggedIn") === "true") {
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
        sessionStorage.removeItem("justLoggedIn");
      }, 2000);
    }
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
        bgcolor: '#e3f2fd',
        color: '#0d47a1',
      }}
    >
      <NavbarCliente />

      {snackbarOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1500,
          }}
        >
          <Alert
            severity="success"
            sx={{
              fontSize: '1.5rem',
              padding: '20px 40px',
              textAlign: 'center',
              bgcolor: '#90caf9',
              color: '#0d47a1',
              fontWeight: 'bold',
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            ¡Bienvenido {userName}!
          </Alert>
        </Box>
      )}

      <Container
        maxWidth="lg"
        sx={{
          mt: 5,
          flex: 1,
          pb: 6,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `url(${fondo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: '#90caf9', mb: 2 }}>
          <Tabs
            value={tabIndex}
            onChange={handleChangeTab}
            aria-label="tabs cliente"
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: '500',
                color: '#0d47a1',
                textTransform: 'none',
              },
              '& .Mui-selected': {
                fontWeight: '700',
                color: '#0d47a1',
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#90caf9',
                height: 3,
                borderRadius: 3,
              },
            }}
          >
            <Tab label="Mis Viajes" />
            <Tab label="Viajes Invitado" />
            <Tab label="Chats" />
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, fontWeight: 'bold',}}>
          {tabIndex === 0 && <Viajes />}
          {tabIndex === 1 && <ViajesInvitado />}
          {tabIndex === 2 && userId && (
            <ListaChats usuarioId={userId} nombreUsuario={userName} activar={true} />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ClienteDashboardPage;

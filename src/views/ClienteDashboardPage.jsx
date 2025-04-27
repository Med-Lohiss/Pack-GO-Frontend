import React, { useEffect, useState } from 'react';
import { Container, Box, Tabs, Tab, Alert } from '@mui/material';
import PerfilCliente from '../components/Cliente/PerfilCliente';
import Viajes from '../components/Cliente/Viajes';
import Navbar from '../components/Cliente/Navbar';
import api from '../api/api';

const ClienteDashboardPage = () => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userName, setUserName] = useState('');

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const res = await api.get('/cliente/perfil');
        setUserName(res.data.nombre);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      }
    };

    fetchUserName();

    setSnackbarOpen(true);
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 2000);

  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", position: 'relative' }}>
      <Navbar />

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
            }}
          >
            ¡Bienvenido {userName}!
          </Alert>
        </Box>
      )}

      <Container sx={{ mt: 5, flex: 1 }}>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabIndex} onChange={handleChangeTab}>
            <Tab label="Mi Perfil" />
            <Tab label="Mis Viajes" />
          </Tabs>
        </Box>

        {tabIndex === 0 && <PerfilCliente />}
        {tabIndex === 1 && <Viajes />}
      </Container>
    </div>
  );
};

export default ClienteDashboardPage;

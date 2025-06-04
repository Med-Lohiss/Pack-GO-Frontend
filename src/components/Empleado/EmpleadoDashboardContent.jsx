import React from 'react';
import { Box, Tabs, Tab, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ViajesEmpleado from './ViajesEmpleado';
import ViajesCliente from './ViajesCliente';
import ComentariosEmpleado from './ComentariosEmpleado';

const EmpleadoDashboardContent = ({ tabIndex, setTabIndex }) => {
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);

    let tab = "empresa";
    if (newValue === 1) tab = "clientes";
    if (newValue === 2) tab = "comentarios";

    navigate(`/empleado/dashboard?tab=${tab}`);
  };

  const tabStyles = (isActive) => ({
    backgroundColor: isActive ? '#065f46' : 'transparent',
    color: isActive ? '#bbf7d0 !important' : '#065f46',
    borderRadius: '6px',
    fontWeight: 500,
    textTransform: 'none',
    transition: 'background 0.2s ease',
    mx: 1,
    px: 2,
    minHeight: 'auto',
    outline: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: isActive ? '#065f46' : '#d1fae5',
    },
    '&.Mui-selected': {
      outline: 'none',
      boxShadow: 'none',
      border: 'none',
    },
    '&:focus': {
      outline: 'none',
      boxShadow: 'none',
    },
  });

  return (
    <Container>
      <Box
        sx={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '8px',
          p: 1,
          mb: 3,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          TabIndicatorProps={{ style: { display: 'none' } }}
          variant="fullWidth"
        >
          <Tab label="Viajes de Empresa" sx={tabStyles(tabIndex === 0)} />
          <Tab label="Viajes de Clientes" sx={tabStyles(tabIndex === 1)} />
          <Tab label="Comentarios" sx={tabStyles(tabIndex === 2)} />
        </Tabs>
      </Box>

      {tabIndex === 0 && <ViajesEmpleado />}
      {tabIndex === 1 && <ViajesCliente />}
      {tabIndex === 2 && <ComentariosEmpleado />}
    </Container>
  );
};

export default EmpleadoDashboardContent;

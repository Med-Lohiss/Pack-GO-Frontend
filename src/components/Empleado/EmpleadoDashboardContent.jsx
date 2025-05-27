import React from 'react';
import { Box, Tabs, Tab, Container } from '@mui/material';
import ViajesEmpleado from './ViajesEmpleado';
import ViajesCliente from './ViajesCliente';
import ComentariosEmpleado from './ComentariosEmpleado'; // 👈 nuevo componente

const EmpleadoDashboardContent = ({ tabIndex, setTabIndex }) => {
  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabIndex} onChange={handleChange}>
          <Tab label="Viajes de Empresa" />
          <Tab label="Viajes de Clientes" />
          <Tab label="Comentarios" />
        </Tabs>
      </Box>

      {tabIndex === 0 && <ViajesEmpleado />}
      {tabIndex === 1 && <ViajesCliente />}
      {tabIndex === 2 && <ComentariosEmpleado />}
    </Container>
  );
};

export default EmpleadoDashboardContent;

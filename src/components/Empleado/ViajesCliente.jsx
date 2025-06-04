import React, { useEffect, useState } from 'react';
import {
  Typography, Grid, Card, CardContent, Box, CardMedia,
  Snackbar, Alert, Button, Link
} from '@mui/material';
import {
  CalendarTodayOutlined,
  LocationOnOutlined,
  CategoryOutlined
} from '@mui/icons-material';
import api from '../../api/api';
import defaultImage from '../../assets/viaje.jpg';
import { useNavigate } from 'react-router-dom';

const ViajesCliente = () => {
  const [viajesCliente, setViajesCliente] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [mostrarSoloPublicos, setMostrarSoloPublicos] = useState(false);
  const navigate = useNavigate();

  const cargarViajesDeClientes = async () => {
    try {
      const res = await api.get('/empleado/viajes');
      const viajes = res.data?.clientes || [];
      setViajesCliente(viajes);
    } catch (error) {
      console.error('Error al cargar viajes de clientes:', error);
      setSnackbarMessage('No se pudieron cargar los viajes de los clientes');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    cargarViajesDeClientes();
  }, []);

  const formatearFecha = (fechaStr) => {
    const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
  };

  const calcularDias = (inicio, fin) => {
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    return Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;
  };

  const obtenerEstadoViaje = (inicio, fin) => {
    const hoy = new Date();
    const fInicio = new Date(inicio);
    const fFin = new Date(fin);

    if (hoy < fInicio) {
      const dias = calcularDias(hoy, fInicio);
      return `Comienza en ${dias} día${dias > 1 ? 's' : ''}`;
    } else if (hoy >= fInicio && hoy <= fFin) {
      return 'Actualmente en curso';
    } else {
      return 'Finalizado';
    }
  };

  const viajesFiltrados = mostrarSoloPublicos
    ? viajesCliente.filter(v => v.publico)
    : viajesCliente;

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5">
          Viajes compartidos por nuestros clientes
        </Typography>
        <Button
          variant="contained"
          onClick={() => setMostrarSoloPublicos(prev => !prev)}
          sx={{
            backgroundColor: '#065f46',
            '&:hover': { backgroundColor: '#064e3b' }
          }}
        >
          {mostrarSoloPublicos ? 'Mostrar Todos' : 'Mostrar solo públicos'}
        </Button>
      </Box>

      <Grid container spacing={2}>
        {viajesFiltrados.map((viaje) => {
          const duracion = calcularDias(viaje.fechaInicio, viaje.fechaFin);
          const estadoViaje = obtenerEstadoViaje(viaje.fechaInicio, viaje.fechaFin);

          return (
            <Grid item xs={12} md={4} key={viaje.id}>
              <Card
                sx={{
                  width: '300px',
                  mx: 'auto',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: 2,
                  transition: 'background 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#d1fae5',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={viaje.imagenUrl || defaultImage}
                  alt={viaje.titulo}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#065f46', fontWeight: 600 }}>
                    {viaje.titulo}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOnOutlined fontSize="small" sx={{ color: '#065f46' }} />
                    <Typography variant="body2">{viaje.ubicacion}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarTodayOutlined fontSize="small" sx={{ color: '#065f46' }} />
                    <Typography variant="body2">
                      {formatearFecha(viaje.fechaInicio)} → {formatearFecha(viaje.fechaFin)}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <CategoryOutlined fontSize="small" sx={{ color: '#065f46' }} />
                    <Typography variant="body2">{viaje.categoria}</Typography>
                  </Box>

                  <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                    {duracion} día{duracion > 1 ? 's' : ''} - {estadoViaje}
                  </Typography>

                  <Box mt={1}>
                    <Link
                      underline="hover"
                      sx={{
                        cursor: 'pointer',
                        color: '#065f46',
                        fontWeight: 500,
                        '&:hover': {
                          color: '#047857',
                        }
                      }}
                      onClick={() => navigate(`/empleado/viajes/${viaje.id}/cliente`)}
                    >
                      + Ver detalles
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity="error"
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViajesCliente;

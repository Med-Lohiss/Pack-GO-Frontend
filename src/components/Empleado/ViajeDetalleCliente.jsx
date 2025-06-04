import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Grid,
  useMediaQuery,
  useTheme,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  Category,
  ArrowBack,
  Description,
  Share,
  StopCircle
} from '@mui/icons-material';
import api from '../../api/api';
import defaultImage from '../../assets/viaje.jpg';
import dayjs from 'dayjs';
import ActividadesEmpleado from '../Empleado/ActividadesEmpleado';

const ViajeDetalleCliente = () => {
  const { id } = useParams();
  const [viaje, setViaje] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizandoCompartido, setActualizandoCompartido] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const fetchViaje = async () => {
    try {
      const res = await api.get(`/empleado/viajes/${id}`);
      const viajeData = res.data;

      viajeData.publico = !!viajeData.publico;

      setViaje(viajeData);

      const actividadesRes = await api.get(`/empleado/viajes/${id}/actividades`);
      setActividades(actividadesRes.data);
    } catch (err) {
      console.error('Error cargando viaje:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViaje();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const toggleCompartido = async () => {
    if (!viaje.publico) {
      setSnackbar({
        open: true,
        message: 'Este viaje no es público. No se puede compartir.',
        severity: 'warning'
      });
      return;
    }

    setActualizandoCompartido(true);
    try {
      const nuevoEstado = !viaje.compartido;

      await api.patch(`/empleado/viajes/${id}/compartir`, {
        compartido: nuevoEstado
      });

      if (!viaje.publico) {
        await api.put(`/cliente/viajes/${viaje.id}`, { ...viaje, publico: true });
      }

      setViaje({ ...viaje, compartido: nuevoEstado });
      setSnackbar({
        open: true,
        message: nuevoEstado ? 'El viaje ha sido compartido.' : 'El viaje ha dejado de estar compartido.',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al actualizar compartido:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar el estado del viaje.',
        severity: 'error'
      });
    } finally {
      setActualizandoCompartido(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading)
    return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />;
  if (!viaje) return <Typography>No se encontró el viaje</Typography>;

  const fechaInicioFormatted = dayjs(viaje.fechaInicio).format('YYYY-MM-DD');
  const fechaFinFormatted = dayjs(viaje.fechaFin).format('YYYY-MM-DD');

  return (
    <Box
      sx={{
        backgroundColor: '#ecfdf5',
        minHeight: '100vh',
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 6 },
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        <Box mb={3}>
          <IconButton sx={{ color: '#065f46' }} onClick={handleBackClick}>
            <ArrowBack />
          </IconButton>
        </Box>

        <Typography
          variant="h4"
          mb={4}
          fontWeight="bold"
          sx={{ color: '#065f46' }} // verde oscuro
        >
          Tu viaje por: {viaje.ubicacion}
        </Typography>

        <Card
          elevation={4}
          sx={{
            p: 3,
            backgroundColor: '#bbf7d0', // verde claro
            border: '2px solid #a7f3d0', // verde medio
            borderRadius: 3,
            width: '100%',
          }}
        >
          <Grid
            container
            spacing={4}
            direction={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={12} md={6}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
                  <LocationOn sx={{ color: '#065f46', mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#065f46' }}>
                    Destino del viaje:
                  </Typography>
                  <Typography variant="body1" ml={1} sx={{ color: '#065f46' }}>
                    {viaje.ubicacion}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
                  <CalendarToday sx={{ color: '#065f46', mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#065f46' }}>
                    Fecha sugerida:
                  </Typography>
                  <Typography variant="body1" ml={1} sx={{ color: '#065f46' }}>
                    {fechaInicioFormatted} → {fechaFinFormatted}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
                  <Category sx={{ color: '#065f46', mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#065f46' }}>
                    Categoría:
                  </Typography>
                  <Typography variant="body1" ml={1} sx={{ color: '#065f46' }}>
                    {viaje.categoria}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
                  <Description sx={{ color: '#065f46', mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#065f46' }}>
                    Descripción:
                  </Typography>
                  <Typography variant="body1" color="text.secondary" ml={1}>
                    {viaje.descripcion}
                  </Typography>
                </Box>

                {viaje.publico && (
                  <Box display="flex" alignItems="center" mt={3}>
                    <IconButton
                      color={viaje.compartido ? 'error' : 'primary'}
                      onClick={toggleCompartido}
                      disabled={actualizandoCompartido}
                      sx={{ color: viaje.compartido ? '#dc2626' : '#065f46' }}
                    >
                      {viaje.compartido ? <StopCircle /> : <Share />}
                    </IconButton>
                    <Typography variant="body1" ml={1} sx={{ color: '#065f46' }}>
                      {viaje.compartido
                        ? 'Este viaje está compartido.'
                        : 'Este viaje no está compartido.'}
                    </Typography>
                  </Box>
                )}

                {!viaje.publico && (
                  <Box display="flex" alignItems="center" mt={3}>
                    <Typography variant="body1" ml={1} sx={{ color: '#065f46' }}>
                      Este viaje no es público y no se puede compartir.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingLeft: isMobile ? 0 : 2,
              }}
            >
              <CardMedia
                component="img"
                image={viaje.imagenUrl || defaultImage}
                alt={viaje.ubicacion}
                sx={{
                  width: '100%',
                  maxHeight: 300,
                  objectFit: 'cover',
                  borderRadius: 3,
                  border: '2px solid #a7f3d0', // verde medio
                }}
              />
            </Grid>
          </Grid>
        </Card>

        <Box mt={4}>
          <ActividadesEmpleado
            viajeId={viaje.id}
            fechaInicio={viaje.fechaInicio}
            fechaFin={viaje.fechaFin}
            modoCliente={true}
            publico={viaje.publico}
          />
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ViajeDetalleCliente;

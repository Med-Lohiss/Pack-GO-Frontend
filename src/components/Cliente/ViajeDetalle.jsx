// ViajeDetalle.js
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
  IconButton
} from '@mui/material';
import { LocationOn, CalendarToday, Category, ArrowBack, Description } from '@mui/icons-material';
import api from '../../api/api';
import defaultImage from '../../assets/viaje.jpg';
import Actividades from './Actividades';
import dayjs from 'dayjs';

const ViajeDetalle = () => {
  const { id } = useParams();
  const [viaje, setViaje] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const formatearFecha = (fecha) => {
    return dayjs(fecha).format('YYYY-MM-DD');
  };

  const fetchViaje = async () => {
    try {
      const res = await api.get(`/cliente/viajes/${id}`);
      setViaje(res.data);
    } catch (err) {
      console.error('Error cargando viaje:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViaje();
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />;
  if (!viaje) return <Typography>No se encontró el viaje</Typography>;

  const handleBackClick = () => {
    navigate(-1);
  };

  const fechaInicioFormatted = dayjs(viaje.fechaInicio).format('YYYY-MM-DD');
  const fechaFinFormatted = dayjs(viaje.fechaFin).format('YYYY-MM-DD');

  return (
  <Box p={2} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
    <Box sx={{ maxWidth: '90%', width: '100%' }}>
      <Box mb={3}>
        <IconButton  color="primary" onClick={handleBackClick}>
          <ArrowBack />
        </IconButton>
      </Box>

      <Typography variant="h4" mb={4} textAlign="start" fontWeight="bold">
        Tu viaje por: {viaje.ubicacion}
      </Typography>

      <Card elevation={4} sx={{ p: 2, width: 'auto', maxWidth: '100%' }}>
        <Grid container spacing={3} direction={isMobile ? 'column' : 'row'} sx={{ justifyContent: 'space-between' }}>
          {/* Detalles */}
          <Grid item xs={12} md={6}>
            <CardContent>
              {/* Destino */}
              <Box display="flex" alignItems="center" mb={2}>
                <LocationOn color="primary" />
                <Typography variant="h7" ml={1} fontWeight="bold">Destino del viaje:</Typography>
                <Typography variant="subtitle1" ml={1}>{viaje.ubicacion}</Typography>
              </Box>

              {/* Fecha sugerida */}
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarToday color="primary" />
                <Typography variant="h7" ml={1} fontWeight="bold">Fecha sugerida:</Typography>
                <Typography variant="subtitle1" ml={1}>
                  {fechaInicioFormatted} → {fechaFinFormatted}
                </Typography>
              </Box>

              {/* Categoría */}
              <Box display="flex" alignItems="center" mb={2}>
                <Category color="primary" />
                <Typography variant="h7" ml={1} fontWeight="bold">Categoría:</Typography>
                <Typography variant="subtitle1" ml={1}>{viaje.categoria}</Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <Description color="primary" />
                <Typography variant="h7" ml={1} fontWeight="bold">Descripción:</Typography>
                <Typography variant="subtitle1" color="text.secondary" ml={1}>{viaje.descripcion}</Typography>
              </Box>
            </CardContent>
          </Grid>

          {/* Imagen alineada a la derecha */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', padding: 0 }}>
            <CardMedia
              component="img"
              height="100%"
              image={viaje.imagenUrl || defaultImage}
              alt={viaje.ubicacion}
              sx={{
                borderRadius: 2,
                maxHeight: 300,
                objectFit: 'cover',
                maxWidth: '100%',
                width: 'auto',
              }}
            />
          </Grid>
        </Grid>
      </Card>

      <Box mt={4}>
        <Actividades viajeId={viaje.id} fechaInicio={viaje.fechaInicio} fechaFin={viaje.fechaFin} />
      </Box>
    </Box>
    </Box>
  );
};

export default ViajeDetalle;

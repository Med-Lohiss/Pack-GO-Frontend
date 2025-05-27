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
} from '@mui/material';
import { LocationOn, CalendarToday, Category, ArrowBack, Description } from '@mui/icons-material';
import api from '../../api/api';
import defaultImage from '../../assets/viaje.jpg';
import ActividadesInvitado from './ActividadesInvitado';
import dayjs from 'dayjs';

const ViajeDetalleInvitado = () => {
  const { id } = useParams();
  const [viaje, setViaje] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

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

  const handleBackClick = () => {
    navigate('/cliente/dashboard');
  };

  if (loading) return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />;
  if (!viaje) return <Typography>No se encontró el viaje</Typography>;

  const fechaInicioFormatted = dayjs(viaje.fechaInicio).format('YYYY-MM-DD');
  const fechaFinFormatted = dayjs(viaje.fechaFin).format('YYYY-MM-DD');

  return (
    <Box 
      sx={{
        backgroundColor: '#e3f2fd',
        minHeight: '100vh',
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 6 },
      }}
    >
      <Box maxWidth="lg" mx="auto">
        <Box mb={3}>
          <IconButton color="primary" onClick={handleBackClick}>
            <ArrowBack />
          </IconButton>
        </Box>

        <Typography variant="h4" mb={4} fontWeight="bold" style={{ color: '#0D47A1' }}>
          Tu viaje por: {viaje.ubicacion}
        </Typography>

        <Card
          elevation={3}
          sx={{
            backgroundColor: '#bbdefb',
            border: '1px solid #90caf9',
            borderRadius: 3,
            px: { xs: 2, md: 4 },
            py: 3,
          }}
        >
          <Grid
            container
            spacing={4}
            direction={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
          >
            <Grid item xs={12} md={6}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
                  <LocationOn sx={{ color: '#0d47a1', mr: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    Destino del viaje:
                  </Typography>
                  <Typography variant="body1" ml={1}>{viaje.ubicacion}</Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
                  <CalendarToday sx={{ color: '#0d47a1', mr: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    Fecha sugerida:
                  </Typography>
                  <Typography variant="body1" ml={1}>
                    {fechaInicioFormatted} → {fechaFinFormatted}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
                  <Category sx={{ color: '#0d47a1', mr: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    Categoría:
                  </Typography>
                  <Typography variant="body1" ml={1}>{viaje.categoria}</Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
                  <Description sx={{ color: '#0d47a1', mr: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    Descripción:
                  </Typography>
                  <Typography variant="body1" color="text.secondary" ml={1}>{viaje.descripcion}</Typography>
                </Box>
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
                  border: '1px solid #90caf9',
                }}
              />
            </Grid>
          </Grid>
        </Card>

        <Box mt={4}>
          <ActividadesInvitado viajeId={viaje.id} fechaInicio={viaje.fechaInicio} fechaFin={viaje.fechaFin} />
        </Box>
      </Box>
    </Box>
  );
};

export default ViajeDetalleInvitado;

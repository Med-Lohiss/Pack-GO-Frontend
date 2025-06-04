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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert
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
  const [openDialog, setOpenDialog] = useState(false);
  const [emailInvitado, setEmailInvitado] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
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
    navigate(-1);
  };

  const verificarInvitacionExistente = async () => {
    try {
      const res = await api.get(`/cliente/viajes/${id}/invitaciones/existe`, {
        params: { email: emailInvitado }
      });
      return res.data === true;
    } catch (err) {
      console.error('Error verificando invitación:', err);
      return false;
    }
  };

  const handleEnviarInvitacion = async () => {
    if (!emailInvitado) {
      setError('Debes ingresar un email.');
      return;
    }

    setEnviando(true);
    setError('');

    const yaExiste = await verificarInvitacionExistente();
    if (yaExiste) {
      setSnackbar({
        open: true,
        message: 'Este usuario ya ha sido invitado a este viaje.',
        severity: 'error'
      });
      setEnviando(false);
      return;
    }

    try {
      await api.post(`/cliente/viajes/${id}/invitaciones`, {
        emailInvitado: emailInvitado
      });

      setOpenDialog(false);
      setEmailInvitado('');
      setSnackbar({
        open: true,
        message: 'Invitación enviada correctamente.',
        severity: 'success'
      });
    } catch (err) {
      setError('No se pudo enviar la invitación. Verifica el email.');
    } finally {
      setEnviando(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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

                <Box mt={3}>
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{
                      backgroundColor: '#0d47a1',
                      color: '#fff',
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                    onClick={() => setOpenDialog(true)}
                  >
                    Invitar a viajero
                  </Button>
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
          <Actividades viajeId={viaje.id} fechaInicio={viaje.fechaInicio} fechaFin={viaje.fechaFin} />
        </Box>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              border: '1px solid #90caf9',
            },
          }}
        >
          <DialogTitle sx={{ color: '#0d47a1' }}>Invitar a este viaje</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Email del invitado"
              variant="outlined"
              type="email"
              autoComplete="email"
              inputProps={{
                autoCapitalize: 'none',
              }}
              sx={{
                mt: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                },
              }}
              value={emailInvitado}
              onChange={(e) => setEmailInvitado(e.target.value)}
            />

            {error && <Typography color="error" mt={1}>{error}</Typography>}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenDialog(false)} disabled={enviando}>
              Cancelar
            </Button>
            <Button
              onClick={handleEnviarInvitacion}
              disabled={enviando}
              variant="contained"
              sx={{ backgroundColor: '#0d47a1' }}
            >
              {enviando ? 'Enviando...' : 'Enviar invitación'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ViajeDetalle;

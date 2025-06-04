import React, { useEffect, useState } from 'react';
import {
  Typography, Button, Grid, Card, CardContent, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, IconButton, Box, CardMedia,
  MenuItem, Select, InputLabel, FormControl, Snackbar, Alert, Link
} from '@mui/material';
import {
  DeleteOutline,
  EditOutlined,
  AddOutlined,
  CalendarTodayOutlined,
  LocationOnOutlined,
  CategoryOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import defaultImage from '../../assets/viaje.jpg';

const categoriasDisponibles = [
  'Aventura', 'Cultural', 'Relax', 'Gastronómico', 'Playa',
  'Rural', 'Urbano', 'Naturaleza', 'Fiesta', 'Deportivo'
];

const ViajesEmpleado = () => {
  const [viajes, setViajes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '', descripcion: '', ubicacion: '',
    fechaInicio: '', fechaFin: '', categoria: '',
    imagen: ''
  });

  // Estado para diálogo de confirmación de eliminación
  const [confirmarEliminacionDialogOpen, setConfirmarEliminacionDialogOpen] = useState(false);
  const [viajeAEliminar, setViajeAEliminar] = useState(null);

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const cargarViajes = async () => {
    try {
      const res = await api.get('/empleado/viajes');
      setViajes(res.data.empleados || []);
    } catch (error) {
      console.error('Error al cargar viajes', error);
    }
  };

  useEffect(() => {
    cargarViajes();
  }, []);

  const abrirDialog = (viaje = null) => {
    if (viaje) {
      setEditando(viaje.id);
      setFormData({ ...viaje });
    } else {
      setEditando(null);
      setFormData({
        titulo: '', descripcion: '', ubicacion: '',
        fechaInicio: '', fechaFin: '', categoria: '', imagen: ''
      });
    }
    setOpenDialog(true);
  };

  const cerrarDialog = () => setOpenDialog(false);

  const abrirDialogConfirmacionEliminacion = (viaje) => {
    setViajeAEliminar(viaje);
    setConfirmarEliminacionDialogOpen(true);
  };

  const cerrarDialogConfirmacionEliminacion = () => {
    setViajeAEliminar(null);
    setConfirmarEliminacionDialogOpen(false);
  };

  const obtenerImagenPorUbicacion = async (ubicacion) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/cliente/pexels-imagen?ubicacion=${encodeURIComponent(ubicacion)}`
      );
      if (!response.ok) {
        console.error('Error HTTP al buscar imagen:', response.status);
        return null;
      }
      const data = await response.json();
      return data.url || null;
    } catch (error) {
      console.error('Error buscando imagen de Pexels:', error);
      return null;
    }
  };

  const guardarViaje = async () => {
    try {
      let imagenUrl = formData.imagen;

      if (!imagenUrl && formData.ubicacion) {
        imagenUrl = await obtenerImagenPorUbicacion(formData.ubicacion);
      }

      if (editando && formData.ubicacion !== viajes.find(v => v.id === editando)?.ubicacion) {
        imagenUrl = await obtenerImagenPorUbicacion(formData.ubicacion);
      }

      const viajeData = { ...formData, imagenUrl: imagenUrl || '' };

      if (editando) {
        await api.put(`/empleado/viajes/${editando}`, viajeData);
        setSnackbarMessage('Viaje actualizado con éxito');
      } else {
        await api.post('/empleado/viajes', viajeData);
        setSnackbarMessage('Viaje creado con éxito');
      }

      cargarViajes();
      cerrarDialog();
    } catch (error) {
      console.error('Error al guardar viaje', error);
      setSnackbarMessage('Error al guardar el viaje');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const eliminarViaje = async () => {
    if (!viajeAEliminar) return;

    try {
      await api.delete(`/empleado/viajes/${viajeAEliminar.id}`);
      setSnackbarMessage('Viaje eliminado con éxito');
      cargarViajes();
    } catch (error) {
      console.error('Error al eliminar viaje', error);
      setSnackbarMessage('Error al eliminar el viaje');
    } finally {
      setSnackbarOpen(true);
      cerrarDialogConfirmacionEliminacion();
    }
  };

  const formatearFecha = (fechaStr) => {
    const opciones = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(fechaStr).toLocaleDateString('es-ES', opciones).replace(',', '');
  };

  const calcularDias = (inicio, fin) => {
    const msPorDia = 1000 * 60 * 60 * 24;
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    return Math.ceil((fechaFin - fechaInicio) / msPorDia + 1);
  };

  const obtenerEstadoViaje = (inicio, fin) => {
    const hoy = new Date();
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);

    if (hoy < fechaInicio) {
      const dias = calcularDias(hoy, fechaInicio);
      return `Comienza en ${dias} día${dias > 1 ? 's' : ''}`;
    } else if (hoy >= fechaInicio && hoy <= fechaFin) {
      return 'Actualmente en curso';
    } else {
      return 'Finalizado';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <Button
          startIcon={<AddOutlined />}
          variant="contained"
          onClick={() => abrirDialog()}
          sx={{
            backgroundColor: '#065f46',
            '&:hover': { backgroundColor: '#064e3b' },
            color: '#ffffff',
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Nuevo Viaje
        </Button>
      </Box>
      <Grid container spacing={2}>
        {viajes.map((viaje) => {
          const duracion = calcularDias(viaje.fechaInicio, viaje.fechaFin);
          const estadoViaje = obtenerEstadoViaje(viaje.fechaInicio, viaje.fechaFin);
          const fechaInicioFormatted = formatearFecha(viaje.fechaInicio);
          const fechaFinFormatted = formatearFecha(viaje.fechaFin);

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
                      {fechaInicioFormatted} → {fechaFinFormatted}
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
                      href="#"
                      underline="hover"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/empleado/viajes/${viaje.id}`);
                      }}
                      sx={{
                        cursor: 'pointer',
                        color: '#065f46',
                        fontWeight: 500,
                        '&:hover': { color: '#047857' },
                      }}
                    >
                      + Detalles
                    </Link>
                  </Box>

                  <Box
                    mt={2}
                    sx={{
                      borderTop: '1px solid #d1d5db',
                      pt: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <IconButton onClick={() => abrirDialog(viaje)} sx={{ color: '#065f46' }} title="Editar">
                      <EditOutlined />
                    </IconButton>
                    <IconButton
                      sx={{ color: '#b91c1c' }}
                      onClick={() => abrirDialogConfirmacionEliminacion(viaje)}
                      title="Eliminar"
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Diálogo para crear/editar viaje con estilo verde */}
      <Dialog
        open={openDialog}
        onClose={cerrarDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: '#ecfdf5',
            borderRadius: 3,
            border: '1px solid #a7f3d0',
          },
        }}
      >
        <DialogTitle
          sx={{
            color: '#065f46',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {editando ? 'Editar Viaje' : 'Nuevo Viaje'}
        </DialogTitle>

        <DialogContent>
          {['titulo', 'descripcion', 'ubicacion'].map((campo) => (
            <TextField
              key={campo}
              margin="dense"
              label={campo.charAt(0).toUpperCase() + campo.slice(1)}
              name={campo}
              fullWidth
              value={formData[campo] || ''}
              onChange={(e) => setFormData({ ...formData, [campo]: e.target.value })}
            />
          ))}

          <FormControl fullWidth margin="dense">
            <InputLabel>Categoría</InputLabel>
            <Select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              label="Categoría"
            >
              {categoriasDisponibles.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Fecha Inicio"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.fechaInicio || ''}
            onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Fecha Fin"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.fechaFin || ''}
            onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={cerrarDialog}>Cancelar</Button>
          <Button
            onClick={guardarViaje}
            variant="contained"
            sx={{
              backgroundColor: '#065f46',
              '&:hover': { backgroundColor: '#064e3b' },
              color: '#ffffff',
              textTransform: 'none',
            }}
          >
            {editando ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar viaje, con paleta verde */}
      <Dialog
        open={confirmarEliminacionDialogOpen}
        onClose={cerrarDialogConfirmacionEliminacion}
        PaperProps={{
          sx: {
            backgroundColor: '#ecfdf5',
            borderRadius: 3,
            border: '1px solid #a7f3d0',
          },
        }}
      >
        <DialogTitle sx={{ color: '#065f46', fontWeight: 'bold' }}>
          Confirmación de eliminación
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#065f46' }}>
            ¿Estás seguro de que quieres eliminar este viaje? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialogConfirmacionEliminacion}>Cancelar</Button>
          <Button
            onClick={eliminarViaje}
            variant="contained"
            sx={{
              backgroundColor: '#b91c1c', // rojo fuerte para alerta eliminación
              '&:hover': { backgroundColor: '#991b1b' },
              color: '#fff',
              textTransform: 'none',
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbarMessage.includes('Error') ? 'error' : 'success'}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViajesEmpleado;

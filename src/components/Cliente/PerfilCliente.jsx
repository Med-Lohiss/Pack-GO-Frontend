import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Paper,
  Box,
  Stack,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../api/api';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const PerfilCliente = () => {
  const [perfil, setPerfil] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get('/cliente/perfil');
        setPerfil(res.data);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      }
    };
    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      const res = await api.put('/cliente/perfil', perfil);
      setPerfil(res.data);
      setEditMode(false);
      setSnackbarMessage('Perfil actualizado con éxito');
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error al actualizar perfil');
    }
    setSnackbarOpen(true);
  };

  const handleEliminarCuenta = async () => {
    try {
      await api.delete('/cliente/perfil');
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  const handleVolver = () => {
    navigate(-1);
  };

  if (!perfil) return <Typography>Cargando perfil...</Typography>;

  return (
    <>
      <Navbar />

      <Box
        sx={{
          backgroundColor: '#E3F2FD',
          py: 4,
          minHeight: '100vh',
        }}
      >
        <Paper
          sx={{
            p: 4,
            maxWidth: 900,
            margin: 'auto',
            backgroundColor: '#E3F2FD',
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#0D47A1',
                fontWeight: 'bold',
              }}
            >
              Mi Perfil
            </Typography>
            <Tooltip title="Volver atrás" arrow>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={handleVolver}
                sx={{
                  backgroundColor: '#0D47A1',
                  '&:hover': { backgroundColor: '#1565C0' },
                  borderRadius: 2,
                }}
              >
                Volver
              </Button>
            </Tooltip>
          </Stack>

          <Box display="flex" flexDirection="column" gap={2}>
            <Grid container spacing={2}>
              {[
                { label: 'Nombre', name: 'nombre' },
                { label: 'Apellido 1', name: 'apellido1' },
                { label: 'Apellido 2', name: 'apellido2' },
                { label: 'DNI', name: 'dni' },
                { label: 'Teléfono', name: 'telefono' },
                { label: 'Domicilio', name: 'domicilio' },
                { label: 'Fecha de Nacimiento', name: 'fechaNacimiento', type: 'date' },
              ].map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    type={field.type || 'text'}
                    value={perfil[field.name] || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 1,
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => setEditMode(!editMode)}
                  sx={{
                    backgroundColor: '#0D47A1',
                    '&:hover': { backgroundColor: '#1565C0' },
                  }}
                >
                  {editMode ? 'Cancelar' : 'Editar'}
                </Button>
              </Grid>
              {editMode && (
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleGuardar}
                    sx={{
                      backgroundColor: '#0D47A1',
                      '&:hover': { backgroundColor: '#1565C0' },
                    }}
                  >
                    Guardar Cambios
                  </Button>
                </Grid>
              )}
              <Grid item>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setOpenConfirmDialog(true)}
                >
                  Eliminar cuenta
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#E3F2FD',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: '#0D47A1',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          ¿Estás seguro?
        </DialogTitle>
        <DialogContent>
          Esta acción eliminará tu cuenta y deberás registrarte de nuevo si deseas volver.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancelar</Button>
          <Button color="error" onClick={handleEliminarCuenta}>
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
    </>
  );
};

export default PerfilCliente;

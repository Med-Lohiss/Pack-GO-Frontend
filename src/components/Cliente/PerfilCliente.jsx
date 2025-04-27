// src/components/Cliente/PerfilCliente.jsx
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
} from '@mui/material';
import api from '../../api/api';

const PerfilCliente = () => {
  const [perfil, setPerfil] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
      await api.delete('/cliente/perfil'); // implementar en el backend
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  if (!perfil) return <Typography>Cargando perfil...</Typography>;

  return (
    <Paper sx={{ p: 4, maxWidth: 900, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Mi Perfil
      </Typography>

      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={2}>
          {[
            { label: 'Nombre', name: 'nombre' },
            { label: 'Apellido 1', name: 'apellido1' },
            { label: 'Apellido 2', name: 'apellido2' },
            { label: 'DNI', name: 'dni' },
            { label: 'Teléfono', name: 'telefono' },
            { label: 'Domicilio', name: 'domicilio' },
          ].map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                value={perfil[field.name] || ''}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Grid>
          ))}
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Nacimiento"
              name="fechaNacimiento"
              type="date"
              value={perfil.fechaNacimiento || ''}
              onChange={handleChange}
              disabled={!editMode}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item>
            <Button variant="contained" onClick={() => setEditMode(!editMode)}>
              {editMode ? 'Cancelar' : 'Editar'}
            </Button>
          </Grid>
          {editMode && (
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleGuardar}>
                Guardar Cambios
              </Button>
            </Grid>
          )}
          <Grid item>
            <Button variant="outlined" color="error" onClick={() => setOpenConfirmDialog(true)}>
              Eliminar cuenta
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Confirmación para eliminar cuenta */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>¿Estás seguro?</DialogTitle>
        <DialogContent>
          Esta acción eliminará tu cuenta y deberás registrarte de nuevo si deseas volver.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancelar</Button>
          <Button color="error" onClick={handleEliminarCuenta}>Eliminar</Button>
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
    </Paper>
  );
};

export default PerfilCliente;

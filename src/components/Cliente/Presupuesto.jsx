import React, { useEffect, useState } from 'react';
import {
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import FormularioGasto from './FormularioGasto';
import GastosLista from './GastosLista';
import api from '../../api/api';

const Presupuesto = ({ viajeId, open, onClose, totalEstimado }) => {
  const [presupuesto, setPresupuesto] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const crearPresupuesto = async () => {
    try {
      const res = await api.post(`/cliente/viajes/${viajeId}/presupuesto`, {
        totalEstimado: totalEstimado || 0,
        totalGastado: 0
      });
      setPresupuesto(res.data);
    } catch (err) {
      console.error('Error creando presupuesto', err);
    }
  };

  const actualizarPresupuestoEstimado = async (nuevoTotalEstimado) => {
    try {
      const res = await api.put(`/cliente/viajes/${viajeId}/presupuesto`, {
        totalEstimado: nuevoTotalEstimado
      });
      setPresupuesto(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        await crearPresupuesto();
      } else {
        console.error('Error actualizando total estimado del presupuesto', err);
      }
    }
  };

  const cargarPresupuesto = async () => {
    try {
      const res = await api.get(`/cliente/viajes/${viajeId}/presupuesto`);
      const data = res.data;

      if (totalEstimado !== undefined && totalEstimado !== data.totalEstimado) {
        await actualizarPresupuestoEstimado(totalEstimado);
        data.totalEstimado = totalEstimado;
      }

      setPresupuesto(data);
    } catch (err) {
      if (err.response?.status === 404) {
        await crearPresupuesto();
      } else {
        console.error('Error cargando presupuesto', err);
      }
    }
  };

  useEffect(() => {
    if (open) {
      cargarPresupuesto();
    }
  }, [viajeId, open, totalEstimado]);

  const handleGastoModificado = async (mensaje = 'Cambios guardados') => {
    await cargarPresupuesto();
    setReloadFlag(prev => !prev);
    setSnackbar({ open: true, message: mensaje, severity: 'success' });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: '#E3F2FD',
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#E3F2FD', color: '#0D47A1', fontWeight: 'bold', textAlign: 'center', py: 2 }}>
          Gastos del viaje
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#E3F2FD', py: 2 }}>
          {presupuesto ? (
            <>
              <Typography variant="body1" color="#0D47A1">Extra gastado: {presupuesto.totalGastado.toFixed(2)}€</Typography>

              <Divider sx={{ my: 2, backgroundColor: '#90CAF9' }} />

              <FormularioGasto
                presupuestoId={presupuesto.id}
                onGastoAgregado={() => handleGastoModificado('Gasto añadido con éxito')}
              />

              <Divider sx={{ my: 2, backgroundColor: '#90CAF9' }} />

              <GastosLista
                presupuestoId={presupuesto.id}
                reload={reloadFlag}
                onGastoEditado={() => handleGastoModificado('Gasto editado con éxito')}
                onGastoEliminado={() => handleGastoModificado('Gasto eliminado con éxito')}
              />
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No se ha definido aún un presupuesto para este viaje.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#E3F2FD', px: 3, pb: 2, justifyContent: 'center' }}>
          <Button onClick={onClose} variant="outlined" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Presupuesto;

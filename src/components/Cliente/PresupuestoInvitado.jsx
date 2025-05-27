import React, { useEffect, useState } from 'react';
import {
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import api from '../../api/api';

const PresupuestoInvitado = ({ viajeId, open, onClose }) => {
  const [presupuesto, setPresupuesto] = useState(null);
  const [gastos, setGastos] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const cargarPresupuesto = async () => {
    try {
      const res = await api.get(`/cliente/viajes/${viajeId}/presupuesto`);
      setPresupuesto(res.data);

      if (res.data?.id) {
        const gastosRes = await api.get(`/cliente/presupuestos/${res.data.id}/gastos`);
        setGastos(gastosRes.data);
      }
    } catch (err) {
      console.error('Error al cargar presupuesto y gastos', err);
      setSnackbar({
        open: true,
        message: 'No se pudo cargar el presupuesto.',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    if (open) {
      cargarPresupuesto();
    }
  }, [viajeId, open]);

  const formatEuros = (valor) => {
    return typeof valor === 'number' ? `${valor.toFixed(2)}€` : 'No disponible';
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
            backgroundColor: '#E3F2FD',  // Fondo azul claro
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#E3F2FD',
            color: '#0D47A1',        // Azul oscuro para texto
            fontWeight: 'bold',
            textAlign: 'center',
            py: 2
          }}
        >
          Gastos extra del viaje
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: '#E3F2FD', py: 2 }}>
          {presupuesto ? (
            <>
              <Typography variant="body1" color="#0D47A1" fontWeight="medium" mb={1}>
                Extra total gastado: {formatEuros(presupuesto.totalGastado)}
              </Typography>

              <Divider sx={{ my: 2, backgroundColor: '#90CAF9' }} />

              <Typography variant="h6" gutterBottom color="#0D47A1" fontWeight="bold">
                Listado de gastos:
              </Typography>

              {gastos.length > 0 ? (
                <List>
                  {gastos.map(gasto => (
                    <React.Fragment key={gasto.id}>
                      <ListItem
                        sx={{
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          gap: 2,
                          padding: 2,
                          borderRadius: 2,
                          backgroundColor: '#BBDEFB', // Azul claro suave para cada gasto
                          mb: 1,
                          boxShadow: 1,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="bold" color="#0D47A1">
                              {gasto.concepto}: {formatEuros(gasto.cantidad)}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="#0D47A1">
                              {gasto.pagadoPor || 'Desconocido'} - {gasto.fechaGasto ? new Date(gasto.fechaGasto).toLocaleDateString() : 'Fecha no disponible'}
                            </Typography>
                          }
                          sx={{ width: '100%' }}
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No hay gastos registrados aún.
                </Typography>
              )}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
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

export default PresupuestoInvitado;

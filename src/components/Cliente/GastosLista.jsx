import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../../api/api';
import FormularioGasto from './FormularioGasto';

const GastosLista = ({ presupuestoId, reload, onGastoEditado, onGastoEliminado }) => {
  const [gastos, setGastos] = useState([]);
  const [gastoEditar, setGastoEditar] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const cargarGastos = async () => {
    try {
      const res = await api.get(`/cliente/presupuestos/${presupuestoId}/gastos`);
      setGastos(res.data);
    } catch (err) {
      console.error('Error cargando gastos', err);
    }
  };

  useEffect(() => {
    if (presupuestoId) {
      cargarGastos();
    }
  }, [presupuestoId, reload]);

  const abrirDialogEditar = (gasto) => {
    setGastoEditar(gasto);
    setDialogOpen(true);
  };

  const cerrarDialogEditar = () => {
    setDialogOpen(false);
    setGastoEditar(null);
  };

  const handleEliminar = async (gastoId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este gasto?')) return;
    try {
      await api.delete(`/cliente/gastos/${gastoId}`);
      await cargarGastos();
      if (onGastoEliminado) await onGastoEliminado();
    } catch (err) {
      console.error('Error eliminando gasto', err);
    }
  };

  const handleGastoEditado = async () => {
    await cargarGastos();
    cerrarDialogEditar();
    if (onGastoEditado) await onGastoEditado();
  };

  if (!gastos.length) {
    return <Typography color="textSecondary">No hay gastos registrados aún.</Typography>;
  }

  return (
    <>
      <List>
        {gastos.map((gasto) => (
          <React.Fragment key={gasto.id}>
            <ListItem
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
                padding: 2,
                borderRadius: 2,
                boxShadow: 1,
                mb: 2,
                backgroundColor: '#E3F2FD',
              }}
            >
              <ListItemText
                primary={`${gasto.concepto}: ${gasto.cantidad.toFixed(2)}€`}
                secondary={`${gasto.pagadoPor} - ${new Date(gasto.fechaGasto).toLocaleDateString()}`}
                sx={{ width: '100%' }}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: { xs: 1, sm: 0 }, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                <IconButton size="small" onClick={() => abrirDialogEditar(gasto)} >
                  <Edit />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleEliminar(gasto.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      <Dialog open={dialogOpen} onClose={cerrarDialogEditar} fullWidth maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: '#E3F2FD', borderRadius: 3 } }}
      >
        <DialogTitle sx={{ backgroundColor: '#E3F2FD', color: '#0D47A1', fontWeight: 'bold', textAlign: 'center', py: 2 }}>
          Editar Gasto
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#E3F2FD' }}>
          <FormularioGasto
            presupuestoId={presupuestoId}
            gastoExistente={gastoEditar}
            onGastoAgregado={handleGastoEditado}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GastosLista;

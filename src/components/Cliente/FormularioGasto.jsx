import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import api from '../../api/api';

const FormularioGasto = ({ presupuestoId, onGastoAgregado, gastoExistente = null }) => {
  const [concepto, setConcepto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [pagadoPor, setPagadoPor] = useState('');
  const [fechaGasto, setFechaGasto] = useState('');

  useEffect(() => {
    if (gastoExistente) {
      setConcepto(gastoExistente.concepto || '');
      setCantidad(gastoExistente.cantidad || '');
      setPagadoPor(gastoExistente.pagadoPor || '');
      setFechaGasto(gastoExistente.fechaGasto?.split('T')[0] || '');
    }
  }, [gastoExistente]);

  const handleGuardarGasto = async () => {
    try {
      if (gastoExistente) {
        await api.put(`/cliente/gastos/${gastoExistente.id}`, {
          concepto,
          cantidad: parseFloat(cantidad),
          pagadoPor,
          fechaGasto,
        });
      } else {
        await api.post('/cliente/gastos', {
          presupuestoId,
          concepto,
          cantidad: parseFloat(cantidad),
          pagadoPor,
          fechaGasto,
        });
      }

      setConcepto('');
      setCantidad('');
      setPagadoPor('');
      setFechaGasto('');
      await onGastoAgregado();
    } catch (err) {
      console.error('Error guardando gasto', err);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} mb={2}>
      <TextField label="Concepto" value={concepto} onChange={(e) => setConcepto(e.target.value)} fullWidth />
      <TextField label="Cantidad (€)" type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} fullWidth />
      <TextField label="Pagado por" value={pagadoPor} onChange={(e) => setPagadoPor(e.target.value)} fullWidth />
      <TextField
        label="Fecha del gasto"
        type="date"
        value={fechaGasto}
        onChange={(e) => setFechaGasto(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <Button
        variant="contained"
        onClick={handleGuardarGasto}
        sx={{
          backgroundColor: '#0D47A1',
          '&:hover': { backgroundColor: '#1565C0' },
          alignSelf: 'center',
        }}
      >
        {gastoExistente ? 'Guardar cambios' : 'Agregar'}
      </Button>

    </Box>
  );
};

export default FormularioGasto;


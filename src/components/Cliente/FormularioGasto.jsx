import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import api from '../../api/api';

const FormularioGasto = ({ presupuestoId, onGastoAgregado, gastoExistente = null }) => {
  const [concepto, setConcepto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [pagadoPor, setPagadoPor] = useState('');
  const [fechaGasto, setFechaGasto] = useState('');

  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    if (gastoExistente) {
      setConcepto(gastoExistente.concepto || '');
      setCantidad(gastoExistente.cantidad || '');
      setPagadoPor(gastoExistente.pagadoPor || '');
      setFechaGasto(gastoExistente.fechaGasto?.split('T')[0] || '');
    }
  }, [gastoExistente]);

  const validarCampos = () => {
    const nuevosErrores = {};
    if (!concepto.trim()) nuevosErrores.concepto = 'El concepto es obligatorio.';
    if (!cantidad || isNaN(cantidad) || parseFloat(cantidad) <= 0) nuevosErrores.cantidad = 'Introduce una cantidad válida mayor que 0.';
    if (!pagadoPor.trim()) nuevosErrores.pagadoPor = 'Este campo es obligatorio.';
    if (!fechaGasto) nuevosErrores.fechaGasto = 'Selecciona la fecha del gasto.';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardarGasto = async () => {
    if (!validarCampos()) {
      setMensajeError('Por favor rellena los campos antes de guardar.');
      return;
    }

    try {
      const data = {
        concepto,
        cantidad: parseFloat(cantidad),
        pagadoPor,
        fechaGasto,
      };

      if (gastoExistente) {
        await api.put(`/cliente/gastos/${gastoExistente.id}`, data);
      } else {
        await api.post('/cliente/gastos', { ...data, presupuestoId });
      }

      setConcepto('');
      setCantidad('');
      setPagadoPor('');
      setFechaGasto('');
      setErrores({});
      setMensajeError('');
      await onGastoAgregado();
    } catch (err) {
      console.error('Error guardando gasto', err);
      setMensajeError('Hubo un error al guardar el gasto. Inténtalo de nuevo.');
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} mb={2}>
      {mensajeError && <Alert severity="error">{mensajeError}</Alert>}
      <TextField
        label="Concepto"
        value={concepto}
        onChange={(e) => setConcepto(e.target.value)}
        fullWidth
        error={!!errores.concepto}
        helperText={errores.concepto}
      />
      <TextField
        label="Cantidad (€)"
        type="number"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        fullWidth
        error={!!errores.cantidad}
        helperText={errores.cantidad}
      />
      <TextField
        label="Pagado por"
        value={pagadoPor}
        onChange={(e) => setPagadoPor(e.target.value)}
        fullWidth
        error={!!errores.pagadoPor}
        helperText={errores.pagadoPor}
      />
      <TextField
        label="Fecha del gasto"
        type="date"
        value={fechaGasto}
        onChange={(e) => setFechaGasto(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        error={!!errores.fechaGasto}
        helperText={errores.fechaGasto}
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

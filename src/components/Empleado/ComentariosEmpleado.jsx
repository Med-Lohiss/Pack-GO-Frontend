import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { Delete, Edit, CheckCircle, Cancel, Flag } from '@mui/icons-material';
import api from '../../api/api';

const motivosReporte = [
  "SPAM",
  "Lenguaje ofensivo",
  "Contenido inapropiado",
  "Publicidad no autorizada",
  "Información falsa",
  "Acoso o bullying",
  "Violación de privacidad",
  "Otro"
];

const ComentariosEmpleado = () => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [editando, setEditando] = useState(null);
  const [contenidoEditado, setContenidoEditado] = useState('');

  // Estados para el diálogo de reporte
  const [openReporte, setOpenReporte] = useState(false);
  const [comentarioAReportar, setComentarioAReportar] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [detalle, setDetalle] = useState('');

  const fetchComentarios = async () => {
    try {
      const response = await api.get('empleado/comentarios');
      setComentarios(response.data);
    } catch (err) {
      console.error('Error al obtener comentarios', err);
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, []);

  const crearComentario = async () => {
    if (!nuevoComentario.trim()) return;
    try {
      await api.post('empleado/comentarios', { contenido: nuevoComentario });
      setNuevoComentario('');
      fetchComentarios();
    } catch (err) {
      console.error('Error al crear comentario', err);
    }
  };

  const eliminarComentario = async (id) => {
    try {
      await api.delete(`empleado/comentarios/${id}`);
      fetchComentarios();
    } catch (err) {
      console.error('Error al eliminar comentario', err);
    }
  };

  const aprobarComentario = async (id) => {
    try {
      await api.patch(`empleado/comentarios/${id}/aprobar`);
      fetchComentarios();
    } catch (err) {
      console.error('Error al aprobar comentario', err);
    }
  };

  const desaprobarComentario = async (comentario) => {
    try {
      await api.put(`empleado/comentarios/${comentario.id}`, {
        contenido: comentario.contenido
      });
      fetchComentarios();
    } catch (err) {
      console.error('Error al desaprobar comentario', err);
    }
  };

  const iniciarEdicion = (comentario) => {
    setEditando(comentario.id);
    setContenidoEditado(comentario.contenido);
  };

  const guardarEdicion = async (id) => {
    try {
      await api.put(`empleado/comentarios/${id}`, { contenido: contenidoEditado });
      setEditando(null);
      setContenidoEditado('');
      fetchComentarios();
    } catch (err) {
      console.error('Error al editar comentario', err);
    }
  };

  // Abrir diálogo de reporte
  const abrirDialogoReporte = (comentario) => {
    setComentarioAReportar(comentario);
    setMotivo('');
    setDetalle('');
    setOpenReporte(true);
  };

  // Cerrar diálogo de reporte
  const cerrarDialogoReporte = () => {
    setOpenReporte(false);
    setComentarioAReportar(null);
  };

  // Enviar reporte
  const enviarReporte = async () => {
    if (!motivo) {
      alert("Por favor, selecciona un motivo para el reporte.");
      return;
    }

    try {
      await api.post('empleado/reportes', {
        comentarioId: comentarioAReportar.id,
        motivo,
        contenido: detalle  // <-- Aquí está el cambio importante
      });
      cerrarDialogoReporte();
      alert("Reporte enviado correctamente.");
    } catch (error) {
      console.error("Error al enviar reporte", error);
      alert("Ocurrió un error al enviar el reporte.");
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Comentarios</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Nuevo comentario"
          fullWidth
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
        />
        <Button variant="contained" onClick={crearComentario}>Publicar</Button>
      </Box>

      <List>
        {comentarios.map((comentario) => (
          <ListItem key={comentario.id} sx={{ borderBottom: '1px solid #ccc', alignItems: 'flex-start' }}>
            <Box sx={{ width: '100%' }}>
              {editando === comentario.id ? (
                <>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      value={contenidoEditado}
                      onChange={(e) => setContenidoEditado(e.target.value)}
                    />
                    <Button variant="contained" onClick={() => guardarEdicion(comentario.id)}>Guardar</Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ListItemText
                    primary={comentario.contenido}
                    secondary={`Autor: ${comentario.autorNombre} | ${comentario.aprobado ? '✅ Aprobado' : '❌ No aprobado'}`}
                  />
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton onClick={() => iniciarEdicion(comentario)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => eliminarComentario(comentario.id)}>
                      <Delete />
                    </IconButton>
                    {comentario.aprobado ? (
                      <IconButton onClick={() => desaprobarComentario(comentario)}>
                        <Cancel color="error" />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => aprobarComentario(comentario.id)}>
                        <CheckCircle color="success" />
                      </IconButton>
                    )}
                    <IconButton
                      aria-label="Reportar comentario"
                      onClick={() => abrirDialogoReporte(comentario)}
                    >
                      <Flag color="warning" />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Dialogo para reportar comentario */}
      <Dialog open={openReporte} onClose={cerrarDialogoReporte}>
        <DialogTitle>Reportar Comentario</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="motivo-label">Motivo</InputLabel>
            <Select
              labelId="motivo-label"
              value={motivo}
              label="Motivo"
              onChange={(e) => setMotivo(e.target.value)}
              required
            >
              {motivosReporte.map((motivoOption) => (
                <MenuItem key={motivoOption} value={motivoOption}>
                  {motivoOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Detalle (opcional)"
            multiline
            rows={3}
            fullWidth
            sx={{ mt: 2 }}
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialogoReporte}>Cancelar</Button>
          <Button variant="contained" onClick={enviarReporte}>Enviar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComentariosEmpleado;

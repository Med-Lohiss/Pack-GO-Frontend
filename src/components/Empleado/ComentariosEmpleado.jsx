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
        contenido: detalle
      });
      cerrarDialogoReporte();
      alert("Reporte enviado correctamente.");
    } catch (error) {
      console.error("Error al enviar reporte", error);
      alert("Ocurrió un error al enviar el reporte.");
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        mx: 'auto',
        bgcolor: '#ecfdf5',  // fondo general verde muy claro
        border: '1px solid #a7f3d0', // borde verde medio
        borderRadius: 2,
        p: 3,
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: '#065f46' }}>
        Comentarios
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Nuevo comentario"
          fullWidth
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          sx={{
            bgcolor: '#bbf7d0', // verde claro para texto activo (campo activo)
            '& .MuiInputBase-root': {
              color: '#065f46', // texto verde oscuro
            }
          }}
        />
        <Button
          variant="contained"
          onClick={crearComentario}
          sx={{
            bgcolor: '#065f46', // verde oscuro fondo
            color: '#bbf7d0', // texto verde claro
            '&:hover': { bgcolor: '#d1fae5', color: '#065f46' } // hover verde pastel
          }}
        >
          Publicar
        </Button>
      </Box>

      <List>
        {comentarios.map((comentario) => (
          <ListItem
            key={comentario.id}
            sx={{
              borderBottom: '1px solid #a7f3d0', // borde verde medio
              alignItems: 'flex-start',
              bgcolor: '#ecfdf5', // fondo verde muy claro
              flexDirection: { xs: 'column', sm: 'row' }, // column en móvil/tablet, row en desktop
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: '75%' }, mb: { xs: 1, sm: 0 } }}>
              {editando === comentario.id ? (
                <>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                      fullWidth
                      value={contenidoEditado}
                      onChange={(e) => setContenidoEditado(e.target.value)}
                      sx={{
                        bgcolor: '#bbf7d0',
                        '& .MuiInputBase-root': {
                          color: '#065f46',
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => guardarEdicion(comentario.id)}
                      sx={{
                        bgcolor: '#065f46',
                        color: '#bbf7d0',
                        '&:hover': { bgcolor: '#d1fae5', color: '#065f46' }
                      }}
                    >
                      Guardar
                    </Button>
                  </Box>
                </>
              ) : (
                <Box>
                  <ListItemText
                    primary={comentario.contenido}
                    secondary={`Autor: ${comentario.autorNombre} | ${comentario.aprobado ? '✅ Aprobado' : '❌ No aprobado'}`}
                    primaryTypographyProps={{ color: '#065f46' }}
                    secondaryTypographyProps={{ color: '#065f46' }}
                  />
                </Box>
              )}
            </Box>

            {editando !== comentario.id && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                  flexWrap: 'wrap',
                  mt: { xs: 1, sm: 0 }
                }}
              >
                <IconButton
                  onClick={() => iniciarEdicion(comentario)}
                  sx={{
                    color: '#065f46',
                    '&:hover': { bgcolor: '#d1fae5' }
                  }}
                  aria-label="Editar comentario"
                >
                  <Edit />
                </IconButton>

                <IconButton
                  onClick={() => eliminarComentario(comentario.id)}
                  sx={{
                    color: '#065f46',
                    '&:hover': { bgcolor: '#d1fae5' }
                  }}
                  aria-label="Eliminar comentario"
                >
                  <Delete />
                </IconButton>

                {comentario.aprobado ? (
                  <IconButton
                    onClick={() => desaprobarComentario(comentario)}
                    sx={{
                      color: '#ef4444', // rojo para desaprobar
                      '&:hover': { bgcolor: '#d1fae5' }
                    }}
                    aria-label="Desaprobar comentario"
                  >
                    <Cancel />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => aprobarComentario(comentario.id)}
                    sx={{
                      color: '#065f46',
                      '&:hover': { bgcolor: '#d1fae5' }
                    }}
                    aria-label="Aprobar comentario"
                  >
                    <CheckCircle />
                  </IconButton>
                )}

                <IconButton
                  aria-label="Reportar comentario"
                  onClick={() => abrirDialogoReporte(comentario)}
                  sx={{
                    color: '#f59e0b', // amarillo para reporte
                    '&:hover': { bgcolor: '#d1fae5' }
                  }}
                >
                  <Flag />
                </IconButton>
              </Box>
            )}
          </ListItem>
        ))}
      </List>

      {/* Dialogo para reportar comentario */}
      <Dialog open={openReporte} onClose={cerrarDialogoReporte}>
        <DialogTitle sx={{ bgcolor: '#065f46', color: '#bbf7d0' }}>
          Reportar Comentario
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#ecfdf5' }}>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="motivo-label">Motivo</InputLabel>
            <Select
              labelId="motivo-label"
              value={motivo}
              label="Motivo"
              onChange={(e) => setMotivo(e.target.value)}
              required
              sx={{ bgcolor: '#bbf7d0', color: '#065f46' }}
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
            sx={{ mt: 2, bgcolor: '#bbf7d0', color: '#065f46' }}
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#ecfdf5' }}>
          <Button onClick={cerrarDialogoReporte} sx={{ color: '#065f46' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={enviarReporte}
            sx={{
              bgcolor: '#065f46',
              color: '#bbf7d0',
              '&:hover': { bgcolor: '#d1fae5', color: '#065f46' }
            }}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComentariosEmpleado;

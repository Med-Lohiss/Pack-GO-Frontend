import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Snackbar,
    Alert,
    Divider,
    Rating
} from '@mui/material';
import { Edit, Delete, ListAlt, AddOutlined } from '@mui/icons-material';
import api from '../../api/api';
import Presupuesto from './Presupuesto';

const tipoActividadOpciones = [
    'Transporte', 'Alojamiento', 'Restaurante', 'Comida rápida',
    'Excursión', 'Cultura', 'Ocio nocturno', 'Aventura',
    'Compras', 'Relajación'
];

const Actividades = ({ viajeId, fechaInicio, fechaFin }) => {
    const [actividades, setActividades] = useState([]);
    const [promediosVotos, setPromediosVotos] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [formData, setFormData] = useState(inicializarFormData());
    const [totalEstimado, setTotalEstimado] = useState(0);
    const [totalGastado, setTotalGastado] = useState(0);
    const [openPresupuesto, setOpenPresupuesto] = useState(false);
    const [snackbar, setSnackbar] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');

    function inicializarFormData() {
        return {
            nombre: '',
            descripcion: '',
            tipo: '',
            fecha: '',
            hora: '',
            precio: ''
        };
    }

    const cargarPromediosVotos = async (actividades) => {
        try {
            const promedios = {};
            await Promise.all(
                actividades.map(async (actividad) => {
                    const res = await api.get(`/cliente/actividades/${actividad.id}/promedio-votos`);
                    promedios[actividad.id] = res.data;
                })
            );
            setPromediosVotos(promedios);
        } catch (error) {
            console.error('Error al cargar promedios de votos:', error);
        }
    };

    const actualizarPresupuestoEstimado = async (nuevoTotalEstimado) => {
        try {
            await api.put(`/cliente/viajes/${viajeId}/presupuesto`, {
                totalEstimado: nuevoTotalEstimado
            });
        } catch (err) {
            if (err.response?.status === 404) {
                console.warn('Presupuesto no encontrado');
            } else {
                console.error('Error actualizando presupuesto estimado', err);
            }
        }
    };

    const cargarActividades = async () => {
        try {
            const res = await api.get(`/cliente/viajes/${viajeId}/actividades`);
            const ordenadas = res.data.sort((a, b) =>
                new Date(`${a.fecha}T${a.hora || '00:00'}`) - new Date(`${b.fecha}T${b.hora || '00:00'}`)
            );
            setActividades(ordenadas);
            const total = ordenadas.reduce((acc, act) => acc + (parseFloat(act.precio) || 0), 0);
            setTotalEstimado(total);

            await actualizarPresupuestoEstimado(total);

            await cargarPromediosVotos(ordenadas);
        } catch (error) {
            console.error('Error al cargar actividades:', error);
        }
    };

    const cargarPresupuesto = async () => {
        try {
            const res = await api.get(`/cliente/viajes/${viajeId}/presupuesto`);
            setTotalGastado(res.data.totalGastado);
        } catch (error) {
            console.error('Error al obtener presupuesto:', error);
        }
    };

    useEffect(() => {
        cargarActividades();
        cargarPresupuesto();
    }, [viajeId]);

    const abrirDialog = (actividad = null) => {
        if (actividad) {
            setEditandoId(actividad.id);
            setFormData({
                nombre: actividad.nombre || '',
                descripcion: actividad.descripcion || '',
                tipo: actividad.tipoActividad || '',
                fecha: actividad.fecha || '',
                hora: actividad.hora || '',
                precio: actividad.precio || ''
            });
        } else {
            setEditandoId(null);
            setFormData(inicializarFormData());
        }
        setOpenDialog(true);
    };

    const cerrarDialog = () => setOpenDialog(false);

    const mostrarSnackbar = (mensaje, tipo = 'success') => {
        setMensaje(mensaje);
        setTipoAlerta(tipo);
        setSnackbar(true);
    };

    const guardarActividad = async () => {
        const payload = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            tipoActividad: formData.tipo,
            fecha: formData.fecha,
            hora: formData.hora,
            precio: formData.precio
        };

        try {
            if (editandoId) {
                await api.put(`/cliente/actividades/${editandoId}`, payload);
                mostrarSnackbar('Actividad actualizada correctamente');
            } else {
                await api.post(`/cliente/viajes/${viajeId}/actividades`, payload);
                mostrarSnackbar('Actividad creada correctamente');
            }
            await cargarActividades();
            cerrarDialog();
        } catch (error) {
            console.error('Error al guardar actividad:', error);
            mostrarSnackbar('Error al guardar actividad', 'error');
        }
    };

    const eliminarActividad = async (id) => {
        try {
            await api.delete(`/cliente/actividades/${id}`);
            await cargarActividades();
            mostrarSnackbar('Actividad eliminada correctamente');
        } catch (error) {
            console.error('Error al eliminar actividad:', error);
            mostrarSnackbar('Error al eliminar actividad', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" mb={2}>
                <ListAlt color="primary" />
                <Typography variant="h6" ml={1}>Itinerario de actividades:</Typography>
            </Box>

            <List dense>
                {actividades.map(({ id, nombre, descripcion, tipoActividad, fecha, hora, precio }, index) => (
                    <React.Fragment key={id}>
                        <ListItem
                            sx={{
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                gap: 2,
                                padding: 2,
                                borderRadius: 2,
                                boxShadow: 1,
                                mb: 2,
                                backgroundColor: index % 2 === 0 ? '#BFCFFF' : '#BBDEFB'
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle1" fontWeight="bold" color="primary.dark">
                                        Actividad: {nombre}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography variant="body2">
                                            <strong style={{ color: '#0D47A1' }}>Tipo:</strong> {tipoActividad}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong style={{ color: '#0D47A1' }}>Descripción:</strong> {descripcion}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong style={{ color: '#0D47A1' }}>Precio por persona:</strong> {precio}€
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong style={{ color: '#0D47A1' }}>Fecha:</strong> {fecha} | <strong style={{ color: '#0D47A1' }}>Hora:</strong> {hora}
                                        </Typography>
                                        {promediosVotos[id] !== undefined && (
                                            <Box mt={1} display="flex" alignItems="center">
                                                <Typography variant="body2" fontWeight="bold" mr={1} sx={{ color: 'primary.dark' }}>
                                                    Valoración promedio:
                                                </Typography>
                                                <Rating
                                                    name={`promedio-${id}`}
                                                    value={promediosVotos[id]}
                                                    precision={0.5}
                                                    readOnly
                                                    size="small"
                                                />
                                                <Typography variant="body2" ml={1}>
                                                    ({promediosVotos[id].toFixed(1)})
                                                </Typography>
                                            </Box>
                                        )}
                                    </>
                                }
                                secondaryTypographyProps={{ component: 'div', style: { whiteSpace: 'pre-line' } }}
                                sx={{ width: '100%' }}
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    mt: { xs: 1, sm: 0 },
                                    alignSelf: { xs: 'flex-end', sm: 'center' }
                                }}
                            >
                                <IconButton size="small" onClick={() => abrirDialog({ id, nombre, descripcion, tipoActividad, fecha, hora, precio })}>
                                    <Edit />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => eliminarActividad(id)}>
                                    <Delete />
                                </IconButton>
                            </Box>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>

            <Button startIcon={<AddOutlined />} variant="contained" onClick={() => abrirDialog()}>
                Agregar Actividad
            </Button>

            <Box mt={2} mb={2} p={2} sx={{ backgroundColor: '#E3F2FD', borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary.dark">
                    Total estimado del viaje por persona: {totalEstimado.toFixed(2)} €
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" color="primary.dark">
                    Total gastos extra: {totalGastado.toFixed(2)} €{' '}
                    <Button size="small" onClick={() => setOpenPresupuesto(true)}>+ Detalles</Button>
                </Typography>
            </Box>

            <Dialog
                open={openDialog}
                onClose={cerrarDialog}
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        backgroundColor: '#E3F2FD',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: '#E3F2FD',
                        color: '#0D47A1',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        py: 2,
                    }}
                >
                    {editandoId ? 'Editar Actividad' : 'Nueva Actividad'}
                </DialogTitle>

                <DialogContent sx={{ backgroundColor: '#E3F2FD', py: 2 }}>
                    <TextField
                        label="Nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                        autoFocus
                        required
                    />
                    <TextField
                        label="Descripción"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                        multiline
                        rows={2}
                    />
                    <FormControl fullWidth margin="dense" required>
                        <InputLabel id="tipo-label">Tipo de actividad</InputLabel>
                        <Select
                            labelId="tipo-label"
                            label="Tipo de actividad"
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleInputChange}
                        >
                            {tipoActividadOpciones.map((tipo) => (
                                <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Fecha"
                        name="fecha"
                        type="date"
                        value={formData.fecha}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            min: fechaInicio,
                            max: fechaFin
                        }}
                        required
                    />
                    <TextField
                        label="Hora"
                        name="hora"
                        type="time"
                        value={formData.hora}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Precio por persona (€)"
                        name="precio"
                        type="number"
                        value={formData.precio}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                        inputProps={{ min: 0, step: 0.01 }}
                        required
                    />
                </DialogContent>

                <DialogActions sx={{ backgroundColor: '#E3F2FD' }}>
                    <Button onClick={cerrarDialog}>Cancelar</Button>
                    <Button variant="contained" onClick={guardarActividad}>
                        {editandoId ? 'Guardar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Presupuesto
                open={openPresupuesto}
                onClose={() => setOpenPresupuesto(false)}
                viajeId={viajeId}
            />

            <Snackbar
                open={snackbar}
                autoHideDuration={3500}
                onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={tipoAlerta} sx={{ width: '100%' }}>
                    {mensaje}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Actividades;

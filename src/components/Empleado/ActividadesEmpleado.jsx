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
    Alert
} from '@mui/material';
import {
    Edit,
    Delete,
    ListAlt,
    AddOutlined
} from '@mui/icons-material';
import api from '../../api/api';

const tipoActividadOpciones = [
    'Transporte', 'Alojamiento', 'Restaurante', 'Comida rápida',
    'Excursión', 'Cultura', 'Ocio nocturno', 'Aventura',
    'Compras', 'Relajación'
];

const ActividadesEmpleado = ({ viajeId, fechaInicio, fechaFin }) => {
    const [actividades, setActividades] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [formData, setFormData] = useState(inicializarFormData());

    const [snackbar, setSnackbar] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');

    function inicializarFormData() {
        return {
            nombre: '',
            descripcion: '',
            fecha: '',
            hora: '',
            precio: '',
            tipo: ''
        };
    }

    const cargarActividades = async () => {
        try {
            const res = await api.get(`/empleado/viajes/${viajeId}/actividades`);
            const ordenadas = res.data.sort((a, b) =>
                new Date(`${a.fecha}T${a.hora || '00:00'}`) - new Date(`${b.fecha}T${b.hora || '00:00'}`)
            );
            setActividades(ordenadas);
        } catch (error) {
            console.error('Error al cargar actividades:', error);
        }
    };

    useEffect(() => {
        cargarActividades();
    }, [viajeId]);

    const abrirDialog = (actividad = null) => {
        if (actividad) {
            setEditandoId(actividad.id);
            setFormData({
                nombre: actividad.nombre || '',
                descripcion: actividad.descripcion || '',
                fecha: actividad.fecha || '',
                hora: actividad.hora || '',
                precio: actividad.precio || '',
                tipo: actividad.tipoActividad || ''
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
            fecha: formData.fecha,
            hora: formData.hora,
            precio: formData.precio,
            tipoActividad: formData.tipo
        };

        try {
            if (editandoId) {
                await api.put(`/empleado/actividades/${editandoId}`, payload);
                mostrarSnackbar('Actividad actualizada correctamente');
            } else {
                await api.post(`/empleado/viajes/${viajeId}/actividades`, payload);
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
            await api.delete(`/empleado/actividades/${id}`);
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
                {actividades.map(({ id, nombre, descripcion, fecha, hora, precio, tipoActividad }) => (
                    <ListItem key={id}
                        secondaryAction={
                            <>
                                <IconButton size="small" onClick={() => abrirDialog({ id, nombre, descripcion, fecha, hora, precio, tipoActividad })}>
                                    <Edit />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => eliminarActividad(id)}>
                                    <Delete />
                                </IconButton>
                            </>
                        }
                    >
                        <ListItemText
                            primary={`Actividad: ${nombre}`}
                            secondary={
                                `Tipo: ${tipoActividad}\n` +
                                `Descripción: ${descripcion}\n` +
                                `Precio por persona: ${precio}€\n` +
                                `Fecha: ${fecha} | Hora: ${hora}`
                            }
                            secondaryTypographyProps={{ component: 'div', style: { whiteSpace: 'pre-line' } }}
                        />
                    </ListItem>
                ))}
            </List>

            <Button startIcon={<AddOutlined />} variant="contained" onClick={() => abrirDialog()}>
                Agregar Actividad
            </Button>

            <Dialog open={openDialog} onClose={cerrarDialog} fullWidth>
                <DialogTitle>{editandoId ? 'Editar Actividad' : 'Nueva Actividad'}</DialogTitle>
                <DialogContent>
                    <TextField
                        name="nombre"
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={formData.nombre}
                        onChange={handleInputChange}
                    />
                    <TextField
                        name="descripcion"
                        margin="dense"
                        label="Descripción"
                        fullWidth
                        multiline
                        rows={3}
                        value={formData.descripcion}
                        onChange={handleInputChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="tipo-label">Tipo de actividad</InputLabel>
                        <Select
                            name="tipo"
                            labelId="tipo-label"
                            value={formData.tipo}
                            onChange={handleInputChange}
                            label="Tipo de actividad"
                        >
                            {tipoActividadOpciones.map((tipo) => (
                                <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        name="fecha"
                        margin="dense"
                        label="Fecha"
                        type="date"
                        fullWidth
                        value={formData.fecha}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            inputProps: {
                                min: fechaInicio,
                                max: fechaFin
                            }
                        }}
                    />
                    <TextField
                        name="hora"
                        margin="dense"
                        label="Hora"
                        type="time"
                        fullWidth
                        value={formData.hora}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        name="precio"
                        margin="dense"
                        label="Precio"
                        type="number"
                        fullWidth
                        value={formData.precio}
                        onChange={handleInputChange}
                        inputProps={{ min: 0 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={cerrarDialog}>Cancelar</Button>
                    <Button onClick={guardarActividad} variant="contained">
                        {editandoId ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar}
                autoHideDuration={3000}
                onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar(false)} severity={tipoAlerta} sx={{ width: '100%' }}>
                    {mensaje}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ActividadesEmpleado;

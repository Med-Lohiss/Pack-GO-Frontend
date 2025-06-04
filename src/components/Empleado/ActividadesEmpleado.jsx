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
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Edit,
    Delete,
    ListAlt,
    AddOutlined
} from '@mui/icons-material';
import api from '../../api/api';

const palette = {
    fondoActivo: '#065f46', // verde oscuro
    textoActivo: '#bbf7d0', // verde claro
    hover: '#d1fae5', // verde pastel
    fondoGeneral: '#ecfdf5', // verde muy claro
    borde: '#a7f3d0' // verde medio
};

const tipoActividadOpciones = [
    'Transporte', 'Alojamiento', 'Restaurante', 'Comida rápida',
    'Excursión', 'Cultura', 'Ocio nocturno', 'Aventura',
    'Compras', 'Relajación'
];

const ActividadesEmpleado = ({ viajeId, fechaInicio, fechaFin, publico = false, modoCliente = false }) => {
    const [actividades, setActividades] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [formData, setFormData] = useState(inicializarFormData());

    const [snackbar, setSnackbar] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        <Box sx={{ bgcolor: palette.fondoGeneral, p: 2, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
                <ListAlt sx={{ color: palette.fondoActivo }} />
                <Typography variant="h6" ml={1} sx={{ color: palette.fondoActivo }}>
                    Itinerario de actividades:
                </Typography>
            </Box>

            <List dense>
                {actividades.map(({ id, nombre, descripcion, fecha, hora, precio, tipoActividad }) => (
                    <ListItem
                        key={id}
                        sx={{
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'flex-start' : 'center',
                            bgcolor: palette.hover,
                            border: `1px solid ${palette.borde}`,
                            borderRadius: 1,
                            mb: 1,
                            p: 2,
                            '&:hover': {
                                bgcolor: palette.textoActivo,
                                '& .MuiListItemText-primary, & .MuiListItemText-secondary': {
                                    color: palette.fondoActivo
                                },
                                '& .icon-button': {
                                    color: palette.fondoActivo
                                }
                            }
                        }}
                    >
                        <ListItemText
                            primary={`Actividad: ${nombre}`}
                            primaryTypographyProps={{ fontWeight: 'bold', color: palette.fondoActivo }}
                            secondaryTypographyProps={{ component: 'div', style: { whiteSpace: 'pre-line', color: palette.fondoActivo } }}
                            secondary={
                                `Tipo: ${tipoActividad}\n` +
                                `Descripción: ${descripcion}\n` +
                                `Precio por persona: ${precio}€\n` +
                                `Fecha: ${fecha} | Hora: ${hora}`
                            }
                        />
                        {(!modoCliente || (modoCliente && publico)) && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    mt: isMobile ? 1 : 0,
                                    ml: isMobile ? 0 : 'auto'
                                }}
                            >
                                <IconButton
                                    size="small"
                                    className="icon-button"
                                    sx={{ color: palette.fondoActivo }}
                                    onClick={() => abrirDialog({ id, nombre, descripcion, fecha, hora, precio, tipoActividad })}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => eliminarActividad(id)}
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        )}
                    </ListItem>
                ))}
            </List>

            {(!modoCliente || (modoCliente && publico)) && (
                <Button
                    startIcon={<AddOutlined />}
                    variant="contained"
                    onClick={() => abrirDialog()}
                    sx={{
                        bgcolor: palette.fondoActivo,
                        color: palette.textoActivo,
                        '&:hover': {
                            bgcolor: palette.hover,
                        },
                        mt: 2
                    }}
                >
                    Agregar Actividad
                </Button>
            )}

            <Dialog open={openDialog} onClose={cerrarDialog} fullWidth>
                <DialogTitle sx={{ bgcolor: palette.fondoActivo, color: palette.textoActivo }}>
                    {editandoId ? 'Editar Actividad' : 'Nueva Actividad'}
                </DialogTitle>
                <DialogContent sx={{ bgcolor: palette.fondoGeneral }}>
                    <TextField
                        name="nombre"
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={formData.nombre}
                        onChange={handleInputChange}
                        sx={{
                            input: { color: palette.fondoActivo },
                            label: { color: palette.fondoActivo },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: palette.borde },
                                '&:hover fieldset': { borderColor: palette.fondoActivo },
                                '&.Mui-focused fieldset': { borderColor: palette.fondoActivo },
                            }
                        }}
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
                        sx={{
                            input: { color: palette.fondoActivo },
                            label: { color: palette.fondoActivo },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: palette.borde },
                                '&:hover fieldset': { borderColor: palette.fondoActivo },
                                '&.Mui-focused fieldset': { borderColor: palette.fondoActivo },
                            }
                        }}
                    />
                    <FormControl fullWidth margin="dense" sx={{
                        '& label': { color: palette.fondoActivo },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: palette.borde },
                            '&:hover fieldset': { borderColor: palette.fondoActivo },
                            '&.Mui-focused fieldset': { borderColor: palette.fondoActivo },
                        },
                        '& .MuiSelect-select': { color: palette.fondoActivo }
                    }}>
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
                        sx={{
                            input: { color: palette.fondoActivo },
                            label: { color: palette.fondoActivo },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: palette.borde },
                                '&:hover fieldset': { borderColor: palette.fondoActivo },
                                '&.Mui-focused fieldset': { borderColor: palette.fondoActivo },
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
                        sx={{
                            input: { color: palette.fondoActivo },
                            label: { color: palette.fondoActivo },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: palette.borde },
                                '&:hover fieldset': { borderColor: palette.fondoActivo },
                                '&.Mui-focused fieldset': { borderColor: palette.fondoActivo },
                            }
                        }}
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
                        sx={{
                            input: { color: palette.fondoActivo },
                            label: { color: palette.fondoActivo },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: palette.borde },
                                '&:hover fieldset': { borderColor: palette.fondoActivo },
                                '&.Mui-focused fieldset': { borderColor: palette.fondoActivo },
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ bgcolor: palette.fondoGeneral }}>
                    <Button onClick={cerrarDialog} sx={{ color: palette.fondoActivo }}>Cancelar</Button>
                    <Button onClick={guardarActividad} variant="contained" sx={{
                        bgcolor: palette.fondoActivo,
                        color: palette.textoActivo,
                        '&:hover': { bgcolor: palette.hover }
                    }}>
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

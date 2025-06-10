import React, { useEffect, useState } from 'react';
import {
    Typography, Button, Grid, Card, CardContent, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, IconButton, Box, CardMedia, Link,
    MenuItem, Select, InputLabel, FormControl, Snackbar, Alert, FormHelperText
} from '@mui/material';
import {
    DeleteOutline,
    EditOutlined,
    AddOutlined,
    CalendarTodayOutlined,
    LocationOnOutlined,
    CategoryOutlined,
    ShareOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import defaultImage from '../../assets/viaje.jpg';

const categoriasDisponibles = [
    'Aventura', 'Cultural', 'Relax', 'Gastronómico', 'Playa',
    'Rural', 'Urbano', 'Naturaleza', 'Fiesta', 'Deportivo'
];

const Viajes = () => {
    const [viajes, setViajes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editando, setEditando] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '', descripcion: '', ubicacion: '',
        fechaInicio: '', fechaFin: '', categoria: '',
        publico: false, imagen: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [compartirDialogOpen, setCompartirDialogOpen] = useState(false);
    const [viajeACompartir, setViajeACompartir] = useState(null);
    const [confirmarEliminacionDialogOpen, setConfirmarEliminacionDialogOpen] = useState(false);
    const [viajeAEliminar, setViajeAEliminar] = useState(null);

    const navigate = useNavigate();

    const cargarViajes = async () => {
        try {
            const res = await api.get('/cliente/viajes');
            setViajes(res.data);
        } catch (error) {
            console.error('Error al cargar viajes', error);
        }
    };

    useEffect(() => {
        cargarViajes();
    }, []);

    const abrirDialog = (viaje = null) => {
        setFormErrors({});
        if (viaje) {
            setEditando(viaje.id);
            setFormData({ ...viaje });
        } else {
            setEditando(null);
            setFormData({
                titulo: '', descripcion: '', ubicacion: '',
                fechaInicio: '', fechaFin: '', categoria: '',
                publico: false, imagen: ''
            });
        }
        setOpenDialog(true);
    };

    const cerrarDialog = () => {
        setOpenDialog(false);
        setFormErrors({});
    };

    const validarFormulario = () => {
        const errores = {};
        if (!formData.titulo) errores.titulo = 'Este campo es obligatorio';
        if (!formData.descripcion) errores.descripcion = 'Este campo es obligatorio';
        if (!formData.ubicacion) errores.ubicacion = 'Este campo es obligatorio';
        if (!formData.fechaInicio) errores.fechaInicio = 'Este campo es obligatorio';
        if (!formData.fechaFin) errores.fechaFin = 'Este campo es obligatorio';
        if (!formData.categoria) errores.categoria = 'Este campo es obligatorio';
        setFormErrors(errores);
        return Object.keys(errores).length === 0;
    };

    const obtenerImagenPorUbicacion = async (ubicacion) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/cliente/pexels-imagen?ubicacion=${encodeURIComponent(ubicacion)}`
            );
            if (!response.ok) {
                console.error('Error HTTP al buscar imagen:', response.status);
                return null;
            }
            const data = await response.json();
            return data.url || null;
        } catch (error) {
            console.error('Error buscando imagen de Pexels:', error);
            return null;
        }
    };

    const guardarViaje = async () => {
        if (!validarFormulario()) return;
        try {
            let imagenUrl = formData.imagen;
            if (!imagenUrl && formData.ubicacion) {
                imagenUrl = await obtenerImagenPorUbicacion(formData.ubicacion);
            }
            const viajeData = { ...formData, imagenUrl: imagenUrl || '' };

            if (editando) {
                await api.put(`/cliente/viajes/${editando}`, viajeData);
                setSnackbarMessage('Viaje actualizado con éxito');
            } else {
                const response = await api.post('/cliente/viajes', viajeData);
                const viajeCreado = response.data;
                const presupuestoInicial = {
                    totalEstimado: 0,
                    totalGastado: 0,
                    fechaActualizacion: null
                };
                await api.post(`/cliente/viajes/${viajeCreado.id}/presupuesto`, presupuestoInicial);
                setSnackbarMessage('Viaje creado con éxito y presupuesto inicial generado');
            }

            cargarViajes();
            cerrarDialog();
        } catch (error) {
            console.error('Error al guardar viaje', error);
            setSnackbarMessage('Error al guardar el viaje');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const eliminarViaje = async () => {
        try {
            await api.delete(`/cliente/viajes/${viajeAEliminar.id}`);
            setSnackbarMessage('Viaje eliminado con éxito');
            cargarViajes();
        } catch (error) {
            console.error('Error al eliminar viaje', error);
            setSnackbarMessage('Error al eliminar el viaje');
        } finally {
            setSnackbarOpen(true);
            cerrarDialogConfirmacionEliminacion();
        }
    };

    const abrirDialogConfirmacionEliminacion = (viaje) => {
        setViajeAEliminar(viaje);
        setConfirmarEliminacionDialogOpen(true);
    };

    const cerrarDialogConfirmacionEliminacion = () => {
        setViajeAEliminar(null);
        setConfirmarEliminacionDialogOpen(false);
    };

    const formatearFecha = (fechaStr) => {
        const opciones = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(fechaStr).toLocaleDateString('es-ES', opciones).replace(',', '');
    };

    const calcularDias = (inicio, fin) => {
        const msPorDia = 1000 * 60 * 60 * 24;
        const fechaInicio = new Date(inicio);
        const fechaFin = new Date(fin);
        return Math.ceil((fechaFin - fechaInicio) / msPorDia + 1);
    };

    const obtenerEstadoViaje = (inicio, fin) => {
        const hoy = new Date();
        const fechaInicio = new Date(inicio);
        const fechaFin = new Date(fin);

        if (hoy < fechaInicio) {
            const dias = calcularDias(hoy, fechaInicio);
            return `Comienza en ${dias} día${dias > 1 ? 's' : ''}`;
        } else if (hoy >= fechaInicio && hoy <= fechaFin) {
            return 'Actualmente en curso';
        } else {
            return 'Finalizado';
        }
    };

    const abrirDialogCompartir = (viaje) => {
        setViajeACompartir(viaje);
        setCompartirDialogOpen(true);
    };

    const cerrarDialogCompartir = () => {
        setViajeACompartir(null);
        setCompartirDialogOpen(false);
    };

    const compartirViaje = async () => {
        try {
            await api.put(`/cliente/viajes/${viajeACompartir.id}`, { ...viajeACompartir, publico: true });
            setSnackbarMessage('Viaje compartido exitosamente');
            cargarViajes();
        } catch (error) {
            console.error('Error al compartir viaje', error);
            setSnackbarMessage('Error al compartir el viaje');
        } finally {
            setSnackbarOpen(true);
            cerrarDialogCompartir();
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
                <Button startIcon={<AddOutlined />} variant="contained" onClick={() => abrirDialog()} color="primary">
                    Nuevo Viaje
                </Button>
            </Box>

            <Grid container spacing={2} justifyContent="center">
                {viajes.map((viaje) => {
                    const duracion = calcularDias(viaje.fechaInicio, viaje.fechaFin);
                    const estadoViaje = obtenerEstadoViaje(viaje.fechaInicio, viaje.fechaFin);
                    const fechaInicioFormatted = formatearFecha(viaje.fechaInicio);
                    const fechaFinFormatted = formatearFecha(viaje.fechaFin);

                    return (
                        <Grid item xs={12} md={4} key={viaje.id}>
                            <Card sx={{ width: '300px', mx: 'auto', backgroundColor: '#E3F2FD', borderRadius: 2 }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={viaje.imagenUrl || defaultImage}
                                    alt={viaje.titulo}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent>
                                    <Typography variant="h6" color="primary">
                                        {viaje.titulo}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LocationOnOutlined fontSize="small" color="primary" />
                                        <Typography variant="body2">{viaje.ubicacion}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <CalendarTodayOutlined fontSize="small" color="primary" />
                                        <Typography variant="body2">
                                            {fechaInicioFormatted} → {fechaFinFormatted}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <CategoryOutlined fontSize="small" color="primary" />
                                        <Typography variant="body2">{viaje.categoria}</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                                        {duracion} día{duracion > 1 ? 's' : ''} - {estadoViaje}
                                    </Typography>
                                    {!viaje.publico && (
                                        <Box mt={1}>
                                            <Link
                                                href="#"
                                                underline="hover"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate(`/cliente/viajes/${viaje.id}`);
                                                }}
                                            >
                                                + Detalles
                                            </Link>
                                        </Box>
                                    )}
                                    <Box mt={2} sx={{ borderTop: '1px solid #ddd', pt: 1, display: 'flex', justifyContent: 'space-between' }}>
                                        {!viaje.publico && (
                                            <>
                                                <IconButton onClick={() => abrirDialog(viaje)} color="primary" title="Editar">
                                                    <EditOutlined />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => abrirDialogConfirmacionEliminacion(viaje)} title="Eliminar">
                                                    <DeleteOutline />
                                                </IconButton>
                                                {estadoViaje === 'Finalizado' && (
                                                    <IconButton title="Compartir viaje" onClick={() => abrirDialogCompartir(viaje)} color="primary">
                                                        <ShareOutlined />
                                                    </IconButton>
                                                )}
                                            </>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Dialog open={openDialog} onClose={cerrarDialog} fullWidth maxWidth="sm"
                PaperProps={{ sx: { backgroundColor: '#E3F2FD', borderRadius: 3 } }}>
                <DialogTitle sx={{ color: '#0D47A1', fontWeight: 'bold', textAlign: 'center' }}>
                    {editando ? 'Editar Viaje' : 'Nuevo Viaje'}
                </DialogTitle>
                <DialogContent>
                    {['titulo', 'descripcion', 'ubicacion'].map((campo) => (
                        <TextField
                            key={campo}
                            margin="dense"
                            label={campo.charAt(0).toUpperCase() + campo.slice(1)}
                            name={campo}
                            fullWidth
                            value={formData[campo] || ''}
                            onChange={(e) => setFormData({ ...formData, [campo]: e.target.value })}
                            error={!!formErrors[campo]}
                            helperText={formErrors[campo]}
                        />
                    ))}
                    <FormControl fullWidth margin="dense" error={!!formErrors.categoria}>
                        <InputLabel>Categoría</InputLabel>
                        <Select
                            value={formData.categoria}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                            label="Categoría"
                        >
                            {categoriasDisponibles.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                        {formErrors.categoria && <FormHelperText>{formErrors.categoria}</FormHelperText>}
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Fecha Inicio"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formData.fechaInicio || ''}
                        onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                        error={!!formErrors.fechaInicio}
                        helperText={formErrors.fechaInicio}
                    />
                    <TextField
                        margin="dense"
                        label="Fecha Fin"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formData.fechaFin || ''}
                        onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                        error={!!formErrors.fechaFin}
                        helperText={formErrors.fechaFin}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={cerrarDialog}>Cancelar</Button>
                    <Button onClick={guardarViaje} variant="contained" color="primary">
                        {editando ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmarEliminacionDialogOpen} onClose={cerrarDialogConfirmacionEliminacion}>
                <DialogTitle>Confirmación de eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que quieres eliminar este viaje? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cerrarDialogConfirmacionEliminacion}>Cancelar</Button>
                    <Button onClick={eliminarViaje} variant="contained" color="error">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={compartirDialogOpen} onClose={cerrarDialogCompartir}>
                <DialogTitle>¿Quieres compartir este viaje?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Una vez compartido, este viaje podrá ser visible para otros usuarios de la aplicación y no podrás acceder a sus detalles, ni modificarlo ó eliminarlo.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cerrarDialogCompartir}>Cancelar</Button>
                    <Button onClick={compartirViaje} variant="contained" color="primary">
                        Compartir
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity={snackbarMessage.includes('Error') ? 'error' : 'success'}
                    onClose={() => setSnackbarOpen(false)}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Viajes;

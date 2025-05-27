import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    CircularProgress,
    Card,
    CardContent,
    CardMedia,
    Grid,
    useMediaQuery,
    useTheme,
    IconButton,
    Snackbar,
    Alert
} from '@mui/material';
import {
    LocationOn,
    CalendarToday,
    Category,
    ArrowBack,
    Description,
    Share,
    StopCircle
} from '@mui/icons-material';
import api from '../../api/api';
import defaultImage from '../../assets/viaje.jpg';
import dayjs from 'dayjs';

const ViajeDetalleCliente = () => {
    const { id } = useParams();
    const [viaje, setViaje] = useState(null);
    const [actividades, setActividades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actualizandoCompartido, setActualizandoCompartido] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const fetchViaje = async () => {
        try {
            const res = await api.get(`/empleado/viajes/${id}`);
            const viajeData = res.data;

            viajeData.publico = !!viajeData.publico;

            setViaje(viajeData);

            const actividadesRes = await api.get(`/empleado/viajes/${id}/actividades`);
            setActividades(actividadesRes.data);
        } catch (err) {
            console.error('Error cargando viaje:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchViaje();
    }, [id]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const toggleCompartido = async () => {
        console.log("¿Viaje es público?:", viaje.publico);

        // Verificar si el viaje no es público
        if (!viaje.publico) {
            setSnackbar({
                open: true,
                message: 'Este viaje no es público. No se puede compartir.',
                severity: 'warning'
            });
            return;
        }

        setActualizandoCompartido(true);
        try {
            const nuevoEstado = !viaje.compartido;

            await api.patch(`/empleado/viajes/${id}/compartir`, {
                compartido: nuevoEstado
            });

            if (!viaje.publico) {
                await api.put(`/cliente/viajes/${viaje.id}`, { ...viaje, publico: true });
            }

            setViaje({ ...viaje, compartido: nuevoEstado });
            setSnackbar({
                open: true,
                message: nuevoEstado ? 'El viaje ha sido compartido.' : 'El viaje ha dejado de estar compartido.',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error al actualizar compartido:', error);
            setSnackbar({
                open: true,
                message: 'Error al actualizar el estado del viaje.',
                severity: 'error'
            });
        } finally {
            setActualizandoCompartido(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />;
    if (!viaje) return <Typography>No se encontró el viaje</Typography>;

    const fechaInicioFormatted = dayjs(viaje.fechaInicio).format('YYYY-MM-DD');
    const fechaFinFormatted = dayjs(viaje.fechaFin).format('YYYY-MM-DD');

    return (
        <Box p={2} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Box sx={{ maxWidth: '90%', width: '100%' }}>
                <Box mb={3}>
                    <IconButton color="primary" onClick={handleBackClick}>
                        <ArrowBack />
                    </IconButton>
                </Box>

                <Typography variant="h4" mb={4} textAlign="start" fontWeight="bold">
                    Tu viaje por: {viaje.ubicacion}
                </Typography>

                <Card elevation={4} sx={{ p: 2, width: '100%' }}>
                    <Grid container spacing={3} direction={isMobile ? 'column' : 'row'} sx={{ justifyContent: 'space-between' }}>
                        <Grid item xs={12} md={6}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <LocationOn color="primary" />
                                    <Typography variant="h7" ml={1} fontWeight="bold">Destino del viaje:</Typography>
                                    <Typography variant="subtitle1" ml={1}>{viaje.ubicacion}</Typography>
                                </Box>

                                <Box display="flex" alignItems="center" mb={2}>
                                    <CalendarToday color="primary" />
                                    <Typography variant="h7" ml={1} fontWeight="bold">Fecha sugerida:</Typography>
                                    <Typography variant="subtitle1" ml={1}>
                                        {fechaInicioFormatted} → {fechaFinFormatted}
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" mb={2}>
                                    <Category color="primary" />
                                    <Typography variant="h7" ml={1} fontWeight="bold">Categoría:</Typography>
                                    <Typography variant="subtitle1" ml={1}>{viaje.categoria}</Typography>
                                </Box>

                                <Box display="flex" alignItems="center" mb={2}>
                                    <Description color="primary" />
                                    <Typography variant="h7" ml={1} fontWeight="bold">Descripción:</Typography>
                                    <Typography variant="subtitle1" color="text.secondary" ml={1}>{viaje.descripcion}</Typography>
                                </Box>

                                {/* Mostrar sólo si el viaje es público */}
                                {viaje.publico && (
                                    <Box display="flex" alignItems="center" mt={3}>
                                        <IconButton
                                            color={viaje.compartido ? "error" : "primary"}
                                            onClick={toggleCompartido}
                                            disabled={actualizandoCompartido}
                                        >
                                            {viaje.compartido ? <StopCircle /> : <Share />}
                                        </IconButton>
                                        <Typography variant="body1" ml={1}>
                                            {viaje.compartido
                                                ? 'Este viaje está compartido.'
                                                : 'Este viaje no está compartido.'}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Mostrar un mensaje si el viaje no es público */}
                                {!viaje.publico && (
                                    <Box display="flex" alignItems="center" mt={3}>
                                        <Typography variant="body1" ml={1}>
                                            Este viaje no es público y no se puede compartir.
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', padding: 0 }}>
                            <CardMedia
                                component="img"
                                height="100%"
                                image={viaje.imagenUrl || defaultImage}
                                alt={viaje.ubicacion}
                                sx={{
                                    borderRadius: 2,
                                    maxHeight: 300,
                                    objectFit: 'cover',
                                    maxWidth: '100%',
                                    width: 'auto',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Card>

                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>Actividades del viaje</Typography>
                    {actividades.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">No hay actividades registradas.</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {actividades.map((actividad) => (
                                <Grid item xs={12} sm={6} md={4} key={actividad.id}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {actividad.titulo}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {actividad.descripcion}
                                            </Typography>
                                            <Typography variant="caption" display="block" mt={1}>
                                                Fecha: {dayjs(actividad.fecha).format('YYYY-MM-DD')}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ViajeDetalleCliente;

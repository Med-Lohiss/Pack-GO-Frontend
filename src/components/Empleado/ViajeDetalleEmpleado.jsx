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
import ActividadesEmpleado from './ActividadesEmpleado';
import dayjs from 'dayjs';

const ViajeDetalleEmpleado = () => {
    const { id } = useParams();
    const [viaje, setViaje] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actualizandoCompartido, setActualizandoCompartido] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const fetchViaje = async () => {
        try {
            const res = await api.get(`/empleado/viajes/${id}`);
            setViaje(res.data);
        } catch (err) {
            console.error('Error cargando viaje:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchViaje();
    }, [id]);

    const toggleCompartido = async () => {
        setActualizandoCompartido(true);
        try {
            const nuevoEstado = !viaje.compartido;
            await api.patch(`/empleado/viajes/${id}/compartir`, {
                compartido: nuevoEstado
            });
            setViaje({ ...viaje, compartido: nuevoEstado });
            setSnackbar({
                open: true,
                message: nuevoEstado ? 'El viaje ha sido compartido exitosamente.' : 'El viaje ha dejado de ser compartido.',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error al actualizar compartido:', error);
            setSnackbar({
                open: true,
                message: 'No tienes permiso para compartir este viaje',
                severity: 'error'
            });
        } finally {
            setActualizandoCompartido(false);
        }
    };

    const handleBackClick = () => navigate(-1);
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

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

                <Typography variant="h4" mb={4} fontWeight="bold">
                    Detalles del viaje a: {viaje.ubicacion}
                </Typography>

                <Card elevation={4} sx={{ p: 2, width: '100%' }}>
                    <Grid container spacing={3} direction={isMobile ? 'column' : 'row'} sx={{ justifyContent: 'space-between' }}>
                        <Grid item xs={12} md={6}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <LocationOn color="primary" />
                                    <Typography variant="h7" ml={1} fontWeight="bold">Destino:</Typography>
                                    <Typography variant="subtitle1" ml={1}>{viaje.ubicacion}</Typography>
                                </Box>

                                <Box display="flex" alignItems="center" mb={2}>
                                    <CalendarToday color="primary" />
                                    <Typography variant="h7" ml={1} fontWeight="bold">Fechas:</Typography>
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
                                    <Typography variant="subtitle1" color="text.secondary" ml={1}>
                                        {viaje.descripcion}
                                    </Typography>
                                </Box>

                                {/* Botón Compartir/No Compartir */}
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
                    <ActividadesEmpleado
                        viajeId={viaje.id}
                        fechaInicio={viaje.fechaInicio}
                        fechaFin={viaje.fechaFin}
                    />
                </Box>
            </Box>

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

export default ViajeDetalleEmpleado;

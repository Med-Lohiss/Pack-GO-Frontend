// src/components/Cliente/ViajesInvitado.jsx
import React, { useEffect, useState } from 'react';
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Link,
    CircularProgress
} from '@mui/material';
import {
    LocationOnOutlined,
    CalendarTodayOutlined,
    CategoryOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import defaultImage from '../../assets/viaje.jpg';
import dayjs from 'dayjs';

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

const ViajesInvitado = () => {
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchViajesInvitado = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    throw new Error('No hay token de autenticación. El usuario no está autenticado.');
                }

                const res = await api.get('/cliente/viajes-compartidos', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setViajes(res.data);
            } catch (err) {
                console.error('Error al cargar viajes como invitado:', err);
                if (err.response && err.response.status === 401) {
                    console.warn('Token inválido o expirado. Considera redirigir al login.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchViajesInvitado();
    }, []);

    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
    if (viajes.length === 0) return <Typography>No has sido invitado a ningún viaje aún.</Typography>;

    return (
        <Grid container spacing={2} justifyContent="center">
            {viajes.map((viaje) => {
                const fechaInicioFormatted = dayjs(viaje.fechaInicio).format('ddd DD/MM/YYYY');
                const fechaFinFormatted = dayjs(viaje.fechaFin).format('ddd DD/MM/YYYY');
                const duracion = calcularDias(viaje.fechaInicio, viaje.fechaFin);
                const estadoViaje = obtenerEstadoViaje(viaje.fechaInicio, viaje.fechaFin);

                return (
                    <Grid item xs={12} md={4} key={viaje.id}>
                        <Card sx={{ width: '300px', mx: 'auto' }}>
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
                                    <Typography variant="body2" color="textSecondary">
                                        {viaje.ubicacion}
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" gap={1}>
                                    <CalendarTodayOutlined fontSize="small" color="primary" />
                                    <Typography variant="body2" color="textSecondary">
                                        {fechaInicioFormatted} → {fechaFinFormatted}
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" gap={1}>
                                    <CategoryOutlined fontSize="small" color="primary" />
                                    <Typography variant="body2" color="textSecondary">
                                        {viaje.categoria}
                                    </Typography>
                                </Box>

                                <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                                    {duracion} día{duracion > 1 ? 's' : ''} - {estadoViaje}
                                </Typography>

                                <Box mt={1}>
                                    <Link
                                        href="#"
                                        underline="hover"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate(`/cliente/viajes-invitado/${viaje.id}`);
                                        }}
                                    >
                                        + Detalles
                                    </Link>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default ViajesInvitado;

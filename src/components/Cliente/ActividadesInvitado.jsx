import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Snackbar,
    Alert,
    Button,
    Rating,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import { ListAlt } from '@mui/icons-material';
import api from '../../api/api';
import PresupuestoInvitado from './PresupuestoInvitado';

const VotacionActividad = ({ actividadId }) => {
    const [valor, setValor] = useState(null);
    const [snackbar, setSnackbar] = useState(false);

    const cargarVoto = async () => {
        try {
            const res = await api.get(`/cliente/actividades/${actividadId}/voto-usuario`);
            if (res.data && res.data.valor !== undefined) {
                setValor(res.data.valor);
            }
        } catch (error) {
            console.error('Error al cargar voto del usuario:', error);
        }
    };

    useEffect(() => {
        cargarVoto();
    }, [actividadId]);

    const handleChange = async (event, newValue) => {
        setValor(newValue);
        try {
            await api.post(`/cliente/actividades/${actividadId}/votar`, { valor: newValue });
            setSnackbar(true);
        } catch (error) {
            console.error('Error al votar:', error);
        }
    };

    return (
        <Box mt={2}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
                ¿Qué te ha parecido?
            </Typography>
            <Rating
                name={`rating-${actividadId}`}
                value={valor}
                precision={0.5}
                onChange={handleChange}
                sx={{
                    color: '#0d47a1',
                    '& .MuiRating-iconFilled': {
                        color: '#0d47a1',
                    },
                    '& .MuiRating-iconHover': {
                        color: '#0d47a1',
                    },
                }}
            />

            <Snackbar
                open={snackbar}
                autoHideDuration={3000}
                onClose={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    ¡Gracias por tu opinión!
                </Alert>
            </Snackbar>
        </Box>
    );
};

const ActividadesInvitado = ({ viajeId }) => {
    const [actividades, setActividades] = useState([]);
    const [totalEstimado, setTotalEstimado] = useState(0);
    const [totalGastado, setTotalGastado] = useState(0);
    const [openPresupuesto, setOpenPresupuesto] = useState(false);
    const [snackbar, setSnackbar] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');

    const cargarActividades = async () => {
        try {
            const res = await api.get(`/cliente/viajes/${viajeId}/actividades`);
            const ordenadas = res.data.sort((a, b) =>
                new Date(`${a.fecha}T${a.hora || '00:00'}`) - new Date(`${b.fecha}T${b.hora || '00:00'}`)
            );
            setActividades(ordenadas);
            const total = ordenadas.reduce((acc, act) => acc + (parseFloat(act.precio) || 0), 0);
            setTotalEstimado(total);
        } catch (error) {
            console.error('Error al cargar actividades:', error);
            setMensaje('Error al cargar actividades');
            setTipoAlerta('error');
            setSnackbar(true);
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

    return (
        <Box>
            <Box display="flex" alignItems="center" mb={3}>
                <ListAlt color="primary" />
                <Typography variant="h5" ml={1} fontWeight="bold">
                    Itinerario de Actividades
                </Typography>
            </Box>

            <Box display="grid" gap={2}>
                {actividades.map(({ id, nombre, descripcion, fecha, hora, precio, tipoActividad }, index) => (
                    <Card
                        key={id}
                        sx={{
                            borderRadius: 3,
                            boxShadow: 3,
                            backgroundColor: index % 2 === 0 ? '#BFCFFF' : '#BBDEFB'
                        }}
                    >
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'space-between',
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                gap: 2,
                                flexWrap: 'wrap'
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary.dark" gutterBottom>
                                    Actividad: {nombre}
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                    <strong style={{ color: '#0D47A1' }}>Tipo:</strong> {tipoActividad}{'\n'}
                                    <strong style={{ color: '#0D47A1' }}>Descripción:</strong> {descripcion}{'\n'}
                                    <strong style={{ color: '#0D47A1' }}>Precio por persona:</strong> {precio} €{'\n'}
                                    <strong style={{ color: '#0D47A1' }}>Fecha:</strong> {fecha} | <strong style={{ color: '#0D47A1' }}>Hora:</strong> {hora}
                                </Typography>
                            </Box>

                            <Box mt={1}>
                                <VotacionActividad actividadId={id} />
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>


            <Divider sx={{ my: 4 }} />

            <Box
                mt={2}
                mb={2}
                p={2}
                display="flex"
                flexDirection="column"
                gap={1}
                sx={{ backgroundColor: '#E3F2FD', borderRadius: 2 }}
            >
                <Typography variant="subtitle1" fontWeight="bold" color="primary.dark">
                    Total estimado del viaje por persona: {totalEstimado.toFixed(2)} €
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" color="primary.dark">
                    Total gastos extra: {totalGastado.toFixed(2)} €{' '}
                    <Button size="small" onClick={() => setOpenPresupuesto(true)}>
                        + Detalles
                    </Button>
                </Typography>
            </Box>


            <PresupuestoInvitado
                open={openPresupuesto}
                onClose={() => setOpenPresupuesto(false)}
                viajeId={viajeId}
            />

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

export default ActividadesInvitado;

import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Dialog,
    Badge
} from '@mui/material';
import api from '../../api/api';

const ChatGrupo = lazy(() => import('../Cliente/Chat/ChatGrupo'));

const ListaChats = ({ usuarioId, nombreUsuario, activar }) => {
    const [viajes, setViajes] = useState([]);
    const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
    const [notificaciones, setNotificaciones] = useState({});
    const mensajesCache = useRef({});
    const localKey = `mensajes_vistos_${usuarioId}`;

    useEffect(() => {
        if (!activar) return;

        const fetchViajes = async () => {
            try {
                const [propios, compartidos] = await Promise.all([
                    api.get('/cliente/viajes'),
                    api.get('/cliente/viajes-compartidos'),
                ]);
                setViajes([...propios.data, ...compartidos.data]);
            } catch (error) {
                console.error('Error cargando viajes:', error);
            }
        };

        fetchViajes();
    }, [activar]);

    useEffect(() => {
        const fetchNotificaciones = async () => {
            if (!activar || viajes.length === 0) return;

            const vistos = JSON.parse(localStorage.getItem(localKey) || '{}');
            const nuevas = {};

            await Promise.all(
                viajes.map(async (viaje) => {
                    try {
                        if (!mensajesCache.current[viaje.id]) {
                            const res = await api.get(`/cliente/chat/viaje/${viaje.id}`);
                            mensajesCache.current[viaje.id] = res.data;
                        }

                        const mensajes = mensajesCache.current[viaje.id];
                        const mensajesOtros = mensajes.filter(msg => msg.usuarioId !== usuarioId);
                        const nuevos = mensajesOtros.length - (vistos[viaje.id] || 0);
                        nuevas[viaje.id] = nuevos > 0 ? nuevos : 0;
                    } catch (err) {
                        console.error(`Error al obtener mensajes del viaje ${viaje.id}:`, err);
                    }
                })
            );

            setNotificaciones(nuevas);
        };

        fetchNotificaciones();
    }, [activar, viajes]);

    const abrirChat = async (viaje) => {
        setViajeSeleccionado(viaje);
        try {
            if (!mensajesCache.current[viaje.id]) {
                const res = await api.get(`/cliente/chat/viaje/${viaje.id}`);
                mensajesCache.current[viaje.id] = res.data;
            }
            const mensajesOtros = mensajesCache.current[viaje.id].filter(msg => msg.usuarioId !== usuarioId);
            const vistos = JSON.parse(localStorage.getItem(localKey) || '{}');
            vistos[viaje.id] = mensajesOtros.length;
            localStorage.setItem(localKey, JSON.stringify(vistos));
            setNotificaciones(prev => ({ ...prev, [viaje.id]: 0 }));
        } catch (err) {
            console.error('Error al marcar mensajes como vistos:', err);
        }
    };

    const manejarMensajesActualizados = (viajeId, nuevosMensajes) => {
        mensajesCache.current[viajeId] = nuevosMensajes;

        const mensajesOtros = nuevosMensajes.filter(msg => msg.usuarioId !== usuarioId);
        const vistos = JSON.parse(localStorage.getItem(localKey) || '{}');
        const nuevos = mensajesOtros.length - (vistos[viajeId] || 0);
        setNotificaciones(prev => ({
            ...prev,
            [viajeId]: nuevos > 0 ? nuevos : 0
        }));
    };

    return (
        <Box sx={{ bgcolor: '#f3f9ff', p: 3, borderRadius: 2, minHeight: '100vh' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#0d47a1', mb: 3 }}>
                Chats de Viajes
            </Typography>

            {viajes.length === 0 ? (
                <Typography sx={{ color: '#1976d2' }}>
                    No tienes viajes disponibles para chatear.
                </Typography>
            ) : (
                viajes.map((viaje) => (
                    <Paper
                        key={viaje.id}
                        sx={{
                            p: 2,
                            mb: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            bgcolor: '#e3f2fd',
                            borderRadius: 2,
                            boxShadow: 1,
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle1" sx={{ color: '#0d47a1' }}>
                                {viaje.titulo}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#1976d2' }}>
                                Ubicación: {viaje.ubicacion}
                            </Typography>
                        </Box>
                        <Badge
                            color="error"
                            badgeContent={notificaciones[viaje.id] || 0}
                            invisible={!notificaciones[viaje.id]}
                            sx={{ mr: 2 }}
                        >
                            <Button
                                variant="contained"
                                onClick={() => abrirChat(viaje)}
                                sx={{
                                    bgcolor: '#1976d2',
                                    '&:hover': { bgcolor: '#115293' },
                                }}
                            >
                                Abrir Chat
                            </Button>
                        </Badge>
                    </Paper>
                ))
            )}

            <Dialog
                open={!!viajeSeleccionado}
                onClose={() => setViajeSeleccionado(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#f3f9ff',
                        borderRadius: 2,
                    },
                }}
            >
                <Box sx={{ p: 3 }}>
                    {viajeSeleccionado && (
                        <Suspense fallback={<Typography>Cargando chat...</Typography>}>
                            <ChatGrupo
                                viajeId={viajeSeleccionado.id}
                                usuarioId={usuarioId}
                                nombreUsuario={nombreUsuario}
                                activar={Boolean(viajeSeleccionado !== null)}
                                onInactividad={() => setViajeSeleccionado(null)}
                                onMensajesActualizados={manejarMensajesActualizados}
                            />
                        </Suspense>
                    )}
                </Box>
            </Dialog>
        </Box>
    );
};

export default ListaChats;

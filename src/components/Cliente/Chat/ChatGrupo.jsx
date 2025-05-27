import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Grid,
    Fab,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import api from '../../../api/api';
import { emoticonos } from '../../../assets/emoticonos';

const ChatGrupo = ({ viajeId, usuarioId, activar, onInactividad, onMensajesActualizados }) => {
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [mostrandoEmojis, setMostrandoEmojis] = useState(false);
    const [mostrarBotonScroll, setMostrarBotonScroll] = useState(false);
    const chatEndRef = useRef(null);
    const chatBoxRef = useRef(null);
    const usuarioEnBottomRef = useRef(true);
    const pollingTimeoutRef = useRef(null);
    const isTabActiveRef = useRef(true);
    const inactividadTimerRef = useRef(null);

    const pollingInterval = 5000;
    const INACTIVIDAD_TIEMPO_MS = 30000;

    const reiniciarTimerInactividad = () => {
        clearTimeout(inactividadTimerRef.current);
        inactividadTimerRef.current = setTimeout(() => {
            onInactividad?.();
        }, INACTIVIDAD_TIEMPO_MS);
    };

    const fetchMensajes = async () => {
        try {
            const res = await api.get(`/cliente/chat/viaje/${viajeId}`);
            setMensajes(res.data);
            onMensajesActualizados?.(viajeId, res.data);
        } catch (error) {
            console.error('Error cargando mensajes:', error);
        }
    };

    useEffect(() => {
        if (!activar || !viajeId) return;

        let activo = true;

        const handleVisibilityChange = () => {
            isTabActiveRef.current = !document.hidden;
            if (isTabActiveRef.current) startPolling();
            else stopPolling();
        };

        const poll = async () => {
            if (!activo || !isTabActiveRef.current || !activar) return;
            await fetchMensajes();
            if (activo) {
                pollingTimeoutRef.current = setTimeout(poll, pollingInterval);
            }
        };

        const startPolling = () => {
            stopPolling();
            poll();
        };

        const stopPolling = () => {
            clearTimeout(pollingTimeoutRef.current);
            pollingTimeoutRef.current = null;
        };

        startPolling();
        document.addEventListener('visibilitychange', handleVisibilityChange);
        reiniciarTimerInactividad();

        return () => {
            activo = false;
            stopPolling();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearTimeout(inactividadTimerRef.current);
        };
    }, [activar, viajeId]);


    const enviarMensaje = async () => {
        if (!nuevoMensaje.trim()) return;
        try {
            await api.post('/cliente/chat', {
                viajeId,
                usuarioId,
                mensaje: reemplazarTextoConEmoji(nuevoMensaje),
            });
            setNuevoMensaje('');
            await fetchMensajes();
            reiniciarTimerInactividad();
        } catch (error) {
            console.error('Error enviando mensaje:', error);
        }
    };

    const reemplazarTextoConEmoji = (texto) =>
        texto.replace(/:\)/g, '😄').replace(/:\(/g, '😢').replace(/:D/g, '😁').replace(/<3/g, '❤️');

    useEffect(() => {
        if (usuarioEnBottomRef.current) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else {
            setMostrarBotonScroll(true);
        }
    }, [mensajes]);

    const handleScroll = () => {
        const el = chatBoxRef.current;
        const alFinal = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
        usuarioEnBottomRef.current = alFinal;
        setMostrarBotonScroll(!alFinal);
        reiniciarTimerInactividad();
    };

    const handleChange = (e) => {
        setNuevoMensaje(e.target.value);
        reiniciarTimerInactividad();
    };

    const agregarEmoji = (emoji) => {
        setNuevoMensaje((prev) => prev + emoji);
        setMostrandoEmojis(false);
        reiniciarTimerInactividad();
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        usuarioEnBottomRef.current = true;
        setMostrarBotonScroll(false);
        reiniciarTimerInactividad();
    };

    return (
        <Box sx={{ position: 'relative', bgcolor: '#f3f9ff', p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Box
                ref={chatBoxRef}
                onScroll={handleScroll}
                sx={{ maxHeight: '350px', overflowY: 'auto', p: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#e3f2fd' }}
            >
                <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {mensajes.map((msg) => (
                        <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.usuarioId === usuarioId ? 'flex-end' : 'flex-start' }}>
                            <Paper
                                sx={{
                                    p: 1,
                                    maxWidth: '80%',
                                    backgroundColor: msg.usuarioId === usuarioId ? '#dcf8c6' : '#bbdefb',
                                    wordBreak: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                    borderRadius: 2,
                                    boxShadow: 1,
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', color: '#1976d2' }}>
                                    {msg.nombreUsuario}
                                </Typography>
                                <Typography variant="body1">{msg.mensaje}</Typography>
                                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', fontSize: '0.7rem', mt: 0.5, color: 'gray' }}>
                                    {new Date(msg.fechaEnvio).toLocaleTimeString()}
                                </Typography>
                            </Paper>
                        </Box>
                    ))}
                    <div ref={chatEndRef} />
                </Box>

                {mostrarBotonScroll && (
                    <Fab color="primary" size="small" onClick={scrollToBottom} sx={{ position: 'absolute', bottom: 70, right: 16 }}>
                        <ArrowDownwardIcon />
                    </Fab>
                )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
                <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Escribe un mensaje..."
                    value={nuevoMensaje}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            enviarMensaje();
                        }
                    }}
                />
                <Button
                    variant="outlined"
                    onClick={() => {
                        setMostrandoEmojis(!mostrandoEmojis);
                        reiniciarTimerInactividad();
                    }}
                    sx={{ color: '#1976d2', borderColor: '#1976d2' }}
                >
                    😊
                </Button>
                <Button variant="contained" onClick={enviarMensaje}>
                    Enviar
                </Button>
            </Box>

            {mostrandoEmojis && (
                <Grid container spacing={1} sx={{ mt: 1, maxHeight: '120px', overflowY: 'auto' }}>
                    {emoticonos.map((emoji, index) => (
                        <Grid item key={index}>
                            <Button variant="text" onClick={() => agregarEmoji(emoji)}>
                                {emoji}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default ChatGrupo;

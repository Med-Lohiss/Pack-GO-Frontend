import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    Badge,
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemIcon,
    Tooltip,
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import FeedbackIcon from '@mui/icons-material/Feedback';
import api from '../../api/api';
import { emoticonos } from '../../assets/emoticonos';

const NotificacionesCliente = ({ onPerfilClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifAnchorEl, setNotifAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [feedbackEnviado, setFeedbackEnviado] = useState(false);
    const [mostrandoEmojis, setMostrandoEmojis] = useState(false);

    const open = Boolean(anchorEl);
    const notifOpen = Boolean(notifAnchorEl);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const filtrarNotificaciones = (lista) => {
        const ahora = new Date();
        const cincoDiasEnMs = 5 * 24 * 60 * 60 * 1000;
        return lista.filter(n => {
            const fechaEnvio = new Date(n.fechaEnvio);
            return !n.leido || (ahora - fechaEnvio) <= cincoDiasEnMs;
        });
    };

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/cliente/notificaciones');
            const filtradas = filtrarNotificaciones(res.data);
            setNotifications(filtradas);
            setUnreadCount(filtradas.filter(n => !n.leido).length);
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);
        }
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotifClick = (event) => {
        setNotifAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setNotifAnchorEl(null);
    };

    const handleNotificationClick = async (id) => {
        try {
            await api.patch(`/cliente/notificaciones/${id}/leida`);
            const updated = notifications.map(n =>
                n.id === id ? { ...n, leido: true } : n
            );
            const filtradas = filtrarNotificaciones(updated);
            setNotifications(filtradas);
            setUnreadCount(filtradas.filter(n => !n.leido).length);
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    };

    const enviarFeedback = async () => {
        if (!feedback.trim()) return;

        try {
            setEnviando(true);
            await api.post('cliente/comentarios', { contenido: feedback });
            setFeedback('');
            setFeedbackEnviado(true);
        } catch (error) {
            console.error('Error al enviar feedback:', error);
        } finally {
            setEnviando(false);
            setTimeout(() => {
                setFeedbackEnviado(false);
                setFeedbackOpen(false);
                setMostrandoEmojis(false);
            }, 2000);
        }
    };

    const agregarEmoji = (emoji) => {
        setFeedback(feedback + emoji);
        setMostrandoEmojis(false);
    };

    return (
        <>
            <Tooltip title="Configuración" arrow>
                <IconButton onClick={handleMenuClick} color="inherit" aria-label="Configuración">
                    <SettingsIcon />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        bgcolor: '#e3f2fd',
                        border: '1px solid #90caf9',
                        borderRadius: 2,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        minWidth: 200,
                        mt: 1,
                    },
                }}
            >
                <MenuItem onClick={() => { handleClose(); onPerfilClick(); }} sx={{ '&:hover': { bgcolor: '#bbdefb' } }}>
                    <ListItemText primary={<Typography color="primary.main" fontWeight="medium">Mi Perfil</Typography>} />
                    <ListItemIcon><PersonIcon fontSize="small" sx={{ color: '#0d47a1' }} /></ListItemIcon>
                </MenuItem>

                <MenuItem onClick={handleNotifClick} sx={{ '&:hover': { bgcolor: '#bbdefb' } }}>
                    <ListItemText primary={<Typography color="primary.main" fontWeight="medium">Notificaciones</Typography>} />
                    <ListItemIcon>
                        <Badge color="error" badgeContent={unreadCount}>
                            <NotificationsIcon sx={{ color: '#0d47a1' }} />
                        </Badge>
                    </ListItemIcon>
                </MenuItem>

                <MenuItem onClick={() => { handleClose(); setFeedbackOpen(true); }} sx={{ '&:hover': { bgcolor: '#bbdefb' } }}>
                    <ListItemText primary={<Typography color="primary.main" fontWeight="medium">Feedback</Typography>} />
                    <ListItemIcon><FeedbackIcon fontSize="small" sx={{ color: '#0d47a1' }} /></ListItemIcon>
                </MenuItem>
            </Menu>

            <Menu
                anchorEl={notifAnchorEl}
                open={notifOpen}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 320,
                        bgcolor: '#e3f2fd',
                        border: '1px solid #90caf9',
                        borderRadius: 2,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        maxHeight: 400,
                        overflowY: 'auto',
                    }
                }}
            >
                <Box sx={{ px: 2, pt: 2 }}>
                    <Typography variant="h6" color="primary.main">Notificaciones</Typography>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <List disablePadding>
                    {notifications.length === 0 ? (
                        <ListItem><ListItemText primary="No hay notificaciones" /></ListItem>
                    ) : (
                        notifications.map((notif) => (
                            <React.Fragment key={notif.id}>
                                <ListItem
                                    button
                                    onClick={() => handleNotificationClick(notif.id)}
                                    selected={!notif.leido}
                                    sx={{
                                        bgcolor: !notif.leido ? '#bbdefb' : '#ffffff',
                                        '&:hover': { backgroundColor: '#90caf9' },
                                        transition: 'background-color 0.3s ease',
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" fontWeight={notif.leido ? 'normal' : 'bold'} color="primary.dark">
                                                {notif.contenido}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" color={notif.leido ? 'text.secondary' : 'primary.main'}>
                                                {notif.leido ? 'Leído' : 'No leído'}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))
                    )}
                </List>
            </Menu>

            <Dialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#e3f2fd', color: '#0d47a1' }}>Tu opinión nos importa</DialogTitle>
                <DialogContent sx={{ bgcolor: '#e3f2fd' }}>
                    <Typography gutterBottom color="primary.main">
                        Nos encantaría saber qué piensas sobre la aplicación. Tu feedback nos ayuda a mejorar.
                    </Typography>
                    <TextField
                        autoFocus
                        multiline
                        fullWidth
                        rows={4}
                        margin="dense"
                        label="Escribe tu comentario aquí..."
                        variant="outlined"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setMostrandoEmojis(!mostrandoEmojis)}
                            sx={{ color: '#1976d2', borderColor: '#1976d2' }}
                        >
                            😊
                        </Button>
                        {mostrandoEmojis && (
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {emoticonos.map((emo, idx) => (
                                    <Button
                                        key={idx}
                                        variant="text"
                                        onClick={() => agregarEmoji(emo)}
                                        sx={{ minWidth: 36, fontSize: 20 }}
                                    >
                                        {emo}
                                    </Button>
                                ))}
                            </Box>
                        )}
                    </Box>
                    {feedbackEnviado && (
                        <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                            ¡Gracias por tu comentario!
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ bgcolor: '#e3f2fd' }}>
                    <Button onClick={() => setFeedbackOpen(false)} disabled={enviando}>Cancelar</Button>
                    <Button onClick={enviarFeedback} variant="contained" disabled={enviando || !feedback.trim()}>
                        {enviando ? 'Enviando...' : 'Enviar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default NotificacionesCliente;

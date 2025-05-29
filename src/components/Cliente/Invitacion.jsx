import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
} from '@mui/material';
import api from '../../api/api';

const Invitacion = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [exito, setExito] = useState(false);
    const [mostrarDialogoLogin, setMostrarDialogoLogin] = useState(false);

    useEffect(() => {
        const gestionarInvitacion = async () => {
            try {
                // Intentamos aceptar la invitación pública con el token
                const { data: viaje } = await api.get('/cliente/invitaciones/public/aceptar', {
                    params: { token },
                });

                // Si la invitación se aceptó correctamente, verificamos si el usuario tiene acceso al viaje
                try {
                    await api.get(`/cliente/viajes/${viaje.id}`); // Esto confirma si está autenticado y autorizado
                    setExito(true);
                    setTimeout(() => navigate(`/invitado/viajes/${viaje.id}?token=${token}`), 3000);
                } catch (authError) {
                    if (authError.response?.status === 401) {
                        // No está autenticado: guardar token y mostrar diálogo de login
                        sessionStorage.setItem('pendingInvitationToken', token);
                        setMostrarDialogoLogin(true);
                    } else {
                        setError('No se pudo acceder al contenido del viaje.');
                    }
                }
            } catch (err) {
                const mensaje = err.response?.data;
                const status = err.response?.status;

                if (status === 400 && mensaje === 'La invitación ya fue aceptada o está expirada.') {
                    try {
                        // La invitación ya fue aceptada o está expirada: intentamos recuperar el viaje con el token
                        const { data: viaje } = await api.get(`/cliente/invitaciones/viaje-por-token/${token}`);

                        // Repetimos la verificación de acceso al viaje
                        try {
                            await api.get(`/cliente/viajes/${viaje.id}`);
                            setExito(true);
                            setTimeout(() => navigate(`/invitado/viajes/${viaje.id}?token=${token}`), 3000);
                        } catch (authError) {
                            if (authError.response?.status === 401) {
                                sessionStorage.setItem('pendingInvitationToken', token);
                                setMostrarDialogoLogin(true);
                            } else {
                                setError('No se pudo acceder al contenido del viaje.');
                            }
                        }
                        return;
                    } catch (fetchErr) {
                        setError('No se pudo recuperar el viaje, aunque la invitación ya fue aceptada.');
                    }
                } else if (status === 401) {
                    sessionStorage.setItem('pendingInvitationToken', token);
                    setMostrarDialogoLogin(true);
                    return;
                } else {
                    setError(mensaje || 'Invitación no válida, expirada o ya aceptada.');
                }
            } finally {
                setLoading(false);
            }
        };

        gestionarInvitacion();
    }, [token, navigate]);

    const handleLoginRedirect = () => {
        navigate('/auth');
    };

    if (loading) {
        return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />;
    }

    if (error) {
        return (
            <Box mt={4} textAlign="center">
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {exito && (
                <Dialog open>
                    <DialogTitle sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        ¡Te has unido al viaje!
                    </DialogTitle>
                    <DialogContent>
                        <Typography color="primary.dark">
                            Redirigiendo al viaje en unos segundos...
                        </Typography>
                    </DialogContent>
                </Dialog>
            )}

            {mostrarDialogoLogin && (
                <Dialog open>
                    <DialogContent sx={{ textAlign: 'center', px: 4, py: 5 }}>
                        <Typography
                            variant="h6"
                            color="primary.dark"
                            fontWeight="medium"
                            gutterBottom
                        >
                            🚀 ¡Estás a un paso de unirte a la aventura!
                        </Typography>
                        <Typography variant="body1" color="primary.dark" mb={3}>
                            Para ver los viajes que han compartido contigo, regístrate o inicia sesión.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleLoginRedirect}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                            ¡Sigamos!
                        </Button>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default Invitacion;

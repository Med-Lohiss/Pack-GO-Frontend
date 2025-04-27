import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Stack,
    Box,
} from '@mui/material';

import {
    LocationOn,
    DateRange,
    AccessTime,
    Description as DescriptionIcon,
    Print,
} from '@mui/icons-material';

import api from '../../api/api';

const DestinationCard = ({
    image,
    title,
    fechaInicio,
    fechaFin,
    tag,
    ubicacion,
    viajeId,
    descripcion,
}) => {
    const [actividades, setActividades] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = async () => {
        if (!viajeId) {
            console.error("El viajeId es undefined");
            return;
        }

        try {
            const response = await api.get(`/home/viajes/${viajeId}/actividades`);
            setActividades(response.data);
            setOpenDialog(true);
        } catch (error) {
            console.error("Error al obtener las actividades del viaje", error);
        }
    };

    const calcularDias = (fechaInicio, fechaFin) => {
        const fechaInicioDate = new Date(fechaInicio);
        const fechaFinDate = new Date(fechaFin);
        return Math.ceil((fechaFinDate - fechaInicioDate) / (1000 * 3600 * 24)) + 1;
    };

    const handlePrint = () => {
        const printContent = document.getElementById(`print-section-${viajeId}`);
        const WinPrint = window.open('', '', 'width=900,height=650');
        WinPrint.document.write(`
      <html>
        <head>
          <title>Detalles del viaje</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h2 {
              color: #1976d2;
            }
            p, span {
              margin: 0 0 8px 0;
            }
            .actividad {
              margin-bottom: 16px;
            }
            hr {
              margin: 16px 0;
            }
            svg {
              width: 20px !important;
              height: 20px !important;
              margin-right: 8px;
              flex-shrink: 0;
            }
            .icon-row {
              display: flex;
              align-items: center;
              margin-bottom: 8px;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    };

    return (
        <>
            <Card
                sx={{
                    width: 300,
                    height: 300,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 4,
                    boxShadow: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                }}
            >
                <CardMedia
                    component="img"
                    image={image}
                    alt={title}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }}
                />

                {tag && (
                    <Chip
                        label={tag}
                        color="primary"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backdropFilter: 'blur(4px)',
                            backgroundColor: 'rgba(33, 150, 243, 0.8)',
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                    />
                )}

                <CardContent
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        color: 'white',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
                        px: 2,
                        pb: 2,
                        pt: 6,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" noWrap>
                        {title}
                    </Typography>

                    <Typography variant="body2" noWrap>
                        {calcularDias(fechaInicio, fechaFin)} días
                    </Typography>

                    <Button
                        variant="outlined"
                        size="small"
                        sx={{
                            mt: 1,
                            color: 'white',
                            borderColor: 'white',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: 'white',
                                color: 'black',
                                borderColor: 'white',
                            },
                        }}
                        onClick={handleOpenDialog}
                    >
                        Ver detalles
                    </Button>
                </CardContent>
            </Card>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 2,
                        bgcolor: "#e3f2fd",
                    },
                }}
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight="bold">{title}</Typography>
                        <Button
                            onClick={handlePrint}
                            variant="text"
                            color="primary"
                            startIcon={<Print />}
                            sx={{ textTransform: 'none' }}
                        >
                            Imprimir
                        </Button>
                    </Box>
                </DialogTitle>

                <DialogContent dividers>
                    <div id={`print-section-${viajeId}`}>
                        <Stack spacing={2}>
                            <div className="icon-row">
                                <LocationOn color="action" />
                                <Typography variant="subtitle1">{ubicacion}</Typography>
                            </div>

                            <div className="icon-row">
                                <DateRange color="action" />
                                <Typography variant="subtitle1">
                                    {fechaInicio} → {fechaFin}
                                </Typography>
                            </div>

                            <div className="icon-row">
                                <AccessTime color="action" />
                                <Typography variant="subtitle1">
                                    {calcularDias(fechaInicio, fechaFin)} días
                                </Typography>
                            </div>

                            <div className="icon-row">
                                <DescriptionIcon color="action" />
                                <Typography variant="subtitle1">Descripción</Typography>
                            </div>
                            <Typography variant="body2" color="text.secondary">
                                {descripcion?.trim() ? descripcion : 'Sin descripción disponible.'}
                            </Typography>

                            <Divider />

                            <Typography variant="h6" fontWeight="bold">
                                Actividades
                            </Typography>

                            {actividades.length > 0 ? (
                                <Stack spacing={1}>
                                    {actividades.map((actividad, index) => (
                                        <div className="actividad" key={index}>
                                            <Typography variant="subtitle2" fontWeight="medium">
                                                {actividad.nombre}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {actividad.descripcion}
                                            </Typography>
                                        </div>
                                    ))}
                                </Stack>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No hay actividades disponibles para este viaje.
                                </Typography>
                            )}
                        </Stack>
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} variant="contained" color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DestinationCard;

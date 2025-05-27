import React, { useEffect, useState } from 'react';
import DestinationCard from './DestinationCard';
import api from '../../api/api';
import { Box, Typography } from '@mui/material';
import ConfusoImage from '../../assets/confuso.png';

const BentoGrid = ({ searchQuery, currentPage, setTotalFilteredViajes }) => {
  const [viajes, setViajes] = useState([]);

  useEffect(() => {
    const fetchViajes = async () => {
      try {
        const response = await api.get('/home/viajes/publicados');
        const viajesCompartidos = response.data.filter(v => v.compartido === true);
        setViajes(viajesCompartidos);
      } catch (error) {
        console.error('Error al cargar los viajes compartidos:', error);
      }
    };

    fetchViajes();
  }, []);

  const viajesPorPagina = 6;

  const filteredViajes = viajes.filter((viaje) => {
  const query = searchQuery.toLowerCase().trim();
  const ubicacion = viaje.ubicacion?.toLowerCase() || "";
  const dias = Math.ceil((new Date(viaje.fechaFin) - new Date(viaje.fechaInicio)) / (1000 * 60 * 60 * 24)) + 1;

  const coincideUbicacion = ubicacion.includes(query);

  const matchNumero = query.match(/\d+/);
  const numeroEnQuery = matchNumero ? parseInt(matchNumero[0], 10) : null;

  const coincideDias = numeroEnQuery !== null && dias === numeroEnQuery;

  return coincideUbicacion || coincideDias;
});

  useEffect(() => {
    setTotalFilteredViajes(filteredViajes.length);
  }, [filteredViajes, setTotalFilteredViajes]);

  const startIndex = (currentPage - 1) * viajesPorPagina;
  const endIndex = startIndex + viajesPorPagina;
  const viajesMostrados = filteredViajes.slice(startIndex, endIndex);

  const translateYValues = ['9rem', '4rem', '0rem', '9rem', '4rem', '0rem'];

  return (
    <Box sx={{ width: '100%', overflow: 'visible' }}>
      {filteredViajes.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            mt: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="img"
            src={ConfusoImage}
            alt="No se encontraron resultados"
            sx={{ width: '250px', mb: 3 }}
          />
          <Typography variant="h5" sx={{ color: '#0d47a1' }}>
            Nos disculpamos, no encontramos lo que buscas.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 4,
          }}
        >
          {viajesMostrados.map((viaje, index) => (
            <Box
              key={viaje.id}
              sx={{
                transform: {
                  xs: 'none',
                  sm: `translateY(${translateYValues[index % translateYValues.length]})`,
                },
                transition: 'transform 0.3s ease',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <DestinationCard
                image={viaje.imagenUrl}
                descripcion={viaje.descripcion}
                title={viaje.titulo}
                fechaInicio={viaje.fechaInicio}
                fechaFin={viaje.fechaFin}
                tag={viaje.categoria}
                ubicacion={viaje.ubicacion}
                viajeId={viaje.id}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default BentoGrid;

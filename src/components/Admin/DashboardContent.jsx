import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';

const DashboardContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const cards = [
    {
      title: 'Gestionar empleados',
      description: 'Acceda a la lista de empleados, alta, baja y actualización.',
      link: '/admin/empleados',
    },
    {
      title: 'Gestionar empresa',
      description: 'Consulte y gestione la empresa.',
      link: '/admin/empresa',
    },
    {
      title: 'Gestionar reportes',
      description: 'Revise y elimine reportes realizados por usuarios.',
      link: '/admin/reportes',
    },
    {
      title: 'Gestionar clientes',
      description: 'Administre los clientes, filtre y bloquee cuentas.',
      link: '/admin/clientes',
    },
  ];

  return (
    <Box
      sx={{
        width: '90%',
        margin: '0 auto',
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        backgroundColor: '#ecfdf5',
        minHeight: '100vh',
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {cards.map((card, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={6}
            md={6}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Card
              sx={{
                width: 320,
                backgroundColor: '#065f46',
                color: '#bbf7d0',
                borderRadius: 2,
                boxShadow: 3,
                border: '2px solid #a7f3d0',
                transition: 'transform 0.3s, background-color 0.3s, color 0.3s',
                '&:hover': {
                  backgroundColor: '#d1fae5',
                  color: '#065f46',
                },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                  {card.description}
                </Typography>
              </CardContent>
              <Box sx={{ padding: 2 }}>
                <Button
                  component={RouterLink}
                  to={card.link}
                  variant="contained"
                  sx={{
                    backgroundColor: '#a7f3d0',
                    color: '#065f46',
                    '&:hover': {
                      backgroundColor: '#d1fae5',
                      color: '#065f46',
                    },
                    fontWeight: 'bold',
                    width: '100%',
                  }}
                >
                  Ir a {card.title.split(' ')[1].toLowerCase()}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardContent;

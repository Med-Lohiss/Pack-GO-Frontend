import React from "react";
import { Container, Typography } from "@mui/material";
import Navbar from "./Navbar";

const Privacidad = () => (
  <>
    <Navbar />
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>
        Políticas de privacidad
      </Typography>
      <Typography variant="body1" color="primary.dark" paragraph>
        Tu privacidad es importante para nosotros. Recopilamos solo los datos necesarios
        para brindarte el mejor servicio. Nunca compartiremos tu información personal sin tu consentimiento.
      </Typography>
      <Typography variant="body2" color="primary.dark">
        Más detalles próximamente.
      </Typography>
    </Container>
  </>
);

export default Privacidad;

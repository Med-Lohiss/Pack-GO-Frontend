import React from "react";
import { Container, Typography } from "@mui/material";
import Navbar from "./Navbar";

const Terminos = () => (
  <>
    <Navbar />
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>
        Términos de uso
      </Typography>
      <Typography variant="body1" color="primary.dark" paragraph>
        Al usar Pack & GO, aceptas nuestros términos de uso. Nos reservamos el derecho
        de actualizar estos términos en cualquier momento. Eres responsable de revisar
        los cambios periódicamente.
      </Typography>
      <Typography variant="body2" color="primary.dark">
        Este contenido se ampliará en breve.
      </Typography>
    </Container>
  </>
);

export default Terminos;

import React from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import Navbar from "./Navbar";

const Contacto = () => (
  <>
    <Navbar />
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>
        Contáctanos
      </Typography>
      <Typography variant="body1" color="primary.dark" mb={4}>
        ¿Tienes preguntas o sugerencias? Completa el formulario y te responderemos pronto.
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField fullWidth label="Nombre" margin="normal" />
        <TextField fullWidth label="Email" margin="normal" />
        <TextField
          fullWidth
          label="Mensaje"
          multiline
          rows={4}
          margin="normal"
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Enviar
        </Button>
      </Box>
    </Container>
  </>
);

export default Contacto;

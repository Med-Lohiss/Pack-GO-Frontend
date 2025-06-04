import React from "react";
import { Container, Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import Navbar from "./Navbar";

const ComoFunciona = () => (
  <>
    <Navbar />
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>
        ¿Cómo funciona Pack & GO?
      </Typography>
      <Typography variant="body1" color="primary.dark" mb={4}>
        Nuestra plataforma te permite planificar viajes grupales paso a paso:
      </Typography>
      <List>
        {[
          "Crea un viaje e invita a tu grupo",
          "Define el presupuesto y lugares a visitar",
          "Usa las votaciones para decidir actividades",
          "Comparte itinerarios y notas",
          "Accede desde cualquier dispositivo",
        ].map((text, index) => (
          <ListItem key={index}>
            <ListItemText primary={`✔ ${text}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  </>
);

export default ComoFunciona;

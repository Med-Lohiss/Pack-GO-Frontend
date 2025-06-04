import React from "react";
import { Container, Typography, Box } from "@mui/material";
import Navbar from "./Navbar";

const Careers = () => (
  <>
    <Navbar />
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>
        Únete a nuestro equipo
      </Typography>
      <Typography variant="body1" color="primary.dark" mb={2}>
        En Pack & GO buscamos personas apasionadas por los viajes, la tecnología y el trabajo en equipo.
      </Typography>
      <Box mt={4}>
        <Typography variant="h6" fontWeight="medium" color="primary.main">
          Próximamente publicaremos oportunidades laborales.
        </Typography>
      </Box>
    </Container>
  </>
);

export default Careers;

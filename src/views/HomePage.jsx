import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Paper,
  Stack,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import BentoGrid from "../components/Viajes/BentoGrid";
import Testimonios from "../components/Viajes/Testimonios";
import Navbar from "../components/Viajes/Navbar";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";
import heroImage from "../assets/logo2.png";
import Logo from "../assets/logo.png";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFilteredViajes, setTotalFilteredViajes] = useState(0);
  const viajesPorPagina = 6;

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#fff",
          py: { xs: 8, md: 12 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: "100%",
            px: { xs: 2, md: 0 },
          }}
        >
          <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom color="primary.main">
              Organiza tu viaje grupal con total facilidad
            </Typography>
            <Typography variant="h6" color="primary.dark" paragraph>
              Pack & GO centraliza itinerarios, presupuestos, votaciones y
              comunicación para que tú y tu grupo puedan disfrutar sin estrés.
              Planifica, colabora y viaja sin complicaciones.
            </Typography>

            <Stack spacing={2} direction={{ xs: "column", sm: "row" }} mt={4}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                component={Link}
                to="/auth"
              >
                Planea tu viaje
              </Button>
              <Button
                variant="outlined"
                startIcon={<AppleIcon />}
                sx={{ textTransform: "none" }}
              >
                App Store
              </Button>
              <Button
                variant="outlined"
                startIcon={<AndroidIcon />}
                sx={{ textTransform: "none" }}
              >
                Google Play
              </Button>
            </Stack>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              mt: { xs: 4, md: 0 },
              maxWidth: "480px",
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt="Hero visual Pack & GO"
              sx={{
                width: "100%",
                maxHeight: 480,
                objectFit: "contain",
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Search Bar Section */}
      <Container
        maxWidth="md"
        sx={{
          mt: -4,
          mb: 4,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 2,
            bgcolor: "#e3f2fd",
            border: "1px solid #90caf9",
            borderRadius: 2,
          }}
        >
          <TextField
            fullWidth
            placeholder="Buscar por destino o por duración en días..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#ffffff",
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "#90caf9",
                },
                "&:hover fieldset": {
                  borderColor: "#42a5f5",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0d47a1",
                },
              },
            }}
          />
        </Paper>
      </Container>

      {/* Destinations Section */}
      <Box
        sx={{
          background: `linear-gradient(
            to bottom,
            white 0%,
            #e3f2fd 20%,
            #e3f2fd 80%,
            white 100%
          )`,
          py: 6,
        }}
      >
        <Container maxWidth="lg" sx={{ pb: 12 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              Nuestros Viajes
            </Typography>

            {/* Botones Anterior/Siguiente */}
            <Box>
              {currentPage > 1 && (
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  sx={{ mr: 1 }}
                >
                  Atrás
                </Button>
              )}
              {currentPage * viajesPorPagina < totalFilteredViajes && (
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Siguiente
                </Button>
              )}
            </Box>
          </Box>

          <Typography variant="body1" color="primary.dark" mb={3}>
            Explora viajes ya planificados por nosotros y otros viajeros y encuentra tu
            próxima aventura.
          </Typography>

          {/* Pasa setTotalFilteredViajes a BentoGrid */}
          <BentoGrid
            searchQuery={searchQuery}
            currentPage={currentPage}
            setTotalFilteredViajes={setTotalFilteredViajes}
          />
        </Container>
      </Box>

      {/* Testimonios aprobados */}
      <Testimonios />

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: "#fff",
          py: 8,
          px: 2,
          textAlign: "center",
          mt: 2,
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.main">
            ¿Listo para tu próxima aventura?
          </Typography>
          <Typography variant="body1" mb={4} color="primary.dark">
            Crea una cuenta y comienza a planificar tus viajes hoy mismo.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/auth"
          >
            Comenzar ahora
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          background: "linear-gradient(to top, #0d47a1 17%, #ffffff)",
          color: "#fff",
          py: 4,
          mt: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Box sx={{ flex: 1 }}>
              <img
                src={Logo}
                alt="Pack & GO Logo"
                style={{ maxWidth: "150px" }}
              />
            </Box>

            <Box sx={{ flex: 2, ml: 6 }}>
              <Grid
                container
                spacing={4}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginTop="50px"
              >
                {/* COMPANY */}
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    COMPANIA
                  </Typography>
                  <ul style={{ listStyle: "none", padding: 0, marginTop: "16px" }}>
                    <li>
                      <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
                        Sobre nosotros
                      </Link>
                    </li>
                    <li>
                      <Link to="/contacto" style={{ color: "#fff", textDecoration: "none" }}>
                        Contacto
                      </Link>
                    </li>
                    <li>
                      <Link to="/careers" style={{ color: "#fff", textDecoration: "none" }}>
                        Credenciales
                      </Link>
                    </li>
                  </ul>
                </Grid>

                {/* PRODUCT */}
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    NUESTRA APLICACIÓN
                  </Typography>
                  <ul style={{ listStyle: "none", padding: 0, marginTop: "16px" }}>
                    <li>
                      <Link to="/como-funciona" style={{ color: "#fff", textDecoration: "none" }}>
                        Como funciona
                      </Link>
                    </li>
                    <li>
                      <Link to="/privacidad" style={{ color: "#fff", textDecoration: "none" }}>
                        Políticas de privacidad
                      </Link>
                    </li>
                    <li>
                      <Link to="/terminos" style={{ color: "#fff", textDecoration: "none" }}>
                        Términos de uso
                      </Link>
                    </li>
                  </ul>
                </Grid>

                {/* TOP CITIES */}
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    TOP CIUDADES
                  </Typography>
                  <ul style={{ listStyle: "none", padding: 0, marginTop: "16px" }}>
                    <li>
                      <Link to="/destinos/paris" style={{ color: "#fff", textDecoration: "none" }}>
                        París
                      </Link>
                    </li>
                    <li>
                      <Link to="/destinos/rome" style={{ color: "#fff", textDecoration: "none" }}>
                        Roma
                      </Link>
                    </li>
                    <li>
                      <Link to="/destinos/new-york" style={{ color: "#fff", textDecoration: "none" }}>
                        Nueva York
                      </Link>
                    </li>
                    <li>
                      <Link to="/destinos/istanbul" style={{ color: "#fff", textDecoration: "none" }}>
                        Barcelona
                      </Link>
                    </li>
                  </ul>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Copyright */}
          <Box
            textAlign="center"
            mt={6}
            sx={{ borderTop: "1px solid #fff", pt: 4 }}
          >
            <Typography variant="body2" color="gray.300">
              © 2025 Pack & GO - Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;

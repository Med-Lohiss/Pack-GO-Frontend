import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import api from "../../api/api";

const Testimonios = () => {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const res = await api.get("/home/comentarios/aprobados");
        setComentarios(res.data);
      } catch (err) {
        console.error("Error al obtener testimonios:", err);
      }
    };
    fetchComentarios();
  }, []);

  if (comentarios.length === 0) return null;

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        py: 8,
        px: { xs: 2, md: 6 },
        mt: 2,
      }}
    >
      <Typography
        variant="h4"
        align="start"
        paddingLeft="20px"
        fontWeight="bold"
        color="primary.main"
        gutterBottom
      >
        Lo que dicen nuestros usuarios
      </Typography>
      <Typography
        variant="subtitle1"
        align="start"
        paddingLeft="20px"
        color="primary.dark"
        mb={6}
      >
        Testimonios reales de personas que ya viajaron con Pack & GO
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 4,
          justifyItems: "center",
        }}
      >
        {comentarios.slice(0, 6).map((comentario, index) => (
          <Box
            key={index}
            sx={{
              width: "100%",
              maxWidth: 330,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Card
              sx={{
                width: "100%",
                bgcolor: "#e3f2fd",
                borderRadius: 3,
                boxShadow: 4,
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                    {comentario.autorNombre?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {comentario.autorNombre || "Usuario anónimo"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <FormatQuoteIcon
                    sx={{
                      fontSize: 32,
                      color: "primary.main",
                      mr: 1,
                      mt: "2px",
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 6,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {comentario.contenido}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Testimonios;

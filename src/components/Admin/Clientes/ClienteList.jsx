import React, { useEffect, useState } from "react";
import { Paper, Typography, Stack, Snackbar, Alert, Box } from "@mui/material";
import Navbar from "../Navbar";
import ClienteFilter from "./ClienteFilter";
import ClienteTable from "./ClienteTable";
import api from "../../../api/api";

const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const normalizarClientes = (data) =>
    data.map((cliente) => ({
      ...cliente,
      bloqueado: Boolean(cliente.cuentaBloqueada),
    }));

  const fetchClientes = async () => {
    try {
      const res = await api.get("/admin/clientes");
      setClientes(normalizarClientes(res.data));
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleFilter = async (filtro) => {
    try {
      const params = new URLSearchParams();
      if (filtro.nombre) params.append("nombre", filtro.nombre);
      if (filtro.email) params.append("email", filtro.email);
      if (filtro.provider) params.append("provider", filtro.provider);
      if (filtro.fechaCreacion) params.append("fechaCreacion", filtro.fechaCreacion);

      const res = await api.get(`/admin/clientes/filtrar?${params.toString()}`);
      setClientes(normalizarClientes(res.data));
    } catch (error) {
      console.error("Error al filtrar clientes:", error);
    }
  };

  const handleBloquearToggle = async (id, bloquear) => {
    try {
      await api.put(`/admin/clientes/${id}/bloquear?bloquear=${bloquear}`);
      setSnackbarMessage(bloquear ? "Cliente bloqueado" : "Cliente desbloqueado");
      setSnackbarOpen(true);

      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente.id === id ? { ...cliente, bloqueado: bloquear } : cliente
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado de bloqueo:", error);
      setSnackbarMessage("Error al cambiar estado de bloqueo");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          maxWidth: 1200,
          margin: "4rem auto",
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            mb={2}
            spacing={1}
          >
            <Typography variant="h5">Clientes</Typography>
          </Stack>

          <ClienteFilter onFilter={handleFilter} />
          <ClienteTable clientes={clientes} onBloquearToggle={handleBloquearToggle} />

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarMessage.includes("Error") ? "error" : "success"}
              sx={{ fontSize: "1.1rem", padding: "12px 24px" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Paper>
      </Box>
    </>
  );
};

export default ClienteList;

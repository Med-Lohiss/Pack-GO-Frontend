import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

import Navbar from "../components/Admin/Navbar";
import Sidebar from "../components/Admin/Sidebar";

import api from "../api/api";

const AdminReportes = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);

  const fetchReportes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/reportes");
      setReportes(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error al cargar reportes");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  const handleEliminar = (reporte) => {
    setReporteSeleccionado(reporte);
    setOpenConfirm(true);
  };

  const confirmarEliminar = async () => {
    try {
      await api.delete(`/admin/reportes/${reporteSeleccionado.id}`);
      setOpenConfirm(false);
      setReporteSeleccionado(null);
      fetchReportes();
    } catch (err) {
      setError("Error al eliminar el reporte");
      setOpenConfirm(false);
    }
  };

  // Función para formatear fecha en formato europeo (español)
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <Box sx={{ flex: 1, padding: 3, marginTop: "30px" }}>
          <Typography variant="h5" gutterBottom>
            Gestión de Reportes
          </Typography>

          {loading && <CircularProgress />}
          {error && <Typography color="error">{error}</Typography>}

          {!loading && !error && (
            <>
              {reportes.length === 0 ? (
                <Typography>No hay reportes registrados.</Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Usuario Reportante</TableCell>
                        <TableCell>Motivo</TableCell>
                        <TableCell>Contenido</TableCell>
                        <TableCell>Fecha de Reporte</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportes.map((reporte) => (
                        <TableRow key={reporte.id}>
                          <TableCell>{reporte.id}</TableCell>
                          <TableCell>{reporte.nombreUsuarioReportante || "N/A"}</TableCell>
                          <TableCell>{reporte.motivo}</TableCell>
                          <TableCell>{reporte.contenido || "Sin contenido"}</TableCell>
                          <TableCell>{formatearFecha(reporte.fechaReporte)}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              aria-label="eliminar"
                              color="error"
                              onClick={() => handleEliminar(reporte)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}

          <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogContent>
              ¿Está seguro que desea eliminar este reporte?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
              <Button
                variant="contained"
                color="error"
                onClick={confirmarEliminar}
              >
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </div>
    </div>
  );
};

export default AdminReportes;

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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Delete, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Admin/Navbar";
import Sidebar from "../components/Admin/Sidebar";
import api from "../api/api";

const AdminReportes = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const handleBackClick = () => {
    navigate("/admin/dashboard");
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <Box
          sx={{
            flex: 1,
            padding: isMobile ? 2 : 4,
            paddingTop: "60px",
            backgroundColor: "#ecfdf5",
            minHeight: "100vh",
          }}
        >
          <Box mb={3}>
            <IconButton sx={{ color: "#065f46" }} onClick={handleBackClick}>
              <ArrowBack />
            </IconButton>
          </Box>

          {loading && <CircularProgress sx={{ color: "#065f46" }} />}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {!loading && !error && (
            <>
              {reportes.length === 0 ? (
                <Typography sx={{ color: "#065f46" }}>
                  No hay reportes registrados.
                </Typography>
              ) : (
                <TableContainer
                  component={Paper}
                  sx={{
                    width: '90%',
                    margin: '0 auto',
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "#ffffff",
                    overflowX: "auto",
                  }}
                >
                  <Table>
                    <TableHead sx={{ backgroundColor: "#a7f3d0" }}>
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
                        <TableRow
                          key={reporte.id}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#d1fae5",
                            },
                          }}
                        >
                          <TableCell>{reporte.id}</TableCell>
                          <TableCell>
                            {reporte.nombreUsuarioReportante || "N/A"}
                          </TableCell>
                          <TableCell>{reporte.motivo}</TableCell>
                          <TableCell>
                            {reporte.contenido || "Sin contenido"}
                          </TableCell>
                          <TableCell>
                            {formatearFecha(reporte.fechaReporte)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              aria-label="eliminar"
                              sx={{
                                color: "#065f46",
                                "&:hover": {
                                  backgroundColor: "#bbf7d0",
                                },
                              }}
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
            <DialogTitle sx={{ backgroundColor: "#065f46", color: "#bbf7d0" }}>
              Confirmar eliminación
            </DialogTitle>
            <DialogContent sx={{ paddingTop: 2 }}>
              ¿Está seguro que desea eliminar este reporte?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#065f46",
                  color: "#bbf7d0",
                  "&:hover": {
                    backgroundColor: "#047857",
                  },
                }}
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

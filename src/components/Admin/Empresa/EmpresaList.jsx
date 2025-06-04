import React, { useEffect, useState } from "react";
import {
  Paper,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import EmpresaForm from "./EmpresaForm";
import api from "../../../api/api";

const EmpresaList = () => {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchEmpresa = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/empresa");
      setEmpresa(res.data);
    } catch (error) {
      if (error.response && error.response.status === 204) {
        setEmpresa(null);
      } else {
        console.error("Error al obtener los datos de la empresa:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresa();
  }, []);

  const handleEdit = () => {
    setIsCreating(false);
    setOpenForm(true);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEmpresa({
      cif: "",
      denominacionSocial: "",
      domicilio: "",
      fechaConstitucion: "",
      direccionWeb: "",
      telefono: "",
      emailContacto: "",
    });
    setOpenForm(true);
  };

  const handleFormSubmit = async () => {
    try {
      if (isCreating) {
        await api.post("/admin/empresa", empresa);
        setSnackbarMessage("Empresa creada con éxito");
      } else {
        await api.put("/admin/empresa", empresa);
        setSnackbarMessage("Empresa editada con éxito");
      }
      setSnackbarOpen(true);
      setOpenForm(false);
      fetchEmpresa();
    } catch (error) {
      console.error("Error al guardar los datos de la empresa:", error);
      setSnackbarMessage("Error al guardar los datos de la empresa");
      setSnackbarOpen(true);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  if (loading) return <Typography>Cargando...</Typography>;

  if (!empresa) {
    return (
      <Paper sx={{ p: 3, backgroundColor: "#f0fdf4" }}>
        <Typography variant="h5" mb={2} sx={{ color: "#065f46", fontWeight: "bold" }}>
          Aún no se ha registrado ninguna empresa
        </Typography>
        <Button
          variant="contained"
          onClick={handleCreate}
          sx={{
            backgroundColor: "#065f46",
            "&:hover": { backgroundColor: "#047857" },
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            py: 1,
          }}
        >
          Crear Empresa
        </Button>

        <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
          <DialogTitle sx={{ color: "#065f46", fontWeight: "bold" }}>Crear Empresa</DialogTitle>
          <DialogContent>
            <EmpresaForm empresa={empresa} onChange={setEmpresa} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Cancelar</Button>
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              sx={{
                backgroundColor: "#065f46",
                "&:hover": { backgroundColor: "#047857" },
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1,
              }}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, backgroundColor: "#f0fdf4" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" sx={{ color: "#065f46", fontWeight: "bold" }}>
          Datos de la empresa
        </Typography>
        <Button
          variant="contained"
          onClick={handleEdit}
          sx={{
            backgroundColor: "#065f46",
            "&:hover": { backgroundColor: "#047857" },
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            py: 1,
          }}
        >
          Editar
        </Button>
      </Stack>

      <Typography><strong style={{ color: "#065f46" }}>CIF:</strong> {empresa.cif}</Typography>
      <Typography><strong style={{ color: "#065f46" }}>Denominación Social:</strong> {empresa.denominacionSocial}</Typography>
      <Typography><strong style={{ color: "#065f46" }}>Domicilio:</strong> {empresa.domicilio}</Typography>
      <Typography><strong style={{ color: "#065f46" }}>Fecha de Constitución:</strong> {formatDate(empresa.fechaConstitucion)}</Typography>
      <Typography><strong style={{ color: "#065f46" }}>Dirección Web:</strong> {empresa.direccionWeb}</Typography>
      <Typography><strong style={{ color: "#065f46" }}>Teléfono:</strong> {empresa.telefono}</Typography>
      <Typography><strong style={{ color: "#065f46" }}>Email de Contacto:</strong> {empresa.emailContacto}</Typography>


      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: "#065f46", fontWeight: "bold" }}>
          {isCreating ? "Crear Empresa" : "Editar Empresa"}
        </DialogTitle>
        <DialogContent>
          <EmpresaForm empresa={empresa} onChange={setEmpresa} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancelar</Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#065f46",
              "&:hover": { backgroundColor: "#047857" },
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              py: 1,
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

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
  );
};

export default EmpresaList;

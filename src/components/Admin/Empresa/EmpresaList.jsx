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
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Aún no se ha registrado ninguna empresa
        </Typography>
        <Button variant="contained" onClick={handleCreate}>
          Crear Empresa
        </Button>

        <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
          <DialogTitle>Crear Empresa</DialogTitle>
          <DialogContent>
            <EmpresaForm empresa={empresa} onChange={setEmpresa} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Cancelar</Button>
            <Button onClick={handleFormSubmit} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Datos de la empresa</Typography>
        <Button variant="contained" onClick={handleEdit}>
          Editar
        </Button>
      </Stack>

      <Typography><strong>CIF:</strong> {empresa.cif}</Typography>
      <Typography><strong>Denominación Social:</strong> {empresa.denominacionSocial}</Typography>
      <Typography><strong>Domicilio:</strong> {empresa.domicilio}</Typography>
      <Typography><strong>Fecha de Constitución:</strong> {formatDate(empresa.fechaConstitucion)}</Typography>
      <Typography><strong>Dirección Web:</strong> {empresa.direccionWeb}</Typography>
      <Typography><strong>Teléfono:</strong> {empresa.telefono}</Typography>
      <Typography><strong>Email de Contacto:</strong> {empresa.emailContacto}</Typography>

      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>{isCreating ? "Crear Empresa" : "Editar Empresa"}</DialogTitle>
        <DialogContent>
          <EmpresaForm empresa={empresa} onChange={setEmpresa} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancelar</Button>
          <Button onClick={handleFormSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarMessage.includes('Error') ? 'error' : 'success'} sx={{ fontSize: '1.1rem', padding: '12px 24px' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default EmpresaList;

import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import EmpleadoFilter from "./EmpleadoFilter";
import EmpleadoTable from "./EmpleadoTable";
import EmpleadoForm from "./EmpleadoForm";
import api from "../../../api/api";

const EmpleadoList = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchEmpleados = async () => {
    try {
      const res = await api.get("/admin/empleados");
      setEmpleados(res.data);
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleCreate = () => {
    setSelectedEmpleado(null);
    setModoEdicion(false);
    setOpenForm(true);
  };

  const handleEdit = (empleado) => {
    setSelectedEmpleado(empleado);
    setModoEdicion(true);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar empleado?")) {
      try {
        await api.delete(`/admin/empleados/${id}`);
        fetchEmpleados();
        setSnackbarMessage("Empleado eliminado con éxito");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error al eliminar el empleado:", error);
        setSnackbarMessage("Error al eliminar el empleado");
        setSnackbarOpen(true);
      }
    }
  };

  const handleFilter = async (filtro) => {
    try {
      const res = await api.post("/admin/empleados/filtrar", filtro);
      setEmpleados(res.data);
    } catch (error) {
      console.error("Error al filtrar los empleados:", error);
    }
  };

  const handleFormSubmit = async () => {
    try {
      const empleadoData = {
        nombre: selectedEmpleado.nombre,
        apellido1: selectedEmpleado.apellido1,
        apellido2: selectedEmpleado.apellido2,
        email: selectedEmpleado.email,
        telefono: selectedEmpleado.telefono,
        dni: selectedEmpleado.dni,
        domicilio: selectedEmpleado.domicilio,
        salario: parseFloat(selectedEmpleado.salario),
        fechaContratacion: selectedEmpleado.fechaContratacion,
        fechaCese: selectedEmpleado.fechaCese || null,
      };

      if (modoEdicion && selectedEmpleado?.id) {
        await api.put(`/admin/empleados/${selectedEmpleado.id}`, empleadoData);
        setSnackbarMessage("Empleado editado con éxito");
      } else {
        empleadoData.password = selectedEmpleado.password;
        await api.post("/admin/empleados", empleadoData);
        setSnackbarMessage("Empleado creado con éxito");
      }

      setOpenForm(false);
      setSelectedEmpleado(null);
      setModoEdicion(false);
      fetchEmpleados();
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error al guardar el empleado");
      setSnackbarOpen(true);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedEmpleado(null);
    setModoEdicion(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Empleados</Typography>
        <Button variant="contained" onClick={handleCreate}>Crear Empleado</Button>
      </Stack>

      <EmpleadoFilter onFilter={handleFilter} />
      <EmpleadoTable empleados={empleados} onEdit={handleEdit} onDelete={handleDelete} />

      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>{modoEdicion ? "Editar Empleado" : "Nuevo Empleado"}</DialogTitle>
        <DialogContent>
          <EmpleadoForm
            empleado={selectedEmpleado}
            onChange={setSelectedEmpleado}
            isEdit={modoEdicion}
          />
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

export default EmpleadoList;

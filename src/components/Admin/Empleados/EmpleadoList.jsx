import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

import Navbar from "../Navbar";
import EmpleadoFilter from "./EmpleadoFilter";
import EmpleadoTable from "./EmpleadoTable";
import EmpleadoForm from "./EmpleadoForm";
import api from "../../../api/api";

const validarEmpleado = (empleado, modoEdicion, empleados) => {
  const campos = [
    "nombre",
    "apellido1",
    "apellido2",
    "email",
    "telefono",
    "dni",
    "domicilio",
    "salario",
    "fechaContratacion",
  ];
  if (!modoEdicion) campos.push("password");

  for (const campo of campos) {
    if (!empleado[campo] || empleado[campo].toString().trim() === "") {
      return { valido: false, mensaje: `El campo ${campo} es obligatorio` };
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(empleado.email)) {
    return { valido: false, mensaje: "El email no tiene un formato válido" };
  }

  const emailDuplicado = empleados.some(
    (e) =>
      e.email.toLowerCase() === empleado.email.toLowerCase() &&
      e.id !== empleado.id
  );
  if (emailDuplicado) {
    return { valido: false, mensaje: "El email ya está registrado" };
  }

  const dniRegex = /^[0-9]{8}[A-Z]$/i;
  if (!dniRegex.test(empleado.dni)) {
    return { valido: false, mensaje: "El DNI no tiene un formato válido" };
  }

  const telefonoRegex = /^[67]\d{8}$/;
  if (!telefonoRegex.test(empleado.telefono)) {
    return { valido: false, mensaje: "El teléfono no tiene un formato válido" };
  }

  if (isNaN(empleado.salario) || Number(empleado.salario) <= 0) {
    return { valido: false, mensaje: "El salario debe ser un número positivo" };
  }

  if (empleado.fechaCese) {
    const fechaContratacion = new Date(empleado.fechaContratacion);
    const fechaCese = new Date(empleado.fechaCese);
    if (fechaCese <= fechaContratacion) {
      return {
        valido: false,
        mensaje: "La fecha de cese debe ser posterior a la fecha de contratación",
      };
    }
  }

  return { valido: true };
};

const EmpleadoList = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);

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

  const confirmDelete = (id) => {
    setEmpleadoAEliminar(id);
    setOpenConfirmDialog(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/admin/empleados/${empleadoAEliminar}`);
      fetchEmpleados();
      setSnackbarMessage("Empleado eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el empleado:", error);
      setSnackbarMessage("Error al eliminar el empleado");
    } finally {
      setOpenConfirmDialog(false);
      setEmpleadoAEliminar(null);
      setSnackbarOpen(true);
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
    const resultadoValidacion = validarEmpleado(selectedEmpleado, modoEdicion, empleados);
    if (!resultadoValidacion.valido) {
      setSnackbarMessage(resultadoValidacion.mensaje);
      setSnackbarOpen(true);
      return;
    }

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
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        backgroundColor: "#ecfdf5",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <Navbar />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: { xs: 1, sm: 2, md: 3 },
          mt: 3,
          width: "100%",
          boxSizing: "border-box",
        }}
      ></Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          px: { xs: 1, sm: 2, md: 3 },
          flexGrow: 1,
          boxSizing: "border-box",
        }}
      >
        <Paper
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            border: "1px solid #a7f3d0",
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#ffffff",
            width: "100%",
            overflowX: "auto",
            boxSizing: "border-box",
          }}
        >
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            mb={2}
          >
            <Button
              variant="contained"
              onClick={handleCreate}
              sx={{
                backgroundColor: "#065f46",
                color: "#bbf7d0",
                "&:hover": {
                  backgroundColor: "#047857",
                },
              }}
            >
              Crear Empleado
            </Button>
          </Stack>
          <EmpleadoFilter onFilter={handleFilter} />
          <EmpleadoTable
            empleados={empleados}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />

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

      {/* Dialogo de confirmación */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle sx={{ color: "#065f46" }}>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este empleado?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirmed}
            variant="contained"
            sx={{
              backgroundColor: "#dc2626",
              color: "#fef2f2",
              "&:hover": {
                backgroundColor: "#b91c1c",
              },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: "#065f46", fontWeight: "bold", fontSize: "1.25rem" }}>
          {modoEdicion ? "Editar Empleado" : "Nuevo Empleado"}
        </DialogTitle>
        <DialogContent>
          <EmpleadoForm
            empleado={selectedEmpleado}
            onChange={setSelectedEmpleado}
            isEdit={modoEdicion}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancelar</Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#065f46",
              color: "#bbf7d0",
              "&:hover": {
                backgroundColor: "#047857",
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmpleadoList;

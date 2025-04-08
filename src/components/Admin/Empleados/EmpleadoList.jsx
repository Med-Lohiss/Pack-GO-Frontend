import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
      } catch (error) {
        console.error("Error al eliminar el empleado:", error);
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
      if (modoEdicion && selectedEmpleado?.id_usuario) {
        // Editar
        await api.put(`/admin/empleados/${selectedEmpleado.id_usuario}`, selectedEmpleado);
      } else {
        // Crear
        await api.post("/admin/empleados", selectedEmpleado);
      }
      setOpenForm(false);
      setSelectedEmpleado(null); // Limpiar el estado
      setModoEdicion(false);     // Reiniciar modo
      fetchEmpleados();
    } catch (error) {
      console.error("Error al guardar el empleado:", error);
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
            isEdit={modoEdicion} // 👈 CONTROL EXPLÍCITO
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancelar</Button>
          <Button onClick={handleFormSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EmpleadoList;

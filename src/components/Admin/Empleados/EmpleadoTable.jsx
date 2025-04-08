import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const EmpleadoTable = ({ empleados, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellidos</TableCell>
            <TableCell>DNI</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Salario</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {empleados.map((e) => (
            <TableRow key={e.id}>
              <TableCell>{e.nombre}</TableCell>
              <TableCell>{e.apellido1} {e.apellido2}</TableCell>
              <TableCell>{e.dni}</TableCell>
              <TableCell>{e.email}</TableCell>
              <TableCell>{e.telefono}</TableCell>
              <TableCell>{e.salario} €</TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(e)}><EditIcon /></IconButton>
                <IconButton onClick={() => onDelete(e.id)}><DeleteIcon color="error" /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmpleadoTable;

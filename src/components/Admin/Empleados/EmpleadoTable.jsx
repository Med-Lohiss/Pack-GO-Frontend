import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TableSortLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const EmpleadoTable = ({ empleados, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ field: null, direction: "asc" });

  const formatFecha = (fecha) => {
    if (!fecha) return "En activo";
    try {
      return format(new Date(fecha), "dd/MM/yyyy", { locale: es });
    } catch {
      return "Fecha inválida";
    }
  };

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      } else {
        return { field, direction: "asc" };
      }
    });
  };

  const sortedEmpleados = [...empleados].sort((a, b) => {
    const { field, direction } = sortConfig;
    if (!field) return 0;

    let valA = a[field];
    let valB = b[field];

    if (field === "fechaContratacion" || field === "fechaCese") {
      valA = valA ? new Date(valA) : new Date(0);
      valB = valB ? new Date(valB) : new Date(0);
    } else if (field === "salario") {
      valA = parseFloat(valA) || 0;
      valB = parseFloat(valB) || 0;
    } else if (typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 2,
        backgroundColor: "#ffffff",
        border: "1px solid #a7f3d0",
        borderRadius: 2,
        boxShadow: 3,
        overflowX: "auto",
      }}
    >
      <Table size="small" aria-label="tabla de empleados" sx={{ minWidth: 800 }}>
        <TableHead sx={{ backgroundColor: "#a7f3d0" }}>
          <TableRow>
            <TableCell sx={{ color: "#065f46" }}>
              <TableSortLabel
                active={sortConfig.field === "nombre"}
                direction={sortConfig.field === "nombre" ? sortConfig.direction : "asc"}
                onClick={() => handleSort("nombre")}
              >
                Nombre
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "#065f46" }}>Apellidos</TableCell>
            <TableCell sx={{ color: "#065f46" }}>DNI</TableCell>
            <TableCell sx={{ color: "#065f46" }}>Email</TableCell>
            <TableCell sx={{ color: "#065f46" }}>Teléfono</TableCell>
            <TableCell sx={{ color: "#065f46" }}>
              <TableSortLabel
                active={sortConfig.field === "salario"}
                direction={sortConfig.field === "salario" ? sortConfig.direction : "asc"}
                onClick={() => handleSort("salario")}
              >
                Salario
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "#065f46" }}>
              <TableSortLabel
                active={sortConfig.field === "fechaContratacion"}
                direction={sortConfig.field === "fechaContratacion" ? sortConfig.direction : "asc"}
                onClick={() => handleSort("fechaContratacion")}
              >
                Fecha Contratación
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "#065f46" }}>
              <TableSortLabel
                active={sortConfig.field === "fechaCese"}
                direction={sortConfig.field === "fechaCese" ? sortConfig.direction : "asc"}
                onClick={() => handleSort("fechaCese")}
              >
                Fecha Cese
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "#065f46" }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedEmpleados.map((e) => (
            <TableRow
              key={e.id}
              hover
              sx={{
                "&:hover": {
                  backgroundColor: "#d1fae5",
                },
              }}
            >
              <TableCell>{e.nombre}</TableCell>
              <TableCell>{e.apellido1} {e.apellido2}</TableCell>
              <TableCell>{e.dni}</TableCell>
              <TableCell>{e.email}</TableCell>
              <TableCell>{e.telefono}</TableCell>
              <TableCell>{e.salario} €</TableCell>
              <TableCell>{formatFecha(e.fechaContratacion)}</TableCell>
              <TableCell>{formatFecha(e.fechaCese)}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="editar"
                  sx={{
                    color: "#065f46",
                    "&:hover": {
                      backgroundColor: "#bbf7d0",
                    },
                  }}
                  onClick={() => onEdit(e)}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  aria-label="eliminar"
                  sx={{
                    color: "#065f46",
                    "&:hover": {
                      backgroundColor: "#bbf7d0",
                    },
                  }}
                  onClick={() => onDelete(e.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmpleadoTable;

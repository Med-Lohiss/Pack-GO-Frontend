import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  TableSortLabel,
} from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ClienteTable = ({ clientes, onBloquearToggle }) => {
  const [sortConfig, setSortConfig] = useState({ field: null, direction: "asc" });

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    try {
      return format(new Date(fecha), "dd/MM/yyyy", { locale: es });
    } catch {
      return "Fecha inválida";
    }
  };

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        const nextDirection = prev.direction === "asc" ? "desc" : "asc";
        return { field, direction: nextDirection };
      } else {
        return { field, direction: "asc" };
      }
    });
  };

  const sortedClientes = [...clientes].sort((a, b) => {
    const { field, direction } = sortConfig;
    if (!field) return 0;

    let valA = a[field];
    let valB = b[field];

    if (field === "fechaCreacion") {
      valA = new Date(valA);
      valB = new Date(valB);
    } else {
      valA = valA?.toLowerCase?.() ?? "";
      valB = valB?.toLowerCase?.() ?? "";
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
      <Table size="small" aria-label="tabla de clientes" sx={{ minWidth: 600 }}>
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
            <TableCell sx={{ color: "#065f46" }}>Email</TableCell>
            <TableCell sx={{ color: "#065f46" }}>Proveedor</TableCell>
            <TableCell sx={{ color: "#065f46" }}>
              <TableSortLabel
                active={sortConfig.field === "fechaCreacion"}
                direction={sortConfig.field === "fechaCreacion" ? sortConfig.direction : "asc"}
                onClick={() => handleSort("fechaCreacion")}
              >
                Fecha Creación
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "#065f46" }} align="center">
              Bloqueado
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedClientes.map((c) => (
            <TableRow
              key={c.id}
              hover
              sx={{
                "&:hover": {
                  backgroundColor: "#d1fae5",
                },
              }}
            >
              <TableCell sx={{ maxWidth: 150, wordBreak: "break-word" }}>{c.nombre}</TableCell>
              <TableCell sx={{ maxWidth: 200, wordBreak: "break-word" }}>{c.email}</TableCell>
              <TableCell>{c.provider || "Local"}</TableCell>
              <TableCell>{formatFecha(c.fechaCreacion)}</TableCell>
              <TableCell align="center">
                <Switch
                  checked={c.bloqueado || false}
                  onChange={() => onBloquearToggle(c.id, !(c.bloqueado || false))}
                  color="error"
                  inputProps={{ "aria-label": "bloquear cliente" }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClienteTable;

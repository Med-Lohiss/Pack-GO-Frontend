import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch
} from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ClienteTable = ({ clientes, onBloquearToggle }) => {
  const formatFecha = (fecha) => {
    if (!fecha) return "";
    try {
      return format(new Date(fecha), "dd/MM/yyyy", { locale: es });
    } catch {
      return "Fecha inválida";
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small" aria-label="tabla de clientes" sx={{ minWidth: 300 }}>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Proveedor</TableCell>
            <TableCell>Fecha Creación</TableCell>
            <TableCell align="center">Bloqueado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientes.map((c) => (
            <TableRow key={c.id} hover>
              <TableCell sx={{ maxWidth: 150, wordBreak: "break-word" }}>{c.nombre}</TableCell>
              <TableCell sx={{ maxWidth: 200, wordBreak: "break-word" }}>{c.email}</TableCell>
              <TableCell>{c.provider || "Local"}</TableCell>
              <TableCell>{formatFecha(c.fechaCreacion)}</TableCell>
              <TableCell align="center">
                <Switch
                  checked={c.bloqueado || false}
                  onChange={() => onBloquearToggle(c.id, !(c.bloqueado || false))}
                  color="error"
                  inputProps={{ 'aria-label': 'bloquear cliente' }}
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

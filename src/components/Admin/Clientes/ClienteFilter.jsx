import React, { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";

const ClienteFilter = ({ onFilter }) => {
  const [filtro, setFiltro] = useState({});

  const handleChange = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filtro);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mb={3}>
      <Stack
  direction="row"
  spacing={2}
  useFlexGap
  flexWrap="wrap"
  alignItems="flex-start"
  rowGap={2}
>
  <TextField
    name="nombre"
    label="Nombre"
    variant="outlined"
    onChange={handleChange}
    size="small"
    sx={{ flexBasis: "150px", flexGrow: 1 }}
  />
  <TextField
    name="email"
    label="Email"
    variant="outlined"
    onChange={handleChange}
    size="small"
    sx={{ flexBasis: "150px", flexGrow: 1 }}
  />
  <Select
    name="provider"
    defaultValue=""
    displayEmpty
    onChange={handleChange}
    size="small"
    sx={{
      flexBasis: "150px",
      flexGrow: 1,
      backgroundColor: "#ecfdf5",
    }}
  >
    <MenuItem value="">Proveedor</MenuItem>
    <MenuItem value="LOCAL">Local</MenuItem>
    <MenuItem value="GOOGLE">Google</MenuItem>
  </Select>
  <TextField
    name="fechaCreacion"
    label="Fecha Registro"
    type="date"
    InputLabelProps={{ shrink: true }}
    onChange={handleChange}
    size="small"
    sx={{ flexBasis: "170px", flexGrow: 1 }}
  />
  <Button
    type="submit"
    variant="contained"
    size="medium"
    sx={{
      flexBasis: "130px",
      backgroundColor: "#065f46",
      color: "#bbf7d0",
      "&:hover": {
        backgroundColor: "#047857",
      },
    }}
  >
    Filtrar
  </Button>
</Stack>


    </Box>
  );
};

export default ClienteFilter;

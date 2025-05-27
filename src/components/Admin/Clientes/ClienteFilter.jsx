import React, { useState } from "react";
import { Box, TextField, Select, MenuItem, Button, Stack } from "@mui/material";

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
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        flexWrap="wrap"
        alignItems="center"
      >
        <TextField
          name="nombre"
          label="Nombre"
          variant="outlined"
          onChange={handleChange}
          size="small"
          sx={{ minWidth: { xs: "100%", sm: 150 } }}
        />
        <TextField
          name="email"
          label="Email"
          variant="outlined"
          onChange={handleChange}
          size="small"
          sx={{ minWidth: { xs: "100%", sm: 150 } }}
        />
        <Select
          name="provider"
          defaultValue=""
          displayEmpty
          onChange={handleChange}
          size="small"
          sx={{ minWidth: { xs: "100%", sm: 150 } }}
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
          sx={{ minWidth: { xs: "100%", sm: 170 } }}
        />
        <Button type="submit" variant="contained" size="medium" sx={{ whiteSpace: "nowrap" }}>
          Filtrar
        </Button>
      </Stack>
    </Box>
  );
};

export default ClienteFilter;

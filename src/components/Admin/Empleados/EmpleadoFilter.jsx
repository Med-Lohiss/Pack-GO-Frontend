import React, { useState } from "react";
import { Box, TextField, Select, MenuItem, Button, Stack } from "@mui/material";

const EmpleadoFilter = ({ onFilter }) => {
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
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <TextField name="nombre" label="Nombre" variant="outlined" onChange={handleChange} />
        <TextField name="apellido1" label="Apellido" variant="outlined" onChange={handleChange} />
        <TextField name="dni" label="DNI" variant="outlined" onChange={handleChange} />
        <Select name="ordenarPor" defaultValue="" displayEmpty onChange={handleChange}>
          <MenuItem value="">Ordenar por</MenuItem>
          <MenuItem value="salario">Salario</MenuItem>
          <MenuItem value="fechaContratacion">Fecha de Contratación</MenuItem>
        </Select>
        <Select name="orden" defaultValue="" displayEmpty onChange={handleChange}>
          <MenuItem value="">Orden</MenuItem>
          <MenuItem value="asc">Ascendente</MenuItem>
          <MenuItem value="desc">Descendente</MenuItem>
        </Select>
        <Button type="submit" variant="contained">Filtrar</Button>
      </Stack>
    </Box>
  );
};

export default EmpleadoFilter;

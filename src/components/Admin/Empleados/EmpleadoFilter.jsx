import React, { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";

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
          name="apellido1"
          label="Apellido"
          variant="outlined"
          onChange={handleChange}
          size="small"
          sx={{ flexBasis: "150px", flexGrow: 1 }}
        />
        <TextField
          name="dni"
          label="DNI"
          variant="outlined"
          onChange={handleChange}
          size="small"
          sx={{ flexBasis: "150px", flexGrow: 1 }}
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

export default EmpleadoFilter;

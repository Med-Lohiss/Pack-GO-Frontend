import React, { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";

const EmpresaForm = ({ empresa, onChange }) => {
  const [formData, setFormData] = useState({
    cif: "",
    denominacionSocial: "",
    domicilio: "",
    fechaConstitucion: "",
    direccionWeb: "",
    telefono: "",
    emailContacto: "",
  });

  useEffect(() => {
    if (empresa) {
      setFormData({
        ...empresa,
        fechaConstitucion: empresa.fechaConstitucion
          ? empresa.fechaConstitucion.slice(0, 10)
          : "",
      });
    }
  }, [empresa]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    onChange(updated);
  };

  const fields = [
    { label: "CIF", name: "cif" },
    { label: "Denominación Social", name: "denominacionSocial" },
    { label: "Domicilio", name: "domicilio" },
    { label: "Fecha de Constitución", name: "fechaConstitucion", type: "date" },
    { label: "Dirección Web", name: "direccionWeb" },
    { label: "Teléfono", name: "telefono" },
    { label: "Email de Contacto", name: "emailContacto" },
  ];

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
      gap={2}
      mt={1}
    >
      {fields.map((f) => (
        <TextField
          key={f.name}
          fullWidth
          label={f.label}
          name={f.name}
          value={formData[f.name] || ""}
          onChange={handleChange}
          type={f.type || "text"}
          InputLabelProps={f.type === "date" ? { shrink: true } : {}}
          sx={{
            "& label.Mui-focused": { color: "#047857" },
            "& .MuiInput-underline:after": { borderBottomColor: "#047857" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#d1fae5" },
              "&:hover fieldset": { borderColor: "#65a30d" },
              "&.Mui-focused fieldset": { borderColor: "#047857" },
            },
          }}
        />
      ))}
    </Box>
  );
};

export default EmpresaForm;

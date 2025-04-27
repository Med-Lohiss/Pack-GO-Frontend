import React, { useEffect, useState } from "react";
import { TextField, Grid } from "@mui/material";

const EmpleadoForm = ({ empleado, onChange, isEdit }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    email: "",
    telefono: "",
    dni: "",
    domicilio: "",
    salario: "",
    password: "",
    fechaContratacion: "",
    fechaCese: "",
  });

  useEffect(() => {
    if (empleado) {
      setFormData({
        ...empleado,
        fechaContratacion: empleado.fechaContratacion
          ? empleado.fechaContratacion.split("T")[0]
          : "",
        fechaCese: empleado.fechaCese ? empleado.fechaCese.split("T")[0] : "",
      });
    } else {
      setFormData({
        nombre: "",
        apellido1: "",
        apellido2: "",
        email: "",
        telefono: "",
        dni: "",
        domicilio: "",
        salario: "",
        password: "",
        fechaContratacion: "",
        fechaCese: "",
      });
    }
  }, [empleado]);

  const handleChange = (e) => {
    const updated = {
      ...formData,
      [e.target.name]: e.target.value,
      id: empleado?.id || formData.id,
    };
    setFormData(updated);
    onChange(updated);
  };

  const fields = [
    { label: "Nombre", name: "nombre" },
    { label: "Apellido 1", name: "apellido1" },
    { label: "Apellido 2", name: "apellido2" },
    { label: "Email", name: "email" },
    { label: "DNI", name: "dni" },
    { label: "Teléfono", name: "telefono" },
    { label: "Domicilio", name: "domicilio" },
    { label: "Salario", name: "salario", type: "number" },
    { label: "Fecha de Contratación", name: "fechaContratacion", type: "date" },
  ];

  if (isEdit) {
    fields.push({
      label: "Fecha de Cese",
      name: "fechaCese",
      type: "date",
    });
  }

  if (!isEdit) {
    fields.push({
      label: "Contraseña",
      name: "password",
      type: "password",
    });
  }

  return (
    <Grid container spacing={2} mt={1}>
      {fields.map((f) => (
        <Grid item xs={12} sm={6} key={f.name}>
          <TextField
            fullWidth
            label={f.label}
            name={f.name}
            type={f.type || "text"}
            value={formData[f.name] || ""}
            onChange={handleChange}
            InputLabelProps={f.type === "date" ? { shrink: true } : {}}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default EmpleadoForm;

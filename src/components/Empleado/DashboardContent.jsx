// src/components/Admin/DashboardContent.js
import React from "react";
import { Link } from "react-router-dom";

const DashboardContent = () => {
  return (
    <div>
      <h3>Funciones del empleado</h3>
      <p>Seleccione una opción del menú lateral para gestionar las funciones del sistema:</p>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h4>Gestionar empleados</h4>
          <p>Acceda a la lista de empleados, alta, baja y actualización.</p>
          <Link to="/admin/empleados" style={buttonStyle}>Ir a empleados</Link>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#ecf0f1',
  borderRadius: '10px',
  margin: '10px',
  padding: '20px',
  width: '220px',
  textAlign: 'center',
  boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
};

const buttonStyle = {
  display: 'inline-block',
  marginTop: '10px',
  padding: '10px 20px',
  backgroundColor: '#3498db',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '5px',
};

export default DashboardContent;

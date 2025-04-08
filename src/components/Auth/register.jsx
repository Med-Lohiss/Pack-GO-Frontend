// src/components/Auth/Register.jsx
import React, { useState } from 'react';
import { register } from '../../api/api';  // Importar la función de register

const Register = ({ onRegisterSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const rolUsuario = 'CLIENTE'; // Fijamos el rol como CLIENTE

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');  // Limpiar el mensaje de error en cada intento de registro

    try {
      // Llamamos a la API de registro
      const response = await register(nombre, apellido1, apellido2, dni, telefono, domicilio, email, password, rolUsuario);
      // Pasar la respuesta del registro (mensaje de éxito) a la función onRegisterSuccess
      onRegisterSuccess(response);
    } catch (err) {
      // En caso de error, mostramos el mensaje correspondiente
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Registrarse</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Nombre:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Primer Apellido:</label>
          <input 
            type="text" 
            value={apellido1} 
            onChange={(e) => setApellido1(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Segundo Apellido:</label>
          <input 
            type="text" 
            value={apellido2} 
            onChange={(e) => setApellido2(e.target.value)} 
          />
        </div>
        <div>
          <label>DNI:</label>
          <input 
            type="text" 
            value={dni} 
            onChange={(e) => setDni(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Teléfono:</label>
          <input 
            type="text" 
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Domicilio:</label>
          <input 
            type="text" 
            value={domicilio} 
            onChange={(e) => setDomicilio(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;

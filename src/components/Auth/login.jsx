// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { login } from '../../api/api';  // Importar la función de login

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');  // Limpiar el mensaje de error en cada intento de login

    try {
      // Llamamos a la API de login
      const response = await login(email, password);
      // Pasar la respuesta del login (que contiene el JWT y el rol) a la función onLoginSuccess
      onLoginSuccess(response);
    } catch (err) {
      // En caso de error, mostramos el mensaje correspondiente
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;

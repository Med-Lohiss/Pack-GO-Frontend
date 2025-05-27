import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers['Authorization'];
  }
};

const getJwtToken = () => {
  return localStorage.getItem('jwt') || Cookies.get('jwt');
};

const getRefreshToken = () => {
  return Cookies.get('refreshToken');
};

const isJwtValid = (token) => {
  try {
    const { exp } = jwtDecode(token); 
    return exp * 1000 > Date.now();
  } catch (err) {
    return false;
  }
};

export const refreshAuthToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  try {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    const { jwt } = response.data;

    Cookies.set('jwt', jwt, { expires: 1 });
    localStorage.setItem('jwt', jwt);

    setAuthToken(jwt);
    return jwt;
  } catch (error) {
    throw new Error('Error al refrescar el token');
  }
};

// Función de login 
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { jwt, refreshToken } = response.data;

    Cookies.set('jwt', jwt, { expires: 1 });
    Cookies.set('refreshToken', refreshToken, { expires: 7 });
    localStorage.setItem('jwt', jwt);

    setAuthToken(jwt);

    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 423) {
        const mensaje = error.response.data?.mensaje || 'Cuenta bloqueada. Contacta con la administración.';
        throw new Error(mensaje);
      }
      const mensajeGenerico = 
        typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data?.mensaje || 'Error al iniciar sesión';
      throw new Error(mensajeGenerico);
    } else {
      throw new Error('Error de conexión con el servidor');
    }
  }
};

// Función de registro
export const register = async (nombre, email, password, rolUsuario = "CLIENTE") => {
  try {
    const response = await api.post('/auth/signup', { 
      nombre,
      email,
      password,
      rolUsuario
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || 'Error al registrar usuario');
    } else {
      throw new Error('Error de conexión con el servidor');
    }
  }
};

const token = getJwtToken();
if (token && isJwtValid(token)) {
  setAuthToken(token);
}

export { setAuthToken };

export default api;

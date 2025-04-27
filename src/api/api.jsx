import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // ✅ Cambio aquí

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para establecer el token en los headers si es necesario
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers['Authorization'];
  }
};

// Obtener el token desde Cookies o LocalStorage
const getJwtToken = () => {
  return localStorage.getItem('jwt') || Cookies.get('jwt');
};

// Obtener el refreshToken desde las cookies
const getRefreshToken = () => {
  return Cookies.get('refreshToken');
};

// Verifica si el token JWT es válido y no está expirado
const isJwtValid = (token) => {
  try {
    const { exp } = jwtDecode(token); // ✅ Cambio aquí también
    return exp * 1000 > Date.now();
  } catch (err) {
    return false;
  }
};

// Función para refrescar el token cuando sea necesario
export const refreshAuthToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  try {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    const { jwt } = response.data;

    // Guardar el nuevo token en Cookies y LocalStorage
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

    // Guardar el token en Cookies y LocalStorage
    Cookies.set('jwt', jwt, { expires: 1 });
    Cookies.set('refreshToken', refreshToken, { expires: 7 });
    localStorage.setItem('jwt', jwt);

    setAuthToken(jwt);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || 'Error al iniciar sesión');
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

// Solo setear el token si es válido
const token = getJwtToken();
if (token && isJwtValid(token)) {
  setAuthToken(token);
}

export default api;

import axios from 'axios';

// Configura la URL base de tu backend. Puedes ajustar esta variable en tu .env:
// VITE_API_BASE_URL=http://localhost:4000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Llama al endpoint de login de tu backend.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<Object>} datos de usuario y token
 */
export async function login({ email, password }) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

/**
 * Llama al endpoint de registro de tu backend.
 * @param {{ nombre: string, apellido: string, email: string, password: string }} userData
 * @returns {Promise<Object>} datos del usuario creado
 */
export async function register({ nombre, apellido, email, password }) {
  const response = await api.post('/auth/register', { nombre, apellido, email, password });
  return response.data;
}

/**
 * Crea un nuevo tenant.
 * @param {{ nombre: string, dominio: string }} data
 * @returns {Promise<Object>} el tenant creado
 */
export async function createTenant({ nombre, dominio }) {
  const response = await api.post('/tenants', { nombre, dominio });
  return response.data;
}

/**
 * Crea una nueva estación para un tenant dado.
 * @param {{ tenantId: string, nombre: string, direccion: string, estado: string, servicios: string[] }} data
 * @returns {Promise<Object>} estación creada
 */
export async function createStation({ tenantId, nombre, direccion, estado, servicios }) {
  const response = await api.post('/stations', { tenantId, nombre, direccion, estado, servicios }); // ajustar /stations según tu API
  return response.data;
}

export default api;

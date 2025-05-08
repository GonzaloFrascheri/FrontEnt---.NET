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

/**
 * Crea un producto en el catálogo de un tenant.
 * @param {{ tenantId: string, nombre: string, precio: number, requiereVEAI: boolean }} data
 * @returns {Promise<Object>} Producto creado
 */
export async function createProduct({ tenantId, nombre, precio, requiereVEAI }) {
  const response = await api.post('/products', { tenantId, nombre, precio, requiereVEAI });
  return response.data;
}

/**
 * Actualiza el precio de un combustible para todas las estaciones.
 * @param {{ productId: string, nuevoPrecio: number }} data
 * @returns {Promise<Object>} datos del combustible actualizado
 */
export async function updateFuelPrice({ productId, nuevoPrecio }) {
  const response = await api.put(`/fuels/${productId}/price`, { precio: nuevoPrecio });
  return response.data;
}

/**
 * Obtiene el catálogo de productos para canje de puntos.
 * @returns {Promise<Array>} lista de productos con campos id, nombre, costoPuntos, edadMinima
 */
export async function getCatalog() {
  const response = await api.get('/catalog'); // ajusta la ruta según tu API
  return response.data;
}

/**
 * Canjea puntos por un producto.
 * @param {{ productId: string }} data
 * @returns {Promise<Object>}
 */
export async function redeemProduct({ productId }) {
  const response = await api.post('/redeem', { productId });
  return response.data;
}

/**
 * Verifica la identidad y edad del usuario.
 * @param {{ nombre: string, documento: string, fechaNacimiento: string }} data
 * @returns {Promise<Object>}
 */
export async function verifyIdentity(data) {
  const response = await api.post('/verify-identity', data);
  return response.data;
}

export default api;

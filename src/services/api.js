import axios from 'axios';

// Configura la URL base de tu backend. Puedes ajustar esta variable en tu .env:
// VITE_API_BASE_URL=http://localhost:4000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Llama al endpoint de login
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<Object>} datos de usuario y token
 */
export async function login({ email, password }) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

/**
 * Llama al endpoint de registro
 * @param {{ nombre: string, apellido: string, email: string, password: string }} userData
 * @returns {Promise<Object>} datos del usuario creado
 */
export async function register({ nombre, apellido, email, password }) {
  const response = await api.post('/auth/register', { nombre, apellido, email, password });
  return response.data;
}

/**
 * Crea un nuevo tenant/cadena.
 * @param {{ name: string, tenantId: string }} data
 * @returns {Promise<{ name: string, tenantId: string }>} el tenant creado
 */
export async function createTenant({ name, tenantId }) {
  const payload = { name, tenantId };
  const response = await api.post('/Tenant/Create', payload);
  return response.data;
}

/**
 * Obtiene un tenant por su ID.
 * @param {number} id
 * @returns {Promise<{ id: number, name: string, tenantId: string }>}
 */
export async function getTenantById(id) {
  const { data } = await api.get(`/Tenant/${id}`)
  return data
}

/**
 * Obtiene el listado completo de tenants (cadenas).
 * @returns {Promise<Array<{ id: number, name: string, tenantId: string }>>}
 */
export async function getTenants() {
  const { data } = await api.get('/Tenant')
  return data
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

/**
 * Obtiene los datos del perfil del usuario autenticado.
 * @returns {Promise<{ nombre:string, apellido:string, email:string }>}
 */
export async function getProfile() {
  const response = await api.get('/auth/me');
  return response.data;
}

/**
 * Actualiza el perfil del usuario.
 * @param {{ nombre:string, apellido:string, email:string, password?:string }} data
 * @returns {Promise<Object>}
 */
export async function updateProfile(data) {
  const response = await api.put('/auth/profile', data);
  return response.data;
}

/**
 * Obtiene el historial de transacciones del usuario logueado.
 * @returns {Promise<Array<{ id: number, fecha: string, descripcion: string, puntos: number }>>}
 */
export async function getHistory() {
  const response = await api.get('/points/history');
  return response.data;
}

export default api;

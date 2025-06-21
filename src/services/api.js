import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🛠️ Interceptor para debug: imprime URL, método y headers
api.interceptors.request.use(config => {
  return config;
});

/*--------------------------------LOGIN--------------------------------*/
/**
 * Llama al endpoint de login
 * @param {{ email: string, password: string }}
 * @returns {{ token:string }}
 */
export async function login({ email, password }) {
  const response = await api.post(
    '/Auth/login',
    { email, password }
  );
  return { token: response.data.data.token };
}

/**
 * Llama al endpoint de registro
 * @param {{ email: string, password: string, name: string}} userData
 * @returns {Promise<{ error: boolean, data: { token: string }, message: string }>} Respuesta de la API
 */
export async function register({ name, email, password }) {
  try {
    const response = await api.post('/Auth/signup', { name, email, password });
    return response.data;
  } catch (error) {
    // Si la respuesta tiene data y message, mostralo
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Registro fallido');
  }
}

/**
 * Login con Google: envía el idToken, email y name al backend
 * @param {{ idToken: string, email: string, name: string }}
 * @returns {Promise<{ token: string }>}
 */
export async function googleLoginBackend({ idToken, email, name }, tenantName) {
  const response = await api.post(
    '/Auth/google-login',
    { idToken, email, name },
    { headers: { 'X-Tenant-Name': tenantName } }
  );
  return response.data.data;
}


/*--------------------------------USER--------------------------------*/
/**
 * Llama al endpoint para obtener el usuario autenticado
 * @param {{ }}
 * @returns {Promise<Object>}
 */
export async function getUser() {
  try {
    const response = await api.get('/Auth/me');
    return response.data;
  } catch (error) {
    console.error('Error al obtener el usuario:', error.message);
    throw new Error('No se pudo obtener el usuario: ', error.message);
  }
}


/*--------------------------------TENANT--------------------------------*/
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
 * Obtiene el listado completo de tenants (cadenas) desde public/tenant
 * @returns {Promise<Array<{ id: number, name: string, tenantId: string }>>}
 */
export async function getTenants() {
  // Llama a: GET http://localhost:5162/api/public/tenant
  const response = await api.get('/public/tenant');

  // response.data === { error, data: [ { name } ], message }
  const list = response.data.data;

  // Mapea para tener id, name y tenantId (igual al name)
  return list.map((t, idx) => ({
    id: idx,
    name: t.name,
    tenantId: t.name
  }));
}


/*--------------------------------ESTACION--------------------------------*/
/**
 * Crea una nueva estación para un tenant dado.
 * @param {{ tenantId: string, latitud: string, longitud: string }} data
 * @returns {Promise<Object>} estación creada
 */
export async function createStation({ tenantId, latitud, longitud }) {
  const response = await api.post('/stations', { tenantId, latitud, longitud });
  return response.data;
}

/**
 * Obtiene la lista de estaciones
 * @returns {Promise<Array>} listado de estaciones con id, name, latitud, longitud, address, etc.
 */
export async function getBranches() {
  const response = await api.get('/Branch');
  return response.data;
}

/*--------------------------------PRODUCTO--------------------------------*/
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
 * Obtiene el catálogo de productos para canje de puntos.
 * @returns {Promise<Array>} lista de productos con campos id, nombre, costoPuntos, edadMinima
 */
export async function getCatalog() {
  const response = await api.get('/Product');

  return response.data.data;
}

/**
 * Obtiene el catálogo de productos para canje de puntos con sus stock.
 * @returns {Promise<Array>} lista de productos con campos id, nombre, costoPuntos, edadMinima
 */
export async function getCatalogWithStock(branchId) {
  const response = await api.get(`/Product/stock/${branchId}`);

  return response.data.data;
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

/*--------------------------------COMBUSTIBLE--------------------------------*/
/**
 * Actualiza el precio de un combustible para todas las estaciones.
 * @param {{ productId: string, nuevoPrecio: number }} data
 * @returns {Promise<Object>} datos del combustible actualizado
 */
export async function updateFuelPrice({ productId, nuevoPrecio }) {
  const response = await api.put(`/fuels/${productId}/price`, { precio: nuevoPrecio });
  return response.data;
}


/*--------------------------------VERIFICACION DE EDAD--------------------------------*/
/**
 * Verifica la identidad y edad del usuario.
 * @param {{ documentNumber: string }} data
 * @returns {Promise<Object>}
 */
export async function verifyIdentity(data) {
  const response = await api.post('/VEAI', data);
  return response.data;
}

/*--------------------------------PERFIL DE USUARIO--------------------------------*/
/**
 * Obtiene los datos del perfil del usuario autenticado.
 * @returns {Promise<{ nombre:string, apellido:string, email:string }>}
 */
export async function getProfile() {
  const response = await api.get('/auth/Me');
  return response.data.data;
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

/*--------------------------------TRANSACCIONES--------------------------------*/
/**
 * Obtiene el historial de transacciones del usuario logueado (real)
 * @returns {Promise<Array>} listado de transacciones reales
 */
export async function getTransactionHistory() {
  const response = await api.get('/Transaction/history');
  // response.data = { error, data: [ ... ], message }
  return response.data.data;
}

/**
 * Obtiene los items de una transacción (detalle)
 * @param {number} transactionId
 * @returns {Promise<Array>} items de la transacción
 */
export async function getTransactionItems(transactionId) {
  const response = await api.get(`/Transaction/${transactionId}/items`);
  // response.data = { error, data: [ ... ], message }
  return response.data.data;
}

api.interceptors.request.use(config => {
  // Chequea si la URL es pública y NO debería llevar token
  if (
    config.url &&
    (
      config.url.includes('/public/tenant') ||
      config.url.includes('/public/')
    )
  ) {
    // Borra el header Authorization si existe (por si arrastra viejo)
    delete config.headers.Authorization;
  } else {
    // En endpoints privados, agrega el token si existe
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;

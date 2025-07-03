import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let logoutFunction = null;

export const setLogoutFunction = (fn) => {
  logoutFunction = fn;
};

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

/**
 * Envía un email con un link para iniciar sesión
 * @param {{ email: string }}
 * @returns {Promise<{ token: string }>}
 */
export async function getMagicLink(email) {
  const response = await api.post('/auth/magic-link', {
    email
  });
  return response.data;
}

/**
 * Valida un magic link token
 * @param {string} token - Token del magic link
 * @returns {Promise<{ error: boolean, data: { token: string }, message: string }>}
 */
export async function validateMagicLink(token) {
  try {
    const response = await api.post('/auth/validate-magic-link', { token });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error('Error al validar el magic link');
  }
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

/**
 * Obtiene el programa de fidelidad de un tenant
 * @returns {Promise<Object>} programa de fidelidad
 */
export async function getLoyaltyProgram() {
  const response = await api.get(`/LoyaltyProgram`);
  return response.data.data;
}

/**
 * Obtiene la configuración de la UI de un tenant
 * @returns {Promise<Object>} configuración de la UI
 */
export async function getTenantUIConfig() {
  const response = await api.get(`/TenantUI/public`);
  return response.data.data;
}

/**
 * Obtiene los parámetros generales de un tenant
 * @returns {Promise<Object>} parámetros generales
 */
export async function getGeneralParameters() {
  const response = await api.get(`/GeneralParameter`);
  return response.data.data;
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

export async function generateRedemptionToken({ branchId, productId, quantity = 1 }) {
  // Crear el nuevo formato de payload
  const payload = {
    BranchId: branchId,
    Products: [
      {
        ProductId: productId,
        Quantity: quantity
      }
    ]
  };
  
  const response = await api.post('/Redemption/generate-token', payload);
  if (response.data && !response.data.error && response.data.data?.token) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "No se pudo generar el token");
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

/**
 * Obtiene los precios de combustibles para una sucursal.
 * @param {number|string} branchId
 * @returns {Promise<Array>} Array de precios (id, fuelType, price, etc)
 */
export async function getFuelPrices(branchId) {
  const response = await api.get(`/Fuel/${branchId}/prices`);
  // Maneja el error según tu backend
  if (response.data && response.data.error === false) {
    return response.data.data;
  } else {
    // Podés tirar el mensaje de error que venga del backend
    throw new Error(response.data?.message || "No se pudieron obtener los precios");
  }
}

/*--------------------------------VERIFICACION DE EDAD--------------------------------*/
/**
 * Verifica la identidad y edad del usuario.
 * @param {{ documentNumber: string }} data
 * @returns {Promise<Object>}
 */
export async function verifyIdentity(ci) {
  const response = await api.post('/VEAI', {
    "DocumentNumber": ci
  });
  return response.data.data;
}

/*--------------------------------PERFIL DE USUARIO--------------------------------*/

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
  return response.data.data;
}

/**
 * Obtiene los items de una transacción (detalle)
 * @param {number} transactionId
 * @returns {Promise<Array>} items de la transacción
 */
export async function getTransactionItems(transactionId) {
  const response = await api.get(`/Transaction/${transactionId}/items`);
  return response.data.data;
}

/**
 * Crea una nueva transacción.
 * @param {number} branchId
 * @param {number} productId
 * @param {number} quantity
 * @returns {Promise<Object>} transacción creada
 */
export async function createTransaction(branchId, productId, quantity) {
  const response = await api.post('/Transaction', {
    branchId,
    products: [
      {
        productId,
        quantity
      }
    ]
  });
  return response.data.data;
}

/*--------------------------------SERVICIOS--------------------------------*/

/**
 * Obtiene el catálogo de servicios para una estación.
 */
export async function getServicesCatalog(branchId) {
  const response = await api.get(`/Service/branch/${branchId}`);
  return response.data.data;
}

/*--------------------------------PROMOCIONES--------------------------------*/
/**
 * Obtiene las promociones de una estación.
 * @param {number} branchId
 * @returns {Promise<Array>} promociones
 */
export async function getBranchPromotions(branchId) {
  const response = await api.get(`/Promotion/Branch/${branchId}`);
  return response.data.data;
}

/*------------------------------------------------------------------------*/

api.interceptors.request.use(config => {
  if (
    config.url &&
    (
      config.url.includes('/public/tenant') ||
      config.url.includes('/public/') ||
      config.url.includes('/TenantUI/public')
    )
  ) {
    delete config.headers.Authorization;
  } else {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (logoutFunction) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        logoutFunction();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, getProfile } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // token y datos mínimos
  const [userData, setUserData] = useState(null); // datos extendidos: email, branchId, etc.
  const [loading, setLoading] = useState(true);

  // Al iniciar (o refrescar), cargá token y perfil
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setUser({ token });
      // Siempre traigo el perfil aunque esté en LS (así refresca)
      getProfile()
        .then(data => setUserData(data))
        .catch(() => setUserData(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Cuando el usuario hace login manual
  const login = async ({ email, password }) => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setUserData(null);
    const { token } = await apiLogin({ email, password });
    if (token) {
      localStorage.setItem('auth_token', token);
      setUser({ token });
      // Trae el perfil extendido
      const profile = await getProfile();
      setUserData(profile);
    } else {
      throw new Error('Login fallido');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, userData, setUserData, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

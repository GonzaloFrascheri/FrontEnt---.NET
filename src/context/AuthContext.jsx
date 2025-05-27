import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Leer el token desde localStorage si existe (persistencia al refrescar)
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Si querés, decodificá el token para sacar info del usuario, si no solo setear que está logueado
      setUser({ token });
    }
  }, []);

  const login = async (creds) => {
    localStorage.removeItem('auth_token'); // Limpia antes
    const token = await apiLogin(creds);
    if (token) {
      localStorage.setItem('auth_token', token);
      setUser({ token });
    } else {
      throw new Error('Login fallido');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

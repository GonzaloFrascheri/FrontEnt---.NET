// context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Opcional: puedes intentar recuperar sesión al montar
  useEffect(() => {
    // si tienes un endpoint tipo GET /api/auth/me para saber si hay sesión activa,
    // aquí podrías invocarlo y hacer setUser(res.data)…
  }, []);

  const login = async (creds) => {
    const userData = await apiLogin(creds);
    setUser(userData);
    // ya no guardamos token en localStorage
  };

  const logout = async () => {
    // asumiendo que tienes un endpoint /Logout si es necesario:
    // await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

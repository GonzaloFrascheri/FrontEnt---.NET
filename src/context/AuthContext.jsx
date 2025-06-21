import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, getUser } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Leer el token desde localStorage si existe (persistencia al refrescar)
    const token = localStorage.getItem('auth_token');
    const userDataStr = localStorage.getItem('user_data');

    if (token) {
      // Si querés, decodificá el token para sacar info del usuario, si no solo setear que está logueado
      setUser({ token });
    }

    if (userDataStr) {
      const data = JSON.parse(userDataStr);
      setUserData(data);
    }
  }, []);

  const login = async ({ email, password, tenantName }) => {
    // 1) Limpio cualquier token previo
    localStorage.removeItem('auth_token');

    const { token } = await apiLogin({ email, password, tenantName });
    if (token) {
      localStorage.setItem('auth_token', token);
      setUser({ token });
      return token;
    } else {
      throw new Error('Login fallido');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setUserData(null);
  };

  const getUserData = async () => {
    if (!userData) {
      const user = await getUser();
      setUserData(user.data);
      localStorage.setItem('user_data', JSON.stringify(user.data));
      return user.data;
    }

    return userData;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, getUserData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

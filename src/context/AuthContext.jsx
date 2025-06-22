import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, getUser } from '../services/api';

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
      getUserData();
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

  const refreshUserData = async () => {
    const user = await getUser();
    setUserData(user.data);
    localStorage.setItem('user_data', JSON.stringify(user.data));
  }

  return (
    <AuthContext.Provider value={{ user, setUser, getUserData, setUserData, login, logout, loading, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

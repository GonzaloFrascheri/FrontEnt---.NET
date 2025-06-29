import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, getUser } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // token y datos mínimos
  const [userData, setUserData] = useState(null); // datos extendidos: email, branchId, etc.
  const [loading, setLoading] = useState(true);

  // Al iniciar (o refrescar), cargá token y perfil
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const savedUserData = localStorage.getItem('user_data');

        if (token) {
          setUser({ token });

          if (savedUserData) {
            try {
              const parsedUserData = JSON.parse(savedUserData);
              setUserData(parsedUserData);
            } catch (error) {
              console.warn('Error parsing saved user data:', error);
            }
          }

          try {
            const freshUserData = await getUser();
            setUserData(freshUserData.data);
            localStorage.setItem('user_data', JSON.stringify(freshUserData.data));
          } catch (error) {
            console.warn('Error fetching fresh user data:', error);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const getProfile = async () => {
    const user = await getUser();
    return user.data;
  };

  const login = async ({ email, password }) => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
      setUserData(null);

      const { token } = await apiLogin({ email, password });
      if (token) {
        localStorage.setItem('auth_token', token);
        setUser({ token });

        // Cargar datos del usuario inmediatamente después del login
        const userData = await getUser();
        setUserData(userData.data);
        localStorage.setItem('user_data', JSON.stringify(userData.data));
      } else {
        throw new Error('Login fallido');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Login con token (para magic link)
  const loginWithToken = async ({ token }) => {
    try {
      localStorage.setItem('auth_token', token);
      setUser({ token });

      // Trae el perfil extendido
      const profile = await getProfile();
      setUserData(profile);
      localStorage.setItem('user_data', JSON.stringify(profile));
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
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
      try {
        const user = await getUser();
        setUserData(user.data);
        localStorage.setItem('user_data', JSON.stringify(user.data));
        return user.data;
      } catch (error) {
        console.error('Error getting user data:', error);
        throw error;
      }
    }
    return userData;
  }

  const refreshUserData = async () => {
    try {
      const user = await getUser();
      setUserData(user.data);
      localStorage.setItem('user_data', JSON.stringify(user.data));
      return user.data;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      setUser,
      refreshUserData,
      getUserData,
      setUserData,
      login,
      loginWithToken,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

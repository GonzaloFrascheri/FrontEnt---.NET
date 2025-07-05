import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, getUser, getGeneralParameters, setLogoutFunction } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenantParameters, setTenantParameters] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const loadTenantParameters = async () => {
    try {
      // Solo cargar parámetros si hay un token (usuario logueado)
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      
      const parameters = await getGeneralParameters();
      setTenantParameters(parameters);
      return parameters;
    } catch (error) {
      console.error('Error loading tenant parameters:', error);
      return null;
    }
  };

  // Efecto para monitorear cambios en loginSuccess
  useEffect(() => {
    if (loginSuccess) {
      console.log("AuthContext: loginSuccess changed to true");
    }
  }, [loginSuccess]);

  useEffect(() => {
    setLogoutFunction(logout);
    
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
          
          // Solo cargar parámetros si el usuario está logueado
          await loadTenantParameters();
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
      console.log("Login process started");
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
      setUserData(null);

      const { token } = await apiLogin({ email, password });
      if (token) {
        console.log("Login successful, setting token");
        localStorage.setItem('auth_token', token);
        setUser({ token });

        console.log("Fetching user data");
        const userData = await getUser();
        setUserData(userData.data);
        localStorage.setItem('user_data', JSON.stringify(userData.data));

        console.log("Loading tenant parameters");
        await loadTenantParameters();
        
        // Activar flag de login exitoso para notificar a otros contextos
        console.log("Setting loginSuccess flag to true");
        setLoginSuccess(true);
      } else {
        throw new Error('Login fallido');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithToken = async ({ token }) => {
    try {
      console.log("Login with token started");
      localStorage.setItem('auth_token', token);
      setUser({ token });

      console.log("Fetching user profile");
      const profile = await getProfile();
      setUserData(profile);
      localStorage.setItem('user_data', JSON.stringify(profile));

      // Recargar parámetros del tenant después del login
      console.log("Loading tenant parameters");
      await loadTenantParameters();
      
      // Activar flag de login exitoso para notificar a otros contextos
      console.log("Setting loginSuccess flag to true");
      setLoginSuccess(true);
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
    setTenantParameters(null);
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

  const refreshTenantParameters = async () => {
    return await loadTenantParameters();
  };

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
      loading,
      tenantParameters,
      refreshTenantParameters,
      loginSuccess,
      setLoginSuccess
    }}>
      {children}
    </AuthContext.Provider>
  );
}

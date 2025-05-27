// src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

// Firebase
import { auth, googleProvider } from '../services/firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';

// API
import { login as apiLogin } from '../services/api';

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

   // Recuperar token de localStorage al montar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async fbUser => {
      if (fbUser) {
        setUser({ email: fbUser.email, displayName: fbUser.displayName });
      } else {
        // Verificá si hay token guardado
        const token = localStorage.getItem('auth_token');
        if (token) {
          setUser({ token });
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 1) Login tradicional
  const login = async ({ email, password }) => {
    const data = await apiLogin({ email, password });
    if (data && data.token) {
      localStorage.setItem('auth_token', data.token);   // GUARDA el token
      setUser(data); // o setUser({ email: data.email, token: data.token })
    } else {
      throw new Error('Login fallido');
    }
    return data;
  };

  // 2) Login con Google (Firebase)
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    // Opcional: podrías llamar a tu backend para “login social”
    setUser({ email: fbUser.email, displayName: fbUser.displayName });
    return fbUser;
  };

  // 3) Logout (cerrar sesión en Firebase y limpiar estado)
  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    localStorage.removeItem('auth_token'); // BORRA el token
    navigate('/login', { replace: true });
  };

  // Hasta que no sepa si hay user o no, no renderices nada
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

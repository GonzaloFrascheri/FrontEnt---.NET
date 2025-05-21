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

  // Al montar, suscríbete al estado de sesión de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async fbUser => {
      if (fbUser) {
        // Si ya estás logueado con Google, podrías sincronizarlo con tu backend
        setUser({ email: fbUser.email, displayName: fbUser.displayName });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 1) Login tradicional contra tu endpoint /Login/Login
  const login = async ({ email, password }) => {
    // Llamas al endpoint REST
    const data = await apiLogin({ email, password });
    // data es lo que devuelve tu backend: { error:false, data:{ returnToken, email, ... } }
    setUser(data); 
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

import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/AuthForm';
import { AuthContext } from '../../context/AuthContext';
import { getMagicLink, googleLoginBackend } from '../../services/api';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../services/firebase';
import { TenantContext } from '../../context/TenantContext';

export default function LoginPage() {
  const { user, setUser, login: contextLogin } = useContext(AuthContext);
  const { tenantUIConfig, ensureTenantUIConfig, loading } = useContext(TenantContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Verificar que tenantUIConfig esté disponible
  useEffect(() => {
    if (!tenantUIConfig && !loading) {
      ensureTenantUIConfig();
    }
  }, [tenantUIConfig, loading, ensureTenantUIConfig]);

  // LOGIN INTERNO
  const handleEmailPassword = async ({ email, password }) => {
    setError('');
    try {
      await contextLogin({ email, password });
      navigate('/', { replace: true });
    } catch (err) {
      console.error("ERROR en login:", err);
      setError('Credenciales inválidas');
    }
  };

  // LOGIN CON GOOGLE
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();

      const data = await googleLoginBackend({
        idToken,
        email: fbUser.email,
        name: fbUser.displayName,
      });

      if (data && data.token) {
        localStorage.setItem('auth_token', data.token);
        setUser({ token: data.token, email: fbUser.email, name: fbUser.displayName });
        navigate('/', { replace: true });
      } else {
        setError('Login con Google fallido');
      }
    } catch (err) {
      console.error("Error al iniciar con Google", err);
      setError('Error al iniciar con Google');
    }
  };

  const handleMagicLinkLogin = async (email) => {
    await getMagicLink(email);
  }

  if (user) return <Navigate to="/" replace />;

  // Mostrar loading mientras se cargan los datos del tenant
  if (loading || !tenantUIConfig) {
    return (
      <div className="auth-card">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <AuthForm
        onSubmit={handleEmailPassword}
        googleLogin={handleGoogleLogin}
        magicLinkLogin={handleMagicLinkLogin}
        tenantUIConfig={tenantUIConfig}
      />
    </>
  );
}

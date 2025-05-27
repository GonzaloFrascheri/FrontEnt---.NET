// src/pages/login/LoginPage.jsx
import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/AuthForm';
import { AuthContext } from '../../context/AuthContext';

export default function LoginPage() {
  const { user, login, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleEmailPassword = async creds => {
    setError('');
    try {
      await login(creds);
       setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (err) {
      console.error(err);
      setError('Credenciales inválidas');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Error al iniciar con Google');
    }
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <AuthForm
        onSubmit={handleEmailPassword}
        googleLogin={handleGoogleLogin}
      />
    </>
  );
}

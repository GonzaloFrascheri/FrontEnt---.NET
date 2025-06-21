// src/pages/login/LoginPage.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/AuthForm';
import { AuthContext } from '../../context/AuthContext';
import { getTenants, login as apiLogin, googleLoginBackend } from '../../services/api';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../services/firebase';

export default function LoginPage() {
  const { user, setUser, login: contextLogin, loginWithGoogle } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState('');
  const navigate = useNavigate();
  console.log("tenants:", tenants)
  // 1) Carga lista de tenants al montar
  useEffect(() => {
    getTenants()
      .then(list => setTenants(list))
      .catch(console.error);
  }, []);

  const handleEmailPassword = async (obj) => {
  // 1. Log de lo que recibe el handler:
  console.log("LOGIN HANDLER recibió:", obj);

  // 2. Destructuramos explícitamente:
  const { email, password, tenantName } = obj;
  console.log("Desestructurado:", { email, password, tenantName });

  // 3. Validación:
  if (!tenantName) {
    setError('Por favor selecciona un tenant');
    console.warn("tenantName está vacío o undefined!");
    return;
  }
  setError('');

  // 4. Log justo antes del login real:
  console.log("Voy a llamar a contextLogin con:", { email, password, tenantName });

  try {
    // 5. Llama al login del contexto:
    await contextLogin({ email, password, tenantName });
    console.log("Login OK, navegando a home");
    navigate('/', { replace: true });
  } catch (err) {
    console.error("ERROR en login:", err);
    setError('Credenciales inválidas');
  }
};

  const handleGoogleLogin = async (tenantName) => {
    if (!tenantName) {
      setError('Por favor selecciona un tenant');
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();

      const data = await googleLoginBackend({
        idToken,
        email: fbUser.email,
        name: fbUser.displayName,
        tenantName, // <-- no se usa aquí, pero lo enviamos abajo
      }, tenantName);

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

  if (user) return <Navigate to="/" replace />;


  console.log("contextLogin:", contextLogin);
  
  return (
    <>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <AuthForm
        tenants={tenants}
        selectedTenant={selectedTenant}
        onTenantChange={setSelectedTenant}
        onSubmit={handleEmailPassword}
        googleLogin={() => handleGoogleLogin(selectedTenant)}
      />
    </>
  );
}

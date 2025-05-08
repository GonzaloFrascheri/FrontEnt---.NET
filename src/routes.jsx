// src/routes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import HomePage from './pages/HomePage';
import { AuthProvider } from './context/AuthProvider';
import { AuthContext } from './context/AuthContext';

// Un componente para rutas protegidas
function ProtectedRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
                {/* Aquí puedes agregar tu componente de HomePage o el que desees proteger */}
                <h1>Bienvenido a la página protegida</h1>
            </ProtectedRoute>
          }
        />
        {/* Ruta comodín para no encontrados: redirige al login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
}

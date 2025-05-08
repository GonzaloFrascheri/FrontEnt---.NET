// src/routes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/login/RegisterPage';
import HomePage from './pages/login/HomePage';
import RegisterTenantPage from './pages/tenant/RegisterTenantPage';
import RegisterStationPage from './pages/stations/RegisterStationPage';

import { AuthProvider } from './context/AuthProvider';
import { AuthContext } from './context/AuthContext';
import RegisterProductPage from './pages/products/RegisterProductPage';

// Componente para rutas protegidas
function ProtectedRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenants/nuevo"
          element={
            <ProtectedRoute>
              <RegisterTenantPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stations/nuevo"
          element={
            <ProtectedRoute>
              <RegisterStationPage/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/nuevo"
          element={
            <ProtectedRoute>
              <RegisterProductPage />
            </ProtectedRoute>
          }
        />
        {/* Comodín: redirige al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

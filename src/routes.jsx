// src/routes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import NavBar from './components/NavBar';

import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/login/RegisterPage';
import HomePage from './pages/login/HomePage';
import RegisterTenantPage from './pages/tenant/RegisterTenantPage';
import RegisterStationPage from './pages/stations/RegisterStationPage';
import RegisterProductPage from './pages/products/RegisterProductPage';
import UpdateFuelPricePage from './pages/fuel/UpdateFuelPricePage';
import RedeemPointsPage from './pages/points/RedeemPointsPage';
import VerifyIdentityPage from './pages/verifyAge/VerifyIdentityPage';

import { AuthProvider } from './context/AuthProvider';
import { AuthContext } from './context/AuthContext';
import ProtectedLayout from './components/ProtectedLayout';


// Componente para rutas protegidas
function ProtectedRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protegidas dentro de ProtectedLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          {/* La ruta índice (/) muestra HomePage */}
          <Route index element={<HomePage />} />
          <Route path="tenants/nuevo" element={<RegisterTenantPage />} />
          <Route path="stations/nuevo" element={<RegisterStationPage />} />
          <Route path="products/nuevo" element={<RegisterProductPage />} />
          <Route path="fuels/actualizar" element={<UpdateFuelPricePage />} />
          <Route path="redeem" element={<RedeemPointsPage />} />
          <Route path="verify" element={<VerifyIdentityPage />} />
        </Route>

        {/* Cualquier otro path vuelve al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

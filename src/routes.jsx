// src/routes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/login/RegisterPage';
import HomePage from './pages/login/HomePage';
import UpdateFuelPricePage from './pages/fuel/UpdateFuelPricePage';
import RedeemPointsPage from './pages/points/RedeemPointsPage';
import VerifyIdentityPage from './pages/verifyAge/VerifyIdentityPage';
import ProfilePage from './pages/login/ProfilePage';
import CatalogPage from './pages/catalog/CatalogPage';
import HistoryPage from './pages/history/HistoryPage';
import StationsMapPage from './pages/map/StationsMapPage';
import BalancePage from './pages/balance/BalancePage';

import { AuthProvider } from './context/AuthContext';
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
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="fuels/actualizar" element={<UpdateFuelPricePage />} />
          <Route path="redeem" element={<RedeemPointsPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="stations/map" element={<StationsMapPage />} />
          <Route path="balance" element={<BalancePage />} />
          <Route path="verify" element={<VerifyIdentityPage />} />
        </Route>

        {/* Cualquier otro path vuelve al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

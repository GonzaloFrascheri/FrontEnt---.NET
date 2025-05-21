// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import { PointsProvider } from './context/PointsContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>       {/* Asegúrate de que esto venga de AuthProvider.jsx */}
        <PointsProvider>   {/* Asegúrate de que esto venga de PointsContext.jsx */}
          <AppRoutes />
        </PointsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

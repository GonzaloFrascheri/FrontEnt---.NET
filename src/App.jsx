// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import { PointsProvider } from './context/PointsContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>       
        <PointsProvider>   
          <AppRoutes />
        </PointsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

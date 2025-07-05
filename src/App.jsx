// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';
import { LocationProvider } from './context/LocationContext';
import { useContext } from 'react';
import { TenantContext } from './context/TenantContext';
import TenantNotFound from './components/TenantNotFound';

// Componente interno que usa el contexto
function AppContent() {
  const { tenantExists, errorMessage, loading } = useContext(TenantContext);

  // Si está cargando, podríamos mostrar un spinner o nada
  if (loading) {
    return null; // O un componente de carga
  }

  // Si el tenant no existe, mostrar el componente de fallback
  if (!tenantExists) {
    return <TenantNotFound errorMessage={errorMessage} />;
  }

  // Si todo está bien, mostrar las rutas normales
  return (
    <LocationProvider>
      <AppRoutes />
      <ToastContainer />
    </LocationProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TenantProvider>
          <AppContent />
        </TenantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

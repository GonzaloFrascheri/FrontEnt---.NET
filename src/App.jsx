// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';
import { LocationProvider } from './context/LocationContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TenantProvider>
          <LocationProvider>
            <AppRoutes />
            <ToastContainer />
          </LocationProvider>
        </TenantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

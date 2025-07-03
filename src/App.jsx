// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TenantProvider>
          <AppRoutes />
          <ToastContainer />
        </TenantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

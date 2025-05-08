// src/pages/HomePage.jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">
        Bienvenido a ServiPuntos, {user.nombre || user.email}
      </h2>

      {/* Menú de acciones disponibles */}
      <nav className="auth-card__menu" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link to="/tenants/nuevo" className="auth-card__button">
          Alta de Tenant
        </Link>
        <Link to="/tenants/nuevo" className="auth-card__button">
          Alta de Producto
        </Link>
        <Link to="/tenants/nuevo" className="auth-card__button">
          Alta de Estación
        </Link>
        <Link to="/tenants/nuevo" className="auth-card__button">
          Verificación de edad e identidad
        </Link>
        <Link to="/tenants/nuevo" className="auth-card__button">
          Canje de puntos
        </Link>
        <Link to="/tenants/nuevo" className="auth-card__button">
          Actualización precio del combustible
        </Link>
        {/* Aquí puedes agregar más enlaces de administración */}
      </nav>

      <button
        onClick={logout}
        className="auth-card__button"
        style={{ backgroundColor: '#d32f2f', marginTop: '0' }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
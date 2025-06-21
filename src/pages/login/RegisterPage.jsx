import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, getTenants } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    
    try {
      const res = await register(form); // asume que el backend acepta tenantName
      if (res.error) {
        setError(res.message || 'No se pudo registrar');
        return;
      }
      if (res.data && res.data.token) {
        localStorage.setItem('auth_token', res.data.token);
        setUser?.({ token: res.data.token, email: form.email, name: form.name });
        setSuccess('¡Registro exitoso! Redirigiendo...');
        setTimeout(() => navigate('/', { replace: true }), 1200);
      } else {
        setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setTimeout(() => navigate('/login', { replace: true }), 1200);
      }
    } catch (err) {
      setError(err.message || 'Error en el registro');
      console.error('Error en el registro:', err);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">Regístrate</h2>
      <form onSubmit={handleSubmit} className="auth-card__form">
        <label className="auth-card__label">
          <input
            name="name"
            type="text"
            className="auth-card__input"
            placeholder='Nombre'
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className="auth-card__label">
          <input
            name="email"
            type="email"
            className="auth-card__input"
            placeholder='Email'
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label className="auth-card__label">
          <input
            name="password"
            type="password"
            className="auth-card__input"
            placeholder='Contraseña'
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className="auth-card__button">
          Crear cuenta
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && <div className="alert alert-success mt-3">{success}</div>}
      </form>
    </div>
  );
}

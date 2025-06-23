import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Alert, Spinner } from 'react-bootstrap';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await register(form);
      if (res.error) {
        setError(res.message || 'No se pudo registrar');
        setLoading(false);
        return;
      }
      if (res.data && res.data.token) {
        // Login automático si hay token
        localStorage.setItem('auth_token', res.data.token);
        setUser?.({ token: res.data.token, email: form.email, name: form.name });
        setSuccess('¡Registro exitoso! Redirigiendo...');
        setTimeout(() => navigate('/', { replace: true }), 1200);
      } else {
        setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      }
    } catch (err) {
      setError(err.message || 'Error en el registro');
    }
    setLoading(false);
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
        <button type="submit" className="auth-card__button" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Crear cuenta"}
        </button>
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="auth-card__link">
            Inicia sesión
          </Link>
        </p>
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {success && <Alert variant="success" className="mt-3">{success}</Alert>}
      </form>
    </div>
  );
}

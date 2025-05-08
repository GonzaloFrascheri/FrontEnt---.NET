import { useState, useContext } from 'react';
import { verifyIdentity } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function VerifyIdentityPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: user.nombre || '', documento: '', fechaNacimiento: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      // Llama al endpoint de verificación de identidad
      await verifyIdentity(form);
      setSuccess('Verificación exitosa. Ahora puedes canjear productos con restricción.');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error en verificación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">Verificación de Edad e Identidad</h2>
      <p>Para acceder a productos con restricción de edad, debes verificar tu identidad:</p>
      <form onSubmit={handleSubmit} className="auth-card__form">
        {error   && <p className="auth-card__error">{error}</p>}
        {success && <p className="auth-card__info">{success}</p>}

        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          className="auth-card__input"
          value={form.nombre}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <input
          type="text"
          name="documento"
          placeholder="Número de documento"
          className="auth-card__input"
          value={form.documento}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <input
          type="date"
          name="fechaNacimiento"
          placeholder="Fecha de nacimiento"
          className="auth-card__input"
          value={form.fechaNacimiento}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <button
          type="submit"
          className="auth-card__button"
          disabled={loading}
        >
          {loading ? 'Verificando…' : 'Verificar identidad'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        Si deseas, revisa el <a href="https://dnic.example.com" target="_blank" rel="noopener noreferrer">servicio de verificación DNIC</a>.
      </p>
      <hr />
      <Link to="/" className='back-link' style={{ marginTop: '1rem' }}>
        Volver al menú
      </Link>
    </div>
  );
}

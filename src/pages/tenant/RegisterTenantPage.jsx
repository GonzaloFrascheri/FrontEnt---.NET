import { useState, useContext } from 'react';
import { createTenant } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function RegisterTenantPage() {
  const { user } = useContext(AuthContext);  // opcional, para mostrar quién crea
  const [nombre, setNombre]   = useState('');
  const [dominio, setDominio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    try {
      const tenant = await createTenant({ nombre, dominio });
      setSuccess(`Tenant "${tenant.nombre}" creado con dominio ${tenant.dominio}`);
      setNombre(''); setDominio('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">Alta de Tenant</h2>

      <form onSubmit={handleSubmit} className="auth-card__form">
        {error   && <p className="auth-card__error">{error}</p>}
        {success && <p className="auth-card__info">{success}</p>}

        <input
          type="text"
          placeholder="Nombre de la cadena"
          className="auth-card__input"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          disabled={loading}
          required
        />

        <input
          type="text"
          placeholder="Dominio (ej: mi-cadena.servipuntos.uy)"
          className="auth-card__input"
          value={dominio}
          onChange={e => setDominio(e.target.value)}
          disabled={loading}
          required
        />

        <button
          type="submit"
          className="auth-card__button"
          disabled={loading}
        >
          {loading ? 'Creando…' : 'Crear Tenant'}
        </button>
        <Link to="/" className='back-link' style={{ marginTop: '1rem' }}>
          Volver al menú
        </Link>
      </form>
    </div>
  );
}

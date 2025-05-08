import { useState, useEffect, useContext } from 'react';
import { createProduct } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function RegisterProductPage() {
  const { user } = useContext(AuthContext);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({ tenantId: '', nombre: '', precio: '', requiereVEAI: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // TODO: Obtener la lista de tenants reales desde tu API
    setTenants([
      { id: 't1', nombre: 'Cadena A' },
      { id: 't2', nombre: 'Cadena B' }
    ]);
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const precioFloat = parseFloat(form.precio);
      if (isNaN(precioFloat)) throw new Error('Precio debe ser un número');
      const product = await createProduct({
        tenantId: form.tenantId,
        nombre: form.nombre,
        precio: precioFloat,
        requiereVEAI: form.requiereVEAI
      });
      setSuccess(`Producto "${product.nombre}" creado con éxito.`);
      setForm({ tenantId: '', nombre: '', precio: '', requiereVEAI: false });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">Alta de Producto</h2>
      <form onSubmit={handleSubmit} className="auth-card__form">
        {error && <p className="auth-card__error">{error}</p>}
        {success && <p className="auth-card__info">{success}</p>}

        <select
          name="tenantId"
          value={form.tenantId}
          onChange={handleChange}
          disabled={loading}
          required
          className="auth-card__input"
        >
          <option value="">Selecciona un tenant</option>
          {tenants.map(t => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          className="auth-card__input"
          value={form.nombre}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <input
          type="text"
          name="precio"
          placeholder="Precio"
          className="auth-card__input"
          value={form.precio}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <label className="auth-card__label-checkbox">
          <input
            type="checkbox"
            name="requiereVEAI"
            checked={form.requiereVEAI}
            onChange={handleChange}
            disabled={loading}
          />
          Requiere VEAI
        </label>

        <button
          type="submit"
          className="auth-card__button"
          disabled={loading}
        >
          {loading ? 'Creando…' : 'Crear Producto'}
        </button>
      </form>

      <Link to="/" className='back-link' style={{ marginTop: '1rem' }}>
        Volver al menú
      </Link>
    </div>
  );
}

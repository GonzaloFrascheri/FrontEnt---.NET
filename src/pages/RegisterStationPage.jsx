import { useState, useContext, useEffect } from 'react';
import { createStation } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function RegisterStationPage() {
  const { user, logout } = useContext(AuthContext);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({
    tenantId: '',
    nombre: '',
    direccion: '',
    estado: 'activo',
    servicios: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  // TODO: en el futuro, cargar tenants desde tu API:
  useEffect(() => {
    // hasta then, un mock
    setTenants([{ id: 't1', nombre: 'Cadena A' }, { id: 't2', nombre: 'Cadena B' }]);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const serviciosArray = form.servicios.split(',').map(s => s.trim());
      const station = await createStation({ ...form, servicios: serviciosArray });
      setSuccess(`Estación "${station.nombre}" creada.`);
      setForm(prev => ({ ...prev, nombre:'', direccion:'', servicios:'' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear estación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">Alta de Estación</h2>

      <form onSubmit={handleSubmit} className="auth-card__form">
        {error   && <p className="auth-card__error">{error}</p>}
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
          placeholder="Nombre de la estación"
          className="auth-card__input"
          value={form.nombre}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          className="auth-card__input"
          value={form.direccion}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          disabled={loading}
          className="auth-card__input"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <input
          type="text"
          name="servicios"
          placeholder="Servicios (separados por coma)"
          className="auth-card__input"
          value={form.servicios}
          onChange={handleChange}
          disabled={loading}
        />

        <button
          type="submit"
          className="auth-card__button"
          disabled={loading}
        >
          {loading ? 'Creando…' : 'Crear Estación'}
        </button>
      </form>
    </div>
  );
}

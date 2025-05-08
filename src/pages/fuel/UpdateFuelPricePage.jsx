import { useState, useEffect, useContext } from 'react';
import { updateFuelPrice } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function UpdateFuelPricePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [fuels, setFuels]       = useState([]);
  const [selectedFuel, setSelectedFuel] = useState(null);
  const [nuevoPrecio, setNuevoPrecio]   = useState('');
  const [loading, setLoading]    = useState(false);
  const [error, setError]        = useState('');
  const [success, setSuccess]    = useState('');

  useEffect(() => {
    // TODO: cargar lista real de combustibles desde la API
    setFuels([
      { id: 'gasoil', nombre: 'Gasoil', precio: 1.23 },
      { id: 'nafta95', nombre: 'Nafta 95', precio: 1.45 },
      // …
    ]);
  }, []);

  const handleSelect = e => {
    const fuel = fuels.find(f => f.id === e.target.value);
    setSelectedFuel(fuel);
    setNuevoPrecio(fuel?.precio ?? '');
    setError(''); setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedFuel) return setError('Selecciona un combustible');
    const precioFloat = parseFloat(nuevoPrecio);
    if (isNaN(precioFloat)) return setError('Precio inválido');

    setLoading(true); setError(''); setSuccess('');
    try {
      await updateFuelPrice({ productId: selectedFuel.id, nuevoPrecio: precioFloat });
      setSuccess(`Precio de ${selectedFuel.nombre} actualizado a ${precioFloat}`);
      // opcional: navegar de vuelta tras unos segundos
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar precio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">Actualizar Precio de Combustible</h2>
      <form onSubmit={handleSubmit} className="auth-card__form">
        {error   && <p className="auth-card__error">{error}</p>}
        {success && <p className="auth-card__info">{success}</p>}

        <select
          value={selectedFuel?.id || ''}
          onChange={handleSelect}
          disabled={loading}
          required
          className="auth-card__input"
        >
          <option value="">Selecciona combustible</option>
          {fuels.map(f => (
            <option key={f.id} value={f.id}>
              {f.nombre} (precio: {f.precio})
            </option>
          ))}
        </select>

        {selectedFuel && (
          <>
            <input
              type="text"
              placeholder="Nuevo precio"
              className="auth-card__input"
              value={nuevoPrecio}
              onChange={e => setNuevoPrecio(e.target.value)}
              disabled={loading}
              required
            />
          </>
        )}

        <button
          type="submit"
          className="auth-card__button"
          disabled={loading}
        >
          {loading ? 'Actualizando…' : 'Aceptar'}
        </button>
      </form>

      <Link to="/" className='back-link' style={{ marginTop: '1rem' }}>
        Volver al menú
      </Link>
    </div>
  );
}

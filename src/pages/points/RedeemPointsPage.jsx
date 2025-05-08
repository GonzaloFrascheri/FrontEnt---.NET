import { useState, useEffect, useContext } from 'react';
import { getCatalog, redeemProduct } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function RedeemPointsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [catalog, setCatalog] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // TODO: reemplazar por llamada real a getCatalog()
    // getCatalog().then(data => setCatalog(data));
    setCatalog([
      { id: 'p1', nombre: 'Producto A', costoPuntos: 100, edadMinima: 18 },
      { id: 'p2', nombre: 'Producto B', costoPuntos: 500, edadMinima: 21 }
    ]);
    // TODO: obtener puntos reales del usuario
    setUserPoints(user?.puntos || 0);
  }, [user]);

  const handleSelect = e => {
    const id = e.target.value;
    setSelectedId(id);
    const prod = catalog.find(item => item.id === id) || null;
    setSelectedProduct(prod);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedProduct) {
      setError('Selecciona un producto.');
      return;
    }
    if (userPoints < selectedProduct.costoPuntos) {
      setError('Puntos insuficientes.');
      return;
    }
    if (selectedProduct.edadMinima && user.edad < selectedProduct.edadMinima) {
      setError('No cumple edad mínima.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await redeemProduct({ productId: selectedProduct.id });
      setSuccess(`Has canjeado ${selectedProduct.nombre}.`);
      setUserPoints(prev => prev - selectedProduct.costoPuntos);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al canjear.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">Canje de Puntos</h2>
      <p>Tienes <strong>{userPoints}</strong> puntos disponibles.</p>

      <form onSubmit={handleSubmit} className="auth-card__form">
        {error && <p className="auth-card__error">{error}</p>}
        {success && <p className="auth-card__info">{success}</p>}

        <select
          value={selectedId}
          onChange={handleSelect}
          disabled={loading}
          className="auth-card__input"
          required
        >
          <option value="">Selecciona un producto</option>
          {catalog.map(item => (
            <option key={item.id} value={item.id}>
              {item.nombre} - {item.costoPuntos} pts
            </option>
          ))}
        </select>

        {selectedProduct && (
          <p>Edad mínima: {selectedProduct.edadMinima}</p>
        )}

        <button
          type="submit"
          className="auth-card__button"
          disabled={loading}
        >
          {loading ? 'Procesando…' : 'Confirmar canje'}
        </button>
      </form>

      <Link to="/" className='back-link' style={{ marginTop: '1rem' }}>
        Volver al menú
      </Link>
    </div>
  );
}
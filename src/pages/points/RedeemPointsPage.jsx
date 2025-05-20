// src/pages/points/RedeemPointsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { getCatalog, redeemProduct } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';

export default function RedeemPointsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [catalog, setCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userPoints, setUserPoints] = useState(user?.puntos || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLoadingCatalog(true);
    getCatalog()
      .then(data => setCatalog(data))
      .catch(() => setError('No se pudo cargar el catálogo de productos.'))
      .finally(() => setLoadingCatalog(false));

    // Inicializa puntos desde el contexto
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
      setSuccess(`Has canjeado "${selectedProduct.nombre}".`);
      setUserPoints(prev => prev - selectedProduct.costoPuntos);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al canjear.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="card" style={{ maxWidth: 400, width: '100%' }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">Canje de Puntos</h4>
          <p className="text-center mb-3">
            Tienes <strong>{userPoints}</strong> puntos disponibles.
          </p>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="selectProduct" className="form-label">
                Selecciona un producto
              </label>
              {loadingCatalog ? (
                <div className="text-center py-2">
                  <Spinner animation="border" size="sm" /> Cargando…
                </div>
              ) : (
                <select
                  id="selectProduct"
                  className="form-select"
                  value={selectedId}
                  onChange={handleSelect}
                  disabled={loading}
                  required
                >
                  <option value="">Seleccionar</option>
                  {catalog.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.nombre} — {item.costoPuntos} pts
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedProduct && (
              <p className="mb-3">
                <small className="text-muted">
                  Edad mínima: {selectedProduct.edadMinima}
                </small>
              </p>
            )}

            <div className="d-grid mb-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || loadingCatalog}
              >
                {loading ? 'Procesando…' : 'Confirmar canje'}
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link to="/" className="link-secondary">
              Volver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

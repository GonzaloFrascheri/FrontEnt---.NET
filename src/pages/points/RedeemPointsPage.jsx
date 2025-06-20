// src/pages/points/RedeemPointsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { Button, Spinner, Alert, Form } from 'react-bootstrap';

export default function RedeemPointsPage() {
  const { user, userData } = useContext(AuthContext);

  const [catalog, setCatalog]         = useState([]);
  const [selectedId, setSelectedId]   = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [qrValue, setQrValue]         = useState('');

  useEffect(() => {
    // Mock: reemplazar por getCatalog()
    setCatalog([
      { id: 'p1', nombre: 'Café A', costoPuntos: 200, edadMinima: 0 },
      { id: 'p2', nombre: 'Combustible 50%', costoPuntos: 500, edadMinima: 18 },
      { id: 'p3', nombre: 'Merchandising', costoPuntos: 500, edadMinima: 0 },
    ]);
  }, []);

  const handleSelect = e => {
    const id = e.target.value;
    setSelectedId(id);
    setSelectedProduct(catalog.find(p => p.id === id) || null);
    setError('');
    setQrValue('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedProduct) {
      setError('Selecciona un producto.');
      return;
    }
    if (userData.pointBalance < selectedProduct.costoPuntos) {
      setError('Puntos insuficientes.');
      return;
    }

    setLoading(true);
    try {
      // TODO: aquí llama realmente a redeemProduct({ productId })
      // const { token } = await redeemProduct({ productId: selectedProduct.id });
      // setQrValue(token);

      // Mock:
      const fakePayload = {
        user: user.email,
        product: selectedProduct.id,
        ts: Date.now()
      };
      setQrValue(JSON.stringify(fakePayload));
      setError('');
    } catch {
      setError('Error al canjear.');
    } finally {
      setLoading(false);
    }
  };

  if (qrValue) {
    return (
      <div className="text-center py-5">
        <h4 className="mb-4">¡Canje confirmado!</h4>
        <p>Escanea este código en tu estación para validar tu oferta:</p>
        <div className="d-inline-block p-3 bg-white shadow-sm">
          <QRCode value={qrValue} size={256} />
        </div>
        <div className="d-inline-block p-3 bg-white shadow-sm">
            <QRCodeCanvas
              value={qrValue}
              size={256}
            />
          </div>
        <div className="mt-4">
          <Button as={Link} to="/" variant="secondary">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="card" style={{ maxWidth: 400, width: '100%' }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">Canje de Puntos</h4>
          <p className="text-center mb-3">
            Tienes <strong>{userData.pointBalance}</strong> puntos disponibles.
          </p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Selecciona un producto</Form.Label>
              <Form.Select
                value={selectedId}
                onChange={handleSelect}
                disabled={loading}
                required
              >
                <option value="">-- Seleccionar --</option>
                {catalog.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.nombre} — {item.costoPuntos} pts
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-grid mb-3">
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Confirmar canje'}
              </Button>
            </div>
          </Form>

          <div className="text-center">
            <Link to="/">Volver</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useContext } from 'react';
import { updateFuelPrice } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Col, Card, Form, Button, Alert } from 'react-bootstrap';

export default function UpdateFuelPricePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [fuels, setFuels] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState(null);
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // TODO: cargar lista real de combustibles desde la API
    setFuels([
      { id: 'gasoil', nombre: 'Gasoil', precio: 1.23 },
      { id: 'nafta95', nombre: 'Nafta 95', precio: 1.45 },
      // …
    ]);
  }, []);

  const handleSelect = e => {
    const fuel = fuels.find(f => f.id === e.target.value) || null;
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
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar precio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Col xs={12} sm={10} md={8} lg={6}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-center mb-4">
              Actualizar Precio de Combustible
            </Card.Title>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="selectFuel">
                <Form.Label>Selecciona combustible</Form.Label>
                <Form.Select
                  value={selectedFuel?.id || ''}
                  onChange={handleSelect}
                  disabled={loading}
                  required
                >
                  <option value="">-- elige uno --</option>
                  {fuels.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.nombre} (precio: {f.precio})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {selectedFuel && (
                <Form.Group className="mb-4" controlId="inputNuevoPrecio">
                  <Form.Label>Nuevo precio</Form.Label>
                  <Form.Control
                    type="text"
                    value={nuevoPrecio}
                    onChange={e => setNuevoPrecio(e.target.value)}
                    disabled={loading}
                    required
                  />
                </Form.Group>
              )}

              <div className="d-grid mb-3">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Actualizando…' : 'Aceptar'}
                </Button>
              </div>
            </Form>

            <div className="text-center">
              <Link to="/" className="link-secondary">
                Volver al menú
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
}
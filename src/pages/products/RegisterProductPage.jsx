// src/pages/products/RegisterProductPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { createProduct } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Container,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Row
} from 'react-bootstrap';

export default function RegisterProductPage() {
  const { user } = useContext(AuthContext);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({
    tenantId: '',
    nombre: '',
    precio: '',
    requiereVEAI: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // TODO: obtener tenants reales desde tu API
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
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Col xs={12} sm={10} md={8} lg={6}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-center mb-4">
              Alta de Producto
            </Card.Title>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="selectTenant">
                <Form.Label>Selecciona un tenant</Form.Label>
                <Form.Select
                  name="tenantId"
                  value={form.tenantId}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <option value="">Seleccionar</option>
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="inputNombre">
                <Form.Label>Nombre del producto</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  placeholder="Ej: Café Premium"
                  value={form.nombre}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="inputPrecio">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="text"
                  name="precio"
                  placeholder="Ej: 1.23"
                  value={form.precio}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="checkboxVEAI">
                <Form.Check
                  type="checkbox"
                  name="requiereVEAI"
                  label="Requiere VEAI"
                  checked={form.requiereVEAI}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Form.Group>

              <div className="d-grid mb-3">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Creando…' : 'Crear Producto'}
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

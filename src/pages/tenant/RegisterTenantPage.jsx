// src/pages/tenant/RegisterTenantPage.jsx
import React, { useState, useContext } from 'react';
import {
  Container,
  Col,
  Card,
  Form,
  Button,
  Alert
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { createTenant } from '../../services/api';

export default function RegisterTenantPage() {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({ name: '', tenantId: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  // Regex que valida sólo letras (A–Z, a–z)
  const tenantIdRegex = /^[A-Za-z]+$/;

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Validación básica de tenantId
    if (!tenantIdRegex.test(form.tenantId)) {
      setError('El Tenant ID sólo puede contener letras (A–Z).');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // El backend ignora el id que envías y asigna uno nuevo
      const created = await createTenant({ name: form.name, tenantId: form.tenantId });
      setSuccess(`Cadena "${created.name}" creada con ID ${created.id}.`);
      setForm({ name: '', tenantId: '' });
    } catch (err) {
      setError(
        err.response?.data ||
        err.message ||
        'Error al crear la cadena'
      );
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
              Alta de Cadena (Tenant)
            </Card.Title>

            {error   && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Nombre */}
              <Form.Group className="mb-3" controlId="inputName">
                <Form.Label>Nombre de la cadena</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Ej: Mi Cadena"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </Form.Group>

              {/* Tenant ID */}
              <Form.Group className="mb-4" controlId="inputTenantId">
                <Form.Label>Tenant ID (sólo letras)</Form.Label>
                <Form.Control
                  type="text"
                  name="tenantId"
                  placeholder="Ej: MiCadena"
                  value={form.tenantId}
                  onChange={handleChange}
                  disabled={loading}
                  isInvalid={form.tenantId !== '' && !tenantIdRegex.test(form.tenantId)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Sólo letras (A–Z), sin espacios ni números.
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid mb-3">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Creando…' : 'Crear Cadena'}
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

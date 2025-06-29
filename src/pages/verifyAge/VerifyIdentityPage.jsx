
// src/pages/verifyAge/VerifyIdentityPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { verifyIdentity } from '../../services/api';
import { TenantContext } from '../../context/TenantContext';
import { AuthContext } from '../../context/AuthContext';

export default function VerifyIdentityPage() {
  const { tenantUIConfig } = useContext(TenantContext);
  const { userData } = useContext(AuthContext);

  const navigate = useNavigate();
  const [form, setForm] = useState({
    documentNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await verifyIdentity(form.documentNumber);
      setSuccess('Verificación exitosa.');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error en verificación.');
    } finally {
      setLoading(false);
    }
  };

  if (userData?.isVerified) {
    return (
      <Container className="d-flex justify-content-center align-items-center py-5">
        <Col xs={12} sm={8} md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-4" style={{ color: tenantUIConfig?.primaryColor }}>
              🧍🏻 Ya realizaste la verificación de edad e identidad
              </Card.Title>
              <Card.Text className="text-center">
                <a href="/" className="btn btn-primary" style={{ backgroundColor: tenantUIConfig?.primaryColor }}>Volver a la página principal</a>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Col xs={12} sm={8} md={6} lg={5}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-center mb-4" style={{ color: tenantUIConfig?.primaryColor }}>
              Verificación de Edad e Identidad
            </Card.Title>
            <Card.Text className="mb-4">
              Para acceder a productos con restricción de edad, debes verificar tu identidad:
            </Card.Text>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
             <Form.Group className="mb-3" controlId="inputDocumento">
              <Form.Label>Número de documento</Form.Label>
              <Form.Control
                type="text"
                name="documentNumber"
                value={form.documentNumber}
                onChange={handleChange}
                disabled={loading}
                required
              />

            </Form.Group>
              <div className="d-grid mb-3">
                <Button style={{ backgroundColor: tenantUIConfig?.primaryColor }} type="submit" disabled={loading}>
                  {loading ? 'Verificando…' : 'Verificar identidad'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
}

// src/pages/verifyAge/VerifyIdentityPage.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { verifyIdentity } from '../../services/api';

export default function VerifyIdentityPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    NroDocumento: '',
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
      await verifyIdentity(form);
      setSuccess('Verificación exitosa. Ahora puedes canjear productos con restricción.');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error en verificación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Col xs={12} sm={8} md={6} lg={5}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-center mb-4">
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
                name="NroDocumento"
                value={form.NroDocumento}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </Form.Group>
              <div className="d-grid mb-3">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Verificando…' : 'Verificar identidad'}
                </Button>
              </div>
            </Form>

            <div className="mb-3">
              <a
                href="https://dnic.example.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Revisar servicio de verificación DNIC
              </a>
            </div>
            <hr />
            <div className="text-center">
              <Link to="/" className="link-secondary">
                Volver
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
}

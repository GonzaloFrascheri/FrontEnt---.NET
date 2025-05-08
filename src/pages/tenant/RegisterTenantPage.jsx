// src/pages/tenant/RegisterTenantPage.jsx
import React, { useState, useContext } from 'react';
import { createTenant } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

export default function RegisterTenantPage() {
  const { user } = useContext(AuthContext); // opcional, para mostrar quién crea
  const [nombre, setNombre] = useState('');
  const [dominio, setDominio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const tenant = await createTenant({ nombre, dominio });
      setSuccess(`Tenant "${tenant.nombre}" creado con dominio ${tenant.dominio}`);
      setNombre('');
      setDominio('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear tenant');
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
              Alta de Tenant
            </Card.Title>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="inputNombre">
                <Form.Label>Nombre de la cadena</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Mi Cadena"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  disabled={loading}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="inputDominio">
                <Form.Label>Dominio</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="mi-cadena.servipuntos.uy"
                  value={dominio}
                  onChange={e => setDominio(e.target.value)}
                  disabled={loading}
                  required
                />
              </Form.Group>

              <div className="d-grid mb-3">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Creando…' : 'Crear Tenant'}
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

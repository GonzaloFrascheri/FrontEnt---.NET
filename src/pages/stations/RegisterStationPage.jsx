// src/pages/stations/RegisterStationPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { createStation } from '../../services/api';
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

export default function RegisterStationPage() {
  const { user } = useContext(AuthContext);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({
    tenantId: '',
    nombre: '',
    direccion: '',
    estado: 'activo',
    servicios: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // TODO: reemplazar con fetch real de tenants
    setTenants([
      { id: 't1', nombre: 'Cadena A' },
      { id: 't2', nombre: 'Cadena B' }
    ]);
  }, []);

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
      const serviciosArray = form.servicios
        ? form.servicios.split(',').map(s => s.trim())
        : [];
      const station = await createStation({
        tenantId: form.tenantId,
        nombre: form.nombre,
        direccion: form.direccion,
        estado: form.estado,
        servicios: serviciosArray
      });
      setSuccess(`Estación "${station.nombre}" creada con éxito.`);
      setForm({ ...form, nombre: '', direccion: '', servicios: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear estación');
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
              Alta de Estación
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
                <Form.Label>Nombre de la estación</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  placeholder="Ej: Estación Central"
                  value={form.nombre}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="inputDireccion">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  placeholder="Ej: Calle Falsa 123"
                  value={form.direccion}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="selectEstado">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4" controlId="inputServicios">
                <Form.Label>Servicios (separados por coma)</Form.Label>
                <Form.Control
                  type="text"
                  name="servicios"
                  placeholder="Ej: tienda,lavado"
                  value={form.servicios}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Form.Group>

              <div className="d-grid mb-3">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Creando…' : 'Crear Estación'}
                </Button>
              </div>
            </Form>

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

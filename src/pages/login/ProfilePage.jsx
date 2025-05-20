import React, { useState, useEffect, useContext }  from "react";
import { getProfile, updateProfile } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import {  
    Container,
    Col,
    Card,
    Form,
    Button,
    Alert,
    Spinner
} from "react-bootstrap";

export default function ProfilePage() {
    const { user, setUser } = useContext(AuthContext);
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
    // carga inicial de los datos del perfil
        getProfile()
            .then(data => {
                setForm({
                    nombre: data.nombre || '',
                    apellido: data.apellido || '',
                    email: data.email || '',
                    password: "",
                });
            })
            .catch(() => setError("No se pudieron cargar los datos del perfil"))
            .finally(() => setLoading(false));
    }, []);

   const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = await updateProfile(form);
      setSuccess('Perfil actualizado correctamente');
      // opcional: actualizar contexto global
      setUser(u => ({ ...u, nombre: updated.nombre, apellido: updated.apellido, email: updated.email }));
    } catch (err) {
      setError(err.response?.data || 'Error al actualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Spinner animation="border" />
    </Container>
  );

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Col xs={12} sm={10} md={8} lg={6}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-center mb-4">Mi Perfil</Card.Title>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="inputNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="inputApellido">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="inputEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="inputPassword">
                <Form.Label>Contraseña (opcional)</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Dejar vacío para no cambiar"
                  value={form.password}
                  onChange={handleChange}
                  disabled={saving}
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={saving}>
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
}
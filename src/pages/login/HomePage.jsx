// src/pages/HomePage.jsx
import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

export default function HomePage() {
  const { user, logout } = useContext(AuthContext);

  const actions = [
    { title: 'Alta de Tenant', link: '/tenants/nuevo', variant: 'primary' },
    { title: 'Alta de Producto', link: '/products/nuevo', variant: 'info' },
    { title: 'Alta de Estación', link: '/stations/nuevo', variant: 'success' },
    { title: 'Verificación VEAI', link: '/verify', variant: 'warning' },
    { title: 'Canje de Puntos', link: '/redeem', variant: 'secondary' },
    { title: 'Actualización precio del combustible', link: '/fuels/actualizar', variant: 'secondary' },
  ];

  return (
    <Container className="py-4">
      {/* Encabezado */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0">Bienvenido a ServiPuntos</h2>
        </Col>
      </Row>

      {/* Grid de accciones */}
      <Row xs={1} sm={2} md={3} lg={3} className="g-4 mb-5">
        {actions.map(({ title, link, variant }) => (
          <Col key={link}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title>{title}</Card.Title>
                <Button 
                  href={link} 
                  variant={variant} 
                  className="mt-3"
                >
                  Ir
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Sección de promociones */}
      <section className="mb-5">
        <h3 className="mb-3">Promociones Destacadas</h3>
        <Row xs={1} md={2} lg={3} className="g-4">
          {/* Ejemplo de tarjeta de promoción */}
          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Café Gratis</Card.Title>
                <Card.Text>Canjea 200 puntos por un café</Card.Text>
                <Button variant="outline-primary" href="/redeem">
                  Canjear ahora
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>50% Combustible</Card.Title>
                <Card.Text>Mitad de precio en nafta 95</Card.Text>
                <Button variant="outline-primary" href="/redeem">
                  Canjear ahora
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Merchandising</Card.Title>
                <Card.Text>Artículos por 500 puntos</Card.Text>
                <Button variant="outline-primary" href="/redeem">
                  Canjear ahora
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
}

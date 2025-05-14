// src/pages/login/HomePage.jsx
import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { CupHotFill ,FuelPumpFill, GiftFill } from 'react-bootstrap-icons';

export default function HomePage() {
  const { user } = useContext(AuthContext);

  // Tus acciones del dashboard (ya sin el carrusel)
  const actions = [
    { title: 'Alta de Tenant',     link: '/tenants/nuevo',  variant: 'secondary' },
    { title: 'Alta de Producto',   link: '/products/nuevo', variant: 'secondary'    },
    { title: 'Alta de Estación',   link: '/stations/nuevo', variant: 'secondary' },
    { title: 'Verificación VEAI',  link: '/verify',         variant: 'secondary' },
    { title: 'Canje de Puntos',    link: '/redeem',         variant: 'secondary' },
    { title: 'Actualizar Precio',  link: '/fuels/actualizar', variant: 'secondary' },
  ];

  // Las promociones con su icono
  const promotions = [
    {
      icon: <CupHotFill size={48} className="text-warning mb-3"/>,
      title: 'Café Gratis',
      description: 'Canjea 200 puntos por un café',
      link: '/redeem'
    },
    {
      icon: <FuelPumpFill size={48} className="text-danger mb-3"/>,
      title: '50% Combustible',
      description: 'Mitad de precio en nafta 95',
      link: '/redeem'
    },
    {
      icon: <GiftFill size={48} className="text-success mb-3"/>,
      title: 'Merchandising',
      description: 'Artículos por 500 puntos',
      link: '/redeem'
    },
  ];

  return (
    <Container fluid className="py-4">
      {/* Bienvenida */}
      <Row className="mb-4">
        <Col>
          <h2>Bienvenid@ a ServiPuntos</h2>
        </Col>
      </Row>

      {/* Grid de acciones */}
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

      {/* Carrusel de Promociones */}
      <Row className="mb-4">
        <Col>
          <h3>Promociones Destacadas</h3>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Carousel
            controls={false}
            indicators={true}
            interval={4000}
            pause={false}
            variant="dark"
            className="promo-carousel"
          >
            {promotions.map((promo, idx) => (
              <Carousel.Item key={idx}>
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    {promo.icon}
                    <Card.Title>{promo.title}</Card.Title>
                    <Card.Text>{promo.description}</Card.Text>
                    <Button variant="outline-primary" href={promo.link}>
                      Canjear ahora
                    </Button>
                  </Card.Body>
                </Card>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
}
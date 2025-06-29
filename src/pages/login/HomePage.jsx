// src/pages/login/HomePage.jsx
import React, { useContext } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Carousel,
  Button
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TenantContext } from '../../context/TenantContext';
import bg from '../../../src/assets/4-9.jpg';

export default function HomePage() {
  const { tenantUIConfig } = useContext(TenantContext);

  const promotions = [
    { title: '☕️ Café de especialidad', text: 'Canjea 200 puntos por un café' },
    { title: '⛽️ 50% Combustible',      text: 'Mitad de precio en nafta 95' },
    { title: '🎁 Merchandising',        text: 'Artículos por 500 puntos' },
  ];

  return (
    <Container fluid className="p-0">
      <div
        className="position-relative text-center text-dark"
        style={{
          background: `url(${bg}) center/cover no-repeat`,
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
        />
        <div className="position-relative" style={{ zIndex: 1, width: '100%', maxWidth: 800 }}>
          <h1 className="mt-3" style={{ color: tenantUIConfig?.primaryColor }}>
            {tenantUIConfig?.tenantName?.toUpperCase() || 'Bienvenid@s a ServiPuntos'}
          </h1>
          <Card className="mx-auto mt-4 shadow-sm">
            <Card.Body>
              <Card.Title>¿Qué es ServiPuntos.uy?</Card.Title>
              <Card.Text>
                Plataforma de fidelización multi-tenant para cadenas de estaciones
                de servicio en Uruguay. Gestiona puntos, promociones y verificaciones
                de identidad de forma centralizada y escalable.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      <div className="py-5">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col xs="auto">
              <h2 style={{ color: tenantUIConfig?.primaryColor }}>Promociones Destacadas</h2>
            </Col>
          </Row>
        </Container>

        <Carousel
          fade
          interval={3000}
          controls={false}
          indicators
          className="promo-carousel shadow-sm"
        >
          {promotions.map((promo, idx) => (
            <Carousel.Item key={idx}>
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <Card
                  className="mx-3 p-4 text-center"
                  style={{ maxWidth: 400, minWidth: 300 }}
                >
                  <Card.Title className="display-6">
                    {promo.title}
                  </Card.Title>
                  <Card.Text>{promo.text}</Card.Text>
                  <Button
                    as={Link}
                    to="/redeem"
                    variant="outline-primary"
                    style={{
                      borderColor: tenantUIConfig?.primaryColor,
                      color: tenantUIConfig?.primaryColor
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = tenantUIConfig?.primaryColor;
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = tenantUIConfig?.primaryColor;
                    }}
                  >
                    Canjear ahora
                  </Button>
                </Card>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <Container className="pb-5">
        <Row className="justify-content-center">
          <Col className="text-center">
            <Button
              as={Link}
              to="/catalog"
              variant="outline-primary"
              style={{
                borderColor: tenantUIConfig?.primaryColor,
                color: tenantUIConfig?.primaryColor
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = tenantUIConfig?.primaryColor;
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = tenantUIConfig?.primaryColor;
              }}
            >
              🔍 Ver catálogo completo
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

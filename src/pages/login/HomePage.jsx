// src/pages/login/HomePage.jsx
import React, { useContext, useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Carousel,
  Button
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import bg from '../../../src/assets/4-9.jpg';

export default function HomePage() {
  const { user } = useContext(AuthContext);

  // ==== Datos de promociones ====
  const promotions = [
    { title: '☕️ Café de especialidad', text: 'Canjea 200 puntos por un café' },
    { title: '⛽️ 50% Combustible',      text: 'Mitad de precio en nafta 95' },
    { title: '🎁 Merchandising',        text: 'Artículos por 500 puntos' },
  ];

  // ==== Cuenta regresiva ====
  const deadline = new Date('2025-06-30T23:59:59');
  const calcTimeLeft = () => {
    const diff = deadline - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft());
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Container fluid className="p-0">
      {/* === Hero a todo ancho === */}
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
          <h1 className="mt-3">Bienvenid@s a ServiPuntos</h1>
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

      {/* === Promos & Novedades lado a lado === */}
      <Container className="py-5">
        <Row className="g-4">
          {/* — Carrusel Izq — */}
          <Col md={6}>
            <Row className="justify-content-center justify-content-md-start mb-4">
             <Col xs="auto">
               <h2>Promociones Destacadas</h2>
             </Col>
           </Row>
            <Carousel
              fade
              interval={3000}
              controls={false}
              indicators
              className="promo-carousel shadow-sm"
            >
              {promotions.map((promo, idx) => (
                <Carousel.Item key={idx}>
                  <Card
                    className="mx-auto p-4 text-center"
                    style={{ maxWidth: 350 }}
                  >
                    <Card.Title className="display-6">
                      {promo.title}
                    </Card.Title>
                    <Card.Text>{promo.text}</Card.Text>
                    <Button
                      as={Link}
                      to="/redeem"
                      variant="outline-primary"
                    >
                      Canjear ahora
                    </Button>
                  </Card>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>

          {/* — Banner & Countdown Der — */}
          <Col
            md={6}
            className="d-flex flex-column align-items-center"
          >
            {/* Countdown */}
            <Card
              border="primary"
              className="w-100 shadow-sm mb-4 text-center"
              style={{ maxWidth: 400 }}
            >
              <Card.Header className="bg-primary text-white">
                Promociones válidas hasta: 30/06/2025
              </Card.Header>
              <Card.Body>
                <div style={{ fontSize: '1.5rem', fontWeight: 500 }}>
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                </div>
              </Card.Body>
            </Card>

            {/* Novedades */}
            <Card
              border="secondary"
              className="w-100 shadow-sm"
              style={{ maxWidth: 400 }}
            >
              <Card.Header className="bg-secondary text-white text-center">
                🎉 Novedades
              </Card.Header>
              <Card.Body className="text-center">
                <Card.Text className="mb-3">
                  <strong>¡Nuevas promociones cada semana!</strong><br/>
                  Mantente atento para descubrir ofertas exclusivas y acumular más puntos.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* — Botón Ver Catálogo Completo — */}
        <Row className="mt-4">
          <Col className="text-center">
            <Button
              as={Link}
              to="/catalog"
              variant="outline-primary"
            >
              🔍 Ver catálogo completo
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

// src/pages/login/HomePage.jsx
import React, { useContext } from 'react';
import {
  Container,
  Card,
  Carousel,
  Button
} from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import bg from '../../../src/assets/4-9.jpg'; // tu foto de fondo

export default function HomePage() {
  const { user } = useContext(AuthContext);

  const promotions = [
    { title: 'Café Gratis',     text: 'Canjea 200 puntos por un café', icon: '☕️' },
    { title: '50% Combustible', text: 'Mitad de precio en nafta 95',   icon: '⛽️' },
    { title: 'Merchandising',   text: 'Artículos por 500 puntos',       icon: '🎁' },
  ];

  return (
    <Container fluid className="p-0">
      {/* === Hero / Intro a todo ancho === */}
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
        {/* capa semi-blanca encima de la imagen */}
        <div
          className="position-absolute w-100 h-100"
          style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
        />

        <div
          className="position-relative"
          style={{ zIndex: 1, width: '100%', maxWidth: 800 }}
        >
          <h1 className="mt-3">Bienvenid@ a ServiPuntos</h1>
          <Card className="mx-auto mt-4 shadow-sm">
            <Card.Body>
              <Card.Title>¿Qué es ServiPuntos.uy?</Card.Title>
              <Card.Text>
                ServiPuntos.uy es una plataforma de fidelización multi-tenant
                para cadenas de estaciones de servicio en Uruguay. Gestiona
                puntos, promociones y verificaciones de identidad de forma
                centralizada y escalable.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Carrusel de promociones */}
      <div className="py-5 text-center">
        <h2 className="mb-4">Promociones Destacadas</h2>
        <Carousel
          fade
          interval={3000}
          controls={false}
          indicators
          className="mx-auto promo-carousel"
          style={{
            maxWidth: 500,
            position: 'relative',
            paddingBottom: '3rem',
            overflow: 'visible'       // <-- aqui permitimos que se vean los indicadores
          }}
        >
          {promotions.map((promo, idx) => (
            <Carousel.Item key={idx}>
              <Card
                className="mx-auto p-4 shadow-sm promo-card"
                style={{ maxWidth: 400 }}
              >
                <div className="display-1 mb-3">{promo.icon}</div>
                <Card.Title>{promo.title}</Card.Title>
                <Card.Text>{promo.text}</Card.Text>
                <Button variant="outline-primary" href="/redeem">
                  Canjear ahora
                </Button>
              </Card>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </Container>
  );
}

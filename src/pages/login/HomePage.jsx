// src/pages/login/HomePage.jsx
import React, { useContext, useEffect, useState } from 'react';
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
import { getBranches, getBranchPromotions } from '../../services/api';
import { findNearestBranch, getUserLocationByIP } from '../../helpers/utils';

export default function HomePage() {
  const { tenantUIConfig } = useContext(TenantContext);

  const [promotions, setPromotions] = useState([]);
  const [nearestStation, setNearestStation] = useState(null);

  useEffect(() => {
    getBranches().then(data => {
      const branches = Array.isArray(data.data) ? data.data : [];

      const mappedBranches = branches
        .map(b => ({
          id: b.id,
          name: b.tenant?.name ?? "Estación",
          address: b.address,
          lat: parseFloat(b.latitud),
          lng: parseFloat(b.longitud),
        }))
        .filter(st => !isNaN(st.lat) && !isNaN(st.lng));

      getUserLocationByIP().then(location => {
        if (location) {
          const nearest = findNearestBranch(location.lat, location.lng, mappedBranches);
          setNearestStation(nearest);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (nearestStation) {
      getBranchPromotions(nearestStation.id).then(data => {
        console.log("nearestStation", nearestStation)
        console.log("data", data)
        setPromotions(data);
      });
    }
  }, [nearestStation]);

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
          <Row className="mb-4">
            <Col xs="auto">
              <h2 style={{ color: tenantUIConfig?.primaryColor }}>Promociones Destacadas 🎉</h2>
              <span className="text-muted">Estas promociones corresponden a la estación de servicio más cercana a tu ubicación</span>
            </Col>
          </Row>
        </Container>

        <Carousel
          fade
          interval={3000}
          controls={false}
          indicators
          className="promo-carousel"
        >
          {promotions.map((promo, idx) => (
            <Carousel.Item key={idx}>
              <div className="d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
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

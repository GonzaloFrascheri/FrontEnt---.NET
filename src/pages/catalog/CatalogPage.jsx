// src/pages/catalog/CatalogPage.jsx
import React, { useState, useEffect } from 'react';
import { getCatalog } from '../../services/api';
import { Spinner, Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function CatalogPage() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock de las 3 promociones del carrusel
  const mockPromotions = [
    {
      id: 'p1',
      nombre: 'Café Gratis',
      descripcion: 'Canjea 200 puntos por un café',
      costoPuntos: 200,
      icon: '☕️'
    },
    {
      id: 'p2',
      nombre: '50% Combustible',
      descripcion: 'Mitad de precio en nafta 95',
      costoPuntos: 500,
      icon: '⛽️'
    },
    {
      id: 'p3',
      nombre: 'Merchandising',
      descripcion: 'Artículos por 500 puntos',
      costoPuntos: 500,
      icon: '🎁'
    }
  ];

  useEffect(() => {
    getCatalog()
      .then(data => setCatalog(data))
      .catch(() => {
        // fallback: usamos el mock
        setCatalog(mockPromotions);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;

  return (
    <div className="p-4">
      <h2 className="mb-4">Catálogo de productos canjeables</h2>
      <Row xs={1} sm={2} md={3} lg={3} className="g-4">
        {catalog.map(item => (
          <Col key={item.id}>
            <Card className="h-100 shadow-sm text-center">
              <div className="display-1 mt-4">{item.icon}</div>
              <Card.Body className="d-flex flex-column">
                <Card.Title>{item.nombre}</Card.Title>
                <Card.Text className="flex-grow-1">
                  {item.descripcion}
                </Card.Text>
                <Button
                  as={Link}
                  to="/redeem"
                  state={{ preselect: item.id }}
                  variant="primary"
                >
                  Canjear ({item.costoPuntos} pts)
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

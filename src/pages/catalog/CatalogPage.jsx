// src/pages/catalog/CatalogPage.jsx
import React, { useState, useEffect } from 'react';
import { getBranches, getCatalog } from '../../services/api';
import { Spinner, Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { findNearestBranch } from '../../helpers/utils';

export default function CatalogPage() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const getUserLocationByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      if (data.latitude && data.longitude) {
        console.log('Ubicación obtenida por IP:', data);
        setUserLocation({
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude),
          method: 'ip'
        });
        return true;
      }
    } catch (error) {
      console.warn('Error obteniendo ubicación por IP:', error);
    }

    try {
      const response = await fetch('http://ip-api.com/json/');
      const data = await response.json();

      if (data.status === 'success' && data.lat && data.lon) {
        console.log('Ubicación obtenida por IP (backup):', data);
        setUserLocation({
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lon),
          method: 'ip'
        });
        return true;
      }
    } catch (error) {
      console.warn('Error obteniendo ubicación por IP (backup):', error);
    }

    return false;
  };

  useEffect(() => {
    getBranches().then(data => {
      const branches = Array.isArray(data.data) ? data.data : [];
      const mapped = branches.map(b => ({
        id: b.id,
        name: b.tenant?.name ?? "Estación",
        address: b.address,
        lat: parseFloat(b.latitud),
        lng: parseFloat(b.longitud),
      })).filter(st => !isNaN(st.lat) && !isNaN(st.lng));
      setBranches(mapped);

      getUserLocationByIP();
    });
  }, []);

  useEffect(() => {
    if (branches.length > 0) {
      if (userLocation) {
        const nearest = findNearestBranch(userLocation.lat, userLocation.lng, branches);
        setSelectedBranch(nearest);
      } else {
        const firstBranch = { ...branches[0], distance: null };
        setSelectedBranch(firstBranch);
      }
    }
  }, [userLocation, branches]);

  useEffect(() => {
    getCatalog().then(data => setCatalog(data));
    setLoading(false);
  }, [selectedBranch]);

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;

  return (
    <div className="p-4">
      <h2 className="mb-4">Productos</h2>



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
                  Canjear ({item.costoPuntos}pts)
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

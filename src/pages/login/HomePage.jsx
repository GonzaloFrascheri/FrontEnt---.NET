// src/pages/login/HomePage.jsx
import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Carousel,
  Button,
  Badge,
  Spinner
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TenantContext } from '../../context/TenantContext';
import { AuthContext } from '../../context/AuthContext';
import bg from '../../../src/assets/4-9.jpg';
import { getBranches, getBranchPromotions } from '../../services/api';
import { findNearestBranch } from '../../helpers/utils';
import { useUserLocation } from '../../hooks/getUserLocation';

export default function HomePage() {
  const { tenantUIConfig } = useContext(TenantContext);
  const { tenantParameters } = useContext(AuthContext);

  const [promotions, setPromotions] = useState([]);
  const [nearestStation, setNearestStation] = useState(null);
  const [previousNearestStation, setPreviousNearestStation] = useState(null);
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  
  // Usar el hook de geolocalización
  const { position, error: locationError } = useUserLocation();

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

      if (position && !locationError && mappedBranches.length > 0) {
        const [lat, lng] = position;
        const nearest = findNearestBranch(lat, lng, mappedBranches);
        
        // Verificar si la estación realmente cambió para evitar actualizaciones innecesarias
        if (!nearestStation || nearest.id !== nearestStation.id) {
          setPreviousNearestStation(nearestStation);
          setNearestStation(nearest);
        }
      } else if (mappedBranches.length > 0 && !nearestStation) {
        // Fallback: usar la primera sucursal si hay error o no hay ubicación
        // Solo establecer si no hay una estación ya seleccionada
        const firstBranch = { ...mappedBranches[0], distance: null };
        setNearestStation(firstBranch);
      }
    });
  }, [position, locationError, nearestStation]); // Agregar nearestStation como dependencia

  useEffect(() => {
    if (nearestStation) {
      // Activar estado de carga
      setLoadingPromotions(true);
      
      getBranchPromotions(nearestStation.id).then(data => {
        const allProducts = data.flatMap(promo =>
          promo.products ? promo.products.map(product => ({
            ...product,
            promotionId: promo.promotionId,
            promotionPrice: promo.price,
            startDate: promo.startDate,
            endDate: promo.endDate,
            description: promo.description,
            tenantId: promo.tenantId
          })) : []
        );

        const productGroups = allProducts.reduce((groups, product) => {
          const key = product.name.toLowerCase().trim();
          if (!groups[key] || product.promotionPrice < groups[key].promotionPrice) {
            groups[key] = product;
          }
          return groups;
        }, {});

        const processedPromotions = Object.values(productGroups).map(product => ({
          promotionId: product.promotionId,
          description: product.description,
          startDate: product.startDate,
          endDate: product.endDate,
          price: product.promotionPrice,
          tenantId: product.tenantId,
          products: [product],
          displayProduct: product
        }));

        // Solo actualizar las promociones si hay resultados
        // o si no hay promociones previas
        if (processedPromotions.length > 0 || promotions.length === 0) {
          setPromotions(processedPromotions);
        }
        
        // Desactivar estado de carga
        setLoadingPromotions(false);
      }).catch(error => {
        console.error("Error al cargar promociones:", error);
        setLoadingPromotions(false);
      });
    }
  }, [nearestStation]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    // Obtener la moneda de los parámetros del tenant, por defecto USD
    const currency = tenantParameters?.find(param => param.key === 'Currency')?.value || 'USD';

    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

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

      {promotions.length > 0 && (
        <div className="py-5">
        <Container>
          <Row className="mb-4">
            <Col xs="auto">
              <div className="d-flex align-items-center">
                <h2 style={{ color: tenantUIConfig?.primaryColor }}>Promociones Destacadas 🎉</h2>
                {loadingPromotions && (
                  <div className="ms-3 d-flex align-items-center">
                    <Spinner animation="border" size="sm" variant="primary" className="me-2" />
                    <span className="text-primary small">Actualizando promociones...</span>
                  </div>
                )}
              </div>
              <span className="text-muted">
                Estas promociones corresponden a la estación de servicio más cercana a tu ubicación
                {nearestStation && nearestStation.name && ` (${nearestStation.name})`}
              </span>
            </Col>
          </Row>
        </Container>

        <Carousel
          fade
          interval={4000}
          controls={false}
          indicators
          className="promo-carousel"
        >
          {promotions.map((promo, idx) => (
            <Carousel.Item key={`${promo.id}-${idx}`}>
              <div className="d-flex justify-content-center align-items-center" style={{ height: '350px' }}>
                <Card
                  className="mx-3 p-4 text-center shadow"
                  style={{ maxWidth: 450, minWidth: 350 }}
                >
                  <div className="mb-3">
                    <div className="d-flex justify-content-between text-muted small">
                      <span>Desde: {formatDate(promo.startDate)}</span>
                      <span>Hasta: {formatDate(promo.endDate)}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    {promo.displayProduct ? (
                      <div className="p-3 border rounded">
                        <div className="d-flex align-items-center">
                          {promo.displayProduct.imageUrl && (
                            <img
                              src={promo.displayProduct.imageUrl}
                              alt={promo.displayProduct.name}
                              style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                marginRight: '20px'
                              }}
                            />
                          )}
                          <div className="flex-grow-1 text-start">
                            <h5 className="mb-2 fw-bold">{promo.displayProduct.name}</h5>
                            {promo.displayProduct.description && (
                              <p className="text-muted mb-2">{promo.displayProduct.description}</p>
                            )}
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <span className="text-muted small">Precio normal: </span>
                                <span className="fw-bold text-primary fs-5">
                                  {formatPrice(promo.displayProduct.price)}
                                </span>
                              </div>
                              {promo.displayProduct.ageRestricted && (
                                <Badge bg="warning" text="dark">+18</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : promo.products && promo.products.length > 0 ? (
                      <div className="p-3 border rounded">
                        <div className="d-flex align-items-center">
                          {promo.products[0].imageUrl && (
                            <img
                              src={promo.products[0].imageUrl}
                              alt={promo.products[0].name}
                              style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                marginRight: '20px'
                              }}
                            />
                          )}
                          <div className="flex-grow-1 text-start">
                            <h5 className="mb-2 fw-bold">{promo.products[0].name}</h5>
                            {promo.products[0].description && (
                              <p className="text-muted mb-2">{promo.products[0].description}</p>
                            )}
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <span className="text-muted small">Precio normal: </span>
                                <span className="fw-bold text-primary fs-5">
                                  {formatPrice(promo.products[0].price)}
                                </span>
                              </div>
                              {promo.products[0].ageRestricted && (
                                <Badge bg="warning" text="dark">+18</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 border rounded text-center">
                        <p className="text-muted">No hay productos disponibles</p>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-success bg-opacity-10 rounded">
                      <span className="fw-bold">Precio promocional:</span>
                      <span className="h4 mb-0 text-success fw-bold">{formatPrice(promo.price)}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      )}

      <Container className="pb-5 mt-5">
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

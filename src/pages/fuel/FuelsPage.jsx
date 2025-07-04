import React, { useState, useEffect, useContext } from "react";
import { getFuelPrices } from "../../services/api";
import { Spinner, Row, Container, Card, Col, Alert } from "react-bootstrap";
import { TenantContext } from "../../context/TenantContext";
import { AuthContext } from "../../context/AuthContext";
import { useLocation } from "../../hooks/useLocation";
import DropdownComponent from "../../components/Dropdown";

const FUEL_NAMES = {
  0: { label: "Súper", icon: "⛽", css: "fuel-super" },
  1: { label: "Gasoil", icon: "🛢️", css: "fuel-gasoil" },
  2: { label: "Premium", icon: "⚡", css: "fuel-premium" },
};

export default function FuelsPage() {
  const [fuels, setFuels] = useState([]);
  const [fuelsLoading, setFuelsLoading] = useState(false);
  const [error, setError] = useState("");
  const { tenantUIConfig } = useContext(TenantContext);
  const { tenantParameters } = useContext(AuthContext);
  const { branches, selectedBranch, setSelectedBranch, loading: locationLoading } = useLocation();

  const tenantStyles = {
    primaryColor: tenantUIConfig?.primaryColor || '#1976d2',
    secondaryColor: tenantUIConfig?.secondaryColor || '#FFFF00',
  };

  useEffect(() => {
    if (!selectedBranch) return;
    setFuels([]);
    setError("");
    setFuelsLoading(true);
    getFuelPrices(selectedBranch.id)
      .then(data => setFuels(data))
      .catch(err => setError(err.message || "Error al cargar los precios."))
      .finally(() => setFuelsLoading(false));
  }, [selectedBranch]);

  // Función para formatear precios con la moneda del tenant
  const formatPrice = (price) => {
    const currency = tenantParameters?.find(param => param.key === 'Currency')?.value || 'USD';

    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  if (locationLoading) return <Spinner animation="border" className="d-block mx-auto my-5" />;

  return (
    <Container className="py-5">
      <div className="mb-4 w-100 d-flex justify-content-between align-items-center">
        <h3 style={{ color: tenantUIConfig?.primaryColor }}>Precios de Combustibles</h3>
        
        <DropdownComponent
          items={branches.map(branch => ({
            id: branch.id,
            label: branch.address || branch.name || `Estación #${branch.id}`
          }))}
          selectedItemId={selectedBranch?.id}
          setSelectedItemId={(id) => setSelectedBranch(branches.find(branch => branch.id === id))}
          tenantStyles={tenantStyles}
        />
      </div>

      {fuelsLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : !fuels.length ? (
        <Alert variant="info">No hay precios de combustibles para esta estación.</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} className="g-4">
          {fuels.map(fuel => {
            const meta = FUEL_NAMES[fuel.fuelType] || {};
            return (
              <Col key={fuel.id}>
                <Card className={`shadow-sm text-center fuel-card`}>
                  <Card.Body>
                    <div className={`fuel-icon mb-2 ${meta.css}`}>{meta.icon || "⛽"}</div>
                    <Card.Title style={{ fontSize: "1.35rem", fontWeight: 500, letterSpacing: ".01em" }}>
                      {meta.label ?? `Tipo ${fuel.fuelType}`}
                    </Card.Title>
                    <Card.Text style={{ fontSize: "2.3rem", fontWeight: "bold", marginTop: 4, marginBottom: 0 }}>
                      {formatPrice(fuel.price)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}

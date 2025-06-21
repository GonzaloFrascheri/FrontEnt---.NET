import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getFuelPrices } from "../../services/api";
import { Card, Row, Col, Container, Spinner, Alert } from "react-bootstrap";

// Enum del backend y clases para color
const FUEL_NAMES = {
  0: { label: "Súper", icon: "⛽", css: "fuel-super" },
  1: { label: "Gasoil", icon: "🛢️", css: "fuel-gasoil" },
  2: { label: "Premium", icon: "⚡", css: "fuel-premium" },
};

export default function FuelPage() {
  const { userData, loading: userLoading } = useContext(AuthContext);
  const branchId = userData?.branchId;
  const [fuels, setFuels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userLoading) return;
    if (!branchId) {
      setFuels([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    getFuelPrices(branchId)
      .then(setFuels)
      .catch(err => setError(err.message || "Error al cargar los precios."))
      .finally(() => setLoading(false));
  }, [branchId, userLoading]);

  if (userLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!branchId) {
    return (
      <Container className="py-5">
        <Alert variant="warning">No tienes estación asignada, contacta a tu administrador.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!fuels.length) {
    return (
      <Container className="py-5">
        <Alert variant="info">No hay precios de combustibles para esta estación.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h3 className="mb-4 text-center">Precios de Combustibles</h3>
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
                    ${fuel.price.toFixed(2)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

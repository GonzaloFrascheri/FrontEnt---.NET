import React, { useState, useEffect } from "react";
import { getBranches, getFuelPrices } from "../../services/api";
import { Spinner, Row, Dropdown, Container, Card, Col, Alert } from "react-bootstrap";

const FUEL_NAMES = {
  0: { label: "Súper", icon: "⛽", css: "fuel-super" },
  1: { label: "Gasoil", icon: "🛢️", css: "fuel-gasoil" },
  2: { label: "Premium", icon: "⚡", css: "fuel-premium" },
};

export default function FuelsPage() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [fuels, setFuels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fuelsLoading, setFuelsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getBranches().then(data => {
      const arr = Array.isArray(data.data) ? data.data : [];
      setBranches(arr);
      if (arr.length > 0) setSelectedBranch(arr[0]); // Selecciona la primera branch por default
      setLoading(false);
    });
  }, []);

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

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;

  return (
    <Container className="py-5">
      <div className="mb-4 w-100 d-flex justify-content-between align-items-center">
        <h3>Precios de Combustibles</h3>
        <Dropdown>
          <Dropdown.Toggle>
            {selectedBranch?.address || selectedBranch?.name || "Seleccioná estación"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {branches.map(branch => (
              <Dropdown.Item
                key={branch.id}
                value={branch.id}
                onClick={() => setSelectedBranch(branch)}
              >
                {branch.address || branch.name || `Estación #${branch.id}`}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
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
                      ${fuel.price.toFixed(2)}
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

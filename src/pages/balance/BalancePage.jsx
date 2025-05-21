// src/pages/balance/BalancePage.jsx
import React, { useContext } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { PointsContext } from '../../context/PointsContext';
import { Link } from 'react-router-dom';

export default function BalancePage() {
  const { balance, refreshBalance } = useContext(PointsContext);

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-sm" style={{ maxWidth: 400, width: '100%' }}>
        <Card.Body className="text-center">
          <Card.Title className="mb-4">Tu saldo de puntos</Card.Title>
          <div style={{ fontSize: '2rem', fontWeight: '500' }}>
            {balance} pts
          </div>
          <Button 
            variant="outline-primary" 
            className="mt-4"
            onClick={refreshBalance}
          >
            Actualizar saldo
          </Button>
          <div className="mt-3">
            <Link to="/redeem">Ir a Canje de Puntos</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

// src/pages/balance/BalancePage.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function BalancePage() {
  const { getUserData } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const userData = await getUserData();
      setUserData(userData);
    };
    loadProfile();
  }, [getUserData]);

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-sm" style={{ maxWidth: 400, width: '100%' }}>
        <Card.Body className="text-center">
          <Card.Title className="mb-4">Tu saldo de puntos</Card.Title>
          <div style={{ fontSize: '2rem', fontWeight: '500' }}>
            {userData?.pointBalance} pts
          </div>

          <div className="mt-3">
            <Link to="/catalog">Ir a Canje de Puntos</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

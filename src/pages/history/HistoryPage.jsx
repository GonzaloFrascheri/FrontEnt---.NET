// src/pages/history/HistoryPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Table } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

export default function HistoryPage() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Datos mockeados de transacciones
    setHistory([
      { id: 1, date: '2025-05-18', description: 'Canje - Café Gratis', points: -200 },
      { id: 2, date: '2025-05-10', description: 'Canje - 50% Combustible', points: -500 },
      { id: 3, date: '2025-04-30', description: 'Acumulación - Compra de nafta', points: +150 },
    ]);
  }, []);

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4">Historial de Transacciones</Card.Title>
          {history.length > 0 ? (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th className="text-end">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {history.map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td>{tx.description}</td>
                    <td className={`text-end ${tx.points < 0 ? 'text-danger' : 'text-success'}`}>
                      {tx.points > 0 ? `+${tx.points}` : tx.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center mb-0">No se encontraron transacciones.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

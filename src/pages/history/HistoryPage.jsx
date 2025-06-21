// src/pages/history/HistoryPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Table, Modal, Button } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { getTransactionHistory, getTransactionItems } from '../../services/api';

export default function HistoryPage() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    setLoading(true);
    getTransactionHistory()
      .then(data => setHistory(data))
      .finally(() => setLoading(false));
  }, []);

  // Handler para mostrar detalle en modal
  const handleShowDetail = async (tx) => {
    setSelectedTx(tx);
    setDetail([]); // limpia por si tarda
    setShowModal(true);
    try {
      const items = await getTransactionItems(tx.id);
      setDetail(items);
    } catch (e) {
      setDetail([]);
    }
  };

  const TX_TYPE_LABELS = {
    1: "Compra de productos",
    2: "Canje de productos por puntos"
  };

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4">Historial de Transacciones</Card.Title>
          {loading ? (
            <p>Cargando...</p>
          ) : history.length > 0 ? (
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
                  <tr key={tx.id} style={{ cursor: "pointer" }} onClick={() => handleShowDetail(tx)}>
                    <td>{tx.createdAt?.slice(0, 10)}</td>
                    <td>{TX_TYPE_LABELS[tx.type] || "Transacción"}</td>
                    <td className={`text-end ${tx.pointsSpent > 0 ? 'text-danger' : 'text-success'}`}>
                      {tx.pointsSpent > 0 ? `-${tx.pointsSpent}` : `+${tx.pointsEarned}`}
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

      {/* Modal de detalle */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Detalle de Transacción {selectedTx ? `#${selectedTx.id}` : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detail.length > 0 ? (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detail.map(item => (
                  <tr key={item.id}>
                    <td>
                      <img src={item.productImageUrl} alt={item.productName} style={{ maxWidth: 40, maxHeight: 40, marginRight: 8 }} />
                      {item.productName}
                    </td>
                    <td>{item.quantity}</td>
                    <td>${item.unitPrice?.toFixed(2)}</td>
                    <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No hay detalles para esta transacción.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

import React, { useState } from 'react';
import { Card, Col, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/default.jpg';

const Product = ({ item, isUserVerified }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  if ((!item.ageRestricted) || (item.ageRestricted && isUserVerified)) {
    return (
      <>
        <Col key={item.id}>
          <Card className="h-100 shadow-sm text-center">
            <div className="display-1 mt-4">
              <img
                src={item.imageUrl || defaultImage}
                alt={item.name}
                className="img-fluid"
                style={{
                  maxHeight: '120px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>

            <Card.Body className="d-flex flex-column">
              <Card.Title>
                {item.name}
              </Card.Title>

              <Card.Text className="flex-grow-1">
                {item.descripcion}
              </Card.Text>

              <Button
                variant="primary"
                onClick={handleShow}
              >
                Ver Detalles
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Modal con información del producto */}
        <Modal show={showModal} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{item.name}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="text-center mb-4">
              <img
                src={item.imageUrl || defaultImage}
                alt={item.name}
                className="img-fluid"
                style={{
                  maxHeight: '200px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>

            <div className="mb-3">
              <h5>Descripción</h5>
              <p>{item.descripcion}</p>
            </div>

            <div className="row mb-3">
              <div className="col-6">
                <h6>Precio</h6>
                <p className="text-primary fw-bold">${item.price}</p>
              </div>
              <div className="col-6">
                <h6>Stock Disponible</h6>
                <p className="text-success fw-bold">{item.stock} unidades</p>
              </div>
            </div>

            {item.costoPuntos && (
              <div className="mb-3">
                <h6>Canjear con Puntos</h6>
                <p className="text-warning fw-bold">{item.costoPuntos} puntos</p>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>

            <Button
              as={Link}
              to=""
              state={{ preselect: item.id }}
              variant="warning"
              onClick={handleClose}
            >
              Canjear con Puntos ({item.costoPuntos}pts)
            </Button>

            <Button
              as={Link}
              to="/buy"
              state={{ preselect: item.id }}
              variant="primary"
              onClick={handleClose}
            >
              Comprar (${item.price})
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

export default Product

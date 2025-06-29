import React, { useState, useEffect } from 'react';
import { Card, Col, Button, Badge } from 'react-bootstrap';

import ModalComprar from './ModalComprar';
import { getLoyaltyProgram } from '../services/api';

import defaultImage from '../assets/default.jpg';

const Product = ({ item, isUserVerified, selectedBranchId, refreshCatalog }) => {
  const [showModal, setShowModal] = useState(false);
  const [loyaltyProgram, setLoyaltyProgram] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const fetchLoyaltyProgram = async () => {
      const loyaltyProgram = await getLoyaltyProgram();
      setLoyaltyProgram(loyaltyProgram);
    };
    fetchLoyaltyProgram();
  }, []);

  if ((!item.ageRestricted) || (item.ageRestricted && isUserVerified)) {
    return (
      <>
        <Col key={item.id}>
          <Card className="h-100 shadow-sm text-center position-relative">

            {item.hasPromotion && (
              <div className="position-absolute top-0 end-0 w-auto">
                <Badge bg="danger" className="rounded-0 rounded-top-end">
                  ¡PROMOCIÓN!
                </Badge>
              </div>
            )}

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

              {/* Precios */}
              <div className="mb-3">
                {item.hasPromotion ? (
                  <div>
                    <div className="text-decoration-line-through text-muted">
                      ${item.originalPrice}
                    </div>
                    <div className="h5 text-danger fw-bold">
                      ${item.promotionalPrice}
                    </div>
                  </div>
                ) : (
                  <div className="h5 fw-bold">
                    ${item.price}
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                onClick={handleShow}
              >
                Ver Detalles
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <ModalComprar
          showModal={showModal}
          handleClose={handleClose}
          item={item}
          loyaltyProgram={loyaltyProgram}
          selectedBranchId={selectedBranchId}
          refreshCatalog={refreshCatalog}
        />
      </>
    )
  }
}

export default Product

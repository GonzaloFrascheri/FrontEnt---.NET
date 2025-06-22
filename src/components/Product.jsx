import React, { useState, useEffect } from 'react';
import { Card, Col, Button } from 'react-bootstrap';

import ModalComprar from './ModalComprar';
import { getLoyaltyProgram } from '../services/api';

import defaultImage from '../assets/default.jpg';

const Product = ({ item, isUserVerified }) => {
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

        <ModalComprar
          showModal={showModal}
          handleClose={handleClose}
          item={item}
          loyaltyProgram={loyaltyProgram}
        />
      </>
    )
  }
}

export default Product

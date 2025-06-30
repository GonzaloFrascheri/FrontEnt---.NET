import React, { useState, useEffect, useContext } from 'react';
import { Card, Col, Button, Badge } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

import ModalComprar from './ModalComprar';
import { getLoyaltyProgram } from '../services/api';

import defaultImage from '../assets/default.jpg';

const Product = ({ item, isUserVerified, selectedBranchId, refreshCatalog, tenantUIConfig }) => {
  const [showModal, setShowModal] = useState(false);
  const [loyaltyProgram, setLoyaltyProgram] = useState(null);
  const { tenantParameters } = useContext(AuthContext);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const fetchLoyaltyProgram = async () => {
      const loyaltyProgram = await getLoyaltyProgram();
      setLoyaltyProgram(loyaltyProgram);
    };
    fetchLoyaltyProgram();
  }, []);

  const primaryColor = tenantUIConfig?.primaryColor || '#0d6efd';
  const secondaryColor = tenantUIConfig?.secondaryColor || '#ffc107';

  const buttonStyle = {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
    color: '#fff'
  };

  const promotionBadgeStyle = {
    backgroundColor: secondaryColor,
    color: '#000',
    borderColor: secondaryColor
  };

  const promotionalPriceStyle = {
    color: secondaryColor
  };

  const formatPrice = (price) => {
    const currency = tenantParameters?.find(param => param.key === 'Currency')?.value || 'USD';

    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  if ((!item.ageRestricted) || (item.ageRestricted && isUserVerified)) {
    return (
      <>
        <Col key={item.id}>
          <Card className="h-100 shadow-sm text-center position-relative">
            {item.hasPromotion && (
              <div className="position-absolute top-0 end-0 w-auto">
                <Badge
                  style={promotionBadgeStyle}
                  className="rounded-0 rounded-top-end"
                >
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
                {item.description}
              </Card.Text>

              <div className="mb-3">
                {item.hasPromotion ? (
                  <div>
                    <div className="text-decoration-line-through text-muted">
                      {formatPrice(item.originalPrice)}
                    </div>
                    <div className="h5 fw-bold" style={promotionalPriceStyle}>
                      {formatPrice(item.promotionalPrice)}
                    </div>
                  </div>
                ) : (
                  <div className="h5 fw-bold">
                    {formatPrice(item.price)}
                  </div>
                )}
              </div>

              <Button
                style={buttonStyle}
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
          tenantUIConfig={tenantUIConfig}
        />
      </>
    )
  }
}

export default Product

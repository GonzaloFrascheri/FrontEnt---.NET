import React from 'react';
import { Card, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/default.jpg';

const Product = ({ item, isUserVerified }) => {
  if ((!item.ageRestricted) || (item.ageRestricted && isUserVerified)) {
    return (
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
              as={Link}
              state={{ preselect: item.id }}
              variant="primary"
            >
              Comprar (${item.price})
            </Button>
          </Card.Body>
        </Card>
      </Col>
    )
  }
}

export default Product

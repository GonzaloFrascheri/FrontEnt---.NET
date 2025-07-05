import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function TenantNotFound({ errorMessage }) {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row>
        <Col>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">
                <span className="display-6">¡Oops!</span>
              </Card.Title>
              <Card.Text className="mb-4">
                {errorMessage || 'El tenant al que quieres ingresar no existe'}
              </Card.Text>
              <div className="d-grid gap-2 col-6 mx-auto">
                <Button 
                  as={Link} 
                  to="/" 
                  variant="primary"
                >
                  Volver al inicio
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

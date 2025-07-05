import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function TenantNotFound({ errorMessage }) {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row>
        <Col>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">
                <span className="display-6">¡Oops!</span>
              </Card.Title>
              <Card.Text className="mb-4">
                {errorMessage || "El tenant al que quieres ingresar no existe"}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

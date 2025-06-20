import React, { useContext }  from "react"
import { AuthContext } from "../../context/AuthContext";
import {
    Container,
    Col,
    Card,
    Form,
} from "react-bootstrap";

export default function ProfilePage() {
    const { userData } = useContext(AuthContext);

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Col xs={12} sm={10} md={8} lg={6}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-center mb-4">Mi Perfil</Card.Title>

            <Form>
              <Form.Group className="mb-3" controlId="inputNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={userData?.name}
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="inputEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userData?.email}
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="inputRol">
                <Form.Check
                  type="checkbox"
                  id="default-checkbox"
                  label="+18"
                  defaultChecked={userData?.isVerified}
                  disabled
                />
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
}

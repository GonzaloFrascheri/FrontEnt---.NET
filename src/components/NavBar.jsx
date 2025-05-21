// src/components/NavBar.jsx
import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { BoxArrowRight, PersonFillGear } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PointsContext } from '../context/PointsContext';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const { balance }      = useContext(PointsContext);

  return (
    <Navbar bg="dark" variant="dark" expand="md" className="px-3 mb-4">
      <Container fluid>
        {/* Ítems centrales: Perfil, email y puntos */}
        <Nav className="d-flex align-items-center">
          <Nav.Link as={Link} to="/perfil" className="text-white d-flex align-items-center me-4">
            <PersonFillGear size={24} className="me-2" />
            Perfil
          </Nav.Link>

          <span className="text-white me-4">
            {user.email}
          </span>

          <Nav.Link as={Link} to="/balance" className="text-white d-flex align-items-center">
            Puntos: <strong className="ms-1">{balance}</strong>
          </Nav.Link>
        </Nav>

        {/* Aquí empujamos todo lo anterior a la izquierda y éste botón se queda a la derecha */}
        <Nav className="ms-auto">
          <Button variant="outline-danger" onClick={logout}>
            <BoxArrowRight className="me-1" />
            Salir
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}

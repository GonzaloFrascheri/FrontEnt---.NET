// src/components/NavBar.jsx
import React, { useContext } from 'react';
import { Navbar, Container, Button, Nav } from 'react-bootstrap';
import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
import { AuthContext } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" className="mb-4">
      <Container>
        <Nav className="align-items-center">
          <PersonCircle className="me-2 text-white" size={24} />
          <span className="text-white me-4">
            {user.email}
          </span>
          <span className="text-white">
            Puntos: <strong>{user.puntos ?? 0}</strong>
          </span>
        </Nav>
        <Button variant="outline-danger" onClick={logout}>
          <BoxArrowRight className="me-1" />
          Salir
        </Button>
      </Container>
    </Navbar>
  );
}

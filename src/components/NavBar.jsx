// src/components/NavBar.jsx
import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
import { AuthContext } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" expand="md" className="px-3 mb-4">
      <Container fluid>
        {/* -------------------------------------------------- */}
        {/* IZQUIERDA: Usuario y puntos (reemplaza al brand) */}
        {/* -------------------------------------------------- */}
        <Nav className="align-items-center">
          <PersonCircle size={24} className="text-white me-2" />
          <span className="text-white me-4">{user.email}</span>
          <span className="text-white">
            Puntos: <strong>{user.puntos ?? 0}</strong>
          </span>
        </Nav>

        {/* -------------------------------------------------- */}
        {/* DERECHA: Botón de Salir */}
        {/* -------------------------------------------------- */}
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

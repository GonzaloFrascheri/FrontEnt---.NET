// src/components/Footer.jsx
import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';

export default function Footer() {
  return (
    <Navbar bg="dark" variant="dark" className="mt-auto py-3">
      <Container className="d-flex align-items-center">
        {/* Copyright a la izquierda */}
        <Navbar.Text className="text-white">
          &copy; 2025 ServiPuntos.uy
        </Navbar.Text>

        {/* Enlaces a la derecha */}
        <Nav className="ms-auto">
          <Nav.Link href="/terms" className="text-white">
            Términos
          </Nav.Link>
          <Nav.Link href="/privacy" className="text-white">
            Privacidad
          </Nav.Link>
          <Nav.Link href="/contact" className="text-white">
            Contacto
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

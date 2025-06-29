// src/components/Footer.jsx
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <Navbar bg="dark" variant="dark" className="mt-auto py-3">
      <Container className="d-flex align-items-center">
        <Navbar.Text className="text-white">
          &copy; 2025 ServiPuntos.uy
        </Navbar.Text>

      </Container>
    </Navbar>
  );
}

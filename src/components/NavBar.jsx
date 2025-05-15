// src/components/NavBar.jsx
import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" expand="md" className="px-3 mb-4">
      <Container fluid>
        {/* Brand + logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={logo}
            alt="ServiPuntos"
            height="28"
            className="me-2"
          />
          <span className="text-white">ServiPuntos</span>
        </Navbar.Brand>

        {/* User / points / logout */}
        <Nav className="ms-auto align-items-center">
          <PersonCircle size={24} className="text-white me-2" />
          <span className="text-white me-3">{user.email}</span>
          <span className="text-white me-3">
            Puntos: <strong>{user.puntos ?? 0}</strong>
          </span>
          <Button variant="outline-danger" onClick={logout}>
            <BoxArrowRight className="me-1" />
            Salir
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}

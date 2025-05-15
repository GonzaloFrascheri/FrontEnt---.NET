// src/components/NavBar.jsx
import React, { useContext } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" expand="md" className="px-3 mb-4">
      <Container fluid>

        {/* BRAND (logo + nombre) */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center"
        >
          <img
            src={logo}
            alt="ServiPuntos"
            style={{ height: '2rem', marginRight: '.5rem' }}
          />
          <span className="text-white">ServiPuntos</span>
        </Navbar.Brand>

        {/* USUARIO + PUNTOS */}
        <div className="d-flex align-items-center ms-4">
          <PersonCircle size={24} className="text-white me-2" />
          <span className="text-white me-3">{user.email}</span>
          <span className="text-white">
            Puntos: <strong>{user.puntos ?? 0}</strong>
          </span>
        </div>

        {/* BOTÓN “Salir” al final */}
        <Button
          variant="outline-danger"
          onClick={logout}
          className="ms-auto"
        >
          <BoxArrowRight className="me-1" />
          Salir
        </Button>
      </Container>
    </Navbar>
  );
}

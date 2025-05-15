// src/components/ProtectedLayout.jsx
import React, { useState, useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Navbar,
  Button,
  Nav,
  Offcanvas,
  Container,
  Row,
  Col,
  Image
} from 'react-bootstrap';
import {
  List,
  BoxArrowRight,
  PersonCircle,
  Building,
  FuelPump,
  Lock,
  Gift
} from 'react-bootstrap-icons';
import { AuthContext } from '../context/AuthContext';
import Footer from './Footer';

import logo from '../../src/assets/logo.jpg';

export default function ProtectedLayout() {
  const { user, logout } = useContext(AuthContext);
  const [showCanvas, setShowCanvas] = useState(false);
  const loc = useLocation();

  const sections = [
    {
      title: 'Cadena',
      icon: <Building className="me-2" />,
      items: [
        { label: 'Dashboard', to: '/' },
        { label: 'Alta de Tenant', to: '/tenants/nuevo' },
        { label: 'Alta de Producto', to: '/products/nuevo' }
      ]
    },
    {
      title: 'Estaciones',
      icon: <FuelPump className="me-2" />,
      items: [
        { label: 'Alta de Estación', to: '/stations/nuevo' },
        { label: 'Actualizar Precio', to: '/fuels/actualizar' }
      ]
    },
    {
      title: 'Cliente',
      icon: <Lock className="me-2" />,
      items: [
        { label: 'Verificación VEAI', to: '/verify' },
        { label: 'Canje de Puntos', to: '/redeem' }
      ]
    }
  ];

  const renderSections = () =>
    sections.map(sec => (
      <div className="mb-3" key={sec.title}>
        <Nav.Link
          as={Link}
          to={sec.items[0].to}
          className={`d-flex align-items-center fw-bold ${
            loc.pathname === sec.items[0].to ? 'text-primary' : 'text-dark'
          }`}
        >
          {sec.icon}
          {sec.title}
        </Nav.Link>
        <Nav className="flex-column ms-4">
          {sec.items.map(({ label, to }) => (
            <Nav.Link
              as={Link}
              to={to}
              key={to}
              className={`${
                loc.pathname === to ? 'text-primary' : 'text-secondary'
              }`}
            >
              • {label}
            </Nav.Link>
          ))}
        </Nav>
      </div>
    ));

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar superior */}
      <Navbar bg="dark" variant="dark" expand="md" className="px-3">
        <Button
          variant="outline-light"
          className="me-3 d-md-none"
          onClick={() => setShowCanvas(true)}
        >
          <List />
        </Button>

        <PersonCircle size={24} className="text-white me-2" />
        <span className="text-white me-4">{user.email}</span>
        <span className="text-white">
          Puntos: <strong>{user.puntos ?? 0}</strong>
        </span>

        <Button
          variant="outline-danger"
          onClick={logout}
          className="ms-auto"
        >
          <BoxArrowRight className="me-1" />
          Salir
        </Button>
      </Navbar>

      {/* Offcanvas para móvil */}
      <Offcanvas
        show={showCanvas}
        onHide={() => setShowCanvas(false)}
        className="d-md-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Nav className="flex-column bg-light p-3">
            {renderSections()}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Contenedor principal */}
      <Container fluid className="flex-grow-1 px-0">
        <Row className="g-0 flex-grow-1">
          {/* ===== Sidebar desktop ===== */}
          <Col
            md={2}
            className="d-none d-md-flex flex-column bg-light p-3 overflow-auto"
          >
            {/* Aquí va tu logo */}
            <div className="text-center mb-4">
              <Link to="/">
                <img
                  src={logo}
                  alt="ServiPuntos Logo"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Link>
            </div>

            <Nav className="flex-column">
              {renderSections()}
            </Nav>
          </Col>

          {/* ===== Contenido ===== */}
          <Col md={10} className="p-4 overflow-auto">
            <Outlet />
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
}

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
  Col
} from 'react-bootstrap';
import {
  List,
  BoxArrowRight,
  PersonCircle,
  Building,
  Box,
  FuelPump,
  Lock,
  Gift
} from 'react-bootstrap-icons';
import { AuthContext } from '../context/AuthContext';
import Footer from './Footer';

export default function ProtectedLayout() {
  const { user, logout } = useContext(AuthContext);
  const [showCanvas, setShowCanvas] = useState(false);
  const loc = useLocation();

  // Definimos secciones y sus rutas hijas
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

  // Función para renderizar cada sección con su submenú
  const renderSections = () =>
    sections.map(sec => (
      <div className="sidebar-section" key={sec.title}>
        {/* Enlace padre */}
        <Nav.Link
          as={Link}
          to={sec.items[0].to}
          className={`sidebar-parent d-flex align-items-center ${
            loc.pathname === sec.items[0].to ? 'active' : ''
          }`}
        >
          {sec.icon}{sec.title}
        </Nav.Link>

        {/* Submenú oculto hasta hover */}
        <Nav className="sidebar-submenu flex-column">
          {sec.items.map(({ label, to }) => (
            <Nav.Link
              as={Link}
              to={to}
              key={to}
              className={loc.pathname === to ? 'active' : ''}
            >
              {label}
            </Nav.Link>
          ))}
        </Nav>
      </div>
    ));

  return (
    <div className="d-flex flex-column vh-100">
      {/* Navbar superior */}
      <Navbar bg="dark" variant="dark" expand="md" className="px-3 mb-4">
        <Container fluid>
          {/* IZQUIERDA: usuario + puntos */}
          <PersonCircle size={24} className="text-white me-2" />
          <span className="text-white me-4">{user.email}</span>
          <span className="text-white">
            Puntos: <strong>{user.puntos ?? 0}</strong>
          </span>

          {/* DERECHA: solo el botón Salir */}
          <Button
            variant="outline-danger"
            onClick={logout}
            className="ms-auto"         // <-- esto empuja el botón todo a la derecha
          >
            <BoxArrowRight className="me-1" />
            Salir
          </Button>
        </Container>
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

      {/* Main: sidebar fijo + contenido */}
      <Container fluid className="flex-grow-1 px-0">
        <Row className="g-0 h-100">
          {/* Sidebar desktop */}
          <Col
            md={2}
            className="d-none d-md-flex flex-column bg-light vh-100 p-3 overflow-auto"
          >
            {renderSections()}
          </Col>

          {/* Contenido */}
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

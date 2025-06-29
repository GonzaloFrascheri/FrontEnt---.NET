// src/components/ProtectedLayout.jsx
import React, { useState, useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Nav,
  Offcanvas,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import {
  Building,
  FuelPump,
  PersonFill,
  Cart
} from 'react-bootstrap-icons';
import Footer from './Footer';
import logo from '../assets/logo.jpg';
import NavBar from './NavBar';
import { TenantContext } from '../context/TenantContext';

export default function ProtectedLayout() {
  const [showCanvas, setShowCanvas] = useState(false);
  const loc = useLocation();
  const { tenantUIConfig } = useContext(TenantContext);

  const sections = [
    {
      title: 'Cadena',
      icon: <Building className="me-2" />,
      items: [
        { label: 'Dashboard', to: '/' },
      ]
    },
    {
      title: 'Productos',
      icon: <Cart className="me-2" />,
      items: [
        { label: 'Productos', to: '/catalog' }
      ]
    },
    {
      title: 'Estaciones',
      icon: <FuelPump className="me-2" />,
      items: [
        { label: 'Mapa de Estaciones', to: '/stations/map' },
        { label: 'Precio Combustibles', to: '/fuels' }
      ]
    },
    {
      title: 'Cliente',
      icon: <PersonFill className="me-2" />,
      items: [
        { label: 'Verificación VEAI', to: '/verify' },
        { label: 'Historial de Transacciones', to: '/history' },
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
      <NavBar />

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

      <Container fluid className="flex-grow-1 px-0">
        <Row className="g-0 flex-grow-1">
          <Col
            md={2}
            className="d-none d-md-flex flex-column bg-light p-3 overflow-auto"
          >
            <div className="text-center mb-4">
              <Link to="/">
                <img
                  src={tenantUIConfig?.logoUrl || logo}
                  alt="ServiPuntos Logo"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Link>
            </div>

            <Nav className="flex-column">{renderSections()}</Nav>
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

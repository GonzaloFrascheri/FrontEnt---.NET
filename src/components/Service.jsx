import React, { useState } from 'react';
import { Card, Col, Button, Badge } from 'react-bootstrap';
import ModalComprar from './ModalComprar';

const SERVICE_ICONS = {
  'Lavado de Vidrios': '🧽',
  'Lavado Completo': '🚗',
  'Cambio de Aceite': '🚗',
  'Revisión Técnica': '👩‍🔧',
  'Revisión de Neumáticos': '🛞',
  'Limpieza Interior': '🧹',
  'Pulido': '✨',
  'Encerado': '🪔',
  'Aspirado': '🧹',
  'default': '🧽'
};

const Service = ({ service, isUserVerified, selectedBranchId, tenantUIConfig }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const primaryColor = tenantUIConfig?.primaryColor || '#0d6efd';

  const buttonStyle = {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
    color: '#fff'
  };

  const getServiceIcon = (serviceName) => {
    return SERVICE_ICONS[serviceName] || SERVICE_ICONS.default;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const time = timeString.split(':');
    const hours = parseInt(time[0]);
    const minutes = time[1];
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes} ${period}`;
  };

  const getAvailabilityText = () => {
    if (!service.availabilities || service.availabilities.length === 0) {
      return 'Horarios no disponibles';
    }

    const availability = service.availabilities[0];
    const startTime = formatTime(availability.startTime);
    const endTime = formatTime(availability.endTime);

    return `${startTime} - ${endTime}`;
  };

  if (service.ageRestricted && !isUserVerified) {
    return null;
  }

  return (
    <>
      <Col key={service.id}>
        <Card className="h-100 shadow-sm text-center position-relative">
          <div className="display-1 mt-4">
            <div
              style={{
                fontSize: '4rem',
                lineHeight: '1',
                marginBottom: '1rem'
              }}
            >
              {getServiceIcon(service.name)}
            </div>
          </div>

          <Card.Body className="d-flex flex-column">
            <Card.Title>
              {service.name}
            </Card.Title>

            <Card.Text className="flex-grow-1">
              {service.description || 'Servicio disponible en esta estación'}
            </Card.Text>

            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>🕐</span>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                  {getAvailabilityText()}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <div className="h5 fw-bold">
                ${service.price}
              </div>
            </div>

            <Button
              style={buttonStyle}
              onClick={handleShow}
            >
              Ver Detalles
            </Button>
          </Card.Body>
        </Card>
      </Col>

      <ModalComprar
        showModal={showModal}
        handleClose={handleClose}
        item={service}
        selectedBranchId={selectedBranchId}
        tenantUIConfig={tenantUIConfig}
        isService={true}
      />
    </>
  );
};

export default Service;

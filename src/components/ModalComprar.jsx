import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'

import { createTransaction } from '../services/api';
import { generateRedemptionToken } from '../services/api';
import { QRCodeCanvas } from 'qrcode.react';
import { Spinner, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

import defaultImage from '../assets/default.jpg'

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const SERVICE_ICONS = {
  'Lavado de Vidrios': '🧽',
  'Lavado de Auto': '🚗',
  'Lavado de Motor': '🔧',
  'Cambio de Aceite': '🚗',
  'Revisión Técnica': '👩‍🔧',
  'Inflado de Neumáticos': '🛞',
  'Limpieza Interior': '🧹',
  'Pulido': '✨',
  'Encerado': '🪔',
  'Aspirado': '🧹',
  'default': '🧽'
};

const ModalComprar = ({
  selectedBranchId,
  showModal,
  handleClose,
  item,
  loyaltyProgram,
  refreshCatalog,
  tenantUIConfig,
  isService = false,
}) => {
  const { refreshUserData, tenantParameters } = useContext(AuthContext);

  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [qrToken, setQrToken] = useState('');
  const [canjeLoading, setCanjeLoading] = useState(false);
  const [_canjeError, setCanjeError] = useState('');

  const primaryColor = tenantUIConfig?.primaryColor || '#0d6efd';
  const secondaryColor = tenantUIConfig?.secondaryColor || '#ffc107';

  const primaryButtonStyle = {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
    color: '#fff'
  };

  const secondaryButtonStyle = {
    backgroundColor: secondaryColor,
    borderColor: secondaryColor,
    color: '#000'
  };

  const priceStyle = {
    color: primaryColor
  };

  const formatPrice = (price) => {
    const currency = tenantParameters?.find(param => param.key === 'Currency')?.value || 'USD';

    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const getServiceIcon = (serviceName) => {
    return SERVICE_ICONS[serviceName] || SERVICE_ICONS.default;
  };

  const handleQuantityChange = (newQuantity) => {
    const numQuantity = parseInt(newQuantity);
    if (numQuantity >= 1 && (!isService || numQuantity <= (item.stock || 999))) {
      setQuantity(numQuantity);
    }
  };

  const incrementQuantity = () => {
    if (isService || quantity < (item.stock || 999)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = item.price * quantity;
  const totalPoints = Math.ceil(totalPrice / (loyaltyProgram?.pointsValue || 1));

  const handleBuy = async () => {
    if (isService) {
      alert('La compra de servicios aún no está implementada');
      return;
    }
    await createTransaction(selectedBranchId, item.id, quantity);
    setShowConfirmation(false);
    refreshUserData();
    refreshCatalog();
  }

  const handleConfirmPurchase = () => {
    if (isService) {
      alert('La compra de servicios aún no está implementada');
      return;
    }
    handleClose();
    setShowConfirmation(true);
  };

  const handleCancelConfirmation = () => {
    handleClose();
    setShowConfirmation(false);
  };

  const handleCloseQr = async () => {
    setQrToken('');
    handleClose();

    await refreshUserData();
    await refreshCatalog();
  };

  const handleRedeemPoints = async () => {
    if (isService) {
      alert('El canje de servicios aún no está implementado');
      return;
    }

    setCanjeLoading(true);
    setCanjeError('');
    try {
      const { token } = await generateRedemptionToken({ 
        branchId: selectedBranchId, 
        productId: item.id,
        quantity: quantity
      });
      setQrToken(token);
      await refreshUserData();
      await refreshCatalog();
    } catch (err) {
      console.error(err);
      setCanjeError('No se pudo generar el QR: ' + (err.message || ''));
    } finally {
      setCanjeLoading(false);
    }
  };

  if (qrToken) {
    const redemptionUrl = `${API_BASE}/Redemption/process/${qrToken}`;

    return (
      <Modal
        show={showModal}
        onHide={() => {
          setQrToken('');
          handleClose();
          refreshUserData();
          refreshCatalog();
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>¡Canje Realizado!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Mostrá este código QR en la estación para validar el canje.</p>
          <div className="d-inline-block p-3 bg-white shadow-sm mb-3">
            <QRCodeCanvas value={redemptionUrl} size={220} />
          </div>
          <div>
            <Button
              style={primaryButtonStyle}
              onClick={handleCloseQr}
            >
            Cerrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <>
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{item.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="text-center mb-4">
            {isService ? (
              <div
                style={{
                  fontSize: '6rem',
                  lineHeight: '1',
                  marginBottom: '1rem'
                }}
              >
                {getServiceIcon(item.name)}
              </div>
            ) : (
              <img
                src={item.imageUrl || defaultImage}
                alt={item.name}
                className="img-fluid"
                style={{
                  maxHeight: '200px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            )}
          </div>

          <div className="mb-3">
            <h5>Descripción</h5>
            <p>{item.description || item.descripcion || 'Servicio disponible en esta estación'}</p>
          </div>

          <div className="row mb-3">
            <div className="col-6">
              <h6>Precio Unitario</h6>
              <p className="fw-bold" style={priceStyle}>{formatPrice(item.price)}</p>
            </div>
            {!isService && (
              <div className="col-6">
                <h6>Stock Disponible</h6>
                <p className="text-success fw-bold">{item.stock} unidades</p>
              </div>
            )}
          </div>

          <div className="mb-3">
            <h6>Cantidad</h6>
            <InputGroup style={{ maxWidth: '200px' }}>
              <Button
                variant="outline-secondary"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                min="1"
                max={isService ? 999 : item.stock}
                style={{ textAlign: 'center' }}
              />
              <Button
                variant="outline-secondary"
                onClick={incrementQuantity}
                disabled={isService ? false : quantity >= item.stock}
              >
                +
              </Button>
            </InputGroup>
          </div>

          <div className="mb-3">
            <h6>Precio Total</h6>
            <p className="fw-bold" style={priceStyle}>{formatPrice(totalPrice)}</p>
          </div>

          {loyaltyProgram && !isService && (
            <div className="mb-3">
              <h6>Puntos Necesarios</h6>
              <p className="fw-bold" style={{ color: secondaryColor }}>{totalPoints} puntos</p>
            </div>
          )}

          {isService && (
            <Alert variant="info">
              <strong>Nota:</strong> La compra de servicios aún no está implementada. Esta funcionalidad estará disponible próximamente.
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          {!isService && loyaltyProgram && (
            <Button
              style={secondaryButtonStyle}
              onClick={handleRedeemPoints}
              disabled={canjeLoading}
            >
              {canjeLoading ? <Spinner animation="border" size="sm" /> : 'Canjear con Puntos'}
            </Button>
          )}
          <Button
            style={primaryButtonStyle}
            onClick={handleConfirmPurchase}
            disabled={isService}
          >
            {isService ? 'Próximamente' : 'Comprar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmation} onHide={handleCancelConfirmation} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Compra</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="text-center mb-3">
            <img
              src={item.imageUrl || defaultImage}
              alt={item.name}
              className="img-fluid"
              style={{
                maxHeight: '100px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>

          <h6 className="text-center mb-3">{item.name}</h6>

          <div className="row text-center">
            <div className="col-4">
              <small className="text-muted">Cantidad</small>
              <p className="fw-bold">{quantity}</p>
            </div>
            <div className="col-4">
              <small className="text-muted">Precio Unitario</small>
              <p className="fw-bold">{formatPrice(item.price)}</p>
            </div>
            <div className="col-4">
              <small className="text-muted">Total</small>
              <p className="fw-bold text-primary">{formatPrice(totalPrice)}</p>
            </div>
          </div>

          <div className="alert alert-info mt-3">
            <small>
              <i className="bi bi-info-circle me-2"></i>
              ¿Estás seguro de que quieres proceder con esta compra?
            </small>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelConfirmation}>
            Cancelar
          </Button>
          <Button style={primaryButtonStyle} onClick={handleBuy}>
            Confirmar Compra
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalComprar;

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

const ModalComprar = ({
  selectedBranchId,
  showModal,
  handleClose,
  item,
  loyaltyProgram,
  refreshCatalog,
}) => {
  const { refreshUserData } = useContext(AuthContext);

  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [qrToken, setQrToken] = useState('');
  const [canjeLoading, setCanjeLoading] = useState(false);
  const [canjeError, setCanjeError] = useState('');


  const handleQuantityChange = (newQuantity) => {
    const numQuantity = parseInt(newQuantity);
    if (numQuantity >= 1 && numQuantity <= item.stock) {
      setQuantity(numQuantity);
    }
  };

  const incrementQuantity = () => {
    if (quantity < item.stock) {
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
    await createTransaction(selectedBranchId, item.id, quantity);
    setShowConfirmation(false);
    refreshUserData();
    refreshCatalog();
  }

  const handleConfirmPurchase = () => {
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
    // Refresca ambos después de un canje exitoso
    await refreshUserData();
    await refreshCatalog();
  };

  const handleRedeemPoints = async () => {
    setCanjeLoading(true);
    setCanjeError('');
    try {
      const { token } = await generateRedemptionToken({ branchId: selectedBranchId, productId: item.id });
      console.log('TOKEN RECIBIDO →', token);
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

          <div className="mt-2">
            <a
              href={redemptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ wordBreak: 'break-all' }}
            >
              {redemptionUrl}
            </a>
          </div>

          <div>
            <Button
              variant="secondary"
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
          </div>

          <div className="mb-3">
            <h5>Descripción</h5>
            <p>{item.descripcion}</p>
          </div>

          <div className="row mb-3">
            <div className="col-6">
              <h6>Precio Unitario</h6>
              <p className="text-primary fw-bold">${item.price}</p>
            </div>
            <div className="col-6">
              <h6>Stock Disponible</h6>
              <p className="text-success fw-bold">{item.stock} unidades</p>
            </div>
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
                min={1}
                max={item.stock}
                style={{ textAlign: 'center' }}
                disabled
              />
              <Button
                variant="outline-secondary"
                onClick={incrementQuantity}
                disabled={quantity >= item.stock}
              >
                +
              </Button>
            </InputGroup>
          </div>

          <div className="mb-3 p-3 bg-light rounded">
            <div className="row">
              <div className="col-6">
                <h6>Precio Total</h6>
                <p className="text-primary fw-bold fs-5">${totalPrice}</p>
              </div>
              <div className="col-6">
                <h6>Puntos Necesarios</h6>
                <p className="text-warning fw-bold fs-5">{totalPoints} pts</p>
              </div>
            </div>
          </div>

          {item.costoPuntos && (
            <div className="mb-3">
              <h6>Canjear con Puntos (Precio fijo)</h6>
              <p className="text-warning fw-bold">{item.costoPuntos} puntos</p>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>

            <div className='d-flex gap-2'>
              <Button
                variant="warning"
                onClick={handleRedeemPoints}
                disabled={canjeLoading || !!qrToken || (item.costoPuntos && item.costoPuntos > (loyaltyProgram?.userPoints || 0))}
              >
                {canjeLoading
                  ? <Spinner animation="border" size="sm" />
                  : item.costoPuntos
                    ? `Canjear (${item.costoPuntos}pts)`
                    : `Canjear (${totalPoints}pts)`
                }
              </Button>

              <Button
                variant="primary"
                onClick={handleConfirmPurchase}
              >
                Comprar (${totalPrice})
              </Button>
            </div>
          </div>
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
              <p className="fw-bold">${item.price}</p>
            </div>
            <div className="col-4">
              <small className="text-muted">Total</small>
              <p className="fw-bold text-primary">${totalPrice}</p>
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
          <Button variant="success" onClick={handleBuy}>
            Confirmar Compra
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalComprar

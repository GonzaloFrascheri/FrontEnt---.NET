import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'

import defaultImage from '../assets/default.jpg'

const ModalComprar = ({
  showModal,
  handleClose,
  item,
  loyaltyProgram,
}) => {
  const [quantity, setQuantity] = useState(1);

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

  return (
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
              as={Link}
              to=""
              state={{ preselect: item.id, quantity: quantity }}
              variant="warning"
              onClick={handleClose}
            >
              Canjear ({totalPoints}pts)
            </Button>

            <Button
              as={Link}
              to="/buy"
              state={{ preselect: item.id, quantity: quantity }}
              variant="primary"
              onClick={handleClose}
            >
              Comprar (${totalPrice})
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalComprar

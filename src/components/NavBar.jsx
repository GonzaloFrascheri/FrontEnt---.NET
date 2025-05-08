// src/components/NavBar.jsx
import React, { useContext } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
import { AuthContext } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" className="mb-4">
      <Container>
        <Navbar.Text>
            <PersonCircle className="me-2" />
            {user.email}
        </Navbar.Text>
        <Button variant="outline-danger" onClick={logout}>
            <BoxArrowRight className="me-1" />
            Salir
        </Button>
      </Container>
    </Navbar>
  );
}

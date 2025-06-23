import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { validateMagicLink } from '../../services/api';

export default function ValidateMagicLinkPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = searchParams.get('token');

        if (!token) {
          setError('Token no encontrado en la URL');
          setLoading(false);
          return;
        }

        const response = await validateMagicLink(token);

        if (response.error) {
          setError(response.message || 'Error al validar el magic link');
          setLoading(false);
          return;
        }

        const authToken = response.data.token;
        await loginWithToken({ token: authToken });

        navigate('/', { replace: true });

      } catch (error) {
        console.error('Error validando magic link:', error);
        setError('Error al procesar el magic link. Por favor, intenta nuevamente.');
        setLoading(false);
      }
    };

    validateToken();
  }, [searchParams, navigate, loginWithToken]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Card className="text-center p-4 shadow-sm">
          <Spinner animation="border" className="mb-3" />
          <h5>Validando tu sesión...</h5>
          <p className="text-muted">Por favor espera mientras verificamos tu magic link.</p>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Card className="text-center p-4 shadow-sm">
          <Alert variant="danger">
            <h5>Error de Validación</h5>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Volver al Login
            </button>
          </Alert>
        </Card>
      </Container>
    );
  }

  return null;
}

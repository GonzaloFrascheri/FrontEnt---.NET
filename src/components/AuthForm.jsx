import { useState } from 'react';
import googleLogo from '../assets/Google.png';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { getMagicLink } from '../services/api';

export default function AuthForm({
  onSubmit,
  googleLogin
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  const handleMagicLinkSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await getMagicLink(magicLinkEmail);
      setMagicLinkSent(true);
    } catch (error) {
      console.error('Error enviando magic link:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setLoading(false);
    }
  };

  const handleShowMagicLink = () => {
    setShowMagicLink(true);
    setMagicLinkEmail(email);
  };

  const handleBackToLogin = () => {
    setShowMagicLink(false);
    setMagicLinkSent(false);
  };

  if (showMagicLink) {
    return (
      <div className="auth-card">
        <h2 className="auth-card__title">
          {magicLinkSent ? 'Email Enviado' : 'Login con Magic Link'}
        </h2>

        {magicLinkSent ? (
          <div className="auth-card__magic-link-success">
            <p className="auth-card__message">
              Hemos enviado un enlace a:
            </p>
            <p className="auth-card__email" style={{ color: '#0D6EFD' }}>{magicLinkEmail}</p>
            <p className="auth-card__message">
              Haz clic en el enlace del email para iniciar sesión automáticamente.
            </p>
            <button
              onClick={handleBackToLogin}
              className="auth-card__button auth-card__button--secondary"
            >
              Volver al Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleMagicLinkSubmit} className="auth-card__form">
            <label className="auth-card__label">
              <input
                type="email"
                className="auth-card__input"
                placeholder="Email"
                value={magicLinkEmail}
                onChange={e => setMagicLinkEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="auth-card__button">
              {loading ? <Spinner animation="border" size="sm" /> : "Enviar Magic Link"}
            </button>
            <button
              type="button"
              onClick={handleBackToLogin}
              style={{ background: 'none', border: 'none', padding: 0, margin: '10px 0', textDecoration: 'underline', color: '#0D6EFD' }}
            >
              Volver
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">Login</h2>
      <form onSubmit={handleSubmit} className="auth-card__form">
        <label className="auth-card__label">
          <input
            type="email"
            className="auth-card__input"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="auth-card__label">
          <input
            type="password"
            className="auth-card__input"
            placeholder='Contraseña'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="auth-card__button">
          Ingresar
        </button>
      </form>

      <div className="auth-card__divider mt-4">o</div>

      <button
        onClick={handleShowMagicLink}
        style={{ background: 'none', border: 'none', padding: 0, margin: '10px 0', textDecoration: 'underline', color: '#0D6EFD' }}
      >
        Login con Magic Link
      </button>

      <div className="auth-card__divider mb-4">o</div>

      <p>
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="auth-card__link">
          Regístrate
        </Link>
      </p>
      <hr />
      <button
        onClick={googleLogin}
        className="auth-card__button auth-card__button--google"
      >
        <img src={googleLogo} alt="Google logo" className="auth-card__google-icon" />
        Iniciar con Google
      </button>
    </div>
  );
}

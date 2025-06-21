import { useState } from 'react';
import googleLogo from '../assets/Google.png';
import { Link } from 'react-router-dom';

export default function AuthForm({
  onSubmit,
  googleLogin
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ email, password });
  };

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
      <div className="auth-card__divider">o</div>
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

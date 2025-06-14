import { useState } from 'react';
import { register } from '../../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await register(form);
      // Aquí podrías manejar lo que devuelve tu API (token, mensaje, etc.)
      console.log('Respuesta del backend:', res);
      // Redirecciona o muestra mensaje de éxito
    } catch (err) {
      // Manejar error, por ejemplo, mostrar mensaje
      console.error('Error en el registro:', err);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">Regístrate</h2>
      <form onSubmit={handleSubmit} className="auth-card__form">
        <label className="auth-card__label">
          <input
            name="name"
            type="text"
            className="auth-card__input"
            placeholder='Nombre'
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className="auth-card__label">
          <input
            name="email"
            type="email"
            className="auth-card__input"
            placeholder='Email'
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label className="auth-card__label">
          <input
            name="password"
            type="password"
            className="auth-card__input"
            placeholder='Contraseña'
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className="auth-card__button">
          Crear cuenta
        </button>
      </form>
    </div>
  );
}

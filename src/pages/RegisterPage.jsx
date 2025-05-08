import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Datos de registro:', form);
    // aquí luego llamarás a tu API de registro
  };

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">Regístrate</h2>
      <form onSubmit={handleSubmit} className="auth-card__form">
        <label className="auth-card__label">
          <input
            name="nombre"
            type="text"
            className="auth-card__input"
            placeholder='Nombre'
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </label>
        <label className="auth-card__label">
          <input
            name="apellido"
            type="text"
            className="auth-card__input"
            placeholder='Apellido'
            value={form.apellido}
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

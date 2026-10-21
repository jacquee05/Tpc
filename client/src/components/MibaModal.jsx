import { useState } from 'react'

export default function MibaModal({ open, onClose }) {
  const [modo, setModo] = useState('register') // 'register' | 'login'

  if (!open) return null

  const esRegistro = modo === 'register'

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('¡Formulario enviado correctamente!')
  }

  return (
    <div
      className="miba-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="miba-modal-card">
        <button type="button" className="miba-close-btn" onClick={onClose} aria-label="Cerrar">
          &times;
        </button>

        <div className="miba-header">
          <div className="miba-badge">
            <span className="miba-badge-dot"></span> miBA
          </div>
          <h2>Acceder a tu cuenta</h2>
          <p>Ingresá tus datos para gestionar solicitudes y reclamos</p>
        </div>

        <div className="miba-tabs">
          <button
            type="button"
            className={`miba-tab-btn ${esRegistro ? 'active' : ''}`}
            onClick={() => setModo('register')}
          >
            Registrarse
          </button>
          <button
            type="button"
            className={`miba-tab-btn ${!esRegistro ? 'active' : ''}`}
            onClick={() => setModo('login')}
          >
            Iniciar Sesión
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {esRegistro && (
            <div className="miba-form-row">
              <div className="miba-field">
                <label htmlFor="miba-nombre">Nombre</label>
                <input type="text" id="miba-nombre" placeholder="Juan" required />
              </div>
              <div className="miba-field">
                <label htmlFor="miba-apellido">Apellido</label>
                <input type="text" id="miba-apellido" placeholder="Pérez" required />
              </div>
            </div>
          )}

          <div className="miba-field">
            <label htmlFor="miba-email">Correo Gmail / Email</label>
            <input type="email" id="miba-email" placeholder="usuario@gmail.com" required />
          </div>

          <div className="miba-field">
            <label htmlFor="miba-password">Contraseña</label>
            <input type="password" id="miba-password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="miba-submit-btn">
            {esRegistro ? 'Crear Cuenta miBA' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

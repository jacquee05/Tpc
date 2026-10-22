import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3000/api/usuarios'

// modoInicial: pestaña con la que se abre ('register' | 'login'); mensajeInicial: aviso verde opcional
export default function MibaModal({ open, onClose, modoInicial = 'register', mensajeInicial = '' }) {
  const [modo, setModo] = useState('register') // 'register' | 'login'
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  // Cada vez que se abre el modal, arranca en la pestaña pedida y con su mensaje
  useEffect(() => {
    if (open) {
      setModo(modoInicial)
      setExito(mensajeInicial)
      setError('')
      setPassword('')
    }
  }, [open, modoInicial, mensajeInicial])

  if (!open) return null

  const esRegistro = modo === 'register'

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo)
    setError('')
    setExito('')
  }

  const post = async (ruta, body) => {
    const res = await fetch(`${API}/${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, data }
  }

  const iniciarSesion = async () => {
    const { ok, data } = await post('login', { email, password })
    if (!ok) {
      setError(data.mensaje || 'Credenciales incorrectas')
      return
    }
    localStorage.setItem('token', data.token)
    if (data.usuario?.id) localStorage.setItem('usuarioId', data.usuario.id)
    onClose()
    navigate('/me')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')
    setCargando(true)
    try {
      if (esRegistro) {
        const { ok, data } = await post('registro', {
          nombre: `${nombre} ${apellido}`.trim(),
          email,
          password
        })
        if (!ok) {
          setError(data.error || data.mensaje || 'No se pudo crear la cuenta')
          return
        }
        // Cuenta creada: pasamos a iniciar sesión (sin loguear automáticamente)
        setModo('login')
        setPassword('')
        setNombre('')
        setApellido('')
        setExito('¡Cuenta creada! Ahora iniciá sesión.')
      } else {
        await iniciarSesion()
      }
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setCargando(false)
    }
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
            onClick={() => cambiarModo('register')}
          >
            Registrarse
          </button>
          <button
            type="button"
            className={`miba-tab-btn ${!esRegistro ? 'active' : ''}`}
            onClick={() => cambiarModo('login')}
          >
            Iniciar Sesión
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {esRegistro && (
            <div className="miba-form-row">
              <div className="miba-field">
                <label htmlFor="miba-nombre">Nombre</label>
                <input type="text" id="miba-nombre" placeholder="Juan" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="miba-field">
                <label htmlFor="miba-apellido">Apellido</label>
                <input type="text" id="miba-apellido" placeholder="Pérez" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
              </div>
            </div>
          )}

          <div className="miba-field">
            <label htmlFor="miba-email">Correo Gmail / Email</label>
            <input type="email" id="miba-email" placeholder="usuario@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="miba-field">
            <label htmlFor="miba-password">Contraseña</label>
            <input type="password" id="miba-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {exito && <p className="miba-exito" role="status" style={{ color: '#2e7d32', margin: '8px 0' }}>{exito}</p>}
          {error && <p className="miba-error" role="alert" style={{ color: '#c62828', margin: '8px 0' }}>{error}</p>}

          <button type="submit" className="miba-submit-btn" disabled={cargando}>
            {cargando ? 'Procesando...' : esRegistro ? 'Crear Cuenta miBA' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
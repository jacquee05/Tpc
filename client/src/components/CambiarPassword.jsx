import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Formulario de cambio de contraseña. Si sale bien, se borra la sesión y se abre el login de miBA.
export default function CambiarPassword({ onSuccess }) {
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordConfirmacion, setPasswordConfirmacion] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (passwordNueva !== passwordConfirmacion) {
      setError('La nueva contraseña y su confirmación no coinciden')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      setError('No estás autenticado. Iniciá sesión de nuevo.')
      return
    }

    setGuardando(true)
    try {
      const res = await fetch('http://localhost:3000/api/usuarios/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ passwordActual, passwordNueva, passwordConfirmacion })
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        // Éxito: eliminamos el token guardado, volvemos al inicio y abrimos el login del modal miBA
        localStorage.removeItem('token')
        localStorage.removeItem('usuarioId')
        navigate('/')
        onSuccess?.()
      } else {
        setError(data.mensaje || 'No se pudo cambiar la contraseña')
      }
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 32, maxWidth: 420 }}>
      <h3>Cambiar contraseña</h3>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="pw-actual">Contraseña actual</label>
        <br />
        <input
          id="pw-actual"
          type="password"
          value={passwordActual}
          onChange={(e) => setPasswordActual(e.target.value)}
          autoComplete="current-password"
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="pw-nueva">Contraseña nueva</label>
        <br />
        <input
          id="pw-nueva"
          type="password"
          value={passwordNueva}
          onChange={(e) => setPasswordNueva(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="pw-confirmacion">Confirmar contraseña nueva</label>
        <br />
        <input
          id="pw-confirmacion"
          type="password"
          value={passwordConfirmacion}
          onChange={(e) => setPasswordConfirmacion(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
          style={{ width: '100%' }}
        />
      </div>

      {error && <p role="alert" style={{ color: '#c62828' }}>{error}</p>}

      <button type="submit" disabled={guardando}>
        {guardando ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  )
}

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../api'

const PRIORIDADES = ['urgente', 'alta', 'media', 'baja']
const ESTADOS = ['pendiente', 'en proceso', 'finalizado', 'en cuenta']

// Una tarjeta de reporte que se puede editar y borrar
function ReporteItem({ reporte, onGuardado, onBorrado }) {
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState(reporte)
  const [error, setError] = useState('')

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await apiFetch(`/reportes/${reporte.id}`, {
        method: 'PUT',
        body: {
          titulo: form.titulo,
          descripcion: form.descripcion,
          prioridad: form.prioridad,
          estado: form.estado
        }
      })
      onGuardado(data.reporte)
      setEditando(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const borrar = async () => {
    if (!window.confirm(`¿Eliminar el reporte "${reporte.titulo}"?`)) return
    try {
      await apiFetch(`/reportes/${reporte.id}`, { method: 'DELETE' })
      onBorrado(reporte.id)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px' }}>
      {editando ? (
        <form onSubmit={guardar}>
          <div>
            <label>Título: </label>
            <input value={form.titulo} onChange={cambiar('titulo')} required />
          </div>
          <div>
            <label>Descripción: </label>
            <textarea value={form.descripcion} onChange={cambiar('descripcion')} required />
          </div>
          <div>
            <label>Prioridad: </label>
            <select value={form.prioridad} onChange={cambiar('prioridad')}>
              {PRIORIDADES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label>Estado: </label>
            <select value={form.estado} onChange={cambiar('estado')}>
              {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button type="submit">Guardar cambios</button>{' '}
          <button type="button" onClick={() => { setForm(reporte); setEditando(false) }}>Cancelar</button>
        </form>
      ) : (
        <>
          <h3>{reporte.titulo}</h3>
          <p>{reporte.descripcion}</p>
          <small>
            Estado: {reporte.estado} | Prioridad: {reporte.prioridad} |{' '}
            {new Date(reporte.fecha_creacion).toLocaleDateString('es-AR')}
          </small>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => setEditando(true)}>Editar</button>
            <button
              type="button"
              onClick={borrar}
              style={{ backgroundColor: '#c62828', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer' }}
            >
              Eliminar
            </button>
          </div>
        </>
      )}
      {error && <p role="alert" style={{ color: '#c62828' }}>{error}</p>}
    </div>
  )
}

// Detalle de un usuario: sus datos (editables), su botón de borrar y sus reportes.
export default function UsuarioDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState(null)
  const [reportes, setReportes] = useState([])
  const [form, setForm] = useState({ nombre: '', email: '' })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    Promise.all([
      apiFetch(`/usuarios/users/${id}`),
      apiFetch(`/usuarios/users/${id}/reportes`)
    ])
      .then(([u, r]) => {
        setUsuario(u)
        setForm({ nombre: u.nombre, email: u.email })
        setReportes(r)
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [id])

  const guardarUsuario = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')
    try {
      const data = await apiFetch(`/usuarios/users/${id}`, { method: 'PUT', body: form })
      setUsuario(data.usuario)
      setMensaje('Cambios guardados')
    } catch (err) {
      setError(err.message)
    }
  }

  const borrarUsuario = async () => {
    if (!window.confirm(`¿Eliminar a ${usuario.nombre}? Se borrarán también sus ${reportes.length} reportes.`)) return
    try {
      await apiFetch(`/usuarios/users/${id}`, { method: 'DELETE' })
      navigate('/usuarios')
    } catch (err) {
      setError(err.message)
    }
  }

  const reporteGuardado = (nuevo) =>
    setReportes((lista) => lista.map((r) => (r.id === nuevo.id ? nuevo : r)))

  const reporteBorrado = (reporteId) =>
    setReportes((lista) => lista.filter((r) => r.id !== reporteId))

  if (cargando) return <p>Cargando...</p>
  if (!usuario) return <p role="alert" style={{ color: '#c62828' }}>{error || 'Usuario no encontrado'}</p>

  return (
    <section className="section">
      <div className="wrap">
        <p><Link to="/usuarios">Volver a usuarios</Link></p>
        <h2>{usuario.nombre}</h2>

        <form onSubmit={guardarUsuario}>
          <div>
            <label>Nombre: </label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div>
            <label>Email: </label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <button type="submit">Guardar cambios</button>{' '}
          <button
            type="button"
            onClick={borrarUsuario}
            style={{ backgroundColor: '#c62828', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer' }}
          >
            Eliminar usuario
          </button>
        </form>

        {mensaje && <p role="status" style={{ color: '#2e7d32' }}>{mensaje}</p>}
        {error && <p role="alert" style={{ color: '#c62828' }}>{error}</p>}

        <h3 style={{ marginTop: '30px' }}>Reportes de este usuario ({reportes.length})</h3>
        {reportes.length === 0 ? (
          <p>Este usuario todavía no hizo ningún reporte.</p>
        ) : (
          reportes.map((r) => (
            <ReporteItem key={r.id} reporte={r} onGuardado={reporteGuardado} onBorrado={reporteBorrado} />
          ))
        )}
      </div>
    </section>
  )
}

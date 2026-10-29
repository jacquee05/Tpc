import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api'

// Listado de usuarios: ver, entrar al detalle y borrar.
export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/usuarios/users')
      .then(setUsuarios)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  const borrar = async (u) => {
    if (!window.confirm(`¿Eliminar a ${u.nombre}? Se borrarán también todos sus reportes.`)) return
    try {
      await apiFetch(`/usuarios/users/${u.id}`, { method: 'DELETE' })
      setUsuarios((lista) => lista.filter((x) => x.id !== u.id))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <section className="section">
      <div className="wrap">
        <h2>Usuarios</h2>

        {cargando ? (
          <p>Cargando...</p>
        ) : error ? (
          <p role="alert" style={{ color: '#c62828' }}>{error}</p>
        ) : usuarios.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '8px' }}>Nombre</th>
                  <th style={{ padding: '8px' }}>Email</th>
                  <th style={{ padding: '8px' }}>Registro</th>
                  <th style={{ padding: '8px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px' }}>{u.nombre}</td>
                    <td style={{ padding: '8px' }}>{u.email}</td>
                    <td style={{ padding: '8px' }}>
                      {u.fecha_registro ? new Date(u.fecha_registro).toLocaleDateString('es-AR') : '-'}
                    </td>
                    <td style={{ padding: '8px', display: 'flex', gap: '8px' }}>
                      <Link to={`/usuarios/${u.id}`}>Ver y editar</Link>
                      <button
                        type="button"
                        onClick={() => borrar(u)}
                        style={{ backgroundColor: '#c62828', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer' }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

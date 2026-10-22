import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// "Mis solicitudes": lista de los reportes del usuario con sesión iniciada.
// Los reportes se crean desde cada categoría de la portada (botón "Iniciar esta solicitud").
export default function Posts() {
  const [reportes, setReportes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      setCargando(false)
      return
    }
    fetch('http://localhost:3000/api/reportes', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        if (res.status === 401) throw new Error('Tu sesión expiró. Volvé a iniciar sesión.')
        const data = await res.json()
        if (Array.isArray(data)) setReportes(data)
      })
      .catch((err) => setError(err.message || 'No se pudieron cargar tus solicitudes.'))
      .finally(() => setCargando(false))
  }, [token])

  return (
    <section className="section">
      <div className="wrap">
        <h2>Mis solicitudes</h2>

        {!token ? (
          <p>Iniciá sesión para ver tus solicitudes.</p>
        ) : cargando ? (
          <p>Cargando...</p>
        ) : error ? (
          <p role="alert" style={{ color: '#c62828' }}>{error}</p>
        ) : reportes.length === 0 ? (
          <p>
            Todavía no hiciste ninguna solicitud. <Link to="/#prestaciones">Elegí una categoría</Link> para empezar.
          </p>
        ) : (
          reportes.map((r) => (
            <div key={r.id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px' }}>
              <h3>{r.titulo}</h3>
              <p>{r.descripcion}</p>
              <small>Estado: {r.estado} | Prioridad: {r.prioridad}</small>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3000/api'

// Formulario para crear un reporte dentro de una categoría (prestación).
// `categoriaNombre` es el nombre de la categoría tal como está guardada en la base.
export default function NuevoReporteForm({ categoriaNombre }) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [prioridad, setPrioridad] = useState('baja')
  const [categoriaId, setCategoriaId] = useState('')
  const [direccionId, setDireccionId] = useState('1')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navigate = useNavigate()

  // Buscamos el id de la categoría por su nombre
  useEffect(() => {
    let cancelado = false
    fetch(`${API}/categorias`)
      .then((r) => r.json())
      .then((lista) => {
        const cat = Array.isArray(lista) && lista.find((c) => c.nombre === categoriaNombre)
        if (!cancelado) {
          if (cat) setCategoriaId(String(cat.id))
          else setError('No se encontró la categoría en el servidor.')
        }
      })
      .catch(() => !cancelado && setError('No se pudo conectar con el servidor.'))
    return () => { cancelado = true }
  }, [categoriaNombre])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      const res = await fetch(`${API}/reportes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          prioridad,
          categoria_id: parseInt(categoriaId),
          direccion_id: parseInt(direccionId)
        })
      })
      if (res.ok) {
        navigate('/reportes') // Mis solicitudes
      } else {
        const data = await res.json().catch(() => null)
        setError(data?.mensaje || 'Error al crear el reporte')
      }
    } catch {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="reporte-form" onSubmit={handleSubmit} style={{ marginTop: 24, maxWidth: 520 }}>
      <h3>Crear reporte</h3>

      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Título del reporte"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          rows={4}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Prioridad: </label>
        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>ID Categoría: </label>
        <input type="number" value={categoriaId} readOnly title={categoriaNombre} />
        <small> {categoriaNombre}</small>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>ID Dirección: </label>
        <input
          type="number"
          min="1"
          value={direccionId}
          onChange={(e) => setDireccionId(e.target.value)}
          required
        />
      </div>

      {error && <p role="alert" style={{ color: '#c62828' }}>{error}</p>}

      <button type="submit" className="btn-primary" disabled={enviando || !categoriaId}>
        {enviando ? 'Publicando...' : 'Publicar reporte'}
      </button>
    </form>
  )
}

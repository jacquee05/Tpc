import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PRESTACIONES_DATA } from '../data/prestaciones'
import NuevoReporteForm from '../components/NuevoReporte'

export default function Prestacion({ onLoginClick }) {
  const { id } = useParams()
  const data = PRESTACIONES_DATA[id]
  const [mostrarForm, setMostrarForm] = useState(false)
  const [necesitaSesion, setNecesitaSesion] = useState(false)

  // Al cambiar de prestación se reinicia el estado del formulario
  useEffect(() => {
    setMostrarForm(false)
    setNecesitaSesion(false)
  }, [id])

  const iniciarSolicitud = () => {
    if (localStorage.getItem('token')) {
      setNecesitaSesion(false)
      setMostrarForm(true)
    } else {
      setMostrarForm(false)
      setNecesitaSesion(true)
    }
  }

  useEffect(() => {
    document.title = data ? `${data.titulo} — ECO BA` : 'Prestación — ECO BA'
  }, [data])

  return (
    <section className="section detail">
      <div className="wrap">
        <Link className="back-link" to="/">← Volver a prestaciones</Link>

        {!data ? (
          <div className="detail-head">
            <span className="tag">No encontrada</span>
            <h1>No encontramos esta prestación</h1>
            <p>
              El link que seguiste no coincide con ninguna prestación disponible. Volvé al listado
              e intentá de nuevo.
            </p>
          </div>
        ) : (
          <>
            <div className="detail-head">
              <div className="icon icon--lg">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.8"
                  dangerouslySetInnerHTML={{ __html: data.iconPath }}
                />
              </div>
              <span className="tag">{data.tag}</span>
              <h1>{data.titulo}</h1>
              <p>{data.descripcion}</p>
            </div>

            <div className="detail-info">
              <div className="info-item">
                <h5>Tiempo estimado</h5>
                <p>{data.tiempo}</p>
              </div>
              <div className="info-item">
                <h5>Requisitos</h5>
                <p>{data.requisitos}</p>
              </div>
              <div className="info-item">
                <h5>Dónde se gestiona</h5>
                <p>{data.donde}</p>
              </div>
            </div>

            <button type="button" className="btn-primary" onClick={iniciarSolicitud}>
              Iniciar esta solicitud
            </button>

            {necesitaSesion && (
              <div className="login-aviso" role="alert" style={{ marginTop: 20, padding: 16, border: '1px solid #f0c36d', background: '#fff8e1', borderRadius: 8, maxWidth: 520 }}>
                <p style={{ margin: '0 0 12px' }}>
                  Tenés que iniciar sesión para completar el formulario de esta solicitud.
                </p>
                <button type="button" className="btn-ghost" onClick={onLoginClick}>
                  Ingresar con miBA
                </button>
              </div>
            )}

            {mostrarForm && <NuevoReporteForm categoriaNombre={data.titulo} />}
          </>
        )}
      </div>
    </section>
  )
}

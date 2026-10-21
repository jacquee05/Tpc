import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PRESTACIONES_DATA } from '../data/prestaciones'

export default function Prestacion() {
  const { id } = useParams()
  const data = PRESTACIONES_DATA[id]

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

            <a className="btn-primary" href="#">Iniciar esta solicitud</a>
          </>
        )}
      </div>
    </section>
  )
}

import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PRESTACIONES_DATA } from '../data/prestaciones'

const CATEGORIAS = [
  { id: 'calles-fachadas-veredas', texto: 'Baches, cordones, hidrolavado y reparaciones en el espacio público.' },
  { id: 'arbolado-espacios-verdes', texto: 'Poda, extracción y cuidado de árboles y plazas.' },
  { id: 'limpieza-residuos', texto: 'Recolección, contenedores y retiro de muebles en desuso.' },
  { id: 'alumbrado-publico', texto: 'Luminarias apagadas, intermitentes o dañadas.' },
  { id: 'obras-catastro', texto: 'Control edilicio, permisos y fiscalización de obras.' },
  { id: 'comercios-actividades', texto: 'Fiscalización de habilitaciones y actividades comerciales.' },
  { id: 'seguridad', texto: 'Solicitudes y propuestas vinculadas a la seguridad urbana.' },
  { id: 'transito-transporte', texto: 'Semáforos, señalización y estacionamiento medido.' },
]

const PASOS = [
  { n: '01', titulo: 'Elegí la prestación', texto: 'Buscá entre más de 300 categorías o filtrá por zona y tipo de reclamo.' },
  { n: '02', titulo: 'Contá qué pasa', texto: 'Sumá una foto y ubicá el punto exacto en el mapa de la Ciudad.' },
  { n: '03', titulo: 'Seguí el estado', texto: 'Recibí novedades y compartí tu pedido para que otros vecinos lo refuercen.' },
]

const STATS = [
  { b: '300+', span: 'prestaciones disponibles' },
  { b: '15', span: 'comunas cubiertas' },
  { b: '100%', span: 'online, sin turnos' },
  { b: '24/7', span: 'carga de solicitudes' },
]

export default function Home() {
  const { hash } = useLocation()

  // Scroll suave cuando se llega con /#prestaciones
  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hash])

  const irAPrestaciones = () =>
    document.getElementById('prestaciones')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-text">
            <div className="eyebrow-line"></div>
            <h1>Pedile a la Ciudad lo que tu barrio necesita.</h1>
            <p>
              Solicitudes, reclamos, propuestas y denuncias sobre arbolado, veredas, limpieza,
              alumbrado y mucho más — sin intermediarios, con seguimiento en tiempo real.
            </p>

            <div className="hero-actions">
              <button className="btn-primary" onClick={() => console.log('Iniciar una solicitud → conectar con el flujo real')}>
                Iniciar una solicitud
              </button>
              <button className="btn-ghost" onClick={irAPrestaciones}>
                Ver todas las prestaciones
              </button>
            </div>
          </div>

          <div className="hero-panel">
            <span className="tag">En el mapa</span>
            <h3>Reclamos activos cerca tuyo</h3>
            <p>Visualizá y reforzá los pedidos que ya hicieron tus vecinos en la Ciudad.</p>

            <div className="map-mock">
              <div className="pin pin--1"></div>
              <div className="pin pin--2"></div>
              <div className="pin pin--3"></div>
              <div className="pin pin--4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="wrap stats-grid">
          {STATS.map((s) => (
            <div className="stat" key={s.b}>
              <b>{s.b}</b>
              <span>{s.span}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="section" id="prestaciones">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Elegí qué querés resolver</h2>
              <p>Las categorías más solicitadas por los vecinos.</p>
            </div>
          </div>

          <div className="card-grid">
            {CATEGORIAS.map((c) => {
              const data = PRESTACIONES_DATA[c.id]
              return (
                <Link className="card" to={`/prestacion/${c.id}`} key={c.id}>
                  <div className="icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="1.8"
                      dangerouslySetInnerHTML={{ __html: data.iconPath }}
                    />
                  </div>
                  <h4>{data.titulo}</h4>
                  <p>{c.texto}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="section how">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Cómo funciona</h2>
              <p>Tres pasos, sin ir a ninguna oficina.</p>
            </div>
          </div>

          <div className="how-grid">
            {PASOS.map((p) => (
              <div className="how-card" key={p.n}>
                <div className="step-number">{p.n}</div>
                <h4>{p.titulo}</h4>
                <p>{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

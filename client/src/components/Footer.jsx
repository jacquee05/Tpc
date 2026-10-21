import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap foot-grid">
        <div>
          <h5>ECO BA</h5>
          <p className="foot-about">
            Plataforma de la Ciudad de Buenos Aires para solicitudes, reclamos y propuestas vecinales.
          </p>
        </div>

        <div>
          <h5>Plataforma</h5>
          <ul>
            <li><Link to="/#prestaciones">Todas las prestaciones</Link></li>
            <li><a href="#">Mapa de reclamos</a></li>
            <li><Link to="/reportes">Mis solicitudes</Link></li>
          </ul>
        </div>

        <div>
          <h5>Teléfonos útiles</h5>
          <ul>
            <li><a href="tel:147">147 — Atención ciudadana</a></li>
            <li><a href="tel:911">911 — Policía</a></li>
            <li><a href="tel:103">103 — Emergencias</a></li>
          </ul>
        </div>
      </div>

      <div className="wrap foot-bottom">
        Página de referencia inspirada en el estilo de BA Colaborativa — no es el sitio oficial del GCBA.
      </div>
    </footer>
  )
}

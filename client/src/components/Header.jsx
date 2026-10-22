import { Link } from 'react-router-dom'

export default function Header({ onLoginClick }) {
  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link className="brand" to="/" style={{ textDecoration: 'none' }}>
          <span className="dot"></span> ECO BA
        </Link>

        <nav className="navlinks">
          <Link to="/#prestaciones">Prestaciones</Link>   
          <Link to="/reportes">Mis solicitudes</Link>
          <a href="#">Mapa de la Ciudad</a>
          <Link to="/me">Perfil</Link>
          <Link to="/settings">Configuración</Link>
          <a href="#">Ayuda</a>
        </nav>

        <a
          className="cta-small"
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onLoginClick()
          }}
        >
          Ingresar con miBA
        </a>
      </div>
    </header>
  )
}

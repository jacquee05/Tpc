import { useState } from 'react';
import CambiarPassword from './CambiarPassword';

export default function AccountSetting({ onPasswordChanged }) {
  const [urlImagen, setUrlImagen] = useState('');
  const [mostrarPrimeraConfirmacion, setMostrarPrimeraConfirmacion] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [usuarioConfirmacion, setUsuarioConfirmacion] = useState('');
  const [passwordConfirmacion, setPasswordConfirmacion] = useState('');
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminacion, setErrorEliminacion] = useState('');

  const abrirConfirmacion = () => {
    setErrorEliminacion('');
    setMostrarPrimeraConfirmacion(true);
  };

  const continuarConfirmacion = () => {
    setUsuarioConfirmacion('');
    setPasswordConfirmacion('');
    setErrorEliminacion('');
    setMostrarPrimeraConfirmacion(false);
    setMostrarConfirmacion(true);
  };

  const handleEliminarCuenta = async (e) => {
    e.preventDefault();
    setErrorEliminacion('');

    if (!usuarioConfirmacion.trim() || !passwordConfirmacion) {
      setErrorEliminacion('Ingresá tu usuario y contraseña para continuar.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorEliminacion('Tu sesión expiró. Iniciá sesión nuevamente.');
      return;
    }

    setEliminando(true);
    try {
      const res = await fetch('http://localhost:3000/api/usuarios/me', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          usuario: usuarioConfirmacion.trim(),
          password: passwordConfirmacion
        })
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.mensaje || 'No se pudo desactivar la cuenta.');
      }

      localStorage.removeItem('token');
      alert(data?.mensaje || 'Cuenta desactivada correctamente.');
      window.location.href = '/';
    } catch (error) {
      setErrorEliminacion(error.message);
    } finally {
      setEliminando(false);
    }
  };

  const handleGuardarCambios = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('No estás autenticado. Por favor inicia sesión de nuevo.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ imagen_url: urlImagen })
      });

      if (res.ok) {
        alert('Imagen actualizada con éxito');
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.mensaje || 'Error al actualizar la imagen');
      }
    } catch (error) {
      console.error('Error al actualizar la imagen:', error);
      alert('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div>
      <h2>Configuración de la Cuenta</h2>
      <div>
        <label>URL de la nueva imagen:</label>
        <br />
        <input
          type="text"
          placeholder="https://..."
          value={urlImagen}
          onChange={(e) => setUrlImagen(e.target.value)}
        />
        <br /><br />
        <button type="button" onClick={handleGuardarCambios}>
          Guardar Cambios
        </button>
      </div>

      <CambiarPassword onSuccess={onPasswordChanged} />

      <section className="eliminar-cuenta">
        <h3>Desactivar cuenta</h3>
        <p>Tu cuenta dejará de estar disponible, pero tus reportes e historial se conservarán.</p>
        <button type="button" className="btn-ghost" onClick={abrirConfirmacion}>
          Desactivar mi cuenta
        </button>
      </section>

      {mostrarPrimeraConfirmacion && (
        <div className="confirmar-eliminacion-overlay">
          <section className="confirmar-eliminacion-modal" role="dialog" aria-modal="true" aria-labelledby="titulo-primera-confirmacion">
            <h2 id="titulo-primera-confirmacion">¿Querés desactivar tu cuenta?</h2>
            <p>Esta acción cerrará el acceso a tu cuenta. Tus reportes y datos históricos se conservarán.</p>
            <div className="confirmar-eliminacion-acciones">
              <button type="button" className="btn-ghost" onClick={() => setMostrarPrimeraConfirmacion(false)}>
                Cancelar
              </button>
              <button type="button" className="btn-eliminar-cuenta" onClick={continuarConfirmacion}>
                Continuar
              </button>
            </div>
          </section>
        </div>
      )}

      {mostrarConfirmacion && (
        <div
          className="confirmar-eliminacion-overlay"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !eliminando) {
              setMostrarConfirmacion(false);
            }
          }}
        >
          <section
            className="confirmar-eliminacion-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-confirmar-eliminacion"
          >
            <h2 id="titulo-confirmar-eliminacion">Confirmar desactivación de cuenta</h2>
            <p>
              Por seguridad, ingresá tus credenciales para confirmar que sos el titular
              de la cuenta. Esta acción desactivará tu cuenta.
            </p>

            <form onSubmit={handleEliminarCuenta}>
              <label htmlFor="usuario-confirmacion">Usuario o correo electrónico</label>
              <input
                id="usuario-confirmacion"
                type="text"
                autoComplete="username"
                value={usuarioConfirmacion}
                onChange={(e) => setUsuarioConfirmacion(e.target.value)}
                placeholder="Tu usuario o correo"
                required
                disabled={eliminando}
              />

              <label htmlFor="password-confirmacion">Contraseña</label>
              <input
                id="password-confirmacion"
                type="password"
                autoComplete="current-password"
                value={passwordConfirmacion}
                onChange={(e) => setPasswordConfirmacion(e.target.value)}
                placeholder="Tu contraseña"
                required
                disabled={eliminando}
              />

              {errorEliminacion && (
                <p className="confirmar-eliminacion-error" role="alert">
                  {errorEliminacion}
                </p>
              )}

              <div className="confirmar-eliminacion-acciones">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setMostrarConfirmacion(false)}
                  disabled={eliminando}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-eliminar-cuenta" disabled={eliminando}>
                  {eliminando ? 'Verificando...' : 'Confirmar y desactivar'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

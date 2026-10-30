import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUsuario] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/usuarios/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUsuario(data);
        }
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      }
    };

    if (token) {
      obtenerPerfil();
    }
  }, [token]);

  const limpiarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
  };

  const handleCerrarSesion = () => {
    limpiarSesion();
    navigate('/');
  };

  const handleEliminarCuenta = () => {
    navigate('/settings');
  };

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      
      <img 
        src={user.imagen_url || 'https://via.placeholder.com/150'} 
        alt="Foto de perfil" 
        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
      />

      <h3>{user.nombre}</h3>
      <p>{user.email}</p>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
        <button type="button" onClick={handleCerrarSesion}>
          Cerrar sesión
        </button>
        <button
          type="button"
          onClick={handleEliminarCuenta}
          style={{ backgroundColor: '#c62828', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer' }}
        >
          Configurar / desactivar cuenta
        </button>
      </div>
    </div>
  );
}

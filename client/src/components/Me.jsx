import { useEffect, useState } from 'react';

export default function Profile() {
  const [user, setUsuario] = useState(null);
  const token = localStorage.getItem('token');

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

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Mi Perfil</h2>
      
      <img 
        src={user.imagen_url || 'https://via.placeholder.com/150'} 
        alt="Foto de perfil" 
        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
      />

      <h3>{user.nombre}</h3>
      <p>{user.email}</p>
    </div>
  );
}
import { useEffect, useState } from 'react';

export default function Me() {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerPerfil = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No hay sesión activa. Por favor inicia sesión.');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/usuarios/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // 👈 Enviar token al middleware isAuth
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUsuario(data);
        } else {
          setError('Sesión expirada o no autorizada.');
        }
      } catch (err) {
        console.error('Error al obtener perfil:', err);
        setError('Error al conectar con el servidor.');
      }
    };

    obtenerPerfil();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div>
      <h2>Mi Perfil</h2>
      <p><strong>Nombre:</strong> {usuario.nombre}</p>
      <p><strong>Email:</strong> {usuario.email}</p>
    </div>
  );
}
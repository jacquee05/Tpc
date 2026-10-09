import { useEffect, useState } from 'react';

export default function Me() {
  const [usuario, setUsuario] = useState(null);
  const usuarioId = localStorage.getItem('usuarioId');

  useEffect(() => {
    if (usuarioId) {
      fetch(`http://localhost:3000/api/usuarios/${usuarioId}`)
        .then((res) => res.json())
        .then((data) => setUsuario(data))
        .catch((err) => console.error('Error al cargar perfil:', err));
    }
  }, [usuarioId]);

  if (!usuarioId) return <p>Por favor inicia sesión para ver tu perfil.</p>;
  if (!usuario) return <p>Cargando información del usuario...</p>;

  return (
    <div>
      <h2>Mi Perfil</h2>
      <p><strong>Nombre:</strong> {usuario.nombre}</p>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Fecha de Registro:</strong> {new Date(usuario.fecha_registro).toLocaleDateString()}</p>
      
      <h3>Roles asignados:</h3>
      <ul>
        {usuario.roles?.map((rol) => (
          <li key={rol.id}>{rol.nombre}</li>
        ))}
      </ul>
    </div>
  );
}
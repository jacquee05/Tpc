import { useState } from 'react';
import CambiarPassword from './CambiarPassword';

export default function AccountSetting({ onPasswordChanged }) {
  const [urlImagen, setUrlImagen] = useState('');

  console.log("Renderizando AccountSetting");

  const handleGuardarCambios = async () => {
    console.log("1. Se hizo clic en guardar cambios");

    const token = localStorage.getItem('token');
    console.log("2. Token encontrado:", token);

    if (!token) {
      alert('No estás autenticado. Por favor inicia sesión de nuevo.');
      return;
    }

    try {
      console.log("3. Intentando hacer fetch al backend...");
      const res = await fetch('http://localhost:3000/api/usuarios/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imagen_url: urlImagen 
        })
      });

      console.log("4. Respuesta recibida del backend:", res.status);

      if (res.ok) {
        alert('Imagen actualizada con éxito');
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.mensaje || 'Error al actualizar la imagen');
      }
    } catch (error) {
      console.error('Error en el fetch:', error);
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
        {/* Cambiamos el botón para que ejecute la función directamente */}
        <button type="button" onClick={handleGuardarCambios}>
          Guardar Cambios
        </button>
      </div>

      <CambiarPassword onSuccess={onPasswordChanged} />
    </div>
  );
}
// src/components/AccountSetting.jsx
import { useState } from 'react';

export default function AccountSetting() {
  const [imagen, setImagen] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      // Revisa si en tus rutas usas PUT o PATCH (debe coincidir con la definición del backend)
      const res = await fetch('http://localhost:3000/api/usuarios/me', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          // Si usas autenticación por token, descomenta la siguiente línea:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ imagen }), // Coincide con const { imagen } = req.body
      });

      if (res.ok) {
        alert('Imagen de perfil actualizada correctamente');
        setImagen('');
      } else {
        alert('Error al actualizar la imagen');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Configuración de la Cuenta</h2>
      
      <form onSubmit={handleUpdate}>
        <div>
          <label>URL de la nueva imagen:</label><br />
          <input 
            type="text" 
            value={imagen} 
            onChange={(e) => setImagen(e.target.value)} 
            placeholder="https://ejemplo.com/mi-foto.jpg"
            required
          />
        </div>
        <br />
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}
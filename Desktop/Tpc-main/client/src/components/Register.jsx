import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // No enviamos fecha_registro; la BD la asigna sola con DataTypes.NOW
        body: JSON.stringify({ nombre, email, password_hash: password })
      });

      if (res.ok) {
        alert('Usuario registrado exitosamente');
        navigate('/login');
      } else {
        const data = await res.json();
        alert(data.mensaje || 'Error al registrar');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Nombre:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
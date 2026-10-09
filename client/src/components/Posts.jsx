import { useEffect, useState } from 'react';

export default function Posts() {
  const [reportes, setReportes] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const usuarioId = localStorage.getItem('usuarioId');

  const cargarReportes = () => {
    fetch('http://localhost:3000/api/reportes')
      .then((res) => res.json())
      .then((data) => setReportes(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    cargarReportes();
  }, []);

  const handleCrearReporte = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          descripcion,
          prioridad: 'alta',
          estado: 'en proceso',
          usuario_id: usuarioId,
          fecha_creacion: new Date().toISOString(),
          categoria_id: 1, // ID por defecto de la categoría
          direccion_id: 1  // ID por defecto de la dirección
        })
      });

      if (res.ok) {
        setTitulo('');
        setDescripcion('');
        cargarReportes();
      }
    } catch (error) {
      console.error('Error al crear el reporte:', error);
    }
  };

  return (
    <div>
      <h2>Crear Reporte</h2>
      {usuarioId ? (
        <form onSubmit={handleCrearReporte}>
          <input 
            type="text" 
            placeholder="Título del reporte" 
            value={titulo} 
            onChange={(e) => setTitulo(e.target.value)} 
            required 
          />
          <textarea 
            placeholder="Descripción" 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)} 
            required 
          />
          <button type="submit">Publicar Reporte</button>
        </form>
      ) : (
        <p>Inicia sesión para crear reportes.</p>
      )}

      <h2>Lista de Reportes</h2>
      {reportes.map((r) => (
        <div key={r.id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px' }}>
          <h3>{r.titulo}</h3>
          <p>{r.descripcion}</p>
          <small>Estado: {r.estado} | Prioridad: {r.prioridad}</small>
        </div>
      ))}
    </div>
  );
}
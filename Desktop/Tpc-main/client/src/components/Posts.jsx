import { useEffect, useState } from 'react';

export default function Posts() {
  const [reportes, setReportes] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('baja');
  const [categoriaId, setCategoriaId] = useState('1');
  const [direccionId, setDireccionId] = useState('1');

  const token = localStorage.getItem('token');

  const cargarReportes = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/reportes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setReportes(data);
        }
      }
    } catch (err) {
      console.error('Error de red al cargar reportes:', err);
    }
  };

  useEffect(() => {
    if (token) {
      cargarReportes();
    }
  }, [token]);

  const handleCrearReporte = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/reportes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          prioridad,
          categoria_id: parseInt(categoriaId),
          direccion_id: parseInt(direccionId)
        })
      });

      if (res.ok) {
        setTitulo('');
        setDescripcion('');
        cargarReportes();
      } else {
        const errorData = await res.json().catch(() => null);
        alert(errorData?.mensaje || 'Error al crear el reporte');
      }
    } catch (error) {
      console.error('Error al crear el reporte:', error);
    }
  };

  return (
    <div>
      <h2>Crear Reporte</h2>
      {token ? (
        <form onSubmit={handleCrearReporte}>
          <div>
            <input 
              type="text" 
              placeholder="Título del reporte" 
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
              required 
            />
          </div>
          <br />
          <div>
            <textarea 
              placeholder="Descripción" 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              required 
            />
          </div>
          <br />
          <div>
            <label>Prioridad: </label>
           <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
  <option value="baja">Baja</option>
  <option value="media">Media</option>
  <option value="alta">Alta</option> {/* Asegúrate de que value="alta" sea minúscula */}
</select>
          </div>
          <br />
          <div>
            <label>ID Categoría: </label>
            <input 
              type="number" 
              value={categoriaId} 
              onChange={(e) => setCategoriaId(e.target.value)} 
              required 
            />
          </div>
          <br />
          <div>
            <label>ID Dirección: </label>
            <input 
              type="number" 
              value={direccionId} 
              onChange={(e) => setDireccionId(e.target.value)} 
              required 
            />
          </div>
          <br />
          <button type="submit">Publicar Reporte</button>
        </form>
      ) : (
        <p>Inicia sesión para crear reportes.</p>
      )}

      <h2>Lista de Reportes</h2>
      {Array.isArray(reportes) && reportes.length > 0 ? (
        reportes.map((r) => (
          <div key={r.id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px' }}>
            <h3>{r.titulo}</h3>
            <p>{r.descripcion}</p>
            <small>Estado: {r.estado} | Prioridad: {r.prioridad}</small>
          </div>
        ))
      ) : (
        <p>No hay reportes disponibles.</p>
      )}
    </div>
  );
}
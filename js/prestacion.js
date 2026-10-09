

document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(window.location.search).get('id');
  const data = PRESTACIONES_DATA[id];

  if (!data) {
    mostrarNoEncontrada();
    return;
  }

  pintarPrestacion(data);
});

function pintarPrestacion(data) {
  document.title = `${data.titulo} — ECO BA`;

  document.getElementById('detalle-tag').textContent = data.tag;
  document.getElementById('detalle-titulo').textContent = data.titulo;
  document.getElementById('detalle-descripcion').textContent = data.descripcion;
  document.getElementById('detalle-tiempo').textContent = data.tiempo;
  document.getElementById('detalle-requisitos').textContent = data.requisitos;
  document.getElementById('detalle-donde').textContent = data.donde;

  document.getElementById('detalle-icon').innerHTML =
    `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8">${data.iconPath}</svg>`;

 
  document.getElementById('detalle-cta').href = '#';
}

function mostrarNoEncontrada() {
  document.getElementById('detalle-tag').textContent = 'No encontrada';
  document.getElementById('detalle-titulo').textContent = 'No encontramos esta prestación';
  document.getElementById('detalle-descripcion').textContent =
    'El link que seguiste no coincide con ninguna prestación disponible. Volvé al listado e intentá de nuevo.';
  document.getElementById('detalle-cta').style.display = 'none';
}

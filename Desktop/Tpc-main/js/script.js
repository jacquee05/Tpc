

document.addEventListener('DOMContentLoaded', () => {
  enableSmoothScroll();
  enableButtonFeedback();
});

/**
 * Hace que cualquier link que apunte a un #id
 * haga scroll suave en vez de salto brusco.
 */
function enableSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (targetId.length <= 1) return; // href="#" sin destino real

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}


function enableButtonFeedback() {
  const primaryButton = document.querySelector('.btn-primary');
  const ghostButton = document.querySelector('.btn-ghost');

  primaryButton?.addEventListener('click', () => {
    console.log('Iniciar una solicitud → conectar con el flujo real');
  });

  ghostButton?.addEventListener('click', () => {
    console.log('Ver todas las prestaciones → conectar con el listado real');
  });
}
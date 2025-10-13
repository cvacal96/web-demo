document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  const status = document.getElementById('status');

  if (!name || !email || !message) {
    status.textContent = 'Por favor, completa todos los campos.';
    status.style.color = 'red';
    return;
  }

  // Simulación de envío (para demo)
  status.textContent = 'Enviando...';
  status.style.color = '#333';

  setTimeout(() => {
    status.textContent = `¡Gracias, ${name}! Tu mensaje ha sido enviado.`;
    status.style.color = 'green';
    document.getElementById('contactForm').reset();
  }, 1000);
});

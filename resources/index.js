// Анимация появления логотипа и прыгающие буквы при наведении
window.addEventListener('DOMContentLoaded', () => {
  const logo = document.getElementById('logo');
  if (!logo) return;
  const letters = logo.querySelectorAll('span');

  // Плавное появление
  letters.forEach((span, i) => {
    span.style.opacity = '0';
    span.style.transform = 'translateY(-30px) scale(0.8)';
    setTimeout(() => {
      span.style.transition = 'all 0.5s cubic-bezier(.68,-0.55,.27,1.55)';
      span.style.opacity = '1';
      span.style.transform = 'translateY(0) scale(1)';
    }, 200 + i * 80);
  });

  // Прыгающая анимация при наведении
  letters.forEach((span, i) => {
    span.addEventListener('mouseenter', () => {
      span.classList.add('logo-bounce');
    });
    span.addEventListener('animationend', () => {
      span.classList.remove('logo-bounce');
    });
  });
});
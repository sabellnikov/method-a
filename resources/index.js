// Смена фона body при скролле по слайдам с плавной анимацией через CSS-переменную
const slides = document.querySelectorAll('.slide-section');

function setBodyBg(color) {
  document.documentElement.style.setProperty('--bg-dynamic', color);
}

function onScroll() {
  let current = 0;
  slides.forEach((slide, idx) => {
    const rect = slide.getBoundingClientRect();
    if (rect.top <= window.innerHeight/2 && rect.bottom >= window.innerHeight/2) {
      current = idx;
    }
  });
  const color = slides[current].getAttribute('data-bg');
  setBodyBg(color);
}

window.addEventListener('scroll', onScroll);
window.addEventListener('DOMContentLoaded', onScroll);

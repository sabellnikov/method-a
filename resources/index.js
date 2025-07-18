// Плавная смена фона body при скролле с помощью requestAnimationFrame
const slides = document.querySelectorAll('.slide-section');
let lastIndex = -1;
let ticking = false;

function setBodyBg(color) {
  document.documentElement.style.setProperty('--bg-dynamic', color);
}

function updateBg() {
  let current = 0;
  slides.forEach((slide, idx) => {
    const rect = slide.getBoundingClientRect();
    if (rect.top <= window.innerHeight/2 && rect.bottom >= window.innerHeight/2) {
      current = idx;
    }
  });
  if (current !== lastIndex) {
    const color = slides[current].getAttribute('data-bg');
    setBodyBg(color);
    lastIndex = current;
  }
  ticking = false;
}

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(updateBg);
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll);
window.addEventListener('DOMContentLoaded', updateBg);

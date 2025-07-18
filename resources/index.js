// Плавная смена фона body при скролле с помощью requestAnimationFrame
// Гарантированная последовательная прокрутка слайдов на мобильных устройствах
const slides = document.querySelectorAll('.slide-section');
let lastIndex = -1;
let ticking = false;
let scrollTimeout;

function setBodyBg(color) {
  document.documentElement.style.setProperty('--bg-dynamic', color);
}

function updateBgAndSnap() {
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
  // Принудительно скроллим к ближайшему слайду после свайпа
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    slides[current].scrollIntoView({behavior: 'smooth'});
  }, 80);
  ticking = false;
}

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(updateBgAndSnap);
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll);
window.addEventListener('DOMContentLoaded', updateBgAndSnap);

// Для работы скрипта подключите GSAP:

const sections = document.querySelectorAll('.slide-section');
const root = document.documentElement;

function updateBackground() {
  let found = false;
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (!found && rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      const bg = section.getAttribute('data-bg');
      gsap.to(root, { duration: 0.7, '--color-background-current': bg });
      found = true;
    }
  });
}

window.addEventListener('scroll', updateBackground);
window.addEventListener('resize', updateBackground);
document.addEventListener('DOMContentLoaded', updateBackground);


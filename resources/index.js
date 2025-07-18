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

document.addEventListener('DOMContentLoaded', function() {
  const methodIcon = document.getElementById('methodIcon');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalCircle = document.getElementById('modalCircle');
  const closeModalIcon = document.getElementById('closeModalIcon');

  function openModal() {
    modalOverlay.classList.remove('hidden');
    // Получаем координаты центра иконки
    const iconRect = methodIcon.getBoundingClientRect();
    const circle = modalCircle;
    // Устанавливаем круг и крестик в верхний правый угол
    const right = (window.innerWidth - iconRect.right + iconRect.width/2);
    const top = (iconRect.top + iconRect.height/2 - 40);
    circle.style.right = right + 'px';
    circle.style.top = top + 'px';
    closeModalIcon.style.right = right + 'px';
    closeModalIcon.style.top = top + 'px';
    closeModalIcon.style.display = 'block';
    // Вычисляем максимальный радиус для покрытия экрана
    const maxRadius = Math.sqrt(window.innerWidth**2 + window.innerHeight**2);
    // Анимация круга
    gsap.fromTo(circle, {
      scale: 0,
      opacity: 1
    }, {
      scale: maxRadius/40,
      duration: 0.6,
      ease: 'power2.out'
    });
  }
  function closeModal() {
    gsap.to(modalCircle, {
      scale: 0,
      opacity: 0.8,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        modalOverlay.classList.add('hidden');
        closeModalIcon.style.display = 'none';
      }
    });
  }
  methodIcon.addEventListener('click', openModal);
  closeModalIcon.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) closeModal();
  });
});


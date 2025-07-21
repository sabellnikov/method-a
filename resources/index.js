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
  const closeModalIcon = document.getElementById('closeModalIcon');

  function openModal() {
    modalOverlay.classList.remove('hidden');
    
    // Запрещаем скролл основного контента
    document.body.style.overflow = 'hidden';
    
    // Устанавливаем анимированный фон
    modalOverlay.style.background = 'var(--color-modal-background)';
    closeModalIcon.style.display = 'block';
    
    // Показываем контейнер с карточками (убираем скрывающие стили)
    const content = document.getElementById('modalContent');
    content.style.opacity = '1';
    content.style.transform = 'scale(1)';
    
    // Получаем центр иконки для волны
    const iconRect = methodIcon.getBoundingClientRect();
    const centerX = iconRect.left + iconRect.width / 2;
    const centerY = iconRect.top + iconRect.height / 2;
    const maxRadius = Math.sqrt(window.innerWidth**2 + window.innerHeight**2);
    
    // GSAP анимация волны
    gsap.fromTo(modalOverlay, 
      { clipPath: `circle(0px at ${centerX}px ${centerY}px)` },
      { 
        clipPath: `circle(${maxRadius}px at ${centerX}px ${centerY}px)`,
        duration: 0.6,
        ease: 'power2.out'
      }
    );
  }

  function closeModal() {
    const iconRect = methodIcon.getBoundingClientRect();
    const centerX = iconRect.left + iconRect.width / 2;
    const centerY = iconRect.top + iconRect.height / 2;
    
    gsap.to(modalOverlay, {
      clipPath: `circle(0px at ${centerX}px ${centerY}px)`,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        modalOverlay.classList.add('hidden');
        closeModalIcon.style.display = 'none';
        modalOverlay.style.clipPath = 'none';
        modalOverlay.style.background = 'transparent';
        
        // Возвращаем скролл основного контента
        document.body.style.overflow = 'auto';
        
        // Сбрасываем стили контейнера
        const content = document.getElementById('modalContent');
        content.style.opacity = '0';
        content.style.transform = 'scale(0)';
      }
    });
  }

  methodIcon.addEventListener('click', openModal);
  closeModalIcon.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) closeModal();
  });
});
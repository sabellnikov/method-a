document.addEventListener('DOMContentLoaded', function() {
  const methodIcon = document.getElementById('methodIcon');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModalIcon = document.getElementById('closeModalIcon');
  const content = document.getElementById('modalContent');

  function openModal() {
    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    modalOverlay.style.background = 'var(--color-modal-background)';
    closeModalIcon.style.display = 'block';

    content.style.opacity = '1';
    content.style.transform = 'scale(1)';

    const iconRect = methodIcon.getBoundingClientRect();
    const centerX = iconRect.left + iconRect.width / 2;
    const centerY = iconRect.top + iconRect.height / 2;
    const maxRadius = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);

    gsap.fromTo(
      modalOverlay,
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
        document.body.style.overflow = 'auto';

        content.style.opacity = '0';
        content.style.transform = 'scale(0)';
      }
    });
  }

  methodIcon.addEventListener('click', openModal);
  closeModalIcon.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
      closeModal();
    }
  });
});
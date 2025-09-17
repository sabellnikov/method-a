document.addEventListener('DOMContentLoaded', function() {
  const methodIcon = document.getElementById('methodIcon');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModalIcon = document.getElementById('closeModalIcon');
  const content = document.getElementById('modalContent');

  function openModal(centerX, centerY) {
    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    modalOverlay.style.background = 'var(--color-modal-background)';
    closeModalIcon.style.display = 'block';

    content.style.opacity = '1';
    content.style.transform = 'scale(1)';

    if (typeof centerX !== 'number' || typeof centerY !== 'number') {
      const iconRect = methodIcon.getBoundingClientRect();
      centerX = iconRect.left + iconRect.width / 2;
      centerY = iconRect.top + iconRect.height / 2;
    }
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

  methodIcon.addEventListener('click', function(e) {
    const rect = methodIcon.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    openModal(centerX, centerY);
  });
  closeModalIcon.addEventListener('click', closeModal);
  document.getElementById('contactsBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    openModal(centerX, centerY);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
      closeModal();
    }
  });
});
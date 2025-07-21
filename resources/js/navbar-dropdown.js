document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('toc-btn');
  const dropdown = document.getElementById('toc-dropdown');
  if (!btn || !dropdown) return;

  function showDropdown() {
    dropdown.classList.remove('opacity-0', 'invisible', 'scale-95');
    dropdown.classList.add('opacity-100', 'visible', 'scale-100');
    btn.setAttribute('aria-expanded', 'true');
  }
  function hideDropdown() {
    dropdown.classList.add('opacity-0', 'invisible', 'scale-95');
    dropdown.classList.remove('opacity-100', 'visible', 'scale-100');
    btn.setAttribute('aria-expanded', 'false');
  }
  function isDesktop() {
    return window.matchMedia('(min-width: 640px)').matches;
  }

  // Desktop: open on hover, close on mouseleave
  function setupDesktop() {
    btn.removeEventListener('click', mobileClickHandler);
    btn.addEventListener('mouseenter', showDropdown);
    btn.addEventListener('mouseleave', hideDropdown);
    dropdown.addEventListener('mouseenter', showDropdown);
    dropdown.addEventListener('mouseleave', hideDropdown);
    document.removeEventListener('click', mobileDocClickHandler);
    document.removeEventListener('keydown', mobileEscHandler);
  }

  // Mobile: open/close on click
  function setupMobile() {
    btn.removeEventListener('mouseenter', showDropdown);
    btn.removeEventListener('mouseleave', hideDropdown);
    dropdown.removeEventListener('mouseenter', showDropdown);
    dropdown.removeEventListener('mouseleave', hideDropdown);
    btn.addEventListener('click', mobileClickHandler);
    document.addEventListener('click', mobileDocClickHandler);
    document.addEventListener('keydown', mobileEscHandler);
  }

  function mobileClickHandler(e) {
    e.stopPropagation();
    if (dropdown.classList.contains('visible')) {
      hideDropdown();
    } else {
      showDropdown();
    }
  }
  function mobileDocClickHandler(e) {
    if (!dropdown.contains(e.target) && e.target !== btn) {
      hideDropdown();
    }
  }
  function mobileEscHandler(e) {
    if (e.key === 'Escape') hideDropdown();
  }

  // Initial setup
  function updateMode() {
    hideDropdown();
    if (isDesktop()) {
      setupDesktop();
    } else {
      setupMobile();
    }
  }

  updateMode();
  window.addEventListener('resize', updateMode);
});

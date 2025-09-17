// Navbar scroll progress functionality with smooth animation
let progressObj = { progress: 0 };
let isAnimating = false;

function updateProgressBar() {
  const navbar = document.getElementById('nav-bar');
  if (!navbar) return;

  const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
  const targetProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
  const progressDiff = Math.abs(targetProgress - progressObj.progress);

  // Всегда убиваем предыдущие анимации перед новой
  gsap.killTweensOf(progressObj);

  if (progressDiff > 0.05) {
    isAnimating = true;
    gsap.to(progressObj, {
      progress: targetProgress,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: function() {
        const fillPercent = progressObj.progress * 100;
        navbar.style.background = `linear-gradient(to right, var(--color-nav-fill) ${fillPercent}%, var(--color-nav-bg) ${fillPercent}%)`;
      },
      onComplete: function() {
        isAnimating = false;
      }
    });
  } else {
    // Маленькие изменения — обновляем сразу
    progressObj.progress = targetProgress;
    const fillPercent = progressObj.progress * 100;
    navbar.style.background = `linear-gradient(to right, var(--color-nav-fill) ${fillPercent}%, var(--color-nav-bg) ${fillPercent}%)`;
    isAnimating = false;
  }
}

// Handle anchor link clicks
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href^="#"]');
  if (link && link.getAttribute('href') !== '#') {
    setTimeout(() => {
      gsap.killTweensOf(progressObj);
      isAnimating = false;
      updateProgressBar();
    }, 10);
  }
});

window.addEventListener('scroll', function() {
  gsap.killTweensOf(progressObj);
  isAnimating = false;
  updateProgressBar();
});

// Initialize progress on page load
document.addEventListener('DOMContentLoaded', function() {
  progressObj.progress = 0;
  updateProgressBar();
});

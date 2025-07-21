// Navbar scroll progress functionality with smooth animation
let currentProgress = 0;
let targetProgress = 0;
let isAnimating = false;

function updateProgressBar() {
  const navbar = document.getElementById('nav-bar');
  if (!navbar) return;
  
  const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
  targetProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
  
  // If there's a significant jump (more than 5%), animate it
  const progressDiff = Math.abs(targetProgress - currentProgress);
  
  if (progressDiff > 0.05 && !isAnimating) {
    // Animate the progress bar
    isAnimating = true;
    gsap.to({ progress: currentProgress }, {
      progress: targetProgress,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: function() {
        currentProgress = this.targets()[0].progress;
        const fillPercent = currentProgress * 100;
        navbar.style.background = `linear-gradient(to right, var(--color-nav-fill) ${fillPercent}%, var(--color-nav-bg) ${fillPercent}%)`;
      },
      onComplete: function() {
        isAnimating = false;
      }
    });
  } else if (progressDiff <= 0.05 || isAnimating) {
    // Small changes or during animation update immediately
    currentProgress = targetProgress;
    const fillPercent = currentProgress * 100;
    navbar.style.background = `linear-gradient(to right, var(--color-nav-fill) ${fillPercent}%, var(--color-nav-bg) ${fillPercent}%)`;
  }
}

// Handle anchor link clicks
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href^="#"]');
  if (link && link.getAttribute('href') !== '#') {
    // Small delay to let the scroll happen, then force update
    setTimeout(() => {
      if (isAnimating) {
        gsap.killTweensOf({ progress: currentProgress });
        isAnimating = false;
      }
      updateProgressBar();
    }, 10);
  }
});

window.addEventListener('scroll', updateProgressBar);

// Initialize progress on page load
document.addEventListener('DOMContentLoaded', function() {
  updateProgressBar();
});

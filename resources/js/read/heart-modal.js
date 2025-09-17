let isHeartAnimating = false;

function toggleHeart(button) {
  if (isHeartAnimating) return; // Предотвращаем спам кликов
  
  const isLiked = button.classList.contains('liked');
    
  if (!isLiked) {
    isHeartAnimating = true;
    // Add liked class
    button.classList.add('liked');
    // Force red color directly
    button.style.color = '#ef4444';
    console.log('Added liked class and forced red color');
    
    // Heart bounce animation
    gsap.to(button, {
      scale: 1.3,
      duration: 0.15,
      ease: "back.out(1.7)",
      yoyo: true,
      repeat: 1
    });
    
    // Create confetti effect
    createConfetti(button);
    
    // Show modal after delay
    setTimeout(() => {
      showModal();
      isHeartAnimating = false; // Разблокируем после завершения
    }, 500);
  } else {
    isHeartAnimating = true;
    // Remove liked class
    button.classList.remove('liked');
    // Reset to CSS variable
    button.style.color = '';
    console.log('Removed liked class and reset color');
    
    // Simple scale animation
    gsap.to(button, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
    
    // Разблокируем сразу для unllike
    setTimeout(() => {
      isHeartAnimating = false;
    }, 200);
  }
}

function showModal() {
  const modal = document.getElementById('heartModal');
  
  modal.style.visibility = 'visible';
  
  gsap.fromTo(modal, 
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  );
}

function closeModal() {
  const modal = document.getElementById('heartModal');
  
  gsap.to(modal, {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      modal.style.visibility = 'hidden';
    }
  });
}

function createConfetti(button) {
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];
  const buttonRect = button.getBoundingClientRect();
  const centerX = buttonRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top + buttonRect.height / 2;
  
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Create multiple confetti particles
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    particle.style.borderRadius = '50%';
    particle.style.position = 'fixed'; // Use fixed instead of absolute
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    document.body.appendChild(particle);
    
    // Random direction and distance with viewport constraints
    const angle = (Math.PI * 2 * i) / 12;
    const maxDistance = Math.min(120, 
      centerX - 20, // Distance from left edge
      viewportWidth - centerX - 20, // Distance from right edge
      centerY - 20, // Distance from top edge
      viewportHeight - centerY - 20 // Distance from bottom edge
    );
    const distance = 60 + Math.random() * maxDistance;
    const endX = centerX + Math.cos(angle) * distance;
    const endY = centerY + Math.sin(angle) * distance;
    
    // Ensure particles stay within viewport
    const clampedEndX = Math.max(10, Math.min(viewportWidth - 10, endX));
    const clampedEndY = Math.max(10, Math.min(viewportHeight - 10, endY));
    
    // Animate particle
    gsap.to(particle, {
      x: clampedEndX - centerX,
      y: clampedEndY - centerY,
      rotation: Math.random() * 360,
      opacity: 0,
      scale: 0,
      duration: 1.0 + Math.random() * 0.6,
      ease: "power2.out",
      onComplete: () => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle);
        }
      }
    });
  }
}
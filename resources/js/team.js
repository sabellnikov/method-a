// === GSAP plugins ===
gsap.registerPlugin(ScrollTrigger);

// === GSAP tilt effect for cards + 3d + gloss ===
document.querySelectorAll('.tilt-card').forEach(card => {
  let bounds = null;
  const gloss = card.querySelector('.tilt-gloss');

  function onMove(e) {
    if (!bounds) bounds = card.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const rotateY = ((x - centerX) / centerX) * 18;
    const rotateX = -((y - centerY) / centerY) * 18;
    gsap.to(card, {
      rotateY,
      rotateX,
      scale: 1.04,
      transformPerspective: 700,
      transformOrigin: "center",
      duration: 0.3,
      ease: "power2.out"
    });
    // gloss effect: move gradient highlight
    if (gloss) {
      card.classList.add('tilted');
      const glossX = ((x / bounds.width) * 100);
      const glossY = ((y / bounds.height) * 100);
      gloss.style.background = `linear-gradient(${120 + (rotateY * 2)}deg, rgba(255,255,255,${0.22 + Math.abs(rotateX)/40}) 20%, rgba(255,255,255,0.04) 80%)`;
      gloss.style.opacity = "1";
    }
  }

  function onLeave() {
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    });
    if (gloss) {
      card.classList.remove('tilted');
      gloss.style.opacity = "0";
    }
    bounds = null;
  }

  card.addEventListener('mouseenter', e => { bounds = card.getBoundingClientRect(); });
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', onLeave);
});

// === Smooth anchor scroll ===
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.length > 1 && href.startsWith('#')) {
      const target = document.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        const targetY = target.getBoundingClientRect().top + window.pageYOffset;
        const startY = window.pageYOffset;
        const duration = 200; // ms
        const startTime = performance.now();

        function scrollStep(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 0.5 - 0.5 * Math.cos(Math.PI * progress); // easeInOutSine
          window.scrollTo(0, startY + (targetY - startY) * ease);
          if (progress < 1) {
            requestAnimationFrame(scrollStep);
          }
        }
        requestAnimationFrame(scrollStep);
      }
    }
  });
});

// === Основная анимация padding (ScrollTrigger) ===
ScrollTrigger.create({
  trigger: ".team-image-container",
  start: "top 70%",
  end: "bottom 10%",
  scrub: true,
  onUpdate: self => {
    let p;
    // self.progress — прогресс анимации от 0 (start) до 1 (end)
    if (self.progress <= 0.5) {
      // 4vw -> 1vw: уменьшение padding с 4vw до 1vw от 70% до 50%
      p = gsap.utils.mapRange(0, 0.5, 4, 1, self.progress);
    } else {
      // 1vw -> 4vw: увеличение padding с 1vw до 4vw от 50% до 10%
      p = gsap.utils.mapRange(0.5, 1, 1, 4, self.progress);
    }
    // Применяем вычисленный padding к контейнеру
    gsap.set(".team-image-container", {
      paddingLeft: `${p}vw`,
      paddingRight: `${p}vw`
    });
  }
});

// === Tailwind tabs logic with GSAP animation ===
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Remove active styles from all buttons
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('bg-[#FD589E]', 'text-[#38001B]');
      b.classList.add('bg-transparent', 'text-[#38001B]');
    });
    // Add active styles to clicked button
    this.classList.remove('bg-transparent');
    this.classList.add('bg-[#FD589E]', 'text-[#38001B]');

    // Hide all panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.add('hidden');
    });
    // Show selected panel
    const tab = this.getAttribute('data-tab');
    const activePanel = document.querySelector('.tab-panel[data-tab="' + tab + '"]');
    if (activePanel) {
      activePanel.classList.remove('hidden');
    }
  });
});

// Set first tab as active on load
document.addEventListener('DOMContentLoaded', () => {
  const firstBtn = document.querySelector('.tab-btn');
  if (firstBtn) firstBtn.click();
});
  // Set first tab as active on load
  document.addEventListener('DOMContentLoaded', () => {
    const firstBtn = document.querySelector('.tab-btn');
    if (firstBtn) firstBtn.click();
  });

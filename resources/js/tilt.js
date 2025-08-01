document.querySelectorAll('.tilt-card').forEach(card => {
  let bounds = null;
  const gloss = card.querySelector('.tilt-gloss');
  let autoAnimId = null;
  let isHover = false;
  const phaseOffset = Math.random() * Math.PI * 2;
  const tiltAmplitude = 6; // градусов
  const tiltScale = 1.01;
  let startTime = null;

  function autoTiltAnim(ts) {
    if (!startTime) startTime = ts;
    const t = (ts - startTime) / 1000; // секунды
    // Делаем движение не синхронным через phaseOffset
    const rotateY = Math.sin(t + phaseOffset) * tiltAmplitude;
    const rotateX = Math.cos(t + phaseOffset) * tiltAmplitude;
    gsap.set(card, {
      rotateY,
      rotateX,
      scale: tiltScale,
      transformPerspective: 700,
      transformOrigin: "center"
    });
    if (!isHover) {
      autoAnimId = requestAnimationFrame(autoTiltAnim);
    }
  }

  function startAutoTilt() {
    isHover = false;
    startTime = null;
    autoAnimId = requestAnimationFrame(autoTiltAnim);
  }

  function stopAutoTilt() {
    isHover = true;
    if (autoAnimId) {
      cancelAnimationFrame(autoAnimId);
      autoAnimId = null;
    }
    gsap.to(card, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.3, ease: "power2.out" });
    if (gloss) {
      gloss.style.opacity = "0";
      card.classList.remove('tilted');
    }
  }

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
    if (gloss) {
      card.classList.add('tilted');
      const glossX = ((x / bounds.width) * 100);
      const glossY = ((y / bounds.height) * 100);
      gloss.style.background = `linear-gradient(${120 + (rotateY * 2)}deg, rgba(255,255,255,${0.22 + Math.abs(rotateX)/40}) 20%, rgba(255,255,255,0.04) 80%)`;
      gloss.style.opacity = "1";
    }
  }

  function onEnter(e) {
    bounds = card.getBoundingClientRect();
    stopAutoTilt();
  }

  function onLeave() {
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      scale: tiltScale,
      duration: 0.5,
      ease: "power2.out"
    });
    if (gloss) {
      card.classList.remove('tilted');
      gloss.style.opacity = "0";
    }
    bounds = null;
    startAutoTilt();
  }

  card.addEventListener('mouseenter', onEnter);
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', onLeave);

  // Запуск авто-tilt при инициализации
  startAutoTilt();
});
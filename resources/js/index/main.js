// For background animation
  gsap.registerPlugin(ScrollTrigger);

  function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  const bgColors = [
    getCssVar('--color-background-top'),
    getCssVar('--color-background-middle'),
    getCssVar('--color-background-bottom')
  ];

  const bgBlend = document.querySelector('.background-blend');
  const bgBottom = document.querySelector('.background-bottom');
  bgBlend.style.backgroundColor = bgColors[0];

  document.querySelectorAll('.slide-section').forEach((section, i) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom bottom",
      markers: false,
      onUpdate: self => {
        if (self.progress >= 0) {
          gsap.to(bgBlend, { backgroundColor: bgColors[i], duration: 0.2, ease: "sine.inOut" });
        } else if (i >= 1) {
          gsap.to(bgBlend, { backgroundColor: bgColors[i - 1], duration: 0.2, ease: "sine.inOut" });
        }
      }
    });
  });

  // scrub-animation background-blend
  const scaleVal = 0.95;
  const yBlendVal = "-70vh";
  const ySlideVal = ((1 - scaleVal) * 50) + "vh";
  const slideSections = document.querySelectorAll('.slide-section');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: document.body,
      start: "bottom bottom",
      end: "+=200",
      scrub: true,
      markers: true,
      onUpdate: self => {
        if (self.progress > 0.5) {
          bgBottom.style.pointerEvents = 'auto';
          slideSections.forEach(sec => sec.style.pointerEvents = 'none');
        } else {
          bgBottom.style.pointerEvents = 'none';
          slideSections.forEach(sec => sec.style.pointerEvents = '');
        }
      }
    }
  });

  tl.to(bgBlend, {
    scale: scaleVal,
    y: yBlendVal,
    borderBottomLeftRadius: "2rem",
    borderBottomRightRadius: "2rem",
    ease: "sine.inOut"
  }, 0)
  .to(bgBottom, {
    opacity: 1
  }, 0)
  .to(lastSlide, {
    scale: scaleVal,
    y: "-" + ySlideVal,
  }, 0);
gsap.registerPlugin(ScrollTrigger);

function initScrollTrigger() {
  gsap.registerPlugin(ScrollTrigger);
  
  ScrollTrigger.create({
    trigger: ".full-width-bg",
    start: "top top",
    end: "bottom+=500vh top",
    pin: true,
    pinSpacing: true,
    scrub: true,
    //markers: true,
    onUpdate: self => {
      const progress = self.progress;

      // Заголовок уезжает вверх и исчезает
      gsap.to("#mainTitle", {
        opacity: progress < 0.1 ? 1 : 0,
        duration: 0.2,
        ease: "power1.out"
      });

      // "Наши работы" и "вместо слов" разъезжаются по горизонтали и исчезают
      gsap.to(["#leftWork", "#rightWord"], {
        x: i => i === 0 ? -window.innerWidth / 2 * progress : window.innerWidth / 2 * progress,
        y: 0,
        opacity: 1 - Math.max(0, (progress - 0.7) / 0.3),
        duration: 0.2,
        ease: "power1.out"
      });

      // Контейнер увеличивается до размера полной страницы
      gsap.to("#expandingContainer", {
        scale: progress < 0.5 ? 0.2 + 1.6 * progress : 1,
        opacity: progress < 0.5 ? progress * 2 : 1,
        borderRadius: progress < 0.5 ? "2rem" : "0rem",
        duration: 0.2,
        ease: "power1.out"
      });

      const fixed = self.isActive;
      document.getElementById('siteNameBar')?.classList.toggle('fixed', fixed);
      document.getElementById('siteIconBar')?.classList.toggle('fixed', fixed);
    }
  });
}

document.addEventListener('DOMContentLoaded', initScrollTrigger);

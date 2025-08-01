const words = [
  "невероятное",
  "новое",
  "яркое",
  "важное",
  "большое",
  "креативное",
  "доброе",
  "смелое"
];

const el = document.getElementById("word-animate");
let idx = 0;

const SWITCH_INTERVAL = 2000;
const ANIMATION_DURATION = 0.4;

function nextWord() {
  // Анимация пролистывания вверх
  gsap.to(el, { opacity: 0, y: -40, duration: ANIMATION_DURATION, onComplete: () => {
    idx = (idx + 1) % words.length;
    el.textContent = words[idx];
    gsap.set(el, { y: 40 }); // Появление снизу
    gsap.to(el, { opacity: 1, y: 0, duration: ANIMATION_DURATION });
  }});
}

setInterval(nextWord, SWITCH_INTERVAL);

        document.getElementById('copyright-year').textContent = new Date().getFullYear();

        // Arrow animation on hover
        const link = document.querySelector('.group.flex.flex-row.items-center.justify-between');
        const arrow = document.getElementById('arrow-svg');
        if (link && arrow) {
          link.addEventListener('mouseenter', () => {
            gsap.to(arrow, { x: 20, duration: 0.4, ease: "power2.out" });
          });
          link.addEventListener('mouseleave', () => {
            gsap.to(arrow, { x: 0, duration: 0.4, ease: "power2.in" });
          });
        }
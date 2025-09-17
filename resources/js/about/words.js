const words = [
  "новое",
  "яркое",
  "важное",
  "большое",
  "светлое",
  "доброе",
  "смелое",
  "умное"
];

const el = document.getElementById("word-animate");
let idx = 0;

const SWITCH_INTERVAL = 2000;
const ANIMATION_DURATION = 0.4;

// Анимация смены слова
function nextWord() {
  gsap.to(el, {
    opacity: 0,
    y: -40,
    duration: ANIMATION_DURATION,
    onComplete: () => {
      idx = (idx + 1) % words.length;
      el.textContent = words[idx];
      gsap.set(el, { y: 40 });
      gsap.to(el, { opacity: 1, y: 0, duration: ANIMATION_DURATION });
    }
  });
}

setInterval(nextWord, SWITCH_INTERVAL);

// Установка текущего года
document.getElementById('copyright-year').textContent = new Date().getFullYear();

// Анимация стрелки при наведении
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
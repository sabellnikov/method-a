function smoothScrollTo(y, d = 200) {
  const s = window.pageYOffset, c = y - s;
  let t;
  function scrollStep(ts) {
    if (t === undefined) t = ts;
    const p = Math.min(1, (ts - t) / d);
    window.scrollTo(0, s + c * (0.5 - 0.5 * Math.cos(Math.PI * p)));
    if (p < 1) requestAnimationFrame(scrollStep);
  }
  requestAnimationFrame(scrollStep);
}
document.querySelectorAll('a[href^="#"]').forEach(link =>
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#down') {
      e.preventDefault();
      smoothScrollTo(document.body.scrollHeight, 400);
    } else if (href === '#up') {
      e.preventDefault();
      smoothScrollTo(0, 400);
    } else if (href.length > 1 && document.querySelector(href)) {
      e.preventDefault();
      const y = document.querySelector(href).getBoundingClientRect().top + window.pageYOffset;
      smoothScrollTo(y, 400);
    }
  })
);
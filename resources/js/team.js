  const video = document.getElementById('teamVideo');
  const playBtn = document.getElementById('playBtn');
  const videoContainer = document.getElementById('videoContainer');
  const videoPlaceholder = document.getElementById('videoPlaceholder');

  function isMobile() {
    return window.matchMedia('(max-width: 640px)').matches;
  }

  function setPlaceholderHeight() {
    if (isMobile()) {
      const rect = videoContainer.getBoundingClientRect();
      videoPlaceholder.style.height = rect.height + "px";
      videoPlaceholder.style.width = rect.width + "px";
    }
  }

  function resetPlaceholderHeight() {
    videoPlaceholder.style.height = "0";
    videoPlaceholder.style.width = "0";
  }

  playBtn.addEventListener('click', function() {
    setTimeout(() => {
      video.play();
    }, 100);
    playBtn.style.display = 'none';
  });

  video.addEventListener('pause', function() {
    playBtn.style.display = '';
    if (isMobile()) {
      videoContainer.classList.remove('video-fullscreen-mobile');
      resetPlaceholderHeight();
    }
  });

  video.addEventListener('play', function() {
    if (isMobile()) {
      setPlaceholderHeight();
      videoContainer.classList.add('video-fullscreen-mobile');
    }
    playBtn.style.display = 'none';
  });

  video.addEventListener('ended', function() {
    if (isMobile()) {
      videoContainer.classList.remove('video-fullscreen-mobile');
      resetPlaceholderHeight();
    }
  });

  video.addEventListener('click', function() {
    if (isMobile()) {
      if (!video.paused) {
        video.pause();
      } else {
        setTimeout(() => {
          video.play();
        }, 100);
      }
    } else {
      if (video.paused) {
        setTimeout(() => {
          video.play();
        }, 100);
      } else {
        video.pause();
      }
    }
  });

  // На мобильных устройствах: клик по любому месту контейнера — пауза
  if (isMobile()) {
    videoContainer.addEventListener('click', function(e) {
      // Если клик был не по кнопке play и не по самому видео
      if (e.target !== video && e.target !== playBtn) {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }

  // GSAP video expand on scroll
  document.addEventListener('DOMContentLoaded', function() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      if (!isMobile()) {
        // Pin-анимация на внешней обёртке
        ScrollTrigger.create({
            trigger: "#videoPinWrapper",
            start: "center center",
            end: () => `+=${window.innerHeight * 1.3}`,
            pin: true,
            pinSpacing: true,
            markers: false,
            scrub: false
        });

        // Анимация ширины только на внутреннем контейнере
        gsap.to("#videoContainer", {
          scrollTrigger: {
            trigger: "#videoPinWrapper",
            start: "top center",
            end: () => {
              const container = document.getElementById('videoPinWrapper');
              return `bottom+=${window.innerHeight * 0.4} center`;
            },
            scrub: true,
            markers: false
          },
          width: "97.5vw",
          maxWidth: "97.5vw",
          borderRadius: "0.5rem",
          ease: "expoScale(1,2,power2.inOut)",
          duration: 1,
          yoyo: true,
          repeat: 1
        });
      }
    }

    // Fade-in animation for main content
    document.querySelector('.slide-section').classList.add('fade-in');
  });

        // Simplified tab switching logic
      document.addEventListener('DOMContentLoaded', function () {
  const tabButtons = document.querySelectorAll('#tabs button[data-tab]');
  const tabPanels = document.querySelectorAll('.tab-panel');
  let autoTabInterval = null;
  let autoTabTimeout = null;
  let autoTabDelayMobile = 3000;   // 3 seconds для мобильных (<640px)
  let autoTabDelayDesktop = 6000; // 6 секунд для десктопа (>=640px)
  let userDelay = 10000;           // 10 секунд после действия пользователя
  let autoTabStarted = false;

  // Set initial active
  tabButtons[0].classList.add('active');
  tabPanels[0].classList.add('active');

  function activateTab(tab) {
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-tab') === tab));
    tabPanels.forEach(panel => panel.classList.toggle('active', panel.getAttribute('data-tab') === tab));
  }

  function getActiveTabIndex() {
    return Array.from(tabButtons).findIndex(btn => btn.classList.contains('active'));
  }

  function nextTabIndex() {
    let idx = getActiveTabIndex();
    return (idx + 1) % tabButtons.length;
  }

  function getAutoTabDelay() {
    return window.innerWidth < 640 ? autoTabDelayMobile : autoTabDelayDesktop;
  }

  function startAutoTabSwitch(delay = getAutoTabDelay()) {
    clearInterval(autoTabInterval);
    clearTimeout(autoTabTimeout);
    autoTabTimeout = setTimeout(() => {
      // Закрыть открытую мобильную вкладку, если она есть
      if (bottomTab && window.innerWidth < 640) {
        gsap.to(bottomTab, { y: '0px', duration: 0.4, ease: "power2.in" });
        gsap.to(overlay, { opacity: 0, duration: 0.4, onComplete: () => {
          overlay.style.pointerEvents = "none";
          // После закрытия сразу запустить автопереключение без задержки
          autoTabInterval = setInterval(() => {
            let idx = nextTabIndex();
            let tab = tabButtons[idx].getAttribute('data-tab');
            activateTab(tab);
            bindTabOpeners();
          }, getAutoTabDelay());
        }});
      } else {
        autoTabInterval = setInterval(() => {
          let idx = nextTabIndex();
          let tab = tabButtons[idx].getAttribute('data-tab');
          activateTab(tab);
          bindTabOpeners();
        }, getAutoTabDelay());
      }
    }, delay);
  }

  // Функция для паузы автопереключения на userDelay
  function pauseAutoTabSwitch() {
    clearInterval(autoTabInterval);
    clearTimeout(autoTabTimeout);
    startAutoTabSwitch(userDelay);
  }

  function startAutoTabSwitchIfNeeded() {
    if (!autoTabStarted) {
      autoTabStarted = true;
      startAutoTabSwitch(0);
    }
  }

  // Автоматическое переключение вкладок
  // startAutoTabSwitch(0); // УБРАТЬ/ЗАКОММЕНТИРОВАТЬ эту строку

  // GSAP ScrollTrigger для запуска автолистания, когда заголовок "История успеха" проедет 50% экрана
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.create({
    trigger: '#about h1',
    start: 'top 50%',
    once: true,
    onEnter: startAutoTabSwitchIfNeeded
  });

  // Наведение мыши на контейнер с текстом или картинкой — пауза автопереключения (только для десктопа)
  document.querySelectorAll('.tab-panel .aspect-\\[16\\/9\\], .tab-panel .flex-1.basis-1\\/2').forEach(el => {
    el.addEventListener('mouseenter', function() {
      if (window.innerWidth >= 640) {
        clearInterval(autoTabInterval);
        clearTimeout(autoTabTimeout);
      }
    });
    el.addEventListener('mouseleave', function() {
      if (window.innerWidth >= 640) {
        clearInterval(autoTabInterval);
        clearTimeout(autoTabTimeout);
        startAutoTabSwitch(0); // продолжить сразу без задержки
      }
    });
    // Для мобильных ничего не делаем
  });

  document.getElementById('tabs').addEventListener('click', function (e) {
    if (e.target.matches('button[data-tab]')) {
      const tab = e.target.getAttribute('data-tab');
      activateTab(tab);
      bindTabOpeners();
      // Сбросить автослайдшоу и увеличить задержку
      clearInterval(autoTabInterval);
      clearTimeout(autoTabTimeout);
      startAutoTabSwitch(userDelay);
    }
  });

  // Открытие вкладки (мобильная версия)
  const overlay = document.getElementById('overlayBg');
  let openTabBtn = null;
  let bottomTab = null;

  function bindTabOpeners() {
    // Сначала снять старые обработчики, если были
    document.querySelectorAll('[id^="openTabBtn-"]').forEach(btn => {
      btn.onclick = null;
    });

    // Для активной вкладки назначить обработчик
    const activePanel = document.querySelector('.tab-panel.active');
    if (!activePanel) return;
    const tab = activePanel.getAttribute('data-tab');
    openTabBtn = document.getElementById('openTabBtn-' + tab);
    bottomTab = document.getElementById('bottomTab-' + tab);

    if (openTabBtn && bottomTab) {
      openTabBtn.onclick = function(e) {
        // Только для мобильной версии (до sm)
        if (window.innerWidth >= 640) return;
        // Сбросить автослайдшоу и увеличить задержку при открытии мобильной вкладки
        clearInterval(autoTabInterval);
        clearTimeout(autoTabTimeout);
        startAutoTabSwitch(userDelay);
        gsap.to(bottomTab, { y: '-300px', duration: 0.5, ease: "power2.out" });
        gsap.to(overlay, { opacity: 1, duration: 0.5, pointerEvents: "auto", onStart: () => {
            overlay.style.pointerEvents = "auto";
        }});
      };
    }
  }

  // Клик по оверлею закрывает вкладку
  overlay.addEventListener('click', () => {
    if (bottomTab) {
      gsap.to(bottomTab, { y: '0px', duration: 0.5, ease: "power2.in" });
    }
    gsap.to(overlay, { opacity: 0, duration: 0.5, onComplete: () => {
      overlay.style.pointerEvents = "none";
    }});
  });

  // Сброс позиции вкладки и оверлея при загрузке
  function resetAllBottomTabs() {
    document.querySelectorAll('[id^="bottomTab-"]').forEach(tab => {
      gsap.set(tab, { y: '0px' });
    });
    gsap.set(overlay, { opacity: 0 });
    overlay.style.pointerEvents = "none";
  }
  resetAllBottomTabs();

  // Переназначать обработчики при переключении табов
  document.getElementById('tabs').addEventListener('click', function () {
    setTimeout(bindTabOpeners, 0);
  });
  // Назначить при загрузке
  bindTabOpeners();

  // Перезапуск автолистания при изменении размера окна (смена режима)
  window.addEventListener('resize', function() {
    clearInterval(autoTabInterval);
    clearTimeout(autoTabTimeout);
    startAutoTabSwitch(getAutoTabDelay());
  });
});


      // Короткий кастомный плавный скролл (совместимо с Safari)
      function smoothScrollTo(y, d = 200) {
        const s = window.pageYOffset, c = y - s;
        let t;
        requestAnimationFrame(function f(ts) {
          if (t === undefined) t = ts;
          const p = Math.min(1, (ts - t) / d);
          window.scrollTo(0, s + c * (0.5 - 0.5 * Math.cos(Math.PI * p)));
          if (p < 1) requestAnimationFrame(f);
        });
      }
      document.querySelectorAll('a[href^="#"]').forEach(link =>
        link.addEventListener('click', e => {
          const href = link.getAttribute('href');
          if (href.length > 1 && document.querySelector(href)) {
            e.preventDefault();
            const y = document.querySelector(href).getBoundingClientRect().top + window.pageYOffset;
            smoothScrollTo(y, 200);
          }
        })
      );
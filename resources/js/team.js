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
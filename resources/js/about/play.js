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

const video = document.getElementById('teamVideo');
const playBtn = document.getElementById('playBtn');
const videoContainer = document.getElementById('videoContainer');
const videoPlaceholder = document.getElementById('videoPlaceholder');
let videoLoaded = false;

playBtn.addEventListener('click', function() {
  if (!videoLoaded) {
    // Начинаем загрузку видео
    video.load();
    videoLoaded = true;
    
    // Ждем, когда видео будет готово к воспроизведению
    video.addEventListener('canplay', function() {
      setTimeout(() => {
        video.play();
      }, 100);
    }, { once: true });
  } else {
    setTimeout(() => {
      video.play();
    }, 100);
  }
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

if (isMobile()) {
  videoContainer.addEventListener('click', function(e) {
    if (e.target !== video && e.target !== playBtn) {
      if (!video.paused) {
        video.pause();
      }
    }
  });
}

(function() {
  var pinWrapper = document.getElementById('videoPinWrapper');
  if (pinWrapper && !isMobile()) {
    var extraSpace = window.innerHeight * 0.5;
    pinWrapper.style.marginBottom = extraSpace + 'px';
  }
})();

gsap.registerPlugin(ScrollTrigger);

if (!isMobile()) {
  ScrollTrigger.create({
    trigger: "#videoPinWrapper",
    start: "center center",
    end: "bottom center",
    pin: true,
    pinSpacing: false,
    markers: false,
    scrub: false
  });

  gsap.to("#videoContainer", {
    scrollTrigger: {
      trigger: "#videoPinWrapper",
      start: "top center",
      end: "bottom center",
      scrub: 0.5,
      markers: false
    },
    width: "95vw",
    maxWidth: "95vw",
    borderRadius: "0.5rem",
    ease: "none",
    duration: 1,
    yoyo: true,
    repeat: 1
  });
}

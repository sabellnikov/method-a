document.addEventListener('DOMContentLoaded', function() {
  const video = document.getElementById('teamVideo');
  const playBtn = document.getElementById('playBtn');
  if (!video || !playBtn) return;
  const videoContainer = video.parentElement;

  playBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (video.paused) {
      video.play();
      playBtn.style.display = 'none';
    } else {
      video.pause();
      playBtn.style.display = '';
    }
  });

  videoContainer.addEventListener('click', function(e) {
    // Не реагировать на клик по кнопке
    if (e.target === playBtn || playBtn.contains(e.target)) return;
    if (video.paused) {
      video.play();
      playBtn.style.display = 'none';
    } else {
      video.pause();
      playBtn.style.display = '';
    }
  });

  video.addEventListener('pause', function() {
    playBtn.style.display = '';
  });
  video.addEventListener('play', function() {
    playBtn.style.display = 'none';
  });
});

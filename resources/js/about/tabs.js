document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('#tabs [data-tab]');
  const tabPanels = document.querySelectorAll('.tab-content .tab-panel');

  function setActive(tab) {
    tabPanels.forEach(panel => {
      panel.style.display = (panel.getAttribute('data-tab') === tab) ? '' : 'none';
    });
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === tab) {
        btn.classList.add('bg-[#38001B]', 'text-[#FD589E]');
        btn.classList.remove('bg-[#FD589E]', 'text-[#38001B]');
      } else {
        btn.classList.remove('bg-[#38001B]', 'text-[#FD589E]');
        btn.classList.add('bg-[#FD589E]', 'text-[#38001B]');
      }
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      setActive(btn.getAttribute('data-tab'));
    });
  });

  if (tabButtons.length) setActive(tabButtons[0].getAttribute('data-tab'));
});
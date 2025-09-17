function isDesktop() {
    return window.matchMedia('(min-width: 640px)').matches;
}

const dropdownButton = document.getElementById('dropdownButton');
const dropdownPanel = document.getElementById('dropdownPanel');
let closeTimeout = null;

function updateDropdownButtonHover(opened) {
    if (opened) {
        dropdownButton.classList.add('bg-[var(--color-custom-hover)]');
        dropdownButton.classList.remove('hover:bg-[var(--color-custom-hover)]');
    } else {
        dropdownButton.classList.remove('bg-[var(--color-custom-hover)]');
        dropdownButton.classList.add('hover:bg-[var(--color-custom-hover)]');
    }
}

function showDropdownPanel() {
    dropdownPanel.classList.remove('hidden');
    dropdownPanel.classList.remove('dropdown-fade-out');
    // trigger reflow to restart animation if needed
    void dropdownPanel.offsetWidth;
    dropdownPanel.classList.add('dropdown-fade-in');
    updateDropdownButtonHover(true);
}

function hideDropdownPanel() {
    dropdownPanel.classList.remove('dropdown-fade-in');
    dropdownPanel.classList.add('dropdown-fade-out');
    setTimeout(() => {
        dropdownPanel.classList.add('hidden');
        updateDropdownButtonHover(false);
    }, 200); // Длительность анимации должна совпадать с CSS
}

function toggleDropdownPanel() {
    if (dropdownPanel.classList.contains('hidden')) {
        showDropdownPanel();
    } else {
        hideDropdownPanel();
    }
}

function clearCloseTimeout() {
    if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
    }
}

// Клик по кнопке: переключение панели
dropdownButton.addEventListener('click', toggleDropdownPanel);

// Наведение на десктопе: открытие
[dropdownButton, dropdownPanel].forEach(el =>
    el.addEventListener('mouseenter', () => {
      if (isDesktop()) {
        clearCloseTimeout();
        showDropdownPanel();
      }
    })
  );

// Уход мыши с панели/кнопки: закрытие с задержкой (только для десктопа)
document.addEventListener('mousemove', event => {
    if (!isDesktop()) return;
    const over = dropdownPanel.contains(event.target) || dropdownButton.contains(event.target);
    if (!over && !dropdownPanel.classList.contains('hidden')) {
      if (!closeTimeout) {
        closeTimeout = setTimeout(hideDropdownPanel, 200);
      }
    } else {
      clearCloseTimeout();
    }
  });

// Уход мыши с body: закрытие панели
document.body.addEventListener('mouseleave', () => {
    if (!isDesktop()) return;
    hideDropdownPanel();
    clearCloseTimeout();
  });

// Клик вне панели: закрытие панели
document.addEventListener('click', event => {
    if (!dropdownButton.contains(event.target) && !dropdownPanel.contains(event.target)) {
      hideDropdownPanel();
    }
  });

// Остановка всплытия mousedown на кнопке и панели
[dropdownButton, dropdownPanel].forEach(el =>
    el.addEventListener('mousedown', e => e.stopPropagation())
  );

// Инициализация состояния кнопки при загрузке
updateDropdownButtonHover(dropdownPanel && !dropdownPanel.classList.contains('hidden'));
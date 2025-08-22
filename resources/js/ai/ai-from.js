const FUNCTION_URL = "https://functions.yandexcloud.net/d4eifnmujs29c4uf9nj6...";

class ChatBot {
  constructor() {
    this.chatMessages = document.querySelector('.chat-messages > div');
    this.chatForm = document.querySelector('.chat-form');
    this.chatInput = document.querySelector('.chat-input');
    this.chatBtn = document.querySelector('.chat-btn');
    this.isFirstMessage = true;
    this.keyboardHeight = 0;
    
    this.init();
  }

  // Конвертирует классы Tailwind padding-bottom в пиксели
  getTailwindPadding(className) {
    const paddingMap = {
      'pb-0': 0,    'pb-px': 1,   'pb-0.5': 2,  'pb-1': 4,
      'pb-1.5': 6,  'pb-2': 8,    'pb-2.5': 10, 'pb-3': 12,
      'pb-3.5': 14, 'pb-4': 16,   'pb-5': 20,   'pb-6': 24,
      'pb-7': 28,   'pb-8': 32,   'pb-9': 36,   'pb-10': 40,
      'pb-11': 44,  'pb-12': 48,  'pb-14': 56,  'pb-16': 64,
      'pb-20': 80,  'pb-24': 96,  'pb-28': 112, 'pb-32': 128,
      'pb-36': 144, 'pb-40': 160, 'pb-44': 176, 'pb-48': 192,
      'pb-52': 208, 'pb-56': 224, 'pb-60': 240, 'pb-64': 256,
      'pb-72': 288, 'pb-80': 320, 'pb-96': 384, 'pb-26': 104
    };
    
    return paddingMap[className] || 0;
  }

  init() {
    this.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSubmit(e);
      }
    });
    
    // Инициализируем статическую панель внизу
    this.initStaticBottomPanel();
    
    // Обработка виртуальной клавиатуры
    this.setupKeyboardHandling();
  }

  // Инициализация статической панели внизу (ChatGPT стиль)
  initStaticBottomPanel() {
    // Форма уже позиционирована внизу через CSS (bottom-0)
    // Сбрасываем любые transform от GSAP
    gsap.set(this.chatForm, {
      y: 0,
      duration: 0
    });
    
    // Устанавливаем CSS-переменную для динамической высоты viewport
    this.updateViewportHeight();
    
    this.isFirstMessage = false; // Форма уже в финальной позиции
  }

  // Обновление CSS-переменной высоты viewport
  updateViewportHeight() {
    const vh = window.visualViewport ? 
      window.visualViewport.height * 0.01 : 
      window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Настройка обработки виртуальной клавиатуры
  setupKeyboardHandling() {
    // Отслеживаем изменения viewport для клавиатуры и динамической навигации
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        this.handleKeyboardResize();
      });
      
      // Дополнительно отслеживаем события scroll для более точного определения
      window.visualViewport.addEventListener('scroll', () => {
        this.handleKeyboardResize();
      });
    }
    
    // Фокус на поле ввода
    this.chatInput.addEventListener('focus', () => {
      setTimeout(() => this.adjustForKeyboard(), 300);
    });
    
    // Потеря фокуса
    this.chatInput.addEventListener('blur', () => {
      setTimeout(() => this.resetKeyboardPosition(), 300);
    });
    
    // Обработка изменения размера окна (включая поворот экрана)
    window.addEventListener('resize', () => {
      setTimeout(() => this.handleWindowResize(), 100);
    });
    
    // Дополнительно отслеживаем событие orientationchange для мобильных
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleWindowResize(), 500);
    });
  }

  // Обработка изменения viewport (клавиатура)
  handleKeyboardResize() {
    if (window.visualViewport) {
      // Обновляем CSS-переменную высоты viewport
      this.updateViewportHeight();
      
      const viewportHeight = window.visualViewport.height;
      const windowHeight = window.innerHeight;
      const heightDifference = windowHeight - viewportHeight;
      
      // Обновляем позицию независимо от фокуса поля ввода
      if (heightDifference > 50) {
        const safeOffset = 20;
        gsap.to(this.chatForm, {
          y: -(heightDifference + safeOffset),
          duration: 0.3,
          ease: "power2.out"
        });
        this.keyboardHeight = heightDifference;
      } else {
        gsap.to(this.chatForm, {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
        this.keyboardHeight = 0;
      }
    }
  }

  // Адаптация под клавиатуру
  adjustForKeyboard() {
    if (window.visualViewport) {
      const viewportHeight = window.visualViewport.height;
      const windowHeight = window.innerHeight;
      this.keyboardHeight = windowHeight - viewportHeight;
      
      // Поднимаем форму над клавиатурой с учетом безопасного отступа
      if (this.keyboardHeight > 50) { // Клавиатура или панель навигации изменились
        const safeOffset = 20; // Дополнительный отступ для безопасности
        gsap.to(this.chatForm, {
          y: -(this.keyboardHeight + safeOffset),
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  }

  // Возврат в исходную позицию
  resetKeyboardPosition() {
    gsap.to(this.chatForm, {
      y: 0,
      duration: 0.3,
      ease: "power2.out"
    });
    this.keyboardHeight = 0;
  }

  // Обработка изменения размера окна
  handleWindowResize() {
    // Обновляем CSS-переменную высоты viewport
    this.updateViewportHeight();
    
    if (window.visualViewport) {
      const viewportHeight = window.visualViewport.height;
      const windowHeight = window.innerHeight;
      const newKeyboardHeight = windowHeight - viewportHeight;
      
      if (newKeyboardHeight > 50) {
        const safeOffset = 20;
        gsap.to(this.chatForm, {
          y: -(newKeyboardHeight + safeOffset),
          duration: 0.2,
          ease: "power2.out"
        });
        this.keyboardHeight = newKeyboardHeight;
      } else {
        gsap.to(this.chatForm, {
          y: 0,
          duration: 0.2,
          ease: "power2.out"
        });
        this.keyboardHeight = 0;
      }
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const message = this.chatInput.value.trim();
    if (!message) return;

    // Форма уже в нужной позиции, просто добавляем сообщение
    this.addMessage(message, 'user');
    this.chatInput.value = '';
    
    // Показываем индикатор загрузки
    this.showTyping();
    
    try {
      // Отправляем запрос к API
      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: message })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Убираем индикатор загрузки
      this.hideTyping();
      
      // Добавляем ответ бота
      this.addMessage(data.response || data.message || 'Извините, не удалось получить ответ', 'bot');
      
    } catch (error) {
      console.error("Ошибка:", error);
      this.hideTyping();
      this.addMessage('Извините, произошла ошибка. Попробуйте еще раз.', 'bot', true);
    }
  }

  addMessage(text, sender, isError = false) {
    const messageDiv = document.createElement('div');
    
    // Адаптивные отступы между сообщениями для лучшего восприятия
    messageDiv.className = `animate-in slide-in-from-bottom-5 duration-300 mb-1.5 sm:mb-2.5 ${sender === 'user' ? 'flex justify-end' : 'flex justify-start'}`;
    
    const messageContent = document.createElement('div');
    
    // Увеличенный текст для лучшей читаемости на мобильных
    if (sender === 'user') {
      messageContent.className = 'max-w-[90%] xs:max-w-[85%] sm:max-w-[70%] py-1.5 px-2.5 sm:py-2.5 sm:px-3.5 text-sm xs:text-base sm:text-base leading-relaxed rounded-lg sm:rounded-xl rounded-br-sm bg-teal-200 text-teal-900 break-words';
    } else if (isError) {
      messageContent.className = 'max-w-[90%] xs:max-w-[85%] sm:max-w-[70%] py-1.5 px-2.5 sm:py-2.5 sm:px-3.5 text-sm xs:text-base sm:text-base leading-relaxed rounded-lg sm:rounded-xl rounded-bl-sm bg-red-500 text-white break-words';
    } else {
      messageContent.className = 'max-w-[90%] xs:max-w-[85%] sm:max-w-[70%] py-1.5 px-2.5 sm:py-2.5 sm:px-3.5 text-sm xs:text-base sm:text-base leading-relaxed rounded-lg sm:rounded-xl rounded-bl-sm bg-white text-teal-900 break-words';
    }
    
    // Если это сообщение от бота и не ошибка, парсим Markdown
    if (sender === 'bot' && !isError && typeof marked !== 'undefined') {
      // Настройки для marked
      marked.setOptions({
        breaks: true, // Переносы строк как <br>
        gfm: true,    // GitHub Flavored Markdown
        sanitize: false, // Разрешаем HTML (будьте осторожны в продакшене)
        highlight: function(code, lang) {
          // Простая подсветка кода (опционально)
          return `<code class="language-${lang || 'text'}">${code}</code>`;
        }
      });
      
      messageContent.innerHTML = marked.parse(text);
    } else {
      messageContent.textContent = text;
    }
    
    messageDiv.appendChild(messageContent);
    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();
  }

  showTyping() {
    if (document.querySelector('.typing-indicator')) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex justify-start typing-indicator mb-1.5 sm:mb-2.5';
    typingDiv.innerHTML = `
      <div class="max-w-[90%] xs:max-w-[85%] sm:max-w-[70%] py-1.5 px-2.5 sm:py-2.5 sm:px-3.5 rounded-lg sm:rounded-xl rounded-bl-sm bg-transparent">
        <div class="flex gap-1 items-center h-4 sm:h-5">
          <span class="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-teal-700 rounded-full opacity-40 animate-pulse" style="animation-delay: 0s"></span>
          <span class="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-teal-700 rounded-full opacity-40 animate-pulse" style="animation-delay: 0.2s"></span>
          <span class="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-teal-700 rounded-full opacity-40 animate-pulse" style="animation-delay: 0.4s"></span>
        </div>
      </div>
    `;
    
    this.chatMessages.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTyping() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  // Вычисляет смещение для поднятия формы над клавиатурой
  calculateBottomPosition() {
    // Форма уже позиционирована внизу через CSS (bottom-0)
    // Возвращаем 0, так как дополнительное смещение не требуется
    return 0;
  }

  // Получает реальную высоту viewport с учётом мобильной навигации
  getRealViewportHeight() {
    // Используем Visual Viewport API если доступен (учитывает динамическую навигацию)
    if (window.visualViewport) {
      return window.visualViewport.height;
    }
    
    // Fallback для старых браузеров
    return window.innerHeight;
  }


}

// Инициализация чат-бота после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
  new ChatBot();
});

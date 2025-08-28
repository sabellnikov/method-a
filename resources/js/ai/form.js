const FUNCTION_URL = "https://functions.yandexcloud.net/d4eifnmujs29c4uf9nj6";

class ChatBot {
  constructor() {
    this.chatMessages = document.querySelector('.chat-messages > div'); // Внутренний скроллируемый контейнер
    this.chatForm = document.querySelector('.chat-form');
    this.chatInput = document.querySelector('.chat-input');
    this.chatBtn = document.querySelector('.chat-btn');
    this.isFirstMessage = true;
    this.messageCount = 0; // Счетчик сообщений пользователя
    this.messageLimit = 5; // Лимит сообщений
    
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
    this.chatForm.addEventListener('submit', (e) => {
      this.hideWelcomeMessage();
      this.handleSubmit(e);
    });
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.hideWelcomeMessage();
        this.handleSubmit(e);
      }
    });
    
    // Обработка изменения размера окна для адаптации позиции формы
    window.addEventListener('resize', () => this.handleResize());
    
    // приветственное сообщение удалено
  }

  hideWelcomeMessage() {
    if (this.isFirstMessage) {
      const welcomeMessage = document.querySelector('.welcome-message');
      const actionButtons = document.querySelector('.action-buttons');
      
      if (welcomeMessage) {
        gsap.to(welcomeMessage, {
          opacity: 0,
          duration: 0.1,
          ease: "power2.out",
          onComplete: () => {
            // Отключаем взаимодействие после анимации
            welcomeMessage.style.pointerEvents = 'none';
          }
        });
      }
      
      if (actionButtons) {
        gsap.to(actionButtons, {
          opacity: 0,
          duration: 0.1,
          ease: "power2.out",
          onComplete: () => {
            // Отключаем взаимодействие после анимации
            actionButtons.style.pointerEvents = 'none';
          }
        });
      }
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const message = this.chatInput.value.trim();
    if (!message) return;

    // Проверяем лимит сообщений
    if (this.messageCount >= this.messageLimit) {
      this.showLimitReached();
      return;
    }

    // Увеличиваем счетчик сообщений
    this.messageCount++;

    // Если это первое сообщение, перемещаем форму к оптимальной позиции
    if (this.isFirstMessage) {
      const moveDistance = this.calculateFormPosition();
      const isMobile = window.innerWidth < 640;
      
      if (isMobile) {
        // На мобильных: мгновенное позиционирование без анимации
        gsap.set(this.chatForm, { y: moveDistance });
      } else {
        // На десктопе: красивая анимация
        gsap.to(this.chatForm, {
          y: moveDistance,
          duration: 0.8,
          ease: "power2.out"
        });
      }
      
      this.isFirstMessage = false;
    }
    
    // Добавляем сообщение пользователя
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

  // Получает HTML кнопки связи из разметки
  getContactButton() {
    const contactButton = document.getElementById('limitContactButton');
    if (!contactButton) return '';
    
    // Клонируем элемент, чтобы не изменять оригинал
    const clonedButton = contactButton.cloneNode(true);
    
    // Убираем все скрывающие классы из клона
    clonedButton.classList.remove('hidden', 'absolute', '-top-full', 'opacity-0', 'pointer-events-none');
    
    return clonedButton.outerHTML;
  }

  // Показывает уведомление о достижении лимита сообщений
  showLimitReached() {
    // Блокируем ввод
    this.chatInput.disabled = true;
    this.chatBtn.disabled = true;
    
    // Меняем placeholder
    this.chatInput.placeholder = "Лимит сообщений исчерпан";
    
    // Добавляем системное сообщение с анимацией
    const limitMessage = document.createElement('div');
    limitMessage.className = 'flex justify-center mb-1.5 sm:mb-2.5 limit-message';
    limitMessage.innerHTML = `
      <div class="max-w-[90%] xs:max-w-[85%] sm:max-w-[70%] py-2 px-3 sm:py-3 sm:px-4 text-sm xs:text-base sm:text-base leading-relaxed rounded-lg sm:rounded-xl bg-orange-100 text-orange-800 border border-orange-200 text-center">
        <div class="flex items-center justify-center gap-2 mb-1">
          <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">Лимит исчерпан</span>
        </div>
        <p class="text-xs sm:text-sm mb-3">Сохраните свои наработки и приходите к нам в бюро! <br> Мы воплотим вашу идею в жизнь!</p>
        ${this.getContactButton()}
      </div>
    `;
    
    // Добавляем с красивой анимацией
    gsap.set(limitMessage, { opacity: 0, y: 20, scale: 0.95 });
    this.chatMessages.appendChild(limitMessage);
    
    gsap.to(limitMessage, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)"
    });
    
    // Анимация блокировки формы
    gsap.to(this.chatForm, {
      opacity: 0.6,
      duration: 0.3,
      ease: "power2.out"
    });
    
    this.scrollToBottom();
  }

  // Вычисляет оптимальную позицию формы в зависимости от размера экрана
  calculateFormPosition() {
    const isMobile = window.innerWidth < 640; // sm breakpoint в Tailwind
    const containerHeight = this.chatForm.parentElement.clientHeight;
    const formHeight = this.chatForm.clientHeight;
    
    let moveDistance;
    if (isMobile) {
      // На мобильных: форма ближе к низу для удобства набора
      const bottomOffset = this.getTailwindPadding('pb-12');
      moveDistance = (containerHeight / 2) - formHeight - bottomOffset;
    } else {
      // На ПК: форма ближе к центру для лучшего баланса  
      const bottomOffset = this.getTailwindPadding('pb-4');
      moveDistance = (containerHeight / 2) - formHeight - bottomOffset;
    }
    
    return moveDistance;
  }

  // Обрабатывает изменение размера окна
  handleResize() {
    // Если форма уже была перемещена, корректируем её позицию
    if (!this.isFirstMessage) {
      const newPosition = this.calculateFormPosition();
      const isMobile = window.innerWidth < 640;
      
      if (isMobile) {
        // На мобильных: быстрое позиционирование для адаптации к клавиатуре
        gsap.to(this.chatForm, {
          y: newPosition,
          duration: 0.2,
          ease: "power2.out"
        });
      } else {
        // На десктопе: плавная анимация
        gsap.to(this.chatForm, {
          y: newPosition,
          duration: 0.4,
          ease: "power2.out"
        });
      }
    }
  }
}

// Инициализация чат-бота после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
  new ChatBot();
});

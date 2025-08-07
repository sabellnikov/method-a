class ChatInterface {
  constructor() {
    this.elements = {
      chatMessages: document.getElementById('chat-messages'),
      chatForm: document.getElementById('chat-form'),
      chatInput: document.getElementById('chat-input'),
      placeholderEl: document.getElementById('placeholder-text')
    };
    
    this.state = {
      INITIAL: 'initial',
      CHATTING: 'chatting',
      TYPING: 'typing'
    };
    
    this.currentState = this.state.INITIAL;
    this.placeholderTL = null;
    this.currentPlaceholderIndex = 0;
    
    this.placeholders = [
      "Желаете создать план обучения?",
      "Как изучить новый навык?", 
      "Нужна помощь с организацией времени?",
      "Хотите составить расписание занятий?",
      "Какую тему изучить сегодня?",
      "Помочь с выбором курса?"
    ];
    
    this.isAnimating = false; // Флаг для предотвращения конфликтов анимаций
    this.messageQueue = []; // Очередь сообщений
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.setRandomInitialPlaceholder();
    this.startPlaceholderAnimation();
  }
  
  setupEventListeners() {
    this.elements.chatForm.addEventListener('submit', this.handleSubmit.bind(this));
    this.elements.chatInput.addEventListener('focus', this.handleInputFocus.bind(this));
    this.elements.chatInput.addEventListener('blur', this.handleInputBlur.bind(this));
    this.elements.chatInput.addEventListener('input', this.debounce(this.handleInputChange.bind(this), 200));
  }
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  getRandomPlaceholderIndex() {
    if (this.placeholders.length <= 1) return 0;
    
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.placeholders.length);
    } while (newIndex === this.currentPlaceholderIndex);
    
    return newIndex;
  }
  
  startPlaceholderAnimation() {
    if (this.currentState !== this.state.INITIAL) return;
    
    this.stopPlaceholderAnimation();
    
    this.placeholderTL = gsap.timeline({ repeat: -1 })
      .to({}, { duration: 2.5 })
      .to(this.elements.placeholderEl, { 
        y: -40, 
        opacity: 0, 
        duration: 0.4, 
        ease: "power2.in" 
      })
      .call(() => this.updatePlaceholderText())
      .to(this.elements.placeholderEl, { 
        y: 0, 
        opacity: 1, 
        duration: 0.4, 
        ease: "power2.out" 
      });
  }
  
  stopPlaceholderAnimation() {
    if (this.placeholderTL) {
      this.placeholderTL.kill();
      this.placeholderTL = null;
      gsap.set(this.elements.placeholderEl, { y: 0, opacity: 1 });
    }
  }
  
  updatePlaceholderText() {
    this.currentPlaceholderIndex = this.getRandomPlaceholderIndex();
    this.elements.placeholderEl.textContent = this.placeholders[this.currentPlaceholderIndex];
    gsap.set(this.elements.placeholderEl, { y: 40 });
  }
  
  setRandomInitialPlaceholder() {
    this.currentPlaceholderIndex = Math.floor(Math.random() * this.placeholders.length);
    this.elements.placeholderEl.textContent = this.placeholders[this.currentPlaceholderIndex];
  }
  
  isMobile() {
    return window.innerWidth <= 640; // sm breakpoint in Tailwind
  }
  
  transitionToChatMode() {
    if (this.currentState === this.state.CHATTING) return;
    
    this.currentState = this.state.CHATTING;
    this.stopPlaceholderAnimation();
    
    // Простая логика из оригинального скрипта
    this.elements.chatForm.classList.remove('-translate-x-1/2', '-translate-y-1/2');
    this.elements.chatForm.style.top = this.isMobile() ? '75vh' : '85vh';
    this.elements.chatForm.style.transform = 'translateX(-50%)';
    
    // Показываем область сообщений
    this.elements.chatMessages.classList.remove('opacity-0');
    this.elements.chatMessages.classList.add('opacity-100');
  }
  
  addMessage(text, isUser = false) {
    if (!text?.trim()) return;
    
    // Добавляем в очередь если идет анимация
    if (this.isAnimating) {
      this.messageQueue.push({ text, isUser });
      return;
    }
    
    this.processMessage(text, isUser);
  }
  
  async processMessage(text, isUser) {
    this.isAnimating = true;
    
    const existingMessages = Array.from(this.elements.chatMessages.children);
    
    // Удаляем старые сообщения если их больше 2
    if (existingMessages.length >= 2) {
      await this.removeOldMessages(existingMessages);
    }
    
    // Создаем и анимируем новое сообщение
    const messageElement = await this.createAndAnimateMessage(text, isUser);
    
    this.isAnimating = false;
    
    // Обрабатываем очередь
    if (this.messageQueue.length > 0) {
      const next = this.messageQueue.shift();
      setTimeout(() => this.processMessage(next.text, next.isUser), 100);
    }
    
    return messageElement;
  }
  
  removeOldMessages(messages) {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: resolve
      });
      
      // Группируем анимацию для лучшей производительности
      messages.forEach((msg, index) => {
        tl.to(msg, {
          y: -100,
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => msg.remove()
        }, index * 0.05);
      });
    });
  }
  
  createAndAnimateMessage(text, isUser) {
    return new Promise((resolve) => {
      const messageElement = document.createElement('div');
      const baseClasses = 'rounded-2xl px-4 py-2 max-w-[80%] will-change-transform';
      
      if (isUser) {
        messageElement.className = `self-end bg-[var(--color-hover-current-page)] text-white ${baseClasses}`;
      } else {
        messageElement.className = `self-start bg-gray-100 text-gray-800 ${baseClasses}`;
      }
      
      messageElement.textContent = text;
      messageElement.style.marginBottom = '16px';
      
      // Оптимизированная начальная позиция
      gsap.set(messageElement, { 
        y: 20, 
        opacity: 0, 
        scale: 0.98,
      });
      
      this.elements.chatMessages.appendChild(messageElement);
      
      // Улучшенная анимация появления
      gsap.to(messageElement, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.2)",
        delay: isUser ? 0 : 0.2,
        onComplete: () => resolve(messageElement)
      });
    });
  }
  
  scrollToBottom() {
    // Не нужно скроллить, так как сообщения появляются в фиксированной позиции
  }
  
  async simulateBotReply(userText) {
    this.currentState = this.state.TYPING;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = `Это пример ответа на: "${userText}"`;
      this.addMessage(response, false);
      this.currentState = this.state.CHATTING;
    } catch (error) {
      console.error('Ошибка при получении ответа:', error);
      this.addMessage('Извините, произошла ошибка. Попробуйте еще раз.', false);
      this.currentState = this.state.CHATTING;
    }
  }
  
  handleSubmit(event) {
    event.preventDefault();
    
    const text = this.elements.chatInput.value.trim();
    if (!text) return;
    
    this.addMessage(text, true);
    this.elements.chatInput.value = '';
    this.transitionToChatMode();
    
    // Устанавливаем placeholder после изменения состояния
    this.elements.chatInput.placeholder = 'Введите ваше сообщение...';
    
    // Скрываем анимированный placeholder
    gsap.to(this.elements.placeholderEl, { opacity: 0, duration: 0.2 });
    
    this.simulateBotReply(text);
  }
  
  handleInputFocus() {
    if (this.currentState === this.state.INITIAL) {
      this.stopPlaceholderAnimation();
      gsap.to(this.elements.placeholderEl, { opacity: 0, duration: 0.2 });
    }
  }
  
  handleInputBlur() {
    if (this.currentState === this.state.INITIAL && !this.elements.chatInput.value.trim()) {
      gsap.to(this.elements.placeholderEl, { opacity: 1, duration: 0.2 });
      setTimeout(() => this.startPlaceholderAnimation(), 200);
    }
  }
  
  handleInputChange() {
    if (this.currentState === this.state.INITIAL) {
      const hasValue = this.elements.chatInput.value.trim() !== '';
      const targetOpacity = hasValue ? 0 : (document.activeElement === this.elements.chatInput ? 0 : 1);
      
      gsap.to(this.elements.placeholderEl, { opacity: targetOpacity, duration: 0.2 });
    }
  }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  window.chatInterface = new ChatInterface();
});
class ChatInterface {
  constructor() {
    // DOM элементы
    this.elements = {
      chatMessages: document.getElementById('chat-messages'),
      chatForm: document.getElementById('chat-form'),
      chatInput: document.getElementById('chat-input'),
      placeholderEl: document.getElementById('placeholder-text')
    };
    
    // Состояния чата
    this.state = {
      INITIAL: 'initial',
      CHATTING: 'chatting',
      TYPING: 'typing'
    };
    
    // Конфигурация
    this.placeholders = [
      "Желаете создать план обучения?",
      "Как изучить новый навык?", 
      "Нужна помощь с организацией времени?",
      "Хотите составить расписание занятий?",
      "Какую тему изучить сегодня?",
      "Помочь с выбором курса?"
    ];
    
    // Состояние компонента
    this.currentState = this.state.INITIAL;
    this.placeholderTL = null;
    this.currentPlaceholderIndex = 0;
    this.isAnimating = false;
    this.messageQueue = [];
    this.keyboardState = false;
    
    // Настройки viewport и мобильных устройств
    this.documentHeight = document.documentElement.clientHeight;
    this.baseViewportHeight = window.innerHeight;
    this.keyboardThreshold = 250;
    this.mobileBottomOffset = '50px';
    
    this.init();
  }
  
  // ==================== ИНИЦИАЛИЗАЦИЯ ====================
  
  init() {
    this.setupEventListeners();
    this.setRandomInitialPlaceholder();
    this.startPlaceholderAnimation();
    // Убираем сложные viewport handlers - CSS справится сам
  }
  
  setupEventListeners() {
    this.elements.chatForm.addEventListener('submit', this.handleSubmit.bind(this));
    this.elements.chatInput.addEventListener('focus', this.handleInputFocus.bind(this));
    this.elements.chatInput.addEventListener('blur', this.handleInputBlur.bind(this));
    this.elements.chatInput.addEventListener('input', this.debounce(this.handleInputChange.bind(this), 200));
  }
  
  // ==================== УТИЛИТЫ ====================
  
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
  
  isMobile() {
    return window.innerWidth <= 640;
  }
  
  getRandomPlaceholderIndex() {
    if (this.placeholders.length <= 1) return 0;
    
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.placeholders.length);
    } while (newIndex === this.currentPlaceholderIndex);
    
    return newIndex;
  }
  
  // ==================== АНИМАЦИИ PLACEHOLDER ====================
  
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
  
  // ==================== ПОЗИЦИОНИРОВАНИЕ И VIEWPORT ====================
  
  updateViewportState() {
    const currentHeight = window.innerHeight;
    if (currentHeight > this.baseViewportHeight) {
      this.baseViewportHeight = currentHeight;
    }
  }
  
  trackViewportChanges() {
    this.updateViewportState();
  }

  updateViewportTracking() {
    this.updateViewportState();
  }

  isKeyboardOpen() {
    const currentHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const heightDifference = this.baseViewportHeight - currentHeight;
    
    return this.isMobile() && heightDifference > this.keyboardThreshold;
  }

  handleMobileKeyboard() {
    if (!this.isMobile() || this.currentState !== this.state.CHATTING) return;

    const isKeyboardOpen = this.isKeyboardOpen();
    
    if (isKeyboardOpen !== this.keyboardState) {
      this.keyboardState = isKeyboardOpen;
      this.setFormPosition(isKeyboardOpen);
    }
  }
  
  // Удаляем сложные методы позиционирования
  setFormPosition(isKeyboardOpen) {
    // Больше не нужно - CSS медиа-запросы управляют позицией
  }

  updateFormPosition() {
    // Больше не нужно - все через flex
  }
  
  toggleNavigationFixed(isActive) {
    const fixed = isActive;
    document.getElementById('siteNameBar')?.classList.toggle('fixed', fixed);
    document.getElementById('siteIconBar')?.classList.toggle('fixed', fixed);
  }
  
  // ==================== УПРАВЛЕНИЕ СОСТОЯНИЕМ ====================
  
  transitionToChatMode() {
    if (this.currentState === this.state.CHATTING) return;
    
    this.currentState = this.state.CHATTING;
    this.stopPlaceholderAnimation();
    
    // Только переключение CSS классов - всё остальное делает CSS
    document.querySelector('.chat-container').classList.add('chat-active');
    this.elements.chatMessages.classList.add('visible');
    
    this.toggleNavigationFixed(true);
  }
  
  // ==================== УПРАВЛЕНИЕ СООБЩЕНИЯМИ ====================
  
  addMessage(text, isUser = false) {
    if (!text?.trim()) return;
    
    if (this.isAnimating) {
      this.messageQueue.push({ text, isUser });
      return;
    }
    
    this.processMessage(text, isUser);
  }
  
  async processMessage(text, isUser) {
    this.isAnimating = true;
    
    const existingMessages = Array.from(this.elements.chatMessages.children);
    
    if (existingMessages.length >= 2) {
      await this.removeOldMessages(existingMessages);
    }
    
    const messageElement = await this.createAndAnimateMessage(text, isUser);
    
    this.isAnimating = false;
    
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
      
      gsap.set(messageElement, { 
        y: 20, 
        opacity: 0, 
        scale: 0.98,
      });
      
      this.elements.chatMessages.appendChild(messageElement);
      
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
  
  // ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================
  
  handleSubmit(event) {
    event.preventDefault();
    
    const text = this.elements.chatInput.value.trim();
    if (!text) return;
    
    this.addMessage(text, true);
    this.elements.chatInput.value = '';
    this.transitionToChatMode();
    
    this.elements.chatInput.placeholder = 'Введите ваше сообщение...';
    gsap.to(this.elements.placeholderEl, { opacity: 0, duration: 0.2 });
    
    this.simulateBotReply(text);
  }
  
  handleInputFocus() {
    if (this.currentState === this.state.INITIAL) {
      this.stopPlaceholderAnimation();
      gsap.to(this.elements.placeholderEl, { opacity: 0, duration: 0.2 });
    }
    // Убираем мобильную логику - CSS медиа-запросы справятся
  }
  
  handleInputBlur() {
    if (this.currentState === this.state.INITIAL && !this.elements.chatInput.value.trim()) {
      gsap.to(this.elements.placeholderEl, { opacity: 1, duration: 0.2 });
      setTimeout(() => this.startPlaceholderAnimation(), 200);
    }
    // Убираем мобильную логику - CSS медиа-запросы справятся
  }
  
  handleInputChange() {
    if (this.currentState === this.state.INITIAL) {
      const hasValue = this.elements.chatInput.value.trim() !== '';
      const targetOpacity = hasValue ? 0 : (document.activeElement === this.elements.chatInput ? 0 : 1);
      
      gsap.to(this.elements.placeholderEl, { opacity: targetOpacity, duration: 0.2 });
    }
  }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', () => {
  window.chatInterface = new ChatInterface();
});
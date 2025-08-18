const FUNCTION_URL = "https://functions.yandexcloud.net/d4eifnmujs29c4uf9nj6";

class ChatBot {
  constructor() {
    this.chatMessages = document.querySelector('.chat-messages');
    this.chatForm = document.querySelector('.chat-form');
    this.chatInput = document.querySelector('.chat-input');
    this.chatBtn = document.querySelector('.chat-btn');
    
    this.init();
  }

  init() {
    this.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSubmit(e);
      }
    });
    
    // приветственное сообщение удалено
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const message = this.chatInput.value.trim();
    if (!message) return;
    
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
    messageDiv.className = `chat-message ${sender}-message ${isError ? 'error' : ''}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
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
    
    // Временная метка удалена — не добавляем элемент с временем
    messageDiv.appendChild(messageContent);
    
    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();
  }

  showTyping() {
    if (document.querySelector('.typing-indicator')) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
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
}

// Инициализация чат-бота после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
  new ChatBot();
});

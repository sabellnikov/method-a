// Предустановленные промты
const prompts = {
  creation: `Помоги создать структуру образовательного курса на тему: [укажите тему]

Включи следующие элементы:
- Цели и задачи курса
- Целевую аудиторию  
- Структуру модулей
- Основные темы каждого модуля
- Методы обучения и оценки`,
  
  refactoring: `Помоги улучшить существующий образовательный курс:

[Вставьте описание текущего курса или его структуру]

Проанализируй и предложи улучшения по:
- Логике изложения материала
- Методам подачи информации
- Интерактивности и вовлечению
- Системе оценивания`
};

// Функции для работы с модальным окном
function openPromptModal(type) {
  const modal = document.getElementById('promptModal');
  const title = document.getElementById('modalTitle');
  const textarea = document.getElementById('promptText');
  
  title.textContent = type === 'creation' ? 'Создание курса' : 'Рефакторинг курса';
  textarea.value = prompts[type];
  
  modal.classList.remove('invisible');
  modal.classList.remove('opacity-0');
  modal.querySelector('.bg-white').classList.remove('scale-95');
}

function closePromptModal() {
  const modal = document.getElementById('promptModal');
  modal.classList.add('opacity-0');
  modal.querySelector('.bg-white').classList.add('scale-95');
  
  setTimeout(() => {
    modal.classList.add('invisible');
  }, 300);
}

function sendPrompt() {
  const textarea = document.getElementById('promptText');
  const chatInput = document.querySelector('.chat-input');
  const chatForm = document.querySelector('.chat-form');
  
  // Вставляем промт в форму
  chatInput.value = textarea.value.trim();
  
  // Закрываем модальное окно
  closePromptModal();
  
  // Отправляем форму
  if (chatInput.value) {
    chatForm.dispatchEvent(new Event('submit'));
  }
}

// Инициализация модального окна после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  // Закрытие модального окна по клику на фон
  const modal = document.getElementById('promptModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closePromptModal();
      }
    });
  }
});

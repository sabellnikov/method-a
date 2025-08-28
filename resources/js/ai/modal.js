// Предустановленные промты
const prompts = {
  creation: `Ты – совет из экспертов: лучший методолог, который составляет результативные образовательные программы для обучения людей, <strong>укажите дополнительно профессии/названия специалистов, которые могли бы выступить экспертами по теме вашего курса</strong>.

Составь образовательную программу по теме <strong>введите тему обучения</strong>. Укажи оптимальную длительность и формат обучения в соответствии с целевой аудиторией и образовательным результатом по итогу обучения.

Ответ представь в виде таблицы со списком предварительных тем, а также описанием образовательной цели курса, образовательных результатов по итогу обучения, длительности программы по часам, форматов каждого занятия.

Целевая аудитория образовательной программы: <strong>опишите подробно ЦА</strong>

До старта курса целевая аудитория уже знает/умеет … по теме курса. <strong>Укажите начальные данные по уровню подготовки аудитории к обучению</strong>

Образовательный результат ЦА по итогу обучения <strong>опишите, как можно подробнее, что после обучения студенты смогут делать</strong>`,
  
  refactoring: `Помоги улучшить существующий образовательный курс:

<strong>Вставьте описание текущего курса или его структуру</strong>

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
  const promptDiv = document.getElementById('promptText');
  
  promptDiv.innerHTML = prompts[type];
  
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
  const promptDiv = document.getElementById('promptText');
  const chatInput = document.querySelector('.chat-input');
  const chatForm = document.querySelector('.chat-form');
  
  // Получаем текст без HTML тегов
  chatInput.value = promptDiv.innerText.trim();
  
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

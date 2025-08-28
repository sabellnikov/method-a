// Предустановленные промты
const prompts = {
  creation: `Ты – совет из экспертов: лучший методолог, который составляет результативные образовательные программы для обучения людей, <strong>укажите дополнительно профессии/названия специалистов, которые могли бы выступить экспертами по теме вашего курса</strong>.

Составь образовательную программу по теме <strong>введите тему обучения</strong>. Укажи оптимальную длительность и формат обучения в соответствии с целевой аудиторией и образовательным результатом по итогу обучения.

Ответ представь в виде таблицы со списком предварительных тем, а также описанием образовательной цели курса, образовательных результатов по итогу обучения, длительности программы по часам, форматов каждого занятия.

Целевая аудитория образовательной программы: <strong>опишите подробно ЦА</strong>

До старта курса целевая аудитория уже знает/умеет … по теме курса. <strong>Укажите начальные данные по уровню подготовки аудитории к обучению</strong>

Образовательный результат ЦА по итогу обучения <strong>опишите, как можно подробнее, что после обучения студенты смогут делать</strong>`,
  
  refactoring: `Ты – совет из экспертов: лучший методолог, который составляет результативные образовательные программы для обучения людей, <strong>укажите дополнительно профессии/названия специалистов, которые могли бы выступить экспертами по теме вашего курса</strong>.

Сделай рефакторинг образовательной программы по теме <strong>введите тему обучения</strong> и предложи ряд улучшений для программы. Представь результаты в виде аналитической справки, где укажи:
1) соответствуют ли образовательные цели содержанию программы;
2) есть ли взаимосвязь между образовательной целью и образовательными результатами;
3) логично ли представлено содержание курса;
4) помогает ли формат обучения достигать образовательную цель;
5) оптимальна ли длительность обучения, исходя из образовательной цели и формата обучения.

Учитывай указанные ниже данные:
1. Образовательная цель – <strong>напишите цель</strong>
2. Образовательные результаты обучения: <strong>напишите результаты</strong>
3. Формат обучения <strong>(онлайн/офлайн/гибрид + описание, как проходит обучение)</strong>
4. Длительность обучения в часах <strong>напишите длительность</strong>
5. Содержание курса <strong>(темы и краткое контекстное описание каждого занятия)</strong>

`
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

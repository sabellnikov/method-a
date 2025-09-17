/**
 * Добавляет магнитный эффект к карточкам
 * Карточки плавно следуют за курсором мыши при наведении
 */
function addCardMagnetEffect() {
  const cards = document.querySelectorAll('.card-link');
  
  cards.forEach(cardLink => {
    const card = cardLink.querySelector('.card');
    let magnetTween = null;
    
    cardLink.addEventListener('mouseenter', (e) => {
      // Убираем предыдущую анимацию если есть
      if (magnetTween) magnetTween.kill();
    });
    
    cardLink.addEventListener('mousemove', (e) => {
      const rect = cardLink.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Вычисляем смещение курсора относительно центра карточки
      const deltaX = (e.clientX - centerX) * 0.15; // Уменьшаем силу притягивания
      const deltaY = (e.clientY - centerY) * 0.15;
      
      // Применяем смещение с плавной анимацией
      if (magnetTween) magnetTween.kill();
      magnetTween = gsap.to(card, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    cardLink.addEventListener('mouseleave', () => {
      // Возвращаем карточку в исходное положение
      if (magnetTween) magnetTween.kill();
      magnetTween = gsap.to(card, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    });
  });
}

let carouselAnimation = null;
let isResizing = false;

function calculateCarouselCardSizes() {
  const container = document.getElementById('carouselContainer');
  const cards = document.querySelectorAll('.carousel-card');
  if (!container || !cards.length) return;
  
  if (carouselAnimation) {
    carouselAnimation.kill();
    carouselAnimation = null;
  }
  
  const containerWidth = container.offsetWidth;
  const screenWidth = window.innerWidth;
  
  let smallCardWidth, largeCardWidth;
  
  if (screenWidth >= 640) {
    smallCardWidth = containerWidth / 3.4;
    largeCardWidth = smallCardWidth * 1.2;
  } else {
    smallCardWidth = containerWidth * 0.85;
    largeCardWidth = smallCardWidth;
  }
  
  const track = document.getElementById('carouselTrack');
  if (track) {
    gsap.set(track, { x: 0 });
  }
  
  cards.forEach(card => {
    if (screenWidth < 640) {
      card.style.width = smallCardWidth + 'px';
      card.classList.remove('h-[85%]');
      card.classList.add('h-full');
    } else {
      if (card.classList.contains('carousel-card-large')) {
        card.style.width = largeCardWidth + 'px';
        card.classList.add('h-full');
        card.classList.remove('h-[65%]');
      } else {
        card.style.width = smallCardWidth + 'px';
        card.classList.add('h-[65%]');
        card.classList.remove('h-full');
      }
    }
  });
  
  setTimeout(() => {
    if (!isResizing) {
      loopCarousel();
    }
  }, 50);
}

function loopCarousel() {
  const track = document.getElementById('carouselTrack');
  const cards = track.querySelectorAll('.carousel-card');
  if (!cards.length || isResizing) return;
  
  const firstCard = cards[0];
  const screenWidth = window.innerWidth;
  const containerWidth = document.getElementById('carouselContainer').offsetWidth;
  const cardWidth = firstCard.offsetWidth;
  
  let targetX, initialX;
  
  if (screenWidth >= 640) {
    targetX = -cardWidth;
    initialX = 0;
  } else {
    const centerOffset = (containerWidth - cardWidth) / 2;
    targetX = centerOffset - cardWidth;
    initialX = centerOffset;
  }
  
  carouselAnimation = gsap.to(track, {
    x: targetX,
    duration: 5,
    ease: screenWidth >= 640 ? "power1.inOut" : "sine.inOut",
    onComplete: () => {
      if (!isResizing && cards.length > 0) {
        track.appendChild(firstCard);
        gsap.set(track, { x: initialX });
        loopCarousel();
      }
    }
  });
}

function initExpandingAndTitles() {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.create({
    trigger: ".slide-section[data-bg]",
    start: "top top",
    end: "bottom+=500vh top",
    pin: true,
    pinSpacing: false,
    scrub: true,
    //markers: true,
    onUpdate: self => {
      const progress = self.progress;
      const fixed = self.isActive;
      document.getElementById('siteNameBar')?.classList.toggle('fixed', fixed);
      document.getElementById('siteIconBar')?.classList.toggle('fixed', fixed);
      
      // Заголовок уезжает вверх и исчезает
      gsap.to("#mainTitle", {
        opacity: progress < 0.1 ? 1 : 0,
        duration: 0.2,
        ease: "power1.out"
      });
      // "Наши работы" и "вместо слов" разъезжаются по горизонтали и исчезают
      gsap.to(["#leftWork", "#rightWord"], {
        x: i => i === 0 ? -window.innerWidth / 2 * progress : window.innerWidth / 2 * progress,
        y: 0,
        opacity: 1 - Math.max(0, (progress - 0.7) / 0.3),
        duration: 0.2,
        ease: "power1.out"
      });
      // Expanding container появляется и увеличивается
      gsap.to("#expandingContainer", {
        scale: progress < 0.5 ? 0.2 + 1.6 * progress : 1,
        opacity: progress < 0.5 ? progress * 2 : 1,
        borderRadius: progress < 0.5 ? "2rem" : "0rem",
        duration: 0.2,
        ease: "power1.out"
      });

      // Меняем цвет фона в конце анимации
      const targetColor = progress > 0.9 ? '#E0E0D1' : '#F3F3E9';
      document.documentElement.style.setProperty('--color-background-top', targetColor);
      
      // Также меняем цвет background-blend элемента
      const bgBlend = document.querySelector('.background-blend');
      if (bgBlend) {
        bgBlend.style.backgroundColor = targetColor;
      }

      // Эффект вылета карточек на зрителя (как в index.html)
      const cardsContainer = document.getElementById('cardsContainer');
      if (cardsContainer) cardsContainer.style.cssText = 'perspective: 1000px; perspective-origin: center center';
      
      const isReady = Date.now() - (window.cardsAppearanceStartTime || 0) > 2000;
      
      document.querySelectorAll('.card-link').forEach((card, i) => {
        if (!isReady) return; // Не трогаем карточки до завершения анимации появления
        
        const cardProgress = Math.max(0, (progress - 0.1 - i * 0.03) / 0.5);
        const isFlying = progress > 0.1 && cardProgress > 0;
        
        card.classList.toggle('flying-card', isFlying);
        
        // Простое скрытие карточек на высоком progress
        if (progress > 0.8) {
          gsap.set(card, { 
            opacity: 0, 
            scale: 1, 
            rotationX: 0, 
            rotationY: 0, 
            rotationZ: 0, 
            z: 0,
            transformStyle: 'preserve-3d', 
            force3D: true 
          });
          card.style.pointerEvents = 'none';
        } else {
          gsap.set(card, isFlying ? {
            scale: 1 + cardProgress * 0.15,
            rotationX: Math.sin(cardProgress * Math.PI) * 5,
            rotationY: Math.cos(cardProgress * Math.PI) * 3,
            rotationZ: Math.sin(cardProgress * Math.PI * 2) * 10,
            z: cardProgress * 500,
            opacity: Math.max(0.1, 1 - cardProgress * 0.8),
            transformStyle: 'preserve-3d',
            force3D: true
          } : {
            scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0, z: 0, opacity: 1,
            transformStyle: 'preserve-3d', force3D: true
          });
          card.style.pointerEvents = 'auto';
        }
      });
    }
  });
}
document.addEventListener('DOMContentLoaded', () => {
  // Компенсируем pin-пространство для expandingContainer
  const firstSection = document.querySelector('.slide-section[data-bg]');
  if (firstSection) {
    const extraSpace = window.innerHeight * 2.5; // соответствует 200vh из end параметра
    firstSection.style.marginBottom = extraSpace + 'px';
  }
  
  window.cardsAppearanceStartTime = Date.now();
  calculateCarouselCardSizes();
  positionCardsRandomly();
  if (typeof addCardMagnetEffect === 'function') {
    addCardMagnetEffect();
  }
  
  setTimeout(() => {
    if (window.innerWidth < 640) {
      const container = document.getElementById('carouselContainer');
      const track = document.getElementById('carouselTrack');
      if (container && track) {
        const containerWidth = container.offsetWidth;
        const firstCard = track.querySelector('.carousel-card');
        if (firstCard) {
          const cardWidth = firstCard.offsetWidth;
          const centerOffset = (containerWidth - cardWidth) / 2;
          gsap.set(track, { x: centerOffset });
        }
      }
    }
  }, 100);
  
  initExpandingAndTitles();
});

let resizeTimeout;
window.addEventListener('resize', () => {
  isResizing = true;
  clearTimeout(resizeTimeout);
  calculateCarouselCardSizes();
  resizeTimeout = setTimeout(() => {
    isResizing = false;
    calculateCarouselCardSizes();
  }, 200);
});
function positionCardsRandomly() {
  const container = document.getElementById('cardsContainer');
  const header = document.getElementById('mainHeaderSection');
  const cards = document.querySelectorAll('.card-link');
  if (!container || !header || !cards.length) return;
  const { width, height } = container.getBoundingClientRect();
  const headerRect = header.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const isMobile = window.innerWidth < 640;
  const [margin, cardSize, minDist] = isMobile ? [20, 75, 105] : [40, 120, 140];
  const [topMargin, bottomMargin] = isMobile ? [60, 60] : [margin, margin];
  const avoid = {
    left: headerRect.left - containerRect.left - (isMobile ? 10 : 20),
    right: headerRect.right - containerRect.left + (isMobile ? 10 : 20),
    top: headerRect.top - containerRect.top - (isMobile ? 50 : 20),
    bottom: headerRect.bottom - containerRect.top + (isMobile ? 80 : 20)
  };
  const positions = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const hasCollision = (x, y) => {
    if (x < avoid.right && x + cardSize > avoid.left && y < avoid.bottom && y + cardSize > avoid.top) {
      return true;
    }
    if (x < margin || y < topMargin || x + cardSize > width - margin || y + cardSize > height - bottomMargin) {
      return true;
    }
    const currentCenterX = x + cardSize / 2;
    const currentCenterY = y + cardSize / 2;
    return positions.some(pos => {
      const existingCenterX = pos.x + cardSize / 2;
      const existingCenterY = pos.y + cardSize / 2;
      const distance = Math.hypot(currentCenterX - existingCenterX, currentCenterY - existingCenterY);
      return distance < minDist;
    });
  };
  cards.forEach((card, i) => {
    let point;
    for (let attempt = 0; attempt < 80; attempt++) {
      let x, y;
      if (attempt < 15) {
        const totalCards = cards.length;
        const cardsPerRing = isMobile ? 6 : 8;
        const ringNumber = Math.floor(i / cardsPerRing);
        const positionInRing = i % cardsPerRing;
        const baseRadius = isMobile ? 80 : 120;
        const radius = baseRadius + ringNumber * (isMobile ? 70 : 100) + attempt * 10;
        const angleStep = (2 * Math.PI) / cardsPerRing;
        const angle = positionInRing * angleStep + ringNumber * 0.3;
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
      } else {
        x = margin + Math.random() * (width - cardSize - margin * 2);
        y = topMargin + Math.random() * (height - cardSize - topMargin - bottomMargin);
      }
      if (!hasCollision(x, y)) {
        point = { x, y };
        break;
      }
    }
    point ??= { x: margin, y: height - cardSize - bottomMargin };
    Object.assign(card.style, { left: `${point.x}px`, top: `${point.y}px` });
    const dx = point.x + cardSize/2 - centerX;
    const dy = point.y + cardSize/2 - centerY;
    const distance = Math.hypot(dx, dy);
    const scale = distance ? 80 / distance : 0;
    gsap.set(card, { opacity: 0, scale: 0.3, x: -dx * scale, y: -dy * scale });
    gsap.to(card, {
      opacity: 1, scale: 1, x: 0, y: 0,
      duration: 1.2, delay: 0.1 + Math.random() * 0.6 + distance * 0.0005,
      ease: "power3.out"
    });
    positions.push(point);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  window.cardsAppearanceStartTime = Date.now();
  positionCardsRandomly();
  if (typeof addCardMagnetEffect === 'function') {
    addCardMagnetEffect();
  }
});

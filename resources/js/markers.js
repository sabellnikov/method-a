// Горизонтальные маркеры (каждые 10%)
const percents = [90,80,70,60,50,40,30,20,10];
const colors = ['red','orange','gold','lime','blue','cyan','purple','magenta','green'];
percents.forEach((percent, i) => {
  const marker = document.createElement('div');
  marker.style.position = 'fixed';
  marker.style.left = '0';
  marker.style.right = '0';
  marker.style.top = percent + '%';
  marker.style.height = '2px';
  marker.style.background = colors[i % colors.length];
  marker.style.opacity = '0.25';
  marker.style.zIndex = '9999';
  marker.style.pointerEvents = 'none';
  marker.innerText = percent + '%';
  marker.style.fontSize = '10px';
  marker.style.color = '#222';
  marker.style.textAlign = 'right';
  marker.style.paddingRight = '8px';
  document.body.appendChild(marker);
});

// Вертикальные маркеры (каждые 10%)
// percents.forEach((percent, i) => {
//   const marker = document.createElement('div');
//   marker.style.position = 'fixed';
//   marker.style.top = '0';
//   marker.style.bottom = '0';
//   marker.style.left = percent + '%';
//   marker.style.width = '2px';
//   marker.style.background = colors[i % colors.length];
//   marker.style.opacity = '0.25';
//   marker.style.zIndex = '9999';
//   marker.style.pointerEvents = 'none';
//   marker.innerText = percent + '%';
//   marker.style.fontSize = '10px';
//   marker.style.color = '#222';
//   marker.style.textAlign = 'left';
//   marker.style.paddingTop = '8px';
//   document.body.appendChild(marker);
// });

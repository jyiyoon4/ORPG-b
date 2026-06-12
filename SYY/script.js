let mouseX = 0,
  mouseY = 0;
let cursorX = 0,
  cursorY = 0;

// 화면 전환 기능
window.navigateTo = function (fromId, toId) {
  const fromSection = document.getElementById(fromId);
  const toSection = document.getElementById(toId);

  fromSection.style.opacity = '0';
  setTimeout(() => {
    fromSection.classList.remove('active');
    toSection.classList.add('active');
    void toSection.offsetWidth;
    toSection.style.opacity = '1';

    if (toId === 'analysis') {
      drawConstellationLines();
      animateChartBars();
    }
  }, 1000);
};

document.addEventListener('DOMContentLoaded', () => {
  const customCursor = document.getElementById('custom-cursor');
  const textAreas = document.querySelectorAll('.glass-textarea');
  const landingSection = document.getElementById('landing');
  const enterBtn = document.getElementById('enterBtn');
  const chips = document.querySelectorAll('.chip');
  const neonObj = document.getElementById('neonObj');

  // 마우스 커서 추적
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    if (customCursor) {
      customCursor.style.left = cursorX + 'px';
      customCursor.style.top = cursorY + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // 텍스트 영역 내 기본 커서 표시
  textAreas.forEach((textarea) => {
    textarea.addEventListener(
      'mouseenter',
      () => (customCursor.style.opacity = '0'),
    );
    textarea.addEventListener(
      'mouseleave',
      () => (customCursor.style.opacity = '1'),
    );
  });

  // 랜딩 하단 도달 시 버튼 활성화
  if (landingSection && enterBtn) {
    landingSection.addEventListener('scroll', () => {
      const isBottom =
        landingSection.scrollTop + landingSection.clientHeight >=
        landingSection.scrollHeight - 5;
      if (isBottom) {
        enterBtn.classList.add('active-btn');
        enterBtn.removeAttribute('disabled');
      } else {
        enterBtn.classList.remove('active-btn');
        enterBtn.setAttribute('disabled', 'true');
      }
    });
  }

  // 태그 선택 시 네온 효과
  chips.forEach((chip) => {
    chip.addEventListener('click', function () {
      chips.forEach((c) => c.classList.remove('selected'));
      this.classList.add('selected');
      if (neonObj) {
        neonObj.classList.remove('pulse-anim');
        void neonObj.offsetWidth;
        neonObj.classList.add('pulse-anim');
      }
    });
  });

  // 분석방 선 위치 재조정
  window.addEventListener('resize', () => {
    const analysisSection = document.getElementById('analysis');
    if (analysisSection && analysisSection.classList.contains('active')) {
      drawConstellationLines();
    }
  });
});

// 별자리 선 그리기
function drawConstellationLines() {
  const svg = document.getElementById('linesSvg');
  const sphere = document.getElementById('centerSphere');
  const keywords = [
    document.getElementById('kw1'),
    document.getElementById('kw2'),
    document.getElementById('kw3'),
    document.getElementById('kw4'),
  ];

  if (!svg || !sphere) return;
  svg.innerHTML = '';

  const sphereRect = sphere.getBoundingClientRect();
  const centerX = sphereRect.left + sphereRect.width / 2;
  const centerY = sphereRect.top + sphereRect.height / 2;

  keywords.forEach((kw) => {
    if (!kw) return;
    const kwRect = kw.getBoundingClientRect();
    const kwX = kwRect.left + kwRect.width / 2;
    const kwY = kwRect.top + kwRect.height / 2;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', centerX);
    line.setAttribute('y1', centerY);
    line.setAttribute('x2', kwX);
    line.setAttribute('y2', kwY);
    svg.appendChild(line);
  });
}

// 분석방 막대 그래프 애니메이션
function animateChartBars() {
  const bars = document.querySelectorAll('.bar-fill');
  bars.forEach((bar) => {
    const targetWidth = bar.getAttribute('data-width');
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 300);
  });
}

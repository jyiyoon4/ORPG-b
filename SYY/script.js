// === 1. 부드러운 SPA 화면 전환 (Fade-out / Fade-in) ===
window.navigateTo = function (fromId, toId) {
  const fromSection = document.getElementById(fromId);
  const toSection = document.getElementById(toId);

  // Fade-out 시작
  fromSection.style.opacity = '0';

  // CSS transition 시간(1s)을 기다린 후 클래스 스왑
  setTimeout(() => {
    fromSection.classList.remove('active');
    toSection.classList.add('active');

    // 브라우저 렌더링 강제 업데이트 (Reflow) 후 투명도 복원
    void toSection.offsetWidth;
    toSection.style.opacity = '1';

    // 분석방으로 넘어갔을 때만 발동하는 초기화 함수들
    if (toId === 'analysis') {
      drawConstellationLines();
      animateChartBars();
    }
  }, 1000);
};

// === 2. DOM 로드 완료 후 실행되는 이벤트들 (하나로 통합) ===
document.addEventListener('DOMContentLoaded', () => {
  // === [새로 추가] 커스텀 색상 반전 마우스 커서 로직 ===
  const customCursor = document.getElementById('custom-cursor');
  const textAreas = document.querySelectorAll('.glass-textarea');

  // 1. 마우스 움직임 추적
  document.addEventListener('mousemove', (e) => {
    if (customCursor) {
      // position: fixed 상태이므로 clientX, clientY로 화면 기준 좌표 적용
      customCursor.style.left = e.clientX + 'px';
      customCursor.style.top = e.clientY + 'px';
    }
  });

  // 2. 텍스트 영역 호버 시 커스텀 커서 숨기기 (기본 텍스트 커서만 보이도록)
  textAreas.forEach(textarea => {
    textarea.addEventListener('mouseenter', () => {
      customCursor.style.opacity = '0';
    });
    textarea.addEventListener('mouseleave', () => {
      customCursor.style.opacity = '1';
    });
  });
  
  // [A] 랜딩 화면 스크롤 하단 도달 시 버튼 활성화
  const landingSection = document.getElementById('landing');
  const enterBtn = document.getElementById('enterBtn');

  if (landingSection && enterBtn) {
    landingSection.addEventListener('scroll', () => {
      // 현재 스크롤 위치 + 화면에 보이는 높이가 전체 스크롤 높이와 같은지 확인
      const isBottom =
        landingSection.scrollTop + landingSection.clientHeight >=
        landingSection.scrollHeight - 5;

      if (isBottom) {
        // 맨 아래에 닿으면 활성화
        enterBtn.classList.add('active-btn');
        enterBtn.removeAttribute('disabled');
      } else {
        // 위로 올리면 다시 비활성화
        enterBtn.classList.remove('active-btn');
        enterBtn.setAttribute('disabled', 'true');
      }
    });
  }

  // [B] 태그 클릭 시 네온 오브젝트 핑(Pulse) 효과
  const chips = document.querySelectorAll('.chip');
  const neonObj = document.getElementById('neonObj');

  chips.forEach((chip) => {
    chip.addEventListener('click', function () {
      // 시각적 선택 효과
      chips.forEach((c) => c.classList.remove('selected'));
      this.classList.add('selected');

      // 네온 오브젝트 펄스 애니메이션 재실행
      if (neonObj) {
        neonObj.classList.remove('pulse-anim');
        void neonObj.offsetWidth; // Reflow 트리거 (애니메이션 리셋)
        neonObj.classList.add('pulse-anim');
      }
    });
  });

  // [C] 창 크기가 변경될 때 선 위치 재조정
  window.addEventListener('resize', () => {
    const analysisSection = document.getElementById('analysis');
    if (analysisSection && analysisSection.classList.contains('active')) {
      drawConstellationLines();
    }
  });

  
});

// === 3. 분석방: 구체와 키워드를 잇는 별자리 선 그리기 ===
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

  svg.innerHTML = ''; // 기존 선 초기화

  // 중앙 좌표 계산
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

// === 4. 분석방: 막대 그래프 애니메이션 ===
function animateChartBars() {
  const bars = document.querySelectorAll('.bar-fill');
  bars.forEach((bar) => {
    const targetWidth = bar.getAttribute('data-width');
    // 약간의 지연 후 뻗어나가도록 설정
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 300);
  });
}

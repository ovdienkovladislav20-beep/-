/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Atmospheric Loading Overlay with Creepy Pulsing Heartbeat
 */

let overlayElement = null;
let heartbeatInterval = null;

const CHAPTER_MESSAGES = {
  1: [
    'Инициализация коридоров лабиринта...',
    'Она просыпается в темноте...',
    'Слушай её шаги. Не оборачивайся...',
    'Шкафы безопасны. Пока она не начнёт считать...',
    '3D-пространство готово к погружению...',
  ],
  2: [
    'Отпирание дверей старого особняка...',
    'Пыль веков оседает на половицах...',
    'Кто-то смотрит на тебя из окна второго этажа...',
    'Не включай свет надолго...',
    'Особняк ждёт свою жертву...',
  ],
  3: [
    'Спуск в туманное кладбище...',
    'Могильный холод проникает под кожу...',
    'Могильщик точит ржавую лопату...',
    'Мёртвые не любят незваных гостей...',
    'Склеп открывается...',
  ],
  4: [
    'Открытие ворот старого гаражного кооператива...',
    'Пахнет бензином, маслом и ржавым железом...',
    'В глубине боксов слышен скрежет гаечного ключа...',
    'ВАЗ-2112 ждёт свои детали в боксе №14...',
    'Механик вышел на ночной обход...',
  ],
  5: [
    'Заснеженная тропинка ведёт к старому дому у ёлки...',
    'Слышен звон саней и скрип половиц на втором этаже...',
    'Бабушка-Санта прячет ключ среди подарочных коробок...',
    'Огонь в камине мерцает... Не оборачивайся!',
    'Новогодняя глава готова к погружению...',
  ],
};

function playHeartbeatThump(ac) {
  if (!ac) return;
  try {
    const now = ac.currentTime;
    
    // First thump (lub) - deep low sine wave
    const osc1 = ac.createOscillator();
    const gain1 = ac.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, now);
    osc1.frequency.exponentialRampToValueAtTime(32, now + 0.12);
    gain1.gain.setValueAtTime(0.45, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(ac.destination);
    osc1.start(now);
    osc1.stop(now + 0.16);

    // Second thump (dub) - slightly higher, after 130ms
    setTimeout(() => {
      if (!overlayElement) return;
      const t = ac.currentTime;
      const osc2 = ac.createOscillator();
      const gain2 = ac.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(68, t);
      osc2.frequency.exponentialRampToValueAtTime(35, t + 0.14);
      gain2.gain.setValueAtTime(0.55, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc2.connect(gain2);
      gain2.connect(ac.destination);
      osc2.start(t);
      osc2.stop(t + 0.19);
    }, 130);
  } catch (e) {}
}

export function showAtmosphericLoading(options = {}) {
  const chapter = options.chapter || 1;
  const chapterTitle = options.chapterTitle || `ГЛАВА ${chapter}`;
  const duration = options.duration || 2600; // ms
  const onComplete = options.onComplete || (() => {});
  const ac = options.ac || null;

  if (overlayElement) overlayElement.remove();
  if (heartbeatInterval) clearInterval(heartbeatInterval);

  const messages = CHAPTER_MESSAGES[chapter] || CHAPTER_MESSAGES[1];

  const overlay = document.createElement('div');
  overlay.id = 'loading_overlay';
  overlay.style.cssText =
    'position:fixed;inset:0;background:#030102;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#eee;font-family:Georgia,serif;user-select:none;overflow:hidden;opacity:0;transition:opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);box-sizing:border-box;padding:20px;';

  overlay.innerHTML = `
    <!-- Dark Vignette and Blood Glow Background -->
    <div style="position:absolute;inset:0;background:radial-gradient(circle at center, rgba(80, 5, 10, 0.35) 0%, rgba(10, 2, 4, 0.95) 75%, #000 100%);pointer-events:none"></div>
    
    <!-- Heartbeat Container -->
    <div style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;max-width:480px;width:100%">
      
      <!-- Pulsing Heart Wrapper -->
      <div id="heart_wrapper" class="creepy-heartbeat-pulse" style="position:relative;width:110px;height:110px;margin-bottom:24px;display:flex;align-items:center;justify-content:center">
        <!-- Outer Blood Pulse Ring -->
        <div class="heartbeat-ring" style="position:absolute;inset:0;border-radius:50%;border:2px solid rgba(220, 20, 40, 0.6);box-shadow:0 0 35px rgba(220, 20, 40, 0.5)"></div>
        
        <!-- Glowing Anatomical/Neon Heart SVG -->
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:75px;height:75px;color:#e74c3c;filter:drop-shadow(0 0 18px #ff1133)">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      <!-- Title & Chapter -->
      <div style="font-size:13px;letter-spacing:0.35em;color:#a33;text-transform:uppercase;margin-bottom:6px;font-weight:bold">
        ИНИЦИАЛИЗАЦИЯ 3D АССЕТОВ
      </div>
      <h2 style="margin:0 0 16px;font-size:26px;color:#fff;letter-spacing:0.12em;text-shadow:0 0 20px rgba(220, 30, 40, 0.8)">
        ${chapterTitle}
      </h2>

      <!-- Atmospheric Lore / Loading Status Message -->
      <div id="loading_msg" style="font-size:14px;color:#cc8888;height:22px;line-height:22px;margin-bottom:20px;font-style:italic;text-shadow:0 1px 3px #000;transition:opacity 0.25s">
        ${messages[0]}
      </div>

      <!-- Progress Bar -->
      <div style="width:100%;max-width:340px;height:6px;background:#180608;border-radius:3px;border:1px solid #5a151b;overflow:hidden;position:relative;margin-bottom:12px;box-shadow:0 0 15px rgba(180, 0, 0, 0.3)">
        <div id="loading_bar_fill" style="width:0%;height:100%;background:linear-gradient(90deg, #880015, #e74c3c, #ff4757);box-shadow:0 0 12px #ff4757;transition:width 0.1s linear"></div>
      </div>

      <!-- Percentage Indicator -->
      <div style="display:flex;justify-content:space-between;width:100%;max-width:340px;font-size:12px;color:#885555">
        <span>ПОДГОТОВКА СЦЕНЫ</span>
        <b id="loading_pct" style="color:#f88">0%</b>
      </div>

    </div>
  `;

  document.body.appendChild(overlay);
  overlayElement = overlay;
  void overlay.offsetWidth;
  requestAnimationFrame(() => {
    if (overlay.isConnected) overlay.style.opacity = '1';
  });

  // Sound heartbeat trigger
  playHeartbeatThump(ac);
  heartbeatInterval = setInterval(() => {
    playHeartbeatThump(ac);
  }, 950);

  // Animate progress and messages
  const startTime = Date.now();
  let msgIndex = 0;

  const timer = setInterval(() => {
    if (!overlayElement) {
      clearInterval(timer);
      return;
    }

    const elapsed = Date.now() - startTime;
    const progress = Math.min(100, Math.round((elapsed / duration) * 100));

    const fill = document.getElementById('loading_bar_fill');
    const pct = document.getElementById('loading_pct');
    const msg = document.getElementById('loading_msg');

    if (fill) fill.style.width = progress + '%';
    if (pct) pct.textContent = progress + '%';

    // Message rotation
    const newMsgIdx = Math.min(messages.length - 1, Math.floor((elapsed / duration) * messages.length));
    if (newMsgIdx !== msgIndex && msg) {
      msgIndex = newMsgIdx;
      msg.style.opacity = '0';
      setTimeout(() => {
        if (msg) {
          msg.textContent = messages[msgIndex];
          msg.style.opacity = '1';
        }
      }, 200);
    }

    if (progress >= 100) {
      clearInterval(timer);
      if (heartbeatInterval) clearInterval(heartbeatInterval);

      // Smooth fade out
      setTimeout(() => {
        if (overlayElement) {
          overlayElement.style.opacity = '0';
          setTimeout(() => {
            if (overlayElement) {
              overlayElement.remove();
              overlayElement = null;
            }
            onComplete();
          }, 500);
        } else {
          onComplete();
        }
      }, 200);
    }
  }, 35);
}

export function showPreLobbyLoader(onDone) {
  if (document.getElementById('pre_lobby_loader')) {
    if (onDone) onDone();
    return;
  }
  const el = document.createElement('div');
  el.id = 'pre_lobby_loader';
  el.style.cssText =
    'position:fixed;inset:0;background:radial-gradient(circle at center,#180509 0%,#060204 70%,#000 100%);z-index:99998;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f3e8d8;font-family:Georgia,serif;padding:24px;transition:opacity 0.4s ease';
  el.innerHTML = `
    <div style="text-align:center;max-width:400px;width:100%">
      <div style="font-size:44px;margin-bottom:10px;filter:drop-shadow(0 0 18px rgba(220,38,38,0.65))">🕯</div>
      <div style="font-size:11px;letter-spacing:0.32em;color:#f87171;text-transform:uppercase;margin-bottom:6px;font-weight:bold">НОВОГОДНЕЕ ОБНОВЛЕНИЕ</div>
      <h1 style="margin:0 0 18px;font-size:24px;letter-spacing:0.12em;color:#fff;text-shadow:0 0 22px rgba(220,38,38,0.65)">НЕ ОБОРАЧИВАЙСЯ</h1>
      <div style="width:100%;height:6px;background:#1a070b;border:1px solid #6b1d28;border-radius:4px;overflow:hidden;margin-bottom:10px">
        <div id="pre_lobby_bar" style="width:12%;height:100%;background:linear-gradient(90deg,#991b1b,#ef4444,#fbbf24);transition:width 0.14s ease"></div>
      </div>
      <div id="pre_lobby_txt" style="font-size:12px;color:#cbd5e1;font-style:italic">Подготовка лобби и профилей...</div>
    </div>
  `;
  document.body.appendChild(el);
  const steps = [
    { p: 32, t: 'Подготовка 3D-ассетов и гаража...' },
    { p: 68, t: 'Загрузка новогоднего эвента...' },
    { p: 100, t: 'Добро пожаловать в темноту...' },
  ];
  let idx = 0;
  const tm = setInterval(() => {
    if (!el.isConnected) { clearInterval(tm); return; }
    const bar = el.querySelector('#pre_lobby_bar');
    const txt = el.querySelector('#pre_lobby_txt');
    if (idx < steps.length) {
      if (bar) bar.style.width = steps[idx].p + '%';
      if (txt) txt.textContent = steps[idx].t;
      idx++;
    } else {
      clearInterval(tm);
      el.style.opacity = '0';
      setTimeout(() => {
        el.remove();
        if (onDone) onDone();
      }, 360);
    }
  }, 240);
}


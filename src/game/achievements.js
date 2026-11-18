/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { openAnimatedModal, closeAnimatedModal, disposeAnimatedModal } from './uiTransitions.js';
import { awardCoinsWithBoost } from './xpSystem.js';

export const ACHIEVEMENTS = [
  {
    id: 'escaped_maze',
    title: 'Сбежал из лабиринта',
    desc: 'Успешно найти выход и выжить в Главе 1 (Лабиринт)',
    icon: '🗝️',
    reward: 50,
    category: 'survival',
  },
  {
    id: 'silent_run',
    title: 'Прошел без шума',
    desc: 'Завершить главу без шумного бега и не наступив в ловушку',
    icon: '🤫',
    reward: 75,
    category: 'stealth',
  },
  {
    id: 'escaped_mansion',
    title: 'Тайна особняка',
    desc: 'Выбраться живым из проклятого особняка (Глава 2)',
    icon: '🏰',
    reward: 60,
    category: 'survival',
  },
  {
    id: 'escaped_graveyard',
    title: 'Восставший из пепла',
    desc: 'Пройти туманное кладбище и открыть склеп (Глава 3)',
    icon: '⚰️',
    reward: 100,
    category: 'survival',
  },
  {
    id: 'first_blood',
    title: 'Первая встреча',
    desc: 'Познать неизбежное и впервые погибнуть в темноте',
    icon: '💀',
    reward: 25,
    category: 'story',
  },
  {
    id: 'keymaster',
    title: 'Хранитель ключей',
    desc: 'Собрать все 3 ключа от выхода в одном раунде',
    icon: '🔑',
    reward: 40,
    category: 'exploration',
  },
  {
    id: 'trap_disarmer',
    title: 'Сапёр в темноте',
    desc: 'Обезвредить ржавую ловушку, подкравшись на корточках (C)',
    icon: '🪤',
    reward: 30,
    category: 'stealth',
  },
  {
    id: 'closet_survivor',
    title: 'Затаив дыхание',
    desc: 'Спрятаться в шкафу во время охоты чудовища и выжить',
    icon: '🚪',
    reward: 40,
    category: 'stealth',
  },
  {
    id: 'speedrunner',
    title: 'С ветерком',
    desc: 'Сбежать из главы быстрее чем за 2 минуты (120 секунд)',
    icon: '⚡',
    reward: 60,
    category: 'challenge',
  },
  {
    id: 'secret_finder',
    title: 'Искатель тайн',
    desc: 'Найти секретную флешку USB или тайную записку в коридорах',
    icon: '💾',
    reward: 35,
    category: 'exploration',
  },
  {
    id: 'social_butterfly',
    title: 'Не в одиночку',
    desc: 'Войти через социальную сеть или сыграть в кооперативе с другом',
    icon: '🌐',
    reward: 30,
    category: 'social',
  },
  {
    id: 'collector',
    title: 'Охотник за стилем',
    desc: 'Приобрести стиль или предмет в магазине лобби',
    icon: '🎨',
    reward: 50,
    category: 'exploration',
  },
  {
    id: 'extreme_survivor',
    title: 'Стальные нервы',
    desc: 'Завершить главу на сложности «Сложный» или «Экстрим»',
    icon: '🩸',
    reward: 80,
    category: 'challenge',
  },
  {
    id: 'escaped_garages',
    title: 'Мастер на все руки',
    desc: 'Собрать детали для ВАЗ-2112, починить машину и сбежать из гаражей (Глава 4)',
    icon: '🔧',
    reward: 130,
    category: 'survival',
  },
  {
    id: 'mechanic_dodge',
    title: 'Холостые обороты',
    desc: 'Спрятаться в шкафу от Механика в гаражах и выжить',
    icon: '🧰',
    reward: 65,
    category: 'stealth',
  },
  {
    id: 'extreme_mechanic',
    title: 'Капитальный ремонт',
    desc: 'Пройти Главу 4 «Гаражи» на сложности «Экстрим»',
    icon: '⚙️',
    reward: 160,
    category: 'challenge',
  },
  {
    id: 'vaz_driver',
    title: 'Властелин Двенашки',
    desc: 'Уехать на ВАЗ-2112 с Кладбища и из Гаражей',
    icon: '🚗',
    reward: 120,
    category: 'exploration',
  },
  {
    id: 'polyglot',
    title: 'Полиглот',
    desc: 'Попробовать разные языки в настройках игры',
    icon: '🌍',
    reward: 35,
    category: 'exploration',
  },
  {
    id: 'art_collector',
    title: 'Ценитель искусства',
    desc: 'Открыть галерею артов в лобби',
    icon: '🖼️',
    reward: 30,
    category: 'exploration',
  },
  {
    id: 'battery_saver',
    title: 'Энерджайзер',
    desc: 'Завершить любую главу с зарядом телефона более 50%',
    icon: '🔋',
    reward: 70,
    category: 'challenge',
  },
  {
    id: 'chapter_master',
    title: 'Легенда темноты',
    desc: 'Пройти все 4 главы игры',
    icon: '👑',
    reward: 250,
    category: 'challenge',
  },
  {
    id: 'wardrobe_ghost',
    title: 'Невидимка в шкафу',
    desc: 'Спрятаться в шкафу от Хозяйки в «Особняке» (Глава 2) и пережить проверку',
    icon: '🧥',
    reward: 55,
    category: 'stealth',
  },
  {
    id: 'garage_dj',
    title: 'Ночная волна',
    desc: 'Зайти в гараж с радио и послушать его в Главе 4',
    icon: '📻',
    reward: 45,
    category: 'exploration',
  },
  {
    id: 'extreme_noise',
    title: 'Тишина или смерть',
    desc: 'Пройти любую главу на сложности «Экстрим», где монстр слышит каждый звук',
    icon: '👂',
    reward: 140,
    category: 'challenge',
  },
  {
    id: 'auto_dealer',
    title: 'Коллекционер АвтоВАЗа',
    desc: 'Приобрести новый автомобиль АвтоВАЗ в автосалоне лобби',
    icon: '🚘',
    reward: 110,
    category: 'exploration',
  },
  {
    id: 'trap_victim',
    title: 'Хруст стали',
    desc: 'Наступить в ржавую ловушку и пережить её лязг',
    icon: '⛓️',
    reward: 20,
    category: 'story',
  },
  {
    id: 'escaped_xmas',
    title: 'Побег из Снежного Дома',
    desc: 'Выбраться из новогодней Главы 5 и открыть праздничные награды',
    icon: '🎄',
    reward: 150,
    category: 'christmas',
  },
  {
    id: 'xmas_fuses',
    title: 'Зимний Электрик',
    desc: 'Восстановить 3 предохранителя щитка в Главе 5',
    icon: '🔌',
    reward: 90,
    category: 'christmas',
  },
  {
    id: 'xmas_hacker',
    title: 'Взломщик Метели',
    desc: 'Подобрать код и взломать электронный замок в Главе 5',
    icon: '🔢',
    reward: 100,
    category: 'christmas',
  },
  {
    id: 'xmas_vent',
    title: 'Тень Вентиляции',
    desc: 'Сбежать через вентиляционную шахту в Главе 5',
    icon: '❄️',
    reward: 110,
    category: 'christmas',
  },
  {
    id: 'santa_survivor',
    title: 'Санта не догонит',
    desc: 'Спрятаться в шкафу и пережить охоту Санта-Грэнни',
    icon: '🎅',
    reward: 75,
    category: 'christmas',
  },
  {
    id: 'advent_opener',
    title: 'Праздничный Сюрприз',
    desc: 'Собрать снежинки и принять участие в Новогоднем Эвенте',
    icon: '🎁',
    reward: 65,
    category: 'christmas',
  },
];

export const ACHIEVEMENTS_MAP = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a])
);

const STORAGE_KEY = 'horror_achievements';

export function getUnlockedAchievements() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function isAchievementUnlocked(id) {
  const all = getUnlockedAchievements();
  return Boolean(all[id]);
}

export function saveUnlockedAchievements(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {}
}

export function playAchievementSound(ac, TN) {
  try {
    if (TN) {
      TN(523, 0.12, 0.2, 'sine');
      setTimeout(() => TN(659, 0.12, 0.22, 'sine'), 90);
      setTimeout(() => TN(784, 0.14, 0.25, 'sine'), 180);
      setTimeout(() => TN(1046, 0.35, 0.3, 'triangle'), 270);
    }
  } catch (e) {}
}

export function showAchievementToast(ach) {
  if (typeof document === 'undefined') return;

  let container = document.getElementById('ach_toast_container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'ach_toast_container';
    container.style.cssText =
      'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:12px;pointer-events:none;max-width:360px;width:calc(100% - 40px)';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'ach-toast-item';
  toast.style.cssText =
    'background:linear-gradient(135deg, rgba(28, 12, 12, 0.96) 0%, rgba(12, 6, 6, 0.98) 100%);' +
    'border:2px solid #d4af37;' +
    'border-radius:10px;' +
    'padding:14px 16px;' +
    'box-shadow:0 8px 30px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.4);' +
    'display:flex;align-items:center;gap:14px;' +
    'color:#fff;font-family:Georgia,serif;' +
    'pointer-events:auto;cursor:pointer;' +
    'transform:translateX(120%);opacity:0;transition:all 0.4s cubic-bezier(0.16, 1, 0.3, 1);' +
    'box-sizing:border-box;backdrop-filter:blur(8px);';

  toast.innerHTML = `
    <div style="width:48px;height:48px;border-radius:50%;background:radial-gradient(circle, #ffe082 0%, #b8860b 80%, #5d3a00 100%);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;box-shadow:0 0 15px rgba(255,215,0,0.6);border:2px solid #fff3c4">
      ${ach.icon}
    </div>
    <div style="flex:1;min-width:0;text-align:left">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:3px">
        <span style="font-size:11px;font-weight:bold;letter-spacing:0.12em;color:#ffd700;text-transform:uppercase">
          ★ ДОСТИЖЕНИЕ ПОЛУЧЕНО!
        </span>
        <span style="font-size:12px;font-weight:bold;padding:2px 8px;border-radius:12px;background:rgba(212,175,55,0.25);border:1px solid #d4af37;color:#ffe082;white-space:nowrap">
          +${ach.reward} 🪙
        </span>
      </div>
      <div style="font-size:15px;font-weight:bold;color:#fff;line-height:1.2;margin-bottom:3px;text-shadow:0 1px 2px #000">
        ${ach.title}
      </div>
      <div style="font-size:12px;color:#bbb;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
        ${ach.desc}
      </div>
    </div>
  `;

  container.appendChild(toast);

  // Trigger animation next frame
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  });

  const dismiss = () => {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  };

  toast.onclick = dismiss;
  setTimeout(dismiss, 5200);
}

export function unlockAchievement(id, ctx = {}) {
  const ach = ACHIEVEMENTS_MAP[id];
  if (!ach) return false;

  const current = getUnlockedAchievements();
  if (current[id]) return false; // Already unlocked

  current[id] = {
    unlockedAt: Date.now(),
    title: ach.title,
  };
  saveUnlockedAchievements(current);

  // Sync with profile PF if available
  if (ctx.PF) {
    if (!ctx.PF.achievements) ctx.PF.achievements = {};
    ctx.PF.achievements[id] = current[id];
    awardCoinsWithBoost(ctx.PF, ach.reward);
    if (typeof ctx.pWrite === 'function') ctx.pWrite();
  }

  // Play audio chime
  if (ctx.ac && ctx.TN) {
    playAchievementSound(ctx.ac, ctx.TN);
  }

  // Show corner popup
  showAchievementToast(ach);

  // Optional onUnlock callback
  if (typeof ctx.onUnlock === 'function') {
    ctx.onUnlock(ach);
  }

  return true;
}

export function showAchievementsModal(PF, callbacks = {}) {
  if (typeof document === 'undefined') return;

  const existing = document.getElementById('ach_modal');
  if (existing) disposeAnimatedModal(existing);

  const unlockedMap = getUnlockedAchievements();
  const unlockedCount = Object.keys(unlockedMap).length;
  const totalCount = ACHIEVEMENTS.length;
  const percent = Math.round((unlockedCount / totalCount) * 100);
  const xmasList = ACHIEVEMENTS.filter((a) => a.category === 'christmas');
  const xmasUnlockedCount = xmasList.filter((a) => Boolean(unlockedMap[a.id])).length;
  const xmasPercent = xmasList.length ? Math.round((xmasUnlockedCount / xmasList.length) * 100) : 0;

  let activeFilter = 'all';

  const modal = document.createElement('div');
  modal.id = 'ach_modal';
  modal.style.cssText =
    'position:fixed;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);z-index:9500;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box';
  const closeModal = () => closeAnimatedModal(modal);
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  function renderModalContent() {
    const filtered = ACHIEVEMENTS.filter((a) => {
      const isU = Boolean(unlockedMap[a.id]);
      if (activeFilter === 'unlocked') return isU;
      if (activeFilter === 'locked') return !isU;
      if (activeFilter === 'christmas') return a.category === 'christmas';
      return true;
    });

    modal.innerHTML = `
      <div style="background:#0e0808;border:2px solid #a33;width:100%;max-width:600px;max-height:90vh;border-radius:12px;display:flex;flex-direction:column;color:#eee;font-family:Georgia,serif;box-shadow:0 0 40px rgba(180,0,0,0.45);position:relative;box-sizing:border-box;overflow:hidden">
        
        <!-- Header -->
        <div style="padding:18px 20px 14px;border-bottom:1px solid #4a1515;background:linear-gradient(180deg,#1f0a0a 0%,#0e0808 100%);display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:30px">🏆</span>
            <div>
              <h2 style="margin:0;font-size:20px;letter-spacing:0.08em;color:#ffdd99">ДОСТИЖЕНИЯ</h2>
              <div style="font-size:13px;color:#aaa">Прогресс: <b style="color:#ffd700">${unlockedCount} / ${totalCount}</b> (${percent}%)</div>
            </div>
          </div>
          <button id="ach_close" style="background:transparent;border:0;color:#aaa;font-size:22px;cursor:pointer;padding:6px;line-height:1">✕</button>
        </div>

        <!-- Progress Bars & Filters -->
        <div style="padding:8px 20px 12px;background:#140b0b;border-bottom:1px solid #331010">
          <div style="width:100%;height:8px;background:#251010;border-radius:4px;overflow:hidden;border:1px solid #551c1c">
            <div style="width:${percent}%;height:100%;background:linear-gradient(90deg, #d4af37, #ffd700);transition:width 0.3s ease"></div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:8px">
            <span style="font-size:11px;color:#7dd3fc;white-space:nowrap">🎄 Новогодние: <b>${xmasUnlockedCount}/${xmasList.length}</b></span>
            <div style="flex:1;height:6px;background:#0c2233;border-radius:3px;overflow:hidden;border:1px solid #1e4b6e">
              <div style="width:${xmasPercent}%;height:100%;background:linear-gradient(90deg, #38bdf8, #fde047);transition:width 0.3s ease"></div>
            </div>
          </div>
          <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">
            <button id="flt_all" class="ach-flt ${activeFilter === 'all' ? 'active' : ''}" style="margin:0;padding:5px 10px;font-size:12px;border-radius:4px;cursor:pointer;background:${activeFilter === 'all' ? '#600' : '#220d0d'};color:#fff;border:1px solid ${activeFilter === 'all' ? '#e55' : '#4a1515'}">Все (${totalCount})</button>
            <button id="flt_unl" class="ach-flt ${activeFilter === 'unlocked' ? 'active' : ''}" style="margin:0;padding:5px 10px;font-size:12px;border-radius:4px;cursor:pointer;background:${activeFilter === 'unlocked' ? '#600' : '#220d0d'};color:#fff;border:1px solid ${activeFilter === 'unlocked' ? '#e55' : '#4a1515'}">Выполненные (${unlockedCount})</button>
            <button id="flt_xmas" class="ach-flt ${activeFilter === 'christmas' ? 'active' : ''}" style="margin:0;padding:5px 10px;font-size:12px;border-radius:4px;cursor:pointer;background:${activeFilter === 'christmas' ? '#0c4a6e' : '#0f1f2c'};color:#bae6fd;border:1px solid ${activeFilter === 'christmas' ? '#38bdf8' : '#1e4b6e'}">🎄 Новогодние (${xmasList.length})</button>
            <button id="flt_lck" class="ach-flt ${activeFilter === 'locked' ? 'active' : ''}" style="margin:0;padding:5px 10px;font-size:12px;border-radius:4px;cursor:pointer;background:${activeFilter === 'locked' ? '#600' : '#220d0d'};color:#fff;border:1px solid ${activeFilter === 'locked' ? '#e55' : '#4a1515'}">В процессе (${totalCount - unlockedCount})</button>
          </div>
        </div>

        <!-- Achievements List -->
        <div style="flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:10px">
          ${filtered
            .map((ach) => {
              const uData = unlockedMap[ach.id];
              const isU = Boolean(uData);
              const loc = (typeof window !== 'undefined' && typeof window.__getLocale === 'function') ? window.__getLocale() : 'ru-RU';
              const dateStr = isU && uData.unlockedAt ? new Date(uData.unlockedAt).toLocaleDateString(loc) : '';
              const isXmas = ach.category === 'christmas';

              return `
              <div style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:8px;background:${isU ? (isXmas ? 'rgba(14, 42, 62, 0.78)' : 'rgba(35, 18, 18, 0.75)') : (isXmas ? 'rgba(10, 22, 34, 0.65)' : 'rgba(15, 8, 8, 0.6)')};border:1px solid ${isU ? '#b8860b' : isXmas ? '#1e4b6e' : '#331212'};opacity:${isU ? '1' : '0.68'};transition:all 0.2s">
                <div style="width:44px;height:44px;border-radius:8px;background:${isU ? 'linear-gradient(135deg, #ffd700, #b8860b)' : isXmas ? '#0f293a' : '#221111'};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;box-shadow:${isU ? '0 0 12px rgba(255,215,0,0.4)' : 'none'};border:1px solid ${isU ? '#fff' : isXmas ? '#38bdf8' : '#441818'}">
                  ${isU ? ach.icon : '🔒'}
                </div>
                <div style="flex:1;min-width:0;text-align:left">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
                    <span style="font-size:15px;font-weight:bold;color:${isU ? '#fff' : isXmas ? '#bae6fd' : '#aaa'}">${ach.title}</span>
                    <span style="font-size:12px;font-weight:bold;color:#ffd700;white-space:nowrap;padding:2px 6px;border-radius:4px;background:#201010;border:1px solid #4a2020">+${ach.reward} 🪙</span>
                  </div>
                  <div style="font-size:12.5px;color:${isU ? '#ccc' : '#777'};margin-top:3px;line-height:1.3">${ach.desc}</div>
                  ${
                    isU
                      ? `<div style="font-size:11px;color:#5d5;margin-top:4px">✓ Получено ${dateStr ? '• ' + dateStr : ''}</div>`
                      : `<div style="font-size:11px;color:#888;margin-top:4px">🔒 Ещё не получено</div>`
                  }
                </div>
              </div>
            `;
            })
            .join('')}
        </div>

        <!-- Footer -->
        <div style="padding:12px 20px;border-top:1px solid #4a1515;background:#140808;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:12px;color:#aaa">За каждое достижение начисляются монеты 🪙</span>
          <button id="ach_ok" style="margin:0;padding:8px 20px;font-size:13px;background:#500;border:1px solid #a22;color:#fff;border-radius:4px;cursor:pointer">Закрыть</button>
        </div>
      </div>
    `;

    const achClose = document.getElementById('ach_close');
    if (achClose) achClose.onclick = closeModal;
    const achOk = document.getElementById('ach_ok');
    if (achOk) achOk.onclick = closeModal;

    const setFilter = (f) => {
      activeFilter = f;
      renderModalContent();
    };

    const fltAll = document.getElementById('flt_all');
    if (fltAll) fltAll.onclick = () => setFilter('all');
    const fltUnl = document.getElementById('flt_unl');
    if (fltUnl) fltUnl.onclick = () => setFilter('unlocked');
    const fltXmas = document.getElementById('flt_xmas');
    if (fltXmas) fltXmas.onclick = () => setFilter('christmas');
    const fltLck = document.getElementById('flt_lck');
    if (fltLck) fltLck.onclick = () => setFilter('locked');
  }

  document.body.appendChild(modal);
  renderModalContent();
  openAnimatedModal(modal);
}

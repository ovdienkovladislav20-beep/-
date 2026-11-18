/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { openAnimatedModal, closeAnimatedModal, disposeAnimatedModal } from './uiTransitions.js';
import { awardCoinsWithBoost } from './xpSystem.js';

export const NEW_YEAR_QUEST_POOL = [
  {
    id: 'xmas_snowflakes',
    type: 'snowflakes',
    title: 'Собрать 15 снежинок',
    desc: 'Собери 15 волшебных снежинок в коридорах новогоднего дома (Глава 5)',
    icon: '❄️',
    target: 15,
    unit: 'шт.',
    reward: 110,
  },
  {
    id: 'xmas_escape',
    type: 'xmas_win',
    title: 'Новогодний Побег',
    desc: 'Выберись из заснеженного дома Главы 5 любым из 3 путей спасения',
    icon: '🎄',
    target: 1,
    unit: 'побег',
    reward: 150,
  },
  {
    id: 'xmas_dodge_santa',
    type: 'xmas_hide',
    title: 'Прятки от Санты',
    desc: 'Спрячься 2 раза в шкафу в Главе 5, когда рядом Санта-Грэнни',
    icon: '🎅',
    target: 2,
    unit: 'раз',
    reward: 95,
  },
];

export const QUEST_POOL = [
  {
    id: 'keys_10',
    type: 'keys',
    title: 'Собрать 10 ключей',
    desc: 'Найди и собери 10 ключей в коридорах лабиринта или комнатах особняка',
    icon: '🗝️',
    target: 10,
    unit: 'шт.',
    reward: 70,
  },
  {
    id: 'survive_300',
    type: 'survive',
    title: 'Выжить 5 минут',
    desc: 'Продержись в игре суммарно 5 минут (300 сек), избегая лап чудовища',
    icon: '⏱️',
    target: 300,
    unit: 'сек.',
    formatVal: (v, t) => Math.floor(v) + ' / ' + t + ' сек',
    reward: 80,
  },
  {
    id: 'play_3',
    type: 'games',
    title: 'Сыграть 3 раунда',
    desc: 'Начни и проведи не менее 3 вылазок в любой главе хоррора',
    icon: '🎮',
    target: 3,
    unit: 'игр',
    reward: 45,
  },
  {
    id: 'trap_2',
    type: 'trap',
    title: 'Обезвредить 2 ловушки',
    desc: 'Подкрадись на корточках (клавиша C) и обезвредь 2 ржавых капкана',
    icon: '🪤',
    target: 2,
    unit: 'шт.',
    reward: 55,
  },
  {
    id: 'hide_2',
    type: 'hide',
    title: 'Спрятаться 2 раза',
    desc: 'Укройся в шкафу или за диваном при приближении преследователя',
    icon: '🚪',
    target: 2,
    unit: 'раз',
    reward: 50,
  },
  {
    id: 'coop_1',
    type: 'coop',
    title: 'Сыграть в кооперативе',
    desc: 'Запусти совместную игру или присоединись по коду комнаты с напарником',
    icon: '👥',
    target: 1,
    unit: 'игра',
    reward: 65,
  },
  {
    id: 'win_1',
    type: 'win',
    title: 'Выбраться живым',
    desc: 'Успешно открой зелёную дверь выхода и заверши любую главу',
    icon: '🏆',
    target: 1,
    unit: 'победа',
    reward: 90,
  },
  {
    id: 'stealth_60',
    type: 'stealth',
    title: 'Бесшумная поступь',
    desc: 'Двигайся крадучись на корточках (C) в течение 60 секунд',
    icon: '🤫',
    target: 60,
    unit: 'сек.',
    formatVal: (v, t) => Math.floor(v) + ' / ' + t + ' сек',
    reward: 60,
  },
];

const STORAGE_KEY = 'horror_daily_quests';

function getLocalDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function hashString(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 16777619);
  }
  return hash >>> 0;
}

export function getDailyQuestsState() {
  const today = getLocalDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.date === today && Array.isArray(parsed.quests) && parsed.quests.length >= 3) {
        return parsed;
      }
    }
  } catch (e) {}

  // Generate 3 fresh quests for today based on deterministic hash
  const seed = hashString('horror_day_' + today);
  const shuffled = [...QUEST_POOL];
  // Seeded Fisher-Yates
  let currentSeed = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const j = Math.floor((currentSeed / 233280) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected = shuffled.slice(0, 3).map((q) => ({
    ...q,
    progress: 0,
    completed: false,
    claimed: false,
  }));

  const newState = {
    date: today,
    quests: selected,
    allBonusClaimed: false,
    allBonusReward: 120,
  };

  saveDailyQuestsState(newState);
  return newState;
}

export function saveDailyQuestsState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

const XMAS_STORAGE_KEY = 'horror_xmas_quests';

export function getXmasQuestsState() {
  try {
    const raw = localStorage.getItem(XMAS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.quests) && parsed.quests.length >= 3) {
        return parsed;
      }
    }
  } catch (e) {}
  const st = {
    quests: NEW_YEAR_QUEST_POOL.map((q) => ({ ...q, progress: 0, completed: false, claimed: false })),
  };
  saveXmasQuestsState(st);
  return st;
}

export function saveXmasQuestsState(state) {
  try {
    localStorage.setItem(XMAS_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

export function getClaimableQuestsCount() {
  const state = getDailyQuestsState();
  let count = state.quests.filter((q) => q.completed && !q.claimed).length;
  const allQuestsDone = state.quests.every((q) => q.completed);
  if (allQuestsDone && !state.allBonusClaimed) {
    count++;
  }
  const xState = getXmasQuestsState();
  count += xState.quests.filter((q) => q.completed && !q.claimed).length;
  return count;
}

export function updateQuestBadge() {
  if (typeof document === 'undefined') return;
  const count = getClaimableQuestsCount();
  const badge = document.getElementById('quest_badge');
  const topBtn = document.getElementById('questbtn');
  const ovBtn = document.getElementById('ov_quest_btn');
  const npcBtn = document.getElementById('btn_npc_quests_rail');

  if (badge) {
    if (count > 0) {
      badge.textContent = String(count);
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }

  if (topBtn) {
    topBtn.innerHTML = `🎯 ЗАДАНИЯ ${count > 0 ? `<span style="background:#e74c3c;color:#fff;border-radius:10px;padding:1px 6px;font-size:11px;font-weight:bold;margin-left:4px;box-shadow:0 0 8px #ff4757">${count}</span>` : ''}`;
  }

  if (ovBtn) {
    ovBtn.innerHTML = `🎯 ЗАДАНИЯ ${count > 0 ? `<span style="background:#e74c3c;color:#fff;border-radius:10px;padding:1px 6px;font-size:11px;font-weight:bold;margin-left:4px;box-shadow:0 0 8px #ff4757">${count}</span>` : ''}`;
  }

  if (npcBtn) {
    const xClaim = getXmasQuestsState().quests.filter((q) => q.completed && !q.claimed).length;
    npcBtn.innerHTML = `🎅 Задания NPC ${xClaim > 0 ? `<span style="background:#22c55e;color:#000;border-radius:8px;padding:0 5px;font-size:10px;font-weight:bold;margin-left:auto">${xClaim}</span>` : ''}`;
  }
}

export function playQuestSound(ac, TN) {
  try {
    if (TN) {
      TN(659, 0.12, 0.22, 'triangle');
      setTimeout(() => TN(830, 0.14, 0.25, 'triangle'), 100);
      setTimeout(() => TN(987, 0.16, 0.28, 'sine'), 200);
      setTimeout(() => TN(1318, 0.4, 0.35, 'triangle'), 320);
    }
  } catch (e) {}
}

export function showDailyQuestToast(quest, onOpen) {
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
    'background:linear-gradient(135deg, rgba(38, 20, 6, 0.96) 0%, rgba(18, 10, 4, 0.98) 100%);' +
    'border:2px solid #e67e22;' +
    'border-radius:10px;' +
    'padding:14px 16px;' +
    'box-shadow:0 8px 30px rgba(0,0,0,0.85), 0 0 25px rgba(230,126,34,0.45);' +
    'display:flex;align-items:center;gap:14px;' +
    'color:#fff;font-family:Georgia,serif;' +
    'pointer-events:auto;cursor:pointer;' +
    'transform:translateX(120%);opacity:0;transition:all 0.4s cubic-bezier(0.16, 1, 0.3, 1);' +
    'box-sizing:border-box;backdrop-filter:blur(8px);';

  toast.innerHTML = `
    <div style="width:48px;height:48px;border-radius:50%;background:radial-gradient(circle, #f39c12 0%, #d35400 80%, #782800 100%);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;box-shadow:0 0 15px rgba(243,156,18,0.7);border:2px solid #fed330">
      ${quest.icon}
    </div>
    <div style="flex:1;min-width:0;text-align:left">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:3px">
        <span style="font-size:11px;font-weight:bold;letter-spacing:0.12em;color:#f39c12;text-transform:uppercase">
          🎯 ЗАДАНИЕ ВЫПОЛНЕНО!
        </span>
        <span style="font-size:12px;font-weight:bold;padding:2px 8px;border-radius:12px;background:rgba(230,126,34,0.3);border:1px solid #e67e22;color:#fce;white-space:nowrap">
          +${quest.reward} 🪙
        </span>
      </div>
      <div style="font-size:15px;font-weight:bold;color:#fff;line-height:1.2;margin-bottom:3px;text-shadow:0 1px 2px #000">
        ${quest.title}
      </div>
      <div style="font-size:12px;color:#fcd6a5;line-height:1.3">
        Нажми, чтобы открыть задания и забрать награду!
      </div>
    </div>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  });

  const dismiss = () => {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  };

  toast.onclick = () => {
    dismiss();
    if (typeof onOpen === 'function') onOpen();
  };

  setTimeout(dismiss, 6000);
}

export function trackDailyQuest(type, amount = 1, ctx = {}) {
  const state = getDailyQuestsState();
  let changed = false;

  for (const q of state.quests) {
    if (q.type === type && !q.completed) {
      q.progress = Math.min(q.target, (q.progress || 0) + amount);
      if (q.progress >= q.target) {
        q.completed = true;
        changed = true;

        if (ctx.ac && ctx.TN) {
          playQuestSound(ctx.ac, ctx.TN);
        }

        showDailyQuestToast(q, () => {
          if (typeof ctx.showModal === 'function') {
            ctx.showModal();
          }
        });
      } else {
        changed = true;
      }
    }
  }

  if (changed) {
    saveDailyQuestsState(state);
    updateQuestBadge();
    if (ctx.PF && typeof ctx.pWrite === 'function') {
      ctx.pWrite();
    }
  }

  // Also check New Year NPC missions
  const xState = getXmasQuestsState();
  let xChanged = false;
  for (const q of xState.quests) {
    if (q.type === type && !q.completed) {
      q.progress = Math.min(q.target, (q.progress || 0) + amount);
      if (q.progress >= q.target) {
        q.completed = true;
        xChanged = true;
        if (ctx.ac && ctx.TN) playQuestSound(ctx.ac, ctx.TN);
        showDailyQuestToast(q, () => {
          if (typeof ctx.showModal === 'function') ctx.showModal('xmas');
        });
      } else {
        xChanged = true;
      }
    }
  }
  if (xChanged) {
    saveXmasQuestsState(xState);
    updateQuestBadge();
  }
}

export function showDailyQuestsModal(PF, ctx = {}) {
  if (typeof document === 'undefined') return;

  const existing = document.getElementById('quest_modal');
  if (existing) disposeAnimatedModal(existing);

  let activeTab = ctx.initialTab === 'xmas' ? 'xmas' : 'daily';

  const state = getDailyQuestsState();
  const completedCount = state.quests.filter((q) => q.completed).length;
  const totalCount = state.quests.length;
  const allDone = completedCount === totalCount;

  // Calculate time remaining until midnight
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());
  const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
  const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  const modal = document.createElement('div');
  modal.id = 'quest_modal';
  modal.style.cssText =
    'position:fixed;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);z-index:9600;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box';
  const closeModal = () => closeAnimatedModal(modal);
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  function renderModalContent() {
    const s = getDailyQuestsState();
    const xs = getXmasQuestsState();
    const done = s.quests.filter((q) => q.completed).length;
    const canClaimAllBonus = s.quests.every((q) => q.completed) && !s.allBonusClaimed;

    const listToRender = activeTab === 'xmas' ? xs.quests : s.quests;

    modal.innerHTML = `
      <div style="background:#100904;border:2px solid ${activeTab === 'xmas' ? '#38bdf8' : '#d35400'};width:100%;max-width:580px;max-height:92vh;border-radius:12px;display:flex;flex-direction:column;color:#eee;font-family:Georgia,serif;box-shadow:0 0 45px ${activeTab === 'xmas' ? 'rgba(56,189,248,0.4)' : 'rgba(211,84,0,0.45)'};position:relative;box-sizing:border-box;overflow:hidden">
        
        <!-- Header -->
        <div style="padding:18px 20px 14px;border-bottom:1px solid #4a2108;background:${activeTab === 'xmas' ? 'linear-gradient(180deg,#0c2233 0%,#100904 100%)' : 'linear-gradient(180deg,#241004 0%,#100904 100%)'};display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:32px">${activeTab === 'xmas' ? '🎅' : '🎯'}</span>
            <div>
              <h2 style="margin:0;font-size:20px;letter-spacing:0.08em;color:${activeTab === 'xmas' ? '#bae6fd' : '#ffbe76'}">${activeTab === 'xmas' ? 'НОВОГОДНИЕ МИССИИ NPC' : 'ЕЖЕДНЕВНЫЕ ИСПЫТАНИЯ'}</h2>
              <div style="font-size:12.5px;color:#d2b48c;display:flex;align-items:center;gap:8px;margin-top:2px;flex-wrap:wrap">
                <span>Обновление через: <b style="color:#f39c12">${hoursLeft} ч ${minutesLeft} мин</b></span>
                <span>•</span>
                <span>Баланс: <b style="color:#ffd700">${Math.max(0, Math.floor(Number(PF.coins) || 0)).toLocaleString('ru-RU')} 🪙</b></span>
              </div>
            </div>
          </div>
          <button id="quest_close" style="background:transparent;border:0;color:#aaa;font-size:22px;cursor:pointer;padding:6px;line-height:1">✕</button>
        </div>

        <!-- Tabs -->
        <div style="display:flex;background:#170d06;border-bottom:1px solid #3d1a05">
          <button id="qtab_daily" style="flex:1;margin:0;padding:10px;border:0;border-bottom:2px solid ${activeTab === 'daily' ? '#f39c12' : 'transparent'};background:${activeTab === 'daily' ? '#251206' : 'transparent'};color:${activeTab === 'daily' ? '#ffbe76' : '#888'};font-weight:bold;cursor:pointer;font-size:13px">🎯 Ежедневные (3)</button>
          <button id="qtab_xmas" style="flex:1;margin:0;padding:10px;border:0;border-bottom:2px solid ${activeTab === 'xmas' ? '#38bdf8' : 'transparent'};background:${activeTab === 'xmas' ? '#0f2536' : 'transparent'};color:${activeTab === 'xmas' ? '#bae6fd' : '#888'};font-weight:bold;cursor:pointer;font-size:13px">🎅 Новогодние миссии (${xs.quests.length})</button>
        </div>

        <!-- Top Banner -->
        ${
          activeTab === 'xmas'
            ? `
          <div style="padding:12px 20px;background:linear-gradient(135deg,#0f2a3f 0%,#151018 100%);border-bottom:1px solid #1e4b6e;display:flex;align-items:center;gap:12px">
            <div style="width:46px;height:46px;border-radius:50%;background:#1e3a5f;border:2px solid #7dd3fc;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">🧙‍♂️</div>
            <div style="text-align:left">
              <div style="font-size:13.5px;font-weight:bold;color:#fde047">Дед-Хранитель Зимы (NPC):</div>
              <div style="font-size:12px;color:#cbd5e1;line-height:1.35">«В заснеженном доме заперта сила метели. Выполняй мои задания в Главе 5 — получай монеты и опыт!»</div>
            </div>
          </div>
        `
            : `
          <div style="padding:14px 20px;background:${canClaimAllBonus ? 'linear-gradient(135deg, #381907 0%, #200f04 100%)' : '#170d06'};border-bottom:1px solid #3d1a05;display:flex;align-items:center;justify-content:space-between;gap:14px">
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:44px;height:44px;border-radius:10px;background:radial-gradient(circle, #f39c12 0%, #b85d06 100%);display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 0 15px rgba(243,156,18,0.5);border:1px solid #ffd32a">
                🎁
              </div>
              <div>
                <div style="font-size:14px;font-weight:bold;color:#ffbe76">СУПЕР-БОНУС ДНЯ: +${s.allBonusReward} 🪙</div>
                <div style="font-size:12px;color:#aaa">Выполни все 3 задания за сегодня и забери сундук</div>
              </div>
            </div>
            <div>
              ${
                s.allBonusClaimed
                  ? `<span style="font-size:12px;color:#2ed573;padding:6px 12px;border:1px solid #2ed573;border-radius:6px;background:rgba(46,213,115,0.1)">✓ Забран</span>`
                  : canClaimAllBonus
                  ? `<button id="quest_claim_master" style="margin:0;padding:8px 14px;font-size:13px;font-weight:bold;background:#27ae60;border:1px solid #2ecc71;color:#fff;border-radius:6px;cursor:pointer;box-shadow:0 0 15px rgba(46,204,113,0.6)">ЗАБРАТЬ +${s.allBonusReward} 🪙</button>`
                  : `<span style="font-size:12px;color:#888;padding:6px 10px;border:1px solid #3d1a05;border-radius:6px;background:#100904">${done} / ${s.quests.length}</span>`
              }
            </div>
          </div>
        `
        }

        <!-- Quests List -->
        <div style="flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:12px">
          ${listToRender
            .map((q, idx) => {
              const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
              const progressDisplay = q.formatVal
                ? q.formatVal(q.progress, q.target)
                : `${q.progress} / ${q.target} ${q.unit || ''}`;

              return `
              <div style="display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:10px;background:${activeTab === 'xmas' ? 'rgba(14, 34, 52, 0.78)' : q.completed ? 'rgba(38, 20, 6, 0.75)' : 'rgba(20, 11, 4, 0.65)'};border:1px solid ${q.claimed ? '#2ed573' : q.completed ? '#e67e22' : activeTab === 'xmas' ? '#1e4b6e' : '#4a2108'};box-shadow:${q.completed && !q.claimed ? '0 0 16px rgba(230,126,34,0.35)' : 'none'};transition:all 0.2s">
                <div style="width:46px;height:46px;border-radius:10px;background:${q.completed ? 'linear-gradient(135deg, #f39c12, #d35400)' : activeTab === 'xmas' ? '#122c42' : '#261307'};display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;box-shadow:${q.completed ? '0 0 14px rgba(243,156,18,0.5)' : 'none'};border:1px solid ${q.completed ? '#ffd32a' : activeTab === 'xmas' ? '#38bdf8' : '#4a2108'}">
                  ${q.icon}
                </div>
                
                <div style="flex:1;min-width:0;text-align:left">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
                    <span style="font-size:15px;font-weight:bold;color:${q.completed ? '#fff' : '#ddd'}">${q.title}</span>
                    <span style="font-size:12.5px;font-weight:bold;color:#f39c12;white-space:nowrap;padding:2px 8px;border-radius:4px;background:#241204;border:1px solid #632d06">+${q.reward} 🪙</span>
                  </div>
                  
                  <div style="font-size:12px;color:${q.completed ? '#e0b894' : '#94a3b8'};margin:3px 0 6px;line-height:1.3">
                    ${q.desc}
                  </div>

                  <!-- Progress bar -->
                  <div style="display:flex;align-items:center;gap:10px">
                    <div style="flex:1;height:7px;background:#1e0e04;border-radius:4px;overflow:hidden;border:1px solid #4a2108">
                      <div style="width:${pct}%;height:100%;background:${q.completed ? 'linear-gradient(90deg, #2ecc71, #27ae60)' : activeTab === 'xmas' ? 'linear-gradient(90deg, #38bdf8, #fde047)' : 'linear-gradient(90deg, #e67e22, #f39c12)'};transition:width 0.3s ease"></div>
                    </div>
                    <span style="font-size:11.5px;color:#aaa;white-space:nowrap">${progressDisplay}</span>
                  </div>
                </div>

                <!-- Claim button or status -->
                <div style="flex-shrink:0;margin-left:4px">
                  ${
                    q.claimed
                      ? `<span style="font-size:12px;color:#2ed573;padding:6px 12px;border:1px solid #2ed573;border-radius:6px;background:rgba(46,213,115,0.1)">✓ Забрано</span>`
                      : q.completed
                      ? `<button data-idx="${idx}" data-pool="${activeTab}" class="quest-claim-btn" style="margin:0;padding:8px 12px;font-size:13px;font-weight:bold;background:#e67e22;border:1px solid #f39c12;color:#fff;border-radius:6px;cursor:pointer;box-shadow:0 0 12px rgba(230,126,34,0.5)">ЗАБРАТЬ 🪙</button>`
                      : `<span style="font-size:11px;color:#777;padding:5px 8px;border:1px solid #331505;border-radius:4px">В процессе</span>`
                  }
                </div>
              </div>
            `;
            })
            .join('')}
        </div>

        <!-- Footer -->
        <div style="padding:14px 20px;border-top:1px solid #4a2108;background:#150a04;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:12px;color:#aaa">Монеты можно тратить в магазине гардероба, авто и скинов в лобби 🛒</span>
          <button id="quest_ok" style="margin:0;padding:8px 22px;font-size:13px;background:#8b2d08;border:1px solid #e67e22;color:#fff;border-radius:4px;cursor:pointer">Закрыть</button>
        </div>
      </div>
    `;

    const qClose = document.getElementById('quest_close');
    if (qClose) qClose.onclick = closeModal;
    const qOk = document.getElementById('quest_ok');
    if (qOk) qOk.onclick = closeModal;

    const qtabD = document.getElementById('qtab_daily');
    if (qtabD) qtabD.onclick = () => { activeTab = 'daily'; renderModalContent(); };
    const qtabX = document.getElementById('qtab_xmas');
    if (qtabX) qtabX.onclick = () => { activeTab = 'xmas'; renderModalContent(); };

    // Attach claim buttons
    modal.querySelectorAll('.quest-claim-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        const pool = btn.getAttribute('data-pool');
        if (pool === 'xmas') {
          const q = xs.quests[idx];
          if (q && q.completed && !q.claimed) {
            q.claimed = true;
            awardCoinsWithBoost(PF, q.reward);
            saveXmasQuestsState(xs);
            if (typeof ctx.pWrite === 'function') ctx.pWrite();
            if (ctx.ac && ctx.TN) playQuestSound(ctx.ac, ctx.TN);
            updateQuestBadge();
            renderModalContent();
          }
        } else {
          const q = s.quests[idx];
          if (q && q.completed && !q.claimed) {
            q.claimed = true;
            awardCoinsWithBoost(PF, q.reward);
            saveDailyQuestsState(s);
            if (typeof ctx.pWrite === 'function') ctx.pWrite();
            if (ctx.ac && ctx.TN) playQuestSound(ctx.ac, ctx.TN);
            updateQuestBadge();
            renderModalContent();
          }
        }
      });
    });

    const masterClaimBtn = document.getElementById('quest_claim_master');
    if (masterClaimBtn) {
      masterClaimBtn.onclick = () => {
        if (s.quests.every((q) => q.completed) && !s.allBonusClaimed) {
          s.allBonusClaimed = true;
          awardCoinsWithBoost(PF, s.allBonusReward);
          saveDailyQuestsState(s);
          if (typeof ctx.pWrite === 'function') ctx.pWrite();
          if (ctx.ac && ctx.TN) {
            playQuestSound(ctx.ac, ctx.TN);
          }
          updateQuestBadge();
          renderModalContent();
        }
      };
    }
  }

  document.body.appendChild(modal);
  renderModalContent();
  openAnimatedModal(modal);
}

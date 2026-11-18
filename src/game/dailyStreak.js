/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { addXP, awardCoinsWithBoost } from './xpSystem.js';
import { openAnimatedModal, closeAnimatedModal, disposeAnimatedModal } from './uiTransitions.js';

export const STREAK_DAYS = [
  { day: 1, xp: 100, coins: 40, title: 'Первый вздох', icon: '🕯️', desc: 'Огарок свечи для первых шагов во тьме' },
  { day: 2, xp: 150, coins: 60, title: 'Заряд батарей', icon: '🔋', desc: 'Свежие элементы питания для фонарика' },
  { day: 3, xp: 200, coins: 80, title: 'Слесарный ключ', icon: '🗝️', desc: 'Связка запасных отмычек сталкера' },
  { day: 4, xp: 250, coins: 100, title: 'Записки Майера', icon: '📜', desc: 'Архивный фрагмент секретного проекта' },
  { day: 5, xp: 350, coins: 140, title: 'Эликсир покоя', icon: '🧪', desc: 'Успокоительное для стальных нервов в темноте' },
  { day: 6, xp: 450, coins: 180, title: 'Радиомаяк', icon: '📻', desc: 'Уловитель низкочастотных звуков монстра' },
  { day: 7, xp: 700, coins: 300, title: 'Печать склепа', icon: '⛧', isSuper: true, desc: 'Супер-награда 7-го дня: древний оккультный оберег!' },
];

const STREAK_STORAGE_KEY = 'horror_daily_streak';

function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDateString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
}

export function getDailyStreakState() {
  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();

  let state = {
    streak: 0,
    lastClaimDate: '',
    totalClaims: 0,
  };

  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.streak === 'number') {
        state = parsed;
      }
    }
  } catch (e) {}

  const isClaimedToday = state.lastClaimDate === today;
  const isConsecutive = state.lastClaimDate === yesterday;

  let currentStreak = state.streak || 0;
  if (!isClaimedToday && !isConsecutive && state.lastClaimDate) {
    // Missed at least one calendar day — reset streak to 0
    currentStreak = 0;
  }

  // Next day index in 1..7 cycle
  const nextDayNum = isClaimedToday
    ? ((currentStreak - 1) % 7) + 1
    : (currentStreak % 7) + 1;

  const currentReward = STREAK_DAYS[nextDayNum - 1] || STREAK_DAYS[0];

  return {
    streak: currentStreak,
    isClaimedToday,
    canClaimToday: !isClaimedToday,
    dayNumber: nextDayNum,
    currentReward,
    lastClaimDate: state.lastClaimDate,
    totalClaims: state.totalClaims || 0,
  };
}

export function claimDailyStreakReward(options = {}) {
  const { PF, pWrite, ac, TN, onUpdate } = options;
  const state = getDailyStreakState();

  if (!state.canClaimToday) {
    return { success: false, reason: 'already_claimed' };
  }

  const today = getLocalDateString();
  const newStreak = state.streak + 1;
  const dayIndex = ((newStreak - 1) % 7);
  const reward = STREAK_DAYS[dayIndex] || STREAK_DAYS[0];

  // Save new streak state
  const newState = {
    streak: newStreak,
    lastClaimDate: today,
    totalClaims: (state.totalClaims || 0) + 1,
  };

  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newState));
  } catch (e) {}

  // Add Coins
  if (PF) {
    awardCoinsWithBoost(PF, reward.coins);
    if (typeof pWrite === 'function') pWrite();
  }

  // Sound chime
  if (ac && TN) {
    try {
      TN(330, 0.1, 0.25, 'triangle');
      setTimeout(() => TN(440, 0.1, 0.25, 'triangle'), 100);
      setTimeout(() => TN(554, 0.12, 0.3, 'sine'), 200);
      setTimeout(() => TN(660, 0.25, 0.35, 'triangle', 880), 300);
    } catch (e) {}
  }

  // Add XP
  addXP(reward.xp, `Серия входов (День ${reward.day})`, {
    PF,
    pWrite,
    ac,
    TN,
  });

  if (typeof onUpdate === 'function') {
    onUpdate();
  }

  return {
    success: true,
    streak: newStreak,
    reward,
  };
}

export function showDailyStreakModal(options = {}) {
  const { PF, pWrite, ac, TN, onUpdate } = options;

  let existing = document.getElementById('daily_streak_modal');
  if (existing) disposeAnimatedModal(existing);

  const modal = document.createElement('div');
  modal.id = 'daily_streak_modal';
  modal.style.cssText =
    'position:fixed;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);z-index:9760;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box';

  function renderContent() {
    const s = getDailyStreakState();
    const curDay = s.dayNumber;

    modal.innerHTML = `
      <div style="background:#0e0608;border:2px solid #8b1e25;width:100%;max-width:660px;border-radius:12px;padding:22px 24px;color:#eee;font-family:Georgia,serif;box-shadow:0 0 50px rgba(220,30,40,0.45);position:relative;box-sizing:border-box;max-height:92vh;overflow-y:auto">
        
        <!-- Close Button -->
        <button id="dsm_close" style="position:absolute;top:16px;right:18px;background:transparent;border:0;color:#aaa;font-size:22px;cursor:pointer;padding:4px">✕</button>

        <!-- Header -->
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
          <div style="width:48px;height:48px;border-radius:12px;background:radial-gradient(circle, #ff4757 0%, #600000 100%);display:flex;align-items:center;justify-content:center;font-size:26px;border:1px solid #ff6b81;box-shadow:0 0 20px rgba(255,71,87,0.5)">
            🔥
          </div>
          <div>
            <div style="display:flex;align-items:center;gap:8px">
              <h2 style="margin:0;font-size:21px;letter-spacing:0.06em;color:#ffdddd">СЕРИЯ ДНЕЙ ВЫЖИВАНИЯ</h2>
              <span style="background:#5a1219;border:1px solid #ff4757;color:#ffd700;font-size:12px;padding:2px 8px;border-radius:12px;font-weight:bold">
                ${s.streak} ${s.streak === 1 ? 'день' : s.streak >= 2 && s.streak <= 4 ? 'дня' : 'дней'}
              </span>
            </div>
            <div style="font-size:12.5px;color:#bbb;margin-top:2px">
              Заходи каждый день, чтобы получать опыт (XP) и монеты. Не пропускай дни!
            </div>
          </div>
        </div>

        <!-- 7-Day Streak Cards Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(80px, 1fr));gap:8px;margin-bottom:20px">
          ${STREAK_DAYS.map((d) => {
            const isPastClaimed = s.isClaimedToday ? (d.day <= curDay) : (d.day < curDay);
            const isTodayReady = !s.isClaimedToday && (d.day === curDay);
            const isUpcoming = !isPastClaimed && !isTodayReady;

            const bgCol = isTodayReady
              ? 'linear-gradient(180deg, #3a0e14 0%, #1a0508 100%)'
              : isPastClaimed
              ? '#101e13'
              : '#13090b';

            const borderCol = isTodayReady
              ? '#ffd700'
              : isPastClaimed
              ? '#2ed573'
              : '#3d161a';

            const glow = isTodayReady
              ? 'box-shadow:0 0 16px rgba(255,215,0,0.45);'
              : isPastClaimed
              ? 'box-shadow:0 0 8px rgba(46,213,115,0.25);'
              : '';

            return `
              <div style="background:${bgCol};border:2px solid ${borderCol};border-radius:8px;padding:10px 6px;text-align:center;position:relative;${glow};transition:all 0.2s">
                ${d.isSuper ? '<div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:#ffd700;color:#000;font-size:8.5px;font-weight:bold;padding:1px 5px;border-radius:4px;white-space:nowrap">СУПЕР</div>' : ''}
                
                <div style="font-size:11px;color:${isTodayReady ? '#ffd700' : isPastClaimed ? '#a3f7bf' : '#888'};font-weight:bold;margin-bottom:4px">
                  ДЕНЬ ${d.day}
                </div>

                <div style="font-size:22px;margin:3px 0">
                  ${d.icon}
                </div>

                <div style="font-size:11px;font-weight:bold;color:#fd4;line-height:1.2">
                  +${d.xp} XP
                </div>
                <div style="font-size:10px;color:#ffd700;margin-top:2px">
                  +${d.coins} 🪙
                </div>

                <div style="margin-top:6px;font-size:10px;padding:2px 4px;border-radius:3px;background:${isPastClaimed ? '#14532d' : isTodayReady ? '#8b0000' : '#221013'};color:${isPastClaimed ? '#a8ffc8' : isTodayReady ? '#fff' : '#666'}">
                  ${isPastClaimed ? '✓ Забрано' : isTodayReady ? '★ Сегодня' : '🔒 Закрыто'}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Today Reward Banner & Claim Action -->
        <div style="background:#17090c;border:1px solid #5a1b22;border-radius:8px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px">
          <div style="text-align:left">
            <div style="color:#aaa;font-size:11.5px;text-transform:uppercase;letter-spacing:0.06em">
              ${s.canClaimToday ? 'Награда за сегодняшний вход' : 'Награда на сегодня уже получена'}
            </div>
            <div style="color:#fff;font-size:15px;font-weight:bold;margin:2px 0">
              ${s.currentReward.title} — <span style="color:#fd4">+${s.currentReward.xp} XP</span> и <span style="color:#ffd700">+${s.currentReward.coins} Монет</span>
            </div>
            <div style="color:#888;font-size:11.5px">
              ${s.canClaimToday ? s.currentReward.desc : 'Следующая награда будет доступна завтра после 00:00.'}
            </div>
          </div>

          <div>
            ${
              s.canClaimToday
                ? `
                <button id="dsm_claim_btn" style="margin:0;padding:10px 24px;background:linear-gradient(180deg, #ff4757 0%, #8b0000 100%);border:2px solid #ff6b81;color:#fff;font-size:15px;font-weight:bold;font-family:Georgia,serif;border-radius:6px;cursor:pointer;box-shadow:0 0 20px rgba(255,71,87,0.7);transition:transform 0.1s;letter-spacing:0.04em">
                  🎁 ЗАБРАТЬ НАГРАДУ
                </button>
              `
                : `
                <div style="display:flex;align-items:center;gap:6px;color:#2ed573;font-size:13px;font-weight:bold;background:#0d2815;border:1px solid #2ed573;padding:8px 16px;border-radius:6px">
                  <span>✓</span>
                  <span>ПОЛУЧЕНО</span>
                </div>
              `
            }
          </div>
        </div>

        <!-- Footer / Daily Info -->
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:11.5px;color:#777;border-top:1px solid #3d1418;padding-top:10px">
          <div>Всего забрано наград: <b style="color:#ccc">${s.totalClaims}</b></div>
          <div style="color:#aaa">Серия обновляется каждые 24 часа</div>
        </div>

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const closeModal = () => closeAnimatedModal(modal);
    const closeBtn = modal.querySelector('#dsm_close');
    if (closeBtn) closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    const claimBtn = modal.querySelector('#dsm_claim_btn');
    if (claimBtn) {
      claimBtn.onclick = () => {
        claimBtn.disabled = true;
        const res = claimDailyStreakReward({
          PF,
          pWrite,
          ac,
          TN,
          onUpdate,
        });
        if (res.success) {
          renderContent();
        }
      };
    }
  }

  document.body.appendChild(modal);
  renderContent();
  openAnimatedModal(modal);
}

/**
 * Checks if the daily login reward is ready today, and updates lobby XP bar or shows toast
 */
export function checkAndNotifyDailyStreak(options = {}) {
  const s = getDailyStreakState();
  if (s.canClaimToday) {
    // Show toast or highlight
    const existing = document.getElementById('daily_streak_toast');
    if (existing) return;

    const toast = document.createElement('div');
    toast.id = 'daily_streak_toast';
    toast.style.cssText =
      'position:fixed;top:calc(16px + env(safe-area-inset-top, 0px));left:50%;transform:translateX(-50%);z-index:9850;background:#140508;border:2px solid #ffd700;border-radius:8px;padding:10px 18px;color:#fff;font-family:Georgia,serif;font-size:13px;display:flex;align-items:center;gap:12px;box-shadow:0 0 25px rgba(255,215,0,0.5);cursor:pointer;animation:fadeInModal 0.3s ease';

    toast.innerHTML = `
      <span style="font-size:22px">🎁</span>
      <div style="text-align:left">
        <div style="color:#ffd700;font-weight:bold;letter-spacing:0.04em">ЕЖЕДНЕВНАЯ НАГРАДА ГОТОВА!</div>
        <div style="color:#ddd;font-size:11.5px">День ${s.dayNumber} · Получи <b style="color:#fd4">+${s.currentReward.xp} XP</b> и <b style="color:#ffd700">+${s.currentReward.coins} 🪙</b></div>
      </div>
      <button style="margin:0;padding:5px 12px;background:#8b0000;border:1px solid #ff4757;color:#fff;border-radius:4px;font-size:12px;font-weight:bold;cursor:pointer">Забрать</button>
    `;

    toast.onclick = (e) => {
      toast.remove();
      showDailyStreakModal(options);
    };

    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast && toast.parentNode) toast.remove();
    }, 8000);
  }
}

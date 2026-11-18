/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { openAnimatedModal, closeAnimatedModal, disposeAnimatedModal } from './uiTransitions.js';
import { awardCoinsWithBoost, addXP } from './xpSystem.js';
import { lobbyMusic } from './lobbyMusic.js';
import { trTree } from './i18n.js';

export const EVENT_END_TS = new Date(2027, 0, 15, 23, 59, 59).getTime();

export const CH5_SCENARIOS = [
  {
    id: 'fuses',
    title: 'Предохранители',
    icon: '⚡',
    badge: 'Электросеть',
    desc: 'Найди 3 распределительных щитка в новогоднем доме и включи питание выходной двери.',
  },
  {
    id: 'keypad',
    title: 'Шифр-панель',
    icon: '🔢',
    badge: 'Взлом кода',
    desc: 'Отыщи записки с цифрами кода по комнатам и введи шифр на панели у двери.',
  },
  {
    id: 'vent',
    title: 'Вентиляция',
    icon: '🌀',
    badge: 'Побег',
    desc: 'Открой 3 заснеженные вентиляционные решётки в доме, чтобы расчистить путь наружу.',
  },
];

export const ADVENT_REWARDS = Array.from({ length: 25 }, (_, idx) => {
  const day = idx + 1;
  if (day === 25) return { day, coins: 1000, xp: 300, snowflakes: 5, label: 'Гранд-подарок: 1000 🪙 + 5 ❄️' };
  if (day % 5 === 0) return { day, coins: 350, xp: 140, snowflakes: 3, label: `${350} 🪙 + 3 ❄️ + ${140} XP` };
  if (day % 2 === 0) return { day, coins: 180, xp: 80, snowflakes: 2, label: `${180} 🪙 + 2 ❄️` };
  return { day, coins: 120, xp: 60, snowflakes: 1, label: `${120} 🪙 + 1 ❄️` };
});

export const EVENT_CHALLENGES = [
  {
    id: 'xmas_first_win',
    title: 'Первый побег из дома Санты',
    desc: 'Сбеги из Новогодней Главы 5 в одиночку или в кооперативе.',
    target: 1,
    rewardCoins: 400,
    rewardXp: 200,
    rewardSnow: 5,
    progressFn: (PF) => (PF.xmasEscaped ? 1 : 0),
  },
  {
    id: 'xmas_snow_collector',
    title: 'Хранитель снежинок (25 ❄️)',
    desc: 'Собери 25 снежинок в Главе 5, чтобы открыть скин «Санта-Гренни».',
    target: 25,
    rewardCoins: 600,
    rewardXp: 250,
    rewardSnow: 0,
    progressFn: (PF) => Math.min(25, Number(PF.snowflakes) || 0),
  },
  {
    id: 'xmas_scenarios_master',
    title: 'Мастер трёх сценариев',
    desc: 'Пройди Главу 5 всеми 3 способами: Предохранители, Шифр и Вентиляция.',
    target: 3,
    rewardCoins: 800,
    rewardXp: 350,
    rewardSnow: 5,
    progressFn: (PF) => {
      const done = Array.isArray(PF.ch5ScenariosWon) ? PF.ch5ScenariosWon.length : 0;
      return Math.min(3, done);
    },
  },
];

function escHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

export function getAdventUnlockState(day, now = new Date()) {
  const m = now.getMonth(); // 0=Jan ... 11=Dec
  const d = now.getDate();
  if (m === 11 && d >= 1 && d <= 25) {
    if (d >= day) {
      return { unlocked: true, reason: 'open', countdownText: '' };
    }
    return {
      unlocked: false,
      reason: 'locked_day',
      countdownText: `Откроется ${day} декабря`,
    };
  }
  return {
    unlocked: false,
    reason: 'locked_before_dec1',
    countdownText: getCountdownToDec1Text(now),
  };
}

export function getCountdownToDec1Text(now = new Date()) {
  const m = now.getMonth();
  const d = now.getDate();
  let year = now.getFullYear();
  if (m === 11 && d > 25) year += 1;
  const target = new Date(year, 11, 1, 0, 0, 0).getTime();
  const diff = Math.max(0, target - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hrs = Math.floor((diff % 86400000) / 3600000);
  const min = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${days} дн. ${p(hrs)}:${p(min)}:${p(sec)}`;
}

function getEventCountdownText(now = new Date()) {
  const diff = Math.max(0, EVENT_END_TS - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hrs = Math.floor((diff % 86400000) / 3600000);
  const min = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${days} дн. ${p(hrs)}:${p(min)}:${p(sec)}`;
}

function formatRunTime(sec) {
  const s = Math.max(0, Math.round(Number(sec) || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function showChristmasEventModal(PF, ctx = {}) {
  let m = document.getElementById('xmas_event_modal');
  if (m) disposeAnimatedModal(m);

  m = document.createElement('div');
  m.id = 'xmas_event_modal';
  m.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at 50% 25%, rgba(16,42,74,0.88) 0%, rgba(5,10,18,0.96) 80%);backdrop-filter:blur(7px);z-index:9200;display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box';

  let selectedScenario = PF.ch5Scenario || 'fuses';
  if (!Array.isArray(PF.eventChallengesClaimed)) PF.eventChallengesClaimed = [];
  const snow = Math.max(0, Number(PF.snowflakes) || 0);
  const snowPct = Math.min(100, Math.round((snow / 25) * 100));
  const santaUnlocked = (PF.ownedMonSkins || []).includes('santagranny') || snow >= 25;
  let cdTimer = null;

  const renderContent = () => {
    const scListHtml = CH5_SCENARIOS.map((sc) => {
      const active = selectedScenario === sc.id;
      return `
        <button type="button" data-sc="${sc.id}" class="xmas-sc-btn" style="flex:1;min-width:170px;margin:0;padding:10px 12px;text-align:left;cursor:pointer;border-radius:8px;border:1.5px solid ${active ? '#38bdf8' : 'rgba(147,197,253,0.28)'};background:${active ? 'linear-gradient(135deg,rgba(14,58,92,0.92),rgba(23,37,84,0.92))' : 'rgba(15,23,42,0.72)'};color:#f1f5f9;box-shadow:${active ? '0 0 18px rgba(56,189,248,0.32)' : 'none'}">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:4px">
            <span style="font-size:15px;font-weight:bold">${sc.icon} ${escHtml(sc.title)}</span>
            <span style="font-size:10px;padding:2px 6px;border-radius:4px;background:rgba(56,189,248,0.18);color:#bae6fd">${escHtml(sc.badge)}</span>
          </div>
          <div style="font-size:11.5px;color:#cbd5e1;line-height:1.35">${escHtml(sc.desc)}</div>
        </button>
      `;
    }).join('');

    const chalHtml = EVENT_CHALLENGES.map((ch) => {
      const prog = ch.progressFn(PF);
      const claimed = PF.eventChallengesClaimed.includes(ch.id);
      const ready = prog >= ch.target && !claimed;
      const pct = Math.min(100, Math.round((prog / ch.target) * 100));
      return `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 11px;border-radius:7px;background:rgba(15,23,42,0.75);border:1px solid ${ready ? '#fbbf24' : claimed ? 'rgba(52,211,153,0.45)' : 'rgba(148,163,184,0.24)'}">
          <div style="flex:1;min-width:0;text-align:left">
            <div style="font-size:13px;font-weight:bold;color:#f8fafc">${escHtml(ch.title)} <span style="color:#94a3b8;font-weight:normal;font-size:11px">(${prog}/${ch.target})</span></div>
            <div style="font-size:11px;color:#cbd5e1;margin-top:2px">${escHtml(ch.desc)}</div>
            <div style="height:4px;background:#0f172a;border-radius:3px;overflow:hidden;margin-top:5px">
              <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#38bdf8,#fbbf24)"></div>
            </div>
          </div>
          <div>
            ${claimed
              ? `<span style="font-size:11px;color:#34d399;font-weight:bold">✓ Получено</span>`
              : ready
                ? `<button type="button" data-claim-ch="${ch.id}" class="xmas-claim-btn" style="margin:0;padding:6px 10px;font-size:11.5px;background:linear-gradient(135deg,#b45309,#f59e0b);border:1px solid #fde68a;color:#fff;border-radius:6px;cursor:pointer;font-weight:bold">Забрать +${ch.rewardCoins}🪙</button>`
                : `<span style="font-size:11px;color:#fbbf24">+${ch.rewardCoins}🪙${ch.rewardSnow ? ` +${ch.rewardSnow}❄️` : ''}</span>`
            }
          </div>
        </div>
      `;
    }).join('');

    m.innerHTML = `
      <div style="width:100%;max-width:760px;max-height:92vh;overflow-y:auto;border-radius:12px;border:2px solid #93c5fd;background:
        repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 18px, rgba(0,0,0,0.08) 18px 36px),
        linear-gradient(165deg, #2b1812 0%, #19121a 38%, #0d1b2a 100%);
        color:#f1f5f9;font-family:Georgia,serif;padding:20px;box-shadow:0 0 42px rgba(56,189,248,0.28), inset 0 0 45px rgba(186,230,253,0.12);position:relative;box-sizing:border-box">

        <button id="xmas_close" type="button" style="position:absolute;top:12px;right:14px;background:rgba(15,23,42,0.75);border:1px solid #60a5fa;color:#e0f2fe;font-size:17px;border-radius:6px;padding:4px 9px;cursor:pointer;margin:0">✕</button>

        <!-- Festive Header Banner -->
        <div style="text-align:center;padding-bottom:12px;border-bottom:1px solid rgba(147,197,253,0.28);margin-bottom:14px">
          <div style="font-size:11px;letter-spacing:0.25em;color:#7dd3fc;text-transform:uppercase;margin-bottom:4px">❄️ НОВОГОДНИЙ ЭВЕНТ · ГЛАВА 5 ❄️</div>
          <h2 style="margin:0;font-size:23px;color:#fff;text-shadow:0 0 16px rgba(56,189,248,0.6)">ЗИМНИЙ ДОМ САНТА-ГРЕННИ</h2>
          <div style="margin-top:6px;font-size:12px;color:#fde68a">
            ⏳ До конца эвента: <b id="xmas_event_cd" style="font-family:monospace;color:#fef08a">${getEventCountdownText()}</b>
          </div>
        </div>

        <!-- Chapter 5 Preview & Rewards Summary -->
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding:12px;border-radius:9px;background:rgba(12,20,34,0.78);border:1px solid rgba(147,197,253,0.3);margin-bottom:14px">
          <img src="/assets/aistudio/IMG_4a4b8ea1-ddec-46f1-a0fb-6b80c91b2d1c_2bb25989.jpg" alt="Санта-Гренни" style="width:128px;height:78px;object-fit:cover;border-radius:6px;border:1.5px solid #ef4444;flex-shrink:0" />
          <div style="flex:1;min-width:210px;text-align:left">
            <div style="font-size:14px;font-weight:bold;color:#fca5a5;margin-bottom:3px">Босс главы: Санта-Гренни</div>
            <div style="font-size:12px;color:#cbd5e1;line-height:1.4">
              Точный 2-этажный дом с камином, ёлкой и заснеженным двором. Первый побег открывает эксклюзивные <b>Новогодние сани</b>, <b>зимний чехол</b> для телефона и зимнюю куртку!
            </div>
          </div>
        </div>

        <!-- Snowflake Milestone Bar -->
        <div style="padding:11px 13px;border-radius:9px;background:rgba(15,23,42,0.8);border:1px solid rgba(56,189,248,0.35);margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;margin-bottom:6px">
            <span>❄️ Снежинки эвента: <b style="color:#7dd3fc">${snow} / 25</b></span>
            <span style="font-size:12px;color:${santaUnlocked ? '#4ade80' : '#fde047'}">
              ${santaUnlocked ? '✓ Скин «Санта-Гренни» открыт!' : 'На 25 ❄️ откроется скин «Санта-Гренни»'}
            </span>
          </div>
          <div style="height:8px;background:#09111f;border-radius:5px;border:1px solid rgba(125,211,252,0.3);overflow:hidden">
            <div style="width:${snowPct}%;height:100%;background:linear-gradient(90deg,#0284c7,#38bdf8,#fef08a);transition:width 0.3s"></div>
          </div>
        </div>

        <!-- 3 Escape Scenarios -->
        <div style="margin-bottom:14px">
          <div style="font-size:12px;letter-spacing:0.12em;color:#bae6fd;text-transform:uppercase;margin-bottom:8px;text-align:left">Выбери сценарий побега:</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px">${scListHtml}</div>
        </div>

        <!-- Play Solo / Play Coop -->
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px">
          <button id="xmas_play_solo" type="button" style="flex:1;min-width:200px;margin:0;padding:12px 16px;font-size:14.5px;font-weight:bold;border-radius:8px;cursor:pointer;background:linear-gradient(135deg,#991b1b,#dc2626);border:1.5px solid #fca5a5;color:#fff;box-shadow:0 0 18px rgba(220,38,38,0.45)">
            🎄 Играть Глава 5 (Соло)
          </button>
          <button id="xmas_play_coop" type="button" style="flex:1;min-width:200px;margin:0;padding:12px 16px;font-size:14.5px;font-weight:bold;border-radius:8px;cursor:pointer;background:linear-gradient(135deg,#0f766e,#0d9488);border:1.5px solid #5eead4;color:#fff;box-shadow:0 0 18px rgba(20,184,166,0.35)">
            👥 Новогодний Кооп (Глава 5)
          </button>
        </div>

        <!-- Challenges -->
        <div style="margin-bottom:14px">
          <div style="font-size:12px;letter-spacing:0.12em;color:#fde68a;text-transform:uppercase;margin-bottom:7px;text-align:left">🏆 Новогодние испытания</div>
          <div style="display:flex;flex-direction:column;gap:7px">${chalHtml}</div>
        </div>

        <!-- Event Leaderboard -->
        <div style="padding:11px 13px;border-radius:9px;background:rgba(9,15,26,0.82);border:1px solid rgba(148,163,184,0.25);margin-bottom:14px">
          <div style="font-size:12px;letter-spacing:0.12em;color:#7dd3fc;text-transform:uppercase;margin-bottom:8px;text-align:left">📊 Таблица рекордов Главы 5</div>
          <div id="xmas_lb_box" style="font-size:12px;color:#cbd5e1;text-align:left">Загрузка рекордов...</div>
        </div>

        <!-- Bottom Advent Calendar Button -->
        <button id="xmas_open_advent" type="button" style="width:100%;margin:0;padding:12px;font-size:14px;font-weight:bold;border-radius:8px;cursor:pointer;background:linear-gradient(135deg,#1e3a8a,#1d4ed8);border:1.5px solid #93c5fd;color:#fff;box-shadow:0 0 20px rgba(59,130,246,0.4)">
          🎁 Адвент-календарь (25 зимних подарков)
        </button>
      </div>
    `;

    trTree(m);

    m.querySelector('#xmas_close').onclick = () => {
      clearInterval(cdTimer);
      closeAnimatedModal(m);
    };
    m.onclick = (e) => {
      if (e.target === m) {
        clearInterval(cdTimer);
        closeAnimatedModal(m);
      }
    };

    m.querySelectorAll('.xmas-sc-btn').forEach((btn) => {
      btn.onclick = () => {
        selectedScenario = btn.getAttribute('data-sc') || 'fuses';
        PF.ch5Scenario = selectedScenario;
        if (ctx.pWrite) ctx.pWrite();
        lobbyMusic.playLobbySfx('click');
        renderContent();
        loadLeaderboard();
      };
    });

    m.querySelectorAll('.xmas-claim-btn').forEach((btn) => {
      btn.onclick = () => {
        const cid = btn.getAttribute('data-claim-ch');
        const ch = EVENT_CHALLENGES.find((x) => x.id === cid);
        if (!ch || PF.eventChallengesClaimed.includes(cid)) return;
        PF.eventChallengesClaimed.push(cid);
        const gotCoins = awardCoinsWithBoost(PF, ch.rewardCoins);
        PF.snowflakes = (Number(PF.snowflakes) || 0) + (ch.rewardSnow || 0);
        addXP(ch.rewardXp, ch.title, { PF, pWrite: ctx.pWrite, ac: ctx.ac, TN: ctx.TN });
        if (PF.snowflakes >= 25 && !(PF.ownedMonSkins || []).includes('santagranny')) {
          PF.ownedMonSkins = [...(PF.ownedMonSkins || ['maze']), 'santagranny'];
        }
        if (ctx.pWrite) ctx.pWrite();
        if (ctx.onProfileUpdated) ctx.onProfileUpdated();
        lobbyMusic.playLobbySfx('gift');
        if (ctx.showToast) ctx.showToast(`Награда получена: +${gotCoins} монет и +${ch.rewardXp} XP!`);
        renderContent();
        loadLeaderboard();
      };
    });

    m.querySelector('#xmas_play_solo').onclick = () => {
      PF.ch5Scenario = selectedScenario;
      if (ctx.pWrite) ctx.pWrite();
      clearInterval(cdTimer);
      closeAnimatedModal(m, {
        onDone: () => {
          if (ctx.onStartCh5Solo) ctx.onStartCh5Solo(selectedScenario);
        },
      });
    };

    m.querySelector('#xmas_play_coop').onclick = () => {
      PF.ch5Scenario = selectedScenario;
      if (ctx.pWrite) ctx.pWrite();
      clearInterval(cdTimer);
      closeAnimatedModal(m, {
        onDone: () => {
          if (ctx.onStartCh5Coop) ctx.onStartCh5Coop(selectedScenario);
        },
      });
    };

    m.querySelector('#xmas_open_advent').onclick = () => {
      lobbyMusic.playLobbySfx('click');
      showAdventCalendarModal(PF, ctx);
    };
  };

  const loadLeaderboard = async () => {
    const box = m.querySelector('#xmas_lb_box');
    if (!box) return;
    try {
      const r = await fetch('/api/event/leaderboard');
      const d = await r.json();
      const rows = Array.isArray(d.rows) ? d.rows : [];
      if (!rows.length) {
        box.innerHTML = '<div style="color:#94a3b8">Пока нет побегов из Главы 5. Стань первым!</div>';
        return;
      }
      const scName = { fuses: '⚡ Щитки', keypad: '🔢 Шифр', vent: '🌀 Вент.' };
      box.innerHTML = `
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead>
            <tr style="color:#94a3b8;border-bottom:1px solid rgba(148,163,184,0.2)">
              <th style="text-align:left;padding:4px 6px">#</th>
              <th style="text-align:left;padding:4px 6px">Игрок</th>
              <th style="text-align:left;padding:4px 6px">Сценарий</th>
              <th style="text-align:left;padding:4px 6px">Режим</th>
              <th style="text-align:right;padding:4px 6px">Время</th>
              <th style="text-align:right;padding:4px 6px">❄️</th>
            </tr>
          </thead>
          <tbody>
            ${rows.slice(0, 10).map((row, idx) => `
              <tr style="border-bottom:1px solid rgba(148,163,184,0.1)">
                <td style="padding:4px 6px;color:#fbbf24">${idx + 1}</td>
                <td style="padding:4px 6px;font-weight:bold;color:#f8fafc">${escHtml(row.name || 'Игрок')}</td>
                <td style="padding:4px 6px">${scName[row.scenario] || escHtml(row.scenario)}</td>
                <td style="padding:4px 6px;color:#cbd5e1">${row.mode === 'coop' ? 'Кооп' : 'Соло'}</td>
                <td style="padding:4px 6px;text-align:right;font-family:monospace;color:#4ade80">${formatRunTime(row.timeSec)}</td>
                <td style="padding:4px 6px;text-align:right;color:#7dd3fc">${Number(row.snowflakes) || 0}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (e) {
      box.innerHTML = '<div style="color:#f87171">Не удалось загрузить таблицу рекордов.</div>';
    }
  };

  document.body.appendChild(m);
  renderContent();
  loadLeaderboard();
  openAnimatedModal(m);

  cdTimer = setInterval(() => {
    if (!m.isConnected) {
      clearInterval(cdTimer);
      return;
    }
    const cdEl = m.querySelector('#xmas_event_cd');
    if (cdEl) cdEl.textContent = getEventCountdownText();
  }, 1000);
}

export function showAdventCalendarModal(PF, ctx = {}) {
  let m = document.getElementById('advent_modal');
  if (m) disposeAnimatedModal(m);

  if (!Array.isArray(PF.adventClaimed)) PF.adventClaimed = [];

  m = document.createElement('div');
  m.id = 'advent_modal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(4,9,18,0.92);backdrop-filter:blur(7px);z-index:9350;display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box';
  let advTimer = null;

  const renderGrid = () => {
    const now = new Date();
    const isDecWindow = now.getMonth() === 11 && now.getDate() >= 1 && now.getDate() <= 25;
    const bannerText = isDecWindow
      ? `🎄 Открыты двери с 1 по ${now.getDate()} декабря!`
      : `🔒 Адвент-календарь закрыт до 1 декабря · До открытия: ${getCountdownToDec1Text(now)}`;

    const cardsHtml = ADVENT_REWARDS.map((rew) => {
      const st = getAdventUnlockState(rew.day, now);
      const claimed = PF.adventClaimed.includes(rew.day);
      const canOpen = st.unlocked && !claimed;

      let bg = 'rgba(15,23,42,0.86)';
      let border = '1px solid rgba(148,163,184,0.28)';
      let statusHtml = `<div style="font-size:10.5px;color:#94a3b8">🔒 Закрыто</div>`;
      if (claimed) {
        bg = 'rgba(20,83,45,0.68)';
        border = '1px solid #4ade80';
        statusHtml = `<div style="font-size:10.5px;color:#86efac">${escHtml(rew.label)}</div>`;
      } else if (canOpen) {
        bg = 'linear-gradient(145deg,rgba(153,27,27,0.85),rgba(180,83,9,0.75))';
        border = '1.5px solid #fbbf24';
        statusHtml = `<div style="font-size:10.5px;color:#fef08a;font-weight:bold">🎁 Открыть!</div>`;
      }

      return `
        <button type="button" data-adv-day="${rew.day}" class="adv-day-btn" ${canOpen ? '' : 'disabled'} style="margin:0;padding:10px 6px;border-radius:8px;border:${border};background:${bg};color:#f8fafc;cursor:${canOpen ? 'pointer' : 'not-allowed'};opacity:${canOpen || claimed ? '1' : '0.72'};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:76px;text-align:center">
          <div style="font-size:17px;font-weight:bold;color:${claimed ? '#86efac' : canOpen ? '#fef08a' : '#cbd5e1'}">${rew.day} Дек</div>
          ${statusHtml}
        </button>
      `;
    }).join('');

    m.innerHTML = `
      <div style="width:100%;max-width:680px;max-height:92vh;overflow-y:auto;border-radius:12px;border:2px solid #93c5fd;background:linear-gradient(170deg,#1a100e 0%,#0f172a 60%,#0a192f 100%);color:#f8fafc;font-family:Georgia,serif;padding:20px;box-shadow:0 0 40px rgba(56,189,248,0.28);position:relative;box-sizing:border-box">
        <button id="adv_close" type="button" style="position:absolute;top:12px;right:14px;background:rgba(15,23,42,0.8);border:1px solid #60a5fa;color:#e0f2fe;font-size:17px;border-radius:6px;padding:4px 9px;cursor:pointer;margin:0">✕</button>
        <h2 style="margin:0 0 6px;font-size:21px;color:#fff;text-align:center">🎁 НОВОГОДНИЙ АДВЕНТ-КАЛЕНДАРЬ</h2>
        <div id="adv_cd_banner" style="text-align:center;font-size:12.5px;padding:8px 12px;border-radius:7px;background:rgba(15,23,42,0.85);border:1px solid ${isDecWindow ? '#34d399' : '#f59e0b'};color:${isDecWindow ? '#6ee7b7' : '#fde68a'};margin-bottom:14px">
          ${escHtml(bannerText)}
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:8px">
          ${cardsHtml}
        </div>
      </div>
    `;

    trTree(m);

    m.querySelector('#adv_close').onclick = () => {
      clearInterval(advTimer);
      closeAnimatedModal(m);
    };
    m.onclick = (e) => {
      if (e.target === m) {
        clearInterval(advTimer);
        closeAnimatedModal(m);
      }
    };

    m.querySelectorAll('.adv-day-btn').forEach((btn) => {
      btn.onclick = () => {
        const day = Number(btn.getAttribute('data-adv-day'));
        const st = getAdventUnlockState(day, new Date());
        if (!st.unlocked || PF.adventClaimed.includes(day)) {
          lobbyMusic.playLobbySfx('promo_err');
          return;
        }
        const rew = ADVENT_REWARDS.find((r) => r.day === day);
        if (!rew) return;
        PF.adventClaimed.push(day);
        const gotCoins = awardCoinsWithBoost(PF, rew.coins);
        PF.snowflakes = (Number(PF.snowflakes) || 0) + (rew.snowflakes || 0);
        addXP(rew.xp, 'Адвент: день ' + day, { PF, pWrite: ctx.pWrite, ac: ctx.ac, TN: ctx.TN });
        if (PF.snowflakes >= 25 && !(PF.ownedMonSkins || []).includes('santagranny')) {
          PF.ownedMonSkins = [...(PF.ownedMonSkins || ['maze']), 'santagranny'];
        }
        if (ctx.unlockAchievement) ctx.unlockAchievement('advent_opener');
        if (ctx.pWrite) ctx.pWrite();
        if (ctx.onProfileUpdated) ctx.onProfileUpdated();
        lobbyMusic.playLobbySfx('gift');
        if (ctx.showToast) ctx.showToast(`День ${day}: +${gotCoins} 🪙, +${rew.snowflakes} ❄️, +${rew.xp} XP!`);
        renderGrid();
      };
    });
  };

  document.body.appendChild(m);
  renderGrid();
  openAnimatedModal(m);

  advTimer = setInterval(() => {
    if (!m.isConnected) {
      clearInterval(advTimer);
      return;
    }
    const now = new Date();
    const isDecWindow = now.getMonth() === 11 && now.getDate() >= 1 && now.getDate() <= 25;
    const ban = m.querySelector('#adv_cd_banner');
    if (ban && !isDecWindow) {
      ban.textContent = `🔒 Адвент-календарь закрыт до 1 декабря · До открытия: ${getCountdownToDec1Text(now)}`;
    }
  }, 1000);
}

export function showChangelogModal() {
  let m = document.getElementById('changelog_modal');
  if (m) disposeAnimatedModal(m);

  m = document.createElement('div');
  m.id = 'changelog_modal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(4,6,12,0.88);backdrop-filter:blur(6px);z-index:9200;display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box';
  m.innerHTML = `
    <div style="width:100%;max-width:560px;max-height:88vh;overflow-y:auto;background:#0a0b10;border:1.5px solid #475569;border-radius:10px;padding:20px;color:#e2e8f0;font-family:Georgia,serif;position:relative;box-sizing:border-box;box-shadow:0 0 36px rgba(15,23,42,0.9)">
      <button id="cl_close" type="button" style="position:absolute;top:12px;right:14px;background:transparent;border:0;color:#94a3b8;font-size:19px;cursor:pointer;padding:4px;margin:0">✕</button>
      <h2 style="margin:0 0 12px;font-size:20px;color:#f8fafc;text-align:center">📋 СПИСОК ОБНОВЛЕНИЙ</h2>
      <div id="cl_body" style="font-size:13px;color:#cbd5e1;text-align:left">Загрузка списка обновлений...</div>
    </div>
  `;
  document.body.appendChild(m);
  openAnimatedModal(m);

  m.querySelector('#cl_close').onclick = () => closeAnimatedModal(m);
  m.onclick = (e) => { if (e.target === m) closeAnimatedModal(m); };

  fetch('/changelog.json')
    .then((r) => r.json())
    .then((data) => {
      const body = m.querySelector('#cl_body');
      if (!body) return;
      const versions = Array.isArray(data.versions) ? data.versions : [];
      if (!versions.length) {
        body.innerHTML = '<div>Нет записей об обновлениях.</div>';
        return;
      }
      body.innerHTML = versions.map((v) => `
        <div style="margin-bottom:14px;padding:12px;border-radius:8px;background:rgba(15,23,42,0.75);border:1px solid rgba(148,163,184,0.22)">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-weight:bold;color:#fbbf24;font-size:14.5px">v${escHtml(v.version)} · ${escHtml(v.title)}</span>
            <span style="font-size:11px;color:#94a3b8">${escHtml(v.date)}</span>
          </div>
          <ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px">
            ${(v.items || []).map((item) => `<li style="color:#e2e8f0;line-height:1.4">${escHtml(item)}</li>`).join('')}
          </ul>
        </div>
      `).join('');
      trTree(m);
    })
    .catch(() => {
      const body = m.querySelector('#cl_body');
      if (body) body.innerHTML = '<div style="color:#f87171">Не удалось загрузить список обновлений.</div>';
    });
}

export function showFriendsModal(PF, coop, ctx = {}) {
  let m = document.getElementById('friends_modal');
  if (m) disposeAnimatedModal(m);

  if (!Array.isArray(PF.friends)) PF.friends = [];
  const myId = PF.clientId || (ctx.getClientId ? ctx.getClientId() : 'player');
  let liveStatuses = new Map();
  let unsubLookup = null;

  m = document.createElement('div');
  m.id = 'friends_modal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(5,6,10,0.88);backdrop-filter:blur(6px);z-index:9200;display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box';

  const drawModal = () => {
    const friendsHtml = PF.friends.length
      ? PF.friends.map((fr) => {
          const id = typeof fr === 'string' ? fr : fr.id;
          const st = liveStatuses.get(id);
          const online = st && st.online;
          const displayName = (st && st.name) || (typeof fr === 'object' && fr.name) || id;
          const statusLabel = online ? `🟢 В сети · ${st.status || 'В лобби'}` : '⚫ Оффлайн';
          return `
            <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:9px 11px;border-radius:8px;background:rgba(15,23,42,0.8);border:1px solid ${online ? 'rgba(52,211,153,0.45)' : 'rgba(148,163,184,0.22)'}">
              <div style="text-align:left;min-width:140px">
                <div style="font-size:13.5px;font-weight:bold;color:#f8fafc">${escHtml(displayName)}</div>
                <div style="font-size:11px;color:${online ? '#6ee7b7' : '#94a3b8'};font-family:monospace">${escHtml(statusLabel)} · ID: ${escHtml(id)}</div>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                <button type="button" data-inv-room="${escHtml(id)}" style="margin:0;padding:5px 9px;font-size:11.5px;border-radius:6px;background:#1e3a8a;border:1px solid #60a5fa;color:#fff;cursor:pointer">👥 В комнату</button>
                <button type="button" data-inv-xmas="${escHtml(id)}" style="margin:0;padding:5px 9px;font-size:11.5px;border-radius:6px;background:#991b1b;border:1px solid #fca5a5;color:#fff;cursor:pointer">🎄 В Новогодний Эвент</button>
                <button type="button" data-del-fr="${escHtml(id)}" style="margin:0;padding:5px 8px;font-size:11.5px;border-radius:6px;background:#1f2937;border:1px solid #475569;color:#fca5a5;cursor:pointer">✕</button>
              </div>
            </div>
          `;
        }).join('')
      : '<div style="font-size:12.5px;color:#94a3b8;padding:12px;text-align:center">Список друзей пока пуст. Попроси ID друга и добавь его!</div>';

    m.innerHTML = `
      <div style="width:100%;max-width:560px;max-height:88vh;overflow-y:auto;background:#0a0d14;border:1.5px solid #60a5fa;border-radius:10px;padding:20px;color:#e2e8f0;font-family:Georgia,serif;position:relative;box-sizing:border-box;box-shadow:0 0 36px rgba(37,99,235,0.28)">
        <button id="fr_close" type="button" style="position:absolute;top:12px;right:14px;background:transparent;border:0;color:#94a3b8;font-size:19px;cursor:pointer;padding:4px;margin:0">✕</button>
        <h2 style="margin:0 0 12px;font-size:20px;color:#f8fafc;text-align:center">👥 ДРУЗЬЯ ПО ID</h2>

        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-radius:8px;background:rgba(30,41,59,0.75);border:1px solid rgba(96,165,250,0.35);margin-bottom:12px">
          <div style="text-align:left">
            <div style="font-size:11px;color:#93c5fd">Твой ID игрока:</div>
            <div style="font-family:monospace;font-size:13px;color:#fff;font-weight:bold;word-break:break-all">${escHtml(myId)}</div>
          </div>
          <button id="fr_copy_id" type="button" style="margin:0;padding:7px 12px;font-size:12px;border-radius:6px;background:#1d4ed8;border:1px solid #93c5fd;color:#fff;cursor:pointer;flex-shrink:0">📋 Копировать</button>
        </div>

        <div style="display:flex;gap:8px;margin-bottom:14px">
          <input id="fr_add_input" placeholder="Введи ID друга..." maxlength="64" style="flex:1;background:#0f172a;border:1px solid #475569;color:#fff;padding:8px 10px;border-radius:6px;font-family:monospace;font-size:13px" />
          <button id="fr_add_btn" type="button" style="margin:0;padding:8px 14px;font-size:13px;border-radius:6px;background:#15803d;border:1px solid #4ade80;color:#fff;cursor:pointer;font-weight:bold">+ Добавить</button>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px">${friendsHtml}</div>
      </div>
    `;

    trTree(m);

    m.querySelector('#fr_close').onclick = () => {
      if (unsubLookup) unsubLookup();
      closeAnimatedModal(m);
    };
    m.onclick = (e) => {
      if (e.target === m) {
        if (unsubLookup) unsubLookup();
        closeAnimatedModal(m);
      }
    };

    m.querySelector('#fr_copy_id').onclick = () => {
      navigator.clipboard?.writeText(myId).catch(() => {});
      if (ctx.showToast) ctx.showToast('Твой ID скопирован: ' + myId);
      lobbyMusic.playLobbySfx('click');
    };

    m.querySelector('#fr_add_btn').onclick = () => {
      const inp = m.querySelector('#fr_add_input');
      const targetId = String(inp?.value || '').trim();
      if (!targetId || targetId === myId) {
        lobbyMusic.playLobbySfx('promo_err');
        if (ctx.showToast) ctx.showToast(targetId === myId ? 'Нельзя добавить самого себя' : 'Введи корректный ID');
        return;
      }
      if (!PF.friends.some((f) => (typeof f === 'string' ? f : f.id) === targetId)) {
        PF.friends.push({ id: targetId, name: targetId.slice(0, 12), addedAt: Date.now() });
        if (ctx.pWrite) ctx.pWrite();
      }
      lobbyMusic.playLobbySfx('promo_ok');
      drawModal();
      requestLookup();
    };

    m.querySelectorAll('[data-del-fr]').forEach((b) => {
      b.onclick = () => {
        const tid = b.getAttribute('data-del-fr');
        PF.friends = PF.friends.filter((f) => (typeof f === 'string' ? f : f.id) !== tid);
        if (ctx.pWrite) ctx.pWrite();
        drawModal();
      };
    });

    m.querySelectorAll('[data-inv-room]').forEach((b) => {
      b.onclick = () => {
        const tid = b.getAttribute('data-inv-room');
        const rc = (ctx.getRoomCode && ctx.getRoomCode()) || ('GAME' + Math.floor(100 + Math.random() * 899));
        if (coop && coop.sendFriendInvite) coop.sendFriendInvite(tid, 'room', rc, ctx.getChapter ? ctx.getChapter() : 1);
        lobbyMusic.playLobbySfx('gift');
        if (ctx.showToast) ctx.showToast(`Приглашение в комнату (${rc}) отправлено!`);
      };
    });

    m.querySelectorAll('[data-inv-xmas]').forEach((b) => {
      b.onclick = () => {
        const tid = b.getAttribute('data-inv-xmas');
        const rc = (ctx.getRoomCode && ctx.getRoomCode()) || 'XMAS5';
        if (coop && coop.sendFriendInvite) coop.sendFriendInvite(tid, 'christmas_event', rc, 5);
        lobbyMusic.playLobbySfx('gift');
        if (ctx.showToast) ctx.showToast('Приглашение в Новогодний Эвент отправлено!');
      };
    });
  };

  const requestLookup = () => {
    const ids = PF.friends.map((f) => (typeof f === 'string' ? f : f.id)).filter(Boolean);
    if (ids.length && coop && coop.lookupFriends) coop.lookupFriends(ids);
  };

  unsubLookup = coop && coop.onFriendLookup
    ? coop.onFriendLookup((list) => {
        if (!Array.isArray(list)) return;
        for (const item of list) {
          if (item && item.id) liveStatuses.set(item.id, item);
        }
        if (m.isConnected) drawModal();
      })
    : null;

  document.body.appendChild(m);
  drawModal();
  requestLookup();
  openAnimatedModal(m);
}

export function showMapVotingModal(coop, ctx = {}) {
  let m = document.getElementById('map_vote_modal');
  if (m) disposeAnimatedModal(m);

  const maps = [
    { ch: 1, title: 'Глава 1 · Лабиринт', accent: '#ef4444' },
    { ch: 2, title: 'Глава 2 · Особняк', accent: '#f97316' },
    { ch: 3, title: 'Глава 3 · Кладбище', accent: '#22c55e' },
    { ch: 4, title: 'Глава 4 · Гаражи', accent: '#eab308' },
    { ch: 5, title: 'Глава 5 · Новогодняя', accent: '#38bdf8' },
  ];

  let voteState = { counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, total: 0, myVote: 0 };
  let unsubVote = null;

  m = document.createElement('div');
  m.id = 'map_vote_modal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(4,6,12,0.88);backdrop-filter:blur(6px);z-index:9200;display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box';

  const drawVotes = () => {
    const tot = Math.max(1, voteState.total || 0);
    m.innerHTML = `
      <div style="width:100%;max-width:480px;background:#0b0f17;border:1.5px solid #38bdf8;border-radius:10px;padding:20px;color:#e2e8f0;font-family:Georgia,serif;position:relative;box-sizing:border-box;box-shadow:0 0 34px rgba(56,189,248,0.25)">
        <button id="mv_close" type="button" style="position:absolute;top:12px;right:14px;background:transparent;border:0;color:#94a3b8;font-size:19px;cursor:pointer;padding:4px;margin:0">✕</button>
        <h2 style="margin:0 0 6px;font-size:19px;color:#fff;text-align:center">🗳 ГОЛОСОВАНИЕ ЗА КАРТУ</h2>
        <div style="font-size:12px;color:#94a3b8;text-align:center;margin-bottom:14px">Выбери следующую главу (синхронизируется по сети)</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${maps.map((mp) => {
            const cnt = Number(voteState.counts?.[mp.ch] || 0);
            const pct = voteState.total ? Math.round((cnt / tot) * 100) : 0;
            const picked = voteState.myVote === mp.ch;
            return `
              <button type="button" data-vote-ch="${mp.ch}" class="mv-btn" style="position:relative;overflow:hidden;margin:0;padding:10px 12px;text-align:left;border-radius:8px;border:1.5px solid ${picked ? mp.accent : 'rgba(148,163,184,0.28)'};background:rgba(15,23,42,0.85);color:#f8fafc;cursor:pointer">
                <div style="position:absolute;inset:0 auto 0 0;width:${pct}%;background:${mp.accent};opacity:0.22;transition:width 0.25s"></div>
                <div style="position:relative;display:flex;justify-content:space-between;align-items:center">
                  <span style="font-weight:bold">${picked ? '✓ ' : ''}${escHtml(mp.title)}</span>
                  <span style="font-family:monospace;font-size:12px;color:#cbd5e1">${cnt} гол. (${pct}%)</span>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;

    trTree(m);

    m.querySelector('#mv_close').onclick = () => {
      if (unsubVote) unsubVote();
      closeAnimatedModal(m);
    };
    m.onclick = (e) => {
      if (e.target === m) {
        if (unsubVote) unsubVote();
        closeAnimatedModal(m);
      }
    };
    m.querySelectorAll('.mv-btn').forEach((btn) => {
      btn.onclick = () => {
        const chNum = Number(btn.getAttribute('data-vote-ch'));
        voteState.myVote = chNum;
        lobbyMusic.playLobbySfx('vote');
        if (coop && coop.castMapVote) {
          coop.castMapVote(chNum);
        }
        if (ctx.onVoteSelected) ctx.onVoteSelected(chNum);
        drawVotes();
      };
    });
  };

  unsubVote = coop && coop.onMapVoteState
    ? coop.onMapVoteState((payload) => {
        if (payload && payload.counts) {
          voteState.counts = payload.counts;
          voteState.total = Object.values(payload.counts).reduce((a, b) => a + (Number(b) || 0), 0);
          if (m.isConnected) drawVotes();
        }
      })
    : null;

  document.body.appendChild(m);
  drawVotes();
  openAnimatedModal(m);
}

export function showKeypadHackModal(codeDigits, onSuccess, onCancel) {
  let m = document.getElementById('ch5_keypad_modal');
  if (m) disposeAnimatedModal(m);

  const target = String(codeDigits || '1225');
  let entered = '';
  let errFlash = false;

  m = document.createElement('div');
  m.id = 'ch5_keypad_modal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(2,6,14,0.86);backdrop-filter:blur(5px);z-index:9400;display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box';

  const drawPad = () => {
    const slots = target.split('').map((_, idx) => entered[idx] || '_').join(' ');
    m.innerHTML = `
      <div style="width:100%;max-width:300px;background:#0f172a;border:2px solid ${errFlash ? '#ef4444' : '#38bdf8'};border-radius:10px;padding:18px;color:#e2e8f0;font-family:monospace;text-align:center;box-shadow:0 0 32px rgba(56,189,248,0.3);position:relative">
        <button id="kp_close" type="button" style="position:absolute;top:8px;right:10px;background:transparent;border:0;color:#94a3b8;font-size:17px;cursor:pointer;margin:0">✕</button>
        <div style="font-size:11px;color:#7dd3fc;letter-spacing:0.15em;margin-bottom:6px">ЗАМОК ДВЕРИ</div>
        <div style="font-size:26px;letter-spacing:0.25em;padding:10px;background:#020617;border:1px solid ${errFlash ? '#ef4444' : '#334155'};border-radius:6px;margin-bottom:12px;color:${errFlash ? '#f87171' : '#38bdf8'}">${slots}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px">
          ${[1,2,3,4,5,6,7,8,9,'⌫',0,'✓'].map((k) => `
            <button type="button" data-kp="${k}" class="kp-btn" style="margin:0;padding:11px 0;font-size:16px;font-weight:bold;border-radius:6px;border:1px solid #334155;background:${k === '✓' ? '#15803d' : k === '⌫' ? '#7f1d1d' : '#1e293b'};color:#fff;cursor:pointer">${k}</button>
          `).join('')}
        </div>
      </div>
    `;
    m.querySelector('#kp_close').onclick = () => {
      closeAnimatedModal(m);
      if (onCancel) onCancel();
    };
    m.querySelectorAll('.kp-btn').forEach((b) => {
      b.onclick = () => {
        const k = b.getAttribute('data-kp');
        errFlash = false;
        if (k === '⌫') {
          entered = entered.slice(0, -1);
          lobbyMusic.playLobbySfx('click');
          drawPad();
        } else if (k === '✓') {
          if (entered === target) {
            lobbyMusic.playLobbySfx('promo_ok');
            closeAnimatedModal(m, { onDone: () => onSuccess && onSuccess() });
          } else {
            lobbyMusic.playLobbySfx('promo_err');
            errFlash = true;
            entered = '';
            drawPad();
          }
        } else if (entered.length < target.length) {
          entered += k;
          lobbyMusic.playLobbySfx('click');
          if (entered.length === target.length && entered === target) {
            lobbyMusic.playLobbySfx('promo_ok');
            closeAnimatedModal(m, { onDone: () => onSuccess && onSuccess() });
            return;
          }
          drawPad();
        }
      };
    });
  };

  document.body.appendChild(m);
  drawPad();
  openAnimatedModal(m);
}

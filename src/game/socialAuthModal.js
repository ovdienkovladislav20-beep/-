/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SOCIAL_PROVIDERS, AVATAR_PRESETS, setStoredSocialAuth, getAvatarSvg } from './socialAuth.js';
import { unlockAchievement } from './achievements.js';
import { openAnimatedModal, closeAnimatedModal, disposeAnimatedModal } from './uiTransitions.js';

export function showSocialAuthModal(options = {}) {
  const { PF, pWrite, ac, TN, onLoginSuccess } = options;

  let existing = document.getElementById('social_auth_modal');
  if (existing) disposeAnimatedModal(existing);

  let selectedEmoji = AVATAR_PRESETS[0]?.emoji || '🔦';
  let selectedBg = '#14080a';
  let currentNick = (PF?.name || 'Игрок').slice(0, 10);

  const modal = document.createElement('div');
  modal.id = 'social_auth_modal';
  modal.style.cssText =
    'position:fixed;inset:0;background:radial-gradient(circle at 50% 45%, rgba(18,4,6,0.90) 0%, rgba(2,1,2,0.97) 75%);backdrop-filter:blur(7px);z-index:9700;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box';

  const provBtnCss =
    'margin:0;width:100%;padding:11px 14px;background:#090304;color:#d6c7b8;border:1px solid #3f1116;border-radius:2px;font-size:13.5px;letter-spacing:0.06em;font-family:Georgia,serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:border-color 0.16s, background 0.16s, color 0.16s';

  const secBtnCss =
    'flex:1;margin:0;padding:8px 6px;font-size:11.5px;letter-spacing:0.05em;background:#080203;color:#b8a89a;border:1px solid #320d12;border-radius:2px;font-family:Georgia,serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:border-color 0.16s, background 0.16s, color 0.16s';

  modal.innerHTML = `
    <div style="background:#050203;border:1px solid #4d1218;width:100%;max-width:390px;border-radius:2px;padding:26px 22px 22px;color:#cfc2b4;font-family:Georgia,serif;box-shadow:inset 0 0 42px rgba(0,0,0,0.96), 0 0 40px rgba(90,8,12,0.28);position:relative;box-sizing:border-box;overflow:hidden">

      <button id="sam_close" aria-label="Закрыть" style="position:absolute;top:12px;right:14px;background:transparent;border:0;color:#6e5656;font-size:18px;cursor:pointer;padding:4px 6px;line-height:1;transition:color 0.15s">✕</button>

      <div style="text-align:center;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid #2b0b0f">
        <div style="font-size:10px;letter-spacing:0.32em;color:#7e2026;font-family:monospace;margin-bottom:6px">ПРОТОКОЛ ДОСТУПА // 04</div>
        <h2 style="margin:0;font-size:19px;font-weight:normal;letter-spacing:0.22em;color:#dfd2c3">ИДЕНТИФИКАЦИЯ</h2>
        <div style="font-size:11.5px;color:#786662;margin-top:6px;font-style:italic">Оставь имя перед тем, как шагнуть в темноту.</div>
      </div>

      <div style="margin-bottom:16px">
        <label for="sam_nick" style="display:block;font-size:10.5px;letter-spacing:0.16em;color:#8a726c;font-family:monospace;margin-bottom:6px">ПОЗЫВНОЙ</label>
        <input id="sam_nick" value="${currentNick}" maxlength="10" placeholder="Имя" style="width:100%;box-sizing:border-box;background:#080304;border:1px solid #3c1015;color:#e6dacb;padding:10px 12px;font-size:14px;font-family:Georgia,serif;letter-spacing:0.06em;border-radius:2px;outline:none" />
      </div>

      <div style="margin-bottom:18px">
        <div style="font-size:10.5px;letter-spacing:0.16em;color:#8a726c;font-family:monospace;margin-bottom:6px">МЕТКА</div>
        <div id="sam_avatars" style="display:flex;gap:6px;justify-content:space-between">
          ${AVATAR_PRESETS.map((av, idx) => `
            <div data-emoji="${av.emoji}" data-bg="#14080a" class="sam-av-btn" title="${av.label}" style="flex:1;cursor:pointer;padding:7px 2px;text-align:center;border-radius:2px;background:${idx === 0 ? '#180608' : '#080304'};border:1px solid ${idx === 0 ? '#8c1d24' : '#2a0b0e'};filter:grayscale(0.35);transition:border-color 0.15s, background 0.15s">
              <div style="font-size:16px;line-height:1.1">${av.emoji}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="sam_status" style="display:none;font-size:11.5px;font-family:monospace;letter-spacing:0.08em;color:#b86b6b;margin-bottom:14px;text-align:center;padding:7px;background:#0c0405;border:1px solid #3c1014">
        УСТАНОВКА СВЯЗИ...
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px">
        <button id="sam_btn_google" class="sam-prov-btn" style="${provBtnCss}">
          <span style="display:flex;align-items:center;opacity:0.82">${SOCIAL_PROVIDERS.google.iconSvg}</span>
          <span>Войти через Google</span>
        </button>
        <button id="sam_btn_vk" class="sam-prov-btn" style="${provBtnCss}">
          <span style="display:flex;align-items:center;opacity:0.82">${SOCIAL_PROVIDERS.vk.iconSvg}</span>
          <span>Войти через VK ID</span>
        </button>
      </div>

      <div style="display:flex;gap:6px;justify-content:center">
        <button data-prov="telegram" class="sam-other-btn sam-prov-btn" style="${secBtnCss}">
          <span style="display:flex;align-items:center;opacity:0.75">${SOCIAL_PROVIDERS.telegram.iconSvg}</span>
          <span>Telegram</span>
        </button>
        <button data-prov="yandex" class="sam-other-btn sam-prov-btn" style="${secBtnCss}">
          <span style="display:flex;align-items:center;opacity:0.75">${SOCIAL_PROVIDERS.yandex.iconSvg}</span>
          <span>Яндекс</span>
        </button>
        <button data-prov="discord" class="sam-other-btn sam-prov-btn" style="${secBtnCss}">
          <span style="display:flex;align-items:center;opacity:0.75">${SOCIAL_PROVIDERS.discord.iconSvg}</span>
          <span>Discord</span>
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);
  openAnimatedModal(modal);

  modal.querySelectorAll('.sam-prov-btn').forEach((btn) => {
    btn.onmouseenter = () => {
      btn.style.borderColor = '#8f1b22';
      btn.style.background = '#130507';
      btn.style.color = '#f0e5d8';
    };
    btn.onmouseleave = () => {
      btn.style.borderColor = btn.classList.contains('sam-other-btn') ? '#320d12' : '#3f1116';
      btn.style.background = btn.classList.contains('sam-other-btn') ? '#080203' : '#090304';
      btn.style.color = btn.classList.contains('sam-other-btn') ? '#b8a89a' : '#d6c7b8';
    };
  });

  const nickInput = document.getElementById('sam_nick');
  if (nickInput) {
    nickInput.onfocus = () => { nickInput.style.borderColor = '#8c1d24'; };
    nickInput.onblur = () => { nickInput.style.borderColor = '#3c1015'; };
  }

  const avBtns = modal.querySelectorAll('.sam-av-btn');
  avBtns.forEach((btn) => {
    btn.onclick = () => {
      avBtns.forEach((b) => {
        b.style.borderColor = '#2a0b0e';
        b.style.background = '#080304';
      });
      btn.style.borderColor = '#8c1d24';
      btn.style.background = '#180608';
      selectedEmoji = btn.getAttribute('data-emoji') || '🔦';
      selectedBg = btn.getAttribute('data-bg') || '#14080a';
    };
  });

  const samClose = document.getElementById('sam_close');
  if (samClose) {
    samClose.onmouseenter = () => { samClose.style.color = '#cf5a5a'; };
    samClose.onmouseleave = () => { samClose.style.color = '#6e5656'; };
    samClose.onclick = () => closeAnimatedModal(modal);
  }
  modal.onclick = (e) => {
    if (e.target === modal) closeAnimatedModal(modal);
  };

  const statusEl = document.getElementById('sam_status');

  function executeLogin(providerId) {
    const prov = SOCIAL_PROVIDERS[providerId] || SOCIAL_PROVIDERS.google;
    const nick = (nickInput?.value?.trim() || prov.defaultNick).slice(0, 10);

    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.style.color = '#b86b6b';
      statusEl.textContent = `УСТАНОВКА СВЯЗИ (${prov.name.toUpperCase()})...`;
    }

    setTimeout(() => {
      if (statusEl) {
        statusEl.style.color = '#d9b5a6';
        statusEl.textContent = 'ДОСТУП ОТКРЫТ.';
      }

      const avatarSvg = getAvatarSvg(providerId, selectedEmoji, selectedBg);
      const authData = {
        provider: providerId,
        nick,
        avatar: avatarSvg,
        linked: [providerId],
        loggedAt: Date.now(),
        coinsRewardGiven: true,
      };

      setStoredSocialAuth(authData);

      try {
        localStorage.setItem(
          'horror_acc',
          JSON.stringify({
            nick,
            provider: providerId,
            token: 'mock_jwt_' + providerId + '_' + Date.now(),
          })
        );
      } catch (e) {}

      if (PF) {
        PF.name = nick;
        if (typeof pWrite === 'function') pWrite();
      }

      if (ac && TN) {
        try {
          TN(180, 0.25, 0.14, 'sine');
          setTimeout(() => TN(130, 0.35, 0.12, 'triangle'), 120);
        } catch (e) {}
      }

      try {
        unlockAchievement('social_butterfly', { PF, pWrite, ac, TN });
      } catch (e) {}

      setTimeout(() => {
        closeAnimatedModal(modal, {
          onDone: () => {
            if (typeof onLoginSuccess === 'function') {
              onLoginSuccess(authData);
            }
          },
        });
      }, 450);
    }, 520);
  }

  const googleBtn = document.getElementById('sam_btn_google');
  if (googleBtn) googleBtn.onclick = () => executeLogin('google');

  const vkBtn = document.getElementById('sam_btn_vk');
  if (vkBtn) vkBtn.onclick = () => executeLogin('vk');

  modal.querySelectorAll('.sam-other-btn').forEach((btn) => {
    btn.onclick = () => {
      const p = btn.getAttribute('data-prov');
      if (p) executeLogin(p);
    };
  });
}

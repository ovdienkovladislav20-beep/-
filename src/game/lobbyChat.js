/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { coop } from './coopManager.js';
import { renderAvatarBadgeHtml, renderDeveloperBadgeHtml, renderNameWithBorderHtml } from './avatarSystem.js';
import { showAnimatedPanel, hideAnimatedPanel } from './uiTransitions.js';

let isChatOpen = false;
let unreadCount = 0;
let messages = [];
let chatContainer = null;
let chatToggleBtn = null;
let soundCallback = null;
let lastLobbyVis = null;

export function initLobbyChat(options = {}) {
  soundCallback = options.playBlip;

  // Create UI if not already created
  if (document.getElementById('lobby_chat_root')) return;

  const root = document.createElement('div');
  root.id = 'lobby_chat_root';
  root.style.cssText = 'position:fixed;bottom:calc(16px + env(safe-area-inset-bottom, 0px));left:calc(16px + env(safe-area-inset-left, 0px));z-index:40;pointer-events:none;font-family:Georgia,serif';

  // Toggle button (visible when lobby is displayed)
  chatToggleBtn = document.createElement('button');
  chatToggleBtn.id = 'lobby_chat_toggle_btn';
  chatToggleBtn.style.cssText = 'pointer-events:auto;margin:0;padding:8px 14px;background:#16070a;border:1.5px solid #7f1d1d;color:#e7dec8;border-radius:4px;font-size:13px;font-weight:bold;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 0 16px rgba(127,29,29,0.45);transition:all 0.2s ease';
  chatToggleBtn.innerHTML = `
    <span>💬</span>
    <span>ЧАТ ЛОББИ</span>
    <span id="lobby_chat_badge" style="display:none;background:#991b1b;color:#fff;font-size:10px;padding:2px 6px;border-radius:3px;font-family:monospace">0</span>
  `;

  chatToggleBtn.onclick = () => {
    toggleLobbyChat();
  };

  // Main collapsible chat container
  chatContainer = document.createElement('div');
  chatContainer.id = 'lobby_chat_window';
  chatContainer.className = 'ui-chat-drawer';
  chatContainer.style.cssText = 'display:none;pointer-events:auto;width:320px;max-width:calc(100vw - 32px);height:360px;background:rgba(10,5,6,0.96);border:1.5px solid #7f1d1d;border-radius:6px;box-shadow:0 0 32px rgba(0,0,0,0.92),inset 0 0 24px rgba(0,0,0,0.8);backdrop-filter:blur(8px);flex-direction:column;overflow:hidden;margin-bottom:8px';

  chatContainer.innerHTML = `
    <div style="background:#1c080b;padding:10px 12px;border-bottom:1px solid #5c191e;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:16px">💬</span>
        <div>
          <div style="font-size:13px;font-weight:bold;color:#e7dec8;letter-spacing:0.06em">ГЛОБАЛЬНЫЙ ЧАТ</div>
          <div id="lobby_chat_online" style="font-size:10.5px;color:#b5a795">В сети: 1</div>
        </div>
      </div>
      <button id="lobby_chat_close_btn" style="background:transparent;border:0;color:#b5a795;font-size:16px;cursor:pointer;padding:4px">✕</button>
    </div>

    <div id="lobby_chat_msgs" style="flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;font-size:12px;scroll-behavior:smooth">
    </div>

    <div style="padding:8px 10px;border-top:1px solid #3d1418;background:#120608;display:flex;gap:6px">
      <input id="lobby_chat_input" maxlength="140" placeholder="Написать в чат..." style="flex:1;background:#080304;border:1px solid #5c191e;color:#e7dec8;border-radius:3px;padding:6px 10px;font-size:12px;outline:none" />
      <button id="lobby_chat_send_btn" style="margin:0;padding:6px 12px;background:#5c1118;border:1px solid #991b1b;color:#e7dec8;border-radius:3px;font-size:12px;cursor:pointer;font-weight:bold">
        ➤
      </button>
    </div>
  `;

  root.appendChild(chatContainer);
  root.appendChild(chatToggleBtn);
  document.body.appendChild(root);

  // Close button
  const closeBtn = chatContainer.querySelector('#lobby_chat_close_btn');
  if (closeBtn) {
    closeBtn.onclick = () => {
      setChatOpen(false);
    };
  }

  // Send message handler
  const sendBtn = chatContainer.querySelector('#lobby_chat_send_btn');
  const chatInput = chatContainer.querySelector('#lobby_chat_input');

  const doSend = () => {
    const text = (chatInput.value || '').trim();
    if (!text) return;
    chatInput.value = '';
    coop.sendChatMessage(text);
    if (soundCallback) soundCallback();
  };

  if (sendBtn) sendBtn.onclick = doSend;
  if (chatInput) {
    chatInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSend();
      }
    };
  }

  // Connect Coop listeners
  coop.onChatMessage((msg) => {
    addChatMessage(msg);
  });

  coop.onChatHistory((history) => {
    messages = [];
    const listEl = document.getElementById('lobby_chat_msgs');
    if (listEl) listEl.innerHTML = '';
    if (Array.isArray(history)) {
      history.forEach((m) => addChatMessage(m, false));
    }
  });

  coop.onRoomList((_, onlineCount) => {
    const onl = document.getElementById('lobby_chat_online');
    if (onl) onl.textContent = `В сети: ${onlineCount || 1}`;
  });

  // Default state: collapsed
  setChatOpen(false);
}

export function setChatOpen(open) {
  isChatOpen = open;
  if (chatContainer) {
    if (open) {
      showAnimatedPanel(chatContainer, 'flex', 'ui-chat-drawer');
    } else {
      hideAnimatedPanel(chatContainer, 'ui-chat-drawer');
    }
  }
  if (open) {
    unreadCount = 0;
    updateBadge();
    const input = document.getElementById('lobby_chat_input');
    if (input) input.focus();
    scrollChatToBottom();
  }
}

export function toggleLobbyChat() {
  setChatOpen(!isChatOpen);
}

export function updateLobbyChatVisibility(inLobby) {
  const vis = Boolean(inLobby);
  if (vis === lastLobbyVis) return;
  lastLobbyVis = vis;
  const root = document.getElementById('lobby_chat_root');
  if (root) {
    if (vis) {
      showAnimatedPanel(root, 'block', 'ui-lobby-ov');
    } else {
      hideAnimatedPanel(root, 'ui-lobby-ov');
    }
  }
}

function addChatMessage(msg, playSound = true) {
  if (!msg) return;
  messages.push(msg);
  if (messages.length > 80) messages.shift();

  if (!isChatOpen) {
    unreadCount++;
    updateBadge();
    if (playSound && soundCallback) {
      soundCallback();
    }
  }

  const listEl = document.getElementById('lobby_chat_msgs');
  if (!listEl) return;

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:flex-start;gap:8px;padding:4px 0;animation:fadeIn 0.2s ease';

  const timeStr = msg.time ? new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const avatarHtml = renderAvatarBadgeHtml(msg.avatar || 'survivor', msg.frame || 'frame_classic', 28, '', msg.avatarPhoto || '');
  const devHtml = msg.isDev ? renderDeveloperBadgeHtml(true) : '';
  const nameHtml = renderNameWithBorderHtml(msg.author || 'Игрок', msg.nameBorder || 'nb_none');

  row.innerHTML = `
    <div style="flex-shrink:0;margin-top:2px">
      ${avatarHtml}
    </div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2px">
        <div style="display:flex;flex-direction:column;align-items:flex-start;min-width:0">
          ${nameHtml}
          ${devHtml}
        </div>
        <span style="font-size:10px;color:#777;font-family:monospace">${timeStr}</span>
      </div>
      <div style="color:#eee;font-size:12px;word-break:break-word;line-height:1.35;background:rgba(255,255,255,0.04);padding:4px 8px;border-radius:4px;border-left:2px solid #8b202a">
        ${escapeHtml(msg.text || '')}
      </div>
    </div>
  `;

  listEl.appendChild(row);
  scrollChatToBottom();
}

function updateBadge() {
  const badge = document.getElementById('lobby_chat_badge');
  if (!badge) return;
  if (unreadCount > 0) {
    badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

function scrollChatToBottom() {
  const listEl = document.getElementById('lobby_chat_msgs');
  if (listEl) {
    setTimeout(() => {
      listEl.scrollTop = listEl.scrollHeight;
    }, 20);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

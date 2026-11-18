/**
 * Social Authentication Module for "НЕ ОБОРАЧИВАЙСЯ" (3D Horror)
 * Supports VK ID, Telegram, Google, Yandex ID, Discord, GitHub
 */

export const SOCIAL_PROVIDERS = {
  vk: {
    id: 'vk',
    name: 'VK ID',
    fullName: 'ВКонтакте (VK ID)',
    color: '#0077FF',
    hoverColor: '#0066DD',
    textColor: '#FFFFFF',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07 2H8.93C4.16 2 2 4.16 2 8.93v6.14C2 19.84 4.16 22 8.93 22h6.14c4.77 0 6.93-2.16 6.93-6.93V8.93C22 4.16 19.84 2 15.07 2zm3.39 13.91c-.56.62-1.28.93-2.15.93h-.72c-.22 0-.44-.06-.6-.18a1.1 1.1 0 0 1-.36-.45s-.35-.74-.78-1.5c-.34-.6-.62-.97-.83-1.1-.15-.09-.28-.14-.4-.14h-.35v2.54c0 .49-.24.73-.72.73h-1.2c-.89 0-1.74-.4-2.54-1.2-1.13-1.14-2.13-2.47-3-3.98-.36-.63-.38-1.01-.06-1.15.22-.1.52-.15.9-.15h1.4c.33 0 .58.11.75.33.17.22.3.52.4.9.44 1.48.96 2.65 1.57 3.51.15.22.28.33.4.33.09 0 .15-.04.18-.11.05-.11.08-.39.08-.83v-2.82c-.06-.71-.34-1.12-.84-1.22-.17-.03-.13-.19.12-.34.33-.2.85-.3 1.57-.3.72 0 1.25.14 1.59.42.34.28.51.7.51 1.27v2.24c0 .32.06.55.18.69.08.09.18.14.3.14.15 0 .32-.08.51-.24.58-.51 1.12-1.34 1.62-2.49.12-.27.27-.47.45-.6.18-.13.43-.2.75-.2h1.45c.42 0 .69.11.81.33.12.22.08.5-.12.84-.5 1.05-1.1 1.95-1.8 2.7-.42.45-.48.69-.18 1.05.3.36.78.89 1.44 1.59.39.42.61.76.66 1.02.05.26-.06.49-.33.69z"/></svg>`,
    badgeText: 'VK',
    placeholder: 'id или имя страницы',
    defaultNick: 'Игрок_VK',
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    fullName: 'Telegram WebApp',
    color: '#24A1DE',
    hoverColor: '#1E8FCA',
    textColor: '#FFFFFF',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/></svg>`,
    badgeText: 'TG',
    placeholder: '@username или номер',
    defaultNick: 'Игрок_TG',
  },
  google: {
    id: 'google',
    name: 'Google',
    fullName: 'Google Аккаунт',
    color: '#EA4335',
    hoverColor: '#D33828',
    textColor: '#FFFFFF',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/></svg>`,
    badgeText: 'G',
    placeholder: 'user@gmail.com',
    defaultNick: 'Игрок_Google',
  },
  yandex: {
    id: 'yandex',
    name: 'Яндекс ID',
    fullName: 'Яндекс ID',
    color: '#FC3F1D',
    hoverColor: '#E02E0E',
    textColor: '#FFFFFF',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="#FC3F1D"/><path d="M13.8 6.5h-1.6c-2.4 0-3.7 1.3-3.7 3.3 0 1.6.8 2.6 2.3 3.6l-2.6 4.1h1.9l2.4-3.8h.4v3.8h1.9V6.5zm-.9 5.5h-.7c-1.2 0-1.8-.6-1.8-1.7 0-1.1.7-1.8 1.9-1.8h.6v3.5z" fill="#FFF"/></svg>`,
    badgeText: 'Я',
    placeholder: 'login@yandex.ru',
    defaultNick: 'Игрок_Яндекс',
  },
  discord: {
    id: 'discord',
    name: 'Discord',
    fullName: 'Discord',
    color: '#5865F2',
    hoverColor: '#4752C4',
    textColor: '#FFFFFF',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
    badgeText: 'DC',
    placeholder: 'username#0000',
    defaultNick: 'Геймер_DC',
  },
  github: {
    id: 'github',
    name: 'GitHub',
    fullName: 'GitHub Profile',
    color: '#24292E',
    hoverColor: '#1B1F23',
    textColor: '#FFFFFF',
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
    badgeText: 'GH',
    placeholder: 'github_handle',
    defaultNick: 'Кодер_GH',
  },
};

/**
 * Avatar options for social login customizer
 */
export const AVATAR_PRESETS = [
  { id: 'survivor', label: 'Выживший', bg: '#2b3b4a', emoji: '🔦' },
  { id: 'stalker', label: 'Следопыт', bg: '#4a2828', emoji: '👁️' },
  { id: 'ghost', label: 'Призрак', bg: '#1f3b30', emoji: '💀' },
  { id: 'radio', label: 'Связной', bg: '#3e2e50', emoji: '📡' },
  { id: 'hunter', label: 'Охотник', bg: '#44351a', emoji: '🩸' },
];

/**
 * Get stored social auth state
 */
export function getStoredSocialAuth() {
  try {
    const raw = localStorage.getItem('horror_social_auth');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read social auth', e);
  }
  return null;
}

/**
 * Save social auth state
 */
export function setStoredSocialAuth(data) {
  try {
    localStorage.setItem('horror_social_auth', JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save social auth', e);
  }
}

/**
 * Generates an SVG avatar data-uri or styled element
 */
export function getAvatarSvg(providerId, emoji = '🔦', bg = '#222') {
  const p = SOCIAL_PROVIDERS[providerId] || SOCIAL_PROVIDERS.vk;
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="${encodeURIComponent(bg)}"/><text x="32" y="38" font-size="28" text-anchor="middle" dominant-baseline="middle">${emoji}</text><circle cx="50" cy="50" r="12" fill="${encodeURIComponent(p.color)}"/><text x="50" y="54" font-size="10" font-family="sans-serif" font-weight="bold" fill="#fff" text-anchor="middle">${p.badgeText}</text></svg>`;
}

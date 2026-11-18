/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { CORE_TR } from './i18nDataCore.js';
import { MODULE_TR, PH_MAP } from './i18nDataModules.js';

export const SUPPORTED_LANGS = ['ru', 'en', 'uk', 'de', 'ja'];
export const LANG_INDEX = { ru: 0, en: 1, uk: 2, de: 3, ja: 4 };
export const LOCALE_MAP = {
  ru: 'ru-RU',
  en: 'en-US',
  uk: 'uk-UA',
  de: 'de-DE',
  ja: 'ja-JP',
};

const CYR = /[\u0400-\u04FF]/;
const ENTRY_MAP = new Map();
for (const row of [...CORE_TR, ...MODULE_TR]) {
  if (row && row[0] && !ENTRY_MAP.has(row[0])) {
    ENTRY_MAP.set(row[0], row);
  }
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const SORTED_KEYS = [...ENTRY_MAP.keys()].sort((a, b) => b.length - a.length);
const MASTER_RE = SORTED_KEYS.length ? new RegExp(SORTED_KEYS.map(escapeRe).join('|'), 'g') : null;

const TRC = new Map();
let _langGetter = () => 'ru';

export function setLangGetter(fn) {
  if (typeof fn === 'function') _langGetter = fn;
}

export function getLang() {
  try {
    const l = _langGetter();
    return LANG_INDEX[l] !== undefined ? l : 'ru';
  } catch (e) {
    return 'ru';
  }
}

export function getLocale(lang = getLang()) {
  return LOCALE_MAP[lang] || 'ru-RU';
}

export function clearTrCache() {
  TRC.clear();
}

export function tr(s, lang = getLang()) {
  const idx = LANG_INDEX[lang];
  if (!idx || typeof s !== 'string' || !CYR.test(s) || !MASTER_RE) return s;

  const cacheKey = lang + '|' + s;
  const cached = TRC.get(cacheKey);
  if (cached !== undefined) return cached;

  let v = s.replace(MASTER_RE, (m) => {
    const row = ENTRY_MAP.get(m);
    return (row && row[idx]) || m;
  });

  if (CYR.test(v) && /[\r\n]|\s{2,}/.test(s)) {
    const lead = /^\s*/.exec(s)[0];
    const trail = /\s*$/.exec(s)[0];
    const norm = s.replace(/\s+/g, ' ').trim();
    const nv = norm.replace(MASTER_RE, (m) => {
      const row = ENTRY_MAP.get(m);
      return (row && row[idx]) || m;
    });
    if (nv !== norm) {
      v = (lead ? ' ' : '') + nv + (trail ? ' ' : '');
    }
  }

  if (TRC.size > 4000) TRC.clear();
  TRC.set(cacheKey, v);
  return v;
}

export function trNode(n) {
  if (!n || n.nodeType !== 3) return;
  const v = n.nodeValue;
  if (n.__o === undefined || (v !== n.__t && v !== n.__o)) {
    n.__o = v;
  }
  const d = tr(n.__o);
  if (v !== d) {
    n.__t = d;
    n.nodeValue = d;
  } else {
    n.__t = v;
  }
}

export function trTree(r) {
  if (!r) return;
  if (r.nodeType === 3) {
    trNode(r);
    return;
  }
  if (r.nodeType !== 1) return;

  const lang = getLang();
  const idx = LANG_INDEX[lang] || 0;

  const w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) trNode(n);

  const ph = [...r.querySelectorAll('[placeholder]')];
  if (r.hasAttribute && r.hasAttribute('placeholder')) ph.push(r);
  for (const el of ph) {
    if (el.__p === undefined) el.__p = el.getAttribute('placeholder');
    const orig = el.__p;
    if (!orig) continue;
    let next = orig;
    if (idx > 0) {
      const m = PH_MAP[orig];
      next = m && m[idx - 1] ? m[idx - 1] : tr(orig, lang);
    }
    if (el.getAttribute('placeholder') !== next) {
      el.setAttribute('placeholder', next);
    }
  }

  const ti = [...r.querySelectorAll('[title]')];
  if (r.hasAttribute && r.hasAttribute('title')) ti.push(r);
  for (const el of ti) {
    if (el.__ti === undefined) el.__ti = el.getAttribute('title');
    const orig = el.__ti;
    if (!orig) continue;
    const next = idx === 0 ? orig : tr(orig, lang);
    if (el.getAttribute('title') !== next) {
      el.setAttribute('title', next);
    }
  }
}

if (typeof window !== 'undefined') {
  window.__tr = tr;
  window.__trTree = trTree;
}

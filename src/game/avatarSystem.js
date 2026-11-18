/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Avatar & Frame Customization System for "НЕ ОБОРАЧИВАЙСЯ"
 * Enables players to choose custom avatars and animated border frames visible in Co-op mode.
 */

import { calculateLevel } from './xpSystem.js';
import { openAnimatedModal, closeAnimatedModal, disposeAnimatedModal } from './uiTransitions.js';

function ensureAvatarFrameStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('avatar_frame_anim_css')) return;
  const st = document.createElement('style');
  st.id = 'avatar_frame_anim_css';
  st.textContent = `
    @keyframes frPulse {
      0%, 100% { filter: drop-shadow(0 0 4px rgba(255,42,58,0.55)); }
      50% { filter: drop-shadow(0 0 11px rgba(255,80,95,0.95)); }
    }
    @keyframes frInferno {
      0%, 100% { filter: drop-shadow(0 0 5px rgba(255,95,30,0.65)); }
      50% { filter: drop-shadow(0 0 13px rgba(255,200,55,0.95)); }
    }
    @keyframes frGlitch {
      0%, 92%, 100% { filter: drop-shadow(0 0 5px rgba(34,211,238,0.65)); transform: translate(0,0); }
      94% { filter: drop-shadow(-2px 0 8px rgba(244,63,94,0.9)); transform: translate(1px,-0.5px); }
      97% { filter: drop-shadow(2px 0 8px rgba(34,211,238,0.95)); transform: translate(-1px,0.5px); }
    }
    @keyframes frPrism {
      0% { filter: hue-rotate(0deg) drop-shadow(0 0 8px rgba(250,204,21,0.8)); }
      50% { filter: hue-rotate(180deg) drop-shadow(0 0 12px rgba(56,189,248,0.9)); }
      100% { filter: hue-rotate(360deg) drop-shadow(0 0 8px rgba(250,204,21,0.8)); }
    }
    .fr-pulse { animation: frPulse 2.2s ease-in-out infinite; }
    .fr-inferno { animation: frInferno 1.8s ease-in-out infinite; }
    .fr-glitch { animation: frGlitch 3.2s steps(2, end) infinite; }
    .fr-prism { animation: frPrism 5s linear infinite; }
  `;
  document.head.appendChild(st);
}

export const NAME_BORDERS = [
  { id: 'none', name: 'Без обводки', lvl: 1, color: '#e2e8f0', style: '', desc: 'Классическое отображение имени без дополнительной рамки' },
  { id: 'crimson_pulse', name: 'Алый Штрих', lvl: 2, color: '#fb7185', style: 'border:1px solid #e11d48;background:rgba(127,29,29,0.28);box-shadow:0 0 8px rgba(225,29,72,0.45);padding:1px 7px;border-radius:4px', desc: 'Тёмно-красная обводка выжившего' },
  { id: 'emerald_matrix', name: 'Изумрудный Код', lvl: 5, color: '#4ade80', style: 'border:1px solid #22c55e;background:rgba(20,83,45,0.28);box-shadow:0 0 8px rgba(34,197,94,0.4);padding:1px 7px;border-radius:4px', desc: 'Матричное неоново-зелёное свечение' },
  { id: 'cyan_neon', name: 'Ледяной Неон', lvl: 10, color: '#38bdf8', style: 'border:1px solid #38bdf8;background:rgba(12,74,110,0.32);box-shadow:0 0 10px rgba(56,189,248,0.5);padding:1px 7px;border-radius:4px', desc: 'Холодная голубая окантовка ночного неона' },
  { id: 'frost_glow', name: 'Морозный Иней', lvl: 15, xmasUnlockKey: 'xmasEscaped', color: '#bae6fd', style: 'border:1px solid #7dd3fc;background:linear-gradient(90deg,rgba(14,116,144,0.35),rgba(30,58,138,0.35));box-shadow:0 0 12px rgba(125,211,252,0.6);padding:1px 7px;border-radius:5px', desc: 'Зимняя ледяная обводка с морозным блеском' },
  { id: 'xmas_gold', name: 'Новогоднее Золото', lvl: 20, xmasUnlockKey: 'xmasEscaped', color: '#fde047', style: 'border:1px solid #facc15;background:linear-gradient(90deg,rgba(127,29,29,0.55),rgba(133,77,14,0.45));box-shadow:0 0 12px rgba(250,204,21,0.55);padding:1px 8px;border-radius:5px', desc: 'Праздничная багряно-золотая табличка имени' },
  { id: 'candy_crimson', name: 'Гирлянда Сочельника', lvl: 28, color: '#fecaca', style: 'border:1px dashed #ef4444;background:rgba(153,27,27,0.35);box-shadow:0 0 10px rgba(248,113,113,0.5);padding:1px 7px;border-radius:5px', desc: 'Праздничная пунктирная лента' },
  { id: 'gold_aura', name: 'Золото Мастера', lvl: 35, color: '#ffd700', style: 'border:1.5px solid #ffd700;background:rgba(113,63,18,0.4);box-shadow:0 0 14px rgba(255,215,0,0.65);padding:1px 8px;border-radius:5px', desc: 'Бронзово-золотая оправа 35-го уровня' },
  { id: 'obsidian_fire', name: 'Пламя Кошмара', lvl: 42, color: '#fdba74', style: 'border:1.5px solid #f97316;background:linear-gradient(90deg,rgba(69,10,10,0.65),rgba(124,45,18,0.45));box-shadow:0 0 14px rgba(249,115,22,0.65);padding:1px 8px;border-radius:5px', desc: 'Раскалённая кайма 42-го уровня' },
  { id: 'aurora_50', name: 'Сияние Вечности 50', lvl: 50, color: '#fef08a', style: 'border:1.5px solid #fde047;background:linear-gradient(90deg,rgba(88,28,135,0.45),rgba(14,116,144,0.45),rgba(153,27,27,0.45));box-shadow:0 0 16px rgba(253,224,71,0.8);padding:1px 9px;border-radius:6px', desc: 'Переливчатый венец имени 50-го уровня' },
];

export const AVATAR_LIST = [
  {
    id: 'survivor',
    name: 'Выживший',
    emoji: '🔦',
    bg: '#1b2838',
    lvl: 1,
    rarity: 'Обычный',
    rarityColor: '#95a5a6',
    desc: 'Фонарик во тьме. Тот, кто всегда ищет выход из кошмара.',
  },
  {
    id: 'stalker',
    name: 'Следопыт',
    emoji: '👁️',
    bg: '#331a1a',
    lvl: 1,
    rarity: 'Обычный',
    rarityColor: '#95a5a6',
    desc: 'Всевидящее око. Замечает монстра до того, как тот сделает шаг.',
  },
  {
    id: 'skull',
    name: 'Череп Склепа',
    emoji: '💀',
    bg: '#252129',
    lvl: 1,
    rarity: 'Обычный',
    rarityColor: '#95a5a6',
    desc: 'Останки павших в лабиринте узников. Символ неотвратимости.',
  },
  {
    id: 'mechanic_g4',
    name: 'Автомеханик',
    emoji: '🔧',
    bg: '#2a1c12',
    lvl: 1,
    rarity: 'Обычный',
    rarityColor: '#95a5a6',
    desc: 'Мастер гаражного кооператива. Знает каждый болт старых Жигулей.',
  },
  {
    id: 'radio',
    name: 'Связной',
    emoji: '📡',
    bg: '#152c38',
    lvl: 2,
    rarity: 'Редкий',
    rarityColor: '#3498db',
    desc: 'Голос на частоте шипящих помех. Координирует группу в темноте.',
  },
  {
    id: 'niva_driver',
    name: 'Ночной Водитель',
    emoji: '🚗',
    bg: '#1c2a24',
    lvl: 2,
    rarity: 'Редкий',
    rarityColor: '#3498db',
    desc: 'Не сбавляет ход даже на разбитой просёлочной дороге в ливень.',
  },
  {
    id: 'plague',
    name: 'Чумной Доктор',
    emoji: '🎭',
    bg: '#2d1b38',
    lvl: 3,
    rarity: 'Редкий',
    rarityColor: '#3498db',
    desc: 'Клювовидная маска средних веков, спасающая от запаха тлена.',
  },
  {
    id: 'maze_shadow',
    name: 'Тень Лабиринта',
    emoji: '🗝️',
    bg: '#1f2937',
    lvl: 3,
    rarity: 'Редкий',
    rarityColor: '#3498db',
    desc: 'Знает наизусть, под какой половицей звякнул заветный ключ.',
  },
  {
    id: 'candle',
    name: 'Свеча Памяти',
    emoji: '🕯️',
    bg: '#3d2c18',
    lvl: 4,
    rarity: 'Редкий',
    rarityColor: '#3498db',
    desc: 'Тлеющий фитиль склепа, разгоняющий первобытный мрак коридоров.',
  },
  {
    id: 'ghost',
    name: 'Призрак Особняка',
    emoji: '👻',
    bg: '#153328',
    lvl: 5,
    rarity: 'Мистический',
    rarityColor: '#d97706',
    desc: 'Бесплотный скиталец, знающий расположение потайных комнат.',
  },
  {
    id: 'blood',
    name: 'Кровавый След',
    emoji: '🩸',
    bg: '#401218',
    lvl: 6,
    rarity: 'Мистический',
    rarityColor: '#d97706',
    desc: 'Запах свежей охоты и железный привкус смертельного ужаса.',
  },
  {
    id: 'gravedigger',
    name: 'Могильщик',
    emoji: '⛏️',
    bg: '#1b2b1e',
    lvl: 6,
    rarity: 'Мистический',
    rarityColor: '#d97706',
    desc: 'Сторож старого кладбища, открывающий ржавые ворота в полночь.',
  },
  {
    id: 'spider',
    name: 'Ловец Теней',
    emoji: '🕷️',
    bg: '#211c2b',
    lvl: 7,
    rarity: 'Мистический',
    rarityColor: '#d97706',
    desc: 'Бесшумный охотник вентиляционных шахт и тёмных углов.',
  },
  {
    id: 'reaper',
    name: 'Жнец Кладбища',
    emoji: '⚰️',
    bg: '#330f1e',
    lvl: 8,
    rarity: 'Легендарный',
    rarityColor: '#e74c3c',
    desc: 'Хранитель надгробий третьей главы и ключник железных ворот.',
  },
  {
    id: 'demon',
    name: 'Демон Ночи',
    emoji: '😈',
    bg: '#450d18',
    lvl: 9,
    rarity: 'Легендарный',
    rarityColor: '#e74c3c',
    desc: 'Сущность, подчинившая тень особняка своей воле.',
  },
  {
    id: 'master',
    name: 'Повелитель Бездны',
    emoji: '👑',
    bg: '#382a08',
    lvl: 10,
    rarity: 'Древний',
    rarityColor: '#f1c40f',
    desc: 'Истинный владыка лабиринта. Награда за достижение 10 уровня.',
  },
  {
    id: 'night_guard',
    name: 'Ночной Сторож',
    emoji: '🛡️',
    bg: '#182433',
    lvl: 12,
    rarity: 'Эпический',
    rarityColor: '#c2410c',
    desc: 'Охранник подвала, переживший не одну смену с севшим фонарём.',
  },
  {
    id: 'lab_subject',
    name: 'Объект-14',
    emoji: '☣️',
    bg: '#18321b',
    lvl: 14,
    rarity: 'Эпический',
    rarityColor: '#c2410c',
    desc: 'Узник закрытого сектора с секретным кодом на запястье.',
  },
  {
    id: 'street_racer',
    name: 'Гонщик Трассы',
    emoji: '🏁',
    bg: '#2c1f0f',
    lvl: 16,
    rarity: 'Эпический',
    rarityColor: '#c2410c',
    desc: 'Прорвался сквозь ворота гаража №4 прямо на затяжном подъёме.',
  },
  {
    id: 'phantom_hound',
    name: 'Гончая Мрака',
    emoji: '🐺',
    bg: '#23172b',
    lvl: 19,
    rarity: 'Легендарный',
    rarityColor: '#e74c3c',
    desc: 'Безошибочно чует дыхание преследователя за спиной.',
  },
  {
    id: 'cursed_priest',
    name: 'Хранитель Часовни',
    emoji: '⛪',
    bg: '#2a2216',
    lvl: 22,
    rarity: 'Легендарный',
    rarityColor: '#e74c3c',
    desc: 'Последний свидетель осеннего звона над заброшенным погостом.',
  },
  {
    id: 'hotel_guest',
    name: 'Гость Отеля',
    emoji: '🏨',
    bg: '#24141d',
    lvl: 25,
    rarity: 'Мифический',
    rarityColor: '#f97316',
    desc: 'Добрался до огней далёкого отеля на шоссе после трёх часов пути.',
  },
  {
    id: 'void_warden',
    name: 'Страж Кошмара',
    emoji: '🐉',
    bg: '#141e30',
    lvl: 30,
    rarity: 'Мифический',
    rarityColor: '#f97316',
    desc: 'Тот, перед кем расступаются все запертые двери кошмара.',
  },
  {
    id: 'immortal_35',
    name: 'Хранитель Зимы',
    emoji: '❄️',
    bg: '#142a42',
    lvl: 35,
    rarity: 'Вечный',
    rarityColor: '#fde047',
    desc: 'Страж тридцать пятой ступени кошмара — холодный ум и сталь.',
  },
  {
    id: 'frost_guardian',
    name: 'Ледяной Страж',
    emoji: '🧊',
    bg: '#0c2338',
    lvl: 36,
    rarity: 'Зимний',
    rarityColor: '#38bdf8',
    desc: 'Пережил завывание метели за окнами заснеженного дома.',
  },
  {
    id: 'santa_skull',
    name: 'Санта Мрака',
    emoji: '🎅',
    bg: '#400b14',
    lvl: 38,
    xmasUnlockKey: 'xmasEscaped',
    rarity: 'Новогодний',
    rarityColor: '#fbbf24',
    desc: 'Тёмный облик зимнего праздника из Главы 5.',
  },
  {
    id: 'xmas_tree_av',
    name: 'Ёлочный Огонёк',
    emoji: '🎄',
    bg: '#0f2b1a',
    lvl: 41,
    rarity: 'Новогодний',
    rarityColor: '#34d399',
    desc: 'Мерцающие огни гирлянды посреди полной темноты.',
  },
  {
    id: 'snow_demon',
    name: 'Дух Вьюги',
    emoji: '☃️',
    bg: '#16283d',
    lvl: 45,
    rarity: 'Мифический',
    rarityColor: '#7dd3fc',
    desc: 'Безмолвный наблюдатель на заснеженной тропе.',
  },
  {
    id: 'legend_50',
    name: 'Абсолют 50',
    emoji: '🔱',
    bg: '#3b2406',
    lvl: 50,
    rarity: 'Вечный',
    rarityColor: '#fde047',
    desc: 'Высший ранг мастера игры — 50 уровень без единого шага назад.',
  },
];

export const FRAME_LIST = [
  {
    id: 'frame_classic',
    name: 'Стальной Обод',
    lvl: 1,
    desc: 'Классическая матовая стальная рамка исследователя лабиринта.',
    color: '#888888',
    border: '2px solid #555555',
    boxShadow: '0 0 6px rgba(0,0,0,0.8)',
    rarity: 'Обычная',
    rarityColor: '#95a5a6',
    style: 'border:2px solid #666;box-shadow:0 0 6px #000',
  },
  {
    id: 'frame_rust',
    name: 'Ржавая Шестерня',
    lvl: 1,
    desc: 'Потёртая железная оправа из заброшенного бокса гаражей.',
    color: '#d97706',
    border: '2px solid #b45309',
    boxShadow: '0 0 10px rgba(180,83,9,0.55)',
    rarity: 'Обычная',
    rarityColor: '#95a5a6',
    style: 'border:2px solid #b45309;box-shadow:0 0 10px rgba(180,83,9,0.55)',
  },
  {
    id: 'frame_blood',
    name: 'Кровавый Пульс',
    lvl: 2,
    desc: 'Зловещая алая рамка с пульсирующим свечением запекшейся крови.',
    color: '#ff2a3a',
    border: '2px solid #ff2a3a',
    boxShadow: '0 0 14px rgba(255, 42, 58, 0.75)',
    rarity: 'Редкая',
    rarityColor: '#3498db',
    style: 'border:2px solid #ff2a3a;box-shadow:0 0 14px rgba(255,42,58,0.75)',
    pulse: true,
    animClass: 'fr-pulse',
  },
  {
    id: 'frame_neon',
    name: 'Неоновый Сигнал',
    lvl: 3,
    desc: 'Высокотехнологичный кибер-барьер с ярким бирюзовым импульсом.',
    color: '#00f0ff',
    border: '2px solid #00f0ff',
    boxShadow: '0 0 16px rgba(0, 240, 255, 0.7)',
    rarity: 'Редкая',
    rarityColor: '#3498db',
    style: 'border:2px solid #00f0ff;box-shadow:0 0 16px rgba(0,240,255,0.7)',
  },
  {
    id: 'frame_toxic',
    name: 'Токсичный Био-Шок',
    lvl: 4,
    desc: 'Ядовито-зеленое радиоактивное сияние биологического заражения.',
    color: '#2ed573',
    border: '2px solid #2ed573',
    boxShadow: '0 0 16px rgba(46, 213, 115, 0.75)',
    rarity: 'Редкая',
    rarityColor: '#3498db',
    style: 'border:2px solid #2ed573;box-shadow:0 0 16px rgba(46,213,115,0.75)',
  },
  {
    id: 'frame_void',
    name: 'Астральная Бездна',
    lvl: 5,
    desc: 'Зловещее багрово-рубиновое поле призраков потустороннего мира.',
    color: '#e11d48',
    border: '2px solid #be123c',
    boxShadow: '0 0 16px rgba(190, 18, 60, 0.8)',
    rarity: 'Мистическая',
    rarityColor: '#d97706',
    style: 'border:2px solid #be123c;box-shadow:0 0 16px rgba(190,18,60,0.8)',
  },
  {
    id: 'frame_emerald',
    name: 'Изумрудный Туман',
    lvl: 6,
    desc: 'Призрачное изумрудное кольцо кладбищенских фонарей.',
    color: '#10b981',
    border: '2px double #34d399',
    boxShadow: '0 0 16px rgba(16,185,129,0.75)',
    rarity: 'Мистическая',
    rarityColor: '#d97706',
    style: 'border:2px double #34d399;box-shadow:0 0 16px rgba(16,185,129,0.75)',
  },
  {
    id: 'frame_inferno',
    name: 'Огненный Ад',
    lvl: 7,
    desc: 'Раскаленный пылающий огонь с непрерывными вспышками жара.',
    color: '#ff5722',
    border: '2px dashed #ff7043',
    boxShadow: '0 0 18px rgba(255, 87, 34, 0.85)',
    rarity: 'Мистическая',
    rarityColor: '#d97706',
    style: 'border:2px dashed #ff7043;box-shadow:0 0 18px rgba(255,87,34,0.85)',
    animClass: 'fr-inferno',
  },
  {
    id: 'frame_ice',
    name: 'Ледяной Склеп',
    lvl: 8,
    desc: 'Морозный кристаллический иней вечной зимы заброшенных залов.',
    color: '#70d6ff',
    border: '2px solid #70d6ff',
    boxShadow: '0 0 16px rgba(112, 214, 255, 0.8)',
    rarity: 'Легендарная',
    rarityColor: '#e74c3c',
    style: 'border:2px solid #70d6ff;box-shadow:0 0 16px rgba(112,214,255,0.8)',
  },
  {
    id: 'frame_gold',
    name: 'Золото Триумфатора',
    lvl: 10,
    desc: 'Величественная корона из чистого сияющего золота непобедимых.',
    color: '#ffd700',
    border: '2px solid #ffd700',
    boxShadow: '0 0 22px rgba(255, 215, 0, 0.9), inset 0 0 10px rgba(255, 215, 0, 0.5)',
    rarity: 'Древняя',
    rarityColor: '#f1c40f',
    style: 'border:2px solid #ffd700;box-shadow:0 0 22px rgba(255,215,0,0.9), inset 0 0 10px rgba(255,215,0,0.5)',
  },
  {
    id: 'frame_autumn',
    name: 'Осенний Погост',
    lvl: 12,
    desc: 'Янтарное золото осенней листвы старого кладбища.',
    color: '#f59e0b',
    border: '3px double #f59e0b',
    boxShadow: '0 0 18px rgba(245,158,11,0.8)',
    rarity: 'Эпическая',
    rarityColor: '#c2410c',
    style: 'border:3px double #f59e0b;box-shadow:0 0 18px rgba(245,158,11,0.8)',
  },
  {
    id: 'frame_glitch',
    name: 'Сбой Камеры',
    lvl: 15,
    desc: 'Мерцающий цифровой контур взломанной камеры наблюдения.',
    color: '#22d3ee',
    border: '2px dashed #22d3ee',
    boxShadow: '0 0 18px rgba(34,211,238,0.85)',
    rarity: 'Эпическая',
    rarityColor: '#c2410c',
    style: 'border:2px dashed #22d3ee;box-shadow:0 0 18px rgba(34,211,238,0.85)',
    animClass: 'fr-glitch',
  },
  {
    id: 'frame_crimson_king',
    name: 'Багровая Печать',
    lvl: 18,
    desc: 'Двойная рубиновая обводка для охотников и беглецов со стажем.',
    color: '#fb7185',
    border: '3px double #e11d48',
    boxShadow: '0 0 20px rgba(225,29,72,0.9)',
    rarity: 'Легендарная',
    rarityColor: '#e74c3c',
    style: 'border:3px double #e11d48;box-shadow:0 0 20px rgba(225,29,72,0.9)',
    animClass: 'fr-pulse',
  },
  {
    id: 'frame_headlight',
    name: 'Ксенон Дальнего Света',
    lvl: 21,
    desc: 'Ослепительный бело-голубой ореол ночных фар на пустой трассе.',
    color: '#bae6fd',
    border: '3px solid #e0f2fe',
    boxShadow: '0 0 22px rgba(186,230,253,0.95)',
    rarity: 'Легендарная',
    rarityColor: '#e74c3c',
    style: 'border:3px solid #e0f2fe;box-shadow:0 0 22px rgba(186,230,253,0.95)',
  },
  {
    id: 'frame_ghost_mist',
    name: 'Призрачный Шёпот',
    lvl: 24,
    desc: 'Прозрачное туманное сияние древних подсказок из тьмы.',
    color: '#c4b5fd',
    border: '2px dotted #ddd6fe',
    boxShadow: '0 0 20px rgba(167,139,250,0.85)',
    rarity: 'Мифическая',
    rarityColor: '#f97316',
    style: 'border:2px dotted #ddd6fe;box-shadow:0 0 20px rgba(167,139,250,0.85)',
    animClass: 'fr-pulse',
  },
  {
    id: 'frame_hotel_neon',
    name: 'Неон Отеля',
    lvl: 28,
    desc: 'Тёплая винтажная вывеска спасительного придорожного мотеля.',
    color: '#fb923c',
    border: '3px solid #f97316',
    boxShadow: '0 0 24px rgba(249,115,22,0.9), inset 0 0 8px rgba(254,215,170,0.6)',
    rarity: 'Мифическая',
    rarityColor: '#f97316',
    style: 'border:3px solid #f97316;box-shadow:0 0 24px rgba(249,115,22,0.9), inset 0 0 8px rgba(254,215,170,0.6)',
    animClass: 'fr-inferno',
  },
  {
    id: 'frame_abyss_crown',
    name: 'Властелин Кошмара',
    lvl: 32,
    desc: 'Кроваво-рубиновый ореол тех, кто прошёл все четыре главы.',
    color: '#f43f5e',
    border: '3px double #be123c',
    boxShadow: '0 0 26px rgba(190,18,60,0.95)',
    rarity: 'Древняя',
    rarityColor: '#f1c40f',
    style: 'border:3px double #be123c;box-shadow:0 0 26px rgba(190,18,60,0.95)',
    animClass: 'fr-glitch',
  },
  {
    id: 'frame_eternal_35',
    name: 'Призма Вечности',
    lvl: 35,
    desc: 'Переливающийся вечный венец за достижение 35 уровня.',
    color: '#fde047',
    border: '3px solid #fde047',
    boxShadow: '0 0 28px rgba(253,224,71,0.95), inset 0 0 12px rgba(255,255,255,0.55)',
    rarity: 'Вечная',
    rarityColor: '#fde047',
    style: 'border:3px solid #fde047;box-shadow:0 0 28px rgba(253,224,71,0.95), inset 0 0 12px rgba(255,255,255,0.55)',
    animClass: 'fr-prism',
  },
  {
    id: 'frame_frost_crystal',
    name: 'Хрустальный Иней',
    lvl: 40,
    desc: 'Ледяная оправа 40-го уровня с искрящейся стужей.',
    color: '#7dd3fc',
    border: '3px double #bae6fd',
    boxShadow: '0 0 24px rgba(56,189,248,0.9), inset 0 0 10px rgba(224,242,254,0.4)',
    rarity: 'Зимняя',
    rarityColor: '#38bdf8',
    style: 'border:3px double #bae6fd;box-shadow:0 0 24px rgba(56,189,248,0.9), inset 0 0 10px rgba(224,242,254,0.4)',
    animClass: 'fr-pulse',
  },
  {
    id: 'frame_xmas_lights',
    name: 'Огни Гирлянды',
    lvl: 44,
    xmasUnlockKey: 'xmasEscaped',
    desc: 'Красно-золотое праздничное свечение Новогоднего Эвента.',
    color: '#ef4444',
    border: '3px dashed #fbbf24',
    boxShadow: '0 0 24px rgba(239,68,68,0.85), inset 0 0 10px rgba(250,204,21,0.45)',
    rarity: 'Новогодняя',
    rarityColor: '#fbbf24',
    style: 'border:3px dashed #fbbf24;box-shadow:0 0 24px rgba(239,68,68,0.85), inset 0 0 10px rgba(250,204,21,0.45)',
    animClass: 'fr-inferno',
  },
  {
    id: 'frame_crimson_50',
    name: 'Багровый Рассвет 48',
    lvl: 48,
    desc: 'Огненный венец стойких исследователей 48 уровня.',
    color: '#fb7185',
    border: '3px solid #f43f5e',
    boxShadow: '0 0 28px rgba(244,63,94,0.95)',
    rarity: 'Легендарная',
    rarityColor: '#f43f5e',
    style: 'border:3px solid #f43f5e;box-shadow:0 0 28px rgba(244,63,94,0.95)',
    animClass: 'fr-pulse',
  },
  {
    id: 'frame_aurora_50',
    name: 'Абсолют 50',
    lvl: 50,
    desc: 'Высшая радужно-золотая рамка абсолютного чемпиона 50 уровня.',
    color: '#ffd700',
    border: '3px solid #ffd700',
    boxShadow: '0 0 32px rgba(255,215,0,1), inset 0 0 14px rgba(255,255,255,0.65)',
    rarity: 'Абсолютная',
    rarityColor: '#ffd700',
    style: 'border:3px solid #ffd700;box-shadow:0 0 32px rgba(255,215,0,1), inset 0 0 14px rgba(255,255,255,0.65)',
    animClass: 'fr-prism',
  },
];

export function getAvatar(id) {
  return AVATAR_LIST.find((a) => a.id === id) || AVATAR_LIST[0];
}

export function getFrame(id) {
  return FRAME_LIST.find((f) => f.id === id) || FRAME_LIST[0];
}

export function getNameBorder(id) {
  return NAME_BORDERS.find((b) => b.id === id) || NAME_BORDERS[0];
}

export function isAvatarUnlocked(avatarId, playerLevel, PF = null) {
  const av = getAvatar(avatarId);
  if (av.xmasUnlockKey && PF && PF[av.xmasUnlockKey]) return true;
  return (playerLevel || 1) >= (av.lvl || 1);
}

export function isFrameUnlocked(frameId, playerLevel, PF = null) {
  const fr = getFrame(frameId);
  if (fr.xmasUnlockKey && PF && PF[fr.xmasUnlockKey]) return true;
  return (playerLevel || 1) >= (fr.lvl || 1);
}

export function isNameBorderUnlocked(borderId, playerLevel, PF = null) {
  const nb = getNameBorder(borderId);
  if (nb.xmasUnlockKey && PF && PF[nb.xmasUnlockKey]) return true;
  return (playerLevel || 1) >= (nb.lvl || 1);
}

function escapeNameHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderNameWithBorderHtml(name, borderId = 'none') {
  const nb = getNameBorder(borderId);
  const safe = escapeNameHtml(name || 'Игрок');
  if (!nb || nb.id === 'none') {
    return `<span style="color:#fff;font-weight:bold">${safe}</span>`;
  }
  return `<span style="display:inline-flex;align-items:center;gap:4px;color:${nb.color};font-weight:bold;${nb.style};line-height:1.2">${safe}</span>`;
}

export function renderDeveloperBadgeHtml(isDev) {
  if (!isDev) return '';
  return `<div class="dev-badge">DEVELOPER</div>`;
}

export function compressImageFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('File read error'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image'));
      img.onload = () => {
        const size = 76;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        let dataUrl = canvas.toDataURL('image/jpeg', 0.78);
        if (dataUrl.length > 22000) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.55);
        }
        resolve(dataUrl);
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Renders an HTML string for an avatar placed inside its frame
 */
export function renderAvatarBadgeHtml(avatarId, frameId, size = 44, extraClass = '', customPhoto = '') {
  ensureAvatarFrameStyles();
  const av = getAvatar(avatarId);
  const fr = getFrame(frameId);
  const animCls = fr.animClass || '';
  const fontSize = Math.round(size * 0.52);
  const hasPhoto = typeof customPhoto === 'string' && /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(customPhoto);

  return `
    <div class="avatar-badge-wrap ${animCls} ${extraClass}" style="
      position: relative;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${av.bg};
      ${fr.style};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      flex-shrink: 0;
      user-select: none;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    ">
      ${
        hasPhoto
          ? `<img src="${customPhoto}" alt="avatar" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:50%" />`
          : `<span style="font-size: ${fontSize}px; line-height: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.7));">
              ${av.emoji}
            </span>`
      }
    </div>
  `;
}

/**
 * Opens the interactive Avatar & Frame customization modal
 */
export function showAvatarCustomizerModal(PF, options = {}) {
  ensureAvatarFrameStyles();
  const { pWrite, coop, ac, TN, onUpdate } = options;
  if (!PF) return;

  const currentLevelInfo = calculateLevel(PF.xp || 0);
  const playerLevel = currentLevelInfo.level;

  let activeTab = 'avatars'; // 'avatars' | 'frames' | 'borders'
  let selectedAvatar = PF.avatar || 'survivor';
  let selectedFrame = PF.frame || 'frame_classic';
  let selectedBorder = PF.nameBorder || 'none';

  const modalId = 'avatar_customizer_modal';
  let modal = document.getElementById(modalId);
  if (modal) disposeAnimatedModal(modal);

  modal = document.createElement('div');
  modal.id = modalId;
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.88);
    backdrop-filter: blur(6px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
    font-family: Georgia, serif;
  `;

  function playSelectSound() {
    if (ac && TN) {
      try {
        TN(650, 0.08, 0.2, 'triangle', 900);
      } catch (e) {}
    }
  }

  function playEquipSound() {
    if (ac && TN) {
      try {
        TN(520, 0.12, 0.25, 'triangle', 1100);
        setTimeout(() => TN(880, 0.15, 0.3, 'sine'), 90);
      } catch (e) {}
    }
  }

  function renderContent() {
    const curAv = getAvatar(selectedAvatar);
    const curFr = getFrame(selectedFrame);
    const curNb = getNameBorder(selectedBorder);
    const avUnlocked = isAvatarUnlocked(selectedAvatar, playerLevel, PF);
    const frUnlocked = isFrameUnlocked(selectedFrame, playerLevel, PF);
    const nbUnlocked = isNameBorderUnlocked(selectedBorder, playerLevel, PF);

    const isCurrentEquipped =
      PF.avatar === selectedAvatar &&
      PF.frame === selectedFrame &&
      (PF.nameBorder || 'none') === selectedBorder;

    modal.innerHTML = `
      <div style="
        width: 100%;
        max-width: 620px;
        max-height: 92vh;
        background: #14080b;
        border: 2px solid #8b1e25;
        border-radius: 12px;
        box-shadow: 0 0 35px rgba(220, 20, 40, 0.45);
        color: #eee;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      ">
        <!-- Header -->
        <div style="
          padding: 14px 20px;
          background: linear-gradient(90deg, #2b080e, #180508);
          border-bottom: 1px solid #5a1e22;
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 22px;">🎭</span>
            <div>
              <div style="font-size: 16px; font-weight: bold; color: #fff; letter-spacing: 0.05em;">
                КАСТОМИЗАЦИЯ ПРОФИЛЯ
              </div>
              <div style="font-size: 11.5px; color: #aaa;">
                Твой аватар и рамка видны всем игрокам в кооперативном режиме
              </div>
            </div>
          </div>
          <button id="modal_close_btn" style="
            background: transparent;
            border: none;
            color: #ff6b81;
            font-size: 24px;
            cursor: pointer;
            padding: 0 4px;
            line-height: 1;
          ">✕</button>
        </div>

        <!-- Live Preview Box -->
        <div style="
          padding: 14px 20px;
          background: #0f0507;
          border-bottom: 1px solid #3d1417;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        ">
          <div style="display: flex; align-items: center; gap: 14px; flex: 1; min-width: 220px;">
            ${renderAvatarBadgeHtml(selectedAvatar, selectedFrame, 68, '', PF.customAvatar || '')}

            <div>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                ${renderNameWithBorderHtml(PF.name || curAv.name, selectedBorder)}
                <span style="
                  font-size: 10px;
                  background: rgba(255,255,255,0.08);
                  border: 1px solid ${curFr.color};
                  color: ${curFr.color};
                  padding: 2px 6px;
                  border-radius: 4px;
                  font-weight: bold;
                ">
                  ${curFr.name}
                </span>
              </div>
              <div style="font-size: 12px; color: #bbb; margin-top: 3px;">
                ${activeTab === 'borders' ? curNb.desc : curAv.desc}
              </div>
              <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px; flex-wrap: wrap;">
                <input id="av_photo_file_input" type="file" accept="image/*" style="display: none;" />
                <button id="btn_upload_gallery_photo" style="margin:0;padding:4px 10px;background:#1c2538;border:1px solid #38bdf8;color:#bae6fd;border-radius:4px;font-size:11.5px;cursor:pointer;font-weight:bold;">
                  📷 Фото из галереи
                </button>
                ${
                  PF.customAvatar
                    ? `<button id="btn_clear_gallery_photo" style="margin:0;padding:4px 10px;background:#2b1115;border:1px solid #ef4444;color:#fecaca;border-radius:4px;font-size:11.5px;cursor:pointer;">
                        ✕ Убрать фото
                       </button>`
                    : ''
                }
              </div>
            </div>
          </div>

          <div>
            ${
              !avUnlocked || !frUnlocked || !nbUnlocked
                ? `<div style="padding: 6px 14px; background: #260a0d; border: 1px solid #751a22; border-radius: 6px; color: #ff8888; font-size: 12px; text-align: center;">
                    🔒 Требуется ур. ${Math.max(curAv.lvl, curFr.lvl, curNb.lvl)} (Твой: ${playerLevel})
                   </div>`
                : isCurrentEquipped
                ? `<div style="padding: 6px 16px; background: #0e2a18; border: 1px solid #2ed573; border-radius: 6px; color: #2ed573; font-size: 13px; font-weight: bold; text-align: center;">
                    ✓ НАДЕТО В КООПЕ
                   </div>`
                : `<button id="btn_equip_style" style="
                    margin: 0;
                    padding: 8px 18px;
                    background: #8b0000;
                    border: 1px solid #ff4444;
                    color: #fff;
                    font-weight: bold;
                    font-size: 13px;
                    border-radius: 6px;
                    cursor: pointer;
                    box-shadow: 0 0 12px rgba(255, 68, 68, 0.4);
                  ">
                    ⚡ НАДЕТЬ СТИЛЬ
                   </button>`
            }
          </div>
        </div>

        <!-- Tab Switcher -->
        <div style="
          display: flex;
          background: #18090c;
          border-bottom: 1px solid #3d1417;
        ">
          <button id="tab_avatars" style="
            flex: 1;
            padding: 10px 6px;
            background: ${activeTab === 'avatars' ? '#250b10' : 'transparent'};
            border: none;
            border-bottom: 2px solid ${activeTab === 'avatars' ? '#ff4757' : 'transparent'};
            color: ${activeTab === 'avatars' ? '#ff6b81' : '#888'};
            font-weight: bold;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
          ">
            <span>👤</span> АВАТАРЫ (${AVATAR_LIST.length})
          </button>
          <button id="tab_frames" style="
            flex: 1;
            padding: 10px 6px;
            background: ${activeTab === 'frames' ? '#250b10' : 'transparent'};
            border: none;
            border-bottom: 2px solid ${activeTab === 'frames' ? '#ff4757' : 'transparent'};
            color: ${activeTab === 'frames' ? '#ff6b81' : '#888'};
            font-weight: bold;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
          ">
            <span>🖼️</span> РАМКИ (${FRAME_LIST.length})
          </button>
          <button id="tab_borders" style="
            flex: 1;
            padding: 10px 6px;
            background: ${activeTab === 'borders' ? '#250b10' : 'transparent'};
            border: none;
            border-bottom: 2px solid ${activeTab === 'borders' ? '#ff4757' : 'transparent'};
            color: ${activeTab === 'borders' ? '#ff6b81' : '#888'};
            font-weight: bold;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
          ">
            <span>✨</span> ОБВОДКА ИМЕНИ (${NAME_BORDERS.length})
          </button>
        </div>

        <!-- Grid List -->
        <div style="
          padding: 16px 20px;
          overflow-y: auto;
          flex: 1;
          max-height: 48vh;
        ">
          ${
            activeTab === 'avatars'
              ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px;">
              ${AVATAR_LIST.map((item) => {
                const unlocked = isAvatarUnlocked(item.id, playerLevel, PF);
                const isSelected = selectedAvatar === item.id;
                const isEquipped = PF.avatar === item.id;

                return `
                  <div class="avatar-item-card" data-avatar-id="${item.id}" style="
                    background: ${isSelected ? '#2d0f15' : '#1c0a0e'};
                    border: 1px solid ${isSelected ? '#ff4757' : unlocked ? '#441419' : '#2a0a0d'};
                    border-radius: 8px;
                    padding: 10px 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s ease;
                    box-shadow: ${isSelected ? '0 0 14px rgba(255, 71, 87, 0.4)' : 'none'};
                    opacity: ${unlocked ? 1 : 0.65};
                  ">
                    <div style="
                      width: 46px;
                      height: 46px;
                      border-radius: 50%;
                      background: ${item.bg};
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 24px;
                      margin-bottom: 6px;
                      border: 1px solid rgba(255,255,255,0.1);
                      position: relative;
                    ">
                      ${item.emoji}
                      ${!unlocked ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;">🔒</div>` : ''}
                    </div>

                    <div style="font-size: 12px; font-weight: bold; color: #fff; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">
                      ${item.name}
                    </div>

                    <div style="font-size: 10px; color: ${item.rarityColor}; margin-top: 2px;">
                      ${item.rarity}
                    </div>

                    <div style="font-size: 10.5px; margin-top: 4px; color: ${unlocked ? '#aaa' : '#ff7675'};">
                      ${unlocked ? (isEquipped ? '<b style="color:#2ed573">Надет</b>' : 'Доступен') : `Уровень ${item.lvl}`}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `
              : activeTab === 'frames'
              ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px;">
              ${FRAME_LIST.map((item) => {
                const unlocked = isFrameUnlocked(item.id, playerLevel, PF);
                const isSelected = selectedFrame === item.id;
                const isEquipped = PF.frame === item.id;
                const previewAv = getAvatar(selectedAvatar);

                return `
                  <div class="frame-item-card" data-frame-id="${item.id}" style="
                    background: ${isSelected ? '#2d0f15' : '#1c0a0e'};
                    border: 1px solid ${isSelected ? '#ff4757' : unlocked ? '#441419' : '#2a0a0d'};
                    border-radius: 8px;
                    padding: 10px 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s ease;
                    box-shadow: ${isSelected ? '0 0 14px rgba(255, 71, 87, 0.4)' : 'none'};
                    opacity: ${unlocked ? 1 : 0.65};
                  ">
                    <div class="${item.animClass || ''}" style="
                      width: 48px;
                      height: 48px;
                      border-radius: 50%;
                      background: ${previewAv.bg};
                      ${item.style};
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 22px;
                      margin-bottom: 6px;
                      position: relative;
                    ">
                      ${previewAv.emoji}
                      ${!unlocked ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.65);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;">🔒</div>` : ''}
                    </div>

                    <div style="font-size: 12px; font-weight: bold; color: #fff; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">
                      ${item.name}
                    </div>

                    <div style="font-size: 10px; color: ${item.color}; margin-top: 2px;">
                      ${item.rarity}
                    </div>

                    <div style="font-size: 10.5px; margin-top: 4px; color: ${unlocked ? '#aaa' : '#ff7675'};">
                      ${unlocked ? (isEquipped ? '<b style="color:#2ed573">Надета</b>' : 'Доступна') : `Уровень ${item.lvl}`}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `
              : `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
              ${NAME_BORDERS.map((item) => {
                const unlocked = isNameBorderUnlocked(item.id, playerLevel, PF);
                const isSelected = selectedBorder === item.id;
                const isEquipped = (PF.nameBorder || 'none') === item.id;
                return `
                  <div class="border-item-card" data-border-id="${item.id}" style="
                    background: ${isSelected ? '#2d0f15' : '#1c0a0e'};
                    border: 1px solid ${isSelected ? '#ff4757' : unlocked ? '#441419' : '#2a0a0d'};
                    border-radius: 8px;
                    padding: 12px 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    opacity: ${unlocked ? 1 : 0.65};
                  ">
                    <div style="min-height: 28px; display: flex; align-items: center; justify-content: center;">
                      ${renderNameWithBorderHtml(PF.name || 'Игрок', item.id)}
                    </div>
                    <div style="font-size: 12px; font-weight: bold; color: #fff; text-align: center;">${item.name}</div>
                    <div style="font-size: 10.5px; color: ${unlocked ? '#aaa' : '#ff7675'};">
                      ${unlocked ? (isEquipped ? '<b style="color:#2ed573">Надета</b>' : 'Доступна') : `Уровень ${item.lvl}`}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `
          }
        </div>

        <!-- Footer -->
        <div style="
          padding: 12px 20px;
          background: #0f0507;
          border-top: 1px solid #3d1417;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #aaa;
        ">
          <div>
            Твой уровень: <b style="color: #fd4;">${playerLevel}</b> (${currentLevelInfo.title})
          </div>
          <button id="modal_close_bottom" style="
            margin: 0;
            padding: 6px 16px;
            background: #250b10;
            border: 1px solid #5a1e22;
            color: #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          ">
            Закрыть
          </button>
        </div>
      </div>
    `;

    // Hook events
    const closeModal = () => closeAnimatedModal(modal);
    modal.querySelector('#modal_close_btn').onclick = closeModal;
    modal.querySelector('#modal_close_bottom').onclick = closeModal;

    const tabAv = modal.querySelector('#tab_avatars');
    if (tabAv) {
      tabAv.onclick = () => {
        activeTab = 'avatars';
        renderContent();
      };
    }

    const tabFr = modal.querySelector('#tab_frames');
    if (tabFr) {
      tabFr.onclick = () => {
        activeTab = 'frames';
        renderContent();
      };
    }

    const tabBr = modal.querySelector('#tab_borders');
    if (tabBr) {
      tabBr.onclick = () => {
        activeTab = 'borders';
        renderContent();
      };
    }

    modal.querySelectorAll('.avatar-item-card').forEach((card) => {
      card.onclick = () => {
        const id = card.getAttribute('data-avatar-id');
        selectedAvatar = id;
        playSelectSound();
        renderContent();
      };
    });

    modal.querySelectorAll('.frame-item-card').forEach((card) => {
      card.onclick = () => {
        const id = card.getAttribute('data-frame-id');
        selectedFrame = id;
        playSelectSound();
        renderContent();
      };
    });

    modal.querySelectorAll('.border-item-card').forEach((card) => {
      card.onclick = () => {
        const id = card.getAttribute('data-border-id');
        selectedBorder = id;
        playSelectSound();
        renderContent();
      };
    });

    const uploadBtn = modal.querySelector('#btn_upload_gallery_photo');
    const fileInput = modal.querySelector('#av_photo_file_input');
    if (uploadBtn && fileInput) {
      uploadBtn.onclick = () => fileInput.click();
      fileInput.onchange = async () => {
        const f = fileInput.files && fileInput.files[0];
        if (!f) return;
        try {
          const dataUrl = await compressImageFileToDataUrl(f);
          PF.customAvatar = dataUrl;
          try { localStorage.setItem('horror_custom_avatar', dataUrl); } catch (e) {}
          if (typeof pWrite === 'function') pWrite();
          playEquipSound();
          if (coop && typeof coop.setProfile === 'function') {
            coop.setProfile(PF.name || 'Игрок', PF.skin | 0, PF.avatar || 'survivor', PF.frame || 'frame_classic', { avatarPhoto: dataUrl, nameBorder: PF.nameBorder || 'none' });
          }
          if (typeof onUpdate === 'function') onUpdate(PF.avatar, PF.frame);
          renderContent();
        } catch (e) {}
      };
    }

    const clearPhotoBtn = modal.querySelector('#btn_clear_gallery_photo');
    if (clearPhotoBtn) {
      clearPhotoBtn.onclick = () => {
        PF.customAvatar = '';
        try { localStorage.removeItem('horror_custom_avatar'); } catch (e) {}
        if (typeof pWrite === 'function') pWrite();
        playSelectSound();
        if (coop && typeof coop.setProfile === 'function') {
          coop.setProfile(PF.name || 'Игрок', PF.skin | 0, PF.avatar || 'survivor', PF.frame || 'frame_classic', { avatarPhoto: '', nameBorder: PF.nameBorder || 'none' });
        }
        if (typeof onUpdate === 'function') onUpdate(PF.avatar, PF.frame);
        renderContent();
      };
    }

    const equipBtn = modal.querySelector('#btn_equip_style');
    if (equipBtn) {
      equipBtn.onclick = () => {
        if (
          !isAvatarUnlocked(selectedAvatar, playerLevel, PF) ||
          !isFrameUnlocked(selectedFrame, playerLevel, PF) ||
          !isNameBorderUnlocked(selectedBorder, playerLevel, PF)
        ) {
          return;
        }

        PF.avatar = selectedAvatar;
        PF.frame = selectedFrame;
        PF.nameBorder = selectedBorder;
        if (typeof pWrite === 'function') pWrite();

        playEquipSound();

        if (coop && typeof coop.setProfile === 'function') {
          const myNick = PF.name || 'Игрок';
          coop.setProfile(myNick, PF.skin | 0, PF.avatar, PF.frame, {
            avatarPhoto: PF.customAvatar || '',
            nameBorder: PF.nameBorder || 'none',
          });
        }

        if (typeof onUpdate === 'function') {
          onUpdate(PF.avatar, PF.frame);
        }

        renderContent();
      };
    }
  }

  modal.onclick = (e) => {
    if (e.target === modal) closeAnimatedModal(modal);
  };
  renderContent();
  document.body.appendChild(modal);
  openAnimatedModal(modal);
}

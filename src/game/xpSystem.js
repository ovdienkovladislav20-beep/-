/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * XP & Level Progression System with Phone Cosmetics Customizer
 */

import { getDailyStreakState, showDailyStreakModal } from './dailyStreak.js';
import { openAnimatedModal, closeAnimatedModal, disposeAnimatedModal } from './uiTransitions.js';

export const XP_LEVELS = [
  { level: 1, xpReq: 0, title: 'Заблудший', reward: 'Базовый телефон' },
  { level: 2, xpReq: 150, title: 'Внимательный', reward: 'Чехол «Кровавый Багрянец» + Брелок 💀' },
  { level: 3, xpReq: 400, title: 'Следопыт', reward: 'Обои «Кровавая Луна» + Стикер 🩸' },
  { level: 4, xpReq: 750, title: 'Осторожный', reward: 'Чехол «Токсичный Изумруд» + Брелок 🔦' },
  { level: 5, xpReq: 1200, title: 'Выживший', reward: 'Обои «Зеленый Радар»' },
  { level: 6, xpReq: 1800, title: 'Охотник за тенями', reward: 'Чехол «Ночной Карбон» + Брелок ☢️' },
  { level: 7, xpReq: 2500, title: 'Повелитель коридоров', reward: 'Обои «Старый VHS» + Стикер 📼' },
  { level: 8, xpReq: 3400, title: 'Кошмар монстров', reward: 'Чехол «Кибер-Глитч» + Брелок 👁️' },
  { level: 9, xpReq: 4500, title: 'Хранитель тайн', reward: 'Обои «Глаз Бездны»' },
  { level: 10, xpReq: 5800, title: 'Мастер выживания', reward: 'Чехол «Призрачное Золото» + Брелок ⛧' },
  { level: 11, xpReq: 7200, title: 'Ключник склепа', reward: 'Стикер «Ключ Выхода» 🗝️' },
  { level: 12, xpReq: 8800, title: 'Призрачный гость', reward: 'Обои «Особняк Теней»' },
  { level: 13, xpReq: 10500, title: 'Смотритель тумана', reward: 'Чехол «Морозная Сталь»' },
  { level: 14, xpReq: 12400, title: 'Ловец отголосков', reward: 'Брелок «Летучая Мышь» 🦇' },
  { level: 15, xpReq: 14500, title: 'Ночной сторож', reward: 'Стикер «Череп Сталкера» 💀' },
  { level: 16, xpReq: 16800, title: 'Механик гаражей', reward: 'Чехол «Ржавый Металл»' },
  { level: 17, xpReq: 19300, title: 'Разведчик бункера', reward: 'Обои «Ночной Дождь»' },
  { level: 18, xpReq: 22000, title: 'Гроза капканов', reward: 'Брелок «Ловушка» 🪤 + Стикер ⚡' },
  { level: 19, xpReq: 24900, title: 'Холодный взгляд', reward: 'Чехол «Неоновый Лёд»' },
  { level: 20, xpReq: 28000, title: 'Ветеран кошмаров', reward: 'Обои «Багряный Склеп» + Стикер 🕯️' },
  { level: 21, xpReq: 31300, title: 'Водитель ВАЗ-2112', reward: 'Стикер «Лада-Турбо» 🚗' },
  { level: 22, xpReq: 34800, title: 'Укротитель тьмы', reward: 'Чехол «Кровавый Титан»' },
  { level: 23, xpReq: 38500, title: 'Тень особняка', reward: 'Брелок «Свеча» 🕯️' },
  { level: 24, xpReq: 42400, title: 'Хранитель кладбища', reward: 'Обои «Зимний Стылый»' },
  { level: 25, xpReq: 46500, title: 'Бесстрашный', reward: 'Стикер «Знак Бездны» ⛧' },
  { level: 26, xpReq: 50800, title: 'Сборщик деталей', reward: 'Чехол «Кислотный Неон»' },
  { level: 27, xpReq: 55300, title: 'Призрак трассы', reward: 'Обои «Асфальт и Фары»' },
  { level: 28, xpReq: 60000, title: 'Владыка ключей', reward: 'Брелок «Ворон» 🐦‍⬛' },
  { level: 29, xpReq: 64900, title: 'Повелитель ужаса', reward: 'Стикер «Глаз Тьмы» 👁️' },
  { level: 30, xpReq: 70000, title: 'Легенда лабиринта', reward: 'Чехол «Рубиновый Огонь» + Обои «Пламя»' },
  { level: 31, xpReq: 75300, title: 'Гроза Механика', reward: 'Брелок «Гаечный Ключ» 🔧' },
  { level: 32, xpReq: 80800, title: 'Скиталец бездны', reward: 'Стикер «Алмазная Корона» 💎' },
  { level: 33, xpReq: 86500, title: 'Архитектор страха', reward: 'Обои «Обсидиановый Зал»' },
  { level: 34, xpReq: 92400, title: 'Повелитель кошмара', reward: 'Брелок «Кровавая Корона» 👑' },
  { level: 35, xpReq: 98500, title: 'Хранитель Зимы', reward: 'Чехол «Чёрный Бриллиант» + Стикер 👑' },
  { level: 36, xpReq: 104800, title: 'Путник Метели', reward: 'Брелок «Снежинка» ❄️ + Аватар «Ледяной Страж»' },
  { level: 37, xpReq: 111300, title: 'Охотник Вьюги', reward: 'Обои «Северное Сияние»' },
  { level: 38, xpReq: 118000, title: 'Мастер Москвича', reward: 'Стикер «Москвич-Ралли» 🚙' },
  { level: 39, xpReq: 124900, title: 'Теневой Страж', reward: 'Чехол «Новогодний Иней» + Обводка имени' },
  { level: 40, xpReq: 132000, title: 'Хозяин Коридоров', reward: 'Рамка «Хрустальный Иней» + Брелок 🎄' },
  { level: 41, xpReq: 139300, title: 'Неуловимый Призрак', reward: 'Стикер «Ёлочный Шар» 🎄' },
  { level: 42, xpReq: 146800, title: 'Повелитель Стужи', reward: 'Обои «Огни Камина»' },
  { level: 43, xpReq: 154500, title: 'Король Ночных Трасс', reward: 'Чехол «Хромированный Багрянец»' },
  { level: 44, xpReq: 162400, title: 'Взломщик Замков', reward: 'Брелок «Ледяной Кристалл» 🧊' },
  { level: 45, xpReq: 170500, title: 'Призрак Сочельника', reward: 'Стикер «Колокольчик» 🔔 + Обводка имени' },
  { level: 46, xpReq: 178800, title: 'Творец Судьбы', reward: 'Чехол «Изумрудный Бархат»' },
  { level: 47, xpReq: 187300, title: 'Владыка Метели', reward: 'Обои «Ледяной Дворец» + Брелок ⭐' },
  { level: 48, xpReq: 196000, title: 'Несломленный', reward: 'Рамка «Багровый Рассвет 50»' },
  { level: 49, xpReq: 205000, title: 'Вестник Нового Года', reward: 'Стикер «Полярная Звезда» 🌠' },
  { level: 50, xpReq: 215000, title: 'АБСОЛЮТ ВЕЧНОСТИ', reward: 'Чехол «Абсолют 50» + Корона Вечности 🔱 (Макс. ур. 50)' },
];

export const PHONE_CASES = [
  { id: 'classic', name: 'Пластик 90-х', color: '#555960', glow: '#888888', lvl: 1, desc: 'Серый пластиковый корпус времен первых мобильных' },
  { id: 'blood', name: 'Кровавый Багрянец', color: '#8b0000', glow: '#ff3344', lvl: 2, desc: 'Запекшийся багровый оттенок с резким рубиновым отблеском' },
  { id: 'toxic', name: 'Токсичный Изумруд', color: '#14532d', glow: '#22c55e', lvl: 4, desc: 'Кислотно-фосфорный чехол, заметно светящийся во тьме' },
  { id: 'carbon', name: 'Ночной Карбон', color: '#18181b', glow: '#d4af37', lvl: 6, desc: 'Матовый черный композит с золотой гравированной каймой' },
  { id: 'cyber', name: 'Кибер-Глитч', color: '#4c111d', glow: '#f43f5e', lvl: 8, desc: 'Помеховый багрово-стальной корпус со сбоем матрицы' },
  { id: 'gold', name: 'Призрачное Золото', color: '#854d0e', glow: '#facc15', lvl: 10, desc: 'Древний золотой футляр склепа с мистическими рунами' },
  { id: 'frost', name: 'Морозная Сталь', color: '#1e3a5f', glow: '#7dd3fc', lvl: 13, desc: 'Ледяной титановый корпус с инеем на гранях' },
  { id: 'rust', name: 'Ржавый Металл', color: '#5c2c16', glow: '#f59e0b', lvl: 16, desc: 'Корпус из старой гаражной жести со следами масла' },
  { id: 'neonice', name: 'Неоновый Лёд', color: '#0f4c5c', glow: '#22d3ee', lvl: 19, desc: 'Холодное ночное сияние пустых улиц' },
  { id: 'titan', name: 'Кровавый Титан', color: '#450a0a', glow: '#f43f5e', lvl: 22, desc: 'Армированный корпус охотника за тенями' },
  { id: 'acid', name: 'Кислотный Неон', color: '#365314', glow: '#a3e635', lvl: 26, desc: 'Защитный корпус от болотного тумана' },
  { id: 'ruby', name: 'Рубиновый Огонь', color: '#7f1d1d', glow: '#fb7185', lvl: 30, desc: 'Сияющий багряный сплав ветерана всех глав' },
  { id: 'diamond', name: 'Чёрный Бриллиант', color: '#09090b', glow: '#38bdf8', lvl: 35, desc: 'Награда 35-го уровня — прочный сапфирово-чёрный корпус' },
  { id: 'christmas', name: 'Новогодний Бархат', color: '#991b1b', glow: '#fde047', lvl: 39, xmasUnlockKey: 'xmasPhoneUnlocked', desc: 'Праздничный алый корпус с золотой каймой (Глава 5 или Ур. 39)' },
  { id: 'chrome_crimson', name: 'Хромированный Багрянец', color: '#3f0e1c', glow: '#fda4af', lvl: 43, desc: 'Зеркальный гранатовый сплав гонщика' },
  { id: 'emerald_velvet', name: 'Изумрудный Сочельник', color: '#064e3b', glow: '#34d399', lvl: 46, desc: 'Глубокий хвойный корпус с переливами гирлянд' },
  { id: 'absolute_50', name: 'Абсолют 50', color: '#1a0c24', glow: '#ffd700', lvl: 50, desc: 'Высший легендарный корпус 50-го уровня с золотым ореолом' },
];

export const PHONE_WALLPAPERS = [
  { id: 'noise', name: 'Ночной Шум', bg: '#0a1830', accent: '#64748b', lvl: 1, desc: 'Классический темно-синий экран операционной системы' },
  { id: 'moon', name: 'Кровавая Луна', bg: '#2b0b11', accent: '#ff4d4d', lvl: 3, desc: 'Зловещая багровая дымка полнолуния' },
  { id: 'grid', name: 'Зеленый Радар', bg: '#021808', accent: '#2ed573', lvl: 5, desc: 'Тактическая сетка терминала слежения' },
  { id: 'vhs', name: 'Старый VHS', bg: '#161113', accent: '#d97706', lvl: 7, desc: 'Полосы помех старой магнитной видеопленки 1998 года' },
  { id: 'void', name: 'Глаз Бездны', bg: '#24040d', accent: '#ff1e56', lvl: 9, desc: 'Немигающий взгляд из глубины лабиринта' },
  { id: 'mansion', name: 'Особняк Теней', bg: '#1d0d0d', accent: '#b91c1c', lvl: 12, desc: 'Старинные узоры заброшенного холла особняка' },
  { id: 'rain', name: 'Ночной Дождь', bg: '#0b1c26', accent: '#38bdf8', lvl: 17, desc: 'Капли ливня на лобовом стекле у старых гаражей' },
  { id: 'crypt', name: 'Багряный Склеп', bg: '#2d060a', accent: '#fb7185', lvl: 20, desc: 'Темно-алый фон древних надгробий' },
  { id: 'winter', name: 'Зимний Стылый', bg: '#0c2233', accent: '#bae6fd', lvl: 24, desc: 'Снежная пелена на экране телефона' },
  { id: 'asphalt', name: 'Асфальт и Фары', bg: '#18181b', accent: '#facc15', lvl: 27, desc: 'Свет далёких фар ВАЗ-2112 сквозь туман' },
  { id: 'flame', name: 'Пламя Выхода', bg: '#2c0f06', accent: '#fb923c', lvl: 30, desc: 'Огненный экран триумфатора лабиринта' },
  { id: 'obsidian', name: 'Обсидиановый Зал', bg: '#0b0607', accent: '#e11d48', lvl: 33, desc: 'Глубочайший обсидиановый кристалл 33 уровня' },
  { id: 'aurora', name: 'Северное Сияние', bg: '#081c2e', accent: '#34d399', lvl: 37, desc: 'Ледяное изумрудное сияние зимнего неба' },
  { id: 'hearth', name: 'Огни Камина', bg: '#261009', accent: '#f59e0b', lvl: 42, desc: 'Тёплый отблеск углей заснеженного дома' },
  { id: 'frostpalace', name: 'Ледяной Дворец', bg: '#0f2942', accent: '#7dd3fc', lvl: 47, desc: 'Морозные узоры на стекле экрана 47 уровня' },
  { id: 'eternity50', name: 'Триумф 50', bg: '#1f0b18', accent: '#ffd700', lvl: 50, desc: 'Золотое затмение мастера 50-го уровня' },
];

export const PHONE_CHARMS = [
  { id: 'none', name: 'Без брелока', emoji: '', lvl: 1, desc: 'Стандартный вид без подвесок' },
  { id: 'skull', name: 'Череп', emoji: '💀', lvl: 2, desc: 'Костяной брелок погибшего сталкера' },
  { id: 'flashlight', name: 'Фонарик', emoji: '🔦', lvl: 4, desc: 'Миниатюрный брелок-фонарик' },
  { id: 'radiation', name: 'Знак Радиации', emoji: '☢️', lvl: 6, desc: 'Знак биологической и радиационной угрозы' },
  { id: 'eye', name: 'Всевидящее Око', emoji: '👁️', lvl: 8, desc: 'Амулет защиты от взгляда монстра' },
  { id: 'pentagram', name: 'Пентаграмма', emoji: '⛧', lvl: 10, desc: 'Оккультная печать древнего склепа' },
  { id: 'bat', name: 'Летучая Мышь', emoji: '🦇', lvl: 14, desc: 'Ночной талисман старого особняка' },
  { id: 'trap', name: 'Ловушка', emoji: '🪤', lvl: 18, desc: 'Мини-капкан на цепочке телефона' },
  { id: 'candle', name: 'Свеча', emoji: '🕯️', lvl: 23, desc: 'Восковой оберег кладбищенского смотрителя' },
  { id: 'raven', name: 'Ворон', emoji: '🐦‍⬛', lvl: 28, desc: 'Вестник тумана над воротами гаражей' },
  { id: 'wrench', name: 'Гаечный Ключ', emoji: '🔧', lvl: 31, desc: 'Талисман механика для ремонта ВАЗ' },
  { id: 'crown', name: 'Кровавая Корона', emoji: '👑', lvl: 34, desc: 'Корона повелителя ужаса' },
  { id: 'snowflake', name: 'Снежинка', emoji: '❄️', lvl: 36, desc: 'Хрустальный талисман зимней вьюги' },
  { id: 'xmastree', name: 'Новогодняя Ёлка', emoji: '🎄', lvl: 40, desc: 'Миниатюрная ёлочка с огоньком гирлянды' },
  { id: 'icecrystal', name: 'Ледяной Кристалл', emoji: '🧊', lvl: 44, desc: 'Нетающий осколок декабрьской ночи' },
  { id: 'star50', name: 'Звезда 50 Ур.', emoji: '⭐', lvl: 47, desc: 'Светящаяся вифлеемская звезда ветерана' },
  { id: 'trident50', name: 'Трезубец Вечности', emoji: '🔱', lvl: 50, desc: 'Высшая реликвия 50-го уровня' },
];

export const PHONE_STICKERS = [
  { id: 'none', name: 'Без стикера', emoji: '', color: '#666', lvl: 1, desc: 'Чистый корпус без наклеек' },
  { id: 'drop', name: 'Капля крови', emoji: '🩸', color: '#ff3344', lvl: 3, desc: 'Алая наклейка выжившего' },
  { id: 'vhs', name: 'VHS-98', emoji: '📼', color: '#d97706', lvl: 7, desc: 'Ретро-стикер кассеты из особняка' },
  { id: 'key', name: 'Ключ Выхода', emoji: '🗝️', color: '#fbbf24', lvl: 11, desc: 'Золотой стикер от зелёной двери' },
  { id: 'skull', name: 'Череп Сталкера', emoji: '💀', color: '#e5e7eb', lvl: 15, desc: 'Виниловый стикер охотника' },
  { id: 'bolt', name: 'Молния', emoji: '⚡', color: '#facc15', lvl: 18, desc: 'Предупреждение о высоком напряжении' },
  { id: 'candle', name: 'Свеча Тьмы', emoji: '🕯️', color: '#fb923c', lvl: 20, desc: 'Символ ночного ритуала' },
  { id: 'car', name: 'Лада-Турбо', emoji: '🚗', color: '#38bdf8', lvl: 21, desc: 'Наклейка побега на ВАЗ-2112 из гаражей' },
  { id: 'seal', name: 'Знак Бездны', emoji: '⛧', color: '#f43f5e', lvl: 25, desc: 'Светящаяся оккультная наклейка' },
  { id: 'eye', name: 'Глаз Тьмы', emoji: '👁️', color: '#ff4757', lvl: 29, desc: 'Немигающий взгляд на задней крышке' },
  { id: 'gem', name: 'Алмаз', emoji: '💎', color: '#67e8f9', lvl: 32, desc: 'Сияющая драгоценная наклейка' },
  { id: 'legend', name: 'Корона 35 Ур.', emoji: '👑', color: '#ffd700', lvl: 35, desc: 'Золотой стикер 35 уровня' },
  { id: 'moskvich', name: 'Москвич-Ралли', emoji: '🚙', color: '#60a5fa', lvl: 38, desc: 'Ретро-наклейка советского ралли 2-го гаража' },
  { id: 'ornament', name: 'Ёлочный Шар', emoji: '🎄', color: '#ef4444', lvl: 41, desc: 'Яркая новогодняя наклейка из Главы 5' },
  { id: 'jingle', name: 'Колокольчик', emoji: '🔔', color: '#facc15', lvl: 45, desc: 'Звонкий зимний стикер Сочельника' },
  { id: 'polarstar', name: 'Полярная Звезда', emoji: '🌠', color: '#7dd3fc', lvl: 49, desc: 'Падающая звезда морозной ночи' },
  { id: 'eternal50', name: 'Легенда 50 Ур.', emoji: '🔱', color: '#ffd700', lvl: 50, desc: 'Главный золотой стикер 50-го уровня!' },
];

export function isCoinBoostActive(PF) {
  return Boolean(PF && Number(PF.coinBoostUntil) > Date.now());
}

export function getCoinBoostRemainingText(PF) {
  if (!isCoinBoostActive(PF)) return '';
  const leftSec = Math.max(0, Math.ceil((Number(PF.coinBoostUntil) - Date.now()) / 1000));
  const m = Math.floor(leftSec / 60);
  const s = leftSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function awardCoinsWithBoost(PF, baseAmount) {
  const n = Math.max(0, Math.floor(Number(baseAmount) || 0));
  if (!PF || n <= 0) return 0;
  const mult = isCoinBoostActive(PF) ? 2 : 1;
  const finalAmt = n * mult;
  PF.coins = Math.max(0, Math.floor(Number(PF.coins) || 0)) + finalAmt;
  return finalAmt;
}

export function isPhoneCaseUnlocked(item, level, PF) {
  if (!item) return false;
  if (item.xmasUnlockKey && PF && PF[item.xmasUnlockKey]) return true;
  return (level || 1) >= (item.lvl || 1);
}

export function calculateLevel(xp = 0) {
  const totalXp = Math.max(0, xp | 0);
  let curLvl = XP_LEVELS[0];
  let nextLvl = XP_LEVELS[1] || null;

  for (let i = 0; i < XP_LEVELS.length; i++) {
    if (totalXp >= XP_LEVELS[i].xpReq) {
      curLvl = XP_LEVELS[i];
      nextLvl = XP_LEVELS[i + 1] || null;
    } else {
      break;
    }
  }

  const isMax = !nextLvl;
  const prevReq = curLvl.xpReq;
  const nextReq = nextLvl ? nextLvl.xpReq : prevReq + 5000;
  const levelXp = totalXp - prevReq;
  const levelTarget = nextReq - prevReq;
  const progressPct = isMax ? 100 : Math.min(100, Math.max(0, Math.round((levelXp / levelTarget) * 100)));

  return {
    level: curLvl.level,
    title: curLvl.title,
    currentXp: totalXp,
    levelXp,
    levelTarget,
    nextLvlReq: nextReq,
    progressPct,
    isMax,
    nextReward: nextLvl ? nextLvl.reward : 'Максимальный уровень 50 достигнут!',
  };
}

export function getPhoneCase(index = 0) {
  return PHONE_CASES[index] || PHONE_CASES[0];
}

export function getPhoneWallpaper(index = 0) {
  return PHONE_WALLPAPERS[index] || PHONE_WALLPAPERS[0];
}

export function getPhoneCharm(index = 0) {
  return PHONE_CHARMS[index] || PHONE_CHARMS[0];
}

export function getPhoneSticker(index = 0) {
  return PHONE_STICKERS[index] || PHONE_STICKERS[0];
}

let activeXpFloatingTimer = null;

export function showFloatingXpIndicator(amount, reason = '') {
  let el = document.getElementById('floating_xp_box');
  if (!el) {
    el = document.createElement('div');
    el.id = 'floating_xp_box';
    el.style.cssText =
      'position:fixed;top:65px;left:50%;transform:translateX(-50%);z-index:9000;pointer-events:none;display:flex;flex-direction:column;align-items:center;transition:opacity 0.4s ease, transform 0.4s ease;opacity:0';
    document.body.appendChild(el);
  }

  el.innerHTML = `
    <div style="background:rgba(20,5,8,0.92);border:1px solid #ff4757;box-shadow:0 0 20px rgba(255,40,60,0.6);border-radius:20px;padding:5px 16px;color:#fff;font-family:Georgia,serif;font-size:13px;display:flex;align-items:center;gap:6px">
      <span style="color:#fd4;font-weight:bold">+${amount} XP</span>
      ${reason ? `<span style="color:#ccc;font-size:12px">· ${reason}</span>` : ''}
    </div>
  `;

  el.style.opacity = '1';
  el.style.transform = 'translateX(-50%) translateY(0px)';

  if (activeXpFloatingTimer) clearTimeout(activeXpFloatingTimer);
  activeXpFloatingTimer = setTimeout(() => {
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-50%) translateY(-14px)';
    }
  }, 1600);
}

export function addXP(amount, reason = '', options = {}) {
  const { PF, pWrite, ac, TN } = options;
  if (!PF || amount <= 0) return;

  const prevXp = PF.xp || 0;
  const prevInfo = calculateLevel(prevXp);
  const newXp = prevXp + amount;
  PF.xp = newXp;

  if (typeof pWrite === 'function') pWrite();

  const newInfo = calculateLevel(newXp);
  showFloatingXpIndicator(amount, reason);

  if (newInfo.level > prevInfo.level) {
    if (ac && TN) {
      try {
        TN(440, 0.12, 0.25, 'triangle');
        setTimeout(() => TN(554, 0.12, 0.25, 'triangle'), 110);
        setTimeout(() => TN(659, 0.15, 0.3, 'sine'), 220);
        setTimeout(() => TN(880, 0.35, 0.35, 'triangle', 1100), 330);
      } catch (e) {}
    }

    showLevelUpNotification(newInfo);
  }

  const lobbyPanel = document.getElementById('lobby_xp_panel');
  if (lobbyPanel) {
    renderXPBarInLobby(lobbyPanel, PF, () => showPhoneCustomizerModal(options), options);
  }
}

export function showLevelUpNotification(levelInfo) {
  let toast = document.getElementById('lvl_up_toast');
  if (toast) toast.remove();

  toast = document.createElement('div');
  toast.id = 'lvl_up_toast';
  toast.style.cssText =
    'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9800;background:#0d0406;border:2px solid #ffd700;border-radius:10px;padding:14px 22px;color:#eee;font-family:Georgia,serif;box-shadow:0 0 35px rgba(255,215,0,0.5);display:flex;align-items:center;gap:14px;max-width:90%;box-sizing:border-box;animation:fadeInModal 0.25s ease';

  toast.innerHTML = `
    <div style="width:44px;height:44px;border-radius:50%;background:radial-gradient(circle, #ffd700 0%, #754c00 100%);display:flex;align-items:center;justify-content:center;font-size:22px;color:#000;font-weight:bold;flex-shrink:0;box-shadow:0 0 15px rgba(255,215,0,0.8)">
      ⭐
    </div>
    <div style="text-align:left">
      <div style="color:#ffd700;font-size:15px;font-weight:bold;letter-spacing:0.06em">УРОВЕНЬ ПОВЫШЕН! (${levelInfo.level}/50)</div>
      <div style="color:#fff;font-size:13px;margin:2px 0">${levelInfo.title}</div>
      <div style="color:#aaa;font-size:11.5px">Открыто: <span style="color:#5d5">${levelInfo.nextReward}</span></div>
    </div>
    <button id="lvl_toast_close" style="margin:0;padding:4px 8px;background:transparent;border:0;color:#aaa;font-size:18px;cursor:pointer">✕</button>
  `;

  document.body.appendChild(toast);
  const closeBtn = toast.querySelector('#lvl_toast_close');
  if (closeBtn) closeBtn.onclick = () => toast.remove();

  setTimeout(() => {
    if (toast) toast.remove();
  }, 4500);
}

export function renderXPBarInLobby(container, PF, onOpenCustomizer, options = {}) {
  if (!container) return;
  const info = calculateLevel(PF?.xp || 0);
  const streak = getDailyStreakState();

  const curCase = getPhoneCase(PF?.phoneCase || 0);
  const curCharm = getPhoneCharm(PF?.phoneCharm || 0);
  const curSticker = getPhoneSticker(PF?.phoneSticker || 0);
  const boostActive = isCoinBoostActive(PF);
  const boostLeft = boostActive ? getCoinBoostRemainingText(PF) : '';

  container.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:26px;padding:0 7px;border-radius:13px;background:#8b121d;border:1px solid #ff4757;color:#fff;font-size:12px;font-weight:bold">
          ${info.level}/50
        </span>
        <div style="text-align:left">
          <div style="color:#ffdddd;font-size:14px;font-weight:bold;letter-spacing:0.04em">
            ${info.title} <span style="font-size:12px;color:#fd4">(${info.currentXp} XP)</span>
          </div>
          <div style="font-size:11px;color:#aaa">
            ${info.isMax ? 'Максимальный уровень (50/50)' : `До ур. ${info.level + 1}: ${info.levelXp} / ${info.levelTarget} XP (${info.progressPct}%)`}
          </div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        ${boostActive ? `<span id="xp_coin_boost_badge" style="padding:4px 10px;border-radius:6px;background:rgba(245,158,11,0.22);border:1px solid #fbbf24;color:#fde047;font-size:11.5px;font-weight:bold;box-shadow:0 0 12px rgba(251,191,36,0.35)">⚡ x2 МОНЕТЫ · ${boostLeft}</span>` : ''}
        <!-- Daily Login Streak Button -->
        <button id="btn_daily_streak" style="margin:0;padding:6px 12px;font-size:12px;display:inline-flex;align-items:center;gap:6px;background:${streak.canClaimToday ? 'linear-gradient(180deg, #3d0d12 0%, #1a0507 100%)' : '#140c0e'};border:1px solid ${streak.canClaimToday ? '#ffd700' : '#4a151b'};color:${streak.canClaimToday ? '#fff' : '#aaa'};border-radius:4px;cursor:pointer;font-family:Georgia,serif;transition:all 0.15s;${streak.canClaimToday ? 'box-shadow:0 0 14px rgba(255,215,0,0.45);' : ''}">
          <span>🔥</span>
          <span>Серия: <b>${streak.streak} дн.</b></span>
          ${streak.canClaimToday ? `<span style="background:#ff4757;color:#fff;font-size:10px;padding:1px 6px;border-radius:3px;font-weight:bold;letter-spacing:0.02em">+${streak.currentReward.xp} XP!</span>` : `<span style="color:#2ed573;font-size:11px">✓</span>`}
        </button>

        <!-- Phone Customizer Button -->
        <button id="btn_open_phone_customizer" style="margin:0;padding:6px 12px;font-size:12px;display:inline-flex;align-items:center;gap:6px;background:#200c14;border:1px solid #a32230;color:#ffbebe;border-radius:4px;cursor:pointer;font-family:Georgia,serif;transition:all 0.15s">
          <span>📱</span>
          <span>Стиль и стикеры</span>
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${curCase.color};border:1px solid ${curCase.glow}"></span>
          ${curCharm.emoji ? `<span>${curCharm.emoji}</span>` : ''}
          ${curSticker.emoji ? `<span>${curSticker.emoji}</span>` : ''}
        </button>
      </div>
    </div>

    <!-- XP Progress Bar -->
    <div style="width:100%;height:8px;background:#14070a;border-radius:4px;border:1px solid #4a151b;overflow:hidden;position:relative;box-shadow:inset 0 0 5px #000">
      <div style="width:${info.progressPct}%;height:100%;background:linear-gradient(90deg, #8b0000, #ff4757, #ffa502);box-shadow:0 0 10px #ff4757;transition:width 0.3s ease"></div>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;font-size:11px;color:#888;flex-wrap:wrap;gap:4px">
      <span>Макс. уровень: 50 · Награды: чехлы, обои, брелоки и стикеры 🔥</span>
      <span style="color:#fd4">Следующая награда: ${info.nextReward}</span>
    </div>
  `;

  const customBtn = container.querySelector('#btn_open_phone_customizer');
  if (customBtn && typeof onOpenCustomizer === 'function') {
    customBtn.onclick = onOpenCustomizer;
  }

  const streakBtn = container.querySelector('#btn_daily_streak');
  if (streakBtn) {
    streakBtn.onclick = () => {
      showDailyStreakModal({
        PF,
        pWrite: options?.pWrite,
        ac: options?.ac,
        TN: options?.TN,
        onUpdate: () => renderXPBarInLobby(container, PF, onOpenCustomizer, options),
      });
    };
  }
}

export function showPhoneCustomizerModal(options = {}) {
  const { PF, pWrite, ac, TN, onUpdate } = options;

  let existing = document.getElementById('phone_customizer_modal');
  if (existing) disposeAnimatedModal(existing);

  const info = calculateLevel(PF?.xp || 0);
  let activeTab = 'case'; // 'case' | 'wallpaper' | 'charm' | 'sticker'

  let selCase = PF?.phoneCase !== undefined ? PF.phoneCase : 0;
  let selWallpaper = PF?.phoneWallpaper !== undefined ? PF.phoneWallpaper : 0;
  let selCharm = PF?.phoneCharm !== undefined ? PF.phoneCharm : 0;
  let selSticker = PF?.phoneSticker !== undefined ? PF.phoneSticker : 0;

  const modal = document.createElement('div');
  modal.id = 'phone_customizer_modal';
  modal.style.cssText =
    'position:fixed;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);z-index:9750;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box';

  function renderModalContent() {
    const curCaseObj = getPhoneCase(selCase);
    const curWpObj = getPhoneWallpaper(selWallpaper);
    const curCharmObj = getPhoneCharm(selCharm);
    const curStickerObj = getPhoneSticker(selSticker);

    modal.innerHTML = `
      <div style="background:#0f0709;border:2px solid #8b1e25;width:100%;max-width:680px;border-radius:12px;padding:22px;color:#eee;font-family:Georgia,serif;box-shadow:0 0 45px rgba(220,30,40,0.4);position:relative;box-sizing:border-box;max-height:92vh;overflow-y:auto">
        
        <button id="pcm_close" style="position:absolute;top:16px;right:18px;background:transparent;border:0;color:#aaa;font-size:22px;cursor:pointer;padding:4px">✕</button>

        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
          <div style="width:44px;height:44px;border-radius:12px;background:radial-gradient(circle, #8b0000 0%, #300000 100%);display:flex;align-items:center;justify-content:center;font-size:24px;border:1px solid #c33;box-shadow:0 0 15px rgba(255,0,0,0.4)">
            📱
          </div>
          <div>
            <h2 style="margin:0;font-size:20px;letter-spacing:0.06em;color:#ffdddd">КАСТОМИЗАЦИЯ ТЕЛЕФОНА</h2>
            <div style="font-size:12.5px;color:#bbb">
              Уровень ${info.level}/50 · ${info.title} (${info.currentXp} XP)
            </div>
          </div>
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:18px;align-items:center;margin-bottom:18px;background:#15080b;border:1px solid #4a151b;border-radius:8px;padding:14px">
          
          <div style="flex:0 0 auto;display:flex;flex-direction:column;align-items:center;margin:0 auto">
            <div style="font-size:11px;color:#888;margin-bottom:6px;letter-spacing:0.06em">ПРЕДПРОСМОТР (IN-GAME)</div>
            <div style="position:relative;width:100px;height:172px;background:${curCaseObj.color};border:2px solid ${curCaseObj.glow};border-radius:10px;box-shadow:0 0 16px ${curCaseObj.glow}66;display:flex;flex-direction:column;align-items:center;padding:14px 6px 12px;box-sizing:border-box;overflow:visible">
              
              <div style="width:100%;height:100%;background:${curWpObj.bg};border-radius:4px;border:1px solid #222;display:flex;flex-direction:column;justify-content:space-between;padding:4px;box-sizing:border-box;position:relative">
                <div style="display:flex;justify-content:space-between;font-size:7px;color:#aaa;font-family:monospace">
                  <span>03:10</span>
                  <span style="color:#2ed573">100%</span>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;margin:auto 0">
                  <div style="background:#d97706;border-radius:2px;height:16px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#000">🔦</div>
                  <div style="background:#991b1b;border-radius:2px;height:16px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff">🎨</div>
                  <div style="background:#3f6212;border-radius:2px;height:16px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff">📡</div>
                  <div style="background:#450a0a;border-radius:2px;height:16px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff">✕</div>
                </div>
                <div style="text-align:center;font-size:7px;color:${curWpObj.accent};font-family:monospace">
                  ${curWpObj.name}
                </div>
              </div>

              <div style="width:12px;height:12px;border-radius:50%;background:#111;border:1px solid ${curCaseObj.glow};margin-top:4px"></div>

              ${curStickerObj.emoji ? `
                <div style="position:absolute;top:-8px;left:-8px;background:#1a090d;border:1px solid ${curStickerObj.color};border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 0 8px ${curStickerObj.color}99;transform:rotate(-10deg)">
                  ${curStickerObj.emoji}
                </div>
              ` : ''}

              ${curCharmObj.emoji ? `
                <div style="position:absolute;bottom:-6px;right:-10px;font-size:18px;filter:drop-shadow(0 0 6px rgba(255,255,255,0.6));transform:rotate(12deg)">
                  ${curCharmObj.emoji}
                </div>
              ` : ''}
            </div>
          </div>

          <div style="flex:1 1 240px;text-align:left;font-size:12.5px;line-height:1.5">
            <div style="color:#fff;font-weight:bold;font-size:14px;margin-bottom:4px">
              ${curCaseObj.name}
            </div>
            <div style="color:#aaa;margin-bottom:8px">
              ${curCaseObj.desc}
            </div>
            <div style="border-top:1px solid #3d1418;padding-top:6px;font-size:12px">
              <div>• Обои: <b style="color:${curWpObj.accent}">${curWpObj.name}</b></div>
              <div>• Брелок: <b style="color:#fd4">${curCharmObj.emoji || '—'} ${curCharmObj.name}</b></div>
              <div>• Стикер: <b style="color:${curStickerObj.color}">${curStickerObj.emoji || '—'} ${curStickerObj.name}</b></div>
              <div>• Корпус: <b style="color:${curCaseObj.glow}">${curCaseObj.name}</b></div>
            </div>
          </div>
        </div>

        <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
          <button id="tab_cases" style="flex:1 1 120px;margin:0;padding:8px;font-size:12px;border-radius:4px;border:1px solid ${activeTab === 'case' ? '#ff4757' : '#44141a'};background:${activeTab === 'case' ? '#5a1219' : '#19080c'};color:${activeTab === 'case' ? '#fff' : '#aaa'};cursor:pointer;font-family:Georgia,serif">
            🎨 Корпуса (${PHONE_CASES.length})
          </button>
          <button id="tab_wallpapers" style="flex:1 1 120px;margin:0;padding:8px;font-size:12px;border-radius:4px;border:1px solid ${activeTab === 'wallpaper' ? '#ff4757' : '#44141a'};background:${activeTab === 'wallpaper' ? '#5a1219' : '#19080c'};color:${activeTab === 'wallpaper' ? '#fff' : '#aaa'};cursor:pointer;font-family:Georgia,serif">
            🖼️ Обои (${PHONE_WALLPAPERS.length})
          </button>
          <button id="tab_charms" style="flex:1 1 120px;margin:0;padding:8px;font-size:12px;border-radius:4px;border:1px solid ${activeTab === 'charm' ? '#ff4757' : '#44141a'};background:${activeTab === 'charm' ? '#5a1219' : '#19080c'};color:${activeTab === 'charm' ? '#fff' : '#aaa'};cursor:pointer;font-family:Georgia,serif">
            ✨ Брелоки (${PHONE_CHARMS.length})
          </button>
          <button id="tab_stickers" style="flex:1 1 120px;margin:0;padding:8px;font-size:12px;border-radius:4px;border:1px solid ${activeTab === 'sticker' ? '#ff4757' : '#44141a'};background:${activeTab === 'sticker' ? '#5a1219' : '#19080c'};color:${activeTab === 'sticker' ? '#fff' : '#aaa'};cursor:pointer;font-family:Georgia,serif">
            🏷️ Стикеры (${PHONE_STICKERS.length})
          </button>
        </div>

        <div id="pcm_items_grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(170px, 1fr));gap:10px;margin-bottom:18px">
          ${renderTabGrid()}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #4a151b;padding-top:14px">
          <div style="font-size:12px;color:#aaa">
            Повышай уровень до 50, чтобы открыть все стили и стикеры!
          </div>
          <button id="pcm_save_btn" style="margin:0;padding:8px 22px;background:#8b0000;border:1px solid #ff4757;color:#fff;border-radius:4px;font-size:14px;font-family:Georgia,serif;cursor:pointer;font-weight:bold">
            Готово
          </button>
        </div>

      </div>
    `;

    bindModalEvents();
  }

  function renderTabGrid() {
    if (activeTab === 'case') {
      return PHONE_CASES.map((item, idx) => {
        const isUnlocked = isPhoneCaseUnlocked(item, info.level, PF);
        const isEquipped = selCase === idx;
        return `
          <div data-idx="${idx}" class="pcm-item-card" style="background:#16090c;border:2px solid ${isEquipped ? '#ff4757' : isUnlocked ? '#4a151b' : '#22080c'};border-radius:6px;padding:10px;text-align:left;cursor:${isUnlocked ? 'pointer' : 'not-allowed'};opacity:${isUnlocked ? 1 : 0.55};position:relative;transition:all 0.15s">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:${item.color};border:1px solid ${item.glow}"></span>
              <span style="font-size:11px;color:${isUnlocked ? '#5d5' : '#e44'}">${isUnlocked ? (isEquipped ? '✓ Надето' : 'Открыто') : (item.xmasUnlockKey ? 'Глава 5 / Ур. ' + item.lvl : `Ур. ${item.lvl}`)}</span>
            </div>
            <div style="font-size:13px;font-weight:bold;color:#fff;margin-bottom:4px">${item.name}</div>
            <div style="font-size:10.5px;color:#888;line-height:1.3">${item.desc}</div>
          </div>
        `;
      }).join('');
    }

    if (activeTab === 'wallpaper') {
      return PHONE_WALLPAPERS.map((item, idx) => {
        const isUnlocked = info.level >= item.lvl;
        const isEquipped = selWallpaper === idx;
        return `
          <div data-idx="${idx}" class="pcm-item-card" style="background:#16090c;border:2px solid ${isEquipped ? '#ff4757' : isUnlocked ? '#4a151b' : '#22080c'};border-radius:6px;padding:10px;text-align:left;cursor:${isUnlocked ? 'pointer' : 'not-allowed'};opacity:${isUnlocked ? 1 : 0.55};position:relative;transition:all 0.15s">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="display:inline-block;width:20px;height:12px;border-radius:2px;background:${item.bg};border:1px solid ${item.accent}"></span>
              <span style="font-size:11px;color:${isUnlocked ? '#5d5' : '#e44'}">${isUnlocked ? (isEquipped ? '✓ Надето' : 'Открыто') : `Ур. ${item.lvl}`}</span>
            </div>
            <div style="font-size:13px;font-weight:bold;color:#fff;margin-bottom:4px">${item.name}</div>
            <div style="font-size:10.5px;color:#888;line-height:1.3">${item.desc}</div>
          </div>
        `;
      }).join('');
    }

    if (activeTab === 'charm') {
      return PHONE_CHARMS.map((item, idx) => {
        const isUnlocked = info.level >= item.lvl;
        const isEquipped = selCharm === idx;
        return `
          <div data-idx="${idx}" class="pcm-item-card" style="background:#16090c;border:2px solid ${isEquipped ? '#ff4757' : isUnlocked ? '#4a151b' : '#22080c'};border-radius:6px;padding:10px;text-align:left;cursor:${isUnlocked ? 'pointer' : 'not-allowed'};opacity:${isUnlocked ? 1 : 0.55};position:relative;transition:all 0.15s">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:18px">${item.emoji || '—'}</span>
              <span style="font-size:11px;color:${isUnlocked ? '#5d5' : '#e44'}">${isUnlocked ? (isEquipped ? '✓ Надето' : 'Открыто') : `Ур. ${item.lvl}`}</span>
            </div>
            <div style="font-size:13px;font-weight:bold;color:#fff;margin-bottom:4px">${item.name}</div>
            <div style="font-size:10.5px;color:#888;line-height:1.3">${item.desc}</div>
          </div>
        `;
      }).join('');
    }

    if (activeTab === 'sticker') {
      return PHONE_STICKERS.map((item, idx) => {
        const isUnlocked = info.level >= item.lvl;
        const isEquipped = selSticker === idx;
        return `
          <div data-idx="${idx}" class="pcm-item-card" style="background:#16090c;border:2px solid ${isEquipped ? '#ff4757' : isUnlocked ? '#4a151b' : '#22080c'};border-radius:6px;padding:10px;text-align:left;cursor:${isUnlocked ? 'pointer' : 'not-allowed'};opacity:${isUnlocked ? 1 : 0.55};position:relative;transition:all 0.15s">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:18px">${item.emoji || '—'}</span>
              <span style="font-size:11px;color:${isUnlocked ? '#5d5' : '#e44'}">${isUnlocked ? (isEquipped ? '✓ Наклеен' : 'Открыт') : `Ур. ${item.lvl}`}</span>
            </div>
            <div style="font-size:13px;font-weight:bold;color:#fff;margin-bottom:4px">${item.name}</div>
            <div style="font-size:10.5px;color:#888;line-height:1.3">${item.desc}</div>
          </div>
        `;
      }).join('');
    }
    return '';
  }

  function bindModalEvents() {
    const closeModal = () => closeAnimatedModal(modal);
    const closeBtn = modal.querySelector('#pcm_close');
    if (closeBtn) closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    const saveBtn = modal.querySelector('#pcm_save_btn');
    if (saveBtn) {
      saveBtn.onclick = () => {
        if (PF) {
          PF.phoneCase = selCase;
          PF.phoneWallpaper = selWallpaper;
          PF.phoneCharm = selCharm;
          PF.phoneSticker = selSticker;
          if (typeof pWrite === 'function') pWrite();
        }
        if (typeof onUpdate === 'function') onUpdate();
        closeModal();
      };
    }

    const tCases = modal.querySelector('#tab_cases');
    if (tCases) tCases.onclick = () => { activeTab = 'case'; renderModalContent(); };

    const tWps = modal.querySelector('#tab_wallpapers');
    if (tWps) tWps.onclick = () => { activeTab = 'wallpaper'; renderModalContent(); };

    const tCharms = modal.querySelector('#tab_charms');
    if (tCharms) tCharms.onclick = () => { activeTab = 'charm'; renderModalContent(); };

    const tStickers = modal.querySelector('#tab_stickers');
    if (tStickers) tStickers.onclick = () => { activeTab = 'sticker'; renderModalContent(); };

    modal.querySelectorAll('.pcm-item-card').forEach((card) => {
      card.onclick = () => {
        const idx = parseInt(card.getAttribute('data-idx') || '0', 10);
        if (activeTab === 'case') {
          if (isPhoneCaseUnlocked(PHONE_CASES[idx], info.level, PF)) {
            selCase = idx;
            if (PF) { PF.phoneCase = selCase; if (pWrite) pWrite(); }
            if (ac && TN) TN(520, 0.08, 0.15, 'sine');
            renderModalContent();
          }
        } else if (activeTab === 'wallpaper') {
          if (info.level >= PHONE_WALLPAPERS[idx].lvl) {
            selWallpaper = idx;
            if (PF) { PF.phoneWallpaper = selWallpaper; if (pWrite) pWrite(); }
            if (ac && TN) TN(600, 0.08, 0.15, 'sine');
            renderModalContent();
          }
        } else if (activeTab === 'charm') {
          if (info.level >= PHONE_CHARMS[idx].lvl) {
            selCharm = idx;
            if (PF) { PF.phoneCharm = selCharm; if (pWrite) pWrite(); }
            if (ac && TN) TN(680, 0.08, 0.15, 'triangle');
            renderModalContent();
          }
        } else if (activeTab === 'sticker') {
          if (info.level >= PHONE_STICKERS[idx].lvl) {
            selSticker = idx;
            if (PF) { PF.phoneSticker = selSticker; if (pWrite) pWrite(); }
            if (ac && TN) TN(740, 0.08, 0.15, 'triangle');
            renderModalContent();
          }
        }
      };
    });
  }

  document.body.appendChild(modal);
  renderModalContent();
  openAnimatedModal(modal);
}


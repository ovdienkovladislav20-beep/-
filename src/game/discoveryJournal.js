/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { trTree, getLocale } from './i18n.js';
import { getCarSpec, CAR_CATALOG, CAR_PAINTS } from './shopCatalog.js';
import { renderCarShowcase3D } from './carModels3D.js';
import { openAnimatedModal, closeAnimatedModal, disposeAnimatedModal } from './uiTransitions.js';

export const VAZ_PARTS_CATALOG = [
  {
    idx: 0,
    id: 'battery',
    name: 'Аккумулятор',
    code: '6СТ-60 · 12V',
    location: 'Открытые боксы кооператива',
    svg: `<svg viewBox="0 0 32 32" width="28" height="28"><rect x="5" y="9" width="22" height="17" rx="2" fill="#1f2937" stroke="#64748b" stroke-width="1.2"/><rect x="7" y="6" width="5" height="3" rx="0.5" fill="#dc2626"/><rect x="20" y="6" width="5" height="3" rx="0.5" fill="#2563eb"/><path d="M16 12l-3 5h3l-1 5 4-6h-3z" fill="#fbbf24"/></svg>`,
    lore: 'Тяжёлый свинцовый аккумулятор с окисленными клеммами. На крышке нацарапана дата «3.10.2026» — в ту ночь свет в гаражном кооперативе №14 погас навсегда, а прежний хозяин ВАЗ-2112 так и не успел затянуть минусовую клемму.',
  },
  {
    idx: 1,
    id: 'spark_plugs',
    name: 'Свечи зажигания',
    code: 'АУ17ДВРМ · 16V',
    location: 'Верстаки ремонтных боксов',
    svg: `<svg viewBox="0 0 32 32" width="28" height="28"><rect x="8" y="8" width="4" height="15" rx="1" fill="#e2e8f0"/><rect x="8" y="16" width="4" height="4" fill="#64748b"/><rect x="14" y="8" width="4" height="15" rx="1" fill="#e2e8f0"/><rect x="14" y="16" width="4" height="4" fill="#64748b"/><rect x="20" y="8" width="4" height="15" rx="1" fill="#e2e8f0"/><rect x="20" y="16" width="4" height="4" fill="#64748b"/><path d="M10 23v3M16 23v3M22 23v3" stroke="#f59e0b" stroke-width="1.6"/></svg>`,
    lore: 'Комплект свечей с густым чёрным нагаром на электродах. Механик лично выкручивал их из каждой заглохшей у ворот машины, чтобы ни один случайный водитель не смог завести мотор и вырваться из-под дождя.',
  },
  {
    idx: 2,
    id: 'alternator',
    name: 'Генератор',
    code: '9402.3701 · 80А',
    location: 'Стеллажи гаражей',
    svg: `<svg viewBox="0 0 32 32" width="28" height="28"><circle cx="16" cy="17" r="9.5" fill="#475569" stroke="#cbd5e1" stroke-width="1.2"/><circle cx="16" cy="17" r="4.5" fill="#1e293b" stroke="#94a3b8" stroke-width="1"/><rect x="13.5" y="5" width="5" height="4" rx="1" fill="#cbd5e1"/><circle cx="16" cy="17" r="1.5" fill="#fbbf24"/></svg>`,
    lore: 'Медная обмотка пахнет гарью и дождевой сыростью. Сторожа шептались, что если раскрутить его шкив в тишине бокса, сквозь сухой свист подшипников слышен хрип человека из смотровой ямы.',
  },
  {
    idx: 3,
    id: 'timing_belt',
    name: 'Ремень ГРМ',
    code: '2112-1006040 · 16V',
    location: 'Инструментальные ниши',
    svg: `<svg viewBox="0 0 32 32" width="28" height="28"><ellipse cx="16" cy="16" rx="10" ry="7" transform="rotate(-18 16 16)" fill="none" stroke="#18181b" stroke-width="4.5"/><ellipse cx="16" cy="16" rx="10" ry="7" transform="rotate(-18 16 16)" fill="none" stroke="#f59e0b" stroke-width="1.3" stroke-dasharray="2.5 2"/></svg>`,
    lore: 'Зубчатый ремень для 16-клапанного мотора «Двенашки». На обратной стороне резины остались бурые следы пальцев — кто-то пытался натянуть его на шкивы в полной темноте, пока за перегородкой волочился тяжёлый разводной ключ.',
  },
  {
    idx: 4,
    id: 'fuel_pump',
    name: 'Бензонасос',
    code: 'ЭБН-2112 · 3.0 БАР',
    location: 'Дальние гаражные боксы',
    svg: `<svg viewBox="0 0 32 32" width="28" height="28"><rect x="10" y="8" width="12" height="18" rx="2" fill="#94a3b8" stroke="#cbd5e1" stroke-width="1"/><rect x="12" y="4.5" width="3" height="4" fill="#ef4444"/><rect x="17" y="4.5" width="3" height="4" fill="#3b82f6"/><rect x="12" y="13" width="8" height="7" rx="1" fill="#334155"/></svg>`,
    lore: 'Погружной топливный модуль в стальном стакане. Предыдущий беглец спрятал его за ящиками с ветошью в надежде вернуться к своему ВАЗ-2112 после полуночи, но оставил на полу лишь сорванный замок.',
  },
  {
    idx: 5,
    id: 'starter',
    name: 'Стартер',
    code: '5702.3708 · 1.5 кВт',
    location: 'Углублённые боксы',
    svg: `<svg viewBox="0 0 32 32" width="28" height="28"><rect x="5" y="13" width="19" height="11" rx="2" fill="#475569" stroke="#94a3b8" stroke-width="1"/><rect x="9" y="8" width="11" height="5.5" rx="1.5" fill="#b45309" stroke="#fbbf24" stroke-width="0.8"/><rect x="24" y="15" width="4" height="7" rx="1" fill="#cbd5e1"/></svg>`,
    lore: 'Тяжёлый редукторный стартер с трещиной на втягивающем реле. Без него шестнадцатиклапанник не подаст признаков жизни, а каждый пустой щелчок замка зажигания эхом разносится по мокрому двору и приманивает Механика.',
  },
  {
    idx: 6,
    id: 'ecu_janvar',
    name: 'ЭБУ «Январь»',
    code: 'ЯНВАРЬ 5.1 · 2112',
    location: 'Закрытые полки и верстаки',
    svg: `<svg viewBox="0 0 32 32" width="28" height="28"><rect x="5" y="8" width="22" height="16" rx="2" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/><rect x="8" y="11" width="6" height="6" rx="0.5" fill="#22c55e"/><rect x="17" y="11" width="7" height="10" rx="0.5" fill="#eab308"/><path d="M9 20h5" stroke="#38bdf8" stroke-width="1.4"/></svg>`,
    lore: 'Перепаянный блок управления впрыском топлива. Под алюминиевой крышкой спрятана записка с распиновкой разъёма и торопливым предупреждением: «Завёл — жми в пол и не оборачивайся на красный свет в зеркале».',
  },
  {
    idx: 7,
    id: 'radiator',
    name: 'Радиатор охлаждения',
    code: '2112-1301012 · АЛЮМ',
    location: 'Ремонтные верстаки №1–6',
    svg: `<svg viewBox="0 0 32 32" width="28" height="28"><rect x="4" y="8" width="24" height="16" rx="1.5" fill="#475569" stroke="#cbd5e1" stroke-width="1.2"/><path d="M8 10v12M11 10v12M14 10v12M17 10v12M20 10v12M23 10v12" stroke="#94a3b8" stroke-width="1.2"/><rect x="21" y="5" width="4" height="3" fill="#eab308"/></svg>`,
    lore: 'Алюминиевый радиатор с помятыми сотами. На дне бачка вместо тосола плескалась бурая ржавая вода, а к крышке прилипла обгоревшая квитанция за ночную стоянку в 1998 году.',
  },
  {
    idx: 8,
    id: 'ignition_coil',
    name: 'Катушка зажигания',
    code: '2112-3705010 · 4-КОН',
    location: 'Инструментальные стеллажи',
    svg: `<svg viewBox="0 0 32 32" width="28" height="28"><rect x="6" y="14" width="20" height="11" rx="2" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/><rect x="8" y="8" width="3" height="6" fill="#94a3b8"/><rect x="12.5" y="8" width="3" height="6" fill="#94a3b8"/><rect x="17" y="8" width="3" height="6" fill="#94a3b8"/><rect x="21.5" y="8" width="3" height="6" fill="#94a3b8"/><circle cx="16" cy="20" r="2" fill="#38bdf8"/></svg>`,
    lore: 'Четырёхвыводной модуль зажигания. Если поднести его к уху в грозу, внутри залитой эпоксидкой обмотки проскакивает сухой синий разряд, повторяющий ритм чьего-то сердца.',
  },
  {
    idx: 9,
    id: 'maf_sensor',
    name: 'Датчик ДМРВ',
    code: 'BOSCH · 0280218037',
    location: 'Полки диагностического бокса',
    svg: `<svg viewBox="0 0 32 32" width="28" height="28"><rect x="6" y="11" width="20" height="10" rx="4" fill="#1f2937" stroke="#94a3b8" stroke-width="1.2"/><circle cx="10" cy="16" r="3.5" fill="#0f172a" stroke="#64748b"/><rect x="13" y="7" width="8" height="5" rx="1" fill="#334155" stroke="#eab308" stroke-width="0.8"/></svg>`,
    lore: 'Датчик массового расхода воздуха со стальной сеткой. Предыдущий владелец писал на корпусе маркером показания «1.03V», будто надеялся доказать кому-то, что машина ещё жива.',
  },
  {
    idx: 10,
    id: 'clutch_disc',
    name: 'Диск сцепления',
    code: '2112-1601130 · ФРИКЦ',
    location: 'Дальние углы боксов',
    svg: `<svg viewBox="0 0 32 32" width="28" height="28"><circle cx="16" cy="16" r="10.5" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/><circle cx="16" cy="16" r="6" fill="#475569"/><circle cx="16" cy="16" r="2.5" fill="#0f172a"/><rect x="14.5" y="11" width="3" height="2" fill="#f59e0b"/><rect x="14.5" y="19" width="3" height="2" fill="#f59e0b"/></svg>`,
    lore: 'Ведомый диск сцепления с подпаленными демпферными пружинами. Запах горелой накладки до сих пор висит в боксе №11, где кто-то отчаянно пытался тронуться со второй передачи.',
  },
  {
    idx: 11,
    id: 'brake_cylinder',
    name: 'Тормозной цилиндр',
    code: '2112-3505010 · ГТЦ',
    location: 'Открытые ниши южного двора',
    svg: `<svg viewBox="0 0 32 32" width="28" height="28"><rect x="6" y="15" width="18" height="8" rx="2" fill="#64748b" stroke="#cbd5e1" stroke-width="1"/><rect x="10" y="7" width="10" height="8" rx="1.5" fill="#fef3c7" stroke="#94a3b8" stroke-width="1"/><rect x="11" y="10" width="8" height="4" fill="#d97706"/><circle cx="25" cy="19" r="2.5" fill="#334155"/></svg>`,
    lore: 'Главный тормозной цилиндр с мутным бачком жидкости «Роса». Трубки аккуратно перекушены кусачками — Механик не любит, когда машины тормозят перед его шлагбаумом.',
  },
  {
    idx: 12,
    id: 'steering_rack',
    name: 'Рулевая рейка',
    code: '2112-3400012 · ЭУР',
    location: 'Смотровые ямы и стеллажи',
    svg: `<svg viewBox="0 0 32 32" width="28" height="28"><rect x="3" y="14" width="26" height="4" rx="1.5" fill="#475569" stroke="#cbd5e1" stroke-width="1"/><rect x="8" y="12" width="5" height="8" rx="1" fill="#18181b"/><rect x="19" y="12" width="5" height="8" rx="1" fill="#18181b"/><path d="M15 8l2 6" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    lore: 'Рейка с порванными резиновыми пыльниками. При резком повороте вал клинит ровно на пол-оборота, словно невидимая рука настойчиво уводит руль обратно в тёмный кооператив.',
  },
  {
    idx: 13,
    id: 'exhaust_muffler',
    name: 'Глушитель основной',
    code: '2112-1201010 · НЕРЖ',
    location: 'Запасные боксы у ворот',
    svg: `<svg viewBox="0 0 32 32" width="28" height="28"><rect x="9" y="11" width="15" height="10" rx="3" fill="#64748b" stroke="#e2e8f0" stroke-width="1.2"/><path d="M3 16h6M24 16h4l2 3" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>`,
    lore: 'Тяжёлый резонатор глушителя со сквозной вмятиной от разводного ключа. Без него рёв мотора «Двенашки» поднимает с места всё, что таится между старых кирпичных стен.',
  },
];

export const JOURNAL_STORAGE_KEY = 'horror_vaz_parts_found';
export const NOTES_STORAGE_KEY = 'horror_maze_notes_found';

export const MAZE_NOTES_CATALOG = [
  {
    idx: 0,
    id: 'note_scratches',
    title: 'Записка №1 — Царапины на бетоне',
    author: 'Узник №07',
    location: 'Коридоры Лабиринта (Глава 1)',
    text: 'Я слышу, как кто-то дышит прямо за углом. Шаги тяжёлые, будто по воде тянут железную цепь. Если мой фонарик мигнул дважды — он уже в соседнем проходе. Не беги вслепую: сначала найди шкаф.',
  },
  {
    idx: 1,
    id: 'note_counting',
    title: 'Записка №2 — Счёт в темноте',
    author: 'Охранник Семён',
    location: 'Северный сектор Лабиринта (Глава 1)',
    text: 'Я пересчитываю ключи каждую смену. Один — у двери подсобки, второй — среди завалов, третий кто-то унёс ближе к клетке. Но когда я свечу под решётку, оттуда на меня смотрят чужие красные глаза и улыбаются.',
  },
  {
    idx: 2,
    id: 'note_flashlight',
    title: 'Записка №3 — Батарейка садится',
    author: 'Пропавшая Лиза',
    location: 'Западный тупик Лабиринта (Глава 1)',
    text: 'Батарея упала ниже десяти процентов. Свет стал жёлтым и тусклым, но я всё ещё различаю длинные тени на сырой стене. Когда луч гаснет полностью, оно подходит бесшумно и шепчет моё имя.',
  },
  {
    idx: 3,
    id: 'note_cage_voice',
    title: 'Записка №4 — Голос у решётки',
    author: 'Неизвестный беглец',
    location: 'Около стальной клетки (Глава 1)',
    text: 'Вчера ночью из запертой камеры звали на помощь. Я сунул руку между прутьями с отвёрткой, чтобы взломать замок... Пальцы коснулись ледяной кожи. Там никого живого нет уже много лет.',
  },
  {
    idx: 4,
    id: 'note_dont_turn',
    title: 'Записка №5 — Главное правило',
    author: 'Выцарапано ножом',
    location: 'Перекрёсток Лабиринта (Глава 1)',
    text: 'ЕСЛИ ПОЧУВСТВУЕШЬ ЧЬЁ-ТО ДЫХАНИЕ НА ЗАТЫЛКЕ — НЕ ОБОРАЧИВАЙСЯ. Оно питается твоим взглядом. Иди вперёд на свет зелёного табло «ВЫХОД» и не смей проверять, что стоит сзади.',
  },
  {
    idx: 5,
    id: 'note_footprints',
    title: 'Записка №6 — Мокрые следы',
    author: 'Исследователь К.',
    location: 'Южное крыло Лабиринта (Глава 1)',
    text: 'На каменном полу появляются свежие мокрые следы босиком — хотя я в сапогах и здесь нет воды. Они обрываются ровно в том месте, где дверь захлопнулась сама собой.',
  },
  {
    idx: 6,
    id: 'note_clock',
    title: 'Записка №7 — Половица под шкафом',
    author: 'Бывший электрик',
    location: 'Подсобка охраны (Глава 1)',
    text: 'Я спрятал запасную батарейку за металлическим шкафом. Если успеешь повернуть рубильник — может, ещё увидишь утро. Но мне кажется, время внутри этих стен остановилось на 03:14.',
  },
  {
    idx: 7,
    id: 'note_door_no_lock',
    title: 'Записка №8 — Дверь без замка',
    author: 'Последний лист дневника',
    location: 'Дальний коридор у выхода (Глава 1)',
    text: 'Три ключа открывают лишь первую створку. За ней ждёт особняк, потом погост и старые гаражи... Если выберешься к трассе — гони без остановки и не верь ни одной попутной машине.',
  },
];

export function normalizeDiscoveredMap(raw) {
  const out = {};
  if (Array.isArray(raw)) {
    for (const v of raw) {
      const idx = Number(v);
      if (Number.isInteger(idx) && idx >= 0 && idx < VAZ_PARTS_CATALOG.length) {
        out[idx] = { foundAt: Date.now(), count: 1 };
      }
    }
    return out;
  }
  if (raw && typeof raw === 'object') {
    for (const [k, v] of Object.entries(raw)) {
      const idx = Number(k);
      if (!Number.isInteger(idx) || idx < 0 || idx >= VAZ_PARTS_CATALOG.length || !v) continue;
      if (typeof v === 'object') {
        out[idx] = {
          foundAt: Number(v.foundAt) || Date.now(),
          count: Math.max(1, Number(v.count) || 1),
        };
      } else {
        out[idx] = { foundAt: Date.now(), count: 1 };
      }
    }
  }
  return out;
}

export function mergeDiscoveredParts(a, b) {
  const na = normalizeDiscoveredMap(a);
  const nb = normalizeDiscoveredMap(b);
  const merged = { ...na };
  for (const [k, vb] of Object.entries(nb)) {
    const va = merged[k];
    if (!va) {
      merged[k] = { ...vb };
    } else {
      merged[k] = {
        foundAt: Math.min(va.foundAt || Date.now(), vb.foundAt || Date.now()),
        count: Math.max(va.count || 1, vb.count || 1),
      };
    }
  }
  return merged;
}

export function getDiscoveredParts(PF) {
  let lsData = {};
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (raw) lsData = JSON.parse(raw);
  } catch (e) {}
  return mergeDiscoveredParts(lsData, PF && PF.foundVazParts);
}

export function saveDiscoveredParts(map, PF, pWrite) {
  const norm = normalizeDiscoveredMap(map);
  try {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(norm));
  } catch (e) {}
  if (PF) {
    PF.foundVazParts = norm;
  }
  if (typeof pWrite === 'function') {
    pWrite();
  }
  return norm;
}

export function normalizeDiscoveredNotes(raw) {
  const out = {};
  if (Array.isArray(raw)) {
    for (const v of raw) {
      const idx = Number(v);
      if (Number.isInteger(idx) && idx >= 0 && idx < MAZE_NOTES_CATALOG.length) {
        out[idx] = { foundAt: Date.now(), count: 1 };
      }
    }
    return out;
  }
  if (raw && typeof raw === 'object') {
    for (const [k, v] of Object.entries(raw)) {
      const idx = Number(k);
      if (!Number.isInteger(idx) || idx < 0 || idx >= MAZE_NOTES_CATALOG.length || !v) continue;
      if (typeof v === 'object') {
        out[idx] = {
          foundAt: Number(v.foundAt) || Date.now(),
          count: Math.max(1, Number(v.count) || 1),
        };
      } else {
        out[idx] = { foundAt: Date.now(), count: 1 };
      }
    }
  }
  return out;
}

export function mergeDiscoveredNotes(a, b) {
  const na = normalizeDiscoveredNotes(a);
  const nb = normalizeDiscoveredNotes(b);
  const merged = { ...na };
  for (const [k, vb] of Object.entries(nb)) {
    const va = merged[k];
    if (!va) {
      merged[k] = { ...vb };
    } else {
      merged[k] = {
        foundAt: Math.min(va.foundAt || Date.now(), vb.foundAt || Date.now()),
        count: Math.max(va.count || 1, vb.count || 1),
      };
    }
  }
  return merged;
}

export function getDiscoveredNotes(PF) {
  let lsData = {};
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (raw) lsData = JSON.parse(raw);
  } catch (e) {}
  return mergeDiscoveredNotes(lsData, PF && PF.foundMazeNotes);
}

export function saveDiscoveredNotes(map, PF, pWrite) {
  const norm = normalizeDiscoveredNotes(map);
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(norm));
  } catch (e) {}
  if (PF) {
    PF.foundMazeNotes = norm;
  }
  if (typeof pWrite === 'function') {
    pWrite();
  }
  return norm;
}

export function showMazeNoteToast(note) {
  if (typeof document === 'undefined' || !note) return;
  let container = document.getElementById('journal_toast_container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'journal_toast_container';
    container.style.cssText =
      'position:fixed;top:20px;left:20px;z-index:99998;display:flex;flex-direction:column;gap:10px;pointer-events:none;max-width:360px;width:calc(100% - 40px)';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.style.cssText =
    'background:linear-gradient(135deg, rgba(36, 12, 16, 0.97) 0%, rgba(15, 7, 9, 0.99) 100%);' +
    'border:1.5px solid #dc2626;' +
    'border-radius:10px;' +
    'padding:12px 14px;' +
    'box-shadow:0 8px 26px rgba(0,0,0,0.85), 0 0 22px rgba(220,38,38,0.4);' +
    'display:flex;align-items:flex-start;gap:12px;' +
    'color:#fff;font-family:Georgia,serif;' +
    'pointer-events:auto;cursor:pointer;' +
    'transform:translateX(-120%);opacity:0;transition:all 0.38s cubic-bezier(0.16, 1, 0.3, 1);' +
    'box-sizing:border-box;backdrop-filter:blur(8px);';

  toast.innerHTML = `
    <div style="width:42px;height:42px;border-radius:8px;background:rgba(220,38,38,0.22);border:1px solid #f87171;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:22px">
      📜
    </div>
    <div style="flex:1;min-width:0;text-align:left">
      <div style="font-size:10.5px;font-weight:bold;letter-spacing:0.1em;color:#fca5a5;text-transform:uppercase;margin-bottom:2px">
        🩸 СТРАШНАЯ ЗАПИСКА НАЙДЕНА
      </div>
      <div style="font-size:13.5px;font-weight:bold;color:#fff;line-height:1.25">
        ${note.title}
      </div>
      <div style="font-size:11.5px;color:#e5d3d6;margin-top:4px;line-height:1.35;font-style:italic">
        «${note.text.slice(0, 96)}${note.text.length > 96 ? '...' : ''}»
      </div>
      <div style="font-size:10.5px;color:#fbbf24;margin-top:4px">
        Полный текст добавлен в Журнал находок
      </div>
    </div>
  `;

  container.appendChild(toast);
  trTree(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  });

  const dismiss = () => {
    toast.style.transform = 'translateX(-120%)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 380);
  };
  toast.onclick = dismiss;
  setTimeout(dismiss, 6200);
}

export function discoverMazeNote(idx, PF, pWrite, ctx = {}) {
  const n = Number(idx);
  if (!Number.isInteger(n) || n < 0 || n >= MAZE_NOTES_CATALOG.length) return false;
  const current = getDiscoveredNotes(PF);
  const isNew = !current[n];
  current[n] = {
    foundAt: current[n]?.foundAt || Date.now(),
    count: (current[n]?.count || 0) + 1,
  };
  saveDiscoveredNotes(current, PF, pWrite);
  const note = MAZE_NOTES_CATALOG[n];
  showMazeNoteToast(note);
  try {
    if (ctx.TN) {
      ctx.TN(330, 0.14, 0.18, 'triangle');
      setTimeout(() => ctx.TN(247, 0.25, 0.16, 'sine'), 110);
    }
  } catch (e) {}
  return isNew;
}

export function showJournalPartToast(part, PF) {
  if (typeof document === 'undefined' || !part) return;
  const eqCar = getCarSpec((PF && PF.eqCar) || 'vaz2112');
  let container = document.getElementById('journal_toast_container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'journal_toast_container';
    container.style.cssText =
      'position:fixed;top:20px;left:20px;z-index:99998;display:flex;flex-direction:column;gap:10px;pointer-events:none;max-width:340px;width:calc(100% - 40px)';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.style.cssText =
    'background:linear-gradient(135deg, rgba(28, 16, 8, 0.96) 0%, rgba(12, 8, 6, 0.98) 100%);' +
    'border:1.5px solid #d97706;' +
    'border-radius:10px;' +
    'padding:12px 14px;' +
    'box-shadow:0 8px 26px rgba(0,0,0,0.8), 0 0 18px rgba(217,119,6,0.35);' +
    'display:flex;align-items:center;gap:12px;' +
    'color:#fff;font-family:Georgia,serif;' +
    'pointer-events:auto;cursor:pointer;' +
    'transform:translateX(-120%);opacity:0;transition:all 0.38s cubic-bezier(0.16, 1, 0.3, 1);' +
    'box-sizing:border-box;backdrop-filter:blur(8px);';

  toast.innerHTML = `
    <div style="width:42px;height:42px;border-radius:8px;background:rgba(217,119,6,0.2);border:1px solid #f59e0b;display:flex;align-items:center;justify-content:center;flex-shrink:0">
      ${part.svg}
    </div>
    <div style="flex:1;min-width:0;text-align:left">
      <div style="font-size:10.5px;font-weight:bold;letter-spacing:0.1em;color:#fbbf24;text-transform:uppercase;margin-bottom:2px">
        📓 ЗАПИСЬ В ЖУРНАЛЕ НАХОДОК
      </div>
      <div style="font-size:14px;font-weight:bold;color:#fff;line-height:1.2">
        ${part.name}
      </div>
      <div style="font-size:11px;color:#cbd5e1;margin-top:2px">
        Открыто описание в лоре ${eqCar.name}
      </div>
    </div>
  `;

  container.appendChild(toast);
  trTree(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  });

  const dismiss = () => {
    toast.style.transform = 'translateX(-120%)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 380);
  };
  toast.onclick = dismiss;
  setTimeout(dismiss, 4500);
}

export function discoverVazPart(idx, PF, pWrite, ctx = {}) {
  const n = Number(idx);
  if (!Number.isInteger(n) || n < 0 || n >= VAZ_PARTS_CATALOG.length) return false;
  const current = getDiscoveredParts(PF);
  const isNew = !current[n];
  current[n] = {
    foundAt: current[n]?.foundAt || Date.now(),
    count: (current[n]?.count || 0) + 1,
  };
  saveDiscoveredParts(current, PF, pWrite);
  if (isNew) {
    const part = VAZ_PARTS_CATALOG[n];
    showJournalPartToast(part, PF);
    try {
      if (ctx.TN) {
        ctx.TN(587, 0.1, 0.16, 'triangle');
        setTimeout(() => ctx.TN(880, 0.18, 0.18, 'triangle'), 90);
      }
    } catch (e) {}
  }
  return isNew;
}

export function showDiscoveryJournalModal(PF, callbacks = {}) {
  if (typeof document === 'undefined') return;

  const existing = document.getElementById('discovery_journal_modal');
  if (existing) disposeAnimatedModal(existing);

  const eqCar = getCarSpec((PF && PF.eqCar) || 'vaz2112');
  const carColor = (PF && PF.carColors && PF.carColors[eqCar.id]) || eqCar.defaultColor;

  const discovered = getDiscoveredParts(PF);
  const totalCount = VAZ_PARTS_CATALOG.length;
  const foundCount = Object.keys(discovered).length;
  const percent = Math.round((foundCount / totalCount) * 100);

  const discoveredNotes = getDiscoveredNotes(PF);
  const totalNotesCount = MAZE_NOTES_CATALOG.length;
  const foundNotesCount = Object.keys(discoveredNotes).length;
  const notesPercent = Math.round((foundNotesCount / totalNotesCount) * 100);

  const ownedCarsSet = new Set(Array.isArray(PF && PF.ownedCars) ? PF.ownedCars : ['vaz2112']);
  ownedCarsSet.add('vaz2112');
  const totalCarsCount = CAR_CATALOG.length;
  const ownedCarsCount = CAR_CATALOG.filter((c) => ownedCarsSet.has(c.id)).length;
  const carsPercent = Math.round((ownedCarsCount / totalCarsCount) * 100);

  let artifactsFilter = callbacks.initialTab === 'found' ? 'found' : 'all';
  let carsFilter = 'all';
  let activeTab =
    callbacks.initialTab === 'found' || callbacks.initialTab === 'all' || callbacks.initialTab === 'artifacts'
      ? 'artifacts'
      : callbacks.initialTab === 'cars'
        ? 'cars'
        : 'notes';

  const modal = document.createElement('div');
  modal.id = 'discovery_journal_modal';
  modal.style.cssText =
    'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9500;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box';

  modal.innerHTML = `
    <div style="background:#0e0907;border:2px solid #d97706;width:100%;max-width:690px;max-height:90vh;border-radius:12px;display:flex;flex-direction:column;color:#eee;font-family:Georgia,serif;box-shadow:0 0 42px rgba(217,119,6,0.35);position:relative;box-sizing:border-box;overflow:hidden">
      <!-- Header -->
      <div style="padding:16px 20px 14px;border-bottom:1px solid #4a2810;background:linear-gradient(180deg,#231308 0%,#0e0907 100%);display:flex;align-items:center;justify-content:space-between;gap:12px">
        <div style="display:flex;align-items:center;gap:12px;text-align:left">
          <span style="font-size:30px">📓</span>
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <h2 style="margin:0;font-size:18px;letter-spacing:0.06em;color:#fde68a">ЖУРНАЛ НАХОДОК · ${eqCar.name}</h2>
              <span title="${eqCar.name}" style="display:inline-block;width:13px;height:13px;border-radius:3px;background:${carColor};border:1px solid #fde68a"></span>
            </div>
            <div style="font-size:12.5px;color:#cbd5e1;margin-top:3px">
              Записки: <b style="color:#fca5a5">${foundNotesCount}/${totalNotesCount}</b> · Машины: <b style="color:#93c5fd">${ownedCarsCount}/${totalCarsCount}</b> · Артефакты: <b style="color:#fbbf24">${foundCount}/${totalCount}</b>
            </div>
            <div style="font-size:11px;color:#94a3b8;margin-top:2px">
              Нужно для побега на ${eqCar.name}: ${eqCar.partsEasy} / ${eqCar.partsHard} / ${eqCar.partsExtreme} дет.
            </div>
          </div>
        </div>
        <button id="journal_close" style="background:transparent;border:0;color:#aaa;font-size:22px;cursor:pointer;padding:6px;line-height:1">✕</button>
      </div>

      <!-- Progress & Main Tabs -->
      <div style="padding:11px 20px 12px;background:#140d09;border-bottom:1px solid #3a1f0c">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px">
          <span id="journal_progress_label" style="font-size:11.5px;color:#d6c7b8"></span>
          <span id="journal_progress_pct" style="font-size:11.5px;font-weight:bold;color:#fde68a">0%</span>
        </div>
        <div style="width:100%;height:8px;background:#26160b;border-radius:4px;overflow:hidden;border:1px solid #5c3114">
          <div id="journal_progress_fill" style="width:0%;height:100%;background:linear-gradient(90deg, #b45309, #fbbf24);transition:width 0.38s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease"></div>
        </div>
        <div role="tablist" aria-label="Разделы журнала находок" style="display:flex;gap:8px;margin-top:11px;flex-wrap:wrap">
          <button id="jtab_notes" role="tab" class="journal-tab-btn" style="flex:1 1 130px;margin:0;padding:8px 14px;font-size:13px;border-radius:7px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
            <span>📜</span>
            <span>Записки</span>
            <span style="font-size:11px;opacity:0.85">(${foundNotesCount}/${totalNotesCount})</span>
          </button>
          <button id="jtab_cars" role="tab" class="journal-tab-btn" style="flex:1 1 130px;margin:0;padding:8px 14px;font-size:13px;border-radius:7px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
            <span>🚗</span>
            <span>Машины</span>
            <span style="font-size:11px;opacity:0.85">(${ownedCarsCount}/${totalCarsCount})</span>
          </button>
          <button id="jtab_artifacts" role="tab" class="journal-tab-btn" style="flex:1 1 130px;margin:0;padding:8px 14px;font-size:13px;border-radius:7px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
            <span>⚙️</span>
            <span>Артефакты</span>
            <span style="font-size:11px;opacity:0.85">(${foundCount}/${totalCount})</span>
          </button>
        </div>
      </div>

      <!-- Body List -->
      <div id="journal_tab_body" style="flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column"></div>

      <!-- Footer -->
      <div style="padding:12px 20px;border-top:1px solid #4a2810;background:#140b07;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:12px;color:#b8a898">Находки, записки и автопарк сохраняются в профиле навсегда 🚗📜</span>
        <button id="journal_ok" style="margin:0;padding:8px 20px;font-size:13px;background:#78350f;border:1px solid #f59e0b;color:#fff;border-radius:5px;cursor:pointer;font-weight:bold">Закрыть</button>
      </div>
    </div>
  `;

  trTree(modal);

  const tabBody = modal.querySelector('#journal_tab_body');
  const progressFill = modal.querySelector('#journal_progress_fill');
  const progressLabel = modal.querySelector('#journal_progress_label');
  const progressPct = modal.querySelector('#journal_progress_pct');
  const btnNotes = modal.querySelector('#jtab_notes');
  const btnCars = modal.querySelector('#jtab_cars');
  const btnArtifacts = modal.querySelector('#jtab_artifacts');

  const closeModal = () => closeAnimatedModal(modal);
  const btnClose = modal.querySelector('#journal_close');
  const btnOk = modal.querySelector('#journal_ok');
  if (btnClose) btnClose.onclick = closeModal;
  if (btnOk) btnOk.onclick = closeModal;

  function applyTabButtonStyles() {
    const configs = [
      {
        btn: btnNotes,
        active: activeTab === 'notes',
        bg: 'linear-gradient(180deg, #7f1d1d 0%, #450a0a 100%)',
        border: '#f87171',
        glow: '0 0 16px rgba(248,113,113,0.28)',
      },
      {
        btn: btnCars,
        active: activeTab === 'cars',
        bg: 'linear-gradient(180deg, #334155 0%, #0f172a 100%)',
        border: '#94a3b8',
        glow: '0 0 16px rgba(148,163,184,0.22)',
      },
      {
        btn: btnArtifacts,
        active: activeTab === 'artifacts',
        bg: 'linear-gradient(180deg, #92400e 0%, #451a03 100%)',
        border: '#fbbf24',
        glow: '0 0 16px rgba(251,191,36,0.28)',
      },
    ];
    for (const c of configs) {
      if (!c.btn) continue;
      c.btn.setAttribute('aria-selected', c.active ? 'true' : 'false');
      c.btn.style.background = c.active ? c.bg : '#21130b';
      c.btn.style.border = `1px solid ${c.active ? c.border : '#4a2810'}`;
      c.btn.style.color = c.active ? '#fff' : '#cbd5e1';
      c.btn.style.fontWeight = c.active ? 'bold' : 'normal';
      c.btn.style.boxShadow = c.active ? c.glow : 'none';
    }
  }

  function updateProgressHeader() {
    if (!progressFill || !progressLabel || !progressPct) return;
    if (activeTab === 'notes') {
      progressFill.style.width = `${notesPercent}%`;
      progressFill.style.background = 'linear-gradient(90deg, #991b1b, #f87171)';
      progressLabel.textContent = `Страшные записки из Лабиринта: ${foundNotesCount} из ${totalNotesCount}`;
      progressPct.textContent = `${notesPercent}%`;
      progressPct.style.color = '#fca5a5';
    } else if (activeTab === 'cars') {
      progressFill.style.width = `${carsPercent}%`;
      progressFill.style.background = 'linear-gradient(90deg, #475569, #94a3b8)';
      progressLabel.textContent = `Автопарк гаража №4: ${ownedCarsCount} из ${totalCarsCount}`;
      progressPct.textContent = `${carsPercent}%`;
      progressPct.style.color = '#cbd5e1';
    } else {
      progressFill.style.width = `${percent}%`;
      progressFill.style.background = 'linear-gradient(90deg, #b45309, #fbbf24)';
      progressLabel.textContent = `Детали и артефакты для ${eqCar.name}: ${foundCount} из ${totalCount}`;
      progressPct.textContent = `${percent}%`;
      progressPct.style.color = '#fde68a';
    }
    trTree(progressLabel);
  }

  function buildNotesHtml(loc) {
    return MAZE_NOTES_CATALOG.map((note, idx) => {
      const delay = `${Math.min(idx, 10) * 28}ms`;
      const entry = discoveredNotes[note.idx];
      const isFound = Boolean(entry);
      const dateStr =
        isFound && entry.foundAt ? new Date(entry.foundAt).toLocaleDateString(loc) : '';
      if (!isFound) {
        return `
          <div class="journal-card-anim" style="--j-delay:${delay};display:flex;align-items:flex-start;gap:14px;padding:13px 14px;border-radius:9px;background:rgba(20,10,12,0.72);border:1px solid #3f161b;opacity:0.78;text-align:left">
            <div style="width:44px;height:44px;border-radius:8px;background:#1c0c0f;border:1px solid #591c22;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">
              🔒
            </div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
                <span style="font-size:14.5px;font-weight:bold;color:#fca5a5">Ненайденная записка №${note.idx + 1}</span>
                <span style="font-size:11px;color:#9ca3af;padding:2px 7px;border-radius:4px;background:#1a0c0f;border:1px solid #4a1c22">Лабиринт</span>
              </div>
              <div style="font-size:12px;color:#a89598;margin-top:5px;line-height:1.4">
                Осматривай коридоры и тупики Лабиринта (Глава 1), чтобы найти этот оборванный листок и прочесть его текст здесь.
              </div>
            </div>
          </div>
        `;
      }
      return `
        <div class="journal-card-anim" style="--j-delay:${delay};display:flex;align-items:flex-start;gap:14px;padding:14px;border-radius:9px;background:linear-gradient(180deg, rgba(42,14,18,0.88) 0%, rgba(18,8,10,0.92) 100%);border:1px solid #dc2626;box-shadow:0 2px 14px rgba(0,0,0,0.5);text-align:left">
          <div style="width:46px;height:46px;border-radius:9px;background:radial-gradient(circle, rgba(220,38,38,0.28) 0%, rgba(28,8,10,0.95) 85%);border:1.5px solid #f87171;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:24px">
            📜
          </div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
              <span style="font-size:15px;font-weight:bold;color:#fee2e2">${note.title}</span>
              <span style="font-size:11px;color:#fca5a5;padding:2px 7px;border-radius:4px;background:rgba(153,27,27,0.35);border:1px solid #991b1b">${note.author}</span>
            </div>
            <div style="font-size:11px;color:#f87171;margin-top:4px">
              ✓ Найдена в лабиринте${dateStr ? ' • ' + dateStr : ''}
            </div>
            <div style="font-size:13px;color:#f5e6e8;margin-top:8px;line-height:1.52;font-style:italic;padding:8px 10px;border-left:2px solid #ef4444;background:rgba(0,0,0,0.28);border-radius:0 6px 6px 0">
              «${note.text}»
            </div>
            <div style="font-size:11px;color:#a89598;margin-top:6px">
              Место: ${note.location}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function buildCarsHtml() {
    const carsList =
      carsFilter === 'owned' ? CAR_CATALOG.filter((c) => ownedCarsSet.has(c.id)) : CAR_CATALOG;
    const filterBar = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:2px">
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button id="jcar_filter_all" class="journal-tab-btn" style="margin:0;padding:5px 11px;font-size:12px;border-radius:5px;cursor:pointer;background:${carsFilter === 'all' ? '#334155' : '#11151d'};color:#e7dec8;border:1px solid ${carsFilter === 'all' ? '#94a3b8' : '#2c364d'};font-weight:${carsFilter === 'all' ? 'bold' : 'normal'}">Все модели (${totalCarsCount})</button>
          <button id="jcar_filter_owned" class="journal-tab-btn" style="margin:0;padding:5px 11px;font-size:12px;border-radius:5px;cursor:pointer;background:${carsFilter === 'owned' ? '#334155' : '#11151d'};color:#e7dec8;border:1px solid ${carsFilter === 'owned' ? '#94a3b8' : '#2c364d'};font-weight:${carsFilter === 'owned' ? 'bold' : 'normal'}">В моём гараже (${ownedCarsCount})</button>
        </div>
        <span style="font-size:11px;color:#b5a795">Наведи курсор на 3D-модель, чтобы осмотреть</span>
      </div>
    `;

    const cards = carsList
      .map((car, idx) => {
        const delay = `${Math.min(idx, 10) * 24}ms`;
        const isOwned = ownedCarsSet.has(car.id);
        const isEq = eqCar.id === car.id;
        const paintHex = (PF && PF.carColors && PF.carColors[car.id]) || car.defaultColor;
        const paintPreset = CAR_PAINTS.find((p) => p.hex.toLowerCase() === String(paintHex).toLowerCase());
        const paintLabel = paintPreset ? paintPreset.name : 'Заводской';
        const statusBadge = isEq
          ? `<span style="font-size:11px;font-weight:bold;color:#fde68a;padding:2px 8px;border-radius:4px;background:rgba(180,83,9,0.35);border:1px solid #f59e0b">★ Выбрана</span>`
          : isOwned
            ? `<span style="font-size:11px;font-weight:bold;color:#86efac;padding:2px 8px;border-radius:4px;background:rgba(22,101,52,0.35);border:1px solid #22c55e">✓ В гараже</span>`
            : `<span style="font-size:11px;font-weight:bold;color:#cbd5e1;padding:2px 8px;border-radius:4px;background:rgba(30,41,59,0.55);border:1px solid #475569">🔒 ${car.price} 💰</span>`;

        return `
          <div class="journal-card-anim" style="--j-delay:${delay};display:flex;align-items:stretch;gap:14px;padding:12px;border-radius:9px;background:${isEq ? 'linear-gradient(180deg, rgba(24,39,66,0.9) 0%, rgba(13,18,30,0.95) 100%)' : isOwned ? 'linear-gradient(180deg, rgba(19,29,48,0.86) 0%, rgba(12,16,26,0.92) 100%)' : 'rgba(14,17,24,0.78)'};border:1px solid ${isEq ? '#60a5fa' : isOwned ? '#2563eb' : '#2a3347'};box-shadow:0 2px 12px rgba(0,0,0,0.42);text-align:left;flex-wrap:wrap">
            <div style="width:146px;flex:0 0 146px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#090d14;border:1px solid ${isEq ? '#60a5fa' : '#253147'};border-radius:7px;overflow:hidden;position:relative">
              <canvas class="journal-car-canvas" data-car-id="${car.id}" data-car-color="${paintHex}" width="146" height="88" style="display:block;width:146px;height:88px;cursor:ew-resize"></canvas>
            </div>
            <div style="flex:1 1 220px;min-width:0;display:flex;flex-direction:column;justify-content:space-between">
              <div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
                  <span style="font-size:15px;font-weight:bold;color:${isOwned ? '#eff6ff' : '#cbd5e1'}">${car.name}</span>
                  ${statusBadge}
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:4px;font-size:11.5px;color:#93c5fd">
                  <span>${car.category}</span>
                  <span style="opacity:0.45">•</span>
                  <span style="display:inline-flex;align-items:center;gap:5px;color:#cbd5e1">
                    <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${paintHex};border:1px solid rgba(255,255,255,0.45)"></span>
                    ${paintLabel}
                  </span>
                </div>
                <div style="font-size:12.5px;color:#dbe4f0;margin-top:7px;line-height:1.45">
                  ${car.desc}
                </div>
              </div>
              <div style="font-size:11px;color:#94a3b8;margin-top:8px">
                Деталей для побега (Гл. 4): <b style="color:#bfdbfe">${car.partsEasy} / ${car.partsHard} / ${car.partsExtreme}</b>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    return filterBar + cards;
  }

  function buildArtifactsHtml(loc) {
    const list =
      artifactsFilter === 'found'
        ? VAZ_PARTS_CATALOG.filter((p) => Boolean(discovered[p.idx]))
        : VAZ_PARTS_CATALOG;

    const filterBar = `
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:2px">
        <button id="jart_filter_all" class="journal-tab-btn" style="margin:0;padding:5px 11px;font-size:12px;border-radius:5px;cursor:pointer;background:${artifactsFilter === 'all' ? '#92400e' : '#21130b'};color:#fff;border:1px solid ${artifactsFilter === 'all' ? '#fbbf24' : '#4a2810'};font-weight:${artifactsFilter === 'all' ? 'bold' : 'normal'}">Все артефакты (${totalCount})</button>
        <button id="jart_filter_found" class="journal-tab-btn" style="margin:0;padding:5px 11px;font-size:12px;border-radius:5px;cursor:pointer;background:${artifactsFilter === 'found' ? '#92400e' : '#21130b'};color:#fff;border:1px solid ${artifactsFilter === 'found' ? '#fbbf24' : '#4a2810'};font-weight:${artifactsFilter === 'found' ? 'bold' : 'normal'}">Только найденные (${foundCount})</button>
      </div>
    `;

    if (list.length === 0) {
      return (
        filterBar +
        `
        <div class="journal-card-anim" style="--j-delay:0ms;padding:28px 18px;border-radius:10px;background:rgba(28,16,9,0.7);border:1px dashed #6b3d17;text-align:center">
          <div style="font-size:34px;margin-bottom:8px">🔧</div>
          <div style="font-size:15px;font-weight:bold;color:#fde68a;margin-bottom:6px">Список найденных артефактов пока пуст</div>
          <div style="font-size:13px;color:#b8a898;line-height:1.45;margin-bottom:14px">
            Обыскивай открытые гаражные боксы в Главе 4 «Гаражи». Каждая подобранная деталь для ${eqCar.name} навсегда заносится в этот журнал вместе со своей историей.
          </div>
          <button id="j_show_all_empty" class="journal-tab-btn" style="margin:0;padding:8px 16px;font-size:12px;background:#451a03;border:1px solid #d97706;color:#fde68a;border-radius:6px;cursor:pointer">
            Посмотреть все артефакты (${totalCount})
          </button>
        </div>
      `
      );
    }

    const cards = list
      .map((part, idx) => {
        const delay = `${Math.min(idx, 10) * 26}ms`;
        const entry = discovered[part.idx];
        const isFound = Boolean(entry);
        const dateStr =
          isFound && entry.foundAt ? new Date(entry.foundAt).toLocaleDateString(loc) : '';
        if (!isFound) {
          return `
            <div class="journal-card-anim" style="--j-delay:${delay};display:flex;align-items:flex-start;gap:14px;padding:13px 14px;border-radius:9px;background:rgba(16,11,9,0.65);border:1px solid #351d0e;opacity:0.75;text-align:left">
              <div style="width:46px;height:46px;border-radius:8px;background:#1d120c;border:1px solid #4a2810;display:flex;align-items:center;justify-content:center;font-size:21px;flex-shrink:0">
                🔒
              </div>
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
                  <span style="font-size:15px;font-weight:bold;color:#9ca3af">Неизвестный артефакт (${eqCar.name})</span>
                  <span style="font-size:11px;color:#78716c;padding:2px 7px;border-radius:4px;background:#19100b;border:1px solid #351d0e">???</span>
                </div>
                <div style="font-size:12.5px;color:#8c7d70;margin-top:6px;line-height:1.4">
                  Найди эту деталь внутри открытых гаражей в Главе 4, чтобы раскрыть её запись в лоре игры.
                </div>
              </div>
            </div>
          `;
        }

        return `
          <div class="journal-card-anim" style="--j-delay:${delay};display:flex;align-items:flex-start;gap:14px;padding:14px;border-radius:9px;background:linear-gradient(180deg, rgba(36,20,10,0.82) 0%, rgba(20,12,8,0.88) 100%);border:1px solid #b45309;box-shadow:0 2px 12px rgba(0,0,0,0.45);text-align:left">
            <div style="width:48px;height:48px;border-radius:9px;background:radial-gradient(circle, rgba(245,158,11,0.22) 0%, rgba(28,16,8,0.95) 85%);border:1.5px solid #f59e0b;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 12px rgba(245,158,11,0.25)">
              ${part.svg}
            </div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
                <span style="font-size:15.5px;font-weight:bold;color:#fef3c7">${part.name}</span>
                <span style="font-size:11px;font-weight:bold;color:#fbbf24;padding:2px 7px;border-radius:4px;background:rgba(180,83,9,0.25);border:1px solid #92400e;font-family:monospace">${part.code}</span>
              </div>
              <div style="font-size:11.5px;color:#f59e0b;margin-top:4px;display:flex;flex-wrap:wrap;gap:8px">
                <span>✓ Найдено для ${eqCar.name}${dateStr ? ' • ' + dateStr : ''}</span>
                ${entry.count > 1 ? `<span style="color:#a3e635">• Собрано: ${entry.count}</span>` : ''}
              </div>
              <div style="font-size:12.5px;color:#e5e7eb;margin-top:8px;line-height:1.48;font-style:italic;padding-left:10px;border-left:2px solid #d97706">
                ${part.lore}
              </div>
              <div style="font-size:11px;color:#9ca3af;margin-top:7px">
                Где искать: ${part.location}
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    return filterBar + cards;
  }

  function renderActiveTab(animate = true) {
    applyTabButtonStyles();
    updateProgressHeader();
    if (!tabBody) return;

    const loc =
      typeof window !== 'undefined' && typeof window.__getLocale === 'function'
        ? window.__getLocale()
        : getLocale();

    const innerHtml =
      activeTab === 'notes'
        ? buildNotesHtml(loc)
        : activeTab === 'cars'
          ? buildCarsHtml()
          : buildArtifactsHtml(loc);

    tabBody.scrollTop = 0;
    tabBody.innerHTML = `<div class="${animate ? 'journal-stage-enter' : ''}" style="display:flex;flex-direction:column;gap:12px">${innerHtml}</div>`;
    trTree(tabBody);

    if (activeTab === 'cars') {
      const canvases = tabBody.querySelectorAll('.journal-car-canvas');
      canvases.forEach((canvas) => {
        const carId = canvas.getAttribute('data-car-id');
        const paintHex = canvas.getAttribute('data-car-color');
        const carSpec = CAR_CATALOG.find((c) => c.id === carId) || eqCar;
        let previewAngle = -0.62;
        renderCarShowcase3D(canvas, carSpec, paintHex, previewAngle, 0.94, true, 0.24);

        canvas.onpointermove = (ev) => {
          const rect = canvas.getBoundingClientRect();
          if (!rect.width) return;
          const relX = (ev.clientX - rect.left) / rect.width - 0.5;
          previewAngle = -0.62 + relX * 2.4;
          renderCarShowcase3D(canvas, carSpec, paintHex, previewAngle, 0.94, true, 0.24);
        };
        canvas.onpointerleave = () => {
          previewAngle = -0.62;
          renderCarShowcase3D(canvas, carSpec, paintHex, previewAngle, 0.94, true, 0.24);
        };
      });
    }

    const btnCarAll = tabBody.querySelector('#jcar_filter_all');
    const btnCarOwned = tabBody.querySelector('#jcar_filter_owned');
    if (btnCarAll) btnCarAll.onclick = () => { if (carsFilter !== 'all') { carsFilter = 'all'; renderActiveTab(true); } };
    if (btnCarOwned) btnCarOwned.onclick = () => { if (carsFilter !== 'owned') { carsFilter = 'owned'; renderActiveTab(true); } };

    const btnArtAll = tabBody.querySelector('#jart_filter_all');
    const btnArtFound = tabBody.querySelector('#jart_filter_found');
    const btnEmptyAll = tabBody.querySelector('#j_show_all_empty');
    if (btnArtAll) btnArtAll.onclick = () => { if (artifactsFilter !== 'all') { artifactsFilter = 'all'; renderActiveTab(true); } };
    if (btnArtFound) btnArtFound.onclick = () => { if (artifactsFilter !== 'found') { artifactsFilter = 'found'; renderActiveTab(true); } };
    if (btnEmptyAll) btnEmptyAll.onclick = () => { artifactsFilter = 'all'; renderActiveTab(true); };
  }

  if (btnNotes) btnNotes.onclick = () => { if (activeTab !== 'notes') { activeTab = 'notes'; renderActiveTab(true); } };
  if (btnCars) btnCars.onclick = () => { if (activeTab !== 'cars') { activeTab = 'cars'; renderActiveTab(true); } };
  if (btnArtifacts) btnArtifacts.onclick = () => { if (activeTab !== 'artifacts') { activeTab = 'artifacts'; renderActiveTab(true); } };

  modal.onclick = (e) => {
    if (e.target === modal) closeAnimatedModal(modal);
  };

  document.body.appendChild(modal);
  renderActiveTab(true);
  openAnimatedModal(modal);

  if (typeof callbacks.onOpen === 'function') {
    callbacks.onOpen();
  }
}

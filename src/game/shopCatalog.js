/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { renderCarShowcase3D } from './carModels3D.js';
import { openAnimatedModal, closeAnimatedModal, disposeAnimatedModal } from './uiTransitions.js';

/**
 * Lobby Shop Catalog & Interactive 3-Section Shop Modal:
 *   Top (Arrow Up):   Car Dealership (24 cars, interactive 3D turntable inspector, garage backdrop, 200-coin paint, escape parts info)
 *   Center:           Wardrobe / Avatar Editor (wardrobe cabinet backdrop, foreground character, 20 Head Acc + 20 Face Acc + 6 Skins)
 *   Bottom (Arrow Dn): Monster Skins Shop (4 monster skins: 0 / 450 / 750 / 1250 coins, speed stats & slow-speed lore)
 */

export const SKINS = [
  { name: 'Серый', c: '#777777', price: 0 },
  { name: 'Красный', c: '#aa3333', price: 50 },
  { name: 'Синий', c: '#3366aa', price: 50 },
  { name: 'Зелёный', c: '#339944', price: 75 },
  { name: 'Жёлтый', c: '#ccaa22', price: 100 },
  { name: 'Фиолетовый', c: '#8833aa', price: 150 },
  { name: 'Зимняя парка', c: '#1e3a5f', price: 180 },
  { name: 'Костюм Санты', c: '#b91c1c', price: 250 },
  { name: 'Снежный сталкер', c: '#cbd5e1', price: 220 },
  { name: 'Новогодний свитер', c: '#15803d', price: 200 },
];

export const HEAD_ACCESSORIES = [
  { id: 0, name: 'Без убора', price: 0, icon: '—', color: '#555' },
  { id: 1, name: 'Кепка сталкера', price: 40, icon: '🧢', color: '#2b4c7e' },
  { id: 2, name: 'Шапка-ушанка', price: 65, icon: '🪖', color: '#5c4d3c' },
  { id: 3, name: 'Чёрная бини', price: 50, icon: '🧶', color: '#222429' },
  { id: 4, name: 'Шляпа детектива', price: 90, icon: '🕵️', color: '#4a3728' },
  { id: 5, name: 'Каска механика', price: 110, icon: '👷', color: '#e6a817' },
  { id: 6, name: 'Балаклава', price: 120, icon: '🥷', color: '#1b1d21' },
  { id: 7, name: 'Шлем спецназа', price: 160, icon: '⛑️', color: '#2b342b' },
  { id: 8, name: 'Берет разведчика', price: 95, icon: '🎖️', color: '#7a1c24' },
  { id: 9, name: 'Ковбойская шляпа', price: 130, icon: '🤠', color: '#6b4226' },
  { id: 10, name: 'Повязка ниндзя', price: 140, icon: '🥋', color: '#991b1b' },
  { id: 11, name: 'Капюшон жнеца', price: 185, icon: '☠️', color: '#1e1624' },
  { id: 12, name: 'Фонарь на лоб', price: 150, icon: '🔦', color: '#f59e0b' },
  { id: 13, name: 'Цилиндр особняка', price: 210, icon: '🎩', color: '#27202c' },
  { id: 14, name: 'Дьявольские рога', price: 240, icon: '😈', color: '#b91c1c' },
  { id: 15, name: 'Нимб выжившего', price: 260, icon: '😇', color: '#fde047' },
  { id: 16, name: 'Шляпа ведьмы', price: 220, icon: '🧙', color: '#3b0764' },
  { id: 17, name: 'Кошачьи ушки', price: 175, icon: '🐱', color: '#f472b6' },
  { id: 18, name: 'Кибер-наушники', price: 280, icon: '🎧', color: '#06b6d4' },
  { id: 19, name: 'Воинский шлем', price: 320, icon: '🛡️', color: '#64748b' },
  { id: 20, name: 'Корона склепа', price: 450, icon: '👑', color: '#facc15' },
  { id: 21, name: 'Шапка Санты', price: 140, icon: '🎅', color: '#dc2626' },
  { id: 22, name: 'Оленьи рога', price: 190, icon: '🦌', color: '#78350f' },
  { id: 23, name: 'Ледяная корона', price: 340, icon: '❄️', color: '#38bdf8' },
  { id: 24, name: 'Снежная ушанка', price: 160, icon: '🧣', color: '#e2e8f0' },
  { id: 25, name: 'Колпак эльфа', price: 175, icon: '🧝', color: '#16a34a' },
  { id: 26, name: 'Венок омелы', price: 215, icon: '🎄', color: '#15803d' },
];

export const FACE_ACCESSORIES = [
  { id: 0, name: 'Без маски', price: 0, icon: '—', color: '#555' },
  { id: 1, name: 'Тёмные очки', price: 45, icon: '🕶️', color: '#111827' },
  { id: 2, name: 'Пылевой респиратор', price: 60, icon: '😷', color: '#374151' },
  { id: 3, name: 'Повязка на глаз', price: 70, icon: '🏴‍☠️', color: '#1f2937' },
  { id: 4, name: 'Круглые очки', price: 55, icon: '👓', color: '#9ca3af' },
  { id: 5, name: 'Медицинская маска', price: 50, icon: '🩺', color: '#60a5fa' },
  { id: 6, name: 'Боевой шрам', price: 85, icon: '⚡', color: '#dc2626' },
  { id: 7, name: 'Шёлковый платок', price: 95, icon: '🧣', color: '#7f1d1d' },
  { id: 8, name: 'Противогаз ГП-5', price: 145, icon: '☣️', color: '#4b5320' },
  { id: 9, name: 'Маска черепа', price: 165, icon: '💀', color: '#e5e7eb' },
  { id: 10, name: 'Клюв чумного доктора', price: 190, icon: '🪶', color: '#292524' },
  { id: 11, name: 'Хоккейная маска', price: 210, icon: '🏒', color: '#d1d5db' },
  { id: 12, name: 'Очки ночного видения', price: 250, icon: '🟢', color: '#22c55e' },
  { id: 13, name: 'Светящийся визор', price: 270, icon: '🤖', color: '#38bdf8' },
  { id: 14, name: 'Клоунский грим', price: 155, icon: '🤡', color: '#ef4444' },
  { id: 15, name: 'Очки сварщика', price: 130, icon: '🔧', color: '#334155' },
  { id: 16, name: 'Стальной монокль', price: 175, icon: '🧐', color: '#fbbf24' },
  { id: 17, name: 'Усы механика', price: 80, icon: '👨', color: '#451a03' },
  { id: 18, name: 'Густая борода', price: 100, icon: '🧔', color: '#57534e' },
  { id: 19, name: 'Алые глаза тьмы', price: 310, icon: '👁️', color: '#ff1e42' },
  { id: 20, name: 'Маска Они (демона)', price: 390, icon: '👹', color: '#b91c1c' },
  { id: 21, name: 'Очки-снежинки', price: 150, icon: '❄️', color: '#7dd3fc' },
  { id: 22, name: 'Тёплый шарф', price: 120, icon: '🧣', color: '#dc2626' },
  { id: 23, name: 'Борода Санты', price: 165, icon: '🎅', color: '#f8fafc' },
  { id: 24, name: 'Морозный иней', price: 210, icon: '🧊', color: '#38bdf8' },
  { id: 25, name: 'Румянец зимы', price: 90, icon: '🌨️', color: '#fb7185' },
  { id: 26, name: 'Новогодняя полумаска', price: 245, icon: '🎭', color: '#facc15' },
];

export const CAR_CATALOG = [
  {
    id: 'vaz2112',
    name: 'ВАЗ-2112',
    price: 0,
    defaultColor: '#6f7882',
    bodyType: 'hatch',
    category: 'Хэтчбек · 2002',
    desc: 'Надёжный пятидверный хэтчбек 2002 года со спойлером. Твоя базовая машина у гаража №4.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'oka',
    name: 'Ока (ВАЗ-1111)',
    price: 650,
    defaultColor: '#c84b31',
    bodyType: 'compact',
    category: 'Микролитражка',
    desc: 'Юркая советская микролитражка. Короткий кузов позволяет развернуться прямо между тесными боксами.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'vaz2101',
    name: 'ВАЗ-2101 «Копейка»',
    price: 950,
    defaultColor: '#b8322a',
    bodyType: 'kopeyka',
    category: 'Ретро-седан · 1970',
    desc: 'Легендарный первенец Волжского автозавода: круглые фары, хром-клыки на бамперах и неубиваемая сталь.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'vaz2102',
    name: 'ВАЗ-2102 Универсал',
    price: 1200,
    defaultColor: '#3a6b8c',
    bodyType: 'wagon_classic',
    category: 'Ретро-универсал',
    desc: 'Классический советский универсал на базе «Копейки» с круглыми фарами и огромным багажником под детали.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'vaz2105',
    name: 'ВАЗ-2105',
    price: 1350,
    defaultColor: '#9c2d25',
    bodyType: 'box_sedan',
    category: 'Классика · Седан',
    desc: 'Классическая угловатая «пятёрка» с прямоугольными фарами и чёрной решёткой. Простая и прочная.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'vaz2107',
    name: 'ВАЗ-2107',
    price: 1550,
    defaultColor: '#7f1d22',
    bodyType: 'box_sedan',
    category: 'Классика · Люкс',
    desc: 'Легендарная «семёрка» с высокой хромированной решёткой радиатора, выштамповкой капота и мягким салоном.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'vaz2104',
    name: 'ВАЗ-2104 Универсал',
    price: 1700,
    defaultColor: '#cfd5dc',
    bodyType: 'wagon_box',
    category: 'Классика · Универсал',
    desc: 'Угловатая рабочая лошадка с длинной крышей, багажником наверху и вертикальными задними фонарями.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'vaz2106',
    name: 'ВАЗ-2106',
    price: 1800,
    defaultColor: '#c9a66b',
    bodyType: 'chrome_sedan',
    category: 'Классика · 4 фары',
    desc: 'Культовая «шестёрка» с четырьмя круглыми фарами, хром-молдингами и колпаками-блюдцами.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'vaz2108',
    name: 'ВАЗ-2108 «Спутник»',
    price: 1950,
    defaultColor: '#c94a38',
    bodyType: 'zubilo_coupe',
    category: 'Спорт-купе · 3 дв.',
    desc: 'Дерзкая трёхдверная «восьмёрка» с длинными дверьми и клиновидным носом — быстрый рывок со старта.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'vaz2109',
    name: 'ВАЗ-2109',
    price: 2050,
    defaultColor: '#5e6670',
    bodyType: 'zubilo_hatch',
    category: 'Самара · 5 дв.',
    desc: 'Культовое «зубило» 90-х — резвый пятидверный хэтчбек с клиновидным капотом и широкими бамперами.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'vaz2110',
    name: 'ВАЗ-2110',
    price: 2300,
    defaultColor: '#2d4b6e',
    bodyType: 'round_sedan',
    category: 'Седан · 10-е семейство',
    desc: 'Обтекаемый седан «десятка» с плавным силуэтом, миндалевидной оптикой и просторным багажником.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'vaz2114',
    name: 'ВАЗ-2114 (Samara-2)',
    price: 2550,
    defaultColor: '#4a535e',
    bodyType: 'samara2_hatch',
    category: 'Самара-2 · Хэтчбек',
    desc: 'Улучшенная «четырка» с евробамперами в цвет кузова, узкой передней оптикой, ПТФ и спортивным спойлером.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'vaz2111',
    name: 'ВАЗ-2111',
    price: 2750,
    defaultColor: '#2c5e3b',
    bodyType: 'wagon',
    category: 'Универсал · 11-я',
    desc: 'Вместительный универсал «одиннадцатая» с рейлингами — легко увозит всю команду в кооперативе.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'vaz2115',
    name: 'ВАЗ-2115 (Samara-2)',
    price: 3100,
    defaultColor: '#2b3648',
    bodyType: 'samara2_sedan',
    category: 'Самара-2 · Седан',
    desc: 'Стремительная «пятнашка» с аэродинамическим обвесом, литым спойлером на крышке багажника и литьём.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'vaz21099',
    name: 'ВАЗ-21099',
    price: 3450,
    defaultColor: '#2b2d33',
    bodyType: 'zubilo',
    category: 'Самара · Седан',
    desc: 'Культовый седан «девяносто девятая» с длинным капотом, литыми дисками и резким характером.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'kalina',
    name: 'Lada Kalina (ВАЗ-1118)',
    price: 3800,
    defaultColor: '#236b5e',
    bodyType: 'kalina',
    category: 'Компакт-седан',
    desc: 'Манёвренная «Калина» с высокой крышей, крупной каплевидной оптикой и хорошим обзором в тумане.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'niva2121',
    name: 'Нива (ВАЗ-2121)',
    price: 4100,
    defaultColor: '#3a5a40',
    bodyType: 'suv',
    category: 'Внедорожник 4×4',
    desc: 'Неприхотливый полноприводный внедорожник с запаской и экспедиционным багажником. Берёт любую грунтовку.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'priora',
    name: 'Lada Priora',
    price: 4600,
    defaultColor: '#1e242b',
    bodyType: 'round_sedan',
    category: 'Седан · Флагман 2000-х',
    desc: 'Стремительный седан с трапециевидной хромированной решёткой, противотуманками и бодрой тягой на старте.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'niva2123',
    name: 'Нива Шевроле (ВАЗ-2123)',
    price: 4950,
    defaultColor: '#3d4f43',
    bodyType: 'crossover_niva',
    category: 'Кроссовер 4×4',
    desc: 'Мощный пятидверный внедорожник с защитным пластиковым обвесом, рейлингами и запаской на пятой двери.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'granta',
    name: 'Lada Granta Sport (ВАЗ-2190)',
    price: 5200,
    defaultColor: '#b91c22',
    bodyType: 'granta',
    category: 'Спорт-седан · ВАЗ-2190',
    desc: 'Спортивный АвтоВАЗ нового поколения: агрессивный передний сплиттер, красная полоса решётки, спойлер и быстрый разгон.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'largus',
    name: 'Ларгус',
    price: 5500,
    defaultColor: '#b7c0c9',
    bodyType: 'largus',
    category: 'Универсал повышенной вместимости',
    desc: 'Мощный вместительный универсал-фургон с усиленным кузовом. Настоящий танк для побега из гаражей.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'volga3110',
    name: 'ГАЗ-3110 Волга',
    price: 6200,
    defaultColor: '#1f2d3d',
    bodyType: 'executive_sedan',
    category: 'Бизнес-седан',
    desc: 'Тяжёлая представительская «баржа» из 90-х. Длинный капот, китовый ус решётки и железный характер.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'vesta',
    name: 'Lada Vesta (ВАЗ-GFL)',
    price: 6800,
    defaultColor: '#9e1c24',
    bodyType: 'vesta',
    category: 'Современный флагман',
    desc: 'Флагманский седан нового поколения с фирменным Х-фейсом, выштамповками по бортам и острой LED-оптикой.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'uaz452',
    name: 'УАЗ-452 Буханка',
    price: 7800,
    defaultColor: '#4b5842',
    bodyType: 'van',
    category: 'Внедорожный фургон 4×4',
    desc: 'Легендарный полноприводный микроавтобус. Внутри поместится целая мастерская запчастей.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'moskvich412',
    garage: 2,
    tier: 'standard',
    name: 'Москвич-412',
    price: 1100,
    defaultColor: '#3f6a8a',
    bodyType: 'kopeyka',
    category: 'Гараж 2 · Классика АЗЛК',
    desc: 'Советская классика АЗЛК с хромированной решёткой, треугольными подфарниками и надёжным двигателем УЗАМ.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'moskvich2140',
    garage: 2,
    tier: 'standard',
    name: 'Москвич-2140 Люкс',
    price: 1650,
    defaultColor: '#8d3b24',
    bodyType: 'box_sedan',
    category: 'Гараж 2 · Ретро АЗЛК',
    desc: 'Обновлённый «сороковой» с чёрной фальшрадиаторной решёткой, резиновыми клыками и крепкой подвеской.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'moskvich2141',
    garage: 2,
    tier: 'standard',
    name: 'Москвич-2141 «Алеко»',
    price: 2450,
    defaultColor: '#5c6b78',
    bodyType: 'hatch',
    category: 'Гараж 2 · Хэтчбек',
    desc: 'Просторный переднеприводный лифтбек 90-х с аэродинамическим профилем и огромным багажником.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'tavria1102',
    garage: 2,
    tier: 'standard',
    name: 'ЗАЗ-1102 «Таврия»',
    price: 900,
    defaultColor: '#c9a648',
    bodyType: 'zubilo_coupe',
    category: 'Гараж 2 · Таврия',
    desc: 'Лёгкий и манёвренный трёхдверный хэтчбек ЗАЗ. Проскользнёт между любых гаражей и проселков.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'slavuta1103',
    garage: 2,
    tier: 'standard',
    name: 'ЗАЗ-1103 «Славута»',
    price: 1500,
    defaultColor: '#2e5948',
    bodyType: 'samara2_sedan',
    category: 'Гараж 2 · Таврия-лифтбек',
    desc: 'Пятидверный семейный лифтбек семейства Таврия с бамперами в цвет кузова и спойлером.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'xmas_sleigh',
    garage: 1,
    tier: 'exclusive',
    eventOnly: true,
    name: 'Новогодние сани',
    price: 0,
    defaultColor: '#b91c1c',
    bodyType: 'sleigh',
    category: '⭐ Эксклюзив · Новогодний эвент',
    desc: 'Праздничные деревянно-золотые сани с фонарями и подарками! Выдаются в награду за побег из Новогодней Главы 5.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
  {
    id: 'gta_buffalo',
    garage: 1,
    tier: 'exclusive',
    promoOnly: true,
    name: 'Bravado Buffalo S (GTA)',
    price: 0,
    defaultColor: '#e8edf2',
    bodyType: 'muscle',
    category: '⭐ Эксклюзив · GTA VI RELEASE',
    desc: 'Белоснежный широкофюзеляжный маслкар с вентилируемым капотом, агрессивным обвесом и светодиодной оптикой.',
    partsEasy: 5,
    partsHard: 8,
    partsExtreme: 12,
  },
];

// Guarantee garage & tier metadata on all catalog entries
for (const c of CAR_CATALOG) {
  if (!c.garage) c.garage = 1;
  if (!c.tier) c.tier = c.price >= 4500 ? 'premium' : 'standard';
}

export const CAR_PAINTS = [
  { id: 'silver', name: 'Серебро', hex: '#9aa4af' },
  { id: 'graphite', name: 'Графит', hex: '#434a54' },
  { id: 'black', name: 'Чёрный', hex: '#1a1c22' },
  { id: 'white', name: 'Белый', hex: '#d8dde3' },
  { id: 'cherry', name: 'Вишня', hex: '#7c1a23' },
  { id: 'crimson', name: 'Алый', hex: '#be252e' },
  { id: 'eggplant', name: 'Баклажан', hex: '#4b1f47' },
  { id: 'navy', name: 'Синий', hex: '#234b7a' },
  { id: 'emerald', name: 'Изумруд', hex: '#1e5e3d' },
  { id: 'gold', name: 'Золотой', hex: '#b68c32' },
];

export const CAR_PAINT_PRICE = 200;

export const MONSTER_SKINS = [
  {
    id: 'maze',
    name: 'Монстр из лабиринта',
    price: 0,
    badge: 'Начальный',
    speedMult: 0.95,
    speedLabel: 'Медленная (0.95x)',
    speedPct: 45,
    accent: '#ff4757',
    whySlow: 'Почему такая медленная скорость: древние ссохшиеся сухожилия в вечной сырости лабиринта сковывают каждый шаг. Она берёт своё не спринтом, а неумолимым чутьём на свет и звуки.',
    trapNote: 'Доступно в кооперативе: охота на выживших и установка ржавых ловушек [G].',
  },
  {
    id: 'mansion',
    name: 'Монстр из особняка',
    price: 450,
    badge: 'Глава 2',
    speedMult: 1.08,
    speedLabel: 'Средняя (1.08x)',
    speedPct: 62,
    accent: '#b91c1c',
    whySlow: 'Почему такая медленная скорость: запутавшийся тяжёлый саван особняка и железные кандалы прошлого тянут её к паркету, заставляя скользить рывками вдоль стен.',
    trapNote: 'Быстрее базового скина в погоне и быстрее перезаряжает шаг в коридорах.',
  },
  {
    id: 'graveyard',
    name: 'Монстр из кладбища',
    price: 750,
    badge: 'Глава 3',
    speedMult: 1.14,
    speedLabel: 'Уверенная (1.14x)',
    speedPct: 74,
    accent: '#22c55e',
    whySlow: 'Почему такая медленная скорость: тело утяжелено сырой могильной землёй и тяжелой кованой лопатой, которую он волочит по гравию за собой.',
    trapNote: 'Отлично контролирует открытые дворы и подходы к капканам.',
  },
  {
    id: 'garages',
    name: 'Монстр из гаражей',
    price: 1250,
    badge: 'Механик · Гл. 4',
    speedMult: 1.22,
    speedLabel: 'Максимальная (1.22x)',
    speedPct: 90,
    accent: '#f59e0b',
    whySlow: 'Почему такая медленная скорость: промокшая от дождя брезентовая роба и тяжёлые гаечные ключи в карманах весят почти 30 кг — он тяжёлый, но в разгоне самый быстрый из всех.',
    trapNote: 'Самый быстрый скин охотника в кооперативе — страх гаражного кооператива.',
  },
  {
    id: 'matrixman',
    name: 'MatrixMan',
    price: 0,
    promoOnly: true,
    badge: 'ЭКСКЛЮЗИВ · 1/1',
    speedMult: 1.28,
    speedLabel: 'Глитч-рывок (1.28x)',
    speedPct: 96,
    accent: '#22ff66',
    previewUrl: '/assets/aistudio/IMG_79b3eb39-7cd9-49f3-95e1-50f4fef9c6e0_50e73642.webp',
    whySlow: 'Цифровой рыцарь с зелёной короной домино, алым шарфом, светящимися рёбрами и двумя тёмными клинками. Вспышка багрового глаза рассекает любую темноту.',
    trapNote: 'Уникальный скин (только 1 на весь мир). Активен и в кооперативе, и в одиночной игре.',
  },
  {
    id: 'figuraa',
    name: 'FIGURAA',
    price: 0,
    promoOnly: true,
    badge: 'ВЫСОКИЙ · 5 МЕСТ',
    speedMult: 1.24,
    speedLabel: 'Длинный шаг (1.24x)',
    speedPct: 92,
    accent: '#fb923c',
    previewUrl: '/assets/aistudio/IMG_3eb0b8be-2c56-4719-bdc7-6336005009c0_70a1426b.jpg',
    whySlow: 'Исполин с торчащей грудной клеткой, гигантскими двусуставными когтистыми руками и безглазой головой-пастью, усеянной зубами.',
    trapNote: 'Редкий скин (лимит 5 игроков). Активен и в кооперативе, и в одиночной игре.',
  },
  {
    id: 'grannyde',
    name: 'GrannyDe',
    price: 0,
    promoOnly: true,
    badge: 'СЕКРЕТ · 4 МЕСТА',
    speedMult: 1.24,
    speedLabel: 'Бесшумный шаг (1.24x)',
    speedPct: 92,
    accent: '#9ca3af',
    previewUrl: '/assets/aistudio/IMG_24f91112-244a-43e2-95f0-e23f6ffbc2da_7269b987.jpg',
    whySlow: 'Обугленная старуха в длинном сером платье на пуговицах с седыми висками, пылающими белыми глазами и окровавленной деревянной битой.',
    trapNote: 'Секретный скин (лимит 4 игрока). Активен и в кооперативе, и в одиночной игре.',
  },
  {
    id: 'tvman',
    name: 'TVMAN',
    price: 0,
    promoOnly: true,
    badge: 'СЕКРЕТ · 3 МЕСТА',
    speedMult: 1.26,
    speedLabel: 'Помеховый выпад (1.26x)',
    speedPct: 94,
    accent: '#cbd5e1',
    previewUrl: '/assets/aistudio/IMG_0ecba783-192a-450f-9c9d-75fc96b118d9_d29df1bf.jpg',
    whySlow: 'Высокая фигура в длинном тёмном двубортном плаще с тяжёлым ретро-телевизором вместо головы и бледным мерцающим экраном помех.',
    trapNote: 'Секретный скин (лимит 3 игрока). Активен и в кооперативе, и в одиночной игре.',
  },
  {
    id: 'ambush',
    name: 'AMBUSH',
    price: 0,
    promoOnly: true,
    badge: 'ЭКСКЛЮЗИВ · ГЛИТЧ',
    speedMult: 1.27,
    speedLabel: 'Сверхбыстрый рывок (1.27x)',
    speedPct: 95,
    accent: '#22c55e',
    previewUrl: '/assets/aistudio/IMG_5ba31ba8-badd-410e-a95d-3ab4031471f3_10e3fce4.jpg',
    whySlow: 'Искажённый белый призрачный лик с двумя огромными чёрными провалами глаз, вытянутой кричащей пастью и ядовито-зелёной помеховой аурой.',
    trapNote: 'Открывается секретным кодом. Доступен и в кооперативе, и в одиночной игре.',
  },
  {
    id: 'santagranny',
    name: 'Санта-Гренни',
    price: 0,
    eventOnly: true,
    badge: '🎄 ЭВЕНТ · 25 ❄️',
    speedMult: 1.25,
    speedLabel: 'Новогодняя охота (1.25x)',
    speedPct: 93,
    accent: '#ef4444',
    previewUrl: '/assets/aistudio/IMG_4a4b8ea1-ddec-46f1-a0fb-6b80c91b2d1c_2bb25989.jpg',
    whySlow: 'Обугленная бабка в красном бархатном балахоне Санты с белой опушкой, пушистой седой бородой, колпаком и окровавленной битой.',
    trapNote: 'Награда Новогоднего Эвента за 25 снежинок (или побег из Главы 5). Работает и в соло, и в кооперативе.',
  },
];

export function safeCoins(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export function formatCoins(v) {
  return safeCoins(v).toLocaleString('ru-RU');
}

export function getHeadAccessory(id = 0) {
  return HEAD_ACCESSORIES.find((a) => a.id === Number(id)) || HEAD_ACCESSORIES[0];
}

export function getFaceAccessory(id = 0) {
  return FACE_ACCESSORIES.find((a) => a.id === Number(id)) || FACE_ACCESSORIES[0];
}

export function getCarSpec(id = 'vaz2112') {
  return CAR_CATALOG.find((c) => c.id === id) || CAR_CATALOG[0];
}

export function getMonsterSkinSpec(id = 'maze') {
  return MONSTER_SKINS.find((m) => m.id === id) || MONSTER_SKINS[0];
}

/**
 * Draws head & face accessories onto a 2D canvas around head center (cx, cy) with radius scale r
 */
export function drawAccessory2D(ctx, headId = 0, faceId = 0, cx = 0, cy = 0, r = 18) {
  const hId = Number(headId) || 0;
  const fId = Number(faceId) || 0;
  ctx.save();

  // --- FACE ACCESSORIES (drawn around eyes/mouth at cx, cy) ---
  if (fId === 1) {
    // Тёмные очки
    ctx.fillStyle = '#0d1016';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = Math.max(1, r * 0.08);
    ctx.fillRect(cx - r * 0.68, cy - r * 0.22, r * 0.56, r * 0.34);
    ctx.fillRect(cx + r * 0.12, cy - r * 0.22, r * 0.56, r * 0.34);
    ctx.fillRect(cx - r * 0.14, cy - r * 0.14, r * 0.28, r * 0.1);
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(cx - r * 0.6, cy - r * 0.18, r * 0.18, r * 0.08);
    ctx.fillRect(cx + r * 0.2, cy - r * 0.18, r * 0.18, r * 0.08);
  } else if (fId === 2 || fId === 5 || fId === 7) {
    // Респиратор / Мед. маска / Платок
    ctx.fillStyle = fId === 5 ? '#60a5fa' : fId === 7 ? '#881822' : '#374151';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(cx - r * 0.58, cy + r * 0.12, r * 1.16, r * 0.62, r * 0.2) : ctx.fillRect(cx - r * 0.58, cy + r * 0.12, r * 1.16, r * 0.62);
    ctx.fill();
    if (fId === 2) {
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(cx, cy + r * 0.42, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (fId === 3) {
    // Повязка на глаз
    ctx.strokeStyle = '#111';
    ctx.lineWidth = Math.max(1.5, r * 0.1);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.85, cy - r * 0.35);
    ctx.lineTo(cx + r * 0.85, cy + r * 0.1);
    ctx.stroke();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(cx - r * 0.32, cy - r * 0.08, r * 0.28, 0, Math.PI * 2);
    ctx.fill();
  } else if (fId === 4 || fId === 15) {
    // Круглые очки / сварщика
    ctx.strokeStyle = fId === 15 ? '#334155' : '#cbd5e1';
    ctx.lineWidth = Math.max(1.4, r * 0.1);
    if (fId === 15) {
      ctx.fillStyle = 'rgba(20, 60, 40, 0.7)';
      ctx.beginPath(); ctx.arc(cx - r * 0.34, cy - r * 0.05, r * 0.28, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + r * 0.34, cy - r * 0.05, r * 0.28, 0, Math.PI * 2); ctx.fill();
    }
    ctx.beginPath(); ctx.arc(cx - r * 0.34, cy - r * 0.05, r * 0.26, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + r * 0.34, cy - r * 0.05, r * 0.26, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - r * 0.08, cy - r * 0.05); ctx.lineTo(cx + r * 0.08, cy - r * 0.05); ctx.stroke();
  } else if (fId === 6) {
    // Боевой шрам
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = Math.max(1.5, r * 0.1);
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.15, cy - r * 0.42);
    ctx.lineTo(cx + r * 0.48, cy + r * 0.36);
    ctx.stroke();
  } else if (fId === 8) {
    // Противогаз ГП-5
    ctx.fillStyle = '#4b5320';
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.15, r * 0.78, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath(); ctx.arc(cx - r * 0.32, cy - r * 0.08, r * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + r * 0.32, cy - r * 0.08, r * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1f2937';
    ctx.beginPath(); ctx.arc(cx, cy + r * 0.56, r * 0.32, 0, Math.PI * 2); ctx.fill();
  } else if (fId === 9 || fId === 11) {
    // Череп / Хоккейная маска
    ctx.fillStyle = fId === 11 ? '#d1d5db' : '#f3f4f6';
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.1, r * 0.72, r * 0.78, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.arc(cx - r * 0.28, cy - r * 0.08, r * 0.16, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + r * 0.28, cy - r * 0.08, r * 0.16, 0, Math.PI * 2); ctx.fill();
    if (fId === 11) {
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(cx - r * 0.08, cy - r * 0.5, r * 0.16, r * 0.32);
    } else {
      ctx.fillRect(cx - r * 0.3, cy + r * 0.42, r * 0.6, r * 0.14);
    }
  } else if (fId === 10) {
    // Клюв чумного доктора
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.4, cy + r * 0.05);
    ctx.lineTo(cx + r * 0.95, cy + r * 0.42);
    ctx.lineTo(cx - r * 0.35, cy + r * 0.52);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d6d3d1';
    ctx.beginPath(); ctx.arc(cx - r * 0.25, cy - r * 0.08, r * 0.16, 0, Math.PI * 2); ctx.fill();
  } else if (fId === 12 || fId === 13) {
    // ПНВ / Кибер-визор
    ctx.fillStyle = fId === 12 ? '#22c55e' : '#38bdf8';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 8;
    ctx.fillRect(cx - r * 0.68, cy - r * 0.22, r * 1.36, r * 0.26);
    ctx.shadowBlur = 0;
  } else if (fId === 14) {
    // Клоун
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(cx, cy + r * 0.15, r * 0.24, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(cx - r * 0.38, cy + r * 0.45, r * 0.76, r * 0.16);
  } else if (fId === 16) {
    // Монокль
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = Math.max(1.5, r * 0.1);
    ctx.beginPath(); ctx.arc(cx + r * 0.32, cy - r * 0.06, r * 0.25, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + r * 0.56, cy); ctx.lineTo(cx + r * 0.72, cy + r * 0.6); ctx.stroke();
  } else if (fId === 17) {
    // Усы
    ctx.fillStyle = '#451a03';
    ctx.fillRect(cx - r * 0.42, cy + r * 0.22, r * 0.84, r * 0.18);
  } else if (fId === 18) {
    // Борода
    ctx.fillStyle = '#44403c';
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.28, r * 0.68, 0, Math.PI);
    ctx.fill();
  } else if (fId === 19) {
    // Алые глаза тьмы
    ctx.fillStyle = '#ff1e42';
    ctx.shadowColor = '#ff1e42';
    ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(cx - r * 0.3, cy - r * 0.08, r * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + r * 0.3, cy - r * 0.08, r * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  } else if (fId === 20) {
    // Маска Они
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath(); ctx.arc(cx, cy + r * 0.32, r * 0.62, 0, Math.PI); ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath(); ctx.moveTo(cx - r * 0.36, cy + r * 0.4); ctx.lineTo(cx - r * 0.22, cy + r * 0.08); ctx.lineTo(cx - r * 0.1, cy + r * 0.4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + r * 0.36, cy + r * 0.4); ctx.lineTo(cx + r * 0.22, cy + r * 0.08); ctx.lineTo(cx + r * 0.1, cy + r * 0.4); ctx.fill();
  } else if (fId === 21) {
    // Очки-снежинки
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = Math.max(1.5, r * 0.1);
    ctx.beginPath(); ctx.arc(cx - r * 0.34, cy - r * 0.06, r * 0.26, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + r * 0.34, cy - r * 0.06, r * 0.26, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - r * 0.08, cy - r * 0.06); ctx.lineTo(cx + r * 0.08, cy - r * 0.06); ctx.stroke();
  } else if (fId === 22) {
    // Тёплый шарф
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(cx - r * 0.72, cy + r * 0.46, r * 1.44, r * 0.38);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(cx - r * 0.72, cy + r * 0.60, r * 1.44, r * 0.10);
  } else if (fId === 23) {
    // Борода Санты
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.30, r * 0.72, 0, Math.PI);
    ctx.fill();
    ctx.fillRect(cx - r * 0.45, cy + r * 0.20, r * 0.90, r * 0.18);
  } else if (fId === 24) {
    // Морозный иней
    ctx.fillStyle = 'rgba(125,211,252,0.52)';
    ctx.beginPath(); ctx.arc(cx - r * 0.36, cy + r * 0.15, r * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + r * 0.36, cy + r * 0.15, r * 0.22, 0, Math.PI * 2); ctx.fill();
  } else if (fId === 25) {
    // Румянец зимы
    ctx.fillStyle = 'rgba(251,113,133,0.65)';
    ctx.beginPath(); ctx.ellipse(cx - r * 0.42, cy + r * 0.12, r * 0.18, r * 0.1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + r * 0.42, cy + r * 0.12, r * 0.18, r * 0.1, 0, 0, Math.PI * 2); ctx.fill();
  } else if (fId === 26) {
    // Новогодняя полумаска
    ctx.fillStyle = '#facc15';
    ctx.fillRect(cx - r * 0.72, cy - r * 0.24, r * 1.44, r * 0.34);
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.arc(cx - r * 0.32, cy - r * 0.08, r * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + r * 0.32, cy - r * 0.08, r * 0.14, 0, Math.PI * 2); ctx.fill();
  }

  // --- HEAD ACCESSORIES (drawn on top of head around cy - r * 0.85) ---
  const topY = cy - r * 0.82;
  if (hId === 1) {
    // Кепка
    ctx.fillStyle = '#2b4c7e';
    ctx.beginPath(); ctx.arc(cx, topY + r * 0.2, r * 0.88, Math.PI, 0); ctx.fill();
    ctx.fillRect(cx - r * 0.2, topY + r * 0.06, r * 1.25, r * 0.22);
  } else if (hId === 2) {
    // Ушанка
    ctx.fillStyle = '#6b5b49';
    ctx.fillRect(cx - r * 0.92, topY - r * 0.2, r * 1.84, r * 0.62);
    ctx.fillRect(cx - r * 1.0, topY + r * 0.2, r * 0.36, r * 0.88);
    ctx.fillRect(cx + r * 0.64, topY + r * 0.2, r * 0.36, r * 0.88);
  } else if (hId === 3) {
    // Бини
    ctx.fillStyle = '#222429';
    ctx.beginPath(); ctx.arc(cx, topY + r * 0.22, r * 0.86, Math.PI, 0); ctx.fill();
    ctx.fillRect(cx - r * 0.88, topY + r * 0.08, r * 1.76, r * 0.25);
  } else if (hId === 4 || hId === 9) {
    // Шляпа детектива / ковбоя
    ctx.fillStyle = hId === 9 ? '#6b4226' : '#3e2d21';
    ctx.fillRect(cx - r * 1.35, topY + r * 0.14, r * 2.7, r * 0.18);
    ctx.fillRect(cx - r * 0.72, topY - r * 0.45, r * 1.44, r * 0.62);
  } else if (hId === 5 || hId === 7 || hId === 19) {
    // Каска / Шлем
    ctx.fillStyle = hId === 5 ? '#e6a817' : hId === 19 ? '#64748b' : '#2f3d2f';
    ctx.beginPath(); ctx.arc(cx, topY + r * 0.25, r * 0.96, Math.PI, 0); ctx.fill();
    if (hId === 19) {
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(cx - r * 0.12, topY - r * 0.85, r * 0.24, r * 0.45);
    }
  } else if (hId === 6) {
    // Балаклава
    ctx.fillStyle = '#181a1f';
    ctx.beginPath(); ctx.arc(cx, topY + r * 0.25, r * 0.92, Math.PI, 0); ctx.fill();
  } else if (hId === 8) {
    // Берет
    ctx.fillStyle = '#7a1c24';
    ctx.beginPath(); ctx.ellipse(cx + r * 0.15, topY + r * 0.04, r * 0.98, r * 0.36, -0.15, 0, Math.PI * 2); ctx.fill();
  } else if (hId === 10) {
    // Повязка ниндзя
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(cx - r * 0.95, topY + r * 0.22, r * 1.9, r * 0.28);
    ctx.fillRect(cx + r * 0.8, topY + r * 0.34, r * 0.55, r * 0.16);
  } else if (hId === 11) {
    // Капюшон
    ctx.fillStyle = '#1f1628';
    ctx.beginPath();
    ctx.moveTo(cx - r * 1.05, cy + r * 0.4);
    ctx.lineTo(cx, topY - r * 0.6);
    ctx.lineTo(cx + r * 1.05, cy + r * 0.4);
    ctx.fill();
  } else if (hId === 12) {
    // Налобный фонарь
    ctx.fillStyle = '#333';
    ctx.fillRect(cx - r * 0.92, topY + r * 0.15, r * 1.84, r * 0.24);
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(cx, topY + r * 0.26, r * 0.24, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  } else if (hId === 13) {
    // Цилиндр
    ctx.fillStyle = '#1f1924';
    ctx.fillRect(cx - r * 1.15, topY + r * 0.14, r * 2.3, r * 0.18);
    ctx.fillRect(cx - r * 0.65, topY - r * 0.85, r * 1.3, r * 1.0);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(cx - r * 0.65, topY - r * 0.05, r * 1.3, r * 0.18);
  } else if (hId === 14) {
    // Рога
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath(); ctx.moveTo(cx - r * 0.68, topY + r * 0.2); ctx.lineTo(cx - r * 0.9, topY - r * 0.68); ctx.lineTo(cx - r * 0.3, topY + r * 0.1); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + r * 0.68, topY + r * 0.2); ctx.lineTo(cx + r * 0.9, topY - r * 0.68); ctx.lineTo(cx + r * 0.3, topY + r * 0.1); ctx.fill();
  } else if (hId === 15) {
    // Нимб
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = Math.max(2, r * 0.14);
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.ellipse(cx, topY - r * 0.38, r * 0.72, r * 0.2, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.shadowBlur = 0;
  } else if (hId === 16) {
    // Шляпа ведьмы
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(cx - r * 1.25, topY + r * 0.14, r * 2.5, r * 0.16);
    ctx.beginPath(); ctx.moveTo(cx - r * 0.65, topY + r * 0.15); ctx.lineTo(cx + r * 0.15, topY - r * 0.98); ctx.lineTo(cx + r * 0.65, topY + r * 0.15); ctx.fill();
  } else if (hId === 17) {
    // Кошачьи ушки
    ctx.fillStyle = '#ec4899';
    ctx.beginPath(); ctx.moveTo(cx - r * 0.72, topY + r * 0.22); ctx.lineTo(cx - r * 0.56, topY - r * 0.46); ctx.lineTo(cx - r * 0.2, topY + r * 0.12); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + r * 0.72, topY + r * 0.22); ctx.lineTo(cx + r * 0.56, topY - r * 0.46); ctx.lineTo(cx + r * 0.2, topY + r * 0.12); ctx.fill();
  } else if (hId === 18) {
    // Кибер-наушники
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = Math.max(2, r * 0.15);
    ctx.beginPath(); ctx.arc(cx, cy - r * 0.12, r * 0.98, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = '#0891b2';
    ctx.fillRect(cx - r * 1.1, cy - r * 0.3, r * 0.26, r * 0.58);
    ctx.fillRect(cx + r * 0.84, cy - r * 0.3, r * 0.26, r * 0.58);
  } else if (hId === 20) {
    // Корона
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.75, topY + r * 0.22);
    ctx.lineTo(cx - r * 0.75, topY - r * 0.38);
    ctx.lineTo(cx - r * 0.36, topY - r * 0.02);
    ctx.lineTo(cx, topY - r * 0.56);
    ctx.lineTo(cx + r * 0.36, topY - r * 0.02);
    ctx.lineTo(cx + r * 0.75, topY - r * 0.38);
    ctx.lineTo(cx + r * 0.75, topY + r * 0.22);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(cx, topY + r * 0.04, r * 0.12, 0, Math.PI * 2); ctx.fill();
  } else if (hId === 21 || hId === 25) {
    // Шапка Санты / Колпак эльфа
    ctx.fillStyle = hId === 21 ? '#dc2626' : '#16a34a';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.9, topY + r * 0.24);
    ctx.lineTo(cx + r * 0.15, topY - r * 0.95);
    ctx.lineTo(cx + r * 0.88, topY + r * 0.24);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(cx - r * 0.94, topY + r * 0.08, r * 1.88, r * 0.24);
    ctx.beginPath(); ctx.arc(cx + r * 0.15, topY - r * 0.95, r * 0.2, 0, Math.PI * 2); ctx.fill();
  } else if (hId === 22) {
    // Оленьи рога
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = Math.max(2, r * 0.15);
    ctx.beginPath(); ctx.moveTo(cx - r * 0.45, topY + r * 0.2); ctx.lineTo(cx - r * 0.85, topY - r * 0.65); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + r * 0.45, topY + r * 0.2); ctx.lineTo(cx + r * 0.85, topY - r * 0.65); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - r * 0.68, topY - r * 0.3); ctx.lineTo(cx - r * 0.42, topY - r * 0.55); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + r * 0.68, topY - r * 0.3); ctx.lineTo(cx + r * 0.42, topY - r * 0.55); ctx.stroke();
  } else if (hId === 23) {
    // Ледяная корона
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.72, topY + r * 0.22);
    ctx.lineTo(cx - r * 0.68, topY - r * 0.42);
    ctx.lineTo(cx - r * 0.28, topY - r * 0.02);
    ctx.lineTo(cx, topY - r * 0.62);
    ctx.lineTo(cx + r * 0.28, topY - r * 0.02);
    ctx.lineTo(cx + r * 0.68, topY - r * 0.42);
    ctx.lineTo(cx + r * 0.72, topY + r * 0.22);
    ctx.closePath();
    ctx.fill();
  } else if (hId === 24) {
    // Снежная ушанка
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(cx - r * 0.92, topY - r * 0.18, r * 1.84, r * 0.58);
    ctx.fillRect(cx - r * 1.0, topY + r * 0.2, r * 0.36, r * 0.82);
    ctx.fillRect(cx + r * 0.64, topY + r * 0.2, r * 0.36, r * 0.82);
  } else if (hId === 26) {
    // Венок омелы
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = Math.max(3, r * 0.22);
    ctx.beginPath(); ctx.ellipse(cx, topY + r * 0.12, r * 0.9, r * 0.26, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(cx - r * 0.35, topY + r * 0.28, r * 0.12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + r * 0.35, topY + r * 0.28, r * 0.12, 0, Math.PI * 2); ctx.fill();
  }

  ctx.restore();
}

/**
 * Draws the Wardrobe backdrop + Foreground player avatar with skin + head/face accessories
 */
export function renderWardrobeCanvas(canvas, skinIdx = 0, headAccId = 0, faceAccId = 0) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Wall background
  const wallGrad = ctx.createLinearGradient(0, 0, 0, H);
  wallGrad.addColorStop(0, '#190c10');
  wallGrad.addColorStop(1, '#0b0507');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, W, H);

  // Floor
  ctx.fillStyle = '#251510';
  ctx.fillRect(0, H * 0.82, W, H * 0.18);
  ctx.strokeStyle = '#3a2219';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, H * 0.82);
  ctx.lineTo(W, H * 0.82);
  ctx.stroke();

  // --- BACKGROUND: WARDROBE CABINET ---
  const cabX = W * 0.16;
  const cabY = H * 0.08;
  const cabW = W * 0.68;
  const cabH = H * 0.76;

  // Outer wardrobe frame
  ctx.fillStyle = '#3c2116';
  ctx.fillRect(cabX, cabY, cabW, cabH);
  ctx.strokeStyle = '#5c3322';
  ctx.lineWidth = 3;
  ctx.strokeRect(cabX, cabY, cabW, cabH);

  // Wardrobe crown molding
  ctx.fillStyle = '#4e2b1d';
  ctx.fillRect(cabX - 8, cabY - 10, cabW + 16, 12);

  // Dark open interior
  ctx.fillStyle = '#170c08';
  ctx.fillRect(cabX + 12, cabY + 12, cabW - 24, cabH - 22);

  // Top shelf with folded boxes
  ctx.fillStyle = '#4b2a1c';
  ctx.fillRect(cabX + 12, cabY + 46, cabW - 24, 6);
  ctx.fillStyle = '#6c3e26';
  ctx.fillRect(cabX + 26, cabY + 24, 34, 22);
  ctx.fillStyle = '#7c2e2e';
  ctx.fillRect(cabX + cabW - 64, cabY + 26, 36, 20);

  // Hanging rod + background clothes
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cabX + 16, cabY + 64);
  ctx.lineTo(cabX + cabW - 16, cabY + 64);
  ctx.stroke();

  const hangerColors = ['#293545', '#4c2626', '#253d2e', '#453823'];
  hangerColors.forEach((col, i) => {
    const hx = cabX + 28 + i * ((cabW - 70) / 3);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(hx + 10, cabY + 64);
    ctx.lineTo(hx + 10, cabY + 72);
    ctx.stroke();
    ctx.fillStyle = col;
    ctx.fillRect(hx, cabY + 74, 22, 58);
  });

  // Left & Right open wardrobe doors
  ctx.fillStyle = '#4a281b';
  ctx.fillRect(cabX - 24, cabY + 4, 26, cabH - 6);
  ctx.strokeStyle = '#683926';
  ctx.strokeRect(cabX - 22, cabY + 12, 20, cabH - 22);
  ctx.fillStyle = '#d4af37';
  ctx.beginPath(); ctx.arc(cabX - 8, cabY + cabH * 0.5, 3, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#4a281b';
  ctx.fillRect(cabX + cabW - 2, cabY + 4, 26, cabH - 6);
  ctx.strokeStyle = '#683926';
  ctx.strokeRect(cabX + cabW + 2, cabY + 12, 20, cabH - 22);
  ctx.fillStyle = '#d4af37';
  ctx.beginPath(); ctx.arc(cabX + cabW + 8, cabY + cabH * 0.5, 3, 0, Math.PI * 2); ctx.fill();

  // Spotlight glow behind player
  const glow = ctx.createRadialGradient(W / 2, H * 0.52, 8, W / 2, H * 0.52, W * 0.38);
  glow.addColorStop(0, 'rgba(255, 190, 120, 0.28)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // --- FOREGROUND: PLAYER CHARACTER ---
  const skin = SKINS[skinIdx] || SKINS[0];
  const px = W / 2;
  const py = H * 0.56;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.beginPath();
  ctx.ellipse(px, H * 0.85, 38, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  ctx.fillStyle = '#1b1d24';
  ctx.fillRect(px - 20, py + 42, 16, 42);
  ctx.fillRect(px + 4, py + 42, 16, 42);
  // Boots
  ctx.fillStyle = '#111';
  ctx.fillRect(px - 22, py + 78, 19, 10);
  ctx.fillRect(px + 3, py + 78, 19, 10);

  // Torso jacket (Skin Color)
  ctx.fillStyle = skin.c;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(px - 28, py - 14, 56, 62, 10) : ctx.fillRect(px - 28, py - 14, 56, 62);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Jacket zipper & collar
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.moveTo(px, py - 12);
  ctx.lineTo(px, py + 46);
  ctx.stroke();

  // Arms
  ctx.fillStyle = skin.c;
  ctx.fillRect(px - 40, py - 8, 12, 46);
  ctx.fillRect(px + 28, py - 8, 12, 46);
  ctx.fillStyle = '#e5b899';
  ctx.beginPath(); ctx.arc(px - 34, py + 40, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + 34, py + 40, 6, 0, Math.PI * 2); ctx.fill();

  // Neck & Head
  const headR = 26;
  const headY = py - 42;
  ctx.fillStyle = '#d4a383';
  ctx.fillRect(px - 9, py - 24, 18, 14);
  ctx.fillStyle = '#ecc2a6';
  ctx.beginPath();
  ctx.arc(px, headY, headR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c29273';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Eyes & mouth
  ctx.fillStyle = '#1b1d21';
  ctx.beginPath(); ctx.arc(px - 9, headY - 3, 3.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + 9, headY - 3, 3.2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#8b5e4b';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(px - 6, headY + 10); ctx.lineTo(px + 6, headY + 10); ctx.stroke();

  // Draw equipped Head & Face accessories in foreground!
  drawAccessory2D(ctx, headAccId, faceAccId, px, headY, headR);
}

/**
 * Draws Interactive 3D Car Showcase on a Garage Background (angle & pitch in radians)
 */
export function renderCarInspectCanvas(canvas, carId, colorHex, angle = -0.62, zoom = 1.0, headlights = true, pitch = 0.24) {
  if (!canvas) return;
  const car = getCarSpec(carId);
  const paint = colorHex || car.defaultColor;
  renderCarShowcase3D(canvas, car, paint, angle, zoom, headlights, pitch);
}

/**
 * Opens the full 3-section Lobby Shop Modal:
 *  - Section 'wardrobe' (Default Center): Wardrobe backdrop + Foreground player + 20 Head + 20 Face + 6 Skins
 *  - Top arrow -> Section 'cars': Garage Dealership + 7 Cars + Rotate Inspector + 200-coin Paint + Parts needed
 *  - Bottom arrow -> Section 'monsters': Monster Skins (0 / 450 / 750 / 1250) + speed stats & slow-speed lore
 */
export function showLobbyShopModal(PF, options = {}) {
  const { pWrite, ac, TN, coop, onUpdate, unlockAch, monsterSprites } = options;
  if (!PF) return;

  // Ensure arrays / defaults
  PF.owned = Array.isArray(PF.owned) ? PF.owned : [0];
  PF.ownedHeadAcc = Array.isArray(PF.ownedHeadAcc) ? PF.ownedHeadAcc : [0];
  PF.ownedFaceAcc = Array.isArray(PF.ownedFaceAcc) ? PF.ownedFaceAcc : [0];
  PF.ownedCars = Array.isArray(PF.ownedCars) ? PF.ownedCars : ['vaz2112'];
  PF.carColors = PF.carColors && typeof PF.carColors === 'object' ? PF.carColors : { vaz2112: '#6f7882' };
  PF.ownedMonSkins = Array.isArray(PF.ownedMonSkins) ? PF.ownedMonSkins : ['maze'];
  if (!PF.eqCar) PF.eqCar = 'vaz2112';
  if (!PF.eqMonSkin) PF.eqMonSkin = 'maze';
  if (PF.headAcc === undefined) PF.headAcc = 0;
  if (PF.faceAcc === undefined) PF.faceAcc = 0;

  let section = options.initialSection || 'wardrobe'; // 'wardrobe' | 'cars' | 'monsters'
  let wardrobeTab = 'head'; // 'head' | 'face' | 'skin'
  let carGarage = 1; // 1 = Basic+Premium VAZ/UAZ, 2 = Moskvich & Tavria
  let carTierFilter = 'all'; // 'all' | 'standard' | 'premium' | 'exclusive'
  let inspectCarId = PF.eqCar || 'vaz2112';
  let carAngle = -0.62;
  let carPitch = 0.24;
  let carZoom = 1.0;
  let carLights = true;
  let draggingCar = false;
  let dragLastX = 0;
  let dragLastY = 0;
  let carDragRaf = 0;

  function cancelCarRaf() {
    if (carDragRaf) {
      cancelAnimationFrame(carDragRaf);
      carDragRaf = 0;
    }
  }

  function closeShopModal() {
    cancelCarRaf();
    draggingCar = false;
    closeAnimatedModal(modal);
  }

  const existing = document.getElementById('lobby_shop_modal');
  if (existing) disposeAnimatedModal(existing);

  const modal = document.createElement('div');
  modal.id = 'lobby_shop_modal';
  modal.style.cssText =
    'position:fixed;inset:0;background:rgba(4,6,10,0.94);z-index:9780;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;font-family:Georgia,serif';

  function snd(freq = 640) {
    if (ac && TN) {
      try {
        TN(freq, 0.08, 0.2, 'triangle');
      } catch (e) {}
    }
  }

  function saveAll() {
    if (typeof pWrite === 'function') pWrite();
    try {
      localStorage.setItem(
        'horror_shop_save',
        JSON.stringify({
          coins: safeCoins(PF.coins),
          skin: PF.skin | 0,
          owned: PF.owned,
          headAcc: PF.headAcc | 0,
          faceAcc: PF.faceAcc | 0,
          ownedHeadAcc: PF.ownedHeadAcc,
          ownedFaceAcc: PF.ownedFaceAcc,
          ownedCars: PF.ownedCars,
          eqCar: PF.eqCar,
          carColors: PF.carColors,
          ownedMonSkins: PF.ownedMonSkins,
          eqMonSkin: PF.eqMonSkin,
        })
      );
    } catch (e) {}
    if (coop && typeof coop.setProfile === 'function') {
      coop.setProfile(PF.name || 'Игрок', PF.skin | 0, PF.avatar || 'survivor', PF.frame || 'frame_classic', PF.nameBorder || 'none');
    }
    if (typeof unlockAch === 'function') {
      const totalBought =
        (PF.owned?.length || 1) - 1 +
        (PF.ownedHeadAcc?.length || 1) - 1 +
        (PF.ownedFaceAcc?.length || 1) - 1 +
        (PF.ownedCars?.length || 1) - 1 +
        (PF.ownedMonSkins?.length || 1) - 1;
      if (totalBought >= 3) unlockAch('collector');
      if ((PF.ownedCars?.length || 1) >= 2) unlockAch('auto_dealer');
    }
    if (typeof onUpdate === 'function') onUpdate();
  }

  function render() {
    const coins = safeCoins(PF.coins);
    const coinsText = formatCoins(coins);

    if (section === 'wardrobe') {
      const curHead = getHeadAccessory(PF.headAcc);
      const curFace = getFaceAccessory(PF.faceAcc);
      const curSkin = SKINS[PF.skin] || SKINS[0];

      modal.innerHTML = `
        <div style="width:100%;max-width:780px;max-height:94vh;background:#11070a;border:2px solid #8b1e25;border-radius:12px;color:#eee;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 0 40px rgba(200,25,40,0.45)">
          <!-- TOP ARROW TO CAR SHOP -->
          <button id="shop_arrow_up_cars" style="margin:0;width:100%;padding:9px 14px;background:linear-gradient(180deg, #271518 0%, #170b0d 100%);border:0;border-bottom:1px solid #6b1d24;color:#ffd280;font-weight:bold;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:0.06em">
            <span>▲</span>
            <span>МАГАЗИН МАШИН И ГАРАЖ (${CAR_CATALOG.length} АВТО · ПОКРАСКА 200 💰)</span>
            <span>▲</span>
          </button>

          <!-- HEADER -->
          <div style="padding:12px 18px;display:flex;align-items:center;justify-content:space-between;background:#17090d;border-bottom:1px solid #3f151b;flex-wrap:wrap;gap:8px">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:22px">🪞</span>
              <div>
                <div style="font-size:17px;font-weight:bold;color:#ffdddd;letter-spacing:0.05em">МАГАЗИН И ГАРДЕРОБ</div>
                <div style="font-size:11.5px;color:#aaa">Редактируй облик: 20 аксессуаров для головы, 20 для лица и одежда</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="background:#261808;border:1px solid #d4af37;padding:5px 12px;border-radius:6px;color:#ffd700;font-weight:bold;font-size:14px">
                💰 ${coinsText}
              </div>
              <button id="shop_close_btn" style="margin:0;background:transparent;border:0;color:#ff6b81;font-size:22px;cursor:pointer;padding:2px 6px">✕</button>
            </div>
          </div>

          <!-- BODY: WARDROBE PREVIEW + GRID -->
          <div style="display:flex;flex-wrap:wrap;flex:1;min-height:0;overflow:hidden">
            <!-- Left: Wardrobe Preview -->
            <div style="flex:0 0 260px;padding:14px;background:#0d0507;border-right:1px solid #381318;display:flex;flex-direction:column;align-items:center;justify-content:center">
              <canvas id="wardrobe_canvas" width="230" height="230" style="border-radius:10px;border:1px solid #521d23;box-shadow:inset 0 0 24px #000"></canvas>
              <div style="width:100%;margin-top:10px;font-size:11.5px;line-height:1.5;background:#160a0d;border:1px solid #3a151a;border-radius:6px;padding:8px">
                <div>🧥 Одежда: <b style="color:${curSkin.c}">${curSkin.name}</b></div>
                <div>👑 Голова: <b style="color:#ffd280">${curHead.icon} ${curHead.name}</b></div>
                <div>🎭 Лицо: <b style="color:#a5f3fc">${curFace.icon} ${curFace.name}</b></div>
              </div>
            </div>

            <!-- Right: Wardrobe Tabs & Items -->
            <div style="flex:1 1 320px;display:flex;flex-direction:column;min-height:0">
              <div style="display:flex;background:#18090c;border-bottom:1px solid #3d1417">
                <button id="wtab_head" style="flex:1;margin:0;padding:10px 6px;background:${wardrobeTab === 'head' ? '#2c0f16' : 'transparent'};border:0;border-bottom:2px solid ${wardrobeTab === 'head' ? '#ff4757' : 'transparent'};color:${wardrobeTab === 'head' ? '#fff' : '#999'};font-weight:bold;font-size:12px;cursor:pointer">
                  👑 Голова (${HEAD_ACCESSORIES.length - 1})
                </button>
                <button id="wtab_face" style="flex:1;margin:0;padding:10px 6px;background:${wardrobeTab === 'face' ? '#2c0f16' : 'transparent'};border:0;border-bottom:2px solid ${wardrobeTab === 'face' ? '#ff4757' : 'transparent'};color:${wardrobeTab === 'face' ? '#fff' : '#999'};font-weight:bold;font-size:12px;cursor:pointer">
                  🎭 Лицо (${FACE_ACCESSORIES.length - 1})
                </button>
                <button id="wtab_skin" style="flex:1;margin:0;padding:10px 6px;background:${wardrobeTab === 'skin' ? '#2c0f16' : 'transparent'};border:0;border-bottom:2px solid ${wardrobeTab === 'skin' ? '#ff4757' : 'transparent'};color:${wardrobeTab === 'skin' ? '#fff' : '#999'};font-weight:bold;font-size:12px;cursor:pointer">
                  🧥 Одежда (${SKINS.length})
                </button>
              </div>
              <div style="flex:1;overflow-y:auto;padding:12px;display:grid;grid-template-columns:repeat(auto-fill, minmax(135px, 1fr));gap:8px;max-height:46vh">
                ${renderWardrobeGrid()}
              </div>
            </div>
          </div>

          <!-- BOTTOM ARROW TO MONSTER SKINS -->
          <button id="shop_arrow_down_monsters" style="margin:0;width:100%;padding:9px 14px;background:linear-gradient(180deg, #170b0d 0%, #2a0c12 100%);border:0;border-top:1px solid #6b1d24;color:#ff8a96;font-weight:bold;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:0.06em">
            <span>▼</span>
            <span>СКИНЫ МОНСТРОВ ДЛЯ КООПЕРАТИВА (0 · 450 · 750 · 1250 💰)</span>
            <span>▼</span>
          </button>
        </div>
      `;

      const wc = modal.querySelector('#wardrobe_canvas');
      renderWardrobeCanvas(wc, PF.skin | 0, PF.headAcc | 0, PF.faceAcc | 0);
    } else if (section === 'cars') {
      const car = getCarSpec(inspectCarId);
      const isOwned = PF.ownedCars.includes(car.id);
      const isEquipped = PF.eqCar === car.id;
      const curColor = PF.carColors[car.id] || car.defaultColor;
      const exclCars = CAR_CATALOG.filter((c) => c.tier === 'exclusive');
      const visibleCars = CAR_CATALOG.filter((c) => {
        if (carTierFilter === 'exclusive') return c.tier === 'exclusive';
        if (carTierFilter !== 'all' && c.tier !== carTierFilter) return false;
        if (carTierFilter === 'all' && c.tier === 'exclusive') return false;
        return c.garage === carGarage;
      });

      modal.innerHTML = `
        <div style="width:100%;max-width:850px;max-height:94vh;background:#0d1015;border:2px solid #d97706;border-radius:12px;color:#eee;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 0 42px rgba(217,119,6,0.4)">
          <!-- HEADER -->
          <div style="padding:10px 16px;display:flex;align-items:center;justify-content:space-between;background:#161a22;border-bottom:1px solid #3b4252;flex-wrap:wrap;gap:8px">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:22px">${carGarage === 2 ? '🚘' : '🚗'}</span>
              <div>
                <div style="font-size:16px;font-weight:bold;color:#fde68a;letter-spacing:0.05em">
                  АВТОСАЛОН · ${carGarage === 2 ? 'ГАРАЖ 2 (МОСКВИЧИ И ТАВРИИ)' : 'ГАРАЖ 1 (ОСНОВНОЙ)'} (${CAR_CATALOG.length} АВТО)
                </div>
                <div style="font-size:11px;color:#aaa">Выбирай машину, вращай в 3D и крась за 200 монет</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <button id="car_garage_switch" style="margin:0;padding:6px 12px;background:${carGarage === 1 ? 'linear-gradient(90deg,#1d4ed8,#2563eb)' : 'linear-gradient(90deg,#92400e,#b45309)'};border:1px solid #93c5fd;color:#fff;border-radius:6px;font-weight:bold;font-size:12px;cursor:pointer">
                ${carGarage === 1 ? 'Далее → Гараж 2 · Москвичи и Таврии' : '← Назад · Гараж 1 · Основной'}
              </button>
              <div style="background:#261808;border:1px solid #d4af37;padding:5px 10px;border-radius:6px;color:#ffd700;font-weight:bold;font-size:13.5px">
                💰 ${coinsText}
              </div>
              <button id="shop_close_btn" style="margin:0;background:transparent;border:0;color:#ff6b81;font-size:22px;cursor:pointer;padding:2px 6px">✕</button>
            </div>
          </div>

          <!-- TOP EXCLUSIVE SHOWCASE STRIP -->
          <div style="padding:7px 14px;background:linear-gradient(90deg,#1b1206,#231528,#141d2e);border-bottom:1px solid #524220;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <span style="font-size:11.5px;font-weight:bold;color:#fbbf24;letter-spacing:0.06em">⭐ ЭКСКЛЮЗИВНЫЕ:</span>
              ${exclCars.map((ec) => {
                const ownedE = PF.ownedCars.includes(ec.id);
                const eqE = PF.eqCar === ec.id;
                const selE = inspectCarId === ec.id;
                return `<button class="car-excl-btn" data-car-id="${ec.id}" style="margin:0;padding:4px 10px;background:${selE ? '#422006' : '#181422'};border:1px solid ${eqE ? '#22c55e' : selE ? '#fbbf24' : '#78350f'};color:${ownedE ? '#fde68a' : '#cbd5e1'};border-radius:5px;font-size:11.5px;font-weight:bold;cursor:pointer">
                  ${ec.id === 'xmas_sleigh' ? '🛷' : '🏎️'} ${ec.name} ${eqE ? '✓' : ownedE ? '(Открыт)' : '🔒'}
                </button>`;
              }).join('')}
            </div>
            <div style="display:flex;gap:4px">
              ${[
                ['all', 'Все'],
                ['standard', 'Обычные'],
                ['premium', 'Премиум'],
                ['exclusive', 'Эксклюзивные'],
              ].map(([k, lbl]) => `<button class="car-tier-btn" data-tier="${k}" style="margin:0;padding:3px 8px;background:${carTierFilter === k ? '#d97706' : '#181c24'};border:1px solid ${carTierFilter === k ? '#fbbf24' : '#374151'};color:${carTierFilter === k ? '#fff' : '#cbd5e1'};border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer">${lbl}</button>`).join('')}
            </div>
          </div>

          <!-- BODY -->
          <div style="display:flex;flex-wrap:wrap;flex:1;min-height:0;overflow-y:auto">
            <!-- Left: Interactive Car Garage Canvas -->
            <div style="flex:1 1 360px;padding:14px;background:#0a0d12;border-right:1px solid #2b303a;display:flex;flex-direction:column;align-items:center">
              <canvas id="car_inspect_canvas" width="560" height="320" style="width:100%;max-width:440px;border-radius:8px;border:1px solid #444d5c;cursor:grab;touch-action:none"></canvas>

              <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;justify-content:center">
                <button id="car_rot_left" style="margin:0;padding:5px 10px;background:#1e2430;border:1px solid #4a5568;color:#eee;border-radius:4px;font-size:12px;cursor:pointer">⟲ Повернуть</button>
                <button id="car_rot_right" style="margin:0;padding:5px 10px;background:#1e2430;border:1px solid #4a5568;color:#eee;border-radius:4px;font-size:12px;cursor:pointer">⟳ Повернуть</button>
                <button id="car_zoom_btn" style="margin:0;padding:5px 10px;background:#1e2430;border:1px solid #4a5568;color:#eee;border-radius:4px;font-size:12px;cursor:pointer">🔍 Лупа: ${carZoom.toFixed(1)}x</button>
                <button id="car_lights_btn" style="margin:0;padding:5px 10px;background:${carLights ? '#422006' : '#1e2430'};border:1px solid ${carLights ? '#f59e0b' : '#4a5568'};color:#fde68a;border-radius:4px;font-size:12px;cursor:pointer">💡 Фары</button>
              </div>

              <!-- Car Specs + Parts needed to escape -->
              <div style="width:100%;margin-top:10px;background:#141820;border:1px solid #363d4a;border-radius:8px;padding:10px;text-align:left">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;gap:8px;flex-wrap:wrap">
                  <div>
                    <span style="font-size:16px;font-weight:bold;color:#fff">${car.name}</span>
                    ${car.category ? `<span style="margin-left:8px;font-size:10.5px;color:#cbd5e1;background:#1e2532;border:1px solid #3d485c;padding:2px 6px;border-radius:4px">${car.category}</span>` : ''}
                  </div>
                  <span style="font-size:13px;font-weight:bold;color:${isOwned ? '#2ed573' : '#ffd700'}">
                    ${isOwned ? (isEquipped ? '✓ ВЫБРАНА ДЛЯ ПОБЕГА' : '✓ КУПЛЕНА') : `${car.price} 💰`}
                  </span>
                </div>
                <div style="font-size:12px;color:#b0b8c4;margin-bottom:8px">${car.desc}</div>
                <div style="background:#1c140a;border:1px solid #b45309;border-radius:6px;padding:7px 10px;font-size:12px;color:#fde68a;margin-bottom:8px">
                  🔧 <b>Сколько нужно деталей для побега (Глава 4):</b><br/>
                  <span style="color:#86efac">Лёгкий: ${car.partsEasy} дет.</span> ·
                  <span style="color:#fbbf24">Сложный: ${car.partsHard} дет.</span> ·
                  <span style="color:#f87171">Экстрим: ${car.partsExtreme} дет.</span>
                </div>

                <!-- Paint Swatches (200 coins) -->
                <div style="font-size:11.5px;color:#cbd5e1;margin-bottom:5px">
                  🎨 <b>Покраска кузова (${CAR_PAINT_PRICE} 💰):</b>
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
                  ${CAR_PAINTS.map((p) => {
                    const activeCol = curColor.toLowerCase() === p.hex.toLowerCase();
                    return `<button class="car-paint-btn" data-hex="${p.hex}" title="${p.name} — ${CAR_PAINT_PRICE} монет" style="margin:0;width:24px;height:24px;border-radius:50%;background:${p.hex};border:${activeCol ? '2.5px solid #ffd700' : '1.5px solid #666'};cursor:pointer;box-shadow:${activeCol ? '0 0 8px #ffd700' : 'none'}"></button>`;
                  }).join('')}
                </div>

                <!-- Buy / Equip Car Button -->
                <div style="display:flex;gap:8px">
                  ${
                    !isOwned
                      ? car.promoOnly
                        ? `<div style="flex:1;padding:8px;background:#1a1523;border:1px dashed #a855f7;color:#e9d5ff;border-radius:6px;font-weight:bold;text-align:center;font-size:12.5px">
                            🔒 Эксклюзив · Введите секретный код в Настройках
                           </div>`
                        : car.eventOnly
                        ? `<div style="flex:1;padding:8px;background:#1e1312;border:1px dashed #f59e0b;color:#fde68a;border-radius:6px;font-weight:bold;text-align:center;font-size:12.5px">
                            🎄 Награда за побег из Новогодней Главы 5 (Эвент)
                           </div>`
                        : `<button id="car_buy_btn" style="flex:1;margin:0;padding:8px;background:${coins >= car.price ? '#b45309' : '#2a221c'};border:1px solid ${coins >= car.price ? '#f59e0b' : '#555'};color:${coins >= car.price ? '#fff' : '#888'};border-radius:6px;font-weight:bold;cursor:${coins >= car.price ? 'pointer' : 'not-allowed'}">
                            Купить ${car.name} за ${car.price} 💰
                           </button>`
                      : isEquipped
                      ? `<div style="flex:1;padding:8px;background:#0e2a18;border:1px solid #2ed573;color:#2ed573;border-radius:6px;font-weight:bold;text-align:center;font-size:13px">
                          ✓ ВЫБРАНА ДЛЯ ПОБЕГА
                         </div>`
                      : `<button id="car_equip_btn" style="flex:1;margin:0;padding:8px;background:#166534;border:1px solid #22c55e;color:#fff;border-radius:6px;font-weight:bold;cursor:pointer">
                          Выбрать ${car.name}
                         </button>`
                  }
                </div>
              </div>
            </div>

            <div style="flex:0 0 280px;padding:12px;display:flex;flex-direction:column;gap:8px;overflow-y:auto;max-height:62vh" id="car_list_scroll">
              ${visibleCars.map((c) => {
                const owned = PF.ownedCars.includes(c.id);
                const eq = PF.eqCar === c.id;
                const sel = inspectCarId === c.id;
                const cCol = PF.carColors[c.id] || c.defaultColor;
                return `
                  <div class="car-list-card" data-car-id="${c.id}" style="background:${sel ? '#222834' : '#141820'};border:2px solid ${sel ? '#f59e0b' : eq ? '#22c55e' : '#2f3644'};border-radius:8px;padding:10px;cursor:pointer;text-align:left;transition:border-color 0.15s,background-color 0.15s">
                    <div style="display:flex;align-items:center;justify-content:space-between">
                      <div style="display:flex;align-items:center;gap:8px">
                        <span class="car-card-swatch" style="display:inline-block;width:14px;height:14px;border-radius:3px;background:${cCol};border:1px solid #aaa"></span>
                        <b style="color:#fff;font-size:13.5px">${c.name}</b>
                      </div>
                      <span class="car-card-status" style="font-size:11.5px;font-weight:bold;color:${eq ? '#2ed573' : owned ? '#93c5fd' : c.promoOnly || c.eventOnly ? '#c084fc' : '#ffd700'}">
                        ${eq ? '✓ Надет' : owned ? 'Куплена' : c.promoOnly || c.eventOnly ? '🔒 Эксклюзив' : c.price + ' 💰'}
                      </span>
                    </div>
                    <div style="font-size:11px;color:#9ca3af;margin-top:4px;display:flex;justify-content:space-between;gap:6px">
                      <span>${c.category || ''}</span>
                      <span>Детали: ${c.partsEasy}/${c.partsHard}/${c.partsExtreme}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- DOWN ARROW BACK TO WARDROBE -->
          <button id="shop_arrow_back_wardrobe" style="margin:0;width:100%;padding:9px 14px;background:linear-gradient(180deg, #171014 0%, #2a1218 100%);border:0;border-top:1px solid #6b1d24;color:#ffbebe;font-weight:bold;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px">
            <span>▼</span>
            <span>ВЕРНУТЬСЯ В ГАРДЕРОБ</span>
            <span>▼</span>
          </button>
        </div>
      `;

      const cc = modal.querySelector('#car_inspect_canvas');
      renderCarInspectCanvas(cc, inspectCarId, curColor, carAngle, carZoom, carLights, carPitch);
    } else if (section === 'monsters') {
      modal.innerHTML = `
        <div style="width:100%;max-width:780px;max-height:94vh;background:#120609;border:2px solid #b91c1c;border-radius:12px;color:#eee;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 0 42px rgba(185,28,28,0.5)">
          <!-- UP ARROW BACK TO WARDROBE -->
          <button id="shop_arrow_back_wardrobe" style="margin:0;width:100%;padding:9px 14px;background:linear-gradient(180deg, #2a1218 0%, #170b0d 100%);border:0;border-bottom:1px solid #6b1d24;color:#ffbebe;font-weight:bold;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px">
            <span>▲</span>
            <span>ВЕРНУТЬСЯ В ГАРДЕРОБ</span>
            <span>▲</span>
          </button>

          <!-- HEADER -->
          <div style="padding:12px 18px;display:flex;align-items:center;justify-content:space-between;background:#1a090d;border-bottom:1px solid #4a151b;flex-wrap:wrap;gap:8px">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:22px">👹</span>
              <div>
                <div style="font-size:17px;font-weight:bold;color:#ff9aa2;letter-spacing:0.05em">МАГАЗИН СКИНОВ МОНСТРОВ</div>
                <div style="font-size:11.5px;color:#bbb">Выбирай облик монстра для кооперативной охоты (эксклюзивные скины работают и в одиночной игре!).</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="background:#261808;border:1px solid #d4af37;padding:5px 12px;border-radius:6px;color:#ffd700;font-weight:bold;font-size:14px">
                💰 ${coinsText}
              </div>
              <button id="shop_close_btn" style="margin:0;background:transparent;border:0;color:#ff6b81;font-size:22px;cursor:pointer;padding:2px 6px">✕</button>
            </div>
          </div>

          <!-- MONSTER CARDS -->
          <div style="flex:1;overflow-y:auto;padding:14px;display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:12px">
            ${MONSTER_SKINS.filter((m) => !m.promoOnly || PF.ownedMonSkins.includes(m.id)).map((m) => {
              const owned = PF.ownedMonSkins.includes(m.id);
              const eq = PF.eqMonSkin === m.id;
              return `
                <div style="background:#19090d;border:2px solid ${eq ? '#2ed573' : owned ? m.accent : '#4a151b'};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;text-align:left;box-shadow:${eq ? '0 0 18px rgba(46,213,115,0.28)' : 'none'}">
                  <div style="display:flex;align-items:center;gap:12px">
                    ${
                      m.previewUrl
                        ? `<img src="${m.previewUrl}" alt="${m.name}" style="width:64px;height:72px;object-fit:cover;background:#0a0406;border:1px solid ${m.accent};border-radius:6px;flex-shrink:0" />`
                        : `<canvas class="mon-preview-canvas" data-mon-id="${m.id}" width="64" height="72" style="background:#0a0406;border:1px solid ${m.accent};border-radius:6px;flex-shrink:0"></canvas>`
                    }
                    <div style="flex:1;min-width:0">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:4px">
                        <b style="color:#fff;font-size:14px">${m.name}</b>
                        <span style="font-size:10.5px;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.06);color:${m.accent};border:1px solid ${m.accent}">${m.badge}</span>
                      </div>
                      <div style="margin-top:6px;font-size:11.5px;color:#ddd">
                        ⚡ Скорость: <b style="color:${m.accent}">${m.speedLabel}</b>
                      </div>
                      <div style="width:100%;height:7px;background:#0b0406;border-radius:4px;border:1px solid #3a151b;margin-top:4px;overflow:hidden">
                        <div style="width:${m.speedPct}%;height:100%;background:${m.accent}"></div>
                      </div>
                    </div>
                  </div>
                  <div style="font-size:11.5px;color:#c9b8bc;line-height:1.4;background:#120609;border-left:2px solid ${m.accent};padding:6px 8px;border-radius:4px">
                    ${m.whySlow}
                  </div>
                  <div style="font-size:11px;color:#888">${m.trapNote}</div>
                  <div style="margin-top:auto;padding-top:4px">
                    ${
                      !owned
                        ? m.promoOnly
                          ? `<div style="padding:7px;background:#16080b;border:1px dashed #6b1d24;color:#cba3aa;border-radius:6px;font-weight:bold;text-align:center;font-size:12px">
                              🔒 Эксклюзивный код (Настройки → Коды)
                             </div>`
                          : m.eventOnly
                          ? `<div style="padding:7px;background:#1a0d12;border:1px dashed #ef4444;color:#fca5a5;border-radius:6px;font-weight:bold;text-align:center;font-size:12px">
                              🎄 Награда Новогоднего Эвента (25 ❄️)
                             </div>`
                          : `<button class="mon-buy-btn" data-mon-id="${m.id}" style="margin:0;width:100%;padding:7px;background:${coins >= m.price ? '#8b0000' : '#261418'};border:1px solid ${coins >= m.price ? '#ff4757' : '#555'};color:${coins >= m.price ? '#fff' : '#888'};border-radius:6px;font-weight:bold;cursor:${coins >= m.price ? 'pointer' : 'not-allowed'}">
                              Купить за ${m.price} 💰
                             </button>`
                        : eq
                        ? `<div style="padding:7px;background:#0e2a18;border:1px solid #2ed573;color:#2ed573;border-radius:6px;font-weight:bold;text-align:center;font-size:12.5px">
                            ✓ ВЫБРАН ${m.promoOnly || m.eventOnly ? '(СОЛО И КООП)' : 'В КООПЕРАТИВЕ'}
                           </div>`
                        : `<button class="mon-eq-btn" data-mon-id="${m.id}" style="margin:0;width:100%;padding:7px;background:#204028;border:1px solid #2ed573;color:#fff;border-radius:6px;font-weight:bold;cursor:pointer">
                            Выбрать скин
                           </button>`
                    }
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      // Render each monster sprite onto its canvas
      modal.querySelectorAll('.mon-preview-canvas').forEach((cv) => {
        const mId = cv.getAttribute('data-mon-id');
        const cctx = cv.getContext('2d');
        const spr = monsterSprites && monsterSprites[mId];
        if (spr && (spr instanceof HTMLCanvasElement || (spr.complete && spr.naturalWidth))) {
          cctx.drawImage(spr, 0, 0, cv.width, cv.height);
        } else {
          // Procedural fallback silhouette matching chapter theme
          const spec = getMonsterSkinSpec(mId);
          cctx.fillStyle = '#090305';
          cctx.fillRect(0, 0, cv.width, cv.height);
          cctx.fillStyle = spec.accent;
          cctx.beginPath(); cctx.arc(32, 22, 12, 0, Math.PI * 2); cctx.fill();
          cctx.fillRect(18, 34, 28, 30);
          cctx.fillStyle = '#000';
          cctx.beginPath(); cctx.arc(27, 20, 2.5, 0, Math.PI * 2); cctx.fill();
          cctx.beginPath(); cctx.arc(37, 20, 2.5, 0, Math.PI * 2); cctx.fill();
        }
      });
    }

    bindEvents();
  }

  function renderWardrobeGrid() {
    const coins = safeCoins(PF.coins);
    if (wardrobeTab === 'head') {
      return HEAD_ACCESSORIES.map((item) => {
        const owned = PF.ownedHeadAcc.includes(item.id);
        const eq = (PF.headAcc | 0) === item.id;
        return `
          <div class="w-acc-card" data-kind="head" data-id="${item.id}" style="background:${eq ? '#2c1016' : '#180a0d'};border:2px solid ${eq ? '#2ed573' : owned ? '#6b2029' : '#351218'};border-radius:7px;padding:8px;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;text-align:left">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:20px">${item.icon}</span>
              <span style="font-size:10.5px;font-weight:bold;color:${eq ? '#2ed573' : owned ? '#93c5fd' : coins >= item.price ? '#ffd700' : '#777'}">
                ${eq ? '✓ Надет' : owned ? 'Куплено' : `${item.price} 💰`}
              </span>
            </div>
            <div style="font-size:12px;font-weight:bold;color:#fff">${item.name}</div>
          </div>
        `;
      }).join('');
    }
    if (wardrobeTab === 'face') {
      return FACE_ACCESSORIES.map((item) => {
        const owned = PF.ownedFaceAcc.includes(item.id);
        const eq = (PF.faceAcc | 0) === item.id;
        return `
          <div class="w-acc-card" data-kind="face" data-id="${item.id}" style="background:${eq ? '#2c1016' : '#180a0d'};border:2px solid ${eq ? '#2ed573' : owned ? '#6b2029' : '#351218'};border-radius:7px;padding:8px;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;text-align:left">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:20px">${item.icon}</span>
              <span style="font-size:10.5px;font-weight:bold;color:${eq ? '#2ed573' : owned ? '#93c5fd' : coins >= item.price ? '#ffd700' : '#777'}">
                ${eq ? '✓ Надет' : owned ? 'Куплено' : `${item.price} 💰`}
              </span>
            </div>
            <div style="font-size:12px;font-weight:bold;color:#fff">${item.name}</div>
          </div>
        `;
      }).join('');
    }
    // Clothing skins
    return SKINS.map((sk, idx) => {
      const owned = PF.owned.includes(idx);
      const eq = (PF.skin | 0) === idx;
      return `
        <div class="w-acc-card" data-kind="skin" data-id="${idx}" style="background:${eq ? '#2c1016' : '#180a0d'};border:2px solid ${eq ? '#2ed573' : owned ? '#6b2029' : '#351218'};border-radius:7px;padding:8px;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;text-align:left">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
            <span style="display:inline-block;width:20px;height:20px;border-radius:4px;background:${sk.c};border:1px solid #fff"></span>
            <span style="font-size:10.5px;font-weight:bold;color:${eq ? '#2ed573' : owned ? '#93c5fd' : coins >= sk.price ? '#ffd700' : '#777'}">
              ${eq ? '✓ Надет' : owned ? 'Куплено' : `${sk.price} 💰`}
            </span>
          </div>
          <div style="font-size:12px;font-weight:bold;color:#fff">${sk.name}</div>
        </div>
      `;
    }).join('');
  }

  function bindEvents() {
    const closeBtn = modal.querySelector('#shop_close_btn');
    if (closeBtn) closeBtn.onclick = closeShopModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeShopModal();
    };

    const upCars = modal.querySelector('#shop_arrow_up_cars');
    if (upCars) {
      upCars.onclick = () => {
        cancelCarRaf();
        section = 'cars';
        snd(720);
        render();
      };
    }

    const downMon = modal.querySelector('#shop_arrow_down_monsters');
    if (downMon) {
      downMon.onclick = () => {
        cancelCarRaf();
        section = 'monsters';
        snd(420);
        render();
      };
    }

    const backWardrobe = modal.querySelector('#shop_arrow_back_wardrobe');
    if (backWardrobe) {
      backWardrobe.onclick = () => {
        cancelCarRaf();
        section = 'wardrobe';
        snd(580);
        render();
      };
    }

    if (section === 'wardrobe') {
      const th = modal.querySelector('#wtab_head');
      const tf = modal.querySelector('#wtab_face');
      const ts = modal.querySelector('#wtab_skin');
      if (th) th.onclick = () => { wardrobeTab = 'head'; render(); };
      if (tf) tf.onclick = () => { wardrobeTab = 'face'; render(); };
      if (ts) ts.onclick = () => { wardrobeTab = 'skin'; render(); };

      modal.querySelectorAll('.w-acc-card').forEach((card) => {
        card.onclick = () => {
          const kind = card.getAttribute('data-kind');
          const id = parseInt(card.getAttribute('data-id') || '0', 10);
          if (kind === 'head') {
            if (PF.ownedHeadAcc.includes(id)) {
              PF.headAcc = id;
              snd(660);
              saveAll();
              render();
            } else {
              const item = getHeadAccessory(id);
              if (PF.coins >= item.price) {
                PF.coins -= item.price;
                PF.ownedHeadAcc.push(id);
                PF.headAcc = id;
                snd(820);
                saveAll();
                render();
              } else {
                snd(180);
              }
            }
          } else if (kind === 'face') {
            if (PF.ownedFaceAcc.includes(id)) {
              PF.faceAcc = id;
              snd(660);
              saveAll();
              render();
            } else {
              const item = getFaceAccessory(id);
              if (PF.coins >= item.price) {
                PF.coins -= item.price;
                PF.ownedFaceAcc.push(id);
                PF.faceAcc = id;
                snd(820);
                saveAll();
                render();
              } else {
                snd(180);
              }
            }
          } else if (kind === 'skin') {
            if (PF.owned.includes(id)) {
              PF.skin = id;
              snd(660);
              saveAll();
              render();
            } else {
              const sk = SKINS[id];
              if (sk && PF.coins >= sk.price) {
                PF.coins -= sk.price;
                PF.owned.push(id);
                PF.skin = id;
                snd(820);
                saveAll();
                render();
              } else {
                snd(180);
              }
            }
          }
        };
      });
    } else if (section === 'cars') {
      const cc = modal.querySelector('#car_inspect_canvas');
      const rotL = modal.querySelector('#car_rot_left');
      const rotR = modal.querySelector('#car_rot_right');
      const zoomB = modal.querySelector('#car_zoom_btn');
      const lightsB = modal.querySelector('#car_lights_btn');

      const drawCarNow = () => {
        if (!cc || !cc.isConnected) return;
        renderCarInspectCanvas(
          cc,
          inspectCarId,
          PF.carColors[inspectCarId] || getCarSpec(inspectCarId).defaultColor,
          carAngle,
          carZoom,
          carLights,
          carPitch
        );
      };

      const scheduleCarRedraw = () => {
        if (carDragRaf) return;
        carDragRaf = requestAnimationFrame(() => {
          carDragRaf = 0;
          drawCarNow();
        });
      };

      if (cc) {
        let activePointerId = null;
        const stopDrag = (e) => {
          if (!draggingCar) return;
          draggingCar = false;
          if (e && activePointerId !== null && cc.releasePointerCapture) {
            try { cc.releasePointerCapture(activePointerId); } catch (_) {}
          }
          activePointerId = null;
          cc.style.cursor = 'grab';
        };
        cc.onpointerdown = (e) => {
          if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;
          e.preventDefault();
          draggingCar = true;
          activePointerId = e.pointerId;
          dragLastX = e.clientX;
          dragLastY = e.clientY;
          cc.style.cursor = 'grabbing';
          if (cc.setPointerCapture) {
            try { cc.setPointerCapture(e.pointerId); } catch (_) {}
          }
        };
        cc.onpointermove = (e) => {
          if (!draggingCar) return;
          const dx = e.clientX - dragLastX;
          const dy = e.clientY - dragLastY;
          if (!dx && !dy) return;
          carAngle -= dx * 0.018;
          carPitch = Math.max(0.06, Math.min(0.58, carPitch + dy * 0.009));
          dragLastX = e.clientX;
          dragLastY = e.clientY;
          scheduleCarRedraw();
        };
        cc.onpointerup = stopDrag;
        cc.onpointercancel = stopDrag;
        cc.onlostpointercapture = stopDrag;
        cc.onwheel = (e) => {
          e.preventDefault();
          const step = e.deltaY < 0 ? 0.08 : -0.08;
          carZoom = Math.max(0.75, Math.min(1.4, Number((carZoom + step).toFixed(2))));
          if (zoomB) zoomB.textContent = `🔍 Лупа: ${carZoom.toFixed(1)}x`;
          scheduleCarRedraw();
        };
      }

      if (rotL) {
        rotL.onclick = () => {
          carAngle -= 0.45;
          scheduleCarRedraw();
        };
      }
      if (rotR) {
        rotR.onclick = () => {
          carAngle += 0.45;
          scheduleCarRedraw();
        };
      }
      if (zoomB) {
        zoomB.onclick = () => {
          carZoom = carZoom >= 1.25 ? 0.9 : Number((carZoom + 0.15).toFixed(2));
          zoomB.textContent = `🔍 Лупа: ${carZoom.toFixed(1)}x`;
          scheduleCarRedraw();
        };
      }
      if (lightsB) {
        lightsB.onclick = () => {
          carLights = !carLights;
          lightsB.style.background = carLights ? '#422006' : '#1e2430';
          lightsB.style.borderColor = carLights ? '#f59e0b' : '#4a5568';
          snd(500);
          scheduleCarRedraw();
        };
      }

      const garageSwitch = modal.querySelector('#car_garage_switch');
      if (garageSwitch) {
        garageSwitch.onclick = () => {
          cancelCarRaf();
          carGarage = carGarage === 1 ? 2 : 1;
          if (carTierFilter === 'exclusive') carTierFilter = 'all';
          const firstInGarage = CAR_CATALOG.find((c) => c.garage === carGarage && c.tier !== 'exclusive');
          if (firstInGarage) inspectCarId = firstInGarage.id;
          snd(700);
          render();
        };
      }

      modal.querySelectorAll('.car-excl-btn').forEach((btn) => {
        btn.onclick = () => {
          const nextId = btn.getAttribute('data-car-id');
          if (!nextId) return;
          cancelCarRaf();
          inspectCarId = nextId;
          snd(760);
          render();
        };
      });

      modal.querySelectorAll('.car-tier-btn').forEach((btn) => {
        btn.onclick = () => {
          carTierFilter = btn.getAttribute('data-tier') || 'all';
          if (carTierFilter === 'exclusive') {
            const firstEx = CAR_CATALOG.find((c) => c.tier === 'exclusive');
            if (firstEx) inspectCarId = firstEx.id;
          }
          snd(600);
          render();
        };
      });

      const syncCarsView = () => {
        const listEl = modal.querySelector('#car_list_scroll');
        const prevScroll = listEl ? listEl.scrollTop : 0;
        render();
        const nextListEl = modal.querySelector('#car_list_scroll');
        if (nextListEl) nextListEl.scrollTop = prevScroll;
      };

      modal.querySelectorAll('.car-list-card').forEach((card) => {
        card.onclick = () => {
          const nextId = card.getAttribute('data-car-id') || 'vaz2112';
          if (nextId === inspectCarId) return;
          cancelCarRaf();
          inspectCarId = nextId;
          snd(600);
          syncCarsView();
        };
      });

      const buyCarBtn = modal.querySelector('#car_buy_btn');
      if (buyCarBtn) {
        buyCarBtn.onclick = () => {
          const car = getCarSpec(inspectCarId);
          if (!car.promoOnly && !car.eventOnly && PF.coins >= car.price && !PF.ownedCars.includes(car.id)) {
            PF.coins -= car.price;
            PF.ownedCars.push(car.id);
            PF.eqCar = car.id;
            snd(860);
            saveAll();
            syncCarsView();
          } else {
            snd(180);
          }
        };
      }

      const eqCarBtn = modal.querySelector('#car_equip_btn');
      if (eqCarBtn) {
        eqCarBtn.onclick = () => {
          if (PF.ownedCars.includes(inspectCarId)) {
            PF.eqCar = inspectCarId;
            snd(700);
            saveAll();
            syncCarsView();
          }
        };
      }

      modal.querySelectorAll('.car-paint-btn').forEach((btn) => {
        btn.onclick = () => {
          const hex = btn.getAttribute('data-hex');
          if (!PF.ownedCars.includes(inspectCarId)) {
            snd(180);
            return;
          }
          if ((PF.carColors[inspectCarId] || '').toLowerCase() === (hex || '').toLowerCase()) return;
          if (PF.coins >= CAR_PAINT_PRICE) {
            PF.coins -= CAR_PAINT_PRICE;
            PF.carColors[inspectCarId] = hex;
            snd(880);
            saveAll();
            syncCarsView();
          } else {
            snd(180);
          }
        };
      });
    } else if (section === 'monsters') {
      modal.querySelectorAll('.mon-buy-btn').forEach((btn) => {
        btn.onclick = () => {
          const id = btn.getAttribute('data-mon-id');
          const spec = getMonsterSkinSpec(id);
          if (spec && !spec.promoOnly && safeCoins(PF.coins) >= spec.price && !PF.ownedMonSkins.includes(id)) {
            PF.coins = safeCoins(PF.coins) - spec.price;
            PF.ownedMonSkins.push(id);
            PF.eqMonSkin = id;
            snd(840);
            saveAll();
            render();
          } else {
            snd(180);
          }
        };
      });
      modal.querySelectorAll('.mon-eq-btn').forEach((btn) => {
        btn.onclick = () => {
          const id = btn.getAttribute('data-mon-id');
          if (PF.ownedMonSkins.includes(id)) {
            PF.eqMonSkin = id;
            snd(680);
            saveAll();
            render();
          }
        };
      });
    }
  }

  document.body.appendChild(modal);
  render();
  openAnimatedModal(modal);
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * High-Detail 3D Polyhedral Car Showcase Engine for Garage #4 Dealership.
 * Supports all 24 VAZ/Lada, Volga, and UAZ vehicles with authentic silhouettes,
 * 24-segment 3D wheels + brake calipers, translucent glass with visible cabin seats/steering,
 * Fresnel metallic paint shading, X-face & chrome grilles, crystal round/swept headlamps,
 * multi-zone taillights, side mirrors, wipers, roof racks/spoilers/antennas, mudflaps,
 * exhaust tips, and Russian license plates.
 */

function hexToRgb(hex) {
  const clean = String(hex || '#6f7882').replace('#', '');
  if (clean.length !== 6) return [120, 128, 136];
  const n = parseInt(clean, 16);
  if (Number.isNaN(n)) return [120, 128, 136];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbStr(rgb, mult = 1, add = 0, alpha = 1) {
  const r = Math.max(0, Math.min(255, Math.round(rgb[0] * mult + add)));
  const g = Math.max(0, Math.min(255, Math.round(rgb[1] * mult + add)));
  const b = Math.max(0, Math.min(255, Math.round(rgb[2] * mult + add)));
  return alpha < 0.999 ? `rgba(${r},${g},${b},${alpha})` : `rgb(${r},${g},${b})`;
}

function norm3(v) {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

function sub3(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross3(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function dot3(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function getBlueprint(carId) {
  switch (carId) {
    case 'oka':
      return {
        halfL: 0.80,
        halfW: 0.385,
        roofW: 0.305,
        noseTaper: 0.038,
        tailTaper: 0.028,
        bulge: 0.014,
        ground: 0.11,
        beltY: 0.38,
        roofY: 0.675,
        hoodX: 0.34,
        windTopX: 0.11,
        rearRoofX: -0.66,
        rearGlassX: -0.77,
        frontSlopeY: 0.33,
        rearDeckY: 0.39,
        wheelR: 0.122,
        wheelW: 0.084,
        frontAxle: 0.50,
        rearAxle: -0.50,
        bumperCol: [28, 31, 36],
        thickBumpers: true,
        grille: 'oka',
        headlights: 'rect_small',
        taillights: 'oka',
        doors: 1,
        rimStyle: 'steel',
        rearWiper: true,
        mudflaps: true,
        plate: 'О 111 КА',
      };
    case 'vaz2101':
      return {
        halfL: 1.01,
        halfW: 0.415,
        roofW: 0.328,
        noseTaper: 0.032,
        tailTaper: 0.032,
        bulge: 0.016,
        ground: 0.125,
        beltY: 0.385,
        roofY: 0.65,
        hoodX: 0.37,
        windTopX: 0.15,
        rearRoofX: -0.39,
        rearGlassX: -0.64,
        frontSlopeY: 0.37,
        rearDeckY: 0.375,
        wheelR: 0.142,
        wheelW: 0.094,
        frontAxle: 0.63,
        rearAxle: -0.61,
        bumperCol: [215, 224, 234],
        overriders: true,
        chromeSide: true,
        chromeWindowTrim: true,
        mudflaps: true,
        antenna: true,
        grille: 'chrome_bar_2101',
        headlights: 'round_single',
        taillights: 'slim_2101',
        doors: 2,
        rimStyle: 'chrome_cap',
        plate: 'А 201 КП',
      };
    case 'vaz2102':
      return {
        halfL: 1.03,
        halfW: 0.415,
        roofW: 0.332,
        noseTaper: 0.032,
        tailTaper: 0.025,
        bulge: 0.016,
        ground: 0.125,
        beltY: 0.39,
        roofY: 0.665,
        hoodX: 0.37,
        windTopX: 0.15,
        rearRoofX: -0.90,
        rearGlassX: -1.00,
        frontSlopeY: 0.37,
        rearDeckY: 0.405,
        wheelR: 0.142,
        wheelW: 0.094,
        frontAxle: 0.63,
        rearAxle: -0.62,
        bumperCol: [215, 224, 234],
        overriders: true,
        chromeSide: true,
        chromeWindowTrim: true,
        roofRack: true,
        wagonGlass: true,
        rearWiper: true,
        mudflaps: true,
        grille: 'chrome_bar_2101',
        headlights: 'round_single',
        taillights: 'wagon_2102',
        doors: 2,
        rimStyle: 'chrome_cap',
        plate: 'У 202 УН',
      };
    case 'vaz2105':
      return {
        halfL: 1.02,
        halfW: 0.415,
        roofW: 0.33,
        noseTaper: 0.02,
        tailTaper: 0.02,
        bulge: 0.012,
        ground: 0.12,
        beltY: 0.39,
        roofY: 0.65,
        hoodX: 0.38,
        windTopX: 0.16,
        rearRoofX: -0.40,
        rearGlassX: -0.64,
        frontSlopeY: 0.38,
        rearDeckY: 0.38,
        wheelR: 0.14,
        wheelW: 0.095,
        frontAxle: 0.63,
        rearAxle: -0.62,
        bumperCol: [176, 184, 194],
        bumperRubber: true,
        mudflaps: true,
        antenna: true,
        grille: 'slat_black',
        headlights: 'rect_block',
        taillights: 'zhiguli_block',
        doors: 2,
        rimStyle: 'steel_cap',
        plate: 'А 205 ЕХ',
      };
    case 'vaz2107':
      return {
        halfL: 1.03,
        halfW: 0.415,
        roofW: 0.33,
        noseTaper: 0.02,
        tailTaper: 0.02,
        bulge: 0.012,
        ground: 0.12,
        beltY: 0.39,
        roofY: 0.65,
        hoodX: 0.38,
        windTopX: 0.16,
        rearRoofX: -0.40,
        rearGlassX: -0.64,
        frontSlopeY: 0.385,
        rearDeckY: 0.38,
        wheelR: 0.14,
        wheelW: 0.095,
        frontAxle: 0.63,
        rearAxle: -0.62,
        bumperCol: [204, 212, 222],
        bumperRubber: true,
        mudflaps: true,
        hoodRib: true,
        antenna: true,
        grille: 'tall_chrome_2107',
        headlights: 'rect_block',
        taillights: 'zhiguli_2107',
        doors: 2,
        rimStyle: 'chrome_cap',
        plate: 'В 207 ОР',
      };
    case 'vaz2104':
      return {
        halfL: 1.04,
        halfW: 0.415,
        roofW: 0.335,
        noseTaper: 0.02,
        tailTaper: 0.02,
        bulge: 0.012,
        ground: 0.125,
        beltY: 0.39,
        roofY: 0.665,
        hoodX: 0.38,
        windTopX: 0.16,
        rearRoofX: -0.92,
        rearGlassX: -1.01,
        frontSlopeY: 0.38,
        rearDeckY: 0.405,
        wheelR: 0.142,
        wheelW: 0.095,
        frontAxle: 0.63,
        rearAxle: -0.62,
        bumperCol: [176, 184, 194],
        bumperRubber: true,
        roofRack: true,
        wagonGlass: true,
        rearWiper: true,
        mudflaps: true,
        grille: 'slat_black',
        headlights: 'rect_block',
        taillights: 'wagon_2104',
        doors: 2,
        rimStyle: 'steel_cap',
        plate: 'Т 204 КР',
      };
    case 'vaz2106':
      return {
        halfL: 1.03,
        halfW: 0.415,
        roofW: 0.33,
        noseTaper: 0.025,
        tailTaper: 0.025,
        bulge: 0.014,
        ground: 0.12,
        beltY: 0.39,
        roofY: 0.65,
        hoodX: 0.38,
        windTopX: 0.16,
        rearRoofX: -0.40,
        rearGlassX: -0.64,
        frontSlopeY: 0.375,
        rearDeckY: 0.38,
        wheelR: 0.14,
        wheelW: 0.095,
        frontAxle: 0.63,
        rearAxle: -0.62,
        bumperCol: [218, 226, 236],
        overriders: true,
        chromeSide: true,
        chromeWindowTrim: true,
        mudflaps: true,
        antenna: true,
        grille: 'chrome_mesh_2106',
        headlights: 'quad_round',
        taillights: 'slim_2106',
        doors: 2,
        rimStyle: 'chrome_dish',
        plate: 'С 206 СССР',
      };
    case 'vaz2108':
      return {
        halfL: 0.98,
        halfW: 0.425,
        roofW: 0.325,
        noseTaper: 0.048,
        tailTaper: 0.036,
        bulge: 0.014,
        ground: 0.11,
        beltY: 0.38,
        roofY: 0.63,
        hoodX: 0.36,
        windTopX: 0.10,
        rearRoofX: -0.60,
        rearGlassX: -0.91,
        frontSlopeY: 0.32,
        rearDeckY: 0.39,
        wheelR: 0.14,
        wheelW: 0.098,
        frontAxle: 0.62,
        rearAxle: -0.60,
        bumperCol: [28, 30, 35],
        thickBumpers: true,
        sideRubStrip: true,
        chinSpoiler: true,
        spoiler: true,
        rearWiper: true,
        mudflaps: true,
        grille: 'zubilo',
        headlights: 'rect_wedge',
        taillights: 'samara',
        doors: 1,
        rimStyle: 'steel',
        plate: 'О 208 СП',
      };
    case 'vaz2109':
      return {
        halfL: 0.99,
        halfW: 0.425,
        roofW: 0.325,
        noseTaper: 0.045,
        tailTaper: 0.035,
        bulge: 0.014,
        ground: 0.11,
        beltY: 0.38,
        roofY: 0.635,
        hoodX: 0.36,
        windTopX: 0.11,
        rearRoofX: -0.62,
        rearGlassX: -0.92,
        frontSlopeY: 0.325,
        rearDeckY: 0.39,
        wheelR: 0.14,
        wheelW: 0.098,
        frontAxle: 0.62,
        rearAxle: -0.60,
        bumperCol: [28, 30, 35],
        thickBumpers: true,
        sideRubStrip: true,
        chinSpoiler: true,
        rearWiper: true,
        mudflaps: true,
        grille: 'zubilo',
        headlights: 'rect_wedge',
        taillights: 'samara',
        doors: 2,
        rimStyle: 'steel',
        plate: 'К 209 МН',
      };
    case 'vaz2114':
      return {
        halfL: 1.01,
        halfW: 0.428,
        roofW: 0.328,
        noseTaper: 0.056,
        tailTaper: 0.04,
        bulge: 0.017,
        ground: 0.11,
        beltY: 0.385,
        roofY: 0.635,
        hoodX: 0.38,
        windTopX: 0.12,
        rearRoofX: -0.62,
        rearGlassX: -0.93,
        frontSlopeY: 0.325,
        rearDeckY: 0.395,
        wheelR: 0.142,
        wheelW: 0.10,
        frontAxle: 0.62,
        rearAxle: -0.60,
        bumperCol: 'body',
        thickBumpers: true,
        sideSkirt: true,
        sideRubStrip: true,
        bodyMirrors: true,
        spoiler: true,
        fogLights: true,
        rearWiper: true,
        grille: 'samara2',
        headlights: 'samara2',
        taillights: 'samara2',
        doors: 2,
        rimStyle: 'alloy_5',
        plate: 'Н 214 СМ',
      };
    case 'vaz2115':
      return {
        halfL: 1.06,
        halfW: 0.428,
        roofW: 0.328,
        noseTaper: 0.056,
        tailTaper: 0.042,
        bulge: 0.017,
        ground: 0.11,
        beltY: 0.385,
        roofY: 0.635,
        hoodX: 0.40,
        windTopX: 0.14,
        rearRoofX: -0.45,
        rearGlassX: -0.72,
        frontSlopeY: 0.325,
        rearDeckY: 0.385,
        wheelR: 0.142,
        wheelW: 0.10,
        frontAxle: 0.65,
        rearAxle: -0.58,
        bumperCol: 'body',
        thickBumpers: true,
        sideSkirt: true,
        sideRubStrip: true,
        bodyMirrors: true,
        trunkSpoiler: true,
        fogLights: true,
        grille: 'samara2',
        headlights: 'samara2',
        taillights: 'samara2',
        doors: 2,
        rimStyle: 'alloy_5',
        plate: 'Р 215 СТ',
      };
    case 'vaz21099':
      return {
        halfL: 1.05,
        halfW: 0.425,
        roofW: 0.325,
        noseTaper: 0.045,
        tailTaper: 0.035,
        bulge: 0.014,
        ground: 0.11,
        beltY: 0.38,
        roofY: 0.635,
        hoodX: 0.40,
        windTopX: 0.15,
        rearRoofX: -0.44,
        rearGlassX: -0.71,
        frontSlopeY: 0.325,
        rearDeckY: 0.38,
        wheelR: 0.14,
        wheelW: 0.098,
        frontAxle: 0.65,
        rearAxle: -0.58,
        bumperCol: [28, 30, 35],
        thickBumpers: true,
        sideRubStrip: true,
        mudflaps: true,
        antenna: true,
        grille: 'zubilo',
        headlights: 'rect_wedge',
        taillights: 'samara',
        doors: 2,
        rimStyle: 'alloy_5',
        plate: 'Х 099 АМ',
      };
    case 'vaz2110':
      return {
        halfL: 1.06,
        halfW: 0.435,
        roofW: 0.34,
        noseTaper: 0.068,
        tailTaper: 0.055,
        bulge: 0.022,
        ground: 0.11,
        beltY: 0.40,
        roofY: 0.66,
        hoodX: 0.44,
        windTopX: 0.15,
        rearRoofX: -0.46,
        rearGlassX: -0.75,
        frontSlopeY: 0.34,
        rearDeckY: 0.40,
        wheelR: 0.144,
        wheelW: 0.10,
        frontAxle: 0.66,
        rearAxle: -0.60,
        bumperCol: 'body',
        bodyMirrors: true,
        sideSkirt: true,
        antenna: true,
        grille: 'curved_2110',
        headlights: 'almond',
        taillights: 'strip_2110',
        doors: 2,
        rimStyle: 'alloy_5',
        plate: 'М 210 АК',
      };
    case 'vaz2111':
      return {
        halfL: 1.08,
        halfW: 0.435,
        roofW: 0.34,
        noseTaper: 0.068,
        tailTaper: 0.045,
        bulge: 0.022,
        ground: 0.11,
        beltY: 0.40,
        roofY: 0.67,
        hoodX: 0.46,
        windTopX: 0.17,
        rearRoofX: -0.92,
        rearGlassX: -1.03,
        frontSlopeY: 0.34,
        rearDeckY: 0.41,
        wheelR: 0.144,
        wheelW: 0.10,
        frontAxle: 0.66,
        rearAxle: -0.62,
        bumperCol: 'body',
        bodyMirrors: true,
        roofRails: true,
        wagonGlass: true,
        rearWiper: true,
        grille: 'curved_2110',
        headlights: 'almond',
        taillights: 'wagon_2111',
        doors: 2,
        rimStyle: 'alloy_5',
        plate: 'Т 211 УН',
      };
    case 'kalina':
      return {
        halfL: 1.00,
        halfW: 0.432,
        roofW: 0.342,
        noseTaper: 0.068,
        tailTaper: 0.056,
        bulge: 0.022,
        ground: 0.115,
        beltY: 0.405,
        roofY: 0.685,
        hoodX: 0.41,
        windTopX: 0.15,
        rearRoofX: -0.47,
        rearGlassX: -0.76,
        frontSlopeY: 0.34,
        rearDeckY: 0.405,
        wheelR: 0.144,
        wheelW: 0.10,
        frontAxle: 0.62,
        rearAxle: -0.58,
        bumperCol: 'body',
        bodyMirrors: true,
        fogLights: true,
        antenna: true,
        grille: 'kalina_smile',
        headlights: 'teardrop_kalina',
        taillights: 'kalina',
        doors: 2,
        rimStyle: 'alloy_modern',
        plate: 'К 118 ЛД',
      };
    case 'niva2121':
      return {
        halfL: 0.93,
        halfW: 0.43,
        roofW: 0.345,
        noseTaper: 0.035,
        tailTaper: 0.03,
        bulge: 0.014,
        ground: 0.175,
        beltY: 0.44,
        roofY: 0.74,
        hoodX: 0.30,
        windTopX: 0.08,
        rearRoofX: -0.76,
        rearGlassX: -0.88,
        frontSlopeY: 0.42,
        rearDeckY: 0.44,
        wheelR: 0.162,
        wheelW: 0.115,
        frontAxle: 0.56,
        rearAxle: -0.54,
        bumperCol: [192, 200, 208],
        fenderFlares: true,
        roofRack: true,
        rearSpare: true,
        rearWiper: true,
        mudflaps: true,
        grille: 'niva',
        headlights: 'round_eyebrow',
        taillights: 'niva',
        doors: 1,
        rimStyle: 'offroad',
        plate: 'Н 444 ИВ',
      };
    case 'niva2123':
      return {
        halfL: 1.01,
        halfW: 0.445,
        roofW: 0.355,
        noseTaper: 0.06,
        tailTaper: 0.044,
        bulge: 0.022,
        ground: 0.17,
        beltY: 0.445,
        roofY: 0.755,
        hoodX: 0.39,
        windTopX: 0.14,
        rearRoofX: -0.80,
        rearGlassX: -0.93,
        frontSlopeY: 0.40,
        rearDeckY: 0.45,
        wheelR: 0.162,
        wheelW: 0.114,
        frontAxle: 0.62,
        rearAxle: -0.60,
        bumperCol: [32, 35, 40],
        fenderFlares: true,
        sideCladding: true,
        roofRails: true,
        wagonGlass: true,
        rearSpare: true,
        rearWiper: true,
        fogLights: true,
        bodyMirrors: true,
        grille: 'chevy_niva',
        headlights: 'swept_modern',
        taillights: 'largus_tall',
        doors: 2,
        rimStyle: 'alloy_5',
        plate: 'Ш 223 НВ',
      };
    case 'priora':
      return {
        halfL: 1.07,
        halfW: 0.435,
        roofW: 0.335,
        noseTaper: 0.072,
        tailTaper: 0.06,
        bulge: 0.022,
        ground: 0.11,
        beltY: 0.40,
        roofY: 0.66,
        hoodX: 0.44,
        windTopX: 0.15,
        rearRoofX: -0.46,
        rearGlassX: -0.77,
        frontSlopeY: 0.34,
        rearDeckY: 0.41,
        wheelR: 0.146,
        wheelW: 0.102,
        frontAxle: 0.66,
        rearAxle: -0.60,
        bumperCol: 'body',
        bodyMirrors: true,
        sideSkirt: true,
        antenna: true,
        grille: 'priora_trap',
        headlights: 'priora',
        taillights: 'priora',
        fogLights: true,
        doors: 2,
        rimStyle: 'alloy_5',
        plate: 'Р 700 ПР',
      };
    case 'granta':
      return {
        halfL: 1.06,
        halfW: 0.438,
        roofW: 0.34,
        noseTaper: 0.075,
        tailTaper: 0.062,
        bulge: 0.024,
        ground: 0.105,
        beltY: 0.41,
        roofY: 0.665,
        hoodX: 0.44,
        windTopX: 0.15,
        rearRoofX: -0.47,
        rearGlassX: -0.78,
        frontSlopeY: 0.345,
        rearDeckY: 0.425,
        wheelR: 0.148,
        wheelW: 0.104,
        frontAxle: 0.65,
        rearAxle: -0.60,
        bumperCol: 'body',
        bodyMirrors: true,
        sideSkirt: true,
        chinSpoiler: true,
        trunkSpoiler: true,
        sharkFin: true,
        fogLights: true,
        grille: 'granta_sport',
        headlights: 'swept_modern',
        taillights: 'priora',
        doors: 2,
        rimStyle: 'alloy_modern',
        plate: 'Г 190 СР',
      };
    case 'largus':
      return {
        halfL: 1.11,
        halfW: 0.445,
        roofW: 0.36,
        noseTaper: 0.062,
        tailTaper: 0.04,
        bulge: 0.018,
        ground: 0.135,
        beltY: 0.43,
        roofY: 0.76,
        hoodX: 0.50,
        windTopX: 0.24,
        rearRoofX: -0.96,
        rearGlassX: -1.06,
        frontSlopeY: 0.37,
        rearDeckY: 0.43,
        wheelR: 0.152,
        wheelW: 0.105,
        frontAxle: 0.68,
        rearAxle: -0.66,
        bumperCol: [32, 35, 40],
        fenderFlares: true,
        roofRails: true,
        wagonGlass: true,
        fogLights: true,
        rearWiper: true,
        grille: 'largus_u',
        headlights: 'largus',
        taillights: 'largus_tall',
        doors: 2,
        rimStyle: 'alloy_5',
        plate: 'Л 500 АР',
      };
    case 'volga3110':
      return {
        halfL: 1.18,
        halfW: 0.455,
        roofW: 0.345,
        noseTaper: 0.065,
        tailTaper: 0.055,
        bulge: 0.02,
        ground: 0.12,
        beltY: 0.40,
        roofY: 0.66,
        hoodX: 0.44,
        windTopX: 0.16,
        rearRoofX: -0.48,
        rearGlassX: -0.77,
        frontSlopeY: 0.36,
        rearDeckY: 0.39,
        wheelR: 0.15,
        wheelW: 0.105,
        frontAxle: 0.72,
        rearAxle: -0.68,
        bumperCol: 'body',
        bodyMirrors: true,
        chromeSide: true,
        chromeWindowTrim: true,
        hoodRib: true,
        antenna: true,
        grille: 'volga_teeth',
        headlights: 'volga_wide',
        taillights: 'volga_wide',
        doors: 2,
        rimStyle: 'chrome_dish',
        plate: 'А 310 ВО',
      };
    case 'vesta':
      return {
        halfL: 1.09,
        halfW: 0.445,
        roofW: 0.338,
        noseTaper: 0.082,
        tailTaper: 0.064,
        bulge: 0.026,
        ground: 0.115,
        beltY: 0.415,
        roofY: 0.665,
        hoodX: 0.46,
        windTopX: 0.14,
        rearRoofX: -0.49,
        rearGlassX: -0.82,
        frontSlopeY: 0.34,
        rearDeckY: 0.425,
        wheelR: 0.15,
        wheelW: 0.106,
        frontAxle: 0.67,
        rearAxle: -0.62,
        bumperCol: 'body',
        bodyMirrors: true,
        sideSkirt: true,
        chinSpoiler: true,
        xSides: true,
        sharkFin: true,
        fogLights: true,
        grille: 'vesta_x',
        headlights: 'vesta_led',
        taillights: 'vesta_c',
        doors: 2,
        rimStyle: 'alloy_modern',
        plate: 'В 888 СТ',
      };
    case 'uaz452':
      return {
        halfL: 1.06,
        halfW: 0.46,
        roofW: 0.395,
        noseTaper: 0.055,
        tailTaper: 0.045,
        bulge: 0.018,
        ground: 0.19,
        beltY: 0.48,
        roofY: 0.85,
        isVan: true,
        wheelR: 0.172,
        wheelW: 0.116,
        frontAxle: 0.63,
        rearAxle: -0.62,
        bumperCol: [36, 40, 44],
        mudflaps: true,
        grille: 'uaz_loaf',
        headlights: 'round_twin',
        taillights: 'uaz_van',
        doors: 2,
        rimStyle: 'offroad',
        plate: 'У 452 АЗ',
      };
    case 'moskvich412':
      return {
        halfL: 1.02,
        halfW: 0.41,
        roofW: 0.32,
        noseTaper: 0.036,
        tailTaper: 0.036,
        bulge: 0.015,
        ground: 0.135,
        beltY: 0.385,
        roofY: 0.65,
        hoodX: 0.37,
        windTopX: 0.14,
        rearRoofX: -0.40,
        rearGlassX: -0.66,
        frontSlopeY: 0.37,
        rearDeckY: 0.375,
        wheelR: 0.144,
        wheelW: 0.094,
        frontAxle: 0.62,
        rearAxle: -0.60,
        bumperCol: [216, 224, 234],
        overriders: true,
        chromeSide: true,
        chromeWindowTrim: true,
        mudflaps: true,
        antenna: true,
        grille: 'moskvich_chrome',
        headlights: 'rect_block',
        taillights: 'slim_2101',
        doors: 2,
        rimStyle: 'chrome_cap',
        plate: 'М 412 АЗ',
      };
    case 'moskvich2140':
      return {
        halfL: 1.04,
        halfW: 0.415,
        roofW: 0.325,
        noseTaper: 0.025,
        tailTaper: 0.025,
        bulge: 0.014,
        ground: 0.13,
        beltY: 0.39,
        roofY: 0.655,
        hoodX: 0.38,
        windTopX: 0.15,
        rearRoofX: -0.41,
        rearGlassX: -0.67,
        frontSlopeY: 0.375,
        rearDeckY: 0.38,
        wheelR: 0.144,
        wheelW: 0.095,
        frontAxle: 0.63,
        rearAxle: -0.61,
        bumperCol: [212, 220, 230],
        bumperRubber: true,
        mudflaps: true,
        antenna: true,
        grille: 'slat_black',
        headlights: 'rect_block',
        taillights: 'zhiguli_2107',
        doors: 2,
        rimStyle: 'steel_cap',
        plate: 'М 2140 ЛХ',
      };
    case 'moskvich2141':
      return {
        halfL: 1.07,
        halfW: 0.435,
        roofW: 0.335,
        noseTaper: 0.058,
        tailTaper: 0.045,
        bulge: 0.018,
        ground: 0.125,
        beltY: 0.395,
        roofY: 0.645,
        hoodX: 0.42,
        windTopX: 0.14,
        rearRoofX: -0.58,
        rearGlassX: -0.94,
        frontSlopeY: 0.335,
        rearDeckY: 0.405,
        wheelR: 0.146,
        wheelW: 0.10,
        frontAxle: 0.65,
        rearAxle: -0.60,
        bumperCol: [28, 30, 35],
        thickBumpers: true,
        sideRubStrip: true,
        spoiler: true,
        rearWiper: true,
        grille: 'curved_2110',
        headlights: 'rect_wedge',
        taillights: 'samara2',
        doors: 2,
        rimStyle: 'alloy_5',
        plate: 'А 2141 ЛК',
      };
    case 'tavria1102':
      return {
        halfL: 0.90,
        halfW: 0.40,
        roofW: 0.315,
        noseTaper: 0.044,
        tailTaper: 0.032,
        bulge: 0.014,
        ground: 0.115,
        beltY: 0.38,
        roofY: 0.64,
        hoodX: 0.35,
        windTopX: 0.11,
        rearRoofX: -0.62,
        rearGlassX: -0.84,
        frontSlopeY: 0.33,
        rearDeckY: 0.39,
        wheelR: 0.132,
        wheelW: 0.09,
        frontAxle: 0.56,
        rearAxle: -0.54,
        bumperCol: [26, 28, 34],
        thickBumpers: true,
        sideRubStrip: true,
        rearWiper: true,
        mudflaps: true,
        grille: 'tavria_slat',
        headlights: 'rect_wedge',
        taillights: 'samara',
        doors: 1,
        rimStyle: 'steel',
        plate: 'Т 1102 ЗА',
      };
    case 'slavuta1103':
      return {
        halfL: 0.96,
        halfW: 0.405,
        roofW: 0.318,
        noseTaper: 0.048,
        tailTaper: 0.036,
        bulge: 0.015,
        ground: 0.115,
        beltY: 0.385,
        roofY: 0.64,
        hoodX: 0.37,
        windTopX: 0.12,
        rearRoofX: -0.52,
        rearGlassX: -0.80,
        frontSlopeY: 0.335,
        rearDeckY: 0.395,
        wheelR: 0.135,
        wheelW: 0.092,
        frontAxle: 0.58,
        rearAxle: -0.56,
        bumperCol: 'body',
        thickBumpers: true,
        bodyMirrors: true,
        trunkSpoiler: true,
        grille: 'tavria_slat',
        headlights: 'samara2',
        taillights: 'samara2',
        doors: 2,
        rimStyle: 'alloy_5',
        plate: 'С 1103 ЛВ',
      };
    case 'gta_buffalo':
      return {
        halfL: 1.16,
        halfW: 0.475,
        roofW: 0.355,
        noseTaper: 0.055,
        tailTaper: 0.045,
        bulge: 0.028,
        ground: 0.095,
        beltY: 0.41,
        roofY: 0.64,
        hoodX: 0.46,
        windTopX: 0.12,
        rearRoofX: -0.48,
        rearGlassX: -0.82,
        frontSlopeY: 0.36,
        rearDeckY: 0.425,
        wheelR: 0.158,
        wheelW: 0.118,
        frontAxle: 0.72,
        rearAxle: -0.66,
        bumperCol: 'body',
        bodyMirrors: true,
        sideSkirt: true,
        fenderFlares: true,
        chinSpoiler: true,
        trunkSpoiler: true,
        hoodVents: true,
        sharkFin: true,
        fogLights: true,
        grille: 'muscular_black',
        headlights: 'muscular_led',
        taillights: 'strip_2112',
        doors: 2,
        rimStyle: 'alloy_5',
        plate: 'VI BUF 26',
      };
    case 'xmas_sleigh':
      return {
        isSleigh: true,
        halfL: 1.12,
        halfW: 0.44,
        ground: 0.12,
        wheelR: 0.14,
        frontAxle: 0.6,
        rearAxle: -0.6,
        bumperCol: [212, 168, 52],
        plate: 'НОВОГОД 25',
      };
    case 'vaz2112':
    default:
      return {
        halfL: 1.04,
        halfW: 0.435,
        roofW: 0.34,
        noseTaper: 0.068,
        tailTaper: 0.055,
        bulge: 0.022,
        ground: 0.11,
        beltY: 0.40,
        roofY: 0.66,
        hoodX: 0.44,
        windTopX: 0.15,
        rearRoofX: -0.60,
        rearGlassX: -0.92,
        frontSlopeY: 0.34,
        rearDeckY: 0.41,
        wheelR: 0.144,
        wheelW: 0.10,
        frontAxle: 0.65,
        rearAxle: -0.62,
        bumperCol: 'body',
        bodyMirrors: true,
        sideSkirt: true,
        spoiler: true,
        rearWiper: true,
        antenna: true,
        grille: 'curved_2110',
        headlights: 'almond',
        taillights: 'strip_2112',
        doors: 2,
        rimStyle: 'alloy_5',
        plate: 'Е 212 ВМ',
      };
  }
}

const backdropCache = new Map();

function getCachedBackdrop(W, H) {
  const key = `${W}x${H}`;
  const cached = backdropCache.get(key);
  if (cached) return cached;

  const off = document.createElement('canvas');
  off.width = W;
  off.height = H;
  const ctx = off.getContext('2d');
  if (!ctx) return null;

  // --- GARAGE SHOWCASE BACKDROP (CACHED ONCE PER SIZE) ---
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#090c12');
  bg.addColorStop(0.56, '#181e28');
  bg.addColorStop(1, '#0b0e14');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle brick wall texture
  ctx.fillStyle = 'rgba(255,255,255,0.025)';
  for (let row = 0; row < 11; row++) {
    const yy = row * 19;
    const offX = (row % 2) * 24;
    for (let x = -24; x < W; x += 48) {
      ctx.fillRect(x + offX, yy, 42, 14);
    }
  }

  // Corrugated steel garage gate
  ctx.fillStyle = '#251413';
  ctx.fillRect(W * 0.11, 14, W * 0.78, H * 0.55);
  ctx.strokeStyle = '#532925';
  ctx.lineWidth = 2;
  ctx.strokeRect(W * 0.11, 14, W * 0.78, H * 0.55);
  ctx.beginPath();
  for (let gx = W * 0.14; gx < W * 0.89; gx += 22) {
    ctx.moveTo(gx, 16);
    ctx.lineTo(gx, 14 + H * 0.55 - 2);
  }
  ctx.stroke();

  // Workshop tire & tool silhouette rack on left/right corners
  ctx.fillStyle = 'rgba(10,12,16,0.65)';
  ctx.fillRect(W * 0.02, H * 0.24, W * 0.06, H * 0.42);
  ctx.fillRect(W * 0.92, H * 0.24, W * 0.06, H * 0.42);

  // Overhead garage lamp + warm light cone
  ctx.strokeStyle = '#6b7280';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2, 0);
  ctx.lineTo(W / 2, 22);
  ctx.stroke();
  ctx.fillStyle = '#2b303a';
  ctx.beginPath();
  ctx.moveTo(W / 2 - 32, 32);
  ctx.lineTo(W / 2 + 32, 32);
  ctx.lineTo(W / 2 + 13, 20);
  ctx.lineTo(W / 2 - 13, 20);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(W / 2 - 16, 32, 32, 3.5);

  const cone = ctx.createLinearGradient(0, 32, 0, H * 0.82);
  cone.addColorStop(0, 'rgba(255, 228, 165, 0.22)');
  cone.addColorStop(1, 'rgba(255, 228, 165, 0)');
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 22, 33);
  ctx.lineTo(W / 2 + 22, 33);
  ctx.lineTo(W * 0.88, H * 0.86);
  ctx.lineTo(W * 0.12, H * 0.86);
  ctx.closePath();
  ctx.fill();

  const lampGlow = ctx.createRadialGradient(W / 2, 34, 8, W / 2, H * 0.54, W * 0.66);
  lampGlow.addColorStop(0, 'rgba(255, 226, 155, 0.22)');
  lampGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = lampGlow;
  ctx.fillRect(0, 0, W, H);

  // Polished damp garage concrete floor
  const flGrad = ctx.createLinearGradient(0, H * 0.67, 0, H);
  flGrad.addColorStop(0, '#1e232c');
  flGrad.addColorStop(0.4, '#151921');
  flGrad.addColorStop(1, '#0d1016');
  ctx.fillStyle = flGrad;
  ctx.fillRect(0, H * 0.67, W, H * 0.33);
  ctx.fillStyle = 'rgba(245, 158, 11, 0.36)';
  ctx.fillRect(W * 0.08, H * 0.69, W * 0.84, 2.5);

  backdropCache.set(key, off);
  return off;
}

function getDashStyle(carId) {
  switch (carId) {
    case 'vaz2101':
    case 'vaz2102':
    case 'vaz2106':
    case 'moskvich412':
    case 'xmas_sleigh':
      return {
        era: 'retro_wood',
        pad: [28, 25, 24],
        lower: [36, 32, 30],
        fascia: [112, 54, 26],
        fasciaGrain: [72, 32, 14],
        bezel: [222, 230, 240],
        dialGlow: [110, 224, 152],
        needle: [245, 76, 48],
        seat: [88, 52, 36],
        seatInsert: [108, 66, 46],
        screenCol: null,
        chromeWheel: true,
        spokes: 2,
      };
    case 'vaz2107':
    case 'volga3110':
      return {
        era: 'classic_wood',
        pad: [24, 26, 30],
        lower: [34, 36, 42],
        fascia: [96, 46, 22],
        fasciaGrain: [58, 26, 12],
        bezel: [204, 212, 224],
        dialGlow: [245, 198, 108],
        needle: [245, 76, 48],
        seat: [42, 44, 52],
        seatInsert: [62, 66, 78],
        screenCol: [38, 92, 66],
        chromeWheel: carId === 'vaz2107',
        spokes: 3,
      };
    case 'uaz452':
      return {
        era: 'metal_van',
        pad: [32, 36, 38],
        lower: [44, 50, 52],
        fascia: 'paint',
        fasciaGrain: [26, 30, 34],
        bezel: [208, 216, 226],
        dialGlow: [238, 210, 128],
        needle: [240, 68, 44],
        seat: [48, 52, 56],
        seatInsert: [66, 70, 74],
        screenCol: null,
        chromeWheel: false,
        spokes: 2,
      };
    case 'oka':
    case 'vaz2104':
    case 'vaz2105':
    case 'vaz2108':
    case 'vaz2109':
    case 'vaz21099':
    case 'niva2121':
    case 'moskvich2140':
    case 'moskvich2141':
    case 'tavria1102':
    case 'slavuta1103':
      return {
        era: 'soviet_slate',
        pad: [30, 34, 40],
        lower: [40, 44, 52],
        fascia: [52, 57, 66],
        fasciaGrain: [32, 36, 42],
        bezel: [130, 138, 150],
        dialGlow: [244, 166, 66],
        needle: [245, 78, 48],
        seat: [38, 42, 48],
        seatInsert: [58, 64, 74],
        screenCol: [148, 98, 38],
        chromeWheel: false,
        spokes: 2,
      };
    case 'vesta':
    case 'granta':
    case 'priora':
    case 'niva2123':
    case 'gta_buffalo':
      return {
        era: 'modern_tech',
        pad: [20, 23, 28],
        lower: [30, 34, 42],
        fascia: [88, 96, 110],
        fasciaGrain: [48, 54, 64],
        bezel: [212, 222, 236],
        dialGlow: carId === 'vesta' ? [225, 244, 255] : carId === 'granta' || carId === 'gta_buffalo' ? [246, 86, 72] : [86, 226, 158],
        needle: [248, 86, 44],
        seat: [28, 31, 38],
        seatInsert: [52, 58, 70],
        screenCol: carId === 'vesta' ? [44, 148, 228] : carId === 'granta' || carId === 'gta_buffalo' ? [210, 52, 52] : [42, 138, 128],
        chromeWheel: false,
        spokes: 3,
      };
    default:
      // vaz2110, vaz2111, vaz2112, vaz2114, vaz2115, kalina, largus
      return {
        era: 'modern_vdo',
        pad: [24, 27, 33],
        lower: [34, 38, 46],
        fascia: [58, 64, 76],
        fasciaGrain: [38, 42, 50],
        bezel: [176, 186, 200],
        dialGlow: carId === 'kalina' ? [246, 152, 58] : [92, 218, 142],
        needle: [245, 78, 46],
        seat: [32, 35, 42],
        seatInsert: [56, 62, 74],
        screenCol: [42, 128, 108],
        chromeWheel: false,
        spokes: 3,
      };
  }
}

const carMeshCache = new Map();
const LIGHT_DIR = norm3([0.34, 0.85, -0.40]);
const drawQueue = [];

function fastPowSpec(d, gloss) {
  if (d <= 0) return 0;
  const d2 = d * d;
  const d4 = d2 * d2;
  const d8 = d4 * d4;
  const d16 = d8 * d8;
  if (gloss === 'glass') return d16 * d16 * d2 * 96;
  if (gloss === 'chrome') return d16 * d8 * d2 * 78;
  return d16 * d2 * 54;
}

function buildCarMesh(carId, paintRgb, headlights) {
  const bp = getBlueprint(carId);
  const bumperRgb = bp.bumperCol === 'body' ? paintRgb : bp.bumperCol;
  const staticPolys = [];
  const glassPanes = [];

  function pushPoly(pts, rgb, opts = {}) {
    if (!pts || pts.length < 3) return;
    const len = pts.length;
    let avgX = 0,
      avgY = 0,
      avgZ = 0;
    for (let i = 0; i < len; i++) {
      avgX += pts[i][0];
      avgY += pts[i][1];
      avgZ += pts[i][2];
    }
    avgX /= len;
    avgY /= len;
    avgZ /= len;

    let nx, ny, nz;
    if (opts.normal) {
      const nl = Math.hypot(opts.normal[0], opts.normal[1], opts.normal[2]) || 1;
      nx = opts.normal[0] / nl;
      ny = opts.normal[1] / nl;
      nz = opts.normal[2] / nl;
    } else {
      const ux = pts[1][0] - pts[0][0],
        uy = pts[1][1] - pts[0][1],
        uz = pts[1][2] - pts[0][2];
      const vx = pts[2][0] - pts[0][0],
        vy = pts[2][1] - pts[0][1],
        vz = pts[2][2] - pts[0][2];
      let cx = uy * vz - uz * vy;
      let cy = uz * vx - ux * vz;
      let cz = ux * vy - uy * vx;
      const cl = Math.hypot(cx, cy, cz) || 1;
      nx = cx / cl;
      ny = cy / cl;
      nz = cz / cl;
      if (opts.center) {
        const ox = avgX - opts.center[0];
        const oy = avgY - opts.center[1];
        const oz = avgZ - opts.center[2];
        if (nx * ox + ny * oy + nz * oz < 0) {
          nx = -nx;
          ny = -ny;
          nz = -nz;
        }
      }
    }

    let shade = 1;
    if (!opts.unlit) {
      const ndl = Math.max(0, nx * LIGHT_DIR[0] + ny * LIGHT_DIR[1] + nz * LIGHT_DIR[2]);
      const hemi = 0.42 + 0.16 * ny + Math.max(0, -ny) * 0.08;
      shade = hemi + ndl * 0.62;
    }

    const alpha = opts.alpha ?? 1;
    const constFill = opts.noFill ? null : !opts.gloss || opts.unlit ? rgbStr(rgb, shade, 0, alpha) : null;
    const stroke = opts.stroke ? opts.stroke : opts.edge ? rgbStr(rgb, shade * 0.72, 0, 0.42) : null;

    staticPolys.push({
      pts,
      avgX,
      avgY,
      avgZ,
      nx,
      ny,
      nz,
      rgb,
      shade,
      alpha,
      layer: opts.layer || 0,
      gloss: opts.unlit ? null : opts.gloss || null,
      doubleSided: !!opts.doubleSided,
      constFill,
      stroke,
      lineW: opts.lineW || 0.65,
      zoomLineW: !!opts.zoomLineW,
      openPath: !!opts.openPath,
    });
  }

  function addBox(x0, x1, y0, y1, z0, z1, rgb, opts = {}) {
    const c = [(x0 + x1) * 0.5, (y0 + y1) * 0.5, (z0 + z1) * 0.5];
    const dzTop = opts.topInsetZ || 0;
    const z0t = z0 + dzTop;
    const z1t = z1 - dzTop;
    const o = { ...opts, center: c };
    pushPoly([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1t], [x1, y1, z0t]], rgb, o);
    pushPoly([[x0, y0, z1], [x0, y0, z0], [x0, y1, z0t], [x0, y1, z1t]], rgb, o);
    pushPoly([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0t], [x0, y1, z0t]], rgb, o);
    pushPoly([[x1, y0, z1], [x0, y0, z1], [x0, y1, z1t], [x1, y1, z1t]], rgb, o);
    pushPoly([[x0, y1, z0t], [x1, y1, z0t], [x1, y1, z1t], [x0, y1, z1t]], rgb, o);
    if (opts.withBottom) {
      pushPoly([[x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x0, y0, z0]], rgb, o);
    }
  }

  function lerp3(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }

  function quadPt(pBL, pBR, pTR, pTL, u, v) {
    const bot = lerp3(pBL, pBR, u);
    const top = lerp3(pTL, pTR, u);
    return lerp3(bot, top, v);
  }

  // Automotive glass pane with ceramic frit gasket, sun-shade band, rear defroster wires,
  // and descriptor for dynamic camera-reactive specular reflections.
  function addGlassPanel(pBL, pBR, pTR, pTL, normal, opts = {}) {
    const baseLayer = opts.layer ?? -0.015;
    const glassCol = opts.color || [18, 33, 46];
    const alpha = opts.alpha ?? 0.52;

    pushPoly([pBL, pBR, pTR, pTL], glassCol, {
      normal,
      gloss: 'glass',
      alpha,
      layer: baseLayer,
      stroke: opts.withSeal === false ? null : 'rgba(10, 14, 19, 0.88)',
      lineW: opts.sealW || 1.65,
    });

    if (opts.sunBand) {
      pushPoly(
        [quadPt(pBL, pBR, pTR, pTL, 0.01, 0.82), quadPt(pBL, pBR, pTR, pTL, 0.99, 0.82), pTR, pTL],
        [10, 22, 36],
        { normal, unlit: true, alpha: 0.34, layer: baseLayer - 0.0008 }
      );
    }

    if (opts.defroster) {
      for (const rv of [0.26, 0.42, 0.58, 0.74]) {
        pushPoly(
          [
            quadPt(pBL, pBR, pTR, pTL, 0.08, rv),
            quadPt(pBL, pBR, pTR, pTL, 0.92, rv),
            quadPt(pBL, pBR, pTR, pTL, 0.92, rv + 0.014),
            quadPt(pBL, pBR, pTR, pTL, 0.08, rv + 0.014),
          ],
          [176, 102, 58],
          { normal, unlit: true, alpha: 0.44, layer: baseLayer - 0.0009 }
        );
      }
    }

    // Soft upper sky/ceiling sheen (static part of glass)
    pushPoly(
      [
        quadPt(pBL, pBR, pTR, pTL, 0.03, 0.46),
        quadPt(pBL, pBR, pTR, pTL, 0.97, 0.56),
        quadPt(pBL, pBR, pTR, pTL, 0.97, 0.96),
        quadPt(pBL, pBR, pTR, pTL, 0.03, 0.96),
      ],
      [168, 206, 238],
      { normal, unlit: true, alpha: 0.13, layer: baseLayer - 0.0012 }
    );

    const nl = Math.hypot(normal[0], normal[1], normal[2]) || 1;
    glassPanes.push({
      pBL,
      pBR,
      pTR,
      pTL,
      cx: (pBL[0] + pBR[0] + pTR[0] + pTL[0]) * 0.25,
      cy: (pBL[1] + pBR[1] + pTR[1] + pTL[1]) * 0.25,
      cz: (pBL[2] + pBR[2] + pTR[2] + pTL[2]) * 0.25,
      nx: normal[0] / nl,
      ny: normal[1] / nl,
      nz: normal[2] / nl,
      phase: opts.phase || 0,
      baseLayer,
    });
  }

  // Era-accurate textured dashboard, glowing speedometer/tachometer gauges,
  // center console, contoured steering wheel, seats & rearview mirror.
  function addInteriorCabin() {
    const ds = getDashStyle(carId);
    const fasciaCol = ds.fascia === 'paint' ? paintRgb.map((c) => Math.max(0, c - 14)) : ds.fascia;
    const cabW = (bp.roofW || 0.33) - 0.028;
    const drvZ = 0.142;

    const dashFrontX = bp.isVan ? bp.halfL - 0.055 : bp.hoodX - 0.025;
    const dashBackX = bp.isVan ? bp.halfL - 0.215 : bp.hoodX - 0.225;
    const dashY0 = bp.beltY - 0.12;
    const dashY1 = bp.isVan ? bp.beltY + 0.065 : bp.beltY + 0.015;
    const hoodTopY = dashY1 + 0.052;
    const hoodX = dashBackX - 0.02;

    // Dark interior floor tub & inner door cards so cabin has authentic depth behind glass
    const floorX0 = bp.isVan ? -bp.halfL + 0.12 : bp.rearGlassX + 0.08;
    addBox(floorX0, dashFrontX, bp.ground + 0.05, dashY0 + 0.02, -cabW - 0.02, cabW + 0.02, [14, 16, 20], {
      layer: 0.024,
    });
    for (const sd of [-1, 1]) {
      pushPoly(
        [
          [floorX0, dashY0, sd * (cabW + 0.015)],
          [dashFrontX, dashY0, sd * (cabW + 0.015)],
          [dashFrontX, dashY1 - 0.02, sd * (cabW + 0.015)],
          [floorX0, dashY1 - 0.02, sd * (cabW + 0.015)],
        ],
        [24, 27, 34],
        { normal: [0, 0, -sd], layer: 0.02 }
      );
    }

    // 1. Main lower & upper dashboard ("Torpedo") + textured top defroster vents
    addBox(dashBackX, dashFrontX, dashY0, dashY1, -cabW, cabW, ds.lower, {
      edge: true,
      layer: 0.014,
    });
    // Sloped anti-glare soft-touch top pad (clearly visible through front windshield)
    pushPoly(
      [
        [dashFrontX, dashY1 - 0.008, -cabW],
        [dashFrontX, dashY1 - 0.008, cabW],
        [dashBackX, dashY1 + 0.014, cabW - 0.01],
        [dashBackX, dashY1 + 0.014, -cabW + 0.01],
      ],
      ds.pad,
      { normal: [-0.14, 0.99, 0], edge: true, layer: 0.011 }
    );
    // Windshield defroster vent grille slots along top dashboard edge
    for (const vz of [-0.17, 0.15]) {
      pushPoly(
        [
          [dashFrontX - 0.03, dashY1 - 0.001, vz - 0.09],
          [dashFrontX - 0.03, dashY1 - 0.001, vz + 0.09],
          [dashFrontX - 0.068, dashY1 + 0.005, vz + 0.09],
          [dashFrontX - 0.068, dashY1 + 0.005, vz - 0.09],
        ],
        [14, 16, 20],
        { normal: [0, 1, 0], layer: 0.009 }
      );
    }

    // 2. Sculpted instrument binnacle hood ("kozyrek") over driver gauges
    addBox(hoodX, dashFrontX - 0.05, dashY1, hoodTopY, drvZ - 0.115, drvZ + 0.115, ds.pad, {
      topInsetZ: 0.018,
      edge: true,
      layer: 0.01,
    });

    // 3. Textured dashboard fascia trim (woodgrain ribs / brushed aluminum / Soviet slate)
    const faceX = dashBackX - 0.003;
    const fYBot = dashY0 + 0.065;
    const fYTop = dashY1 - 0.005;
    pushPoly(
      [
        [faceX, fYBot, -cabW + 0.025],
        [faceX, fYBot, -0.02],
        [faceX, fYTop, -0.02],
        [faceX, fYTop, -cabW + 0.025],
      ],
      fasciaCol,
      { normal: [-1, 0, 0], layer: 0.009, gloss: ds.era.includes('wood') || ds.era === 'modern_tech' ? 'paint' : undefined }
    );
    // Fine horizontal texture grain / trim lines across fascia & glovebox seam
    for (let gIdx = 0; gIdx < 3; gIdx++) {
      const gy = fYBot + 0.012 + gIdx * 0.018;
      if (gy < fYTop - 0.006) {
        pushPoly(
          [
            [faceX - 0.002, gy, -cabW + 0.035],
            [faceX - 0.002, gy, -0.028],
            [faceX - 0.002, gy + 0.005, -0.028],
            [faceX - 0.002, gy + 0.005, -cabW + 0.035],
          ],
          ds.fasciaGrain,
          { normal: [-1, 0, 0], layer: 0.008 }
        );
      }
    }
    // Passenger glovebox lid & latch handle
    pushPoly(
      [
        [faceX - 0.001, dashY0 + 0.012, -cabW + 0.035],
        [faceX - 0.001, dashY0 + 0.012, -0.04],
        [faceX - 0.001, fYBot - 0.006, -0.04],
        [faceX - 0.001, fYBot - 0.006, -cabW + 0.035],
      ],
      ds.lower.map((c) => Math.max(0, c - 8)),
      { normal: [-1, 0, 0], edge: true, layer: 0.009 }
    );
    pushPoly(
      [
        [faceX - 0.004, fYBot - 0.022, -cabW + 0.06],
        [faceX - 0.004, fYBot - 0.022, -cabW + 0.115],
        [faceX - 0.004, fYBot - 0.011, -cabW + 0.115],
        [faceX - 0.004, fYBot - 0.011, -cabW + 0.06],
      ],
      ds.bezel,
      { normal: [-1, 0, 0], layer: 0.007, gloss: 'chrome' }
    );

    // 4. Illuminated Instrument Cluster (Speedometer + Tachometer + Needles + Warning LEDs)
    const clustX = hoodX + 0.01;
    pushPoly(
      [
        [clustX, dashY1 - 0.012, drvZ - 0.095],
        [clustX, dashY1 - 0.012, drvZ + 0.095],
        [clustX, hoodTopY - 0.01, drvZ + 0.088],
        [clustX, hoodTopY - 0.01, drvZ - 0.088],
      ],
      [10, 12, 16],
      { normal: [-1, 0, 0], layer: 0.008 }
    );
    const dialY = dashY1 + 0.018;
    for (const [dOff, dAng] of [
      [-0.044, 0.85],
      [0.044, 2.25],
    ]) {
      const dz = drvZ + dOff;
      const bezelPts = [];
      const dialPts = [];
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        bezelPts.push([clustX - 0.002, dialY + Math.sin(a) * 0.025, dz + Math.cos(a) * 0.025]);
        dialPts.push([clustX - 0.004, dialY + Math.sin(a) * 0.02, dz + Math.cos(a) * 0.02]);
      }
      pushPoly(bezelPts, ds.bezel, { normal: [-1, 0, 0], layer: 0.006, gloss: 'chrome' });
      pushPoly(dialPts, [12, 18, 22], { normal: [-1, 0, 0], layer: 0.005 });
      // Illuminated gauge scale arc + glowing needle
      const arcPts = [];
      for (let i = 0; i <= 7; i++) {
        const a = -0.5 + (i / 7) * 4.1;
        arcPts.push([clustX - 0.005, dialY + Math.sin(a) * 0.016, dz - Math.cos(a) * 0.016]);
      }
      pushPoly(arcPts, ds.dialGlow, {
        normal: [-1, 0, 0],
        unlit: true,
        noFill: true,
        openPath: true,
        stroke: rgbStr(ds.dialGlow, 1, 0, 0.92),
        lineW: 1.5,
        layer: 0.004,
      });
      pushPoly(
        [
          [clustX - 0.006, dialY - 0.002, dz - 0.002],
          [clustX - 0.006, dialY + 0.002, dz + 0.002],
          [clustX - 0.006, dialY + Math.sin(dAng) * 0.017, dz + Math.cos(dAng) * 0.017],
        ],
        ds.needle,
        { normal: [-1, 0, 0], unlit: true, layer: 0.003 }
      );
    }
    // Central odometer / trip screen & hazard indicator
    pushPoly(
      [
        [clustX - 0.004, dialY - 0.011, drvZ - 0.014],
        [clustX - 0.004, dialY - 0.011, drvZ + 0.014],
        [clustX - 0.004, dialY + 0.011, drvZ + 0.014],
        [clustX - 0.004, dialY + 0.011, drvZ - 0.014],
      ],
      ds.dialGlow,
      { normal: [-1, 0, 0], unlit: true, alpha: 0.72, layer: 0.004 }
    );

    // 5. Center Console Stack: Slatted Air Vents, Illuminated Multimedia / Radio & Gear Shifter
    for (const vz of [-0.032, 0.018]) {
      pushPoly(
        [
          [faceX - 0.002, fYTop - 0.03, vz - 0.02],
          [faceX - 0.002, fYTop - 0.03, vz + 0.02],
          [faceX - 0.002, fYTop - 0.006, vz + 0.02],
          [faceX - 0.002, fYTop - 0.006, vz - 0.02],
        ],
        [14, 16, 20],
        { normal: [-1, 0, 0], layer: 0.008 }
      );
    }
    // Illuminated radio / Vesta multimedia screen
    pushPoly(
      [
        [faceX - 0.002, dashY0 + 0.048, -0.048],
        [faceX - 0.002, dashY0 + 0.048, 0.034],
        [faceX - 0.002, fYBot + 0.016, 0.034],
        [faceX - 0.002, fYBot + 0.016, -0.048],
      ],
      ds.screenCol || [18, 22, 26],
      { normal: [-1, 0, 0], unlit: !!ds.screenCol, alpha: ds.screenCol ? 0.88 : 1, layer: 0.007 }
    );
    // Rotary climate control dials
    for (const kz of [-0.034, -0.007, 0.02]) {
      pushPoly(
        [
          [faceX - 0.004, dashY0 + 0.022, kz - 0.008],
          [faceX - 0.004, dashY0 + 0.022, kz + 0.008],
          [faceX - 0.004, dashY0 + 0.038, kz + 0.008],
          [faceX - 0.004, dashY0 + 0.038, kz - 0.008],
        ],
        ds.bezel,
        { normal: [-1, 0, 0], layer: 0.006, gloss: 'chrome' }
      );
    }
    // Center tunnel & gearshift lever + knob
    const shX = dashBackX - 0.14;
    addBox(shX - 0.15, dashBackX, bp.ground + 0.055, dashY0 - 0.01, -0.058, 0.058, [22, 24, 29], {
      layer: 0.016,
    });
    addBox(shX - 0.012, shX + 0.012, dashY0 - 0.01, dashY0 + 0.075, -0.01, 0.01, [16, 18, 22], {
      layer: 0.014,
    });
    addBox(shX - 0.018, shX + 0.018, dashY0 + 0.07, dashY0 + 0.098, -0.018, 0.018, ds.era.includes('wood') ? ds.fascia : [36, 40, 46], {
      layer: 0.013,
      gloss: 'paint',
    });

    // 6. Contoured Round Steering Wheel + Column + Spokes + Center Horn Badge
    const swX = dashBackX - 0.078;
    const swY = dashY1 + 0.018;
    const swR = 0.078;
    addBox(swX + 0.008, dashBackX + 0.02, swY - 0.018, swY + 0.018, drvZ - 0.02, drvZ + 0.02, [22, 24, 28], {
      layer: 0.012,
    });
    const rimPts = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      rimPts.push([swX - Math.sin(a) * 0.016, swY + Math.sin(a) * swR, drvZ + Math.cos(a) * swR]);
    }
    pushPoly(rimPts, [20, 22, 28], {
      normal: [-0.94, 0.34, 0],
      doubleSided: true,
      noFill: true,
      stroke: 'rgb(26, 29, 36)',
      lineW: 4.0,
      zoomLineW: true,
      layer: 0.008,
    });
    if (ds.chromeWheel) {
      const hornPts = [];
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        hornPts.push([swX - 0.003 - Math.sin(a) * 0.011, swY + Math.sin(a) * 0.052, drvZ + Math.cos(a) * 0.052]);
      }
      pushPoly(hornPts, [220, 228, 238], {
        normal: [-0.94, 0.34, 0],
        doubleSided: true,
        noFill: true,
        stroke: 'rgba(224, 232, 242, 0.9)',
        lineW: 1.8,
        zoomLineW: true,
        layer: 0.007,
      });
    }
    // Steering spokes + center airbag/horn pad
    const spokeAngles = ds.spokes === 2 ? [0, Math.PI] : [0, Math.PI, -Math.PI * 0.5];
    for (const sa of spokeAngles) {
      const spY = swY + Math.sin(sa) * swR * 0.85;
      const spZ = drvZ + Math.cos(sa) * swR * 0.85;
      pushPoly(
        [
          [swX - 0.003, swY - 0.008, drvZ - 0.008],
          [swX - 0.003, swY + 0.008, drvZ + 0.008],
          [swX - Math.sin(sa) * 0.014, spY + 0.006, spZ + 0.006],
          [swX - Math.sin(sa) * 0.014, spY - 0.006, spZ - 0.006],
        ],
        [46, 52, 62],
        { normal: [-0.94, 0.34, 0], doubleSided: true, layer: 0.007 }
      );
    }
    addBox(swX - 0.012, swX + 0.008, swY - 0.022, swY + 0.022, drvZ - 0.024, drvZ + 0.024, [32, 36, 44], {
      layer: 0.006,
    });

    // 7. Bolstered Front Bucket Seats + Cloth Center Stripes + Headrests + Rear Bench Seat
    const seatBaseX = bp.isVan ? dashBackX - 0.28 : bp.windTopX - 0.22;
    for (const sz of [-0.145, 0.145]) {
      // Seat cushion
      addBox(seatBaseX, seatBaseX + 0.22, bp.ground + 0.07, dashY0 + 0.02, sz - 0.095, sz + 0.095, ds.seat, {
        layer: 0.018,
      });
      // Seat backrest
      addBox(seatBaseX - 0.04, seatBaseX + 0.04, dashY0, bp.roofY - 0.125, sz - 0.09, sz + 0.09, ds.seat, {
        edge: true,
        layer: 0.017,
      });
      // Ribbed fabric center insert
      addBox(seatBaseX + 0.036, seatBaseX + 0.048, dashY0 + 0.03, bp.roofY - 0.145, sz - 0.048, sz + 0.048, ds.seatInsert, {
        layer: 0.015,
      });
      // Headrest
      addBox(seatBaseX - 0.032, seatBaseX + 0.028, bp.roofY - 0.118, bp.roofY - 0.052, sz - 0.048, sz + 0.048, ds.seatInsert, {
        edge: true,
        layer: 0.016,
      });
    }
    // Rear bench seat (visible through rear and quarter windows)
    if (!bp.isVan && bp.rearRoofX < bp.windTopX - 0.34) {
      const rbX = Math.max(bp.rearGlassX + 0.14, bp.rearRoofX - 0.02);
      addBox(rbX - 0.05, rbX + 0.03, bp.beltY - 0.11, bp.roofY - 0.135, -cabW + 0.03, cabW - 0.03, ds.seat, {
        edge: true,
        layer: 0.019,
      });
      for (const hz of [-0.14, 0.14]) {
        addBox(rbX - 0.045, rbX + 0.015, bp.roofY - 0.13, bp.roofY - 0.07, hz - 0.042, hz + 0.042, ds.seatInsert, {
          layer: 0.018,
        });
      }
    }

    // 8. Windshield-Mounted Interior Rearview Mirror
    const mirX = bp.isVan ? bp.halfL - 0.11 : bp.windTopX + 0.025;
    addBox(mirX - 0.012, mirX + 0.012, bp.roofY - 0.072, bp.roofY - 0.04, -0.052, 0.052, [22, 24, 28], {
      layer: 0.008,
    });
  }

  // --- TURNTABLE PLATFORM, FLOOR PAINT REFLECTION, SOFT CONTACT SHADOWS & HEADLIGHT BEAMS ---
  const ttPts = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    ttPts.push([Math.cos(a) * (bp.halfL + 0.34), 0.002, Math.sin(a) * (bp.halfL + 0.34) * 0.64]);
  }
  pushPoly(ttPts, [30, 35, 44], {
    normal: [0, 1, 0],
    doubleSided: true,
    unlit: true,
    alpha: 0.48,
    stroke: 'rgba(245,158,11,0.34)',
    lineW: 1.5,
    layer: 0.56,
  });

  // Subtle colored paint reflection on damp garage floor
  const reflPts = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    reflPts.push([Math.cos(a) * (bp.halfL + 0.14), 0.003, Math.sin(a) * (bp.halfW + 0.18)]);
  }
  pushPoly(reflPts, paintRgb, { normal: [0, 1, 0], doubleSided: true, unlit: true, alpha: 0.08, layer: 0.52 });

  // Soft 3-tier contact + penumbra floor shadow
  const shOuter = [];
  const shMid = [];
  const shInner = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    shOuter.push([Math.cos(a) * (bp.halfL + 0.22), 0.004, Math.sin(a) * (bp.halfW + 0.18)]);
    shMid.push([Math.cos(a) * (bp.halfL + 0.10), 0.005, Math.sin(a) * (bp.halfW + 0.08)]);
    shInner.push([Math.cos(a) * (bp.halfL + 0.01), 0.006, Math.sin(a) * (bp.halfW + 0.01)]);
  }
  pushPoly(shOuter, [4, 6, 9], { normal: [0, 1, 0], doubleSided: true, unlit: true, alpha: 0.24, layer: 0.49 });
  pushPoly(shMid, [3, 5, 8], { normal: [0, 1, 0], doubleSided: true, unlit: true, alpha: 0.42, layer: 0.46 });
  pushPoly(shInner, [2, 3, 5], { normal: [0, 1, 0], doubleSided: true, unlit: true, alpha: 0.76, layer: 0.43 });

  if (headlights) {
    for (const sZ of [-bp.halfW * 0.62, bp.halfW * 0.62]) {
      pushPoly(
        [
          [bp.halfL + 0.02, 0.014, sZ - 0.06],
          [bp.halfL + 1.38, 0.014, sZ - 0.34],
          [bp.halfL + 1.38, 0.014, sZ + 0.34],
          [bp.halfL + 0.02, 0.014, sZ + 0.06],
        ],
        [255, 240, 165],
        { normal: [0, 1, 0], doubleSided: true, unlit: true, alpha: 0.15, layer: 0.41 }
      );
      pushPoly(
        [
          [bp.halfL + 0.02, 0.016, sZ - 0.035],
          [bp.halfL + 0.72, 0.016, sZ - 0.16],
          [bp.halfL + 0.72, 0.016, sZ + 0.16],
          [bp.halfL + 0.02, 0.016, sZ + 0.035],
        ],
        [255, 250, 215],
        { normal: [0, 1, 0], doubleSided: true, unlit: true, alpha: 0.22, layer: 0.40 }
      );
    }
  }

  // --- CHRISTMAS SLEIGH CUSTOM 3D GEOMETRY ---
  if (bp.isSleigh) {
    const gold = [226, 178, 54];
    const crimson = paintRgb;
    const crimsonDark = crimson.map((c) => Math.max(0, c - 36));
    const furWhite = [242, 246, 252];
    const velvet = [138, 18, 28];

    // Ornate curved steel/gold sleigh runners on left & right + front curled scroll tips
    for (const sd of [-1, 1]) {
      const rz = sd * (bp.halfW - 0.055);
      addBox(-bp.halfL + 0.05, bp.halfL - 0.04, 0.004, 0.036, rz - 0.022, rz + 0.022, gold, { gloss: 'chrome' });
      addBox(bp.halfL - 0.06, bp.halfL + 0.18, 0.03, 0.22, rz - 0.02, rz + 0.02, gold, { topInsetZ: 0.004, gloss: 'chrome' });
      addBox(bp.halfL + 0.06, bp.halfL + 0.21, 0.18, 0.27, rz - 0.022, rz + 0.022, gold, { gloss: 'chrome' });
      // Vertical struts supporting body over runners
      for (const sx of [-0.66, 0.0, 0.62]) {
        addBox(sx - 0.028, sx + 0.028, 0.032, 0.175, rz - 0.018, rz + 0.018, gold, { gloss: 'chrome' });
      }
    }
    // Crossbars between runners
    for (const sx of [-0.66, 0.0, 0.62]) {
      addBox(sx - 0.022, sx + 0.022, 0.06, 0.088, -bp.halfW + 0.05, bp.halfW - 0.05, gold, { gloss: 'chrome' });
    }
    // Main crimson sleigh tub, high curved backrest, sloped front dashboard & plush fur rim
    addBox(-bp.halfL + 0.08, bp.halfL - 0.06, 0.16, 0.42, -bp.halfW + 0.03, bp.halfW - 0.03, crimson, { edge: true, gloss: 'paint' });
    addBox(-bp.halfL + 0.05, -bp.halfL + 0.34, 0.38, 0.68, -bp.halfW + 0.02, bp.halfW - 0.02, crimsonDark, { edge: true, gloss: 'paint' });
    addBox(bp.halfL - 0.26, bp.halfL - 0.01, 0.28, 0.56, -bp.halfW + 0.03, bp.halfW - 0.03, crimson, { topInsetZ: 0.025, gloss: 'paint' });
    // White fur + gold trim molding along sleigh rim
    addBox(-bp.halfL + 0.06, bp.halfL - 0.02, 0.415, 0.455, -bp.halfW + 0.02, bp.halfW - 0.02, gold, { gloss: 'chrome' });
    addBox(-bp.halfL + 0.04, -bp.halfL + 0.35, 0.67, 0.725, -bp.halfW + 0.01, bp.halfW - 0.01, furWhite, { edge: true });
    // Tufted bench seat
    addBox(-0.22, 0.28, 0.41, 0.50, -bp.halfW + 0.08, bp.halfW - 0.08, velvet, { edge: true });
    addBox(-0.26, -0.16, 0.48, 0.64, -bp.halfW + 0.08, bp.halfW - 0.08, velvet, { edge: true });
    // Festive wrapped gift boxes in rear cargo bay
    addBox(-0.84, -0.44, 0.42, 0.63, -0.26, -0.02, [22, 138, 64], { edge: true });
    addBox(-0.84, -0.44, 0.42, 0.64, -0.16, -0.12, gold, { layer: -0.005 });
    addBox(-0.78, -0.46, 0.42, 0.59, 0.04, 0.28, [34, 98, 206], { edge: true });
    addBox(-0.78, -0.46, 0.42, 0.60, 0.14, 0.18, [238, 52, 62], { layer: -0.005 });
    // Glowing brass front sleigh lanterns
    const lCol = headlights ? [255, 240, 148] : [182, 192, 202];
    for (const sd of [-1, 1]) {
      const lz = sd * (bp.halfW - 0.05);
      addBox(bp.halfL - 0.04, bp.halfL + 0.05, 0.48, 0.61, lz - 0.045, lz + 0.045, gold, { gloss: 'chrome' });
      addBox(bp.halfL - 0.02, bp.halfL + 0.06, 0.50, 0.59, lz - 0.032, lz + 0.032, lCol, { unlit: headlights, layer: -0.01 });
    }
    // Festive gold star emblem on nose
    addBox(bp.halfL - 0.01, bp.halfL + 0.012, 0.34, 0.42, -0.04, 0.04, gold, { unlit: true, gloss: 'chrome', layer: -0.015 });
    return { staticPolys, glassPanes, bp };
  }

  // --- WHEEL WELL DARK LINERS & UNDERBODY CHASSIS ---
  const archR = bp.wheelR + 0.032;
  const archTop = bp.isVan
    ? bp.wheelR * 2 + 0.035
    : Math.min(bp.wheelR * 2 + 0.035, bp.frontSlopeY - 0.01, bp.rearDeckY - 0.01);
  addBox(-bp.halfL + 0.13, bp.halfL - 0.13, bp.ground + 0.008, archTop, -bp.halfW + 0.105, bp.halfW - 0.105, [10, 12, 16], {
    unlit: true,
    layer: 0.05,
  });

  // --- HIGH-DETAIL 18-SEGMENT 3D WHEELS WITH BRAKE ROTORS & CALIPERS ---
  function addWheel(wx, wz, isFront) {
    const r = bp.wheelR;
    const wy = r;
    const w = bp.wheelW;
    const innerZ = wz < 0 ? wz + w : wz - w;
    const outerZ = wz;
    const dir = wz < 0 ? -1 : 1;
    const segs = 18;

    const tireRimR = r * 0.62;
    const bevR = r * 0.90;
    const outerTirePts = [];
    const innerTirePts = [];
    const rimDishPts = [];
    const rimPts = [];

    for (let i = 0; i < segs; i++) {
      const a0 = (i / segs) * Math.PI * 2;
      const a1 = ((i + 1) / segs) * Math.PI * 2;
      const p0 = [wx + Math.cos(a0) * r, wy + Math.sin(a0) * r];
      const p1 = [wx + Math.cos(a1) * r, wy + Math.sin(a1) * r];
      const b0 = [wx + Math.cos(a0) * bevR, wy + Math.sin(a0) * bevR];
      const b1 = [wx + Math.cos(a1) * bevR, wy + Math.sin(a1) * bevR];
      outerTirePts.push([b0[0], b0[1], outerZ]);
      innerTirePts.push([p0[0], p0[1], innerZ]);
      rimDishPts.push([wx + Math.cos(a0) * tireRimR * 1.04, wy + Math.sin(a0) * tireRimR * 1.04, outerZ + dir * 0.002]);
      rimPts.push([wx + Math.cos(a0) * tireRimR * 0.96, wy + Math.sin(a0) * tireRimR * 0.96, outerZ + dir * 0.005]);

      // Tire tread block
      pushPoly(
        [
          [p0[0], p0[1], innerZ],
          [p1[0], p1[1], innerZ],
          [p1[0], p1[1], outerZ - dir * 0.012],
          [p0[0], p0[1], outerZ - dir * 0.012],
        ],
        bp.rimStyle === 'offroad' && i % 2 === 0 ? [22, 25, 30] : [16, 18, 22],
        { center: [wx, wy, (innerZ + outerZ) * 0.5] }
      );
      // Tire shoulder bevel
      pushPoly(
        [
          [p0[0], p0[1], outerZ - dir * 0.012],
          [p1[0], p1[1], outerZ - dir * 0.012],
          [b1[0], b1[1], outerZ],
          [b0[0], b0[1], outerZ],
        ],
        [24, 27, 32],
        { center: [wx, wy, outerZ - dir * 0.02] }
      );
    }

    pushPoly(outerTirePts, [28, 31, 36], { normal: [0, 0, dir], edge: true });
    pushPoly(innerTirePts, [14, 16, 20], { normal: [0, 0, -dir] });
    pushPoly(rimDishPts, [52, 58, 66], { normal: [0, 0, dir], layer: -0.004 });

    const rimCol =
      bp.rimStyle === 'chrome_dish'
        ? [218, 226, 236]
        : bp.rimStyle === 'alloy_modern'
        ? [196, 204, 214]
        : bp.rimStyle === 'alloy_5'
        ? [188, 197, 208]
        : bp.rimStyle === 'offroad'
        ? [136, 144, 152]
        : [152, 160, 170];
    pushPoly(rimPts, rimCol, { normal: [0, 0, dir], layer: -0.006, gloss: 'chrome' });

    if (bp.rimStyle === 'alloy_5' || bp.rimStyle === 'alloy_modern') {
      // Dark vented brake rotor + red/silver caliper behind spokes
      const discPts = [];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        discPts.push([wx + Math.cos(a) * tireRimR * 0.85, wy + Math.sin(a) * tireRimR * 0.85, outerZ + dir * 0.006]);
      }
      pushPoly(discPts, [38, 42, 48], { normal: [0, 0, dir], layer: -0.008 });

      // Brake caliper
      const calX = isFront ? wx - tireRimR * 0.48 : wx + tireRimR * 0.44;
      pushPoly(
        [
          [calX - 0.016, wy - 0.018, outerZ + dir * 0.0075],
          [calX + 0.016, wy - 0.018, outerZ + dir * 0.0075],
          [calX + 0.014, wy + 0.018, outerZ + dir * 0.0075],
          [calX - 0.014, wy + 0.018, outerZ + dir * 0.0075],
        ],
        bp.rimStyle === 'alloy_modern' ? [200, 32, 36] : [115, 122, 132],
        { normal: [0, 0, dir], layer: -0.0095 }
      );

      const spokeCount = bp.rimStyle === 'alloy_modern' ? 10 : 5;
      const spokeThick = bp.rimStyle === 'alloy_modern' ? 0.0075 : 0.013;
      const spokeCol = bp.rimStyle === 'alloy_modern' ? [226, 232, 240] : [208, 216, 226];
      for (let k = 0; k < spokeCount; k++) {
        const ang = (k / spokeCount) * Math.PI * 2 + 0.25;
        const cA = Math.cos(ang),
          sA = Math.sin(ang);
        const pX = -sA * spokeThick,
          pY = cA * spokeThick;
        pushPoly(
          [
            [wx - pX, wy - pY, outerZ + dir * 0.009],
            [wx + pX, wy + pY, outerZ + dir * 0.009],
            [wx + cA * tireRimR * 0.9 + pX * 0.8, wy + sA * tireRimR * 0.9 + pY * 0.8, outerZ + dir * 0.009],
            [wx + cA * tireRimR * 0.9 - pX * 0.8, wy + sA * tireRimR * 0.9 - pY * 0.8, outerZ + dir * 0.009],
          ],
          spokeCol,
          { normal: [0, 0, dir], layer: -0.011, gloss: 'chrome' }
        );
      }
    } else if (bp.rimStyle === 'chrome_cap' || bp.rimStyle === 'chrome_dish' || bp.rimStyle === 'steel_cap') {
      if (bp.rimStyle === 'chrome_dish') {
        // White/silver retro trim ring
        const ringPts = [];
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2;
          ringPts.push([wx + Math.cos(a) * tireRimR * 0.96, wy + Math.sin(a) * tireRimR * 0.96, outerZ + dir * 0.007]);
        }
        pushPoly(ringPts, [205, 212, 222], { normal: [0, 0, dir], layer: -0.007, gloss: 'chrome' });
      }
      const capPts = [];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        capPts.push([wx + Math.cos(a) * tireRimR * 0.56, wy + Math.sin(a) * tireRimR * 0.56, outerZ + dir * 0.009]);
      }
      pushPoly(capPts, bp.rimStyle === 'steel_cap' ? [184, 192, 204] : [232, 238, 246], {
        normal: [0, 0, dir],
        layer: -0.011,
        gloss: 'chrome',
      });
    } else {
      // Stamped steel wheel with radial ventilation slots & lug bolts
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2 + 0.2;
        const vx = wx + Math.cos(a) * tireRimR * 0.72;
        const vy = wy + Math.sin(a) * tireRimR * 0.72;
        pushPoly(
          [
            [vx - 0.007, vy - 0.007, outerZ + dir * 0.0075],
            [vx + 0.007, vy - 0.007, outerZ + dir * 0.0075],
            [vx + 0.007, vy + 0.007, outerZ + dir * 0.0075],
            [vx - 0.007, vy + 0.007, outerZ + dir * 0.0075],
          ],
          [32, 36, 42],
          { normal: [0, 0, dir], layer: -0.009 }
        );
      }
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2 + 0.4;
        const lx = wx + Math.cos(a) * tireRimR * 0.42;
        const ly = wy + Math.sin(a) * tireRimR * 0.42;
        pushPoly(
          [
            [lx - 0.006, ly - 0.006, outerZ + dir * 0.008],
            [lx + 0.006, ly - 0.006, outerZ + dir * 0.008],
            [lx + 0.006, ly + 0.006, outerZ + dir * 0.008],
            [lx - 0.006, ly + 0.006, outerZ + dir * 0.008],
          ],
          [44, 48, 54],
          { normal: [0, 0, dir], layer: -0.01 }
        );
      }
    }
    const hubPts = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      hubPts.push([wx + Math.cos(a) * r * 0.13, wy + Math.sin(a) * r * 0.13, outerZ + dir * 0.012]);
    }
    pushPoly(hubPts, [32, 36, 42], { normal: [0, 0, dir], layer: -0.013 });
  }

  addWheel(bp.frontAxle, -bp.halfW - 0.008, true);
  addWheel(bp.frontAxle, bp.halfW + 0.008, true);
  addWheel(bp.rearAxle, -bp.halfW - 0.008, false);
  addWheel(bp.rearAxle, bp.halfW + 0.008, false);

  // --- SEMICIRCULAR WHEEL ARCH FENDER PANELS ---
  const fArchA = bp.frontAxle + archR + 0.04;
  const fArchB = bp.frontAxle - archR - 0.04;
  const rArchA = bp.rearAxle + archR + 0.04;
  const rArchB = bp.rearAxle - archR - 0.04;

  function addWheelArchFender(ax, xBack, xFront) {
    const wy = bp.wheelR;
    const outerPts = [
      [xBack, bp.ground],
      [xBack, wy + archR * 0.55],
      [xBack, archTop],
      [ax - (xFront - xBack) * 0.18, archTop],
      [ax + (xFront - xBack) * 0.18, archTop],
      [xFront, archTop],
      [xFront, wy + archR * 0.55],
      [xFront, bp.ground],
    ];
    const segs = 7;
    for (const sd of [-1, 1]) {
      const zSide = sd * bp.halfW;
      const zTop = sd * (bp.halfW - 0.005);
      for (let i = 0; i < segs; i++) {
        const a0 = Math.PI * (1 - i / segs);
        const a1 = Math.PI * (1 - (i + 1) / segs);
        const in0 = [ax + Math.cos(a0) * archR, Math.max(bp.ground, wy + Math.sin(a0) * archR)];
        const in1 = [ax + Math.cos(a1) * archR, Math.max(bp.ground, wy + Math.sin(a1) * archR)];
        const o0 = outerPts[i];
        const o1 = outerPts[i + 1];
        const zO0 = o0[1] >= archTop - 0.01 ? zTop : zSide;
        const zO1 = o1[1] >= archTop - 0.01 ? zTop : zSide;
        pushPoly(
          [
            [in0[0], in0[1], zSide],
            [o0[0], o0[1], zO0],
            [o1[0], o1[1], zO1],
            [in1[0], in1[1], zSide],
          ],
          paintRgb,
          { normal: [0, 0, sd], edge: true, gloss: 'paint' }
        );
        const lipR = archR + (bp.fenderFlares ? 0.028 : 0.013);
        const l0 = [ax + Math.cos(a0) * lipR, Math.max(bp.ground, wy + Math.sin(a0) * lipR)];
        const l1 = [ax + Math.cos(a1) * lipR, Math.max(bp.ground, wy + Math.sin(a1) * lipR)];
        pushPoly(
          [
            [in0[0], in0[1], zSide + sd * 0.003],
            [l0[0], l0[1], zSide + sd * 0.003],
            [l1[0], l1[1], zSide + sd * 0.003],
            [in1[0], in1[1], zSide + sd * 0.003],
          ],
          bp.fenderFlares ? [26, 28, 32] : paintRgb,
          { normal: [0, 0, sd], layer: -0.008, gloss: bp.fenderFlares ? undefined : 'paint' }
        );
      }
    }
  }

  addWheelArchFender(bp.frontAxle, fArchB, fArchA);
  addWheelArchFender(bp.rearAxle, rArchB, rArchA);

  // --- LOWER ROCKER & SCULPTED SIDE HULL ---
  function addCurvedHullSection(x0, x1, yBot, yTop, w0, w1, rgb, opts = {}) {
    const c = [(x0 + x1) * 0.5, (yBot + yTop) * 0.5, 0];
    const yMid = (yBot + yTop) * 0.55;
    const zBot0 = w0 - 0.025;
    const zBot1 = w1 - 0.025;
    const zMid0 = w0 + (bp.bulge || 0.014);
    const zMid1 = w1 + (bp.bulge || 0.014);
    const zTop0 = w0 - 0.004;
    const zTop1 = w1 - 0.004;

    for (const sd of [-1, 1]) {
      pushPoly(
        [
          [x0, yBot, sd * zBot0],
          [x1, yBot, sd * zBot1],
          [x1, yMid, sd * zMid1],
          [x0, yMid, sd * zMid0],
        ],
        rgb,
        { center: c, gloss: opts.gloss, edge: true }
      );
      pushPoly(
        [
          [x0, yMid, sd * zMid0],
          [x1, yMid, sd * zMid1],
          [x1, yTop, sd * zTop1],
          [x0, yTop, sd * zTop0],
        ],
        rgb,
        { center: c, gloss: opts.gloss, edge: true }
      );
    }
    if (opts.capFront) {
      pushPoly(
        [
          [x1, yBot, -zBot1],
          [x1, yBot, zBot1],
          [x1, yMid, zMid1],
          [x1, yMid, -zMid1],
        ],
        rgb,
        { normal: [1, 0, 0], gloss: opts.gloss }
      );
      pushPoly(
        [
          [x1, yMid, -zMid1],
          [x1, yMid, zMid1],
          [x1, yTop, zTop1],
          [x1, yTop, -zTop1],
        ],
        rgb,
        { normal: [1, 0, 0], gloss: opts.gloss }
      );
    }
    if (opts.capRear) {
      pushPoly(
        [
          [x0, yBot, zBot0],
          [x0, yBot, -zBot0],
          [x0, yMid, -zMid0],
          [x0, yMid, zMid0],
        ],
        rgb,
        { normal: [-1, 0, 0], gloss: opts.gloss }
      );
      pushPoly(
        [
          [x0, yMid, zMid0],
          [x0, yMid, -zMid0],
          [x0, yTop, -zTop0],
          [x0, yTop, zTop0],
        ],
        rgb,
        { normal: [-1, 0, 0], gloss: opts.gloss }
      );
    }
  }

  addCurvedHullSection(rArchA, fArchB, bp.ground, archTop, bp.halfW, bp.halfW, paintRgb, { gloss: 'paint' });
  addCurvedHullSection(fArchA, bp.halfL - 0.08, bp.ground + 0.02, archTop, bp.halfW, bp.halfW - 0.01, paintRgb, { gloss: 'paint' });
  addCurvedHullSection(
    bp.halfL - 0.08,
    bp.halfL,
    bp.ground + 0.02,
    archTop,
    bp.halfW - 0.01,
    bp.halfW - bp.noseTaper,
    paintRgb,
    { gloss: 'paint', capFront: true }
  );
  addCurvedHullSection(-bp.halfL + 0.08, rArchB, bp.ground + 0.02, archTop, bp.halfW - 0.01, bp.halfW, paintRgb, { gloss: 'paint' });
  addCurvedHullSection(
    -bp.halfL,
    -bp.halfL + 0.08,
    bp.ground + 0.02,
    archTop,
    bp.halfW - bp.tailTaper,
    bp.halfW - 0.01,
    paintRgb,
    { gloss: 'paint', capRear: true }
  );

  // Vesta signature X-side body stampings & character line crease
  if (bp.xSides) {
    const shadeDark = paintRgb.map((c) => Math.max(0, c - 26));
    const shadeLite = paintRgb.map((c) => Math.min(255, c + 22));
    for (const sd of [-1, 1]) {
      const zX = sd * (bp.halfW + 0.014);
      // Front X diagonal crease
      pushPoly(
        [
          [0.06, bp.beltY - 0.03, zX],
          [fArchB - 0.02, bp.ground + 0.06, zX],
          [fArchB - 0.06, bp.ground + 0.06, zX],
          [0.02, bp.beltY - 0.03, zX],
        ],
        shadeDark,
        { normal: [0, 0.25, sd], layer: -0.014, gloss: 'paint' }
      );
      // Rear X diagonal crease
      pushPoly(
        [
          [-0.08, bp.beltY - 0.03, zX],
          [rArchA + 0.02, bp.ground + 0.06, zX],
          [rArchA + 0.06, bp.ground + 0.06, zX],
          [-0.04, bp.beltY - 0.03, zX],
        ],
        shadeLite,
        { normal: [0, -0.25, sd], layer: -0.014, gloss: 'paint' }
      );
    }
  }

  // --- HIGH-DETAIL TEXTURED DASHBOARD, GLOWING GAUGES, STEERING WHEEL & CABIN SEATS ---
  addInteriorCabin();

  // --- UPPER BELT, SCULPTED HOOD, TRUNK DECK & GREENHOUSE / VAN ROOF ---
  if (bp.isVan) {
    const vanStations = [
      { x: -bp.halfL, y: archTop, w: bp.halfW - bp.tailTaper },
      { x: -bp.halfL + 0.09, y: archTop, w: bp.halfW },
      { x: bp.halfL - 0.10, y: archTop, w: bp.halfW },
      { x: bp.halfL, y: archTop, w: bp.halfW - bp.noseTaper },
    ];
    for (let i = 0; i < vanStations.length - 1; i++) {
      const a = vanStations[i],
        b = vanStations[i + 1];
      const beltTop = bp.beltY + 0.06;
      for (const sd of [-1, 1]) {
        pushPoly(
          [
            [a.x, archTop - 0.003, sd * (a.w - 0.004)],
            [b.x, archTop - 0.003, sd * (b.w - 0.004)],
            [b.x, beltTop, sd * (b.w - 0.012)],
            [a.x, beltTop, sd * (a.w - 0.012)],
          ],
          paintRgb,
          { normal: [0, 0.15, sd], gloss: 'paint', edge: true }
        );
      }
    }
    pushPoly(
      [
        [bp.halfL, archTop, -(bp.halfW - bp.noseTaper)],
        [bp.halfL, archTop, bp.halfW - bp.noseTaper],
        [bp.halfL - 0.015, bp.beltY + 0.06, bp.halfW - bp.noseTaper - 0.01],
        [bp.halfL - 0.015, bp.beltY + 0.06, -(bp.halfW - bp.noseTaper - 0.01)],
      ],
      paintRgb,
      { normal: [1, 0.1, 0], gloss: 'paint' }
    );
    pushPoly(
      [
        [-bp.halfL, archTop, bp.halfW - bp.tailTaper],
        [-bp.halfL, archTop, -(bp.halfW - bp.tailTaper)],
        [-bp.halfL + 0.01, bp.beltY + 0.06, -(bp.halfW - bp.tailTaper - 0.01)],
        [-bp.halfL + 0.01, bp.beltY + 0.06, bp.halfW - bp.tailTaper - 0.01],
      ],
      paintRgb,
      { normal: [-1, 0.05, 0], gloss: 'paint' }
    );
    const vwNose = bp.halfW - bp.noseTaper - 0.016;
    const vwTail = bp.halfW - bp.tailTaper - 0.016;
    const rw = bp.roofW;
    for (const sd of [-1, 1]) {
      pushPoly(
        [
          [-bp.halfL + 0.01, bp.beltY + 0.058, sd * vwTail],
          [bp.halfL - 0.015, bp.beltY + 0.058, sd * vwNose],
          [bp.halfL - 0.09, bp.roofY - 0.05, sd * (rw - 0.02)],
          [-bp.halfL + 0.04, bp.roofY - 0.05, sd * (rw - 0.02)],
        ],
        paintRgb,
        { normal: [0, 0.25, sd], gloss: 'paint', edge: true }
      );
      pushPoly(
        [
          [-bp.halfL + 0.04, bp.roofY - 0.05, sd * (rw - 0.02)],
          [bp.halfL - 0.09, bp.roofY - 0.05, sd * (rw - 0.02)],
          [bp.halfL - 0.16, bp.roofY, sd * (rw * 0.6)],
          [-bp.halfL + 0.11, bp.roofY, sd * (rw * 0.6)],
        ],
        paintRgb,
        { normal: [0, 0.72, sd * 0.68], gloss: 'paint' }
      );
    }
    pushPoly(
      [
        [-bp.halfL + 0.11, bp.roofY, -rw * 0.6],
        [bp.halfL - 0.16, bp.roofY, -rw * 0.6],
        [bp.halfL - 0.16, bp.roofY, rw * 0.6],
        [-bp.halfL + 0.11, bp.roofY, rw * 0.6],
      ],
      paintRgb,
      { normal: [0, 1, 0], gloss: 'paint' }
    );
    pushPoly(
      [
        [bp.halfL - 0.015, bp.beltY + 0.06, -vwNose],
        [bp.halfL - 0.015, bp.beltY + 0.06, vwNose],
        [bp.halfL - 0.09, bp.roofY - 0.05, rw - 0.02],
        [bp.halfL - 0.09, bp.roofY - 0.05, -(rw - 0.02)],
      ],
      paintRgb,
      { normal: [0.97, 0.24, 0], gloss: 'paint' }
    );
    pushPoly(
      [
        [-bp.halfL + 0.01, bp.beltY + 0.06, vwTail],
        [-bp.halfL + 0.01, bp.beltY + 0.06, -vwTail],
        [-bp.halfL + 0.04, bp.roofY - 0.05, -(rw - 0.02)],
        [-bp.halfL + 0.04, bp.roofY - 0.05, rw - 0.02],
      ],
      paintRgb,
      { normal: [-0.99, 0.12, 0], gloss: 'paint' }
    );

    // Split 2-piece front windshield with dynamic reflections & sun band
    for (const sZ of [-1, 1]) {
      const zIn = sZ < 0 ? -0.022 : 0.022;
      const zOut = sZ * (rw - 0.045);
      const p0 = sZ < 0 ? [bp.halfL - 0.014, bp.beltY + 0.075, zOut] : [bp.halfL - 0.014, bp.beltY + 0.075, zIn];
      const p1 = sZ < 0 ? [bp.halfL - 0.014, bp.beltY + 0.075, zIn] : [bp.halfL - 0.014, bp.beltY + 0.075, zOut];
      const p2 = sZ < 0 ? [bp.halfL - 0.082, bp.roofY - 0.075, zIn] : [bp.halfL - 0.082, bp.roofY - 0.075, zOut];
      const p3 = sZ < 0 ? [bp.halfL - 0.082, bp.roofY - 0.075, zOut] : [bp.halfL - 0.082, bp.roofY - 0.075, zIn];
      addGlassPanel(p0, p1, p2, p3, [0.97, 0.24, 0], {
        alpha: 0.44,
        sunBand: true,
        phase: sZ * 0.4,
        layer: -0.014,
      });
    }

    // Side cab & passenger windows with dynamic glass reflections + external mirrors
    for (const sd of [-1, 1]) {
      const wz0 = sd * (bp.halfW - 0.025);
      const wz1 = sd * (rw - 0.018);
      const panes = [
        [bp.halfL - 0.44, bp.halfL - 0.10],
        [-0.08, bp.halfL - 0.50],
        [-bp.halfL + 0.10, -0.16],
      ];
      for (let pi = 0; pi < panes.length; pi++) {
        const [wx0, wx1] = panes[pi];
        addGlassPanel(
          [wx0, bp.beltY + 0.07, wz0],
          [wx1, bp.beltY + 0.07, wz0],
          [wx1, bp.roofY - 0.075, wz1],
          [wx0, bp.roofY - 0.075, wz1],
          [0, 0.22, sd],
          { alpha: pi === 0 ? 0.48 : 0.56, phase: sd * 1.1 + pi * 0.55, layer: -0.014 }
        );
      }
      pushPoly(
        [
          [bp.halfL - 0.07, bp.beltY + 0.08, sd * (bp.halfW + 0.04)],
          [bp.halfL - 0.02, bp.beltY + 0.08, sd * (bp.halfW + 0.04)],
          [bp.halfL - 0.02, bp.beltY + 0.20, sd * (bp.halfW + 0.04)],
          [bp.halfL - 0.07, bp.beltY + 0.20, sd * (bp.halfW + 0.04)],
        ],
        [24, 26, 30],
        { doubleSided: true }
      );
    }

    // Split rear doors + twin reflective rear windows
    pushPoly(
      [
        [-bp.halfL, bp.ground + 0.06, -0.006],
        [-bp.halfL, bp.ground + 0.06, 0.006],
        [-bp.halfL + 0.03, bp.roofY - 0.06, 0.006],
        [-bp.halfL + 0.03, bp.roofY - 0.06, -0.006],
      ],
      [14, 16, 20],
      { normal: [-1, 0, 0], layer: -0.013 }
    );
    for (const sZ of [-1, 1]) {
      const zA = sZ < 0 ? -rw + 0.07 : 0.05;
      const zB = sZ < 0 ? -0.05 : rw - 0.07;
      addGlassPanel(
        [-bp.halfL + 0.01, bp.beltY + 0.08, zB],
        [-bp.halfL + 0.01, bp.beltY + 0.08, zA],
        [-bp.halfL + 0.035, bp.roofY - 0.09, zA],
        [-bp.halfL + 0.035, bp.roofY - 0.09, zB],
        [-0.99, 0.12, 0],
        { alpha: 0.56, phase: Math.PI + sZ * 0.3, layer: -0.014 }
      );
    }
  } else {
    // --- LOFTED UPPER SHOULDER, CROWNED HOOD & TRUNK DECK ---
    const wNose = bp.halfW - bp.noseTaper;
    const wTail = bp.halfW - bp.tailTaper;
    const ribPts = [
      { x: -bp.halfL, y: bp.rearDeckY - 0.02, w: wTail },
      { x: -bp.halfL + 0.08, y: bp.rearDeckY, w: bp.halfW - 0.01 },
      { x: bp.rearGlassX, y: bp.rearDeckY, w: bp.halfW - 0.01 },
      { x: bp.hoodX, y: bp.beltY, w: bp.halfW - 0.01 },
      { x: bp.halfL - 0.10, y: bp.frontSlopeY + 0.015, w: bp.halfW - 0.012 },
      { x: bp.halfL, y: bp.frontSlopeY, w: wNose },
    ];
    for (let i = 0; i < ribPts.length - 1; i++) {
      const a = ribPts[i],
        b = ribPts[i + 1];
      for (const sd of [-1, 1]) {
        pushPoly(
          [
            [a.x, archTop - 0.004, sd * (a.w - 0.004)],
            [b.x, archTop - 0.004, sd * (b.w - 0.004)],
            [b.x, b.y, sd * (b.w - 0.022)],
            [a.x, a.y, sd * (a.w - 0.022)],
          ],
          paintRgb,
          { normal: [0, 0.22, sd], gloss: 'paint', edge: true }
        );
      }
      // Crowned center deck/hood strip for extra realism
      const wA = a.w - 0.022;
      const wB = b.w - 0.022;
      pushPoly(
        [
          [a.x, a.y, -wA],
          [b.x, b.y, -wB],
          [b.x, b.y + 0.008, 0],
          [a.x, a.y + 0.008, 0],
        ],
        paintRgb,
        { center: [0, 0, 0], gloss: 'paint' }
      );
      pushPoly(
        [
          [a.x, a.y + 0.008, 0],
          [b.x, b.y + 0.008, 0],
          [b.x, b.y, wB],
          [a.x, a.y, wA],
        ],
        paintRgb,
        { center: [0, 0, 0], gloss: 'paint' }
      );
    }

    // Front & rear upper nose/tail caps
    pushPoly(
      [
        [bp.halfL, archTop - 0.004, -(wNose - 0.004)],
        [bp.halfL, archTop - 0.004, wNose - 0.004],
        [bp.halfL, bp.frontSlopeY, wNose - 0.022],
        [bp.halfL, bp.frontSlopeY, -(wNose - 0.022)],
      ],
      paintRgb,
      { normal: [1, 0, 0], gloss: 'paint' }
    );
    pushPoly(
      [
        [-bp.halfL, archTop - 0.004, wTail - 0.004],
        [-bp.halfL, archTop - 0.004, -(wTail - 0.004)],
        [-bp.halfL, bp.rearDeckY - 0.02, -(wTail - 0.022)],
        [-bp.halfL, bp.rearDeckY - 0.02, wTail - 0.022],
      ],
      paintRgb,
      { normal: [-1, 0, 0], gloss: 'paint' }
    );

    if (bp.hoodRib) {
      addBox(bp.hoodX + 0.04, bp.halfL - 0.03, bp.frontSlopeY, bp.beltY + 0.016, -0.14, 0.14, paintRgb, {
        topInsetZ: 0.032,
        gloss: 'paint',
        edge: true,
      });
    }
    if (bp.hoodVents) {
      addBox(bp.hoodX + 0.06, bp.halfL - 0.08, bp.frontSlopeY + 0.005, bp.beltY + 0.02, -0.16, 0.16, paintRgb, {
        topInsetZ: 0.035,
        gloss: 'paint',
        edge: true,
      });
      for (const sd of [-1, 1]) {
        addBox(bp.hoodX + 0.12, bp.halfL - 0.12, bp.beltY + 0.014, bp.beltY + 0.026, sd * 0.095 - 0.035, sd * 0.095 + 0.035, [18, 20, 24], {
          layer: -0.01,
        });
      }
    }

    // --- GREENHOUSE CABIN WITH CURVED ROOF CROWN ---
    const gBotW = bp.halfW - 0.024;
    const gTopW = bp.roofW;
    const rCrown = bp.roofY + 0.02;
    const windN = norm3([bp.beltY - bp.roofY, bp.hoodX - bp.windTopX, 0]);
    const rearN = norm3([-(bp.roofY - bp.rearDeckY), bp.rearRoofX - bp.rearGlassX, 0]);

    for (const sd of [-1, 1]) {
      pushPoly(
        [
          [bp.rearGlassX, bp.rearDeckY - 0.003, sd * gBotW],
          [bp.hoodX, bp.beltY - 0.003, sd * gBotW],
          [bp.windTopX, bp.roofY, sd * gTopW],
          [bp.rearRoofX, bp.roofY, sd * gTopW],
        ],
        paintRgb,
        { normal: [0, 0.35, sd], gloss: 'paint', edge: true }
      );
      pushPoly(
        [
          [bp.rearRoofX, bp.roofY, sd * gTopW],
          [bp.windTopX, bp.roofY, sd * gTopW],
          [bp.windTopX - 0.02, rCrown, sd * (gTopW * 0.45)],
          [bp.rearRoofX + 0.02, rCrown, sd * (gTopW * 0.45)],
        ],
        paintRgb,
        { normal: [0, 0.94, sd * 0.34], gloss: 'paint' }
      );
    }
    pushPoly(
      [
        [bp.rearRoofX + 0.02, rCrown, -gTopW * 0.45],
        [bp.windTopX - 0.02, rCrown, -gTopW * 0.45],
        [bp.windTopX - 0.02, rCrown, gTopW * 0.45],
        [bp.rearRoofX + 0.02, rCrown, gTopW * 0.45],
      ],
      paintRgb,
      { normal: [0, 1, 0], gloss: 'paint' }
    );
    pushPoly(
      [
        [bp.hoodX, bp.beltY - 0.003, -gBotW],
        [bp.hoodX, bp.beltY - 0.003, gBotW],
        [bp.windTopX, bp.roofY, gTopW],
        [bp.windTopX, bp.roofY, -gTopW],
      ],
      paintRgb,
      { normal: windN, gloss: 'paint' }
    );
    pushPoly(
      [
        [bp.rearGlassX, bp.rearDeckY - 0.003, gBotW],
        [bp.rearGlassX, bp.rearDeckY - 0.003, -gBotW],
        [bp.rearRoofX, bp.roofY, -gTopW],
        [bp.rearRoofX, bp.roofY, gTopW],
      ],
      paintRgb,
      { normal: rearN, gloss: 'paint' }
    );

    // Translucent Reflective Front Windshield + Sun Band + Dynamic Glint + Wipers
    const wBotW = gBotW - 0.032;
    const wTopW = gTopW - 0.028;
    addGlassPanel(
      [bp.hoodX - 0.01, bp.beltY + 0.015, -wBotW],
      [bp.hoodX - 0.01, bp.beltY + 0.015, wBotW],
      [bp.windTopX + 0.015, bp.roofY - 0.016, wTopW],
      [bp.windTopX + 0.015, bp.roofY - 0.016, -wTopW],
      windN,
      { alpha: 0.43, sunBand: true, phase: 0.15, layer: -0.015 }
    );
    // Wiper blades
    for (const wz of [-0.14, 0.06]) {
      pushPoly(
        [
          [bp.hoodX - 0.012, bp.beltY + 0.02, wz - 0.11],
          [bp.hoodX - 0.012, bp.beltY + 0.02, wz + 0.11],
          [bp.hoodX - 0.032, bp.beltY + 0.032, wz + 0.11],
          [bp.hoodX - 0.032, bp.beltY + 0.032, wz - 0.11],
        ],
        [15, 17, 20],
        { normal: windN, layer: -0.019 }
      );
    }

    // Rear Window + Copper Defroster Lines + Dynamic Reflections + Optional Rear Wiper
    addGlassPanel(
      [bp.rearGlassX + 0.015, bp.rearDeckY + 0.015, wBotW],
      [bp.rearGlassX + 0.015, bp.rearDeckY + 0.015, -wBotW],
      [bp.rearRoofX - 0.015, bp.roofY - 0.016, -wTopW],
      [bp.rearRoofX - 0.015, bp.roofY - 0.016, wTopW],
      rearN,
      { alpha: 0.54, defroster: true, phase: Math.PI, layer: -0.015 }
    );
    if (bp.rearWiper) {
      pushPoly(
        [
          [bp.rearGlassX + 0.02, bp.rearDeckY + 0.024, -0.02],
          [bp.rearGlassX + 0.02, bp.rearDeckY + 0.024, 0.14],
          [bp.rearGlassX + 0.012, bp.rearDeckY + 0.042, 0.14],
          [bp.rearGlassX + 0.012, bp.rearDeckY + 0.042, -0.02],
        ],
        [18, 20, 24],
        { normal: rearN, layer: -0.019 }
      );
    }

    // Side Windows (with B-pillar + C-quarter window on wagons) + Dynamic Reflections + Door Seams + Handles
    for (const sd of [-1, 1]) {
      const zBot = sd * (gBotW + 0.002);
      const zTop = sd * (gTopW + 0.002);
      const midX = bp.doors === 1 ? bp.rearRoofX + 0.15 : (bp.windTopX + bp.rearRoofX) * 0.45;
      const midBotX = bp.doors === 1 ? bp.rearGlassX + 0.22 : midX + 0.02;

      addGlassPanel(
        [midBotX + 0.022, bp.beltY + 0.016, zBot],
        [bp.hoodX - 0.065, bp.beltY + 0.016, zBot],
        [bp.windTopX - 0.03, bp.roofY - 0.022, zTop],
        [midX + 0.02, bp.roofY - 0.022, zTop],
        [0, 0.35, sd],
        { alpha: 0.48, phase: sd * 1.35, layer: -0.015 }
      );
      if (bp.rearRoofX < midX - 0.14) {
        if (bp.wagonGlass) {
          const splitX = (bp.rearGlassX + midBotX) * 0.48;
          const splitTopX = (bp.rearRoofX + midX) * 0.48;
          addGlassPanel(
            [splitX + 0.02, bp.beltY + 0.016, zBot],
            [midBotX - 0.022, bp.beltY + 0.016, zBot],
            [midX - 0.02, bp.roofY - 0.022, zTop],
            [splitTopX + 0.02, bp.roofY - 0.022, zTop],
            [0, 0.35, sd],
            { alpha: 0.54, phase: sd * 1.35 + 0.55, layer: -0.015 }
          );
          addGlassPanel(
            [bp.rearGlassX + 0.055, bp.beltY + 0.016, zBot],
            [splitX - 0.02, bp.beltY + 0.016, zBot],
            [splitTopX - 0.02, bp.roofY - 0.022, zTop],
            [bp.rearRoofX + 0.04, bp.roofY - 0.022, zTop],
            [0, 0.35, sd],
            { alpha: 0.58, phase: sd * 1.35 + 1.1, layer: -0.015 }
          );
        } else {
          addGlassPanel(
            [bp.rearGlassX + 0.075, bp.beltY + 0.016, zBot],
            [midBotX - 0.022, bp.beltY + 0.016, zBot],
            [midX - 0.02, bp.roofY - 0.022, zTop],
            [bp.rearRoofX + 0.04, bp.roofY - 0.022, zTop],
            [0, 0.35, sd],
            { alpha: 0.54, phase: sd * 1.35 + 0.65, layer: -0.015 }
          );
        }
      }

      if (bp.chromeWindowTrim) {
        pushPoly(
          [
            [bp.rearGlassX + 0.06, bp.beltY + 0.006, zBot + sd * 0.001],
            [bp.hoodX - 0.05, bp.beltY + 0.006, zBot + sd * 0.001],
            [bp.hoodX - 0.05, bp.beltY + 0.016, zBot + sd * 0.001],
            [bp.rearGlassX + 0.06, bp.beltY + 0.016, zBot + sd * 0.001],
          ],
          [222, 230, 240],
          { normal: [0, 0.35, sd], layer: -0.017, gloss: 'chrome' }
        );
      }

      const doorX0 = bp.rearAxle + bp.wheelR + 0.04;
      const doorX1 = bp.frontAxle - bp.wheelR - 0.04;
      const seamXs = bp.doors === 1 ? [doorX0 + 0.03, doorX1 - 0.03] : [doorX0 + 0.03, midBotX, doorX1 - 0.03];
      for (const sx of seamXs) {
        pushPoly(
          [
            [sx - 0.004, bp.ground + 0.04, sd * (bp.halfW + 0.01)],
            [sx + 0.004, bp.ground + 0.04, sd * (bp.halfW + 0.01)],
            [sx + 0.004, bp.beltY - 0.01, sd * (bp.halfW - 0.005)],
            [sx - 0.004, bp.beltY - 0.01, sd * (bp.halfW - 0.005)],
          ],
          [14, 16, 20],
          { normal: [0, 0, sd], layer: -0.013 }
        );
      }
      const handleXs = bp.doors === 1 ? [doorX0 + 0.14] : [midBotX + 0.08, doorX0 + 0.10];
      for (const hx of handleXs) {
        pushPoly(
          [
            [hx, bp.beltY - 0.068, sd * (bp.halfW + 0.006)],
            [hx + 0.07, bp.beltY - 0.068, sd * (bp.halfW + 0.006)],
            [hx + 0.07, bp.beltY - 0.044, sd * (bp.halfW + 0.006)],
            [hx, bp.beltY - 0.044, sd * (bp.halfW + 0.006)],
          ],
          bp.chromeSide ? [222, 230, 238] : bp.bodyMirrors ? paintRgb.map((c) => Math.min(255, c + 16)) : [26, 28, 34],
          { normal: [0, 0, sd], layer: -0.015 }
        );
      }

      // Amber side turn repeater on front fender
      pushPoly(
        [
          [bp.frontAxle - 0.19, bp.beltY - 0.08, sd * bp.halfW],
          [bp.frontAxle - 0.15, bp.beltY - 0.08, sd * bp.halfW],
          [bp.frontAxle - 0.15, bp.beltY - 0.06, sd * bp.halfW],
          [bp.frontAxle - 0.19, bp.beltY - 0.06, sd * bp.halfW],
        ],
        [245, 145, 22],
        { normal: [0, 0, sd], layer: -0.015 }
      );
    }

    // Fuel filler flap on passenger rear quarter (sd = 1)
    pushPoly(
      [
        [bp.rearAxle - 0.05, bp.beltY - 0.09, bp.halfW + 0.002],
        [bp.rearAxle + 0.02, bp.beltY - 0.09, bp.halfW + 0.002],
        [bp.rearAxle + 0.02, bp.beltY - 0.04, bp.halfW + 0.002],
        [bp.rearAxle - 0.05, bp.beltY - 0.04, bp.halfW + 0.002],
      ],
      paintRgb.map((c) => Math.max(0, c - 24)),
      { normal: [0, 0, 1], layer: -0.014, edge: true }
    );

    // Side mirrors (body-colored or classic black/chrome + mirror face)
    for (const sd of [-1, 1]) {
      const mCol = bp.bodyMirrors ? paintRgb : bp.chromeSide ? [208, 216, 226] : [26, 28, 32];
      addBox(
        bp.hoodX - 0.125,
        bp.hoodX - 0.04,
        bp.beltY - 0.005,
        bp.beltY + 0.056,
        sd < 0 ? -bp.halfW - 0.07 : bp.halfW + 0.004,
        sd < 0 ? -bp.halfW - 0.004 : bp.halfW + 0.07,
        mCol,
        { edge: true, gloss: bp.bodyMirrors ? 'paint' : bp.chromeSide ? 'chrome' : undefined }
      );
      pushPoly(
        [
          [bp.hoodX - 0.127, bp.beltY, sd * (bp.halfW + 0.012)],
          [bp.hoodX - 0.127, bp.beltY, sd * (bp.halfW + 0.062)],
          [bp.hoodX - 0.127, bp.beltY + 0.048, sd * (bp.halfW + 0.062)],
          [bp.hoodX - 0.127, bp.beltY + 0.048, sd * (bp.halfW + 0.012)],
        ],
        [155, 190, 215],
        { normal: [-1, 0, 0], gloss: 'glass', layer: -0.016 }
      );
    }

    // Roof antenna or modern shark-fin
    if (bp.sharkFin) {
      addBox(bp.rearRoofX + 0.07, bp.rearRoofX + 0.15, rCrown - 0.005, rCrown + 0.042, -0.016, 0.016, paintRgb, {
        topInsetZ: 0.008,
        gloss: 'paint',
      });
    } else if (bp.antenna) {
      addBox(bp.windTopX - 0.08, bp.windTopX - 0.065, rCrown - 0.005, rCrown + 0.13, -0.004, 0.004, [30, 34, 40], {});
    }
  }

  // --- EXTERIOR MOLDINGS, RAILS, SPOILERS, SKIRTS, MUDFLAPS, EXHAUST ---
  if (bp.chromeSide) {
    for (const sd of [-1, 1]) {
      pushPoly(
        [
          [-bp.halfL + 0.06, bp.beltY - 0.095, sd * (bp.halfW + 0.007)],
          [bp.halfL - 0.06, bp.beltY - 0.095, sd * (bp.halfW + 0.007)],
          [bp.halfL - 0.06, bp.beltY - 0.075, sd * (bp.halfW + 0.007)],
          [-bp.halfL + 0.06, bp.beltY - 0.075, sd * (bp.halfW + 0.007)],
        ],
        [226, 234, 244],
        { normal: [0, 0, sd], layer: -0.016, gloss: 'chrome' }
      );
    }
  }
  if (bp.sideRubStrip) {
    for (const sd of [-1, 1]) {
      pushPoly(
        [
          [rArchA + 0.02, bp.ground + 0.11, sd * (bp.halfW + 0.013)],
          [fArchB - 0.02, bp.ground + 0.11, sd * (bp.halfW + 0.013)],
          [fArchB - 0.02, bp.ground + 0.145, sd * (bp.halfW + 0.013)],
          [rArchA + 0.02, bp.ground + 0.145, sd * (bp.halfW + 0.013)],
        ],
        [22, 24, 28],
        { normal: [0, 0, sd], layer: -0.015 }
      );
    }
  }
  if (bp.sideSkirt || bp.sideCladding || bp.fenderFlares) {
    const skirtCol = bp.sideCladding || bp.fenderFlares ? [26, 28, 32] : paintRgb;
    const skirtH = bp.sideCladding ? 0.08 : 0.048;
    for (const sd of [-1, 1]) {
      addBox(
        rArchA + 0.01,
        fArchB - 0.01,
        bp.ground + 0.003,
        bp.ground + skirtH,
        sd < 0 ? -bp.halfW - 0.012 : bp.halfW - 0.01,
        sd < 0 ? -bp.halfW + 0.01 : bp.halfW + 0.012,
        skirtCol,
        { gloss: bp.sideCladding || bp.fenderFlares ? undefined : 'paint' }
      );
    }
  }

  if (bp.chinSpoiler) {
    const fwC = bp.halfW - bp.noseTaper;
    addBox(bp.halfL - 0.04, bp.halfL + 0.055, bp.ground - 0.008, bp.ground + 0.025, -fwC, fwC, [18, 20, 24], {});
  }

  if (bp.mudflaps) {
    for (const sd of [-1, 1]) {
      const mz0 = sd < 0 ? -bp.halfW - 0.01 : bp.halfW - bp.wheelW;
      const mz1 = sd < 0 ? -bp.halfW + bp.wheelW : bp.halfW + 0.01;
      addBox(bp.rearAxle - bp.wheelR - 0.03, bp.rearAxle - bp.wheelR - 0.01, 0.04, bp.ground + 0.03, mz0, mz1, [16, 18, 22], {});
    }
  }

  // Rear exhaust tailpipe (chrome tip)
  addBox(-bp.halfL - 0.055, -bp.halfL + 0.02, bp.ground - 0.03, bp.ground + 0.008, -0.26, -0.205, [148, 158, 168], {
    gloss: 'chrome',
  });

  if (bp.spoiler) {
    addBox(bp.rearRoofX - 0.095, bp.rearRoofX + 0.04, bp.roofY - 0.004, bp.roofY + 0.034, -bp.roofW + 0.01, bp.roofW - 0.01, paintRgb, {
      edge: true,
      gloss: 'paint',
    });
  }
  if (bp.trunkSpoiler) {
    const rwS = bp.halfW - bp.tailTaper - 0.02;
    addBox(-bp.halfL + 0.01, -bp.halfL + 0.09, bp.rearDeckY - 0.005, bp.rearDeckY + 0.045, -rwS, rwS, paintRgb, {
      edge: true,
      gloss: 'paint',
    });
  }
  if (bp.roofRails) {
    for (const sd of [-1, 1]) {
      const rz = sd * (bp.roofW - 0.045);
      addBox(bp.rearRoofX + 0.06, bp.windTopX - 0.08, bp.roofY + 0.01, bp.roofY + 0.044, rz - 0.014, rz + 0.014, [26, 28, 34], {});
    }
  }
  if (bp.roofRack) {
    addBox(bp.rearRoofX + 0.05, bp.windTopX - 0.06, bp.roofY + 0.022, bp.roofY + 0.056, -bp.roofW + 0.03, bp.roofW - 0.03, [34, 38, 44], {
      edge: true,
    });
  }
  if (bp.rearSpare) {
    const spPts = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      spPts.push([-bp.halfL - 0.075, bp.ground + 0.28 + Math.sin(a) * 0.145, Math.cos(a) * 0.145]);
    }
    pushPoly(spPts, [22, 24, 28], { normal: [-1, 0, 0], edge: true, layer: -0.02 });
    const spHub = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      spHub.push([-bp.halfL - 0.08, bp.ground + 0.28 + Math.sin(a) * 0.078, Math.cos(a) * 0.078]);
    }
    pushPoly(spHub, [160, 170, 180], { normal: [-1, 0, 0], layer: -0.024, gloss: 'chrome' });
  }

  // --- BUMPERS ---
  const bDepth = bp.thickBumpers ? 0.068 : 0.048;
  const bTop = bp.ground + (bp.isVan ? 0.14 : 0.12);
  const fwB = bp.halfW - bp.noseTaper + 0.01;
  const rwB = bp.halfW - bp.tailTaper + 0.01;
  addBox(bp.halfL - 0.01, bp.halfL + bDepth, bp.ground + 0.01, bTop, -fwB, fwB, bumperRgb, {
    edge: true,
    gloss: bp.bumperCol === 'body' ? 'paint' : 'chrome',
  });
  addBox(-bp.halfL - bDepth, -bp.halfL + 0.01, bp.ground + 0.01, bTop, -rwB, rwB, bumperRgb, {
    edge: true,
    gloss: bp.bumperCol === 'body' ? 'paint' : 'chrome',
  });

  if (bp.bumperRubber) {
    addBox(bp.halfL + bDepth - 0.005, bp.halfL + bDepth + 0.01, bp.ground + 0.045, bp.ground + 0.085, -fwB - 0.004, fwB + 0.004, [20, 22, 26], {});
    addBox(-bp.halfL - bDepth - 0.01, -bp.halfL - bDepth + 0.005, bp.ground + 0.045, bp.ground + 0.085, -rwB - 0.004, rwB + 0.004, [20, 22, 26], {});
  }
  if (bp.overriders) {
    for (const sZ of [-0.20, 0.20]) {
      addBox(bp.halfL + bDepth, bp.halfL + bDepth + 0.026, bp.ground + 0.01, bTop + 0.036, sZ - 0.02, sZ + 0.02, [216, 224, 234], { gloss: 'chrome' });
      addBox(-bp.halfL - bDepth - 0.026, -bp.halfL - bDepth, bp.ground + 0.01, bTop + 0.036, sZ - 0.02, sZ + 0.02, [216, 224, 234], { gloss: 'chrome' });
    }
  }

  // --- FRONT & REAR FASCIA HELPERS ---
  const fX = bp.halfL + 0.003;
  const fY0 = bTop + 0.02;
  const fY1 = bp.isVan ? bp.beltY + 0.02 : bp.frontSlopeY - 0.018;
  const hlCol = headlights ? [255, 246, 178] : [182, 192, 202];
  const hlGlow = headlights;

  function addFrontRect(y0, y1, z0, z1, rgb, opts = {}) {
    pushPoly(
      [
        [fX, y0, z0],
        [fX, y0, z1],
        [fX, y1, z1],
        [fX, y1, z0],
      ],
      rgb,
      { normal: [1, 0, 0], layer: opts.layer ?? -0.015, unlit: opts.unlit, gloss: opts.gloss }
    );
  }
  function addFrontCircle(cy, cz, rad, rgb, opts = {}) {
    const pts = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      pts.push([fX, cy + Math.sin(a) * rad, cz + Math.cos(a) * rad]);
    }
    pushPoly(pts, rgb, { normal: [1, 0, 0], layer: opts.layer ?? -0.018, unlit: opts.unlit, gloss: opts.gloss });
  }
  function addRearRect(y0, y1, z0, z1, rgb, opts = {}) {
    const rX = -bp.halfL - 0.003;
    pushPoly(
      [
        [rX, y0, z1],
        [rX, y0, z0],
        [rX, y1, z0],
        [rX, y1, z1],
      ],
      rgb,
      { normal: [-1, 0, 0], layer: opts.layer ?? -0.015, unlit: opts.unlit, gloss: opts.gloss }
    );
  }
  function addRearCircle(cy, cz, rad, rgb, opts = {}) {
    const rX = -bp.halfL - 0.003;
    const pts = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      pts.push([rX, cy + Math.sin(a) * rad, cz - Math.cos(a) * rad]);
    }
    pushPoly(pts, rgb, { normal: [-1, 0, 0], layer: opts.layer ?? -0.018, unlit: opts.unlit });
  }

  // --- FRONT GRILLES ---
  if (bp.grille === 'tall_chrome_2107') {
    addBox(bp.halfL - 0.01, bp.halfL + 0.024, fY0 + 0.005, fY1 + 0.032, -0.17, 0.17, [215, 224, 234], { gloss: 'chrome' });
    addBox(bp.halfL + 0.02, bp.halfL + 0.028, fY0 + 0.014, fY1 + 0.022, -0.15, 0.15, [24, 28, 34], {});
    for (let gz = -0.12; gz <= 0.12; gz += 0.038) {
      addBox(bp.halfL + 0.024, bp.halfL + 0.032, fY0 + 0.014, fY1 + 0.022, gz - 0.005, gz + 0.005, [230, 236, 244], { gloss: 'chrome' });
    }
  } else if (bp.grille === 'chrome_bar_2101') {
    addFrontRect(fY0 + 0.01, fY1 - 0.01, -0.22, 0.22, [212, 220, 232], { layer: -0.014, gloss: 'chrome' });
    addFrontRect(fY0 + 0.018, fY1 - 0.018, -0.205, 0.205, [28, 32, 38], { layer: -0.016 });
    addFrontRect((fY0 + fY1) * 0.5 - 0.006, (fY0 + fY1) * 0.5 + 0.006, -0.205, 0.205, [225, 232, 242], { layer: -0.018, gloss: 'chrome' });
  } else if (bp.grille === 'chrome_mesh_2106') {
    addFrontRect(fY0 + 0.008, fY1 - 0.008, -fwB + 0.025, fwB - 0.025, [24, 26, 32], { layer: -0.012 });
    addFrontRect(fY0 + 0.016, fY1 - 0.016, -0.155, 0.155, [212, 220, 230], { layer: -0.016, gloss: 'chrome' });
    addFrontRect(fY0 + 0.025, fY1 - 0.025, -0.142, 0.142, [34, 38, 44], { layer: -0.018 });
  } else if (bp.grille === 'volga_teeth') {
    addFrontRect(fY0 + 0.008, fY1 - 0.008, -0.21, 0.21, [216, 224, 234], { layer: -0.015, gloss: 'chrome' });
    addFrontRect(fY0 + 0.018, fY1 - 0.018, -0.195, 0.195, [20, 22, 26], { layer: -0.017 });
    for (let gz = -0.16; gz <= 0.16; gz += 0.032) {
      addFrontRect(fY0 + 0.02, fY1 - 0.02, gz - 0.005, gz + 0.005, [228, 236, 245], { layer: -0.019, gloss: 'chrome' });
    }
  } else if (bp.grille === 'vesta_x') {
    // Lada Vesta signature black X-mask + twin chrome boomerang cheek trim!
    addFrontRect(bp.ground + 0.028, fY1 - 0.012, -0.185, 0.185, [18, 20, 25], { layer: -0.015 });
    for (const sZ of [-1, 1]) {
      pushPoly(
        [
          [fX, fY1 - 0.01, sZ * 0.175],
          [fX, fY1 - 0.01, sZ * 0.20],
          [fX, bp.ground + 0.028, sZ * 0.255],
          [fX, bp.ground + 0.028, sZ * 0.23],
        ],
        [224, 232, 242],
        { normal: [1, 0, 0], layer: -0.020, gloss: 'chrome' }
      );
    }
    addFrontRect(fY0 + 0.022, fY0 + 0.036, -0.175, 0.175, [210, 218, 228], { layer: -0.018, gloss: 'chrome' });
  } else if (bp.grille === 'granta_sport') {
    // Lada Granta Sport honeycomb black grille + chrome wings + crimson sport lower splitter bar
    addFrontRect(bp.ground + 0.028, fY1 - 0.010, -0.185, 0.185, [18, 20, 24], { layer: -0.015 });
    for (const sZ of [-1, 1]) {
      pushPoly(
        [
          [fX, fY1 - 0.012, sZ * 0.165],
          [fX, fY1 - 0.012, sZ * 0.188],
          [fX, fY0 - 0.01, sZ * 0.215],
          [fX, fY0 - 0.01, sZ * 0.192],
        ],
        [220, 228, 238],
        { normal: [1, 0, 0], layer: -0.020, gloss: 'chrome' }
      );
    }
    addFrontRect(fY0 + 0.014, fY0 + 0.030, -0.175, 0.175, [215, 224, 234], { layer: -0.019, gloss: 'chrome' });
    addFrontRect(bp.ground + 0.018, bp.ground + 0.034, -0.25, 0.25, [212, 32, 38], { layer: -0.021 });
  } else if (bp.grille === 'priora_trap' || bp.grille === 'kalina_smile' || bp.grille === 'chevy_niva') {
    addFrontRect(fY0 + 0.005, fY1 - 0.005, -0.165, 0.165, [210, 218, 228], { layer: -0.015, gloss: 'chrome' });
    addFrontRect(fY0 + 0.014, fY1 - 0.014, -0.15, 0.15, [22, 25, 30], { layer: -0.017 });
    addFrontRect(bp.ground + 0.025, bp.ground + 0.075, -0.21, 0.21, [20, 22, 26], { layer: -0.016 });
  } else if (bp.grille === 'uaz_loaf') {
    addFrontRect(fY0 - 0.01, fY1 - 0.01, -fwB + 0.05, fwB - 0.05, paintRgb.map((c) => Math.max(0, c - 14)), { layer: -0.011 });
    addFrontRect(fY0 + 0.015, fY1 - 0.04, -0.14, 0.14, [24, 28, 32], { layer: -0.016 });
    addFrontRect(fY1 - 0.08, fY1 - 0.045, -0.065, 0.065, [218, 226, 236], { layer: -0.019, gloss: 'chrome' });
  } else if (bp.grille === 'largus_u' || bp.grille === 'samara2') {
    addFrontRect(fY0 + 0.01, fY1 - 0.01, -0.19, 0.19, [24, 26, 32], { layer: -0.015 });
    addFrontRect(fY1 - 0.036, fY1 - 0.02, -0.175, 0.175, [214, 222, 232], { layer: -0.018, gloss: 'chrome' });
  } else if (bp.grille === 'muscular_black') {
    addFrontRect(bp.ground + 0.035, fY1 - 0.006, -0.22, 0.22, [14, 16, 20], { layer: -0.015 });
    addFrontRect(fY0 + 0.012, fY1 - 0.014, -0.195, 0.195, [26, 30, 36], { layer: -0.017 });
    for (const sZ of [-0.30, 0.30]) {
      addFrontRect(bp.ground + 0.028, fY0 + 0.008, sZ - 0.09, sZ + 0.09, [16, 18, 22], { layer: -0.017 });
    }
  } else if (bp.grille === 'moskvich_chrome') {
    addFrontRect(fY0 + 0.008, fY1 - 0.008, -0.21, 0.21, [218, 226, 238], { layer: -0.014, gloss: 'chrome' });
    addFrontRect(fY0 + 0.018, fY1 - 0.018, -0.19, 0.19, [22, 26, 32], { layer: -0.016 });
    for (let gz = -0.14; gz <= 0.14; gz += 0.045) {
      addFrontRect(fY0 + 0.02, fY1 - 0.02, gz - 0.006, gz + 0.006, [224, 232, 244], { layer: -0.018, gloss: 'chrome' });
    }
  } else if (bp.grille === 'tavria_slat') {
    addFrontRect(fY0 + 0.012, fY1 - 0.014, -0.18, 0.18, [22, 24, 28], { layer: -0.015 });
    addFrontRect((fY0 + fY1) * 0.5 - 0.006, (fY0 + fY1) * 0.5 + 0.006, -0.17, 0.17, [74, 80, 90], { layer: -0.017 });
  } else {
    const gw = bp.grille === 'curved_2110' ? 0.155 : 0.175;
    addFrontRect(fY0 + 0.01, fY1 - 0.015, -gw, gw, [22, 25, 30], { layer: -0.015 });
    addFrontRect((fY0 + fY1) * 0.5 - 0.005, (fY0 + fY1) * 0.5 + 0.006, -gw + 0.01, gw - 0.01, [168, 176, 186], { layer: -0.017 });
  }

  // Lada / VAZ / Brand Emblem badge
  addFrontCircle((fY0 + fY1) * 0.5, 0, bp.grille === 'vesta_x' ? 0.024 : 0.019, [232, 238, 246], { layer: -0.023, gloss: 'chrome' });

  // --- CRYSTAL HEADLAMPS ---
  const hlTop = fY1 - 0.01;
  const hlBot = fY0 + 0.012;
  const midHY = (hlBot + hlTop) * 0.5;
  const sideEdge = fwB - 0.036;
  if (bp.headlights === 'quad_round') {
    for (const sZ of [-1, 1]) {
      for (const zOff of [0.20, 0.295]) {
        const zC = sZ * zOff;
        addFrontCircle(midHY, zC, 0.037, [222, 230, 238], { layer: -0.017, gloss: 'chrome' });
        addFrontCircle(midHY, zC, 0.029, hlCol, { layer: -0.020, unlit: hlGlow, gloss: 'glass' });
      }
    }
  } else if (bp.headlights === 'round_single' || bp.headlights === 'round_eyebrow' || bp.headlights === 'round_twin') {
    for (const sZ of [-1, 1]) {
      const zC = sZ * (fwB - 0.102);
      addFrontCircle(midHY, zC, 0.046, [218, 226, 234], { layer: -0.017, gloss: 'chrome' });
      addFrontCircle(midHY, zC, 0.036, hlCol, { layer: -0.020, unlit: hlGlow, gloss: 'glass' });
      if (bp.headlights === 'round_eyebrow') {
        addFrontRect(hlTop + 0.008, hlTop + 0.032, zC - 0.052, zC + 0.052, [245, 158, 11], { layer: -0.021, unlit: hlGlow });
      } else if (bp.isVan || bp.headlights === 'round_single') {
        addFrontCircle(hlBot - 0.014, zC, 0.015, [245, 145, 22], { layer: -0.021, unlit: hlGlow });
      }
    }
  } else if (bp.headlights === 'vesta_led' || bp.headlights === 'swept_modern' || bp.headlights === 'samara2' || bp.headlights === 'muscular_led') {
    const hlIn = bp.headlights === 'muscular_led' ? 0.22 : 0.18;
    for (const sZ of [-1, 1]) {
      const zA = sZ < 0 ? -sideEdge : hlIn;
      const zB = sZ < 0 ? -hlIn : sideEdge;
      // Dark inner housing + bright projector lens + LED DRL brow
      addFrontRect(hlBot, hlTop, zA, zB, [22, 26, 32], { layer: -0.017 });
      if (bp.headlights === 'muscular_led') {
        addFrontCircle(midHY, (zA + zB) * 0.5 - 0.03, 0.022, [240, 248, 255], { layer: -0.020, unlit: hlGlow, gloss: 'glass' });
        addFrontCircle(midHY, (zA + zB) * 0.5 + 0.03, 0.022, [240, 248, 255], { layer: -0.020, unlit: hlGlow, gloss: 'glass' });
      } else {
        addFrontRect(hlBot + 0.006, hlTop - 0.006, zA + 0.012, zB - 0.012, hlCol, { layer: -0.019, unlit: hlGlow, gloss: 'glass' });
      }
      if (bp.headlights === 'vesta_led' || bp.headlights === 'muscular_led') {
        addFrontRect(hlBot + 0.003, hlBot + 0.013, zA + 0.006, zB - 0.006, [238, 248, 255], { layer: -0.021, unlit: true });
      }
      const cA = sZ < 0 ? -sideEdge : sideEdge - 0.03;
      const cB = sZ < 0 ? -sideEdge + 0.03 : sideEdge;
      addFrontRect(hlBot + 0.006, hlTop - 0.006, cA, cB, [245, 145, 22], { layer: -0.021, unlit: hlGlow });
    }
  } else {
    const hlIn = bp.grille === 'volga_teeth' ? 0.225 : bp.grille === 'chrome_bar_2101' ? 0.235 : 0.18;
    for (const sZ of [-1, 1]) {
      const zA = sZ < 0 ? -sideEdge : hlIn;
      const zB = sZ < 0 ? -hlIn : sideEdge;
      const cA = sZ < 0 ? -sideEdge : sideEdge - 0.034;
      const cB = sZ < 0 ? -sideEdge + 0.034 : sideEdge;
      addFrontRect(hlBot, hlTop, zA, zB, hlCol, { layer: -0.018, unlit: hlGlow, gloss: 'glass' });
      addFrontRect(hlBot, hlTop, cA, cB, [245, 145, 22], { layer: -0.020, unlit: hlGlow });
    }
  }

  if (bp.fogLights) {
    for (const sZ of [-0.26, 0.26]) {
      addFrontCircle(bp.ground + 0.055, sZ, 0.025, hlGlow ? [254, 240, 138] : [135, 145, 155], {
        layer: -0.021,
        unlit: hlGlow,
      });
    }
  }

  // Front License Plate
  addFrontRect(bp.ground + 0.028, bp.ground + 0.082, -0.095, 0.095, [240, 244, 248], { layer: -0.022 });
  addFrontRect(bp.ground + 0.032, bp.ground + 0.078, 0.062, 0.091, [37, 99, 235], { layer: -0.023 });

  // --- REAR FASCIA: TAILLIGHTS, EMBLEM & LICENSE PLATE ---
  const rY0 = bTop + 0.025;
  const rY1 = bp.isVan ? bp.beltY - 0.02 : bp.rearDeckY - 0.02;
  const tlRed = [235, 36, 44];
  const tlAmb = [245, 140, 20];
  const tlWht = [236, 242, 248];

  if (bp.taillights === 'strip_2112' || bp.taillights === 'strip_2110' || bp.taillights === 'samara2') {
    addRearRect(rY0 + 0.01, rY1 - 0.01, -rwB + 0.04, rwB - 0.04, [155, 22, 28], { layer: -0.014 });
    for (const sZ of [-1, 1]) {
      const zA = sZ < 0 ? -rwB + 0.04 : 0.15;
      const zB = sZ < 0 ? -0.15 : rwB - 0.04;
      addRearRect(rY0 + 0.015, rY1 - 0.015, zA, zB, tlRed, { layer: -0.017, unlit: true });
      addRearRect(rY0 + 0.015, rY0 + 0.038, sZ * 0.21 - 0.035, sZ * 0.21 + 0.035, tlAmb, { layer: -0.019, unlit: true });
    }
    addRearRect(rY0 + 0.018, rY1 - 0.018, -0.08, 0.08, tlWht, { layer: -0.018 });
  } else if (
    bp.taillights === 'largus_tall' ||
    bp.taillights === 'wagon_2111' ||
    bp.taillights === 'wagon_2102' ||
    bp.taillights === 'wagon_2104'
  ) {
    for (const sZ of [-1, 1]) {
      const zA = sZ < 0 ? -rwB + 0.03 : rwB - 0.095;
      const zB = sZ < 0 ? -rwB + 0.095 : rwB - 0.03;
      addRearRect(rY0 + 0.01, bp.beltY + 0.12, zA, zB, tlRed, { layer: -0.017, unlit: true });
      addRearRect(bp.beltY + 0.02, bp.beltY + 0.07, zA, zB, tlAmb, { layer: -0.019, unlit: true });
    }
  } else if (bp.taillights === 'uaz_van') {
    for (const sZ of [-1, 1]) {
      addRearCircle(rY0 + 0.05, sZ * (rwB - 0.08), 0.028, tlRed, { layer: -0.018, unlit: true });
      addRearCircle(rY0 + 0.11, sZ * (rwB - 0.08), 0.02, tlAmb, { layer: -0.018, unlit: true });
    }
  } else {
    for (const sZ of [-1, 1]) {
      const zOut = sZ * (rwB - 0.035);
      const zIn = sZ * (rwB - 0.185);
      const zA = Math.min(zOut, zIn);
      const zB = Math.max(zOut, zIn);
      addRearRect(rY0 + 0.01, rY1 - 0.01, zA, zB, tlRed, { layer: -0.017, unlit: true });
      addRearRect(rY0 + 0.015, rY0 + 0.04, zA + 0.01, zA + 0.052, tlAmb, { layer: -0.019, unlit: true });
      addRearRect(rY0 + 0.015, rY0 + 0.04, zB - 0.042, zB - 0.01, tlWht, { layer: -0.019 });
    }
  }

  // Rear Lada chrome badge
  addRearCircle(rY1 + 0.015, 0, 0.014, [228, 236, 246], { layer: -0.022 });

  // Rear License Plate
  addRearRect(bp.ground + 0.038, bp.ground + 0.092, -0.095, 0.095, [240, 244, 248], { layer: -0.022 });
  addRearRect(bp.ground + 0.042, bp.ground + 0.088, 0.062, 0.091, [37, 99, 235], { layer: -0.023 });

  return { staticPolys, glassPanes, bp };
}

function getCachedCarMesh(carId, paintRgb, headlights) {
  const key = `${carId}|${paintRgb[0]},${paintRgb[1]},${paintRgb[2]}|${headlights ? 1 : 0}`;
  let mesh = carMeshCache.get(key);
  if (mesh) return mesh;
  mesh = buildCarMesh(carId, paintRgb, headlights);
  if (carMeshCache.size >= 36) {
    const firstKey = carMeshCache.keys().next().value;
    if (firstKey !== undefined) carMeshCache.delete(firstKey);
  }
  carMeshCache.set(key, mesh);
  return mesh;
}

export function renderCarShowcase3D(
  canvas,
  car,
  paintHex,
  angle = -0.62,
  zoom = 1.0,
  headlights = true,
  pitch = 0.24,
  options = {}
) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  if (!W || !H) return;

  const { transparent = false, hideLabel = false, groundShadow = false } = options || {};
  const carId = (car && car.id) || 'vaz2112';
  const paintRgb = hexToRgb((paintHex || (car && car.defaultColor)) || '#6f7882');
  const mesh = getCachedCarMesh(carId, paintRgb, headlights);

  if (transparent) {
    ctx.clearRect(0, 0, W, H);
  } else {
    const cachedBg = getCachedBackdrop(W, H);
    if (cachedBg) {
      ctx.drawImage(cachedBg, 0, 0);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  }

  const cosY = Math.cos(angle);
  const sinY = Math.sin(angle);
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  const camDist = 3.55 / Math.max(0.65, zoom);
  const focal = Math.min(W, H) * 1.48;
  const halfW = W * 0.5;
  const baseH = H * 0.59;
  const targetY = 0.36;

  if (groundShadow) {
    ctx.save();
    const shY = baseH + targetY * focal / camDist * 0.92;
    const shRx = Math.max(18, Math.min(W * 0.45, (focal / camDist) * (0.76 + 0.42 * Math.abs(sinY))));
    const shRy = Math.max(5, Math.min(H * 0.16, (focal / camDist) * (0.14 + 0.12 * Math.abs(sinP))));
    const shG = ctx.createRadialGradient(halfW, shY, shRx * 0.12, halfW, shY, shRx);
    shG.addColorStop(0, 'rgba(0,0,0,0.68)');
    shG.addColorStop(0.65, 'rgba(0,0,0,0.34)');
    shG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.translate(halfW, shY);
    ctx.scale(1, shRy / Math.max(1, shRx));
    ctx.fillStyle = shG;
    ctx.beginPath();
    ctx.arc(0, 0, shRx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Camera view & Blinn-Phong half-vector in local car space
  const vcx = -sinY * cosP;
  const vcy = sinP + 0.14;
  const vcz = -cosY * cosP;
  const vcl = Math.hypot(vcx, vcy, vcz) || 1;
  const hvx0 = LIGHT_DIR[0] + vcx / vcl;
  const hvy0 = LIGHT_DIR[1] + vcy / vcl;
  const hvz0 = LIGHT_DIR[2] + vcz / vcl;
  const hvl = Math.hypot(hvx0, hvy0, hvz0) || 1;
  const hvx = hvx0 / hvl;
  const hvy = hvy0 / hvl;
  const hvz = hvz0 / hvl;

  drawQueue.length = 0;

  const staticPolys = mesh.staticPolys;
  for (let pi = 0; pi < staticPolys.length; pi++) {
    const p = staticPolys[pi];

    // Transform normal & center first so culled faces skip ALL vertex projection
    const nrx = p.nx * cosY - p.nz * sinY;
    const nrz0 = p.nx * sinY + p.nz * cosY;
    const nry = p.ny * cosP + nrz0 * sinP;
    const nrz = -p.ny * sinP + nrz0 * cosP;

    const acx = p.avgX * cosY - p.avgZ * sinY;
    const acz0 = p.avgX * sinY + p.avgZ * cosY;
    const acy0 = p.avgY - targetY;
    const acy = acy0 * cosP + acz0 * sinP;
    const acz = camDist + (-acy0 * sinP + acz0 * cosP);
    const invCenterD = 1 / (Math.hypot(acx, acy, acz) || 1);
    const ndotc = -(nrx * acx + nry * acy + nrz * acz) * invCenterD;

    if (!p.doubleSided && ndotc <= -0.025) continue;

    const pts = p.pts;
    const nVerts = pts.length;
    const sx = new Array(nVerts);
    const sy = new Array(nVerts);
    let depthSum = 0;
    for (let vi = 0; vi < nVerts; vi++) {
      const pt = pts[vi];
      const rx = pt[0] * cosY - pt[2] * sinY;
      const rz = pt[0] * sinY + pt[2] * cosY;
      const cy = pt[1] - targetY;
      const ry = cy * cosP + rz * sinP;
      const depth = Math.max(0.25, camDist + (-cy * sinP + rz * cosP));
      const invZ = focal / depth;
      sx[vi] = halfW + rx * invZ;
      sy[vi] = baseH - ry * invZ;
      depthSum += depth;
    }

    let fill = p.constFill;
    if (fill === null && !p.constFill && p.gloss) {
      const fresRaw = 1 - Math.max(0, ndotc);
      const fres = fresRaw * fresRaw * fresRaw;
      const spec =
        fastPowSpec(p.nx * hvx + p.ny * hvy + p.nz * hvz, p.gloss) +
        fres * (p.gloss === 'paint' ? 18 : 26);
      fill = rgbStr(p.rgb, p.shade, spec, p.alpha);
    }

    drawQueue.push({
      sx,
      sy,
      sortZ: depthSum / nVerts + p.layer,
      fill,
      stroke: p.stroke,
      lineW: p.zoomLineW ? Math.max(p.lineW * 0.66, p.lineW * zoom) : p.lineW,
      openPath: p.openPath,
    });
  }

  // Dynamic camera-reactive specular reflection ribbons on visible glass panes
  const glassPanes = mesh.glassPanes;
  for (let gi = 0; gi < glassPanes.length; gi++) {
    const gp = glassPanes[gi];
    const nrx = gp.nx * cosY - gp.nz * sinY;
    const nrz0 = gp.nx * sinY + gp.nz * cosY;
    const nry = gp.ny * cosP + nrz0 * sinP;
    const nrz = -gp.ny * sinP + nrz0 * cosP;

    const acx = gp.cx * cosY - gp.cz * sinY;
    const acz0 = gp.cx * sinY + gp.cz * cosY;
    const acy0 = gp.cy - targetY;
    const acy = acy0 * cosP + acz0 * sinP;
    const acz = camDist + (-acy0 * sinP + acz0 * cosP);
    if (-(nrx * acx + nry * acy + nrz * acz) <= -0.025 * (Math.hypot(acx, acy, acz) || 1)) continue;

    const { pBL, pBR, pTR, pTL, phase, baseLayer } = gp;
    const shift = Math.max(-0.22, Math.min(0.22, 0.19 * Math.sin(angle * 1.25 + phase) + 0.08 * Math.cos(pitch * 1.8)));
    const u0 = Math.max(0.04, Math.min(0.62, 0.24 + shift));
    const u1 = Math.min(0.95, u0 + 0.21);
    const ut0 = Math.max(0.06, Math.min(0.74, u0 + 0.14));
    const ut1 = Math.min(0.96, ut0 + 0.22);

    const pushDynRibbon = (ru0, ru1, rut0, rut1, v0, v1, fillStr, layerOff) => {
      const q0x = pBL[0] + (pBR[0] - pBL[0]) * ru0, q0y = pBL[1] + (pBR[1] - pBL[1]) * ru0, q0z = pBL[2] + (pBR[2] - pBL[2]) * ru0;
      const q1x = pBL[0] + (pBR[0] - pBL[0]) * ru1, q1y = pBL[1] + (pBR[1] - pBL[1]) * ru1, q1z = pBL[2] + (pBR[2] - pBL[2]) * ru1;
      const t0x = pTL[0] + (pTR[0] - pTL[0]) * rut0, t0y = pTL[1] + (pTR[1] - pTL[1]) * rut0, t0z = pTL[2] + (pTR[2] - pTL[2]) * rut0;
      const t1x = pTL[0] + (pTR[0] - pTL[0]) * rut1, t1y = pTL[1] + (pTR[1] - pTL[1]) * rut1, t1z = pTL[2] + (pTR[2] - pTL[2]) * rut1;

      const rPts = [
        [q0x + (t0x - q0x) * v0, q0y + (t0y - q0y) * v0, q0z + (t0z - q0z) * v0],
        [q1x + (t1x - q1x) * v0, q1y + (t1y - q1y) * v0, q1z + (t1z - q1z) * v0],
        [q1x + (t1x - q1x) * v1, q1y + (t1y - q1y) * v1, q1z + (t1z - q1z) * v1],
        [q0x + (t0x - q0x) * v1, q0y + (t0y - q0y) * v1, q0z + (t0z - q0z) * v1],
      ];
      const sx = new Array(4);
      const sy = new Array(4);
      let dSum = 0;
      for (let vi = 0; vi < 4; vi++) {
        const pt = rPts[vi];
        const rx = pt[0] * cosY - pt[2] * sinY;
        const rz = pt[0] * sinY + pt[2] * cosY;
        const cy = pt[1] - targetY;
        const ry = cy * cosP + rz * sinP;
        const depth = Math.max(0.25, camDist + (-cy * sinP + rz * cosP));
        const invZ = focal / depth;
        sx[vi] = halfW + rx * invZ;
        sy[vi] = baseH - ry * invZ;
        dSum += depth;
      }
      drawQueue.push({
        sx,
        sy,
        sortZ: dSum * 0.25 + baseLayer + layerOff,
        fill: fillStr,
        stroke: null,
        lineW: 0,
        openPath: false,
      });
    };

    pushDynRibbon(u0, u1, ut0, ut1, 0.05, 0.94, 'rgba(234,246,255,0.23)', -0.0018);
    const s0 = Math.max(0.04, Math.min(0.84, u1 + 0.06));
    const s1 = Math.min(0.96, s0 + 0.08);
    const st0 = Math.max(0.06, Math.min(0.86, ut1 + 0.05));
    const st1 = Math.min(0.97, st0 + 0.08);
    if (s1 > s0 + 0.02 && st1 > st0 + 0.02) {
      pushDynRibbon(s0, s1, st0, st1, 0.06, 0.93, 'rgba(255,224,168,0.14)', -0.0021);
    }
  }

  // --- PAINTER'S SORT & RENDER ---
  drawQueue.sort((a, b) => b.sortZ - a.sortZ);
  for (let i = 0; i < drawQueue.length; i++) {
    const poly = drawQueue[i];
    const sx = poly.sx;
    const sy = poly.sy;
    ctx.beginPath();
    ctx.moveTo(sx[0], sy[0]);
    for (let j = 1; j < sx.length; j++) {
      ctx.lineTo(sx[j], sy[j]);
    }
    if (!poly.openPath) ctx.closePath();
    if (poly.fill) {
      ctx.fillStyle = poly.fill;
      ctx.fill();
    }
    if (poly.stroke) {
      ctx.strokeStyle = poly.stroke;
      ctx.lineWidth = poly.lineW;
      ctx.stroke();
    }
  }

  if (!hideLabel) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(mesh.bp.plate, 14, H - 12);
    ctx.textAlign = 'right';
    ctx.fillText('360° 3D', W - 14, H - 12);
  }
}

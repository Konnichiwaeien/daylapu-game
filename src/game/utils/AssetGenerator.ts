import * as Phaser from 'phaser';
import { COLORS, PLAYER, ANIMAL, COIN, TILE_SIZE, ENEMY } from '@/lib/constants';

// Единая насыщенная палитра — яркие, контрастные цвета в стиле классики
const P = {
  // Кожа
  skin: 0xf5c8a0,
  skinLight: 0xfdd8b4,
  skinShade: 0xd4a878,
  // Волосы
  hair: 0xf0d060,
  hairDark: 0xc8a838,
  hairLight: 0xffe888,
  // Одежда героини
  jacket: 0x33aa55,
  jacketLight: 0x44cc66,
  jacketDark: 0x228833,
  jacketDeep: 0x116622,
  jeans: 0x2244aa,
  jeansDark: 0x1a3388,
  jeansLight: 0x3355bb,
  boots: 0x442211,
  bootsLight: 0x553322,
  // Враг
  uniform: 0x5566aa,
  uniformDark: 0x445588,
  uniformLight: 0x6677bb,
  capDark: 0x2a2a44,
  capVisor: 0x1a1a33,
  // Здания
  wall: 0xc8b89a,
  wallLight: 0xd8c8aa,
  wallDark: 0xaa9878,
  wallDeep: 0x887766,
  windowLit: 0xffdd55,
  windowLitLight: 0xffee88,
  windowDark: 0x334466,
  windowFrame: 0x888877,
  roof: 0x6b5544,
  roofLight: 0x7a6655,
  // Дорога и тротуар
  sidewalk: 0xbbaa99,
  sidewalkLight: 0xccbbaa,
  sidewalkJoint: 0x998877,
  asphalt: 0x444444,
  asphaltLight: 0x555555,
  curb: 0xaaaaaa,
  curbShade: 0x888888,
  road: 0x3a3a3a,
  roadLine: 0xdddd44,
  // Природа
  leaf: 0x44aa44,
  leafDark: 0x338833,
  leafLight: 0x55cc55,
  leafDeep: 0x226622,
  trunk: 0x664422,
  trunkDark: 0x553311,
  trunkLight: 0x775533,
  // Объекты
  metal: 0x888899,
  metalDark: 0x666677,
  metalLight: 0xaaaabb,
  red: 0xdd3333,
  redDark: 0xaa2222,
  redLight: 0xff5555,
  yellow: 0xffcc22,
  gold: 0xdda844,
  // Общее
  outline: 0x222222,
  shadow: 0x000000,
} as const;

function gfx(scene: Phaser.Scene) {
  return scene.make.graphics({ x: 0, y: 0 }, false);
}

export function generatePlaceholderAssets(scene: Phaser.Scene) {
  generateCharacters(scene);
  generateTerrain(scene);
  generateObstacles(scene);
  generateCollectibles(scene);
  generateBackgrounds(scene);
  generateDecorations(scene);
  generateEnemies(scene);
}

// ===== ИГРОК 48x64, 8 кадров =====
// Пропорции: голова y=3-23, шея y=22-25, тело y=25-44, ноги y=44-58, ботинки y=56-63
function generateCharacters(scene: Phaser.Scene) {
  const FW = PLAYER.width;
  const FH = PLAYER.height;
  const FRAMES = 8;
  const g = gfx(scene);

  for (let frame = 0; frame < FRAMES; frame++) {
    const ox = frame * FW;
    const cx = ox + FW / 2;

    let legL = 0, legR = 0, armL = 0, armR = 0;
    if (frame >= 1 && frame <= 6) {
      const phase = ((frame - 1) / 6) * Math.PI * 2;
      legL = Math.sin(phase) * 6;
      legR = Math.sin(phase + Math.PI) * 6;
      armL = Math.sin(phase + Math.PI) * 5;
      armR = Math.sin(phase) * 5;
    }
    const isJump = frame === 7;

    // --- Тень на земле ---
    g.fillStyle(P.shadow, 0.12);
    g.fillEllipse(cx, FH - 2, 26, 5);

    // --- БОТИНКИ (y=56-63) ---
    const bootY = isJump ? 54 : 57;
    const bootLX = cx - 11 + (isJump ? 2 : legL);
    const bootRX = cx + 3 + (isJump ? -2 : legR);
    g.fillStyle(P.boots);
    g.fillRoundedRect(bootLX, bootY, 10, 6, 2);
    g.fillRoundedRect(bootRX, bootY, 10, 6, 2);
    g.fillStyle(P.bootsLight);
    g.fillRect(bootLX + 1, bootY + 4, 9, 2);
    g.fillRect(bootRX + 1, bootY + 4, 9, 2);

    // --- НОГИ / джинсы (y=44-58) ---
    const legY = isJump ? 42 : 44;
    const legH = isJump ? 14 : 15;
    g.fillStyle(P.jeans);
    g.fillRoundedRect(cx - 11 + (isJump ? 2 : legL), legY, 10, legH, 2);
    g.fillRoundedRect(cx + 1 + (isJump ? -2 : legR), legY, 10, legH, 2);
    g.fillStyle(P.jeansDark, 0.3);
    if (!isJump) {
      g.fillRect(cx - 7 + legL, legY + 2, 2, legH - 2);
      g.fillRect(cx + 5 + legR, legY + 2, 2, legH - 2);
    }

    // --- ТЕЛО / куртка (y=25-44) ---
    g.fillStyle(P.jacket);
    g.fillRoundedRect(cx - 14, 25, 28, 20, 4);
    g.fillStyle(P.jacketDark);
    g.fillRoundedRect(cx - 14, 25, 6, 20, 2);
    g.fillStyle(P.jacketLight, 0.4);
    g.fillRoundedRect(cx + 4, 25, 8, 18, 3);
    // Воротник
    g.fillStyle(P.jacketLight);
    g.fillRoundedRect(cx - 7, 24, 14, 4, 2);
    // Молния
    g.lineStyle(1.5, P.jacketDeep, 0.6);
    g.lineBetween(cx, 28, cx, 44);
    // Карманы
    g.fillStyle(P.jacketDark, 0.5);
    g.fillRoundedRect(cx - 12, 36, 9, 5, 1);
    g.fillRoundedRect(cx + 3, 36, 9, 5, 1);

    // --- БЕЙДЖ-ЛАПКА ---
    g.fillStyle(P.gold);
    g.fillRoundedRect(cx - 11, 30, 8, 6, 2);
    g.fillStyle(P.boots);
    g.fillCircle(cx - 7, 34, 1.8);
    g.fillCircle(cx - 10, 31, 1);
    g.fillCircle(cx - 7, 30, 1);
    g.fillCircle(cx - 4, 31, 1);

    // --- РУКАВА + РУКИ ---
    const armY = isJump ? 18 : 27;
    const armH = isJump ? 14 : 16;
    g.fillStyle(P.jacket);
    g.fillRoundedRect(cx - 19, armY + armL, 8, armH, 3);
    g.fillRoundedRect(cx + 11, armY + armR, 8, armH, 3);
    g.fillStyle(P.jacketDark, 0.3);
    g.fillRect(cx - 18, armY + armL + 2, 3, armH - 4);
    g.fillRect(cx + 15, armY + armR + 2, 3, armH - 4);
    // Кисти
    g.fillStyle(P.skin);
    const handY = isJump ? 16 : 42;
    g.fillCircle(cx - 15, handY + armL, 3.5);
    g.fillCircle(cx + 15, handY + armR, 3.5);

    // --- ШЕЯ (y=22-25) ---
    g.fillStyle(P.skin);
    g.fillRect(cx - 4, 20, 8, 6);

    // --- ГОЛОВА (центр y=13, радиус 10 → y=3-23) ---
    g.fillStyle(P.skin);
    g.fillCircle(cx, 13, 10);
    g.fillStyle(P.skinShade, 0.15);
    g.fillCircle(cx - 5, 16, 4);

    // --- ВОЛОСЫ ---
    g.fillStyle(P.hair);
    g.fillRoundedRect(cx - 11, 2, 22, 10, 5);
    g.fillRect(cx - 10, 6, 20, 5);
    g.fillStyle(P.hairDark);
    g.fillRoundedRect(cx - 12, 5, 5, 11, 3);
    g.fillRoundedRect(cx + 7, 5, 5, 11, 3);
    g.fillStyle(P.hairLight, 0.5);
    g.fillRoundedRect(cx - 4, 2, 10, 5, 3);

    // --- ГЛАЗА ---
    g.fillStyle(0xffffff);
    g.fillCircle(cx - 4, 12, 3);
    g.fillCircle(cx + 4, 12, 3);
    g.fillStyle(0x2266bb);
    g.fillCircle(cx - 4, 12, 2);
    g.fillCircle(cx + 4, 12, 2);
    g.fillStyle(P.outline);
    g.fillCircle(cx - 4, 12, 1);
    g.fillCircle(cx + 4, 12, 1);
    g.fillStyle(0xffffff, 0.9);
    g.fillCircle(cx - 5, 11, 0.8);
    g.fillCircle(cx + 3, 11, 0.8);

    // --- БРОВИ ---
    g.lineStyle(1.5, P.hairDark);
    g.lineBetween(cx - 7, 8, cx - 2, 9);
    g.lineBetween(cx + 2, 9, cx + 7, 8);

    // --- НОС ---
    g.fillStyle(P.skinShade, 0.5);
    g.fillCircle(cx, 15, 1.2);

    // --- УЛЫБКА ---
    g.lineStyle(1.2, 0xcc6655);
    g.beginPath();
    g.arc(cx, 17, 3, 0.3, Math.PI - 0.3, false);
    g.strokePath();

    // --- Контур ---
    g.lineStyle(1.5, P.outline, 0.15);
    g.strokeCircle(cx, 13, 10.5);
    g.strokeRoundedRect(cx - 14.5, 24.5, 29, 21, 4);
  }

  g.generateTexture('player_sheet', FW * FRAMES, FH);
  g.destroy();

  const tex = scene.textures.get('player_sheet');
  tex.add('__BASE', 0, 0, 0, FW * FRAMES, FH);
  for (let i = 0; i < FRAMES; i++) {
    tex.add(i, 0, i * FW, 0, FW, FH);
  }

  // ===== ИГРОК 2: Дмитрий — тёмные волосы, плащ =====
  const g2 = gfx(scene);

  // Палитра Дмитрия
  const D = {
    hair: 0x2a1a0a,
    hairDark: 0x1a0e05,
    hairLight: 0x3d2a15,
    coat: 0x222233,
    coatLight: 0x333344,
    coatDark: 0x111122,
    coatDeep: 0x0a0a18,
    shirt: 0x446688,
    shirtLight: 0x5577aa,
    pants: 0x1a1a2a,
    pantsDark: 0x101020,
  };

  for (let frame = 0; frame < FRAMES; frame++) {
    const ox = frame * FW;
    const cx = ox + FW / 2;

    let legL = 0, legR = 0, armL = 0, armR = 0;
    if (frame >= 1 && frame <= 6) {
      const phase = ((frame - 1) / 6) * Math.PI * 2;
      legL = Math.sin(phase) * 6;
      legR = Math.sin(phase + Math.PI) * 6;
      armL = Math.sin(phase + Math.PI) * 5;
      armR = Math.sin(phase) * 5;
    }
    const isJump = frame === 7;

    // Тень
    g2.fillStyle(P.shadow, 0.12);
    g2.fillEllipse(cx, FH - 2, 26, 5);

    // Ботинки — тёмные
    const bootY = isJump ? 54 : 57;
    const bootLX = cx - 11 + (isJump ? 2 : legL);
    const bootRX = cx + 3 + (isJump ? -2 : legR);
    g2.fillStyle(0x111111);
    g2.fillRoundedRect(bootLX, bootY, 10, 6, 2);
    g2.fillRoundedRect(bootRX, bootY, 10, 6, 2);
    g2.fillStyle(0x222222);
    g2.fillRect(bootLX + 1, bootY + 4, 9, 2);
    g2.fillRect(bootRX + 1, bootY + 4, 9, 2);

    // Ноги — тёмные брюки
    const legY = isJump ? 42 : 44;
    const legH = isJump ? 14 : 15;
    g2.fillStyle(D.pants);
    g2.fillRoundedRect(cx - 11 + (isJump ? 2 : legL), legY, 10, legH, 2);
    g2.fillRoundedRect(cx + 1 + (isJump ? -2 : legR), legY, 10, legH, 2);
    g2.fillStyle(D.pantsDark, 0.3);
    if (!isJump) {
      g2.fillRect(cx - 7 + legL, legY + 2, 2, legH - 2);
      g2.fillRect(cx + 5 + legR, legY + 2, 2, legH - 2);
    }

    // Тело — плащ (длиннее куртки, спускается ниже)
    g2.fillStyle(D.coat);
    g2.fillRoundedRect(cx - 15, 24, 30, 24, 4);
    g2.fillStyle(D.coatDark);
    g2.fillRoundedRect(cx - 15, 24, 6, 24, 2);
    g2.fillStyle(D.coatLight, 0.4);
    g2.fillRoundedRect(cx + 5, 24, 8, 22, 3);
    // Воротник — высокий, как у плаща
    g2.fillStyle(D.coatLight);
    g2.fillRoundedRect(cx - 8, 22, 16, 5, 2);
    // Рубашка видна в вырезе
    g2.fillStyle(D.shirt);
    g2.fillRoundedRect(cx - 5, 26, 10, 6, 1);
    // Молния плаща
    g2.lineStyle(1.5, D.coatDeep, 0.6);
    g2.lineBetween(cx, 32, cx, 48);

    // Карманы
    g2.fillStyle(D.coatDark, 0.5);
    g2.fillRoundedRect(cx - 13, 38, 9, 5, 1);
    g2.fillRoundedRect(cx + 4, 38, 9, 5, 1);

    // Рукава плаща + руки
    const armY = isJump ? 18 : 27;
    const armH = isJump ? 14 : 18; // Длиннее — плащ
    g2.fillStyle(D.coat);
    g2.fillRoundedRect(cx - 19, armY + armL, 8, armH, 3);
    g2.fillRoundedRect(cx + 11, armY + armR, 8, armH, 3);
    g2.fillStyle(D.coatDark, 0.3);
    g2.fillRect(cx - 18, armY + armL + 2, 3, armH - 4);
    g2.fillRect(cx + 15, armY + armR + 2, 3, armH - 4);
    // Кисти
    g2.fillStyle(P.skin);
    const handY = isJump ? 16 : 44;
    g2.fillCircle(cx - 15, handY + armL, 3.5);
    g2.fillCircle(cx + 15, handY + armR, 3.5);

    // Шея
    g2.fillStyle(P.skin);
    g2.fillRect(cx - 4, 20, 8, 5);

    // Голова
    g2.fillStyle(P.skin);
    g2.fillCircle(cx, 13, 10);
    g2.fillStyle(P.skinShade, 0.15);
    g2.fillCircle(cx - 5, 16, 4);

    // Волосы — тёмные, зачёсанные
    g2.fillStyle(D.hair);
    g2.fillRoundedRect(cx - 11, 2, 22, 11, 5);
    g2.fillRect(cx - 10, 6, 20, 6);
    g2.fillStyle(D.hairDark);
    g2.fillRoundedRect(cx - 12, 4, 5, 12, 3);
    g2.fillRoundedRect(cx + 7, 4, 5, 12, 3);
    g2.fillStyle(D.hairLight, 0.3);
    g2.fillRoundedRect(cx - 3, 2, 8, 5, 3);

    // Глаза — карие
    g2.fillStyle(0xffffff);
    g2.fillCircle(cx - 4, 12, 3);
    g2.fillCircle(cx + 4, 12, 3);
    g2.fillStyle(0x553311);
    g2.fillCircle(cx - 4, 12, 2);
    g2.fillCircle(cx + 4, 12, 2);
    g2.fillStyle(P.outline);
    g2.fillCircle(cx - 4, 12, 1);
    g2.fillCircle(cx + 4, 12, 1);
    g2.fillStyle(0xffffff, 0.9);
    g2.fillCircle(cx - 5, 11, 0.8);
    g2.fillCircle(cx + 3, 11, 0.8);

    // Брови — тёмные, серьёзные
    g2.lineStyle(1.8, D.hairDark);
    g2.lineBetween(cx - 7, 8, cx - 2, 9);
    g2.lineBetween(cx + 2, 9, cx + 7, 8);

    // Нос
    g2.fillStyle(P.skinShade, 0.5);
    g2.fillCircle(cx, 15, 1.2);

    // Лёгкая ухмылка
    g2.lineStyle(1.2, 0xcc8866);
    g2.beginPath();
    g2.arc(cx + 1, 17, 2.5, 0.2, Math.PI - 0.5, false);
    g2.strokePath();

    // Контур
    g2.lineStyle(1.5, P.outline, 0.15);
    g2.strokeCircle(cx, 13, 10.5);
    g2.strokeRoundedRect(cx - 15.5, 23.5, 31, 25, 4);
  }

  g2.generateTexture('player2_sheet', FW * FRAMES, FH);
  g2.destroy();

  const tex2 = scene.textures.get('player2_sheet');
  tex2.add('__BASE', 0, 0, 0, FW * FRAMES, FH);
  for (let i = 0; i < FRAMES; i++) {
    tex2.add(i, 0, i * FW, 0, FW, FH);
  }

  // ===== Снаряд-код (20x12) =====
  const cp = gfx(scene);
  // Фон — тёмный прямоугольник
  cp.fillStyle(0x1a1a2e, 0.8);
  cp.fillRoundedRect(0, 0, 20, 12, 2);
  // Зелёный текст кода
  cp.fillStyle(0x44ff88);
  cp.fillRect(2, 2, 6, 2);   // первая "строка"
  cp.fillRect(2, 5, 4, 2);   // вторая
  cp.fillRect(9, 2, 3, 2);   // символы
  cp.fillRect(7, 5, 5, 2);
  cp.fillRect(2, 8, 8, 2);   // третья
  cp.fillRect(13, 3, 4, 2);
  cp.fillRect(13, 7, 5, 2);
  // Свечение
  cp.fillStyle(0x44ff88, 0.15);
  cp.fillRoundedRect(-2, -2, 24, 16, 3);
  cp.generateTexture('code_projectile', 20, 12);
  cp.destroy();

  // ===== ЩЕНОК (48x40) =====
  const AW = ANIMAL.width;
  const AH = ANIMAL.height;
  const pup = gfx(scene);
  // Тело
  pup.fillStyle(0xbb8844);
  pup.fillRoundedRect(10, 14, 28, 18, 7);
  // Тёмная спинка
  pup.fillStyle(0xaa7733, 0.4);
  pup.fillRoundedRect(10, 14, 28, 8, 4);
  // Светлое пузико
  pup.fillStyle(0xddbb88, 0.5);
  pup.fillEllipse(24, 28, 16, 10);
  // Голова
  pup.fillStyle(0xcc9955);
  pup.fillCircle(14, 12, 12);
  // Мордочка
  pup.fillStyle(0xddbb88);
  pup.fillCircle(8, 15, 6);
  // Уши висячие
  pup.fillStyle(0x996633);
  pup.fillEllipse(2, 6, 8, 14);
  pup.fillEllipse(26, 6, 8, 14);
  pup.fillStyle(0xddaa77, 0.5);
  pup.fillEllipse(2, 6, 4, 8);
  pup.fillEllipse(26, 6, 4, 8);
  // Глаза
  pup.fillStyle(0xffffff);
  pup.fillCircle(9, 10, 4);
  pup.fillCircle(19, 10, 4);
  pup.fillStyle(0x332211);
  pup.fillCircle(9, 10, 2.5);
  pup.fillCircle(19, 10, 2.5);
  pup.fillStyle(0xffffff, 0.8);
  pup.fillCircle(7.5, 9, 1.2);
  pup.fillCircle(17.5, 9, 1.2);
  // Нос
  pup.fillStyle(0x222211);
  pup.fillRoundedRect(5, 15, 6, 4, 2);
  // Рот
  pup.lineStyle(1, 0x664422, 0.4);
  pup.lineBetween(8, 19, 8, 21);
  pup.lineBetween(8, 21, 5, 22);
  pup.lineBetween(8, 21, 11, 22);
  // Язык
  pup.fillStyle(0xff8888, 0.7);
  pup.fillEllipse(8, 23, 4, 3);
  // Ошейник
  pup.fillStyle(P.red);
  pup.fillRect(4, 20, 18, 3.5);
  pup.fillStyle(P.yellow);
  pup.fillCircle(13, 22, 2.5);
  // Хвост
  pup.lineStyle(4, 0xbb8844);
  pup.lineBetween(37, 15, 44, 9);
  pup.fillStyle(0xbb8844);
  pup.fillCircle(44, 9, 3);
  // Лапы
  pup.fillStyle(0xaa7733);
  pup.fillRoundedRect(14, 30, 7, 8, 3);
  pup.fillRoundedRect(28, 30, 7, 8, 3);
  // Пальчики
  pup.fillStyle(0xcc9955, 0.5);
  pup.fillCircle(15, 37, 1.5);
  pup.fillCircle(19, 37, 1.5);
  pup.fillCircle(29, 37, 1.5);
  pup.fillCircle(33, 37, 1.5);
  pup.generateTexture('puppy', AW, AH);
  pup.destroy();

  // ===== КОТЁНОК (48x40) =====
  const kit = gfx(scene);
  // Тело
  kit.fillStyle(0xee9944);
  kit.fillRoundedRect(10, 15, 26, 16, 6);
  // Полосы
  kit.fillStyle(0xcc7722, 0.35);
  kit.fillRect(14, 16, 3, 14);
  kit.fillRect(21, 16, 3, 14);
  kit.fillRect(28, 16, 3, 14);
  // Голова
  kit.fillStyle(0xffaa55);
  kit.fillCircle(15, 12, 12);
  // Уши треугольные
  kit.fillStyle(0xdd8833);
  kit.fillTriangle(3, 7, 1, -5, 10, 4);
  kit.fillTriangle(20, 7, 29, -5, 21, 4);
  kit.fillStyle(0xeeaaaa, 0.4);
  kit.fillTriangle(4, 5, 3, -2, 9, 4);
  kit.fillTriangle(21, 5, 27, -2, 22, 4);
  // Глаза — зелёные с вертикальным зрачком
  kit.fillStyle(0xffffff);
  kit.fillCircle(9, 10, 4);
  kit.fillCircle(21, 10, 4);
  kit.fillStyle(0x33bb44);
  kit.fillCircle(9, 10, 3);
  kit.fillCircle(21, 10, 3);
  kit.fillStyle(P.outline);
  kit.fillRect(8.3, 7.5, 1.4, 5);
  kit.fillRect(20.3, 7.5, 1.4, 5);
  kit.fillStyle(0xffffff, 0.5);
  kit.fillCircle(7.5, 9, 1);
  kit.fillCircle(19.5, 9, 1);
  // Усы
  kit.lineStyle(1, 0x777777);
  for (let i = 0; i < 3; i++) {
    const wy = 12 + i * 3;
    kit.lineBetween(-2, wy, 7, 15);
    kit.lineBetween(32, wy, 23, 15);
  }
  // Нос
  kit.fillStyle(0xee8888);
  kit.fillTriangle(13, 15, 17, 15, 15, 17);
  // Хвост изогнутый
  kit.lineStyle(4, 0xee9944);
  kit.beginPath();
  kit.arc(40, 10, 9, Math.PI * 0.5, Math.PI * 1.6, false);
  kit.strokePath();
  kit.fillStyle(0xdd8833);
  kit.fillCircle(40, 1, 3);
  // Лапы
  kit.fillStyle(0xdd8833);
  kit.fillRoundedRect(14, 29, 7, 8, 3);
  kit.fillRoundedRect(27, 29, 7, 8, 3);
  kit.generateTexture('kitten', AW, AH);
  kit.destroy();
}

// ===== МЕСТНОСТЬ =====
function generateTerrain(scene: Phaser.Scene) {
  // --- Тротуар с плиточным рисунком ---
  const gnd = gfx(scene);
  gnd.fillStyle(P.sidewalk);
  gnd.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  // Вертикальные швы (плитка)
  gnd.lineStyle(1, P.sidewalkJoint, 0.4);
  gnd.lineBetween(0, 0, 0, TILE_SIZE);
  gnd.lineBetween(TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);
  // Горизонтальный шов
  gnd.lineBetween(0, TILE_SIZE / 2, TILE_SIZE, TILE_SIZE / 2);
  // Бордюр сверху (2-тоновый)
  gnd.fillStyle(P.curb);
  gnd.fillRect(0, 0, TILE_SIZE, 3);
  gnd.fillStyle(P.curbShade);
  gnd.fillRect(0, 3, TILE_SIZE, 1);
  // Текстура — пятнышки и мелкие детали
  gnd.fillStyle(P.sidewalkLight, 0.3);
  gnd.fillCircle(10, 10, 3);
  gnd.fillCircle(25, 22, 2);
  gnd.fillStyle(P.sidewalkJoint, 0.15);
  gnd.fillCircle(18, 28, 4);
  gnd.fillCircle(6, 20, 2);
  gnd.generateTexture('ground', TILE_SIZE, TILE_SIZE);
  gnd.destroy();

  // --- Платформа: бетонный козырёк ---
  const plat = gfx(scene);
  plat.fillStyle(0x888898);
  plat.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  // 3D рёбра
  plat.fillStyle(0xffffff, 0.2);
  plat.fillRect(0, 0, TILE_SIZE, 3);
  plat.fillRect(0, 0, 2, TILE_SIZE);
  plat.fillStyle(0x000000, 0.15);
  plat.fillRect(0, TILE_SIZE - 3, TILE_SIZE, 3);
  plat.fillRect(TILE_SIZE - 2, 0, 2, TILE_SIZE);
  // Трещины / текстура
  plat.lineStyle(0.5, 0x000000, 0.08);
  plat.lineBetween(6, 8, 22, 12);
  plat.lineBetween(14, 20, 28, 18);
  plat.fillStyle(P.wallDark, 0.08);
  plat.fillCircle(12, 15, 5);
  plat.fillCircle(24, 24, 4);
  plat.generateTexture('platform', TILE_SIZE, TILE_SIZE);
  plat.destroy();

  // --- Платформа: металлическая решётка (пожарная лестница) ---
  const metal = gfx(scene);
  metal.fillStyle(0x3a3a4a);
  metal.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  // Решётка
  metal.lineStyle(2, 0x555566, 0.9);
  for (let mx = 4; mx < TILE_SIZE; mx += 6) {
    metal.lineBetween(mx, 0, mx, TILE_SIZE);
  }
  metal.lineStyle(2.5, 0x666677, 0.9);
  metal.lineBetween(0, 2, TILE_SIZE, 2);
  metal.lineBetween(0, TILE_SIZE - 2, TILE_SIZE, TILE_SIZE - 2);
  metal.lineBetween(0, TILE_SIZE / 2, TILE_SIZE, TILE_SIZE / 2);
  // Блик сверху
  metal.fillStyle(0xffffff, 0.1);
  metal.fillRect(0, 0, TILE_SIZE, 2);
  // Болты по углам
  metal.fillStyle(0x888899);
  metal.fillCircle(3, 3, 2);
  metal.fillCircle(TILE_SIZE - 3, 3, 2);
  metal.fillCircle(3, TILE_SIZE - 3, 2);
  metal.fillCircle(TILE_SIZE - 3, TILE_SIZE - 3, 2);
  metal.generateTexture('platform_metal', TILE_SIZE, TILE_SIZE);
  metal.destroy();

  // --- Платформа: деревянный настил ---
  const wood = gfx(scene);
  wood.fillStyle(0x8b6b42);
  wood.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  // Доски
  for (let wy = 0; wy < TILE_SIZE; wy += 8) {
    const shade = Phaser.Math.Between(-15, 15);
    const r = 0x8b + shade, gr = 0x6b + shade, b = 0x42 + shade;
    wood.fillStyle(Phaser.Display.Color.GetColor(Math.max(0, r), Math.max(0, gr), Math.max(0, b)));
    wood.fillRect(0, wy, TILE_SIZE, 7);
    // Зазор между досками
    wood.fillStyle(0x000000, 0.2);
    wood.fillRect(0, wy + 7, TILE_SIZE, 1);
  }
  // Сучки
  wood.fillStyle(0x6a4a28, 0.5);
  wood.fillCircle(10, 6, 2);
  wood.fillCircle(22, 20, 1.5);
  // Гвозди
  wood.fillStyle(0xaaaaaa, 0.5);
  wood.fillCircle(3, 3, 1);
  wood.fillCircle(TILE_SIZE - 3, 3, 1);
  wood.fillCircle(3, TILE_SIZE - 3, 1);
  wood.fillCircle(TILE_SIZE - 3, TILE_SIZE - 3, 1);
  wood.generateTexture('platform_wood', TILE_SIZE, TILE_SIZE);
  wood.destroy();

  // --- Платформа: кирпичный карниз ---
  const brick = gfx(scene);
  brick.fillStyle(0x884433);
  brick.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  // Кирпичная кладка
  for (let by = 0; by < TILE_SIZE; by += 8) {
    const offset = (by / 8) % 2 === 0 ? 0 : 8;
    brick.lineStyle(0.8, 0x664422, 0.5);
    brick.lineBetween(0, by, TILE_SIZE, by);
    for (let bx = offset; bx < TILE_SIZE; bx += 16) {
      brick.lineBetween(bx, by, bx, by + 8);
    }
  }
  // 3D верх
  brick.fillStyle(0xffffff, 0.12);
  brick.fillRect(0, 0, TILE_SIZE, 2);
  brick.fillStyle(0x000000, 0.12);
  brick.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2);
  brick.generateTexture('platform_brick', TILE_SIZE, TILE_SIZE);
  brick.destroy();

  // --- Снежная земля ---
  const snowG = gfx(scene);
  snowG.fillStyle(P.sidewalk);
  snowG.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  // Снежный слой
  snowG.fillStyle(0xe8e8f0);
  snowG.fillRect(0, 0, TILE_SIZE, 8);
  snowG.fillStyle(0xd0d4e0, 0.3);
  snowG.fillCircle(8, 5, 6);
  snowG.fillCircle(24, 4, 7);
  // Голубоватые тени
  snowG.fillStyle(0x9999bb, 0.12);
  snowG.fillCircle(16, 6, 5);
  snowG.generateTexture('ground_snow', TILE_SIZE, TILE_SIZE);
  snowG.destroy();

  // --- Дорога (вид сбоку) ---
  const rd = gfx(scene);
  // Асфальт
  rd.fillStyle(P.asphalt);
  rd.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  rd.fillStyle(P.road);
  rd.fillRect(0, 6, TILE_SIZE, TILE_SIZE);
  // Бордюр сверху
  rd.fillStyle(P.curb);
  rd.fillRect(0, 0, TILE_SIZE, 4);
  rd.fillStyle(P.curbShade);
  rd.fillRect(0, 4, TILE_SIZE, 2);
  // Жёлтая прерывистая линия
  rd.fillStyle(P.roadLine);
  rd.fillRect(0, 18, 12, 3);
  rd.fillRect(20, 18, 12, 3);
  rd.generateTexture('road', TILE_SIZE, TILE_SIZE);
  rd.destroy();

  // --- Заснеженная дорога ---
  const rdSnow = gfx(scene);
  rdSnow.fillStyle(P.asphalt);
  rdSnow.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  // Снег поверх бордюра
  rdSnow.fillStyle(0xe8e8f0);
  rdSnow.fillRect(0, 0, TILE_SIZE, 5);
  rdSnow.fillStyle(0xd0d4e0);
  rdSnow.fillRect(0, 5, TILE_SIZE, 2);
  rdSnow.fillStyle(P.road);
  rdSnow.fillRect(0, 7, TILE_SIZE, TILE_SIZE);
  // Приглушённая снегом разметка
  rdSnow.fillStyle(0xbbbb66);
  rdSnow.fillRect(0, 18, 12, 3);
  rdSnow.fillRect(20, 18, 12, 3);
  // Снежинки/пятна на асфальте
  rdSnow.fillStyle(0xe8e8f0, 0.4);
  rdSnow.fillCircle(8, 26, 3);
  rdSnow.fillCircle(24, 12, 2);
  rdSnow.generateTexture('road_snow', TILE_SIZE, TILE_SIZE);
  rdSnow.destroy();

  // --- Труба ---
  const pipe = gfx(scene);
  pipe.fillStyle(0x778866);
  pipe.fillRect(0, 4, TILE_SIZE, TILE_SIZE - 8);
  pipe.fillStyle(0x884422, 0.3);
  pipe.fillRect(0, 6, TILE_SIZE, 4);
  pipe.lineStyle(1, 0x555555, 0.3);
  pipe.strokeRect(0, 4, TILE_SIZE, TILE_SIZE - 8);
  pipe.generateTexture('pipe', TILE_SIZE, TILE_SIZE);
  pipe.destroy();
}

// ===== ПРЕПЯТСТВИЯ =====
function generateObstacles(scene: Phaser.Scene) {
  const cw = 64, ch = 40;

  // --- Генерация машин разных цветов ---
  const carColors: Record<string, { body: number; dark: number; roof: number; highlight: number }> = {
    red:    { body: 0xcc3333, dark: 0xaa2222, roof: 0xbb2828, highlight: 0xff6666 },
    blue:   { body: 0x3355cc, dark: 0x2244aa, roof: 0x2a44bb, highlight: 0x6688ff },
    yellow: { body: 0xddaa22, dark: 0xbb8811, roof: 0xcc9918, highlight: 0xffcc44 },
    white:  { body: 0xdddddd, dark: 0xbbbbbb, roof: 0xcccccc, highlight: 0xffffff },
    green:  { body: 0x33aa55, dark: 0x228833, roof: 0x2a9944, highlight: 0x55cc77 },
  };

  for (const [name, c] of Object.entries(carColors)) {
    const car = gfx(scene);
    // Кузов
    car.fillStyle(c.body);
    car.fillRoundedRect(0, 12, cw, 18, 4);
    // Тень на кузове
    car.fillStyle(c.dark, 0.4);
    car.fillRoundedRect(0, 22, cw, 8, 3);
    // Крыша
    car.fillStyle(c.roof);
    car.fillRoundedRect(14, 2, 28, 14, 3);
    // Блик на крыше
    car.fillStyle(c.highlight, 0.3);
    car.fillRect(18, 3, 12, 3);
    // Окна
    car.fillStyle(0x88bbdd);
    car.fillRoundedRect(16, 4, 11, 9, 1);
    car.fillRoundedRect(29, 4, 11, 9, 1);
    // Отражение в окнах
    car.fillStyle(0xaaddee, 0.3);
    car.fillRect(17, 5, 4, 3);
    car.fillRect(30, 5, 4, 3);
    // Фары
    car.fillStyle(0xffee66);
    car.fillRoundedRect(0, 16, 5, 5, 2);
    car.fillCircle(cw - 3, 18, 3);
    // Задний фонарь
    car.fillStyle(0xff4444);
    car.fillRect(cw - 4, 14, 4, 4);
    // Колёса
    car.fillStyle(P.outline);
    car.fillCircle(14, ch - 4, 7);
    car.fillCircle(50, ch - 4, 7);
    car.fillStyle(0x666666);
    car.fillCircle(14, ch - 4, 4);
    car.fillCircle(50, ch - 4, 4);
    car.fillStyle(0x888888);
    car.fillCircle(14, ch - 4, 1.5);
    car.fillCircle(50, ch - 4, 1.5);
    // Номер
    car.fillStyle(0xffffff);
    car.fillRoundedRect(24, 26, 14, 4, 1);
    car.lineStyle(0.5, 0x333333, 0.4);
    car.strokeRoundedRect(24, 26, 14, 4, 1);
    car.generateTexture(`car_${name}`, cw, ch);
    car.destroy();
  }

  // --- Голубь (летающий враг) ---
  const pg = gfx(scene);
  const pw = 32, ph = 24;
  // Тело
  pg.fillStyle(0x888899);
  pg.fillEllipse(pw / 2, ph / 2 + 2, 16, 12);
  // Голова
  pg.fillStyle(0x7777aa);
  pg.fillCircle(pw / 2 + 6, ph / 2 - 3, 5);
  // Шея переливается
  pg.fillStyle(0x55aa88, 0.4);
  pg.fillCircle(pw / 2 + 4, ph / 2, 3);
  // Клюв
  pg.fillStyle(0xccaa44);
  pg.fillTriangle(pw / 2 + 11, ph / 2 - 3, pw / 2 + 14, ph / 2 - 2, pw / 2 + 11, ph / 2 - 1);
  // Глаз
  pg.fillStyle(0xff4400);
  pg.fillCircle(pw / 2 + 8, ph / 2 - 4, 1.5);
  pg.fillStyle(0x000000);
  pg.fillCircle(pw / 2 + 8, ph / 2 - 4, 0.8);
  // Крылья (раскрытые)
  pg.fillStyle(0x999aaa);
  pg.fillTriangle(pw / 2 - 2, ph / 2, pw / 2 - 10, ph / 2 - 8, pw / 2 + 2, ph / 2 - 2);
  pg.fillTriangle(pw / 2 - 2, ph / 2, pw / 2 - 12, ph / 2 + 2, pw / 2 + 2, ph / 2 + 2);
  // Хвост
  pg.fillStyle(0x666677);
  pg.fillTriangle(pw / 2 - 8, ph / 2 + 2, pw / 2 - 14, ph / 2 - 1, pw / 2 - 14, ph / 2 + 4);
  // Лапки
  pg.lineStyle(1, 0xcc6644);
  pg.lineBetween(pw / 2 + 1, ph / 2 + 5, pw / 2 + 1, ph - 2);
  pg.lineBetween(pw / 2 + 4, ph / 2 + 5, pw / 2 + 4, ph - 2);
  pg.generateTexture('pigeon', pw, ph);
  pg.destroy();

  // --- Кирпич (падающий) ---
  const br = gfx(scene);
  br.fillStyle(0xbb5533);
  br.fillRoundedRect(0, 0, 28, 18, 2);
  br.fillStyle(0xaa4422, 0.4);
  br.fillRect(0, 0, 28, 4);
  br.lineStyle(1, 0x773311, 0.5);
  br.lineBetween(14, 0, 14, 18);
  br.lineBetween(0, 9, 28, 9);
  br.lineStyle(1, P.outline, 0.2);
  br.strokeRoundedRect(0, 0, 28, 18, 2);
  br.generateTexture('brick', 28, 18);
  br.destroy();

  // --- Люк ---
  const hatch = gfx(scene);
  hatch.fillStyle(0x555555);
  hatch.fillCircle(20, 20, 19);
  hatch.fillStyle(0x444444);
  hatch.fillCircle(20, 20, 15);
  hatch.lineStyle(1.5, 0x666666);
  hatch.strokeCircle(20, 20, 12);
  hatch.strokeCircle(20, 20, 8);
  hatch.lineBetween(20, 5, 20, 35);
  hatch.lineBetween(5, 20, 35, 20);
  hatch.fillStyle(0x777777);
  hatch.fillRect(18, 18, 4, 4);
  hatch.generateTexture('hatch', 40, 40);
  hatch.destroy();

  // --- Зона холода ---
  const cold = gfx(scene);
  cold.fillStyle(0xaaddff, 0.12);
  cold.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  cold.lineStyle(0.5, 0x88bbdd, 0.08);
  for (let x = 4; x < TILE_SIZE; x += 8) {
    cold.lineBetween(x, 0, x + 4, TILE_SIZE);
  }
  cold.generateTexture('coldzone', TILE_SIZE, TILE_SIZE);
  cold.destroy();

  // --- Колья (шипы) ---
  const spk = gfx(scene);
  const spW = TILE_SIZE, spH = 20;
  // Основание
  spk.fillStyle(0x555566);
  spk.fillRect(0, spH - 4, spW, 4);
  // Шипы — 4 острых треугольника
  for (let i = 0; i < 4; i++) {
    const sx = i * 8 + 4;
    spk.fillStyle(0x888899);
    spk.fillTriangle(sx, spH - 4, sx + 4, 2, sx + 8, spH - 4);
    // Блик
    spk.fillStyle(0xccccdd, 0.5);
    spk.fillTriangle(sx + 2, spH - 6, sx + 4, 4, sx + 5, spH - 6);
    // Кончик — светлый
    spk.fillStyle(0xddddee);
    spk.fillCircle(sx + 4, 3, 1);
  }
  spk.generateTexture('spike', spW, spH);
  spk.destroy();

  // --- Приют (выход) ---
  const sh = gfx(scene);
  const sw = 80, shh = 76;
  sh.fillStyle(P.wallLight);
  sh.fillRect(2, 24, sw - 4, shh - 24);
  sh.fillStyle(P.roof);
  sh.fillRect(0, 20, sw, 6);
  sh.fillTriangle(0, 20, sw / 2, 4, sw, 20);
  sh.fillStyle(P.roofLight, 0.3);
  sh.fillTriangle(0, 20, sw / 2, 6, sw / 2, 20);
  // Окна
  sh.fillStyle(P.windowLit);
  sh.fillRect(6, 30, 14, 14);
  sh.fillRect(sw - 20, 30, 14, 14);
  sh.lineStyle(1, P.windowFrame);
  sh.strokeRect(6, 30, 14, 14);
  sh.lineBetween(13, 30, 13, 44);
  sh.lineBetween(6, 37, 20, 37);
  sh.strokeRect(sw - 20, 30, 14, 14);
  sh.lineBetween(sw - 13, 30, sw - 13, 44);
  sh.lineBetween(sw - 20, 37, sw - 6, 37);
  // Дверь
  sh.fillStyle(P.jacketDark);
  sh.fillRoundedRect(30, 46, 20, 30, 3);
  sh.fillStyle(P.jacket, 0.5);
  sh.fillRoundedRect(32, 48, 16, 26, 2);
  sh.fillStyle(P.gold);
  sh.fillCircle(44, 60, 2.5);
  // Вывеска
  sh.fillStyle(P.jacket);
  sh.fillRoundedRect(16, 9, sw - 32, 12, 3);
  sh.fillStyle(P.gold);
  sh.fillRoundedRect(18, 11, sw - 36, 8, 2);
  sh.generateTexture('shelter', sw, shh);
  sh.destroy();
}

// ===== СОБИРАЕМОЕ =====
function generateCollectibles(scene: Phaser.Scene) {
  const CS = COIN.size;
  // --- Монета ---
  const coin = gfx(scene);
  coin.fillStyle(P.gold);
  coin.fillCircle(CS / 2, CS / 2, CS / 2 - 1);
  coin.fillStyle(P.yellow);
  coin.fillCircle(CS / 2 - 1, CS / 2 - 1, CS / 2 - 3);
  // Лапка
  coin.fillStyle(P.boots);
  coin.fillCircle(CS / 2, CS / 2 + 1, 3.5);
  coin.fillCircle(CS / 2 - 3, CS / 2 - 3, 2);
  coin.fillCircle(CS / 2, CS / 2 - 4, 2);
  coin.fillCircle(CS / 2 + 3, CS / 2 - 3, 2);
  // Блик
  coin.fillStyle(0xffffff, 0.35);
  coin.fillCircle(CS / 2 - 3, CS / 2 - 4, 4);
  // Обводка
  coin.lineStyle(1, P.boots, 0.25);
  coin.strokeCircle(CS / 2, CS / 2, CS / 2 - 1);
  coin.generateTexture('coin', CS, CS);
  coin.destroy();

  // --- Снежинка ---
  const snow = gfx(scene);
  snow.fillStyle(0xffffff, 0.9);
  snow.fillCircle(6, 6, 2.5);
  snow.lineStyle(1, 0xffffff, 0.6);
  snow.lineBetween(6, 0, 6, 12);
  snow.lineBetween(0, 6, 12, 6);
  snow.lineBetween(1, 1, 11, 11);
  snow.lineBetween(11, 1, 1, 11);
  snow.generateTexture('snowflake', 12, 12);
  snow.destroy();

  // --- Одеяло ---
  const bl = gfx(scene);
  bl.fillStyle(P.red);
  bl.fillRoundedRect(0, 0, 30, 24, 3);
  bl.fillStyle(P.redLight, 0.4);
  bl.fillRect(2, 2, 26, 6);
  bl.lineStyle(1, P.redDark, 0.4);
  bl.lineBetween(10, 0, 10, 24);
  bl.lineBetween(20, 0, 20, 24);
  bl.lineBetween(0, 12, 30, 12);
  bl.generateTexture('blanket', 30, 24);
  bl.destroy();

  // --- Корм ---
  const food = gfx(scene);
  food.fillStyle(0x667744);
  food.fillRoundedRect(2, 3, 22, 23, 3);
  food.fillStyle(0x556633);
  food.fillRect(4, 0, 18, 5);
  food.fillStyle(P.gold);
  food.fillCircle(13, 17, 5);
  food.fillCircle(9, 11, 2.5);
  food.fillCircle(13, 9, 2.5);
  food.fillCircle(17, 11, 2.5);
  food.generateTexture('food', 26, 26);
  food.destroy();

  // --- Сердце (жизнь) ---
  const ht = gfx(scene);
  ht.fillStyle(0xee3344);
  ht.fillCircle(7, 7, 7);
  ht.fillCircle(15, 7, 7);
  ht.fillTriangle(0, 9, 11, 21, 22, 9);
  ht.fillStyle(0xff6677, 0.4);
  ht.fillCircle(6, 5, 3);
  ht.generateTexture('heart', 22, 22);
  ht.destroy();
}

// ===== ФОНОВЫЕ ОБЪЕКТЫ =====
function generateBackgrounds(scene: Phaser.Scene) {
  // --- Фасад жилого здания (широкий, детальный) ---
  const bw = 200, bh = 220;
  const bld = gfx(scene);
  // Стена
  bld.fillStyle(P.wall);
  bld.fillRect(0, 0, bw, bh);
  // Тень слева
  bld.fillStyle(P.wallDark, 0.2);
  bld.fillRect(0, 0, 8, bh);
  // Панельные швы
  bld.lineStyle(0.5, P.wallDeep, 0.15);
  for (let y = 0; y < bh; y += 44) bld.lineBetween(0, y, bw, y);
  for (let x = 0; x < bw; x += 50) bld.lineBetween(x, 0, x, bh);
  // Окна — 5 этажей x 4 окна
  for (let floor = 0; floor < 5; floor++) {
    for (let w = 0; w < 4; w++) {
      const wx = 12 + w * 46;
      const wy = 10 + floor * 44;
      const lit = Math.random() > 0.4;
      bld.fillStyle(lit ? P.windowLit : P.windowDark);
      bld.fillRect(wx, wy, 24, 28);
      // Рама
      bld.lineStyle(1.5, P.windowFrame);
      bld.strokeRect(wx, wy, 24, 28);
      bld.lineBetween(wx + 12, wy, wx + 12, wy + 28);
      bld.lineBetween(wx, wy + 14, wx + 24, wy + 14);
      // Подоконник
      bld.fillStyle(P.wallDark);
      bld.fillRect(wx - 2, wy + 28, 28, 3);
      // Блик в окне
      if (lit) {
        bld.fillStyle(P.windowLitLight, 0.3);
        bld.fillRect(wx + 2, wy + 2, 8, 6);
      }
    }
  }
  // Балконные ограждения
  bld.lineStyle(1, P.metalDark, 0.3);
  for (let floor = 1; floor < 5; floor++) {
    const ry = 10 + floor * 44 + 28;
    bld.lineBetween(10, ry + 3, bw - 10, ry + 3);
    // Вертикальные прутья
    for (let x = 14; x < bw - 10; x += 8) {
      bld.lineBetween(x, ry + 1, x, ry + 8);
    }
  }
  // Водосточная труба
  bld.fillStyle(P.metalDark, 0.4);
  bld.fillRect(bw - 6, 0, 4, bh);
  // Крыша
  bld.fillStyle(P.roof);
  bld.fillRect(0, 0, bw, 5);
  bld.generateTexture('building', bw, bh);
  bld.destroy();

  // --- Высотка (дальний план) ---
  const tw = 100, tth = 280;
  const tow = gfx(scene);
  tow.fillStyle(P.wallLight);
  tow.fillRect(0, 0, tw, tth);
  tow.fillStyle(P.wallDark, 0.15);
  tow.fillRect(0, 0, 6, tth);
  tow.lineStyle(0.5, P.wallDeep, 0.1);
  for (let y = 0; y < tth; y += 28) tow.lineBetween(0, y, tw, y);
  for (let floor = 0; floor < 10; floor++) {
    for (let w = 0; w < 2; w++) {
      const wx = 16 + w * 44;
      const wy = 8 + floor * 28;
      tow.fillStyle(Math.random() > 0.5 ? P.windowLit : P.windowDark);
      tow.fillRect(wx, wy, 18, 18);
      tow.lineStyle(0.5, P.windowFrame, 0.5);
      tow.strokeRect(wx, wy, 18, 18);
    }
  }
  tow.fillStyle(P.roof);
  tow.fillRect(0, 0, tw, 4);
  tow.generateTexture('tower', tw, tth);
  tow.destroy();

  // --- Витрина магазина (новая текстура для Level 1) ---
  const stw = 160, sth = 100;
  const store = gfx(scene);
  // Стена
  store.fillStyle(P.wall);
  store.fillRect(0, 0, stw, sth);
  // Витринное окно (большое)
  store.fillStyle(0x88bbdd);
  store.fillRect(10, 20, stw - 50, sth - 30);
  store.fillStyle(0xaaddee, 0.3);
  store.fillRect(14, 24, 40, 20);
  store.lineStyle(2, P.windowFrame);
  store.strokeRect(10, 20, stw - 50, sth - 30);
  store.lineBetween(10 + (stw - 50) / 2, 20, 10 + (stw - 50) / 2, sth - 10);
  // Дверь
  store.fillStyle(0x886644);
  store.fillRoundedRect(stw - 32, 30, 24, sth - 30, 2);
  store.fillStyle(P.gold);
  store.fillCircle(stw - 12, 55, 2);
  // Навес / козырёк
  store.fillStyle(P.red);
  store.fillRect(0, 10, stw, 12);
  // Полоски на навесе
  store.fillStyle(0xffffff, 0.35);
  for (let x = 0; x < stw; x += 16) {
    store.fillRect(x, 10, 8, 12);
  }
  // Вывеска
  store.fillStyle(P.jacketDark);
  store.fillRoundedRect(20, 0, stw - 40, 12, 3);
  store.fillStyle(P.gold, 0.7);
  store.fillRoundedRect(24, 2, stw - 48, 8, 2);
  // Крыша
  store.fillStyle(P.roof);
  store.fillRect(0, 0, stw, 3);
  store.generateTexture('storefront', stw, sth);
  store.destroy();

  // --- Гараж ---
  const gar = gfx(scene);
  gar.fillStyle(P.wall);
  gar.fillRect(0, 6, 76, 50);
  gar.fillStyle(P.roof);
  gar.fillRect(0, 0, 76, 8);
  gar.fillStyle(0x556655);
  gar.fillRect(10, 18, 56, 38);
  gar.lineStyle(1, 0x444444);
  gar.strokeRect(10, 18, 56, 38);
  gar.lineBetween(38, 18, 38, 56);
  gar.fillStyle(0x884422, 0.2);
  gar.fillRect(12, 36, 24, 14);
  gar.generateTexture('garage', 76, 56);
  gar.destroy();

  // --- Забор ---
  const fnc = gfx(scene);
  fnc.fillStyle(P.wall);
  fnc.fillRect(0, 8, 76, 38);
  fnc.fillStyle(P.wallDark);
  fnc.fillRect(0, 0, 6, 46);
  fnc.fillRect(70, 0, 6, 46);
  fnc.lineStyle(0.5, P.wallDeep, 0.2);
  fnc.lineBetween(24, 8, 26, 46);
  fnc.lineBetween(48, 12, 50, 46);
  fnc.generateTexture('fence', 76, 46);
  fnc.destroy();

  // --- Фонарный столб ---
  const lamp = gfx(scene);
  lamp.fillStyle(P.metalDark);
  lamp.fillRect(8, 14, 5, 82);
  lamp.fillStyle(P.metal);
  lamp.fillRect(4, 92, 13, 4);
  // Перекладина
  lamp.fillStyle(P.metal);
  lamp.fillRect(0, 10, 21, 4);
  // Лампа + свечение
  lamp.fillStyle(P.yellow, 0.2);
  lamp.fillCircle(10, 16, 16);
  lamp.fillStyle(P.yellow, 0.4);
  lamp.fillCircle(10, 14, 8);
  lamp.fillStyle(0xffeecc, 0.9);
  lamp.fillCircle(10, 13, 4);
  lamp.generateTexture('lamppost', 21, 96);
  lamp.destroy();

  // --- Мусорный бак (детальный) ---
  const tb = gfx(scene);
  tb.fillStyle(0x556644);
  tb.fillRoundedRect(2, 10, 28, 26, 3);
  tb.fillStyle(0x445533);
  tb.fillRoundedRect(0, 8, 32, 5, 2);
  // Ручки
  tb.fillStyle(P.metalDark);
  tb.fillRect(0, 18, 3, 10);
  tb.fillRect(29, 18, 3, 10);
  // Мусор торчит
  tb.fillStyle(0xaa8855);
  tb.fillRect(8, 2, 6, 9);
  tb.fillRect(18, 4, 7, 7);
  tb.fillStyle(0x888866);
  tb.fillCircle(22, 3, 4);
  tb.generateTexture('trashcan', 32, 36);
  tb.destroy();

  // --- Дерево ---
  const tree = gfx(scene);
  tree.fillStyle(P.trunk);
  tree.fillRect(18, 38, 10, 34);
  tree.fillStyle(P.trunkDark, 0.3);
  tree.fillRect(18, 38, 4, 34);
  tree.fillStyle(P.trunkLight, 0.3);
  tree.fillRect(24, 38, 3, 34);
  // Крона — несколько слоёв
  tree.fillStyle(P.leafDark);
  tree.fillCircle(23, 24, 22);
  tree.fillStyle(P.leaf);
  tree.fillCircle(14, 30, 16);
  tree.fillCircle(32, 30, 16);
  tree.fillCircle(23, 18, 18);
  tree.fillStyle(P.leafLight, 0.4);
  tree.fillCircle(28, 14, 10);
  tree.fillCircle(16, 26, 8);
  // Тёмные промежутки
  tree.fillStyle(P.leafDeep, 0.25);
  tree.fillCircle(20, 28, 8);
  tree.fillCircle(30, 22, 6);
  tree.generateTexture('tree', 46, 72);
  tree.destroy();

  // --- Зимнее дерево ---
  const wt = gfx(scene);
  wt.fillStyle(P.trunk);
  wt.fillRect(15, 24, 7, 48);
  wt.lineStyle(3, P.trunkDark);
  wt.lineBetween(18, 30, 6, 14);
  wt.lineBetween(18, 30, 30, 12);
  wt.lineBetween(18, 38, 8, 26);
  wt.lineBetween(18, 38, 28, 24);
  wt.lineBetween(18, 22, 13, 8);
  wt.lineBetween(18, 22, 26, 6);
  wt.fillStyle(0xe8e8f0, 0.8);
  wt.fillCircle(6, 13, 5);
  wt.fillCircle(30, 11, 5);
  wt.fillCircle(8, 25, 4);
  wt.fillCircle(28, 23, 4);
  wt.fillCircle(13, 7, 4);
  wt.fillCircle(26, 5, 4);
  wt.generateTexture('tree_winter', 36, 72);
  wt.destroy();

  // --- Лужа ---
  const pud = gfx(scene);
  pud.fillStyle(0x556688, 0.35);
  pud.fillEllipse(20, 8, 38, 14);
  pud.fillStyle(0x7799bb, 0.2);
  pud.fillEllipse(18, 7, 16, 6);
  pud.generateTexture('puddle', 40, 16);
  pud.destroy();

  // --- Скамейка ---
  const bench = gfx(scene);
  bench.fillStyle(0x775533);
  bench.fillRect(0, 12, 48, 4);
  bench.fillRect(0, 2, 48, 4);
  bench.fillStyle(0x664422, 0.4);
  bench.fillRect(0, 6, 48, 2);
  bench.fillStyle(P.metalDark);
  bench.fillRect(4, 16, 5, 14);
  bench.fillRect(39, 16, 5, 14);
  bench.generateTexture('bench', 48, 30);
  bench.destroy();

  // --- Пожарный гидрант ---
  const hy = gfx(scene);
  hy.fillStyle(P.red);
  hy.fillRoundedRect(3, 8, 14, 18, 3);
  hy.fillStyle(P.redDark);
  hy.fillRect(5, 6, 10, 4);
  hy.fillCircle(10, 6, 5);
  // Выступы (боковые вентили)
  hy.fillStyle(P.redLight);
  hy.fillRect(0, 12, 4, 4);
  hy.fillRect(16, 12, 4, 4);
  // Верхушка
  hy.fillStyle(P.redDark, 0.6);
  hy.fillCircle(10, 4, 3);
  hy.generateTexture('hydrant', 20, 26);
  hy.destroy();

  // --- Паркомат ---
  const pm = gfx(scene);
  pm.fillStyle(P.metalDark);
  pm.fillRect(6, 14, 4, 36);
  pm.fillStyle(P.metal);
  pm.fillRoundedRect(1, 0, 14, 18, 3);
  pm.fillStyle(0x333344);
  pm.fillRect(3, 4, 10, 8);
  pm.fillStyle(0x22bb33);
  pm.fillCircle(8, 8, 2);
  pm.generateTexture('parkmeter', 16, 50);
  pm.destroy();
}

// ===== ВРАГИ 42x58 =====
function generateEnemies(scene: Phaser.Scene) {
  const EW = ENEMY.width;
  const EH = ENEMY.height;
  const dc = gfx(scene);
  const cx = EW / 2;

  // Тень на земле
  dc.fillStyle(P.shadow, 0.15);
  dc.fillEllipse(cx, EH - 2, 26, 6);

  // --- Ботинки ---
  dc.fillStyle(P.outline);
  dc.fillRoundedRect(cx - 13, 50, 11, 7, 2);
  dc.fillRoundedRect(cx + 2, 50, 11, 7, 2);

  // --- Ноги ---
  dc.fillStyle(0x333344);
  dc.fillRect(cx - 11, 36, 9, 16);
  dc.fillRect(cx + 2, 36, 9, 16);
  dc.fillStyle(0x222233, 0.3);
  dc.fillRect(cx - 11, 36, 3, 16);
  dc.fillRect(cx + 2, 36, 3, 16);

  // --- Тело (форма — коренастый, шире игрока) ---
  dc.fillStyle(P.uniform);
  dc.fillRoundedRect(cx - 16, 16, 32, 24, 4);
  dc.fillStyle(P.uniformDark);
  dc.fillRoundedRect(cx - 16, 16, 8, 24, 2);
  dc.fillStyle(P.uniformLight, 0.3);
  dc.fillRoundedRect(cx + 6, 16, 8, 22, 3);
  // Погоны
  dc.fillStyle(P.uniformLight);
  dc.fillRect(cx - 16, 16, 8, 3);
  dc.fillRect(cx + 8, 16, 8, 3);
  // Карман
  dc.fillStyle(P.uniformDark, 0.4);
  dc.fillRoundedRect(cx - 12, 24, 10, 8, 1);
  dc.lineStyle(0.5, P.uniform, 0.5);
  dc.strokeRoundedRect(cx - 12, 24, 10, 8, 1);
  // Пуговицы
  dc.fillStyle(0x333344);
  dc.fillCircle(cx, 21, 1.5);
  dc.fillCircle(cx, 28, 1.5);
  dc.fillCircle(cx, 35, 1.5);

  // --- Рукава ---
  dc.fillStyle(P.uniformDark);
  dc.fillRoundedRect(cx - 21, 18, 7, 16, 2);
  dc.fillRoundedRect(cx + 14, 18, 7, 16, 2);
  // Кисти
  dc.fillStyle(P.skin);
  dc.fillCircle(cx - 18, 34, 4);
  dc.fillCircle(cx + 17, 34, 4);

  // --- Сачок-петля (идентификатор — торчит вверх) ---
  dc.fillStyle(0x886644);
  dc.fillRect(cx + 14, 0, 4, 34);
  // Петля
  dc.lineStyle(2.5, P.metal);
  dc.strokeCircle(cx + 16, 0, 8);
  // Верёвка от петли
  dc.lineStyle(1, 0x777766);
  dc.lineBetween(cx + 16, 8, cx + 16, 18);

  // --- Голова ---
  dc.fillStyle(P.skin);
  dc.fillCircle(cx, 12, 10);
  dc.fillStyle(P.skinShade, 0.15);
  dc.fillCircle(cx - 4, 15, 5);

  // --- Кепка ---
  dc.fillStyle(P.capDark);
  dc.fillRoundedRect(cx - 12, 1, 24, 9, 3);
  dc.fillRect(cx - 13, 9, 26, 3);
  // Козырёк
  dc.fillStyle(P.capVisor);
  dc.fillRoundedRect(cx - 14, 10, 18, 4, 2);

  // --- Злые глаза ---
  dc.fillStyle(0xffffff);
  dc.fillCircle(cx - 4, 12, 3);
  dc.fillCircle(cx + 4, 12, 3);
  dc.fillStyle(0x442222);
  dc.fillCircle(cx - 4, 12, 2);
  dc.fillCircle(cx + 4, 12, 2);
  dc.fillStyle(P.outline);
  dc.fillCircle(cx - 4, 12, 0.8);
  dc.fillCircle(cx + 4, 12, 0.8);
  // Сведённые брови
  dc.lineStyle(2, P.outline, 0.7);
  dc.lineBetween(cx - 8, 7, cx - 2, 9);
  dc.lineBetween(cx + 8, 7, cx + 2, 9);

  // --- Злой рот ---
  dc.lineStyle(1.5, 0x884444);
  dc.lineBetween(cx - 4, 17, cx + 4, 17);
  dc.lineBetween(cx - 4, 17, cx - 5, 18);
  dc.lineBetween(cx + 4, 17, cx + 5, 18);

  // Контур
  dc.lineStyle(1.5, P.outline, 0.15);
  dc.strokeCircle(cx, 12, 10.5);
  dc.strokeRoundedRect(cx - 16.5, 15.5, 33, 25, 4);

  dc.generateTexture('dogcatcher', EW, EH);
  dc.destroy();

  // --- Снаряд-сердечко (16x16) ---
  const hp = gfx(scene);
  hp.fillStyle(0xff6688, 0.2);
  hp.fillCircle(8, 8, 8);
  hp.fillStyle(0xee3355);
  hp.fillCircle(5, 5, 5);
  hp.fillCircle(11, 5, 5);
  hp.fillTriangle(0, 7, 8, 15, 16, 7);
  hp.fillStyle(0xff8899, 0.5);
  hp.fillCircle(5, 4, 2.5);
  hp.fillStyle(0xffffff, 0.7);
  hp.fillCircle(4, 3, 1.2);
  hp.generateTexture('heart_projectile', 16, 16);
  hp.destroy();

  // --- Облако ---
  const cl = gfx(scene);
  cl.fillStyle(0xffffff, 0.7);
  cl.fillCircle(24, 22, 18);
  cl.fillCircle(48, 18, 22);
  cl.fillCircle(72, 22, 18);
  cl.fillCircle(36, 14, 16);
  cl.fillCircle(60, 14, 16);
  cl.fillStyle(0xffffff, 0.5);
  cl.fillCircle(42, 24, 14);
  cl.fillCircle(54, 24, 14);
  cl.generateTexture('cloud', 96, 42);
  cl.destroy();
}

// ===== ДЕКОРАЦИИ =====
function generateDecorations(scene: Phaser.Scene) {
  // --- Столб с проводами ---
  const pole = gfx(scene);
  pole.fillStyle(P.metalDark);
  pole.fillRect(5, 0, 4, 92);
  pole.fillRect(0, 4, 14, 3);
  pole.lineStyle(1, 0x333333);
  pole.lineBetween(0, 5, 14, 5);
  pole.generateTexture('pole', 14, 92);
  pole.destroy();

  // --- Урна ---
  const urn = gfx(scene);
  urn.fillStyle(P.metalDark);
  urn.fillRoundedRect(2, 4, 16, 18, 3);
  urn.fillStyle(P.metal);
  urn.fillRoundedRect(0, 2, 20, 4, 2);
  urn.fillStyle(0x444444);
  urn.fillRect(7, 22, 6, 5);
  urn.generateTexture('urn', 20, 27);
  urn.destroy();

  // --- Знак дорожный ---
  const sign = gfx(scene);
  sign.fillStyle(P.metal);
  sign.fillRect(8, 18, 4, 42);
  sign.fillStyle(P.red);
  sign.fillCircle(10, 10, 10);
  sign.fillStyle(0xffffff);
  sign.fillCircle(10, 10, 8);
  sign.fillStyle(P.red);
  sign.fillRect(4, 9, 12, 2);
  sign.generateTexture('roadsign', 20, 60);
  sign.destroy();
}

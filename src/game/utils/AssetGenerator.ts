import * as Phaser from 'phaser';
import { COLORS, PLAYER, ANIMAL, COIN, TILE_SIZE, ENEMY } from '@/lib/constants';

// Единая советская палитра
const S = {
  // Бетон и здания
  concrete: 0xb0a89a,
  concreteDark: 0x8a8278,
  concreteLighter: 0xc4bdb0,
  panel: 0xc8c0b0,
  panelDark: 0xa09888,
  window: 0x5588aa,
  windowLit: 0xffdd66,
  windowDark: 0x334455,
  roof: 0x6b5b4f,
  // Дорога
  asphalt: 0x444444,
  asphaltLight: 0x555555,
  curb: 0x999999,
  road: 0x3a3a3a,
  roadLine: 0xdddd44,
  // Природа
  tree: 0x446633,
  treeDark: 0x335522,
  treeTrunk: 0x664422,
  treeWinter: 0x667766,
  // Зима
  snow: 0xe8e8f0,
  snowGround: 0xdde0e8,
  ice: 0xaaccdd,
  skyWinter: 0xb0b8c8,
  // Городское
  fence: 0x665544,
  rust: 0x884422,
  pipe: 0x778866,
  lampPost: 0x555555,
  lampLight: 0xffeeaa,
  trash: 0x556644,
  trashDark: 0x3a4830,
  puddle: 0x556688,
  dirt: 0x886644,
  brick: 0xaa5533,
  brickDark: 0x883322,
  sky: 0x8aafe0,
  skyEvening: 0x445566,
  // Персонажи — единый тон кожи
  skin: 0xf5c8a0,
  skinDark: 0xe0b090,
  hairBlonde: 0xf0d060,
  hairBlondeDark: 0xd4b840,
  jacket: 0x447744,
  jacketDark: 0x3a6a3a,
  jacketLight: 0x558855,
  jeans: 0x334466,
  jeansDark: 0x283854,
  boots: 0x333333,
  bootsLight: 0x444444,
  // Враги
  uniform: 0x667788,
  uniformDark: 0x556677,
  uniformLight: 0x778899,
  cap: 0x333344,
  capVisor: 0x222233,
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

// ===== ПЕРСОНАЖИ =====
function generateCharacters(scene: Phaser.Scene) {
  const FW = PLAYER.width;  // 40
  const FH = PLAYER.height; // 56
  const FRAMES = 8;
  const p = gfx(scene);

  for (let frame = 0; frame < FRAMES; frame++) {
    const ox = frame * FW;

    // Фазы для ходьбы
    let legL = 0, legR = 0, armL = 0, armR = 0;
    if (frame >= 1 && frame <= 6) {
      const phase = ((frame - 1) / 6) * Math.PI * 2;
      legL = Math.sin(phase) * 5;
      legR = Math.sin(phase + Math.PI) * 5;
      armL = Math.sin(phase + Math.PI) * 4;
      armR = Math.sin(phase) * 4;
    }
    const isJump = frame === 7;

    // --- Контурная тень (рисуем сначала) ---
    p.fillStyle(0x000000, 0.15);
    p.fillRoundedRect(ox + 6, 16, 28, 20, 3); // тело тень
    p.fillCircle(ox + 20, 11, 9); // голова тень

    // --- Ботинки ---
    p.fillStyle(S.boots);
    if (isJump) {
      p.fillRoundedRect(ox + 8, 48, 9, 6, 1);
      p.fillRoundedRect(ox + 23, 48, 9, 6, 1);
    } else {
      p.fillRoundedRect(ox + 6 + legL, 50, 9, 6, 1);
      p.fillRoundedRect(ox + 25 + legR, 50, 9, 6, 1);
    }
    // Подошва
    p.fillStyle(S.bootsLight);
    if (isJump) {
      p.fillRect(ox + 8, 53, 9, 1);
      p.fillRect(ox + 23, 53, 9, 1);
    } else {
      p.fillRect(ox + 6 + legL, 55, 9, 1);
      p.fillRect(ox + 25 + legR, 55, 9, 1);
    }

    // --- Ноги (джинсы) ---
    p.fillStyle(S.jeans);
    if (isJump) {
      p.fillRect(ox + 10, 38, 8, 12);
      p.fillRect(ox + 22, 38, 8, 12);
    } else {
      p.fillRect(ox + 8 + legL, 34, 8, 18);
      p.fillRect(ox + 24 + legR, 34, 8, 18);
    }
    // Шов на джинсах
    p.lineStyle(0.5, S.jeansDark, 0.4);
    if (!isJump) {
      p.lineBetween(ox + 12 + legL, 36, ox + 12 + legL, 50);
      p.lineBetween(ox + 28 + legR, 36, ox + 28 + legR, 50);
    }

    // --- Тело (куртка) ---
    p.fillStyle(S.jacket);
    p.fillRoundedRect(ox + 6, 16, 28, 20, 3);
    // Воротник
    p.fillStyle(S.jacketLight);
    p.fillRect(ox + 14, 16, 12, 3);
    // Молния
    p.lineStyle(1, S.jacketDark, 0.5);
    p.lineBetween(ox + 20, 19, ox + 20, 35);
    // Карманы
    p.fillStyle(S.jacketDark, 0.3);
    p.fillRect(ox + 8, 28, 8, 5);
    p.fillRect(ox + 24, 28, 8, 5);

    // --- Рукава ---
    p.fillStyle(S.jacketDark);
    if (isJump) {
      // Руки подняты
      p.fillRoundedRect(ox + 1, 10, 7, 12, 2);
      p.fillRoundedRect(ox + 32, 10, 7, 12, 2);
    } else {
      p.fillRoundedRect(ox + 1, 20 + armL, 7, 14, 2);
      p.fillRoundedRect(ox + 32, 20 + armR, 7, 14, 2);
    }

    // --- Кисти рук ---
    p.fillStyle(S.skin);
    if (isJump) {
      p.fillCircle(ox + 4, 8, 3);
      p.fillCircle(ox + 36, 8, 3);
    } else {
      p.fillCircle(ox + 4, 33 + armL, 3);
      p.fillCircle(ox + 36, 33 + armR, 3);
    }

    // --- Бейдж-лапка ---
    p.fillStyle(COLORS.gold);
    p.fillRoundedRect(ox + 10, 24, 7, 6, 1);
    // Лапка
    p.fillStyle(0x886622);
    p.fillCircle(ox + 13.5, 28, 1.5);
    p.fillCircle(ox + 11, 25.5, 1);
    p.fillCircle(ox + 13.5, 25, 1);
    p.fillCircle(ox + 16, 25.5, 1);

    // --- Голова ---
    p.fillStyle(S.skin);
    p.fillCircle(ox + 20, 11, 9);

    // --- Волосы (короткие, блондинка) ---
    p.fillStyle(S.hairBlonde);
    // Основная масса сверху
    p.fillRoundedRect(ox + 11, 1, 18, 8, 3);
    // Чёлка
    p.fillRect(ox + 12, 5, 16, 4);
    // Боковые пряди
    p.fillStyle(S.hairBlondeDark);
    p.fillRoundedRect(ox + 10, 5, 4, 9, 2);
    p.fillRoundedRect(ox + 26, 5, 4, 9, 2);

    // --- Глаза ---
    // Белки
    p.fillStyle(0xffffff);
    p.fillCircle(ox + 16, 10, 2.5);
    p.fillCircle(ox + 24, 10, 2.5);
    // Радужка
    p.fillStyle(0x3366aa);
    p.fillCircle(ox + 16, 10, 1.8);
    p.fillCircle(ox + 24, 10, 1.8);
    // Зрачки
    p.fillStyle(0x111111);
    p.fillCircle(ox + 16, 10, 0.8);
    p.fillCircle(ox + 24, 10, 0.8);
    // Блики
    p.fillStyle(0xffffff, 0.8);
    p.fillCircle(ox + 15, 9, 0.6);
    p.fillCircle(ox + 23, 9, 0.6);

    // --- Брови ---
    p.lineStyle(1.5, S.hairBlondeDark);
    p.lineBetween(ox + 14, 7, ox + 18, 7.5);
    p.lineBetween(ox + 22, 7.5, ox + 26, 7);

    // --- Нос ---
    p.fillStyle(S.skinDark, 0.5);
    p.fillCircle(ox + 20, 12, 1);

    // --- Улыбка ---
    p.lineStyle(1, 0xcc6644);
    p.beginPath();
    p.arc(ox + 20, 14, 3, 0.2, Math.PI - 0.2, false);
    p.strokePath();
  }

  p.generateTexture('player_sheet', FW * FRAMES, FH);
  p.destroy();

  // Создаём кадры spritesheet
  const tex = scene.textures.get('player_sheet');
  tex.add('__BASE', 0, 0, 0, FW * FRAMES, FH);
  for (let i = 0; i < FRAMES; i++) {
    tex.add(i, 0, i * FW, 0, FW, FH);
  }

  // --- Щенок (28x22) ---
  const AW = ANIMAL.width;
  const AH = ANIMAL.height;
  const pup = gfx(scene);
  // Контур
  pup.fillStyle(0x000000, 0.12);
  pup.fillRoundedRect(4, 6, 18, 12, 4);
  // Тело
  pup.fillStyle(0xbb8844);
  pup.fillRoundedRect(5, 7, 17, 11, 4);
  // Голова
  pup.fillStyle(0xcc9955);
  pup.fillCircle(7, 7, 7);
  // Уши висячие
  pup.fillStyle(0x996633);
  pup.fillEllipse(1, 5, 5, 8);
  pup.fillEllipse(13, 5, 5, 8);
  // Внутренняя часть ушей
  pup.fillStyle(0xddaa77, 0.5);
  pup.fillEllipse(1, 5, 3, 5);
  pup.fillEllipse(13, 5, 3, 5);
  // Глаза с бликами
  pup.fillStyle(0x222222);
  pup.fillCircle(4, 6, 2);
  pup.fillCircle(10, 6, 2);
  pup.fillStyle(0xffffff, 0.7);
  pup.fillCircle(3.5, 5.5, 0.7);
  pup.fillCircle(9.5, 5.5, 0.7);
  // Нос
  pup.fillStyle(0x332211);
  pup.fillCircle(7, 9, 1.5);
  // Ошейник
  pup.fillStyle(0xcc3333);
  pup.fillRect(3, 11, 8, 2);
  pup.fillStyle(COLORS.gold);
  pup.fillCircle(7, 12, 1);
  // Хвост
  pup.fillStyle(0xbb8844);
  pup.fillRect(21, 5, 5, 3);
  pup.fillCircle(25, 6, 2);
  // Лапы
  pup.fillStyle(0x996633);
  pup.fillRoundedRect(7, 17, 4, 4, 1);
  pup.fillRoundedRect(16, 17, 4, 4, 1);
  pup.generateTexture('puppy', AW, AH);
  pup.destroy();

  // --- Котёнок (28x22) ---
  const kit = gfx(scene);
  // Контур
  kit.fillStyle(0x000000, 0.12);
  kit.fillRoundedRect(4, 7, 18, 11, 3);
  // Тело
  kit.fillStyle(0xdd9944);
  kit.fillRoundedRect(5, 8, 17, 10, 3);
  // Полосы на теле
  kit.fillStyle(0xcc8822, 0.4);
  kit.fillRect(8, 9, 2, 8);
  kit.fillRect(13, 9, 2, 8);
  kit.fillRect(18, 9, 2, 8);
  // Голова
  kit.fillStyle(0xeeaa55);
  kit.fillCircle(7, 7, 7);
  // Уши треугольные (крупнее)
  kit.fillStyle(0xcc8833);
  kit.fillTriangle(1, 4, 0, -3, 5, 2);
  kit.fillTriangle(9, 4, 14, -3, 8, 2);
  // Внутренняя часть ушей
  kit.fillStyle(0xeeaaaa, 0.4);
  kit.fillTriangle(2, 3, 1, -1, 4, 2);
  kit.fillTriangle(10, 3, 13, -1, 9, 2);
  // Глаза зелёные с вертикальным зрачком
  kit.fillStyle(0x33aa44);
  kit.fillCircle(4, 7, 2);
  kit.fillCircle(10, 7, 2);
  kit.fillStyle(0x111111);
  kit.fillRect(3.5, 5.5, 1, 3);
  kit.fillRect(9.5, 5.5, 1, 3);
  kit.fillStyle(0xffffff, 0.5);
  kit.fillCircle(3.5, 6.5, 0.5);
  kit.fillCircle(9.5, 6.5, 0.5);
  // Усы
  kit.lineStyle(0.5, 0x666666);
  kit.lineBetween(-1, 7, 4, 9);
  kit.lineBetween(-1, 9, 4, 9);
  kit.lineBetween(-1, 11, 4, 9);
  kit.lineBetween(15, 7, 10, 9);
  kit.lineBetween(15, 9, 10, 9);
  kit.lineBetween(15, 11, 10, 9);
  // Нос
  kit.fillStyle(0xdd7777);
  kit.fillTriangle(6, 9, 8, 9, 7, 10);
  // Хвост изогнутый
  kit.lineStyle(3, 0xdd9944);
  kit.beginPath();
  kit.arc(24, 5, 5, Math.PI * 0.5, Math.PI * 1.5, false);
  kit.strokePath();
  // Лапы
  kit.fillStyle(0xcc8833);
  kit.fillRoundedRect(7, 17, 4, 4, 1);
  kit.fillRoundedRect(16, 17, 4, 4, 1);
  kit.generateTexture('kitten', AW, AH);
  kit.destroy();
}

// ===== МЕСТНОСТЬ =====
function generateTerrain(scene: Phaser.Scene) {
  // --- Асфальт ---
  const ground = gfx(scene);
  ground.fillStyle(S.asphalt);
  ground.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  // Бордюр 2-тоновый
  ground.fillStyle(0xaaaaaa);
  ground.fillRect(0, 0, TILE_SIZE, 2);
  ground.fillStyle(0x888888);
  ground.fillRect(0, 2, TILE_SIZE, 1);
  // Трещины
  ground.lineStyle(0.5, 0x333333, 0.5);
  ground.lineBetween(5, 3, 10, TILE_SIZE);
  ground.lineBetween(8, 8, 12, 20);
  ground.lineBetween(20, 5, 25, TILE_SIZE);
  // Камешки
  ground.fillStyle(0x555555, 0.3);
  ground.fillCircle(15, 12, 1.5);
  ground.fillCircle(25, 20, 1);
  ground.fillCircle(8, 24, 1);
  ground.generateTexture('ground', TILE_SIZE, TILE_SIZE);
  ground.destroy();

  // --- Бетонная платформа (3D-эффект) ---
  const plat = gfx(scene);
  plat.fillStyle(S.concrete);
  plat.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  // Свет сверху/слева
  plat.fillStyle(0xffffff, 0.12);
  plat.fillRect(0, 0, TILE_SIZE, 2);
  plat.fillRect(0, 0, 2, TILE_SIZE);
  // Тень снизу/справа
  plat.fillStyle(0x000000, 0.1);
  plat.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2);
  plat.fillRect(TILE_SIZE - 2, 0, 2, TILE_SIZE);
  // Текстура бетона
  plat.fillStyle(0x000000, 0.04);
  plat.fillCircle(8, 12, 4);
  plat.fillCircle(22, 20, 3);
  plat.fillCircle(14, 26, 3);
  plat.generateTexture('platform', TILE_SIZE, TILE_SIZE);
  plat.destroy();

  // --- Снежная земля ---
  const snowGround = gfx(scene);
  snowGround.fillStyle(S.asphalt);
  snowGround.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  // Слоистый снег
  snowGround.fillStyle(S.snow);
  snowGround.fillRect(0, 0, TILE_SIZE, 7);
  // Голубые тени
  snowGround.fillStyle(0x9999bb, 0.15);
  snowGround.fillCircle(8, 5, 5);
  snowGround.fillCircle(24, 4, 6);
  snowGround.fillStyle(S.snowGround, 0.5);
  snowGround.fillCircle(5, 3, 4);
  snowGround.fillCircle(20, 2, 5);
  snowGround.generateTexture('ground_snow', TILE_SIZE, TILE_SIZE);
  snowGround.destroy();

  // --- Дорога ---
  const road = gfx(scene);
  road.fillStyle(S.road);
  road.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  road.fillStyle(S.roadLine);
  road.fillRect(12, 14, 8, 3);
  road.generateTexture('road', TILE_SIZE, TILE_SIZE);
  road.destroy();

  // --- Труба ---
  const pipe = gfx(scene);
  pipe.fillStyle(S.pipe);
  pipe.fillRect(0, 4, TILE_SIZE, TILE_SIZE - 8);
  pipe.fillStyle(S.rust, 0.4);
  pipe.fillRect(0, 6, TILE_SIZE, 3);
  pipe.lineStyle(1, 0x555555, 0.3);
  pipe.strokeRect(0, 4, TILE_SIZE, TILE_SIZE - 8);
  pipe.fillStyle(0x444444);
  pipe.fillCircle(4, TILE_SIZE / 2, 2);
  pipe.fillCircle(TILE_SIZE - 4, TILE_SIZE / 2, 2);
  pipe.generateTexture('pipe', TILE_SIZE, TILE_SIZE);
  pipe.destroy();
}

// ===== ПРЕПЯТСТВИЯ =====
function generateObstacles(scene: Phaser.Scene) {
  // --- Машина ---
  const car = gfx(scene);
  car.fillStyle(0xcc3333);
  car.fillRoundedRect(0, 10, 56, 18, 3);
  car.fillStyle(0xaa2222);
  car.fillRoundedRect(12, 2, 24, 12, 2);
  // Окна
  car.fillStyle(S.window);
  car.fillRect(14, 4, 9, 7);
  car.fillRect(25, 4, 9, 7);
  // Фары
  car.fillStyle(0xffdd44);
  car.fillCircle(3, 17, 2.5);
  car.fillCircle(53, 17, 2.5);
  // Задний фонарь
  car.fillStyle(0xff3333);
  car.fillRect(52, 12, 3, 4);
  // Колёса
  car.fillStyle(0x222222);
  car.fillCircle(12, 30, 6);
  car.fillCircle(44, 30, 6);
  car.fillStyle(0x666666);
  car.fillCircle(12, 30, 2.5);
  car.fillCircle(44, 30, 2.5);
  // Номер
  car.fillStyle(0xffffff);
  car.fillRect(22, 24, 12, 4);
  car.lineStyle(0.5, 0x000000, 0.3);
  car.strokeRect(22, 24, 12, 4);
  car.generateTexture('car', 56, 36);
  car.destroy();

  // --- Кирпич ---
  const brick = gfx(scene);
  brick.fillStyle(S.brick);
  brick.fillRect(0, 0, 24, 16);
  brick.fillStyle(S.brickDark, 0.3);
  brick.fillRect(0, 0, 24, 3);
  brick.lineStyle(1, 0x662211, 0.5);
  brick.lineBetween(12, 0, 12, 16);
  brick.lineBetween(0, 8, 24, 8);
  brick.lineStyle(1, 0x000000, 0.15);
  brick.strokeRect(0, 0, 24, 16);
  brick.generateTexture('brick', 24, 16);
  brick.destroy();

  // --- Люк ---
  const hatch = gfx(scene);
  hatch.fillStyle(0x555555);
  hatch.fillCircle(18, 18, 17);
  hatch.fillStyle(0x444444);
  hatch.fillCircle(18, 18, 14);
  hatch.lineStyle(1.5, 0x666666);
  hatch.strokeCircle(18, 18, 11);
  hatch.strokeCircle(18, 18, 7);
  hatch.lineBetween(18, 4, 18, 32);
  hatch.lineBetween(4, 18, 32, 18);
  hatch.fillStyle(0x777777);
  hatch.fillRect(16, 16, 4, 4);
  hatch.generateTexture('hatch', 36, 36);
  hatch.destroy();

  // --- Зона холода ---
  const cold = gfx(scene);
  cold.fillStyle(0xaaddff, 0.15);
  cold.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  cold.lineStyle(0.5, 0x88bbdd, 0.1);
  cold.lineBetween(4, 0, 12, TILE_SIZE);
  cold.lineBetween(20, 0, 28, TILE_SIZE);
  cold.generateTexture('coldzone', TILE_SIZE, TILE_SIZE);
  cold.destroy();

  // --- Коробка ---
  const box = gfx(scene);
  box.fillStyle(0x997755);
  box.fillRect(0, 6, 36, 24);
  box.fillStyle(0x886644);
  box.fillRect(0, 6, 36, 4);
  box.fillStyle(0xaa8866);
  box.fillTriangle(0, 6, 9, 0, 18, 6);
  box.fillTriangle(18, 6, 27, 0, 36, 6);
  box.lineStyle(1, 0x665533);
  box.strokeRect(0, 6, 36, 24);
  box.generateTexture('box', 36, 30);
  box.destroy();

  // --- Приют (выход) ---
  const sh = gfx(scene);
  sh.fillStyle(S.panel);
  sh.fillRect(2, 22, 68, 48);
  sh.fillStyle(S.roof);
  sh.fillRect(0, 18, 72, 6);
  sh.fillTriangle(0, 18, 36, 4, 72, 18);
  // Окна
  sh.fillStyle(S.windowLit);
  sh.fillRect(6, 28, 12, 12);
  sh.fillRect(54, 28, 12, 12);
  sh.lineStyle(1, 0x666666);
  sh.strokeRect(6, 28, 12, 12);
  sh.lineBetween(12, 28, 12, 40);
  sh.lineBetween(6, 34, 18, 34);
  sh.strokeRect(54, 28, 12, 12);
  sh.lineBetween(60, 28, 60, 40);
  sh.lineBetween(54, 34, 66, 34);
  // Дверь
  sh.fillStyle(0x556633);
  sh.fillRect(28, 42, 16, 28);
  sh.fillStyle(0x667744);
  sh.fillRect(30, 44, 12, 24);
  sh.fillStyle(COLORS.gold);
  sh.fillCircle(39, 56, 2);
  // Вывеска
  sh.fillStyle(0x446633);
  sh.fillRect(14, 8, 44, 10);
  sh.fillStyle(COLORS.gold);
  sh.fillRect(16, 10, 40, 6);
  sh.generateTexture('shelter', 72, 70);
  sh.destroy();
}

// ===== СОБИРАЕМЫЕ ПРЕДМЕТЫ =====
function generateCollectibles(scene: Phaser.Scene) {
  const CS = COIN.size; // 20
  // --- Монета-лапка ---
  const coin = gfx(scene);
  coin.fillStyle(COLORS.gold);
  coin.fillCircle(CS / 2, CS / 2, CS / 2 - 1);
  coin.fillStyle(0xeebb44);
  coin.fillCircle(CS / 2, CS / 2 - 1, CS / 2 - 2);
  // Лапка
  coin.fillStyle(0x886622);
  coin.fillCircle(CS / 2, CS / 2 + 1, 3);
  coin.fillCircle(CS / 2 - 3, CS / 2 - 3, 2);
  coin.fillCircle(CS / 2, CS / 2 - 4, 2);
  coin.fillCircle(CS / 2 + 3, CS / 2 - 3, 2);
  // Блик
  coin.fillStyle(0xffffff, 0.3);
  coin.fillCircle(CS / 2 - 2, CS / 2 - 3, 3);
  coin.generateTexture('coin', CS, CS);
  coin.destroy();

  // --- Снежинка ---
  const snow = gfx(scene);
  snow.fillStyle(0xffffff, 0.9);
  snow.fillCircle(5, 5, 2);
  snow.lineStyle(0.5, 0xffffff, 0.6);
  snow.lineBetween(5, 0, 5, 10);
  snow.lineBetween(0, 5, 10, 5);
  snow.lineBetween(1, 1, 9, 9);
  snow.lineBetween(9, 1, 1, 9);
  snow.generateTexture('snowflake', 10, 10);
  snow.destroy();

  // --- Одеяло ---
  const blanket = gfx(scene);
  blanket.fillStyle(0xcc4444);
  blanket.fillRoundedRect(0, 0, 28, 22, 2);
  blanket.fillStyle(0xdd6666);
  blanket.fillRect(2, 2, 24, 5);
  blanket.lineStyle(1, 0xaa3333, 0.4);
  blanket.lineBetween(9, 0, 9, 22);
  blanket.lineBetween(19, 0, 19, 22);
  blanket.lineBetween(0, 11, 28, 11);
  blanket.generateTexture('blanket', 28, 22);
  blanket.destroy();

  // --- Корм ---
  const food = gfx(scene);
  food.fillStyle(0x667744);
  food.fillRoundedRect(2, 3, 20, 21, 2);
  food.fillStyle(0x556633);
  food.fillRect(4, 0, 16, 5);
  food.fillStyle(COLORS.gold);
  food.fillCircle(12, 15, 4);
  food.fillCircle(8, 10, 2);
  food.fillCircle(12, 9, 2);
  food.fillCircle(16, 10, 2);
  food.generateTexture('food', 24, 24);
  food.destroy();

  // --- Сердце (жизнь) ---
  const heart = gfx(scene);
  heart.fillStyle(0xee3344);
  heart.fillCircle(6, 6, 6);
  heart.fillCircle(14, 6, 6);
  heart.fillTriangle(0, 8, 10, 18, 20, 8);
  heart.generateTexture('heart', 20, 19);
  heart.destroy();
}

// ===== ФОНОВЫЕ ЗДАНИЯ И ДЕКОРАЦИИ =====
function generateBackgrounds(scene: Phaser.Scene) {
  // --- Панельная многоэтажка ---
  const bw = 130;
  const bh = 200;
  const building = gfx(scene);
  building.fillStyle(S.panel);
  building.fillRect(0, 0, bw, bh);
  // Панельные швы
  building.lineStyle(1, S.panelDark, 0.3);
  for (let y = 0; y < bh; y += 40) building.lineBetween(0, y, bw, y);
  for (let x = 0; x < bw; x += 32) building.lineBetween(x, 0, x, bh);
  // Окна 5x3
  for (let floor = 0; floor < 5; floor++) {
    for (let w = 0; w < 3; w++) {
      const wx = 10 + w * 40;
      const wy = 10 + floor * 40;
      const lit = Math.random() > 0.4;
      building.fillStyle(lit ? S.windowLit : S.windowDark);
      building.fillRect(wx, wy, 20, 24);
      building.lineStyle(1, 0x888888);
      building.strokeRect(wx, wy, 20, 24);
      building.lineBetween(wx + 10, wy, wx + 10, wy + 24);
      building.lineBetween(wx, wy + 12, wx + 20, wy + 12);
    }
  }
  // Балконные рейлинги
  building.lineStyle(1, 0x777777, 0.4);
  for (let floor = 1; floor < 5; floor++) {
    const ry = 10 + floor * 40 + 24;
    building.lineBetween(8, ry + 2, bw - 8, ry + 2);
  }
  // Водосточная труба
  building.fillStyle(0x666666, 0.4);
  building.fillRect(bw - 5, 0, 3, bh);
  // Крыша
  building.fillStyle(S.roof);
  building.fillRect(0, 0, bw, 4);
  building.generateTexture('building', bw, bh);
  building.destroy();

  // --- Высотка ---
  const tw = 90;
  const th = 260;
  const tower = gfx(scene);
  tower.fillStyle(S.concreteLighter);
  tower.fillRect(0, 0, tw, th);
  tower.lineStyle(0.5, S.concreteDark, 0.2);
  for (let y = 0; y < th; y += 26) tower.lineBetween(0, y, tw, y);
  for (let floor = 0; floor < 9; floor++) {
    for (let w = 0; w < 2; w++) {
      const wx = 14 + w * 40;
      const wy = 8 + floor * 28;
      const lit = Math.random() > 0.5;
      tower.fillStyle(lit ? S.windowLit : S.windowDark);
      tower.fillRect(wx, wy, 16, 18);
      tower.lineStyle(0.5, 0x888888);
      tower.strokeRect(wx, wy, 16, 18);
    }
  }
  tower.generateTexture('tower', tw, th);
  tower.destroy();

  // --- Гараж ---
  const garage = gfx(scene);
  garage.fillStyle(S.concrete);
  garage.fillRect(0, 6, 70, 48);
  garage.fillStyle(S.roof);
  garage.fillRect(0, 0, 70, 8);
  garage.fillStyle(0x556655);
  garage.fillRect(10, 18, 50, 36);
  garage.lineStyle(1, 0x444444);
  garage.strokeRect(10, 18, 50, 36);
  garage.lineBetween(35, 18, 35, 54);
  garage.fillStyle(S.rust, 0.2);
  garage.fillRect(12, 34, 22, 12);
  garage.generateTexture('garage', 70, 54);
  garage.destroy();

  // --- Забор бетонный ---
  const fence = gfx(scene);
  fence.fillStyle(S.concrete);
  fence.fillRect(0, 8, 70, 36);
  fence.fillStyle(S.concreteDark);
  fence.fillRect(0, 0, 6, 44);
  fence.fillRect(64, 0, 6, 44);
  fence.lineStyle(0.5, 0x888888, 0.3);
  fence.lineBetween(22, 8, 25, 44);
  fence.lineBetween(44, 12, 46, 44);
  fence.generateTexture('fence', 70, 44);
  fence.destroy();

  // --- Фонарный столб ---
  const lamp = gfx(scene);
  lamp.fillStyle(S.lampPost);
  lamp.fillRect(7, 12, 4, 78);
  lamp.fillStyle(0x444444);
  lamp.fillRect(4, 86, 10, 4);
  lamp.fillStyle(0x555555);
  lamp.fillRect(0, 8, 18, 4);
  // Лампа + свечение
  lamp.fillStyle(S.lampLight, 0.3);
  lamp.fillCircle(9, 14, 12);
  lamp.fillStyle(S.lampLight, 0.9);
  lamp.fillCircle(9, 12, 5);
  lamp.generateTexture('lamppost', 18, 90);
  lamp.destroy();

  // --- Мусорный бак ---
  const tb = gfx(scene);
  tb.fillStyle(S.trash);
  tb.fillRect(2, 8, 24, 24);
  tb.fillStyle(S.trashDark);
  tb.fillRect(0, 6, 28, 4);
  tb.fillStyle(0x444444);
  tb.fillRect(0, 14, 3, 10);
  tb.fillRect(25, 14, 3, 10);
  tb.fillStyle(0x998866);
  tb.fillRect(8, 0, 5, 8);
  tb.fillRect(16, 2, 6, 6);
  tb.generateTexture('trashcan', 28, 32);
  tb.destroy();

  // --- Дерево ---
  const tree = gfx(scene);
  tree.fillStyle(S.treeTrunk);
  tree.fillRect(16, 34, 8, 32);
  tree.fillStyle(S.tree);
  tree.fillCircle(20, 22, 18);
  tree.fillCircle(12, 28, 14);
  tree.fillCircle(28, 28, 14);
  tree.fillStyle(S.treeDark, 0.4);
  tree.fillCircle(16, 20, 10);
  tree.fillCircle(24, 24, 8);
  // Светлые пятна листвы
  tree.fillStyle(0x558844, 0.3);
  tree.fillCircle(24, 16, 6);
  tree.fillCircle(14, 26, 5);
  tree.generateTexture('tree', 40, 66);
  tree.destroy();

  // --- Зимнее дерево ---
  const wtree = gfx(scene);
  wtree.fillStyle(S.treeTrunk);
  wtree.fillRect(14, 22, 6, 44);
  wtree.lineStyle(2.5, 0x554433);
  wtree.lineBetween(17, 28, 5, 12);
  wtree.lineBetween(17, 28, 29, 10);
  wtree.lineBetween(17, 35, 7, 24);
  wtree.lineBetween(17, 35, 27, 22);
  wtree.lineBetween(17, 20, 12, 6);
  wtree.lineBetween(17, 20, 25, 4);
  wtree.fillStyle(S.snow, 0.8);
  wtree.fillCircle(5, 11, 4);
  wtree.fillCircle(29, 9, 4);
  wtree.fillCircle(7, 23, 3);
  wtree.fillCircle(27, 21, 3);
  wtree.fillCircle(12, 5, 3);
  wtree.fillCircle(25, 3, 3);
  wtree.generateTexture('tree_winter', 34, 66);
  wtree.destroy();

  // --- Лужа ---
  const puddle = gfx(scene);
  puddle.fillStyle(S.puddle, 0.4);
  puddle.fillEllipse(18, 7, 34, 12);
  puddle.generateTexture('puddle', 36, 14);
  puddle.destroy();

  // --- Скамейка ---
  const bench = gfx(scene);
  bench.fillStyle(0x665533);
  bench.fillRect(0, 10, 44, 4);
  bench.fillRect(0, 0, 44, 3);
  bench.fillStyle(0x444444);
  bench.fillRect(4, 14, 4, 12);
  bench.fillRect(36, 14, 4, 12);
  bench.generateTexture('bench', 44, 26);
  bench.destroy();
}

// ===== ВРАГИ =====
function generateEnemies(scene: Phaser.Scene) {
  const EW = ENEMY.width;  // 36
  const EH = ENEMY.height; // 52
  const dc = gfx(scene);

  // Контурная тень
  dc.fillStyle(0x000000, 0.12);
  dc.fillRoundedRect(5, 14, 24, 22, 3);

  // --- Ботинки ---
  dc.fillStyle(0x222222);
  dc.fillRoundedRect(3, 46, 10, 6, 1);
  dc.fillRoundedRect(21, 46, 10, 6, 1);

  // --- Ноги ---
  dc.fillStyle(0x333344);
  dc.fillRect(5, 34, 8, 14);
  dc.fillRect(21, 34, 8, 14);

  // --- Тело (форма — коренастый) ---
  dc.fillStyle(S.uniform);
  dc.fillRoundedRect(3, 14, 28, 22, 3);
  // Погоны
  dc.fillStyle(S.uniformLight);
  dc.fillRect(3, 14, 6, 3);
  dc.fillRect(25, 14, 6, 3);
  // Карман на груди
  dc.fillStyle(S.uniformDark, 0.4);
  dc.fillRect(6, 22, 8, 6);
  dc.lineStyle(0.5, 0x556677, 0.6);
  dc.strokeRect(6, 22, 8, 6);

  // --- Рукава ---
  dc.fillStyle(S.uniformDark);
  dc.fillRoundedRect(0, 16, 5, 14, 1);
  dc.fillRoundedRect(29, 16, 5, 14, 1);

  // --- Кисти ---
  dc.fillStyle(S.skin);
  dc.fillCircle(2, 30, 3);
  dc.fillCircle(32, 30, 3);

  // --- Сачок-петля (торчит над головой, ключевой идентификатор) ---
  dc.fillStyle(0x886644);
  dc.fillRect(30, 2, 3, 30);
  // Петля сверху
  dc.lineStyle(2, 0x888888);
  dc.strokeCircle(31, 2, 6);
  // Верёвка
  dc.lineStyle(1, 0x666666);
  dc.lineBetween(31, 8, 31, 14);

  // --- Голова ---
  dc.fillStyle(S.skin);
  dc.fillCircle(17, 10, 9);

  // --- Кепка ---
  dc.fillStyle(S.cap);
  dc.fillRect(8, 1, 18, 7);
  dc.fillRect(6, 7, 22, 2);
  // Козырёк
  dc.fillStyle(S.capVisor);
  dc.fillRect(6, 8, 14, 3);

  // --- Злые глаза ---
  dc.fillStyle(0xffffff);
  dc.fillCircle(13, 10, 2.5);
  dc.fillCircle(21, 10, 2.5);
  dc.fillStyle(0x222222);
  dc.fillCircle(13, 10, 1.5);
  dc.fillCircle(21, 10, 1.5);
  // Сведённые брови
  dc.lineStyle(1.5, 0x222222);
  dc.lineBetween(10, 6, 14, 8);
  dc.lineBetween(24, 6, 20, 8);

  // --- Злой рот ---
  dc.lineStyle(1.5, 0x884444);
  dc.lineBetween(13, 14, 21, 14);
  dc.lineBetween(13, 14, 14, 15);
  dc.lineBetween(21, 14, 20, 15);

  dc.generateTexture('dogcatcher', EW, EH);
  dc.destroy();

  // --- Снаряд-сердечко (14x14) ---
  const hp = gfx(scene);
  // Свечение
  hp.fillStyle(0xff6688, 0.25);
  hp.fillCircle(7, 7, 7);
  // Основное сердце
  hp.fillStyle(0xee3355);
  hp.fillCircle(4, 4, 4);
  hp.fillCircle(10, 4, 4);
  hp.fillTriangle(0, 6, 7, 13, 14, 6);
  // Блик
  hp.fillStyle(0xff8899, 0.6);
  hp.fillCircle(4, 3, 2);
  // Искра
  hp.fillStyle(0xffffff, 0.7);
  hp.fillCircle(3, 2, 1);
  hp.generateTexture('heart_projectile', 14, 14);
  hp.destroy();

  // --- Облако ---
  const cl = gfx(scene);
  cl.fillStyle(0xffffff, 0.7);
  cl.fillCircle(22, 20, 16);
  cl.fillCircle(44, 17, 20);
  cl.fillCircle(66, 20, 16);
  cl.fillCircle(33, 13, 14);
  cl.fillCircle(55, 13, 14);
  cl.fillStyle(0xffffff, 0.5);
  cl.fillCircle(38, 22, 12);
  cl.fillCircle(50, 22, 12);
  cl.generateTexture('cloud', 88, 38);
  cl.destroy();
}

// ===== ДЕКОРАЦИИ =====
function generateDecorations(scene: Phaser.Scene) {
  // --- Столб с проводами ---
  const pole = gfx(scene);
  pole.fillStyle(0x555555);
  pole.fillRect(4, 0, 4, 88);
  pole.fillRect(0, 4, 12, 3);
  pole.lineStyle(1, 0x333333);
  pole.lineBetween(0, 5, 12, 5);
  pole.generateTexture('pole', 12, 88);
  pole.destroy();

  // --- Урна ---
  const urn = gfx(scene);
  urn.fillStyle(0x666655);
  urn.fillRect(2, 4, 14, 16);
  urn.fillStyle(0x555544);
  urn.fillRect(0, 2, 18, 3);
  urn.fillStyle(0x444444);
  urn.fillRect(6, 20, 6, 4);
  urn.generateTexture('urn', 18, 24);
  urn.destroy();

  // --- Знак дорожный ---
  const sign = gfx(scene);
  sign.fillStyle(0x888888);
  sign.fillRect(7, 16, 4, 38);
  sign.fillStyle(0xee3333);
  sign.fillCircle(9, 9, 9);
  sign.fillStyle(0xffffff);
  sign.fillCircle(9, 9, 7);
  sign.fillStyle(0xee3333);
  sign.fillRect(4, 8, 10, 2);
  sign.generateTexture('roadsign', 18, 54);
  sign.destroy();
}

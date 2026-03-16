import * as Phaser from 'phaser';
import { COLORS, PLAYER, ANIMAL, COIN, TILE_SIZE } from '@/lib/constants';

// Советские цвета
const SOVIET = {
  concrete: 0xb0a89a,
  concreteDark: 0x8a8278,
  concreteLighter: 0xc4bdb0,
  panel: 0xc8c0b0,
  panelDark: 0xa09888,
  window: 0x5588aa,
  windowLit: 0xffdd66,
  windowDark: 0x334455,
  roof: 0x6b5b4f,
  asphalt: 0x444444,
  asphaltLight: 0x555555,
  curb: 0x999999,
  fence: 0x665544,
  fenceWire: 0x888888,
  rust: 0x884422,
  pipe: 0x778866,
  lampPost: 0x555555,
  lampLight: 0xffeeaa,
  trash: 0x556644,
  trashDark: 0x3a4830,
  tree: 0x446633,
  treeTrunk: 0x664422,
  treeWinter: 0x667766,
  snow: 0xe8e8f0,
  snowGround: 0xdde0e8,
  ice: 0xaaccdd,
  sky: 0x8aafe0,
  skyWinter: 0xb0b8c8,
  skyEvening: 0x445566,
  puddle: 0x556688,
  dirt: 0x886644,
  brick: 0xaa5533,
  brickDark: 0x883322,
  road: 0x3a3a3a,
  roadLine: 0xdddd44,
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

function generateCharacters(scene: Phaser.Scene) {
  // --- Игрок: блондинка-руководительница приюта ---
  // 8 кадров: idle (0), walk (1-6), jump (7), каждый 28x44
  const FW = PLAYER.width;  // 28
  const FH = PLAYER.height; // 44
  const FRAMES = 8;
  const p = gfx(scene);

  // Цвета персонажа
  const SKIN = 0xf5c8a0;
  const HAIR = 0xf0d060;    // блондинка
  const JACKET = 0x447744;   // зелёная куртка
  const JACKET_DARK = 0x3d6b3d;
  const JEANS = 0x334466;
  const BOOTS = 0x333333;

  // Рисуем каждый кадр
  for (let frame = 0; frame < FRAMES; frame++) {
    const ox = frame * FW; // offset x

    // Фазы ног/рук для ходьбы (6 кадров walk)
    let legOffsetL = 0, legOffsetR = 0;
    let armOffsetL = 0, armOffsetR = 0;

    if (frame >= 1 && frame <= 6) {
      // Walk animation: sine-based offsets
      const phase = ((frame - 1) / 6) * Math.PI * 2;
      legOffsetL = Math.sin(phase) * 3;
      legOffsetR = Math.sin(phase + Math.PI) * 3;
      armOffsetL = Math.sin(phase + Math.PI) * 2;
      armOffsetR = Math.sin(phase) * 2;
    }

    const isJump = frame === 7;

    // -- Ботинки --
    p.fillStyle(BOOTS);
    if (isJump) {
      // Подогнутые ноги при прыжке
      p.fillRect(ox + 5, 38, 7, 4);
      p.fillRect(ox + 16, 38, 7, 4);
    } else {
      p.fillRect(ox + 4 + legOffsetL, 40, 7, 4);
      p.fillRect(ox + 17 + legOffsetR, 40, 7, 4);
    }

    // -- Ноги (джинсы) --
    p.fillStyle(JEANS);
    if (isJump) {
      p.fillRect(ox + 7, 30, 6, 10);
      p.fillRect(ox + 15, 30, 6, 10);
    } else {
      p.fillRect(ox + 6 + legOffsetL, 28, 6, 14);
      p.fillRect(ox + 16 + legOffsetR, 28, 6, 14);
    }

    // -- Тело (зелёная куртка) --
    p.fillStyle(JACKET);
    p.fillRect(ox + 5, 14, 18, 16);

    // -- Рукава --
    p.fillStyle(JACKET_DARK);
    if (isJump) {
      // Руки подняты
      p.fillRect(ox + 1, 10, 5, 8);
      p.fillRect(ox + 22, 10, 5, 8);
    } else {
      p.fillRect(ox + 1, 16 + armOffsetL, 5, 10);
      p.fillRect(ox + 22, 16 + armOffsetR, 5, 10);
    }

    // -- Кисти рук --
    p.fillStyle(SKIN);
    if (isJump) {
      p.fillRect(ox + 2, 8, 3, 3);
      p.fillRect(ox + 23, 8, 3, 3);
    } else {
      p.fillRect(ox + 2, 25 + armOffsetL, 3, 3);
      p.fillRect(ox + 23, 25 + armOffsetR, 3, 3);
    }

    // -- Бейдж-лапка на куртке --
    p.fillStyle(COLORS.gold);
    p.fillRect(ox + 9, 22, 5, 4);
    // Лапка на бейдже
    p.fillStyle(0x886622);
    p.fillCircle(ox + 11.5, 24, 1);
    p.fillCircle(ox + 10, 22.5, 0.7);
    p.fillCircle(ox + 13, 22.5, 0.7);

    // -- Голова --
    p.fillStyle(SKIN);
    p.fillCircle(ox + 14, 9, 7);

    // -- Волосы (короткие, светлые) --
    p.fillStyle(HAIR);
    p.fillRect(ox + 7, 2, 14, 6);
    p.fillRect(ox + 7, 4, 3, 6); // бок
    p.fillRect(ox + 18, 4, 3, 6); // бок

    // -- Глаза --
    p.fillStyle(0x3366aa);
    p.fillCircle(ox + 11, 8, 1.5);
    p.fillCircle(ox + 17, 8, 1.5);
    // Зрачки
    p.fillStyle(0x111111);
    p.fillCircle(ox + 11, 8, 0.7);
    p.fillCircle(ox + 17, 8, 0.7);

    // -- Улыбка --
    p.lineStyle(1, 0xcc6644);
    p.beginPath();
    p.arc(ox + 14, 12, 2.5, 0.2, Math.PI - 0.2, false);
    p.strokePath();
  }

  p.generateTexture('player_sheet', FW * FRAMES, FH);
  p.destroy();

  // Создаём spritesheet конфиг
  scene.textures.get('player_sheet').add('__BASE', 0, 0, 0, FW * FRAMES, FH);
  // Добавляем кадры вручную
  for (let i = 0; i < FRAMES; i++) {
    scene.textures.get('player_sheet').add(i, 0, i * FW, 0, FW, FH);
  }

  // --- Щенок ---
  const pup = gfx(scene);
  // Тело
  pup.fillStyle(0xbb8844);
  pup.fillRoundedRect(3, 6, 14, 8, 3);
  // Голова
  pup.fillStyle(0xcc9955);
  pup.fillCircle(5, 6, 5);
  // Уши висячие
  pup.fillStyle(0x996633);
  pup.fillEllipse(1, 4, 4, 6);
  pup.fillEllipse(9, 4, 4, 6);
  // Глаза
  pup.fillStyle(0x222222);
  pup.fillCircle(3, 5, 1.5);
  pup.fillCircle(7, 5, 1.5);
  // Нос
  pup.fillStyle(0x332211);
  pup.fillCircle(5, 7, 1);
  // Хвост
  pup.fillStyle(0xbb8844);
  pup.fillRect(16, 4, 4, 3);
  // Лапы
  pup.fillStyle(0x996633);
  pup.fillRect(5, 13, 3, 3);
  pup.fillRect(12, 13, 3, 3);
  pup.generateTexture('puppy', ANIMAL.width, ANIMAL.height);
  pup.destroy();

  // --- Котёнок ---
  const kit = gfx(scene);
  // Тело
  kit.fillStyle(0xdd9944);
  kit.fillRoundedRect(3, 6, 14, 7, 3);
  // Голова
  kit.fillStyle(0xeeaa55);
  kit.fillCircle(5, 5, 5);
  // Уши треугольные
  kit.fillStyle(0xcc8833);
  kit.fillTriangle(1, 3, 0, -2, 4, 1);
  kit.fillTriangle(7, 3, 10, -2, 6, 1);
  // Глаза (зелёные)
  kit.fillStyle(0x33aa44);
  kit.fillCircle(3, 5, 1.5);
  kit.fillCircle(7, 5, 1.5);
  // Зрачки
  kit.fillStyle(0x111111);
  kit.fillRect(3, 4, 1, 3);
  kit.fillRect(7, 4, 1, 3);
  // Усы
  kit.lineStyle(0.5, 0x666666);
  kit.lineBetween(0, 6, 5, 7);
  kit.lineBetween(0, 8, 5, 7);
  kit.lineBetween(10, 6, 5, 7);
  kit.lineBetween(10, 8, 5, 7);
  // Хвост изогнутый
  kit.lineStyle(2, 0xdd9944);
  kit.beginPath();
  kit.arc(19, 4, 4, Math.PI * 0.5, Math.PI * 1.5, false);
  kit.strokePath();
  // Лапы
  kit.fillStyle(0xcc8833);
  kit.fillRect(5, 12, 3, 3);
  kit.fillRect(12, 12, 3, 3);
  kit.generateTexture('kitten', ANIMAL.width, ANIMAL.height);
  kit.destroy();
}

function generateTerrain(scene: Phaser.Scene) {
  // --- Асфальт (земля город) ---
  const ground = gfx(scene);
  ground.fillStyle(SOVIET.asphalt);
  ground.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  // Трещины
  ground.lineStyle(0.5, 0x333333, 0.4);
  ground.lineBetween(5, 0, 12, TILE_SIZE);
  ground.lineBetween(20, 5, 25, TILE_SIZE);
  // Бордюр сверху
  ground.fillStyle(SOVIET.curb);
  ground.fillRect(0, 0, TILE_SIZE, 3);
  ground.generateTexture('ground', TILE_SIZE, TILE_SIZE);
  ground.destroy();

  // --- Бетонная платформа ---
  const plat = gfx(scene);
  plat.fillStyle(SOVIET.concrete);
  plat.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  // Текстура бетона
  plat.fillStyle(SOVIET.concreteDark, 0.3);
  plat.fillRect(0, 0, TILE_SIZE, 2);
  plat.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2);
  // Пятна
  plat.fillStyle(0x000000, 0.05);
  plat.fillCircle(8, 12, 4);
  plat.fillCircle(22, 20, 3);
  plat.generateTexture('platform', TILE_SIZE, TILE_SIZE);
  plat.destroy();

  // --- Снежная земля ---
  const snowGround = gfx(scene);
  snowGround.fillStyle(SOVIET.asphalt);
  snowGround.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  snowGround.fillStyle(SOVIET.snow);
  snowGround.fillRect(0, 0, TILE_SIZE, 6);
  snowGround.fillStyle(SOVIET.snowGround, 0.5);
  snowGround.fillCircle(5, 3, 4);
  snowGround.fillCircle(20, 2, 5);
  snowGround.generateTexture('ground_snow', TILE_SIZE, TILE_SIZE);
  snowGround.destroy();

  // --- Дорога ---
  const road = gfx(scene);
  road.fillStyle(SOVIET.road);
  road.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  // Разметка пунктиром
  road.fillStyle(SOVIET.roadLine);
  road.fillRect(12, 14, 8, 3);
  road.generateTexture('road', TILE_SIZE, TILE_SIZE);
  road.destroy();

  // --- Труба (подвал/стройка) ---
  const pipe = gfx(scene);
  pipe.fillStyle(SOVIET.pipe);
  pipe.fillRect(0, 4, TILE_SIZE, TILE_SIZE - 8);
  pipe.fillStyle(SOVIET.rust, 0.4);
  pipe.fillRect(0, 6, TILE_SIZE, 3);
  pipe.lineStyle(1, 0x555555, 0.3);
  pipe.strokeRect(0, 4, TILE_SIZE, TILE_SIZE - 8);
  // Болты
  pipe.fillStyle(0x444444);
  pipe.fillCircle(4, TILE_SIZE / 2, 2);
  pipe.fillCircle(TILE_SIZE - 4, TILE_SIZE / 2, 2);
  pipe.generateTexture('pipe', TILE_SIZE, TILE_SIZE);
  pipe.destroy();
}

function generateObstacles(scene: Phaser.Scene) {
  // --- Машина (детальнее) ---
  const car = gfx(scene);
  // Кузов
  car.fillStyle(0xcc3333);
  car.fillRoundedRect(0, 10, 52, 16, 3);
  // Кабина
  car.fillStyle(0xaa2222);
  car.fillRoundedRect(10, 2, 22, 12, 2);
  // Окна
  car.fillStyle(SOVIET.window);
  car.fillRect(12, 4, 8, 7);
  car.fillRect(22, 4, 8, 7);
  // Фары
  car.fillStyle(0xffdd44);
  car.fillCircle(3, 16, 2);
  car.fillCircle(49, 16, 2);
  // Колёса
  car.fillStyle(0x222222);
  car.fillCircle(10, 28, 5);
  car.fillCircle(42, 28, 5);
  // Диски
  car.fillStyle(0x666666);
  car.fillCircle(10, 28, 2);
  car.fillCircle(42, 28, 2);
  // Номер
  car.fillStyle(0xffffff);
  car.fillRect(20, 22, 12, 4);
  car.generateTexture('car', 52, 34);
  car.destroy();

  // --- Падающий кирпич ---
  const brick = gfx(scene);
  brick.fillStyle(SOVIET.brick);
  brick.fillRect(0, 0, 22, 14);
  brick.fillStyle(SOVIET.brickDark, 0.3);
  brick.fillRect(0, 0, 22, 3);
  brick.lineStyle(1, 0x662211, 0.5);
  brick.lineBetween(11, 0, 11, 14);
  brick.lineStyle(1, 0x000000, 0.2);
  brick.strokeRect(0, 0, 22, 14);
  brick.generateTexture('brick', 22, 14);
  brick.destroy();

  // --- Люк ---
  const hatch = gfx(scene);
  hatch.fillStyle(0x555555);
  hatch.fillCircle(16, 16, 15);
  hatch.fillStyle(0x444444);
  hatch.fillCircle(16, 16, 12);
  // Рельеф
  hatch.lineStyle(1.5, 0x666666);
  hatch.strokeCircle(16, 16, 10);
  hatch.strokeCircle(16, 16, 6);
  hatch.lineBetween(16, 4, 16, 28);
  hatch.lineBetween(4, 16, 28, 16);
  // Ручка
  hatch.fillStyle(0x777777);
  hatch.fillRect(14, 14, 4, 4);
  hatch.generateTexture('hatch', 32, 32);
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
  box.fillRect(0, 6, 32, 22);
  box.fillStyle(0x886644);
  box.fillRect(0, 6, 32, 4);
  // Створки
  box.fillStyle(0xaa8866);
  box.fillTriangle(0, 6, 8, 0, 16, 6);
  box.fillTriangle(16, 6, 24, 0, 32, 6);
  box.lineStyle(1, 0x665533);
  box.strokeRect(0, 6, 32, 22);
  box.generateTexture('box', 32, 28);
  box.destroy();

  // --- Приют ---
  const sh = gfx(scene);
  // Стены
  sh.fillStyle(SOVIET.panel);
  sh.fillRect(2, 20, 60, 44);
  // Крыша
  sh.fillStyle(SOVIET.roof);
  sh.fillRect(0, 16, 64, 6);
  sh.fillTriangle(0, 16, 32, 4, 64, 16);
  // Окна
  sh.fillStyle(SOVIET.windowLit);
  sh.fillRect(6, 26, 10, 10);
  sh.fillRect(48, 26, 10, 10);
  // Рамы
  sh.lineStyle(1, 0x666666);
  sh.strokeRect(6, 26, 10, 10);
  sh.lineBetween(11, 26, 11, 36);
  sh.lineBetween(6, 31, 16, 31);
  sh.strokeRect(48, 26, 10, 10);
  sh.lineBetween(53, 26, 53, 36);
  sh.lineBetween(48, 31, 58, 31);
  // Дверь
  sh.fillStyle(0x556633);
  sh.fillRect(24, 38, 16, 26);
  sh.fillStyle(0x667744);
  sh.fillRect(26, 40, 12, 22);
  // Ручка
  sh.fillStyle(COLORS.gold);
  sh.fillCircle(35, 52, 1.5);
  // Вывеска
  sh.fillStyle(0x446633);
  sh.fillRect(12, 8, 40, 8);
  sh.fillStyle(COLORS.gold);
  sh.fillRect(14, 9, 36, 6);
  sh.generateTexture('shelter', 64, 64);
  sh.destroy();
}

function generateCollectibles(scene: Phaser.Scene) {
  // --- Монета-лапка ---
  const coin = gfx(scene);
  coin.fillStyle(COLORS.gold);
  coin.fillCircle(8, 8, 7);
  coin.fillStyle(0xeebb44);
  coin.fillCircle(8, 7, 6);
  // Лапка
  coin.fillStyle(0x886622);
  coin.fillCircle(8, 9, 2.5);
  coin.fillCircle(5, 5, 1.5);
  coin.fillCircle(8, 4, 1.5);
  coin.fillCircle(11, 5, 1.5);
  coin.generateTexture('coin', COIN.size, COIN.size);
  coin.destroy();

  // --- Снежинка ---
  const snow = gfx(scene);
  snow.fillStyle(0xffffff, 0.9);
  snow.fillCircle(4, 4, 2);
  snow.lineStyle(0.5, 0xffffff, 0.6);
  snow.lineBetween(4, 0, 4, 8);
  snow.lineBetween(0, 4, 8, 4);
  snow.lineBetween(1, 1, 7, 7);
  snow.lineBetween(7, 1, 1, 7);
  snow.generateTexture('snowflake', 8, 8);
  snow.destroy();

  // --- Одеяло ---
  const blanket = gfx(scene);
  blanket.fillStyle(0xcc4444);
  blanket.fillRoundedRect(0, 0, 24, 20, 2);
  blanket.fillStyle(0xdd6666);
  blanket.fillRect(2, 2, 20, 4);
  // Клетка
  blanket.lineStyle(1, 0xaa3333, 0.4);
  blanket.lineBetween(8, 0, 8, 20);
  blanket.lineBetween(16, 0, 16, 20);
  blanket.lineBetween(0, 10, 24, 10);
  blanket.generateTexture('blanket', 24, 20);
  blanket.destroy();

  // --- Корм ---
  const food = gfx(scene);
  // Пакет
  food.fillStyle(0x667744);
  food.fillRoundedRect(2, 3, 16, 17, 2);
  // Верх пакета
  food.fillStyle(0x556633);
  food.fillRect(4, 0, 12, 5);
  // Лапка на пакете
  food.fillStyle(COLORS.gold);
  food.fillCircle(10, 12, 3);
  food.fillCircle(7, 8, 1.5);
  food.fillCircle(10, 7, 1.5);
  food.fillCircle(13, 8, 1.5);
  food.generateTexture('food', 20, 20);
  food.destroy();

  // --- Сердце ---
  const heart = gfx(scene);
  heart.fillStyle(0xee3344);
  heart.fillCircle(5, 5, 5);
  heart.fillCircle(13, 5, 5);
  heart.fillTriangle(0, 7, 9, 16, 18, 7);
  heart.generateTexture('heart', 18, 17);
  heart.destroy();
}

function generateBackgrounds(scene: Phaser.Scene) {
  // --- Панельная многоэтажка (фон) ---
  const bw = 120;
  const bh = 180;
  const building = gfx(scene);
  // Стена
  building.fillStyle(SOVIET.panel);
  building.fillRect(0, 0, bw, bh);
  // Панельные швы
  building.lineStyle(1, SOVIET.panelDark, 0.3);
  for (let y = 0; y < bh; y += 36) {
    building.lineBetween(0, y, bw, y);
  }
  for (let x = 0; x < bw; x += 30) {
    building.lineBetween(x, 0, x, bh);
  }
  // Окна (5 этажей x 3 окна)
  for (let floor = 0; floor < 5; floor++) {
    for (let w = 0; w < 3; w++) {
      const wx = 10 + w * 38;
      const wy = 8 + floor * 36;
      const lit = Math.random() > 0.4;
      building.fillStyle(lit ? SOVIET.windowLit : SOVIET.windowDark);
      building.fillRect(wx, wy, 18, 22);
      // Рама
      building.lineStyle(1, 0x888888);
      building.strokeRect(wx, wy, 18, 22);
      building.lineBetween(wx + 9, wy, wx + 9, wy + 22);
      building.lineBetween(wx, wy + 11, wx + 18, wy + 11);
    }
  }
  // Крыша
  building.fillStyle(SOVIET.roof);
  building.fillRect(0, 0, bw, 4);
  building.generateTexture('building', bw, bh);
  building.destroy();

  // --- Высотка (фон дальний) ---
  const tw = 80;
  const th = 240;
  const tower = gfx(scene);
  tower.fillStyle(SOVIET.concreteLighter);
  tower.fillRect(0, 0, tw, th);
  // Швы
  tower.lineStyle(0.5, SOVIET.concreteDark, 0.2);
  for (let y = 0; y < th; y += 24) {
    tower.lineBetween(0, y, tw, y);
  }
  // Окна мелкие
  for (let floor = 0; floor < 9; floor++) {
    for (let w = 0; w < 2; w++) {
      const wx = 12 + w * 36;
      const wy = 6 + floor * 26;
      const lit = Math.random() > 0.5;
      tower.fillStyle(lit ? SOVIET.windowLit : SOVIET.windowDark);
      tower.fillRect(wx, wy, 14, 16);
      tower.lineStyle(0.5, 0x888888);
      tower.strokeRect(wx, wy, 14, 16);
    }
  }
  tower.generateTexture('tower', tw, th);
  tower.destroy();

  // --- Гараж / сарай ---
  const gw = 64;
  const gh = 48;
  const garage = gfx(scene);
  garage.fillStyle(SOVIET.concrete);
  garage.fillRect(0, 6, gw, gh - 6);
  garage.fillStyle(SOVIET.roof);
  garage.fillRect(0, 0, gw, 8);
  // Ворота
  garage.fillStyle(0x556655);
  garage.fillRect(8, 16, 48, 32);
  garage.lineStyle(1, 0x444444);
  garage.strokeRect(8, 16, 48, 32);
  garage.lineBetween(32, 16, 32, 48);
  // Ржавчина
  garage.fillStyle(SOVIET.rust, 0.2);
  garage.fillRect(10, 30, 20, 10);
  garage.generateTexture('garage', gw, gh);
  garage.destroy();

  // --- Забор бетонный ---
  const fw = 64;
  const fh = 40;
  const fence = gfx(scene);
  fence.fillStyle(SOVIET.concrete);
  fence.fillRect(0, 8, fw, fh - 8);
  // Столбы
  fence.fillStyle(SOVIET.concreteDark);
  fence.fillRect(0, 0, 6, fh);
  fence.fillRect(fw - 6, 0, 6, fh);
  // Трещина
  fence.lineStyle(0.5, 0x888888, 0.3);
  fence.lineBetween(20, 8, 25, fh);
  fence.lineBetween(40, 12, 42, fh);
  fence.generateTexture('fence', fw, fh);
  fence.destroy();

  // --- Фонарный столб ---
  const lh = 80;
  const lamp = gfx(scene);
  // Столб
  lamp.fillStyle(SOVIET.lampPost);
  lamp.fillRect(6, 10, 4, lh - 10);
  // Основание
  lamp.fillStyle(0x444444);
  lamp.fillRect(3, lh - 4, 10, 4);
  // Козырёк
  lamp.fillStyle(0x555555);
  lamp.fillRect(0, 6, 16, 4);
  // Лампа
  lamp.fillStyle(SOVIET.lampLight, 0.9);
  lamp.fillCircle(8, 10, 4);
  lamp.generateTexture('lamppost', 16, lh);
  lamp.destroy();

  // --- Мусорный бак ---
  const tb = gfx(scene);
  tb.fillStyle(SOVIET.trash);
  tb.fillRect(2, 6, 20, 22);
  // Крышка
  tb.fillStyle(SOVIET.trashDark);
  tb.fillRect(0, 4, 24, 4);
  // Ручки
  tb.fillStyle(0x444444);
  tb.fillRect(0, 12, 3, 8);
  tb.fillRect(21, 12, 3, 8);
  // Мусор торчит
  tb.fillStyle(0x998866);
  tb.fillRect(6, 0, 4, 6);
  tb.fillRect(14, 2, 5, 4);
  tb.generateTexture('trashcan', 24, 28);
  tb.destroy();

  // --- Дерево ---
  const tree = gfx(scene);
  // Ствол
  tree.fillStyle(SOVIET.treeTrunk);
  tree.fillRect(14, 30, 8, 30);
  // Крона
  tree.fillStyle(SOVIET.tree);
  tree.fillCircle(18, 20, 16);
  tree.fillCircle(10, 25, 12);
  tree.fillCircle(26, 25, 12);
  // Тёмные пятна
  tree.fillStyle(0x335522, 0.4);
  tree.fillCircle(14, 18, 8);
  tree.fillCircle(22, 22, 6);
  tree.generateTexture('tree', 36, 60);
  tree.destroy();

  // --- Зимнее дерево ---
  const wtree = gfx(scene);
  wtree.fillStyle(SOVIET.treeTrunk);
  wtree.fillRect(12, 20, 6, 40);
  // Ветки
  wtree.lineStyle(2, 0x554433);
  wtree.lineBetween(15, 25, 4, 10);
  wtree.lineBetween(15, 25, 26, 8);
  wtree.lineBetween(15, 32, 6, 22);
  wtree.lineBetween(15, 32, 24, 20);
  wtree.lineBetween(15, 18, 10, 6);
  wtree.lineBetween(15, 18, 22, 4);
  // Снег на ветках
  wtree.fillStyle(SOVIET.snow, 0.8);
  wtree.fillCircle(4, 9, 3);
  wtree.fillCircle(26, 7, 3);
  wtree.fillCircle(6, 21, 2);
  wtree.fillCircle(24, 19, 2);
  wtree.fillCircle(10, 5, 2);
  wtree.fillCircle(22, 3, 2);
  wtree.generateTexture('tree_winter', 30, 60);
  wtree.destroy();

  // --- Лужа ---
  const puddle = gfx(scene);
  puddle.fillStyle(SOVIET.puddle, 0.4);
  puddle.fillEllipse(16, 6, 30, 10);
  puddle.generateTexture('puddle', 32, 12);
  puddle.destroy();

  // --- Скамейка ---
  const bench = gfx(scene);
  bench.fillStyle(0x665533);
  // Сиденье
  bench.fillRect(0, 8, 40, 4);
  // Спинка
  bench.fillRect(0, 0, 40, 3);
  // Ножки
  bench.fillStyle(0x444444);
  bench.fillRect(4, 12, 3, 10);
  bench.fillRect(33, 12, 3, 10);
  bench.generateTexture('bench', 40, 22);
  bench.destroy();
}

function generateEnemies(scene: Phaser.Scene) {
  // --- Догхантер (ловец животных) ---
  const dc = gfx(scene);
  // Ботинки
  dc.fillStyle(0x222222);
  dc.fillRect(2, 36, 7, 4);
  dc.fillRect(15, 36, 7, 4);
  // Ноги
  dc.fillStyle(0x333333);
  dc.fillRect(4, 26, 6, 12);
  dc.fillRect(14, 26, 6, 12);
  // Тело (серая форма)
  dc.fillStyle(0x556666);
  dc.fillRect(3, 12, 18, 16);
  // Рукава
  dc.fillStyle(0x4a5b5b);
  dc.fillRect(0, 14, 4, 10);
  dc.fillRect(20, 14, 4, 10);
  // Сачок/петля (в правой руке)
  dc.fillStyle(0x886644);
  dc.fillRect(21, 6, 3, 20);
  dc.lineStyle(1.5, 0x888888);
  dc.strokeCircle(22.5, 4, 5);
  // Голова
  dc.fillStyle(0xe8b88a);
  dc.fillCircle(12, 8, 7);
  // Кепка
  dc.fillStyle(0x444444);
  dc.fillRect(5, 1, 14, 5);
  dc.fillRect(3, 5, 18, 2);
  // Козырёк
  dc.fillStyle(0x333333);
  dc.fillRect(3, 6, 10, 2);
  // Злые глаза (сведённые брови)
  dc.fillStyle(0x222222);
  dc.fillCircle(9, 8, 1.5);
  dc.fillCircle(15, 8, 1.5);
  dc.lineStyle(1, 0x222222);
  dc.lineBetween(7, 5, 10, 6);
  dc.lineBetween(17, 5, 14, 6);
  // Рот
  dc.lineStyle(1, 0x884444);
  dc.lineBetween(9, 12, 15, 12);
  dc.generateTexture('dogcatcher', 24, 40);
  dc.destroy();

  // --- Снаряд-сердечко ---
  const hp = gfx(scene);
  hp.fillStyle(0xee3355);
  hp.fillCircle(3, 3, 3);
  hp.fillCircle(9, 3, 3);
  hp.fillTriangle(0, 5, 6, 12, 12, 5);
  // Блик
  hp.fillStyle(0xff8899, 0.6);
  hp.fillCircle(3, 2, 1.5);
  hp.generateTexture('heart_projectile', 12, 12);
  hp.destroy();

  // --- Облако ---
  const cl = gfx(scene);
  cl.fillStyle(0xffffff, 0.7);
  cl.fillCircle(20, 18, 14);
  cl.fillCircle(40, 15, 18);
  cl.fillCircle(60, 18, 14);
  cl.fillCircle(30, 12, 12);
  cl.fillCircle(50, 12, 12);
  cl.fillStyle(0xffffff, 0.5);
  cl.fillCircle(35, 20, 10);
  cl.fillCircle(45, 20, 10);
  cl.generateTexture('cloud', 80, 34);
  cl.destroy();
}

function generateDecorations(scene: Phaser.Scene) {
  // --- Столб с проводами ---
  const pole = gfx(scene);
  pole.fillStyle(0x555555);
  pole.fillRect(3, 0, 4, 80);
  pole.fillRect(0, 4, 10, 3);
  // Провод (горизонтальная линия)
  pole.lineStyle(1, 0x333333);
  pole.lineBetween(0, 5, 10, 5);
  pole.generateTexture('pole', 10, 80);
  pole.destroy();

  // --- Урна ---
  const urn = gfx(scene);
  urn.fillStyle(0x666655);
  urn.fillRect(2, 4, 12, 14);
  urn.fillStyle(0x555544);
  urn.fillRect(0, 2, 16, 3);
  // Ножка
  urn.fillStyle(0x444444);
  urn.fillRect(5, 18, 6, 4);
  urn.generateTexture('urn', 16, 22);
  urn.destroy();

  // --- Знак (дорожный) ---
  const sign = gfx(scene);
  // Столб
  sign.fillStyle(0x888888);
  sign.fillRect(6, 14, 3, 34);
  // Знак круглый
  sign.fillStyle(0xee3333);
  sign.fillCircle(8, 8, 8);
  sign.fillStyle(0xffffff);
  sign.fillCircle(8, 8, 6);
  sign.fillStyle(0xee3333);
  sign.fillRect(3, 7, 10, 2);
  sign.generateTexture('roadsign', 16, 48);
  sign.destroy();
}

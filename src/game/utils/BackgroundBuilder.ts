import * as Phaser from 'phaser';
import { GAME_HEIGHT, TILE_SIZE } from '@/lib/constants';

const GROUND_Y = GAME_HEIGHT - TILE_SIZE; // 568

// =========================================================================
// Ночной городской фон в стиле Streets of Rage / TMNT: Shredder's Revenge
//
// Слои (от дальнего к ближнему):
//   -100  Небо (градиент + звёзды + луна)
//   -95   Облака
//   -92   Дальний план: силуэты высоток (scroll 0.1)
//   -85   Средний план: жилые дома, стоят НА ЗЕМЛЕ (scroll 0.3)
//   -80   Непрерывная стена зданий — заполняет пространство (scroll 0.5)
//   -70   Витрины, гаражи — вплотную к земле (scroll 0.6)
//   -30   Фонари с конусами света (scroll 0.85)
//   -20   Наземные объекты: гидранты, лавочки, урны (scroll 0.95)
// =========================================================================

// --- Ночное небо ---
function drawNightSky(scene: Phaser.Scene, worldWidth: number) {
  // Градиент: тёмно-синий → чуть светлее у горизонта
  const sky = scene.add.graphics();
  sky.fillGradientStyle(0x050510, 0x050510, 0x151530, 0x151530, 1);
  sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
  sky.setScrollFactor(0.05);
  sky.setDepth(-100);

  // Звёзды — разные размеры, мерцание
  const stars = scene.add.graphics();
  stars.setScrollFactor(0.05);
  stars.setDepth(-99);
  for (let i = 0; i < 150; i++) {
    const sx = Phaser.Math.Between(0, worldWidth);
    const sy = Phaser.Math.Between(5, 250);
    const size = Phaser.Math.FloatBetween(0.3, 1.4);
    const alpha = Phaser.Math.FloatBetween(0.2, 0.8);
    stars.fillStyle(i % 8 === 0 ? 0xffd4aa : 0xffffff, alpha);
    stars.fillCircle(sx, sy, size);
  }

  // Луна (полумесяц)
  const moonX = worldWidth * 0.75;
  const moon = scene.add.graphics();
  moon.setScrollFactor(0.06);
  moon.setDepth(-98);
  // Свечение
  moon.fillStyle(0xffeecc, 0.04);
  moon.fillCircle(moonX, 55, 70);
  moon.fillStyle(0xffeecc, 0.08);
  moon.fillCircle(moonX, 55, 45);
  // Луна
  moon.fillStyle(0xffeecc, 0.85);
  moon.fillCircle(moonX, 55, 22);
  moon.fillStyle(0x050510, 0.92);
  moon.fillCircle(moonX + 9, 50, 19);
}

// --- Далёкие силуэты высоток (самый дальний слой) ---
function drawDistantSkyline(scene: Phaser.Scene, worldWidth: number) {
  const g = scene.add.graphics();
  g.setScrollFactor(0.1);
  g.setDepth(-92);

  let x = 0;
  while (x < worldWidth + 200) {
    const bw = Phaser.Math.Between(40, 90);
    const bh = Phaser.Math.Between(120, 280);
    const by = GROUND_Y - bh;

    // Тёмный силуэт
    g.fillStyle(0x0c0c1e);
    g.fillRect(x, by, bw, bh + 40); // Уходит ЗА землю

    // Несколько светящихся окон
    const windowRows = Math.floor(bh / 24);
    const windowCols = Math.max(1, Math.floor(bw / 20));
    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < windowCols; col++) {
        if (Math.random() > 0.35) continue;
        const wx = x + 6 + col * (bw - 12) / windowCols;
        const wy = by + 8 + row * 24;
        const lit = Math.random() > 0.3;
        g.fillStyle(lit ? 0xffcc66 : 0x334455, lit ? 0.6 : 0.3);
        g.fillRect(wx, wy, 8, 10);
      }
    }

    x += bw + Phaser.Math.Between(5, 30);
  }
}

// --- Средний план: жилые дома (стоят на земле!) ---
function drawMidBuildings(scene: Phaser.Scene, worldWidth: number) {
  const g = scene.add.graphics();
  g.setScrollFactor(0.3);
  g.setDepth(-85);

  let x = Phaser.Math.Between(0, 60);
  while (x < worldWidth + 100) {
    const bw = Phaser.Math.Between(100, 180);
    const bh = Phaser.Math.Between(160, 240);
    const by = GROUND_Y - bh;

    // Стена здания — тёмно-серая
    g.fillStyle(0x1a1a2a);
    g.fillRect(x, by, bw, bh + 40);

    // Крыша
    g.fillStyle(0x111122);
    g.fillRect(x - 2, by, bw + 4, 5);

    // Окна
    const wSize = 14;
    const wGapX = 24;
    const wGapY = 28;
    const cols = Math.floor((bw - 16) / wGapX);
    const rows = Math.floor((bh - 20) / wGapY);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const wx = x + 10 + col * wGapX;
        const wy = by + 14 + row * wGapY;
        const lit = Math.random() > 0.45;
        if (lit) {
          // Окно горит — тёплый жёлтый свет
          g.fillStyle(0xffcc44, 0.7);
          g.fillRect(wx, wy, wSize, wSize + 4);
          // Свет из окна (отсвет на стене)
          g.fillStyle(0xffcc44, 0.06);
          g.fillRect(wx - 3, wy + wSize + 4, wSize + 6, 8);
        } else {
          // Тёмное окно
          g.fillStyle(0x0a0a18, 0.8);
          g.fillRect(wx, wy, wSize, wSize + 4);
        }
        // Рама
        g.lineStyle(0.8, 0x222233, 0.6);
        g.strokeRect(wx, wy, wSize, wSize + 4);
      }
    }

    // Водосточная труба
    g.fillStyle(0x151525, 0.5);
    g.fillRect(x + bw - 5, by + 5, 3, bh);

    x += bw + Phaser.Math.Between(10, 50);
  }
}

// --- Ближний план: непрерывная стена зданий (заполняет весь фон) ---
function drawNearBuildings(scene: Phaser.Scene, worldWidth: number) {
  const g = scene.add.graphics();
  g.setScrollFactor(0.5);
  g.setDepth(-80);

  let x = 0;
  while (x < worldWidth + 100) {
    const bw = Phaser.Math.Between(120, 200);
    const bh = Phaser.Math.Between(140, 200);
    const by = GROUND_Y - bh;

    // Стена
    g.fillStyle(0x222235);
    g.fillRect(x, by, bw, bh + 40);

    // Более тёмная боковая грань (3D-эффект)
    g.fillStyle(0x1a1a28);
    g.fillRect(x, by, 6, bh + 40);

    // Крыша — чуть выступает
    g.fillStyle(0x2a2a40);
    g.fillRect(x - 3, by - 2, bw + 6, 6);

    // Окна
    const wSize = 16;
    const wGapX = 28;
    const wGapY = 32;
    const cols = Math.floor((bw - 20) / wGapX);
    const rows = Math.floor((bh - 30) / wGapY);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const wx = x + 14 + col * wGapX;
        const wy = by + 16 + row * wGapY;
        const lit = Math.random() > 0.4;
        if (lit) {
          g.fillStyle(0xffcc44, 0.8);
          g.fillRect(wx, wy, wSize, wSize + 6);
          // Перемычка
          g.lineStyle(1, 0xcc9933, 0.3);
          g.lineBetween(wx + wSize / 2, wy, wx + wSize / 2, wy + wSize + 6);
          g.lineBetween(wx, wy + (wSize + 6) / 2, wx + wSize, wy + (wSize + 6) / 2);
          // Конус света вниз из окна
          g.fillStyle(0xffcc44, 0.04);
          g.fillTriangle(wx, wy + wSize + 6, wx + wSize, wy + wSize + 6,
            wx + wSize / 2, wy + wSize + 30);
        } else {
          g.fillStyle(0x0d0d1c, 0.9);
          g.fillRect(wx, wy, wSize, wSize + 6);
        }
        // Рама
        g.lineStyle(1, 0x333345, 0.4);
        g.strokeRect(wx, wy, wSize, wSize + 6);
        // Подоконник
        g.fillStyle(0x2a2a3a);
        g.fillRect(wx - 1, wy + wSize + 5, wSize + 2, 3);
      }
    }

    // Балконные ограждения
    g.lineStyle(1, 0x333345, 0.3);
    for (let row = 1; row < rows; row++) {
      const ry = by + 16 + row * wGapY + wSize + 7;
      g.lineBetween(x + 10, ry, x + bw - 10, ry);
      for (let bx = x + 14; bx < x + bw - 10; bx += 8) {
        g.lineBetween(bx, ry, bx, ry + 6);
      }
    }

    // Водосточная труба
    g.fillStyle(0x1a1a2a, 0.6);
    g.fillRect(x + bw - 4, by + 5, 3, bh);

    x += bw + Phaser.Math.Between(0, 3); // Почти вплотную!
  }
}

// --- Витрины и магазины (первый этаж зданий) ---
function drawStorefronts(scene: Phaser.Scene, worldWidth: number) {
  let x = Phaser.Math.Between(50, 150);
  while (x < worldWidth) {
    const type = Phaser.Math.Between(0, 4);
    // 0: Generic, 1: Pyaterochka, 2: Beer Shop, 3: Shawarma, 4: Pharmacy

    const sw = type === 1 ? 160 : type === 3 ? 120 : Phaser.Math.Between(110, 150);
    const sh = 70;
    const sy = GROUND_Y - sh;

    const sg = scene.add.graphics();
    sg.setScrollFactor(0.6);
    sg.setDepth(-70);

    // Базовая стена
    sg.fillStyle(0x282840);
    sg.fillRect(x, sy, sw, sh + 10);

    if (type === 1) {
      // --- ПЯТЁРОЧКА ---
      // Козырёк
      sg.fillStyle(0xcc3333); // Красный
      sg.fillRect(x - 2, sy, sw + 4, 10);
      sg.fillStyle(0x33aa55); // Зеленая полоса
      sg.fillRect(x - 2, sy + 6, sw + 4, 4);

      // Витрина большая, яркий свет
      const winW = sw - 20;
      sg.fillStyle(0xddffdd, 0.4);
      sg.fillRect(x + 10, sy + 16, winW, sh - 22);
      sg.lineStyle(2, 0xaaaaaa);
      sg.strokeRect(x + 10, sy + 16, winW, sh - 22);
      // Раздвижные двери
      sg.lineBetween(x + 10 + winW / 2, sy + 16, x + 10 + winW / 2, sy + sh - 6);

      // Вывеска (текст)
      scene.add.text(x + sw / 2, sy - 4, 'ПРОДУКТЫ', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '12px',
        color: '#ff2222',
        fontStyle: 'bold',
        stroke: '#ffffff',
        strokeThickness: 2,
      }).setOrigin(0.5, 0).setScrollFactor(0.6).setDepth(-69);

      // Мерцающий свет внутри витрины
      const glow1 = scene.add.rectangle(x + 10 + winW / 2, sy + sh / 2, winW, sh - 22, 0xddffdd, 0.15)
        .setScrollFactor(0.6).setDepth(-69);
      scene.tweens.add({
        targets: glow1,
        alpha: { from: 0.15, to: 0.4 },
        duration: 2000,
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut',
      });

    } else if (type === 2) {
      // --- ПИВНОЙ ЛАРЁК ---
      sg.fillStyle(0x221100);
      sg.fillRect(x, sy, sw, sh + 10);
      // Козырек под дерево
      sg.fillStyle(0x664422);
      sg.fillRect(x - 2, sy, sw + 4, 12);
      // Бочки
      sg.fillStyle(0x553311);
      sg.fillRoundedRect(x + 10, GROUND_Y - 20, 16, 24, 4);
      sg.fillRoundedRect(x + 30, GROUND_Y - 14, 16, 18, 4);

      // Маленькое желтое окно
      sg.fillStyle(0xffaa22, 0.3);
      sg.fillRect(x + 50, sy + 20, sw - 60, sh - 30);
      sg.lineStyle(2, 0x442211);
      sg.strokeRect(x + 50, sy + 20, sw - 60, sh - 30);

      // Неоновая вывеска "ПИВО 24"
      const sign2 = scene.add.text(x + sw / 2, sy - 8, 'ПИВО 24', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
        color: '#ffaa00',
        fontStyle: 'bold',
      }).setOrigin(0.5, 0).setScrollFactor(0.6).setDepth(-69);

      // Неоновое свечение под вывеской — плавная пульсация
      const neonGlow2 = scene.add.rectangle(x + sw / 2, sy - 2, sw - 20, 6, 0xffaa00, 0.4)
        .setScrollFactor(0.6).setDepth(-69);
      scene.tweens.add({
        targets: [sign2, neonGlow2],
        alpha: { from: 1, to: 0.2 },
        duration: 1500,
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut',
      });

    } else if (type === 3) {
      // --- ШАУРМА ---
      sg.fillStyle(0xcc3333);
      sg.fillRect(x - 2, sy, sw + 4, 10);

      // Окно выдачи
      sg.fillStyle(0xffddaa, 0.4);
      sg.fillRect(x + 10, sy + 20, sw - 20, sh - 40);
      
      // Вертел с мясом
      sg.fillStyle(0x666666); // Палка
      sg.fillRect(x + 30, sy + 25, 4, sh - 50);
      sg.fillStyle(0xaa5533); // Мясо
      sg.fillRoundedRect(x + 24, sy + 30, 16, sh - 60, 6);

      scene.add.text(x + sw / 2, sy - 5, 'ШАУРМА', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '12px',
        color: '#ffffff',
        fontStyle: 'bold',
        backgroundColor: '#cc3333',
        padding: { x: 4, y: 0 },
      }).setOrigin(0.5, 0).setScrollFactor(0.6).setDepth(-69);

      // Пульсирующий свет из окна выдачи
      const warmGlow = scene.add.rectangle(x + sw / 2, sy + sh / 2, sw - 20, sh - 40, 0xffddaa, 0.15)
        .setScrollFactor(0.6).setDepth(-69);
      scene.tweens.add({
        targets: warmGlow,
        alpha: { from: 0.15, to: 0.45 },
        duration: 1800,
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut',
      });

      // Дым от шаурмы
      const smokeParticles = scene.add.particles(x + 32, sy + 15, 'cloud', {
        scale: { start: 0.2, end: 0.8 },
        alpha: { start: 0.4, end: 0 },
        speedY: { min: -10, max: -30 },
        speedX: { min: -5, max: 5 },
        lifespan: 3000,
        frequency: 400,
        tint: 0xddeeff
      });
      smokeParticles.setScrollFactor(0.6).setDepth(-69);

    } else if (type === 4) {
      // --- АПТЕКА ---
      sg.fillStyle(0xffffff, 0.9);
      sg.fillRect(x - 2, sy, sw + 4, 10);

      sg.fillStyle(0xaaffcc, 0.4);
      sg.fillRect(x + 15, sy + 16, sw - 30, sh - 22);

      // Зелёный крест (анимированный) — Rectangle вместо Graphics для надёжного tween
      const crossV = scene.add.rectangle(x + 30, sy - 10, 10, 30, 0x22ff44)
        .setScrollFactor(0.6).setDepth(-68);
      const crossH = scene.add.rectangle(x + 30, sy - 10, 30, 10, 0x22ff44)
        .setScrollFactor(0.6).setDepth(-68);
      const crossGlow = scene.add.rectangle(x + 30, sy - 10, 40, 40, 0x22ff44, 0.15)
        .setScrollFactor(0.6).setDepth(-69);

      scene.tweens.add({
        targets: [crossV, crossH, crossGlow],
        alpha: { from: 1, to: 0.1 },
        duration: 1200,
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut',
      });

      scene.add.text(x + sw / 2 + 15, sy - 8, 'АПТЕКА', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '12px',
        color: '#22cc44',
        fontStyle: 'bold',
      }).setOrigin(0.5, 0).setScrollFactor(0.6).setDepth(-69);

    } else {
      // --- GENERIC STORE ---
      const awningColor = [0xcc3333, 0x3355aa, 0x33aa55, 0xaa6633][Phaser.Math.Between(0, 3)];
      sg.fillStyle(awningColor, 0.8);
      sg.fillRect(x - 2, sy, sw + 4, 10);
      sg.fillStyle(0x000000, 0.15);
      for (let sx = x; sx < x + sw; sx += 14) {
        sg.fillRect(sx, sy, 7, 10);
      }

      const winW = sw - 36;
      sg.fillStyle(0x88bbdd, 0.15);
      sg.fillRect(x + 8, sy + 16, winW, sh - 22);

      sg.lineStyle(1.5, 0x444460, 0.5);
      sg.strokeRect(x + 8, sy + 16, winW, sh - 22);
      sg.lineBetween(x + 8 + winW / 2, sy + 16, x + 8 + winW / 2, sy + sh - 6);

      sg.fillStyle(0x3a3a50);
      sg.fillRect(x + sw - 24, sy + 22, 18, sh - 22);

      const neonColor = ['#ff4466', '#44ff88', '#44aaff', '#ffaa44'][Phaser.Math.Between(0, 3)];
      const names = ['ОДЕЖДА', 'ПРОДУКТЫ', 'КАФЕ', 'ЦВЕТЫ'];
      const signName = names[Phaser.Math.Between(0, names.length - 1)];

      const sign5 = scene.add.text(x + sw / 2, sy + 4, signName, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '11px',
        color: neonColor,
        fontStyle: 'bold',
      }).setOrigin(0.5, 0).setScrollFactor(0.6).setDepth(-69);

      // Неоновая полоса + плавная пульсация вывески
      const neonHex = [0xff4466, 0x44ff88, 0x44aaff, 0xffaa44][Phaser.Math.Between(0, 3)];
      const neonBar = scene.add.rectangle(x + sw / 2, sy + 2, sw - 30, 4, neonHex, 0.5)
        .setScrollFactor(0.6).setDepth(-69);
      scene.tweens.add({
        targets: [sign5, neonBar],
        alpha: { from: 1, to: 0.15 },
        duration: Phaser.Math.Between(1200, 2500),
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut',
      });
    }

    x += sw + Phaser.Math.Between(80, 250);
  }
}

// --- Фонари с конусами света ---
function drawLampposts(scene: Phaser.Scene, worldWidth: number) {
  let x = 100;
  while (x < worldWidth) {
    // Столб
    const post = scene.add.graphics();
    post.setScrollFactor(0.85);
    post.setDepth(-30);

    // Стойка
    post.fillStyle(0x333344);
    post.fillRect(x - 2, GROUND_Y - 90, 4, 90);
    // Перекладина
    post.fillStyle(0x333344);
    post.fillRect(x - 8, GROUND_Y - 92, 16, 3);
    // Плафон
    post.fillStyle(0xffeecc, 0.9);
    post.fillCircle(x, GROUND_Y - 94, 4);

    // Конус света — треугольник вниз
    const light = scene.add.graphics();
    light.setScrollFactor(0.85);
    light.setDepth(-29);
    light.fillStyle(0xffeeaa, 0.06);
    light.fillTriangle(x - 4, GROUND_Y - 90, x + 4, GROUND_Y - 90,
      x + 40, GROUND_Y);
    light.fillTriangle(x - 4, GROUND_Y - 90, x + 4, GROUND_Y - 90,
      x - 40, GROUND_Y);
    // Второй слой — ярче, уже
    light.fillStyle(0xffeeaa, 0.04);
    light.fillTriangle(x - 2, GROUND_Y - 88, x + 2, GROUND_Y - 88,
      x + 20, GROUND_Y);
    light.fillTriangle(x - 2, GROUND_Y - 88, x + 2, GROUND_Y - 88,
      x - 20, GROUND_Y);
    // Пятно на земле
    light.fillStyle(0xffeeaa, 0.08);
    light.fillEllipse(x, GROUND_Y - 2, 60, 8);

    x += Phaser.Math.Between(200, 350);
  }
}

// --- Наземные объекты ---
function drawGroundObjects(scene: Phaser.Scene, worldWidth: number) {
  let x = Phaser.Math.Between(30, 120);
  const objects = ['hydrant', 'bench', 'trashcan', 'parkmeter'];
  const yOffsets: Record<string, number> = {
    hydrant: -16, bench: -16, trashcan: -22, parkmeter: -36,
  };

  while (x < worldWidth - 50) {
    const tex = objects[Phaser.Math.Between(0, objects.length - 1)];
    const sprite = scene.add.image(x, GROUND_Y + (yOffsets[tex] ?? -16), tex);
    sprite.setScrollFactor(0.95);
    sprite.setDepth(-20);
    sprite.setOrigin(0.5, 0);
    if (Math.random() > 0.5) sprite.setFlipX(true);

    x += Phaser.Math.Between(150, 350);
  }
}

// --- Дорожная разметка (рисуется прямо на земле) ---
function drawRoadMarkings(scene: Phaser.Scene, worldWidth: number) {
  const g = scene.add.graphics();
  g.setScrollFactor(1.0);
  g.setDepth(-3);

  // Пунктирная линия по центру дороги
  g.fillStyle(0xffffff, 0.08);
  for (let x = 0; x < worldWidth; x += 60) {
    g.fillRect(x, GROUND_Y + 14, 30, 3);
  }

  // Бордюр сверху тротуара
  g.fillStyle(0x3a3a4a, 0.3);
  g.fillRect(0, GROUND_Y - 2, worldWidth, 3);
}

// ===== ЭКСПОРТ =====

export function buildCityBackground(scene: Phaser.Scene, worldWidth: number) {
  drawNightSky(scene, worldWidth);
  drawDistantSkyline(scene, worldWidth);
  drawMidBuildings(scene, worldWidth);
  drawNearBuildings(scene, worldWidth);
  drawStorefronts(scene, worldWidth);
  drawLampposts(scene, worldWidth);
  drawGroundObjects(scene, worldWidth);
  drawRoadMarkings(scene, worldWidth);
}

export function buildConstructionBackground(scene: Phaser.Scene, worldWidth: number) {
  const sky = scene.add.graphics();
  sky.fillGradientStyle(0x445566, 0x445566, 0x667788, 0x667788, 1);
  sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
  sky.setScrollFactor(0.05);
  sky.setDepth(-100);

  drawDistantSkyline(scene, worldWidth);
  drawMidBuildings(scene, worldWidth);
  drawNearBuildings(scene, worldWidth);
  drawGroundObjects(scene, worldWidth);
}

export function buildWinterBackground(scene: Phaser.Scene, worldWidth: number) {
  const sky = scene.add.graphics();
  sky.fillGradientStyle(0xb0b8c8, 0xb0b8c8, 0xd8dce4, 0xd8dce4, 1);
  sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
  sky.setScrollFactor(0.05);
  sky.setDepth(-100);

  drawDistantSkyline(scene, worldWidth);
  drawMidBuildings(scene, worldWidth);
  drawNearBuildings(scene, worldWidth);
  drawGroundObjects(scene, worldWidth);
}

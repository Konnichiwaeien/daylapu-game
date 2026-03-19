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
  sky.setScrollFactor(0.05, 1);
  sky.setDepth(-100);

  // Звёзды — разные размеры, мерцание
  const stars = scene.add.graphics();
  stars.setScrollFactor(0.05, 1);
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
  moon.setScrollFactor(0.06, 1);
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
  g.setScrollFactor(0.1, 1);
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

// --- Средний план: жилые дома ---
function drawMidBuildings(scene: Phaser.Scene, worldWidth: number) {
  const g = scene.add.graphics();
  g.setScrollFactor(0.3, 1);
  g.setDepth(-85);

  let x = Phaser.Math.Between(0, 60);

  while (x < worldWidth + 200) {
    const bw = Phaser.Math.Between(100, 180);
    const bh = Phaser.Math.Between(160, 240);
    const by = GROUND_Y - bh;

    g.fillStyle(0x1a1a2a);
    g.fillRect(x, by, bw, bh + 40);
    g.fillStyle(0x111122);
    g.fillRect(x - 2, by, bw + 4, 5); // Крыша
    g.fillStyle(0x151525, 0.5);
    g.fillRect(x + bw - 5, by + 5, 3, bh); // Труба

    const wSize = 14;
    const wGapX = 24;
    const wGapY = 28;
    const cols = Math.floor((bw - 16) / wGapX);
    const rows = Math.floor((bh - 20) / wGapY);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const wx = x + 10 + col * wGapX;
        const wy = by + 14 + row * wGapY;
        if (Math.random() > 0.45) {
          g.fillStyle(0xffcc44, 0.7);
          g.fillRect(wx, wy, wSize, wSize + 4);
          g.fillStyle(0xffcc44, 0.06);
          g.fillRect(wx - 3, wy + wSize + 4, wSize + 6, 8);
        } else {
          g.fillStyle(0x0a0a18, 0.8);
          g.fillRect(wx, wy, wSize, wSize + 4);
        }
        g.lineStyle(0.8, 0x222233, 0.6);
        g.strokeRect(wx, wy, wSize, wSize + 4);
      }
    }
    x += bw + Phaser.Math.Between(10, 50);
  }
}

// --- Уникальная архитектура (перед зданиями ближнего плана) ---
function drawUniqueBuildings(scene: Phaser.Scene, worldWidth: number) {
  const g = scene.add.graphics();
  g.setScrollFactor(0.6, 1);
  g.setDepth(-75);

  let x = Phaser.Math.Between(100, 300);
  let lastUniqueType = -1;

  while (x < worldWidth - 200) {
    let uType = Phaser.Math.Between(1, 4);
    while (uType === lastUniqueType) {
      uType = Phaser.Math.Between(1, 4);
    }
    lastUniqueType = uType;

    if (uType === 1) {
      // --- МАГНИТ (Современный белый супермаркет с красной полосой) ---
      const bw = 220;
      const bh = 100;
      const by = GROUND_Y - bh;

      g.fillStyle(0xeeeeee); // Белый фасад
      g.fillRect(x, by, bw, bh + 40);
      
      g.fillStyle(0xdd1111); // Красный фриз 
      g.fillRect(x, by, bw, 25);
      
      // Панорамные окна
      g.fillStyle(0x223344, 0.6); // Современное темное стекло
      g.fillRect(x + 10, by + 40, bw - 20, 50);
      
      // Светодиодные лампы внутри стекла (полоски)
      g.fillStyle(0xffffff, 0.2);
      for(let w = x + 20; w < x + bw - 20; w += 40) {
        g.fillRect(w, by + 45, 20, 4);
      }
      
      // Рамы
      g.lineStyle(2, 0xdddddd, 1);
      for(let w = x + 10; w <= x + bw - 10; w += 40) {
        g.lineBetween(w, by + 40, w, by + 90);
      }

      scene.add.text(x + bw / 2, by + 4, 'МАГНИТ', {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '16px',
        color: '#ffffff',
        fontStyle: 'bold',
        letterSpacing: 2
      }).setOrigin(0.5, 0).setScrollFactor(0.6, 1).setDepth(-74);

      x += bw + Phaser.Math.Between(300, 600);

    } else if (uType === 2) {
      // --- ПЯТЕРОЧКА (Современное серо-красное здание с зелёным логотипом) ---
      const bw = 200;
      const bh = 120;
      const by = GROUND_Y - bh;

      g.fillStyle(0xcccccc); // Серый композит
      g.fillRect(x, by, bw, bh + 40);
      
      // Красная полоса поверху
      g.fillStyle(0xcc2222);
      g.fillRect(x, by, bw, 20);

      // Зеленый квадрат логотипа
      g.fillStyle(0x22aa44);
      g.fillRoundedRect(x + bw / 2 - 20, by - 15, 40, 40, 8);

      // Витрина
      g.fillStyle(0x1a2a3a, 0.7);
      g.fillRect(x + 15, by + 60, bw - 30, 50);

      scene.add.text(x + bw / 2, by - 6, '5', {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5, 0).setScrollFactor(0.6, 1).setDepth(-74);
      
      scene.add.text(x + bw / 2, by + 25, 'ПЯТЁРОЧКА', {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '12px',
        color: '#cc2222',
        fontStyle: 'bold'
      }).setOrigin(0.5, 0).setScrollFactor(0.6, 1).setDepth(-74);

      x += bw + Phaser.Math.Between(300, 600);

    } else if (uType === 3) {
      // --- КОФЕЙНЯ (Уютная, тёмный лофт с неоном) ---
      const bw = 120;
      const bh = 110;
      const by = GROUND_Y - bh;

      g.fillStyle(0x2a2a2a); // Темно-серый фасад
      g.fillRect(x, by, bw, bh + 40);
      
      // Деревянные рейки
      g.fillStyle(0x8b5a2b);
      for (let r = x + 5; r < x + bw; r += 15) {
        g.fillRect(r, by + 20, 5, bh - 20);
      }

      // Большое стекло
      g.fillStyle(0xffaa55, 0.3); // Теплый свет изнутри
      g.fillRect(x + 10, by + 40, bw - 20, 60);

      // Неоновая вывеска
      scene.add.text(x + bw / 2, by + 5, 'COFFEE', {
        fontFamily: 'Courier New, monospace',
        fontSize: '18px',
        color: '#ffcc00',
        fontStyle: 'bold',
        stroke: '#ff8800',
        strokeThickness: 4
      }).setOrigin(0.5, 0).setScrollFactor(0.6, 1).setDepth(-74);

      x += bw + Phaser.Math.Between(300, 600);

    } else if (uType === 4) {
      // --- ЗООМАГАЗИН / ВЕТКЛИНИКА (Чистая современная клиника) ---
      const bw = 140;
      const bh = 150;
      const by = GROUND_Y - bh;

      g.fillStyle(0xeefaf5); // Мятно-белый
      g.fillRect(x, by, bw, bh + 40);

      // Зелёная полоса
      g.fillStyle(0x20b2aa);
      g.fillRect(x, by + 30, bw, 15);

      // Окна
      g.fillStyle(0x99ccff, 0.4);
      g.fillRect(x + 20, by + 60, 40, 40);
      g.fillRect(x + 80, by + 60, 40, 40);

      scene.add.text(x + bw / 2, by - 12, '✚ ВЕТКЛИНИКА', {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '14px',
        color: '#20b2aa',
        fontStyle: 'bold',
        backgroundColor: '#ffffff',
        padding: { x: 8, y: 4 }
      }).setOrigin(0.5, 0).setScrollFactor(0.6, 1).setDepth(-74);

      x += bw + Phaser.Math.Between(300, 600);
    }
  }
}

// --- Канализация (Фон для высоты 600-1200) ---
function drawSewerBackground(scene: Phaser.Scene, worldWidth: number) {
  const g = scene.add.graphics();
  g.setScrollFactor(1.0, 1.0);
  g.setDepth(-100);

  // Тёмные кирпичи / слизь
  g.fillStyle(0x0e1510);
  g.fillRect(0, 600, worldWidth, 600);

  // Горизонтальные линии кирпичей
  g.lineStyle(2, 0x18251a, 0.8);
  for (let y = 620; y < 1200; y += 40) {
    g.lineBetween(0, y, worldWidth, y);
    // Вертикальные швы
    const offset = (y % 80 === 0) ? 0 : 20;
    for (let x = offset; x < worldWidth; x += 40) {
      g.lineBetween(x, y, x, y + 40);
    }
  }

  // Большие трубы вдоль стены
  g.fillStyle(0x223322);
  g.fillRect(0, 750, worldWidth, 40);
  g.fillRect(0, 1050, worldWidth, 30);
  
  // Вертикальные стоки с кислотой
  g.fillStyle(0x1a211c);
  let nextPipeX = Phaser.Math.Between(100, 300);
  while(nextPipeX < worldWidth) {
    g.fillRect(nextPipeX, 600, 60, 600); // Вертикальная труба
    
    // Светящаяся кислота внутри
    g.fillStyle(0x33ff33, 0.15);
    g.fillRect(nextPipeX + 10, 600, 40, 600);
    g.fillStyle(0x33ff33, 0.3);
    g.fillRect(nextPipeX + 20, 600, 20, 600);
    
    // Возвращаем цвет трубы
    g.fillStyle(0x1a211c);
    nextPipeX += Phaser.Math.Between(400, 800);
  }
}

// --- Ближний план: непрерывная стена зданий (заполняет весь фон) ---
function drawNearBuildings(scene: Phaser.Scene, worldWidth: number) {
  const g = scene.add.graphics();
  g.setScrollFactor(0.5, 1);
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


// --- Фонари с конусами света ---
function drawLampposts(scene: Phaser.Scene, worldWidth: number) {
  let x = 100;
  while (x < worldWidth) {
    // Столб
    const post = scene.add.graphics();
    post.setScrollFactor(0.85, 1);
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
    light.setScrollFactor(0.85, 1);
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
    hydrant: -26, bench: -30, trashcan: -36, parkmeter: -50,
  };

  while (x < worldWidth - 50) {
    const tex = objects[Phaser.Math.Between(0, objects.length - 1)];
    const sprite = scene.add.image(x, GROUND_Y + (yOffsets[tex] ?? -16), tex);
    sprite.setScrollFactor(0.95, 1);
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
  drawUniqueBuildings(scene, worldWidth);
  drawSewerBackground(scene, worldWidth);
  drawLampposts(scene, worldWidth);
  drawGroundObjects(scene, worldWidth);
  drawRoadMarkings(scene, worldWidth);
}

export function buildConstructionBackground(scene: Phaser.Scene, worldWidth: number) {
  const sky = scene.add.graphics();
  sky.fillGradientStyle(0x445566, 0x445566, 0x667788, 0x667788, 1);
  sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
  sky.setScrollFactor(0.05, 1);
  sky.setDepth(-100);

  drawDistantSkyline(scene, worldWidth);
  drawMidBuildings(scene, worldWidth);
  drawNearBuildings(scene, worldWidth);
  drawUniqueBuildings(scene, worldWidth);
  drawSewerBackground(scene, worldWidth);
  drawGroundObjects(scene, worldWidth);
}

export function buildWinterBackground(scene: Phaser.Scene, worldWidth: number) {
  const sky = scene.add.graphics();
  sky.fillGradientStyle(0xb0b8c8, 0xb0b8c8, 0xd8dce4, 0xd8dce4, 1);
  sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
  sky.setScrollFactor(0.05, 1);
  sky.setDepth(-100);

  drawDistantSkyline(scene, worldWidth);
  drawMidBuildings(scene, worldWidth);
  drawNearBuildings(scene, worldWidth);
  drawUniqueBuildings(scene, worldWidth);
  drawSewerBackground(scene, worldWidth);
  drawGroundObjects(scene, worldWidth);
}

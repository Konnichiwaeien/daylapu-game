import * as Phaser from 'phaser';
import { GAME_HEIGHT, TILE_SIZE } from '@/lib/constants';

// Именованные Y-позиции вместо магических чисел
const GROUND_Y = GAME_HEIGHT - TILE_SIZE; // 568
const FOREGROUND_Y = GROUND_Y - 10;       // декорации на земле
const MIDGROUND_Y = GROUND_Y - 60;
const FAR_Y = GROUND_Y - 200;

// ===== Блоки — фиксированные наборы декораций =====

interface Decoration {
  texture: string;
  xOffset: number; // смещение от начала блока
  scrollFactor: number;
  depth: number;
  scaleRange?: [number, number];
  flipChance?: number;
}

interface SceneBlock {
  width: number;
  items: Decoration[];
}

// --- Городские блоки ---
const CITY_BLOCKS: SceneBlock[] = [
  { // Жилой двор
    width: 350,
    items: [
      { texture: 'tree', xOffset: 30, scrollFactor: 0.8, depth: -40, scaleRange: [0.9, 1.2], flipChance: 0.5 },
      { texture: 'bench', xOffset: 80, scrollFactor: 0.9, depth: -20 },
      { texture: 'lamppost', xOffset: 160, scrollFactor: 0.85, depth: -30 },
      { texture: 'urn', xOffset: 200, scrollFactor: 0.9, depth: -20 },
      { texture: 'tree', xOffset: 280, scrollFactor: 0.8, depth: -40, scaleRange: [0.8, 1.1], flipChance: 0.5 },
    ],
  },
  { // У гаража
    width: 300,
    items: [
      { texture: 'trashcan', xOffset: 20, scrollFactor: 0.9, depth: -20 },
      { texture: 'fence', xOffset: 80, scrollFactor: 0.7, depth: -50 },
      { texture: 'garage', xOffset: 170, scrollFactor: 0.6, depth: -60 },
      { texture: 'trashcan', xOffset: 260, scrollFactor: 0.9, depth: -20 },
    ],
  },
  { // Тротуар с фонарём
    width: 280,
    items: [
      { texture: 'lamppost', xOffset: 40, scrollFactor: 0.85, depth: -30 },
      { texture: 'roadsign', xOffset: 120, scrollFactor: 0.9, depth: -25 },
      { texture: 'puddle', xOffset: 180, scrollFactor: 1.0, depth: -5 },
      { texture: 'urn', xOffset: 240, scrollFactor: 0.9, depth: -20 },
    ],
  },
  { // Парк
    width: 380,
    items: [
      { texture: 'tree', xOffset: 40, scrollFactor: 0.8, depth: -40, scaleRange: [1.0, 1.3], flipChance: 0.3 },
      { texture: 'bench', xOffset: 130, scrollFactor: 0.9, depth: -20 },
      { texture: 'tree', xOffset: 200, scrollFactor: 0.8, depth: -40, scaleRange: [0.8, 1.0] },
      { texture: 'puddle', xOffset: 300, scrollFactor: 1.0, depth: -5 },
      { texture: 'lamppost', xOffset: 340, scrollFactor: 0.85, depth: -30 },
    ],
  },
];

// --- Стройка ---
const CONSTRUCTION_BLOCKS: SceneBlock[] = [
  {
    width: 320,
    items: [
      { texture: 'fence', xOffset: 30, scrollFactor: 0.7, depth: -50 },
      { texture: 'pole', xOffset: 120, scrollFactor: 0.75, depth: -35 },
      { texture: 'trashcan', xOffset: 200, scrollFactor: 0.9, depth: -20 },
      { texture: 'fence', xOffset: 270, scrollFactor: 0.7, depth: -50 },
    ],
  },
  {
    width: 280,
    items: [
      { texture: 'trashcan', xOffset: 40, scrollFactor: 0.9, depth: -20 },
      { texture: 'pole', xOffset: 130, scrollFactor: 0.75, depth: -35 },
      { texture: 'fence', xOffset: 220, scrollFactor: 0.7, depth: -50 },
    ],
  },
];

// --- Зимние ---
const WINTER_BLOCKS: SceneBlock[] = [
  {
    width: 340,
    items: [
      { texture: 'tree_winter', xOffset: 30, scrollFactor: 0.7, depth: -40, scaleRange: [0.9, 1.3], flipChance: 0.5 },
      { texture: 'lamppost', xOffset: 120, scrollFactor: 0.85, depth: -30 },
      { texture: 'bench', xOffset: 200, scrollFactor: 0.9, depth: -20 },
      { texture: 'tree_winter', xOffset: 290, scrollFactor: 0.7, depth: -40, scaleRange: [0.8, 1.1] },
    ],
  },
  {
    width: 300,
    items: [
      { texture: 'fence', xOffset: 30, scrollFactor: 0.6, depth: -50 },
      { texture: 'tree_winter', xOffset: 120, scrollFactor: 0.7, depth: -40, scaleRange: [1.0, 1.4], flipChance: 0.5 },
      { texture: 'lamppost', xOffset: 240, scrollFactor: 0.85, depth: -30 },
    ],
  },
  {
    width: 360,
    items: [
      { texture: 'tree_winter', xOffset: 40, scrollFactor: 0.7, depth: -40, flipChance: 0.5 },
      { texture: 'bench', xOffset: 130, scrollFactor: 0.9, depth: -20 },
      { texture: 'fence', xOffset: 220, scrollFactor: 0.6, depth: -50 },
      { texture: 'tree_winter', xOffset: 310, scrollFactor: 0.7, depth: -40, flipChance: 0.5 },
    ],
  },
];

// ===== Y-позиции для текстур =====
const TEXTURE_Y: Record<string, number> = {
  tree: FOREGROUND_Y - 56,
  tree_winter: FOREGROUND_Y - 56,
  bench: FOREGROUND_Y - 16,
  lamppost: FOREGROUND_Y - 80,
  trashcan: FOREGROUND_Y - 22,
  urn: FOREGROUND_Y - 14,
  fence: MIDGROUND_Y,
  garage: MIDGROUND_Y + 10,
  puddle: FOREGROUND_Y,
  roadsign: FOREGROUND_Y - 44,
  pole: FOREGROUND_Y - 78,
};

// ===== Размещение блоков =====
function placeBlocks(scene: Phaser.Scene, worldWidth: number, blocks: SceneBlock[]) {
  let x = Phaser.Math.Between(20, 80);

  while (x < worldWidth - 100) {
    const block = blocks[Phaser.Math.Between(0, blocks.length - 1)];

    for (const item of block.items) {
      const ix = x + item.xOffset;
      if (ix > worldWidth) continue;

      const iy = TEXTURE_Y[item.texture] ?? FOREGROUND_Y;
      const sprite = scene.add.image(ix, iy, item.texture);
      sprite.setScrollFactor(item.scrollFactor);
      sprite.setDepth(item.depth);
      sprite.setOrigin(0.5, 1);

      if (item.scaleRange) {
        sprite.setScale(Phaser.Math.FloatBetween(item.scaleRange[0], item.scaleRange[1]));
      }
      if (item.flipChance && Math.random() < item.flipChance) {
        sprite.setFlipX(true);
      }
    }

    x += block.width;
  }
}

// ===== Облака =====
function placeClouds(scene: Phaser.Scene, worldWidth: number, skyType: 'day' | 'dark' | 'winter') {
  const count = Math.ceil(worldWidth / 350);
  const alpha = skyType === 'dark' ? 0.3 : skyType === 'winter' ? 0.5 : 0.7;

  for (let i = 0; i < count; i++) {
    const x = Phaser.Math.Between(0, worldWidth);
    const y = Phaser.Math.Between(25, 110);
    const cloud = scene.add.image(x, y, 'cloud');
    cloud.setScrollFactor(0.1);
    cloud.setDepth(-95);
    cloud.setAlpha(alpha);
    cloud.setScale(Phaser.Math.FloatBetween(0.6, 1.2));

    // Плавное движение
    const speed = Phaser.Math.FloatBetween(8, 18);
    scene.tweens.add({
      targets: cloud,
      x: cloud.x + worldWidth * 0.4,
      duration: (worldWidth * 0.4 / speed) * 1000,
      repeat: -1,
      yoyo: true,
      ease: 'Linear',
    });
  }
}

// ===== Здания с мерцанием =====
function placeBuildings(
  scene: Phaser.Scene,
  worldWidth: number,
  texture: string,
  y: number,
  scrollFactor: number,
  spacing: [number, number],
  depth: number,
  scaleRange?: [number, number],
) {
  const sprites: Phaser.GameObjects.Image[] = [];
  let x = Phaser.Math.Between(40, 120);
  const [sMin, sMax] = spacing;

  while (x < worldWidth) {
    const sprite = scene.add.image(x, y, texture);
    sprite.setScrollFactor(scrollFactor);
    sprite.setDepth(depth);
    sprite.setOrigin(0.5, 1);
    if (Math.random() > 0.5) sprite.setFlipX(true);
    if (scaleRange) sprite.setScale(Phaser.Math.FloatBetween(scaleRange[0], scaleRange[1]));
    sprites.push(sprite);
    x += Phaser.Math.Between(sMin, sMax);
  }

  // Мерцание окон (подмена tint)
  if (sprites.length > 0) {
    scene.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {
        const n = Phaser.Math.Between(1, Math.min(3, sprites.length));
        for (let i = 0; i < n; i++) {
          const s = sprites[Phaser.Math.Between(0, sprites.length - 1)];
          if (!s?.active) continue;
          s.setTint(0xffeedd);
          scene.time.delayedCall(Phaser.Math.Between(500, 2000), () => {
            if (s.active) s.clearTint();
          });
        }
      },
    });
  }
}

// ===== ЭКСПОРТ =====

export function buildCityBackground(scene: Phaser.Scene, worldWidth: number) {
  // Небо
  const sky = scene.add.graphics();
  sky.fillGradientStyle(0x8aafe0, 0x8aafe0, 0xc4d8ee, 0xc4d8ee, 1);
  sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
  sky.setScrollFactor(0.05);
  sky.setDepth(-100);

  placeClouds(scene, worldWidth, 'day');

  // Дальние высотки
  placeBuildings(scene, worldWidth, 'tower', FAR_Y + 60, 0.2, [220, 380], -90, [0.7, 1.1]);
  // Средние панельки
  placeBuildings(scene, worldWidth, 'building', FAR_Y + 160, 0.5, [180, 300], -80, [0.8, 1.2]);

  // Наземные блоки
  placeBlocks(scene, worldWidth, CITY_BLOCKS);
}

export function buildConstructionBackground(scene: Phaser.Scene, worldWidth: number) {
  const sky = scene.add.graphics();
  sky.fillGradientStyle(0x445566, 0x445566, 0x667788, 0x667788, 1);
  sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
  sky.setScrollFactor(0.05);
  sky.setDepth(-100);

  placeClouds(scene, worldWidth, 'dark');

  placeBuildings(scene, worldWidth, 'tower', FAR_Y + 40, 0.2, [180, 320], -90, [0.6, 1.0]);
  placeBuildings(scene, worldWidth, 'building', FAR_Y + 140, 0.5, [160, 270], -80);

  placeBlocks(scene, worldWidth, CONSTRUCTION_BLOCKS);
}

export function buildWinterBackground(scene: Phaser.Scene, worldWidth: number) {
  const sky = scene.add.graphics();
  sky.fillGradientStyle(0xb0b8c8, 0xb0b8c8, 0xd8dce4, 0xd8dce4, 1);
  sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
  sky.setScrollFactor(0.05);
  sky.setDepth(-100);

  placeClouds(scene, worldWidth, 'winter');

  placeBuildings(scene, worldWidth, 'tower', FAR_Y + 50, 0.2, [200, 350], -90, [0.6, 1.0]);
  placeBuildings(scene, worldWidth, 'building', FAR_Y + 150, 0.5, [170, 280], -80);

  placeBlocks(scene, worldWidth, WINTER_BLOCKS);
}

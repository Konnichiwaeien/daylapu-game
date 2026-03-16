import * as Phaser from 'phaser';
import { GAME_HEIGHT } from '@/lib/constants';

interface DecorationConfig {
  texture: string;
  y: number;
  scrollFactor: number;
  count: number;
  spacingMin: number;
  spacingMax: number;
  flipRandom?: boolean;
  scaleMin?: number;
  scaleMax?: number;
  offsetY?: number;
  depth?: number;
}

function placeClouds(scene: Phaser.Scene, worldWidth: number, skyType: 'day' | 'dark' | 'winter') {
  const count = Math.ceil(worldWidth / 300);
  const alpha = skyType === 'dark' ? 0.3 : skyType === 'winter' ? 0.5 : 0.7;

  for (let i = 0; i < count; i++) {
    const x = Phaser.Math.Between(0, worldWidth);
    const y = Phaser.Math.Between(20, 100);
    const cloud = scene.add.image(x, y, 'cloud');
    cloud.setScrollFactor(0.1);
    cloud.setDepth(-95);
    cloud.setAlpha(alpha);
    cloud.setScale(Phaser.Math.FloatBetween(0.6, 1.2));

    // Плавное движение облака
    const drift = Phaser.Math.FloatBetween(8, 20);
    scene.tweens.add({
      targets: cloud,
      x: cloud.x + worldWidth * 0.5,
      duration: (worldWidth * 0.5 / drift) * 1000,
      repeat: -1,
      yoyo: true,
      ease: 'Linear',
    });
  }
}

function placeBuildingsWithFlicker(scene: Phaser.Scene, config: DecorationConfig) {
  const sprites: Phaser.GameObjects.Image[] = [];
  let x = Phaser.Math.Between(50, 150);

  for (let i = 0; i < config.count; i++) {
    const sprite = scene.add.image(x, config.y, config.texture);
    sprite.setScrollFactor(config.scrollFactor);
    sprite.setDepth(config.depth ?? -10);
    sprite.setOrigin(0.5, 1);

    if (config.flipRandom && Math.random() > 0.5) {
      sprite.setFlipX(true);
    }
    if (config.scaleMin && config.scaleMax) {
      sprite.setScale(Phaser.Math.FloatBetween(config.scaleMin, config.scaleMax));
    }

    sprites.push(sprite);
    x += Phaser.Math.Between(config.spacingMin, config.spacingMax);
  }

  // Мерцание: периодически слегка меняем alpha/tint случайных зданий
  scene.time.addEvent({
    delay: 3000,
    loop: true,
    callback: () => {
      const count = Phaser.Math.Between(1, Math.min(3, sprites.length));
      for (let i = 0; i < count; i++) {
        const s = sprites[Phaser.Math.Between(0, sprites.length - 1)];
        if (!s || !s.active) continue;
        // Лёгкое изменение оттенка — имитация мерцания окон
        const flicker = Math.random() > 0.5;
        if (flicker) {
          s.setTint(0xffeedd);
          scene.time.delayedCall(Phaser.Math.Between(500, 1500), () => {
            if (s.active) s.clearTint();
          });
        }
      }
    },
  });
}

export function buildCityBackground(scene: Phaser.Scene, worldWidth: number) {
  // Небо — градиент
  const sky = scene.add.graphics();
  sky.fillGradientStyle(0x8aafe0, 0x8aafe0, 0xc4d8ee, 0xc4d8ee, 1);
  sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
  sky.setScrollFactor(0.05);
  sky.setDepth(-100);

  // Облака
  placeClouds(scene, worldWidth, 'day');

  // Дальние высотки (0.2)
  placeBuildingsWithFlicker(scene, {
    texture: 'tower',
    y: GAME_HEIGHT - 240 - 120,
    scrollFactor: 0.2,
    count: Math.ceil(worldWidth / 300),
    spacingMin: 200,
    spacingMax: 350,
    scaleMin: 0.7,
    scaleMax: 1.1,
    depth: -90,
  });

  // Средний план — панельки (0.5)
  placeBuildingsWithFlicker(scene, {
    texture: 'building',
    y: GAME_HEIGHT - 180 - 80,
    scrollFactor: 0.5,
    count: Math.ceil(worldWidth / 250),
    spacingMin: 160,
    spacingMax: 280,
    scaleMin: 0.8,
    scaleMax: 1.2,
    flipRandom: true,
    depth: -80,
  });

  // Гаражи
  placeDecorations(scene, {
    texture: 'garage',
    y: GAME_HEIGHT - 48 - 80,
    scrollFactor: 0.6,
    count: Math.ceil(worldWidth / 500),
    spacingMin: 400,
    spacingMax: 600,
    depth: -60,
  });

  // Заборы
  placeDecorations(scene, {
    texture: 'fence',
    y: GAME_HEIGHT - 40 - 70,
    scrollFactor: 0.7,
    count: Math.ceil(worldWidth / 200),
    spacingMin: 100,
    spacingMax: 250,
    depth: -50,
  });

  // Деревья
  placeDecorations(scene, {
    texture: 'tree',
    y: GAME_HEIGHT - 60 - 50,
    scrollFactor: 0.8,
    count: Math.ceil(worldWidth / 250),
    spacingMin: 180,
    spacingMax: 350,
    flipRandom: true,
    scaleMin: 0.8,
    scaleMax: 1.3,
    depth: -40,
  });

  // Фонари
  placeDecorations(scene, {
    texture: 'lamppost',
    y: GAME_HEIGHT - 80 - 30,
    scrollFactor: 0.85,
    count: Math.ceil(worldWidth / 350),
    spacingMin: 280,
    spacingMax: 400,
    depth: -30,
  });

  // Скамейки
  placeDecorations(scene, {
    texture: 'bench',
    y: GAME_HEIGHT - 22 - 40,
    scrollFactor: 0.9,
    count: Math.ceil(worldWidth / 500),
    spacingMin: 400,
    spacingMax: 700,
    depth: -20,
  });

  // Мусорные баки
  placeDecorations(scene, {
    texture: 'trashcan',
    y: GAME_HEIGHT - 28 - 32,
    scrollFactor: 0.9,
    count: Math.ceil(worldWidth / 400),
    spacingMin: 300,
    spacingMax: 500,
    depth: -20,
  });

  // Урны
  placeDecorations(scene, {
    texture: 'urn',
    y: GAME_HEIGHT - 22 - 38,
    scrollFactor: 0.9,
    count: Math.ceil(worldWidth / 350),
    spacingMin: 250,
    spacingMax: 450,
    depth: -20,
  });

  // Лужи
  placeDecorations(scene, {
    texture: 'puddle',
    y: GAME_HEIGHT - 12 - 32,
    scrollFactor: 1.0,
    count: Math.ceil(worldWidth / 400),
    spacingMin: 300,
    spacingMax: 500,
    depth: -5,
  });

  // Дорожные знаки
  placeDecorations(scene, {
    texture: 'roadsign',
    y: GAME_HEIGHT - 48 - 18,
    scrollFactor: 0.9,
    count: Math.ceil(worldWidth / 600),
    spacingMin: 500,
    spacingMax: 800,
    depth: -25,
  });
}

export function buildConstructionBackground(scene: Phaser.Scene, worldWidth: number) {
  const sky = scene.add.graphics();
  sky.fillGradientStyle(0x445566, 0x445566, 0x667788, 0x667788, 1);
  sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
  sky.setScrollFactor(0.05);
  sky.setDepth(-100);

  placeClouds(scene, worldWidth, 'dark');

  placeBuildingsWithFlicker(scene, {
    texture: 'tower',
    y: GAME_HEIGHT - 240 - 80,
    scrollFactor: 0.2,
    count: Math.ceil(worldWidth / 250),
    spacingMin: 150,
    spacingMax: 300,
    scaleMin: 0.6,
    scaleMax: 1.0,
    depth: -90,
  });

  placeBuildingsWithFlicker(scene, {
    texture: 'building',
    y: GAME_HEIGHT - 180 - 60,
    scrollFactor: 0.5,
    count: Math.ceil(worldWidth / 220),
    spacingMin: 140,
    spacingMax: 250,
    flipRandom: true,
    depth: -80,
  });

  placeDecorations(scene, {
    texture: 'fence',
    y: GAME_HEIGHT - 40 - 55,
    scrollFactor: 0.7,
    count: Math.ceil(worldWidth / 400),
    spacingMin: 200,
    spacingMax: 400,
    depth: -50,
  });

  placeDecorations(scene, {
    texture: 'pole',
    y: GAME_HEIGHT - 80 - 20,
    scrollFactor: 0.75,
    count: Math.ceil(worldWidth / 300),
    spacingMin: 250,
    spacingMax: 350,
    depth: -35,
  });

  placeDecorations(scene, {
    texture: 'trashcan',
    y: GAME_HEIGHT - 28 - 30,
    scrollFactor: 0.9,
    count: Math.ceil(worldWidth / 300),
    spacingMin: 200,
    spacingMax: 400,
    depth: -20,
  });
}

export function buildWinterBackground(scene: Phaser.Scene, worldWidth: number) {
  const sky = scene.add.graphics();
  sky.fillGradientStyle(0xb0b8c8, 0xb0b8c8, 0xd8dce4, 0xd8dce4, 1);
  sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
  sky.setScrollFactor(0.05);
  sky.setDepth(-100);

  placeClouds(scene, worldWidth, 'winter');

  placeBuildingsWithFlicker(scene, {
    texture: 'tower',
    y: GAME_HEIGHT - 240 - 100,
    scrollFactor: 0.2,
    count: Math.ceil(worldWidth / 280),
    spacingMin: 180,
    spacingMax: 320,
    scaleMin: 0.6,
    scaleMax: 1.0,
    depth: -90,
  });

  placeBuildingsWithFlicker(scene, {
    texture: 'building',
    y: GAME_HEIGHT - 180 - 70,
    scrollFactor: 0.5,
    count: Math.ceil(worldWidth / 230),
    spacingMin: 150,
    spacingMax: 260,
    flipRandom: true,
    depth: -80,
  });

  placeDecorations(scene, {
    texture: 'fence',
    y: GAME_HEIGHT - 40 - 60,
    scrollFactor: 0.6,
    count: Math.ceil(worldWidth / 180),
    spacingMin: 100,
    spacingMax: 200,
    depth: -50,
  });

  placeDecorations(scene, {
    texture: 'tree_winter',
    y: GAME_HEIGHT - 60 - 45,
    scrollFactor: 0.7,
    count: Math.ceil(worldWidth / 200),
    spacingMin: 130,
    spacingMax: 280,
    flipRandom: true,
    scaleMin: 0.8,
    scaleMax: 1.4,
    depth: -40,
  });

  placeDecorations(scene, {
    texture: 'lamppost',
    y: GAME_HEIGHT - 80 - 25,
    scrollFactor: 0.85,
    count: Math.ceil(worldWidth / 300),
    spacingMin: 240,
    spacingMax: 380,
    depth: -30,
  });

  placeDecorations(scene, {
    texture: 'bench',
    y: GAME_HEIGHT - 22 - 38,
    scrollFactor: 0.9,
    count: Math.ceil(worldWidth / 500),
    spacingMin: 400,
    spacingMax: 650,
    depth: -20,
  });
}

function placeDecorations(scene: Phaser.Scene, config: DecorationConfig) {
  let x = Phaser.Math.Between(50, 150);
  for (let i = 0; i < config.count; i++) {
    const sprite = scene.add.image(x, config.y, config.texture);
    sprite.setScrollFactor(config.scrollFactor);
    sprite.setDepth(config.depth ?? -10);
    sprite.setOrigin(0.5, 1);

    if (config.flipRandom && Math.random() > 0.5) {
      sprite.setFlipX(true);
    }
    if (config.scaleMin && config.scaleMax) {
      sprite.setScale(Phaser.Math.FloatBetween(config.scaleMin, config.scaleMax));
    }
    if (config.offsetY) {
      sprite.y += Phaser.Math.Between(-config.offsetY, config.offsetY);
    }

    x += Phaser.Math.Between(config.spacingMin, config.spacingMax);
  }
}

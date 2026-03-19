import { LevelData } from './LevelData';
import { COLORS } from '@/lib/constants';

// Уровень 2: Стройка / подвалы — Вытащить котят из подвала
const level2: LevelData = {
  id: 2,
  name: 'Construction Site',
  nameRu: 'Стройка и подвалы',
  theme: 'construction',
  width: 3200,
  height: 600,
  bgColor: COLORS.gray,
  playerStart: { x: 60, y: 500 },
  exitPoint: { x: 3050, y: 440 },
  requiredRescues: 3,
  timeLimit: 180, // секунды
  platforms: [
    // Земля
    { x: 0, y: 568, width: 12 },

    // Верхний уровень стройки
    { x: 420, y: 400, width: 6, texture: 'pipe' },
    { x: 620, y: 320, width: 4, texture: 'pipe' },
    { x: 800, y: 400, width: 5, texture: 'pipe' },

    // Подвальная секция (ниже земли визуально — но мы делаем платформы)
    { x: 400, y: 568, width: 6 },
    { x: 700, y: 568, width: 4 },
    { x: 900, y: 520, width: 3 },

    // Лабиринт труб
    { x: 1100, y: 568, width: 8 },
    { x: 1100, y: 440, width: 4, texture: 'pipe' },
    { x: 1300, y: 360, width: 3, texture: 'pipe' },
    { x: 1500, y: 440, width: 4, texture: 'pipe' },
    { x: 1500, y: 568, width: 6 },

    // Выход из подвала
    { x: 1800, y: 568, width: 10 },
    { x: 1900, y: 460, width: 3 },
    { x: 2100, y: 380, width: 4 },
    { x: 2350, y: 440, width: 3 },

    // Финальная секция
    { x: 2550, y: 568, width: 22 },
    { x: 2700, y: 460, width: 3 },
    { x: 2900, y: 380, width: 3 },

    // Приют
    { x: 3000, y: 500, width: 6 },
  ],
  animals: [
    { id: 'kitten1', x: 650, y: 290, type: 'kitten', name: 'Мурка' },
    { id: 'kitten2', x: 1350, y: 330, type: 'kitten', name: 'Барсик' },
    { id: 'kitten3', x: 2150, y: 350, type: 'kitten', name: 'Рыжик' },
  ],
  coins: [
    { x: 100, y: 530 }, { x: 150, y: 530 },
    { x: 450, y: 370 }, { x: 500, y: 370 },
    { x: 650, y: 290 }, { x: 680, y: 290 },
    { x: 850, y: 370 }, { x: 880, y: 370 },
    { x: 1150, y: 410 }, { x: 1200, y: 410 },
    { x: 1350, y: 330 }, { x: 1380, y: 330 },
    { x: 1550, y: 410 }, { x: 1600, y: 410 },
    { x: 1950, y: 430 }, { x: 2000, y: 430 },
    { x: 2150, y: 350 }, { x: 2200, y: 350 },
    { x: 2750, y: 430 }, { x: 2800, y: 430 },
    { x: 2950, y: 350 },
  ],
  obstacles: [
    // Падающие кирпичи — много, опасная стройка!
    { type: 'falling', x: 300, y: 80, speed: 110 },
    { type: 'falling', x: 500, y: 50, speed: 130 },
    { type: 'falling', x: 650, y: 100, speed: 100 },
    { type: 'falling', x: 850, y: 60, speed: 160 },
    { type: 'falling', x: 1000, y: 80, speed: 120 },
    { type: 'falling', x: 1200, y: 50, speed: 140 },
    { type: 'falling', x: 1400, y: 70, speed: 110 },
    { type: 'falling', x: 1550, y: 90, speed: 150 },
    { type: 'falling', x: 1750, y: 60, speed: 130 },
    { type: 'falling', x: 2000, y: 80, speed: 120 },
    { type: 'falling', x: 2200, y: 50, speed: 160 },
    { type: 'falling', x: 2400, y: 70, speed: 100 },
    { type: 'falling', x: 2700, y: 60, speed: 140 },
    { type: 'falling', x: 2900, y: 80, speed: 130 },

    // Люки (телепортация)
    { type: 'hatch', x: 420, y: 536, hatchId: 'hatch_a1', targetHatch: 'hatch_a2' },
    { type: 'hatch', x: 1100, y: 536, hatchId: 'hatch_a2', targetHatch: 'hatch_a1' },
    { type: 'hatch', x: 1500, y: 536, hatchId: 'hatch_b1', targetHatch: 'hatch_b2' },
    { type: 'hatch', x: 1800, y: 536, hatchId: 'hatch_b2', targetHatch: 'hatch_b1' },
    // Догхантеры
    { type: 'dogcatcher', x: 500, y: 530, speed: 55, patrolRange: 100 },
    { type: 'dogcatcher', x: 1900, y: 530, speed: 50, patrolRange: 130 },
    { type: 'dogcatcher', x: 2700, y: 530, speed: 65, patrolRange: 140 },
  ],
};

export default level2;

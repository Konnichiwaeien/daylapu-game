import { LevelData } from './LevelData';
import { COLORS } from '@/lib/constants';

// Уровень 3: Зимний Сургут — Собрать корм и одеяла, успеть до приюта
const level3: LevelData = {
  id: 3,
  name: 'Winter Surgut',
  nameRu: 'Зимний Сургут',
  theme: 'winter',
  width: 3600,
  height: 600,
  bgColor: COLORS.snow,
  playerStart: { x: 60, y: 500 },
  exitPoint: { x: 3450, y: 440 },
  requiredRescues: 2,
  requiredCollectibles: 4,
  timeLimit: 90, // секунды
  platforms: [
    // Заснеженная земля
    { x: 0, y: 568, width: 15 },
    { x: 520, y: 568, width: 10 },

    // Платформы с сугробами
    { x: 200, y: 460, width: 3 },
    { x: 380, y: 380, width: 3 },

    // Ледяной мост
    { x: 850, y: 480, width: 8 },

    // Средняя секция
    { x: 1150, y: 568, width: 15 },
    { x: 1200, y: 440, width: 3 },
    { x: 1400, y: 380, width: 4 },
    { x: 1650, y: 440, width: 3 },

    // Зона бури
    { x: 1800, y: 568, width: 12 },
    { x: 1900, y: 460, width: 3 },
    { x: 2100, y: 380, width: 3 },
    { x: 2300, y: 440, width: 4 },

    // Финальный рывок
    { x: 2550, y: 568, width: 35 },
    { x: 2700, y: 460, width: 3 },
    { x: 2900, y: 380, width: 3 },
    { x: 3100, y: 440, width: 3 },
    { x: 3300, y: 380, width: 3 },

    // Приют
    { x: 3400, y: 500, width: 6 },
  ],
  animals: [
    { id: 'dog1', x: 400, y: 350, type: 'puppy', name: 'Дружок' },
    { id: 'cat1', x: 2350, y: 410, type: 'kitten', name: 'Снежок' },
  ],
  coins: [
    { x: 100, y: 530 }, { x: 150, y: 530 }, { x: 200, y: 530 },
    { x: 230, y: 430 }, { x: 260, y: 430 },
    { x: 410, y: 350 }, { x: 440, y: 350 },
    { x: 900, y: 450 }, { x: 950, y: 450 }, { x: 1000, y: 450 },
    { x: 1250, y: 410 }, { x: 1280, y: 410 },
    { x: 1450, y: 350 }, { x: 1480, y: 350 },
    { x: 1950, y: 430 }, { x: 2000, y: 430 },
    { x: 2150, y: 350 }, { x: 2200, y: 350 },
    { x: 2750, y: 430 }, { x: 2800, y: 430 },
    { x: 2950, y: 350 }, { x: 3000, y: 350 },
    { x: 3150, y: 410 }, { x: 3200, y: 410 },
  ],
  collectibles: [
    { type: 'food', x: 300, y: 530 },
    { type: 'blanket', x: 900, y: 440 },
    { type: 'food', x: 1450, y: 350 },
    { type: 'blanket', x: 2100, y: 350 },
    { type: 'food', x: 2700, y: 530 },
    { type: 'blanket', x: 3100, y: 410 },
  ],
  obstacles: [
    // Зоны холода — обширные, опасные
    { type: 'coldzone', x: 480, y: 350, width: 200, height: 218 },
    { type: 'coldzone', x: 850, y: 380, width: 256, height: 188 },
    { type: 'coldzone', x: 1800, y: 350, width: 400, height: 218 },
    { type: 'coldzone', x: 2550, y: 380, width: 250, height: 188 },
    { type: 'coldzone', x: 3100, y: 350, width: 200, height: 218 },
    // Падающие сосульки
    { type: 'falling', x: 600, y: 50, speed: 130 },
    { type: 'falling', x: 1300, y: 60, speed: 110 },
    { type: 'falling', x: 1900, y: 40, speed: 150 },
    { type: 'falling', x: 2400, y: 70, speed: 120 },
    { type: 'falling', x: 2800, y: 50, speed: 140 },
    { type: 'falling', x: 3200, y: 60, speed: 130 },
    // Догхантеры
    { type: 'dogcatcher', x: 1250, y: 530, speed: 45, patrolRange: 100 },
    { type: 'dogcatcher', x: 2650, y: 530, speed: 55, patrolRange: 120 },
  ],
};

export default level3;

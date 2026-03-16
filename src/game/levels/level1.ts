import { LevelData } from './LevelData';
import { COLORS } from '@/lib/constants';

// Уровень 1: Городские улицы — Спасти 3 щенков
const level1: LevelData = {
  id: 1,
  name: 'City Streets',
  nameRu: 'Городские улицы',
  theme: 'city',
  width: 3200,
  height: 600,
  bgColor: COLORS.lightBlue,
  playerStart: { x: 60, y: 500 },
  exitPoint: { x: 3050, y: 440 },
  requiredRescues: 3,
  platforms: [
    // Земля — тротуар
    { x: 0, y: 568, width: 20 },
    // Дорога (без платформы — пропасть/опасность)
    // Продолжение тротуара
    { x: 704, y: 568, width: 8 },
    // Ещё дорога
    // Тротуар после второй дороги
    { x: 1100, y: 568, width: 8 },
    // Третья дорога
    // Большой тротуар
    { x: 1600, y: 568, width: 50 },

    // Бетонные платформы — козырьки подъездов, крыши гаражей
    { x: 200, y: 470, width: 4 },
    { x: 350, y: 400, width: 3 },
    { x: 520, y: 340, width: 4 },

    // Над дорогой — платформы для прыжков
    { x: 680, y: 480, width: 2 },
    { x: 780, y: 420, width: 2 },
    { x: 880, y: 480, width: 2 },
    { x: 980, y: 420, width: 2 },
    { x: 1060, y: 480, width: 2 },

    // После дорог — дворы
    { x: 1700, y: 460, width: 5 },
    { x: 1900, y: 390, width: 4 },
    { x: 2100, y: 450, width: 5 },
    { x: 2350, y: 380, width: 3 },
    { x: 2550, y: 440, width: 4 },
    { x: 2750, y: 380, width: 3 },
    { x: 2900, y: 420, width: 4 },

    // Финальная платформа (приют)
    { x: 3000, y: 500, width: 6 },
  ],
  animals: [
    { id: 'puppy1', x: 370, y: 370, type: 'puppy', name: 'Шарик' },
    { id: 'puppy2', x: 1750, y: 430, type: 'puppy', name: 'Бобик' },
    { id: 'puppy3', x: 2600, y: 410, type: 'puppy', name: 'Тузик' },
  ],
  coins: [
    { x: 100, y: 530 }, { x: 140, y: 530 }, { x: 180, y: 530 },
    { x: 230, y: 440 }, { x: 270, y: 440 },
    { x: 380, y: 370 }, { x: 420, y: 370 },
    { x: 550, y: 310 }, { x: 580, y: 310 },
    // Над дорогой
    { x: 700, y: 450 }, { x: 800, y: 390 }, { x: 900, y: 450 },
    { x: 1000, y: 390 }, { x: 1080, y: 450 },
    // После дорог
    { x: 1650, y: 530 }, { x: 1700, y: 530 },
    { x: 1730, y: 430 }, { x: 1780, y: 430 },
    { x: 1930, y: 360 }, { x: 1970, y: 360 },
    { x: 2130, y: 420 }, { x: 2180, y: 420 },
    { x: 2380, y: 350 }, { x: 2420, y: 350 },
    { x: 2580, y: 410 }, { x: 2630, y: 410 },
    { x: 2780, y: 350 }, { x: 2820, y: 350 },
    { x: 2930, y: 390 }, { x: 2970, y: 390 },
  ],
  obstacles: [
    // Машины — 5 штук на двух дорогах
    { type: 'car', x: 640, y: 536, speed: 160, direction: 'right' },
    { type: 'car', x: 800, y: 536, speed: 200, direction: 'left' },
    { type: 'car', x: 960, y: 536, speed: 140, direction: 'right' },
    { type: 'car', x: 1100, y: 536, speed: 190, direction: 'left' },
    { type: 'car', x: 1350, y: 536, speed: 170, direction: 'right' },
    // Падающие объекты (с балконов)
    { type: 'falling', x: 1800, y: 80, speed: 100 },
    { type: 'falling', x: 2200, y: 60, speed: 130 },
    { type: 'falling', x: 2600, y: 70, speed: 110 },
    { type: 'falling', x: 2900, y: 50, speed: 140 },
    // Догхантеры
    { type: 'dogcatcher', x: 1700, y: 530, speed: 50, patrolRange: 120 },
    { type: 'dogcatcher', x: 2400, y: 530, speed: 60, patrolRange: 150 },
    { type: 'dogcatcher', x: 2800, y: 530, speed: 45, patrolRange: 100 },
  ],
};

export default level1;

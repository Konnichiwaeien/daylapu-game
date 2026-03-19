import { LevelData } from './LevelData';

// Уровень 1: Ночные улицы — Спасти 5 щенков
// jumpForce=-480, gravity=800 → макс прыжок 144px вверх, ~240px вдаль
// Земля y:568 свободна (машины). Платформы — основной геймплей (питомцы, монеты).
// Нижние платформы y:430–450 (доступны с земли), средние y:320–360, высокие y:200–260.
const level1: LevelData = {
  id: 1,
  name: 'Night Streets',
  nameRu: 'Ночные улицы',
  theme: 'city',
  width: 6400,
  height: 1200,
  bgColor: 0x0a0a1a,
  playerStart: { x: 60, y: 500 },
  exitPoint: { x: 6200, y: 440 },
  requiredRescues: 5,
  timeLimit: 150, // секунды
  platforms: [
    // === ЗЕМЛЯ (y:568) — машины ездят, игрок может ходить ===
    { x: 0, y: 568, width: 200 },

    // === КАНАЛИЗАЦИЯ (y:1168) — подземный уровень ===
    { x: 0, y: 1168, width: 200, texture: 'platform_brick' },
    { x: 500, y: 1050, width: 3, texture: 'platform_metal' },
    { x: 800, y: 950, width: 4, texture: 'platform_metal' },
    { x: 1200, y: 1050, width: 5, texture: 'platform_metal' },
    { x: 1600, y: 900, width: 3, texture: 'platform_metal' },
    { x: 2000, y: 1050, width: 4, texture: 'platform_metal' },
    { x: 2500, y: 950, width: 6, texture: 'platform_metal' },
    { x: 3000, y: 850, width: 3, texture: 'platform_metal' },
    { x: 3500, y: 1050, width: 5, texture: 'platform_metal' },
    { x: 4200, y: 950, width: 4, texture: 'platform_metal' },
    { x: 4800, y: 1050, width: 3, texture: 'platform_metal' },
    { x: 5300, y: 900, width: 5, texture: 'platform_metal' },

    // ==========================================================
    // ЗОНА 1: Разминка — БЕТОН (x: 0–950)
    // Низкие платформы, лёгкий подъём. Обучение.
    // ==========================================================
    { x: 100, y: 450, width: 5 },           // первый прыжок (118px — ок)
    { x: 300, y: 450, width: 4 },
    { x: 470, y: 370, width: 5 },           // средний ярус — щенок #1
    { x: 670, y: 450, width: 5 },
    { x: 850, y: 450, width: 3 },
    // Бонус наверху
    { x: 350, y: 290, width: 3 },

    // ==========================================================
    // ЗОНА 2: Пожарные лестницы — МЕТАЛЛ (x: 950–1850)
    // Подъём: 450→370→290→220. Спуск обратно.
    // ==========================================================
    { x: 960, y: 450, width: 3, texture: 'platform_metal' },
    { x: 1100, y: 370, width: 3, texture: 'platform_metal' },
    { x: 1240, y: 290, width: 4, texture: 'platform_metal' },
    { x: 1400, y: 220, width: 5, texture: 'platform_metal' },   // щенок #2
    // Спуск
    { x: 1570, y: 290, width: 3, texture: 'platform_metal' },
    { x: 1700, y: 370, width: 3, texture: 'platform_metal' },
    { x: 1810, y: 450, width: 3, texture: 'platform_metal' },

    // ==========================================================
    // ЗОНА 3: Старые дворы — КИРПИЧ (x: 1850–2850)
    // Два яруса: нижний y:450, верхний y:320. Широкие площадки.
    // ==========================================================
    // Нижний ярус — длинные платформы
    { x: 1920, y: 450, width: 6, texture: 'platform_brick' },
    { x: 2200, y: 450, width: 6, texture: 'platform_brick' },
    { x: 2500, y: 450, width: 5, texture: 'platform_brick' },
    { x: 2700, y: 450, width: 4, texture: 'platform_brick' },
    // Верхний ярус
    { x: 2000, y: 340, width: 4, texture: 'platform_brick' },
    { x: 2200, y: 270, width: 5, texture: 'platform_brick' },   // щенок #3
    { x: 2480, y: 340, width: 4, texture: 'platform_brick' },
    { x: 2680, y: 340, width: 3, texture: 'platform_brick' },

    // ==========================================================
    // ЗОНА 4: Стройка — ДЕРЕВО (x: 2850–3850)
    // Узкие доски, подъём до y:190
    // ==========================================================
    { x: 2880, y: 450, width: 3, texture: 'platform_wood' },
    { x: 3020, y: 370, width: 2, texture: 'platform_wood' },
    { x: 3150, y: 300, width: 2, texture: 'platform_wood' },
    { x: 3280, y: 230, width: 3, texture: 'platform_wood' },
    { x: 3420, y: 190, width: 4, texture: 'platform_wood' },   // щенок #4
    // Спуск
    { x: 3560, y: 260, width: 2, texture: 'platform_wood' },
    { x: 3670, y: 340, width: 2, texture: 'platform_wood' },
    { x: 3770, y: 410, width: 3, texture: 'platform_wood' },
    { x: 3890, y: 450, width: 3, texture: 'platform_wood' },

    // ==========================================================
    // ЗОНА 5: Крыши — МЕТАЛЛ (x: 3900–4900)
    // Самый высокий — до y:160
    // ==========================================================
    { x: 3980, y: 450, width: 3, texture: 'platform_metal' },
    { x: 4110, y: 370, width: 3, texture: 'platform_metal' },
    { x: 4240, y: 300, width: 3, texture: 'platform_metal' },
    { x: 4370, y: 230, width: 4, texture: 'platform_metal' },
    { x: 4520, y: 160, width: 6, texture: 'platform_metal' },
    { x: 4620, y: 90, width: 3, texture: 'platform_metal' },    // Ещё выше!
    { x: 4400, y: 20, width: 4, texture: 'platform_metal' },    // Абсолютный пик
    // Спуск
    { x: 4700, y: 240, width: 3, texture: 'platform_metal' },
    { x: 4820, y: 320, width: 3, texture: 'platform_metal' },
    { x: 4920, y: 400, width: 3, texture: 'platform_metal' },

    // ==========================================================
    // ЗОНА 6: Промзона — КИРПИЧ (x: 4900–5600)
    // ==========================================================
    { x: 5020, y: 450, width: 4, texture: 'platform_brick' },
    { x: 5170, y: 370, width: 4, texture: 'platform_brick' },
    { x: 5320, y: 290, width: 4, texture: 'platform_brick' },
    { x: 5470, y: 370, width: 4, texture: 'platform_brick' },
    { x: 5600, y: 450, width: 4, texture: 'platform_brick' },

    // ==========================================================
    // ЗОНА 7: Финал — БЕТОН (x: 5600–6400)
    // ==========================================================
    { x: 5740, y: 450, width: 4 },
    { x: 5900, y: 380, width: 3 },
    { x: 6040, y: 450, width: 4 },
    { x: 6180, y: 450, width: 5 },          // Приют
  ],
  animals: [
    {
      id: 'puppy1', x: 510, y: 340, type: 'puppy', name: 'Шарик',
      profile: {
        breed: 'Дворняжка',
        color: 'Рыжий с белой грудкой',
        age: '~2 года',
        story: 'Шарик жил у подъезда многоэтажки. Его подкармливали жильцы, но зимой он сильно замёрз и попал в приют. Добрый, ласковый пёс, обожает детей и мячики.',
        needs: 'Стерилизация, прививки, тёплая будка',
        goalAmount: 15000,
        currentAmount: 8700,
      },
    },
    {
      id: 'puppy2', x: 1450, y: 190, type: 'puppy', name: 'Бобик',
      profile: {
        breed: 'Метис лабрадора',
        color: 'Чёрный',
        age: '~1 год',
        story: 'Бобика нашли привязанным к забору стройки. Кто-то просто оставил его там. Несмотря на всё, он верит людям и виляет хвостом каждому.',
        needs: 'Лечение лапы, вакцинация, корм на месяц',
        goalAmount: 12000,
        currentAmount: 4200,
      },
    },
    {
      id: 'puppy3', x: 2260, y: 240, type: 'puppy', name: 'Тузик',
      profile: {
        breed: 'Дворняжка',
        color: 'Бело-серый пятнистый',
        age: '~3 года',
        story: 'Тузик — бывший «дворовый охранник». Гаражи снесли, и он остался без дома. Серьёзный, но очень преданный. Идеальный друг для частного дома.',
        needs: 'Чипирование, обработка от паразитов, ошейник',
        goalAmount: 8000,
        currentAmount: 6100,
      },
    },
    {
      id: 'puppy4', x: 3470, y: 160, type: 'puppy', name: 'Кнопка',
      profile: {
        breed: 'Метис шпица',
        color: 'Кремовый',
        age: '~6 месяцев',
        story: 'Кнопку подбросили в коробке к дверям приюта. Маленькая, пушистая, с огромными глазами. Играет со всеми и спит, свернувшись клубочком.',
        needs: 'Кастрация, прививки, игрушки',
        goalAmount: 10000,
        currentAmount: 7800,
      },
    },
    {
      id: 'puppy5', x: 4450, y: -10, type: 'puppy', name: 'Граф',
      profile: {
        breed: 'Метис овчарки',
        color: 'Чёрно-подпалый',
        age: '~4 года',
        story: 'Граф сбежал от хозяев, которые держали его на короткой цепи. Умный, обученный командам. Ему нужен ответственный хозяин, который даст ему новую жизнь.',
        needs: 'Лечение кожи, усиленное питание, шлейка',
        goalAmount: 18000,
        currentAmount: 5400,
      },
    },
    // Новый щенок в канализации
    {
      id: 'puppy6', x: 2550, y: 910, type: 'puppy', name: 'Люк',
      profile: {
        breed: 'Крысолов',
        color: 'Серый',
        age: '~1 год',
        story: 'Спрятался в канализации от холода. Чуть не простудился.',
        needs: 'Антибиотики',
        goalAmount: 5000,
        currentAmount: 2000,
      },
    }
  ],
  coins: [
    // Зона 1 — на платформах
    { x: 140, y: 420 }, { x: 180, y: 420 },
    { x: 340, y: 420 }, { x: 380, y: 420 },
    { x: 510, y: 340 }, { x: 550, y: 340 },
    { x: 380, y: 260 }, { x: 410, y: 260 },
    { x: 710, y: 420 }, { x: 890, y: 420 },

    // Зона 2
    { x: 1000, y: 420 }, { x: 1140, y: 340 },
    { x: 1280, y: 260 }, { x: 1440, y: 190 }, { x: 1480, y: 190 },
    { x: 1610, y: 260 }, { x: 1740, y: 340 },
    { x: 1850, y: 420 },

    // Зона 3 — на обоих ярусах
    { x: 1970, y: 420 }, { x: 2010, y: 420 },
    { x: 2250, y: 420 }, { x: 2290, y: 420 },
    { x: 2050, y: 310 }, { x: 2260, y: 240 }, { x: 2310, y: 240 },
    { x: 2530, y: 310 }, { x: 2550, y: 420 },
    { x: 2740, y: 420 },

    // Зона 4 — опасные
    { x: 2920, y: 420 }, { x: 3060, y: 340 },
    { x: 3190, y: 270 }, { x: 3320, y: 200 },
    { x: 3460, y: 160 }, { x: 3500, y: 160 },
    { x: 3600, y: 230 }, { x: 3710, y: 310 },
    { x: 3810, y: 380 },

    // Зона 5 — высотные
    { x: 4020, y: 420 }, { x: 4150, y: 340 },
    { x: 4280, y: 270 }, { x: 4410, y: 200 },
    { x: 4560, y: 130 }, { x: 4600, y: 130 }, { x: 4640, y: 130 },
    { x: 4740, y: 210 }, { x: 4860, y: 290 },

    // Зона 6
    { x: 5060, y: 420 }, { x: 5210, y: 340 },
    { x: 5360, y: 260 }, { x: 5510, y: 340 },
    { x: 5640, y: 420 },

    // Зона 7
    { x: 5780, y: 420 }, { x: 5940, y: 350 },
    { x: 6080, y: 420 }, { x: 6220, y: 420 },

    // Монеты в канализации (y: 1168)
    { x: 200, y: 1100 }, { x: 250, y: 1100 },
    { x: 900, y: 1140 }, { x: 950, y: 1140 },
    { x: 1700, y: 1100 }, { x: 1750, y: 1100 },
    { x: 2800, y: 1140 }, { x: 2850, y: 1140 },
    { x: 4500, y: 1100 }, { x: 4550, y: 1100 },
  ],
  collectibles: [
    // Хиллки!
    { type: 'full_heart', x: 800, y: 200 },
    { type: 'full_heart', x: 1210, y: 1000 }, // В канализации
    { type: 'full_heart', x: 2950, y: 180 },
    { type: 'full_heart', x: 4450, y: -70 }, // На самом пике
    { type: 'full_heart', x: 5000, y: 1100 }, // В канализации

    // === ПАУЭРАПЫ ===
    // Магниты — рядом с большими скоплениями монет
    { type: 'magnet', x: 150, y: 420 },        // Зона 1, начало — обучение
    { type: 'magnet', x: 2250, y: 240 },       // Зона 3, верхний ярус — много монет
    { type: 'magnet', x: 4560, y: 100 },       // Зона 5, крыши — куча монет наверху
    { type: 'magnet', x: 1500, y: 1020 },      // Канализация

    // Щиты — перед опасными участками
    { type: 'shield', x: 960, y: 420 },        // Перед пожарными лестницами (Зона 2)
    { type: 'shield', x: 2880, y: 420 },       // Перед стройкой (Зона 4)
    { type: 'shield', x: 5020, y: 420 },       // Перед промзоной (Зона 6)
    { type: 'shield', x: 3200, y: 1020 },      // Канализация, перед кислотой

    // Ускорение — на длинных прямых участках
    { type: 'speed_boost', x: 1920, y: 420 },  // Начало старых дворов (Зона 3)
    { type: 'speed_boost', x: 3980, y: 420 },  // Начало крыш (Зона 5)
    { type: 'speed_boost', x: 5740, y: 420 },  // Финальный рывок (Зона 7)
  ],
  obstacles: [
    // === Машины — земля свободна, опасность при ходьбе по низу ===
    { type: 'car', x: 300, y: 536, speed: 130, direction: 'right', variant: 'red' },
    { type: 'car', x: 700, y: 536, speed: 170, direction: 'left', variant: 'blue' },
    { type: 'car', x: 1200, y: 536, speed: 150, direction: 'right', variant: 'yellow' },
    { type: 'car', x: 1700, y: 536, speed: 190, direction: 'left', variant: 'white' },
    { type: 'car', x: 2400, y: 536, speed: 140, direction: 'right', variant: 'green' },
    { type: 'car', x: 2900, y: 536, speed: 200, direction: 'left', variant: 'red' },
    { type: 'car', x: 3400, y: 536, speed: 160, direction: 'right', variant: 'blue' },
    { type: 'car', x: 3900, y: 536, speed: 180, direction: 'left', variant: 'yellow' },
    { type: 'car', x: 4500, y: 536, speed: 170, direction: 'right', variant: 'white' },
    { type: 'car', x: 5100, y: 536, speed: 210, direction: 'left', variant: 'green' },
    { type: 'car', x: 5600, y: 536, speed: 190, direction: 'right', variant: 'red' },
    { type: 'car', x: 6000, y: 536, speed: 220, direction: 'left', variant: 'blue' },

    // === Люки (Телепорт в канализацию и обратно) ===
    { type: 'hatch', x: 600, y: 568, hatchId: 'street1', targetHatch: 'sewer1' },
    { type: 'hatch', x: 600, y: 1168, hatchId: 'sewer1', targetHatch: 'street1' },
    { type: 'hatch', x: 4250, y: 568, hatchId: 'street2', targetHatch: 'sewer2' },
    { type: 'hatch', x: 4250, y: 1168, hatchId: 'sewer2', targetHatch: 'street2' },
    
    { type: 'hatch', x: 3800, y: 568, hatchId: 'street3', targetHatch: 'sewer3' },
    { type: 'hatch', x: 3800, y: 1168, hatchId: 'sewer3', targetHatch: 'street3' },
    
    { type: 'hatch', x: 5400, y: 568, hatchId: 'street4', targetHatch: 'sewer4' },
    { type: 'hatch', x: 5400, y: 1168, hatchId: 'sewer4', targetHatch: 'street4' },

    // Зоны кислоты в канализации
    { type: 'coldzone', x: 1000, y: 1136, width: 200, height: 60 },
    { type: 'coldzone', x: 3000, y: 1136, width: 300, height: 60 },
    { type: 'coldzone', x: 4800, y: 1136, width: 250, height: 60 },

    // === Падающие кирпичи — опасность сверху! ===
    // Зона 3: стройка рядом
    { type: 'falling', x: 2050, y: -20, speed: 100 },
    { type: 'falling', x: 2300, y: -60, speed: 120 },
    { type: 'falling', x: 2600, y: -40, speed: 110 },
    // Зона 4: стройка — максимум кирпичей
    { type: 'falling', x: 3050, y: -30, speed: 130 },
    { type: 'falling', x: 3250, y: -50, speed: 140 },
    { type: 'falling', x: 3450, y: -10, speed: 120 },
    { type: 'falling', x: 3650, y: -40, speed: 150 },
    // Зона 6: промзона
    { type: 'falling', x: 5100, y: -20, speed: 130 },
    { type: 'falling', x: 5350, y: -50, speed: 140 },

    // === Голуби — летают между платформами ===
    { type: 'pigeon', x: 500, y: 300, speed: 40, patrolRange: 150, direction: 'right' },
    { type: 'pigeon', x: 1100, y: 200, speed: 50, patrolRange: 180, direction: 'right' },
    { type: 'pigeon', x: 1500, y: 170, speed: 45, patrolRange: 160, direction: 'left' },
    { type: 'pigeon', x: 2200, y: 180, speed: 40, patrolRange: 200, direction: 'right' },
    { type: 'pigeon', x: 2700, y: 200, speed: 55, patrolRange: 180, direction: 'left' },
    { type: 'pigeon', x: 3200, y: 150, speed: 50, patrolRange: 160, direction: 'right' },
    { type: 'pigeon', x: 3600, y: 180, speed: 60, patrolRange: 200, direction: 'left' },
    { type: 'pigeon', x: 4200, y: 160, speed: 55, patrolRange: 180, direction: 'right' },
    { type: 'pigeon', x: 4500, y: 130, speed: 65, patrolRange: 220, direction: 'left' },
    { type: 'pigeon', x: 4800, y: 170, speed: 50, patrolRange: 180, direction: 'right' },
    { type: 'pigeon', x: 5250, y: 180, speed: 55, patrolRange: 200, direction: 'left' },
    { type: 'pigeon', x: 5600, y: 150, speed: 60, patrolRange: 180, direction: 'right' },
    { type: 'pigeon', x: 5900, y: 200, speed: 45, patrolRange: 160, direction: 'left' },

    // === Догхантеры — на земле и на платформах ===
    { type: 'dogcatcher', x: 500, y: 530, speed: 45, patrolRange: 120 },
    { type: 'dogcatcher', x: 900, y: 530, speed: 50, patrolRange: 150 },
    { type: 'dogcatcher', x: 1300, y: 530, speed: 55, patrolRange: 180 },
    { type: 'dogcatcher', x: 1700, y: 340, speed: 40, patrolRange: 80 },
    { type: 'dogcatcher', x: 2100, y: 530, speed: 55, patrolRange: 200 },
    { type: 'dogcatcher', x: 2500, y: 420, speed: 45, patrolRange: 100 },
    { type: 'dogcatcher', x: 2800, y: 530, speed: 60, patrolRange: 150 },
    { type: 'dogcatcher', x: 3200, y: 530, speed: 55, patrolRange: 180 },
    { type: 'dogcatcher', x: 3600, y: 260, speed: 40, patrolRange: 60 },
    { type: 'dogcatcher', x: 4000, y: 530, speed: 60, patrolRange: 200 },
    { type: 'dogcatcher', x: 4400, y: 370, speed: 50, patrolRange: 80 },
    { type: 'dogcatcher', x: 4800, y: 530, speed: 65, patrolRange: 180 },
    { type: 'dogcatcher', x: 5200, y: 530, speed: 70, patrolRange: 200 },
    { type: 'dogcatcher', x: 5500, y: 340, speed: 55, patrolRange: 100 },
    { type: 'dogcatcher', x: 5900, y: 530, speed: 65, patrolRange: 180 },

    // === Шипы — на платформах, опасные ловушки ===
    // Зона 1: пара шипов для знакомства
    { type: 'spike', x: 360, y: 450 },
    { type: 'spike', x: 760, y: 450 },
    // Зона 2: на ступенях
    { type: 'spike', x: 1132, y: 370 },
    { type: 'spike', x: 1272, y: 290 }, { type: 'spike', x: 1304, y: 290 },
    { type: 'spike', x: 1702, y: 370 },
    // Зона 3: кирпичные ярусы
    { type: 'spike', x: 2140, y: 450 }, { type: 'spike', x: 2172, y: 450 },
    { type: 'spike', x: 2340, y: 450 }, { type: 'spike', x: 2372, y: 450 },
    { type: 'spike', x: 2520, y: 340 },
    // Зона 4: стройка — САМОЕ ОПАСНОЕ
    { type: 'spike', x: 3052, y: 370 },
    { type: 'spike', x: 3182, y: 300 }, { type: 'spike', x: 3214, y: 300 },
    { type: 'spike', x: 3310, y: 230 },
    { type: 'spike', x: 3592, y: 260 }, { type: 'spike', x: 3624, y: 260 },
    { type: 'spike', x: 3802, y: 410 }, { type: 'spike', x: 3834, y: 410 },
    // Зона 5: крыши
    { type: 'spike', x: 4142, y: 370 },
    { type: 'spike', x: 4272, y: 300 }, { type: 'spike', x: 4304, y: 300 },
    { type: 'spike', x: 4732, y: 240 }, { type: 'spike', x: 4764, y: 240 },
    { type: 'spike', x: 4882, y: 400 },
    // Зона 6: промзона — шипы повсюду
    { type: 'spike', x: 5052, y: 450 },
    { type: 'spike', x: 5202, y: 370 }, { type: 'spike', x: 5234, y: 370 },
    { type: 'spike', x: 5352, y: 290 }, { type: 'spike', x: 5384, y: 290 },
    { type: 'spike', x: 5502, y: 370 }, { type: 'spike', x: 5534, y: 370 },
    { type: 'spike', x: 5632, y: 450 }, { type: 'spike', x: 5664, y: 450 },
    // Зона 7: финальные ловушки
    { type: 'spike', x: 5772, y: 450 },
    { type: 'spike', x: 5932, y: 380 }, { type: 'spike', x: 5964, y: 380 },
    { type: 'spike', x: 6072, y: 450 },
  ],
  movingPlatforms: [
    // Горизонтальная — перевозит через пропасть (Зона 2)
    { x: 1050, y: 360, width: 2, rangeX: 80, rangeY: 0, speed: 1.2 },
    // Вертикальная — лифт на крышу (Зона 3)
    { x: 2100, y: 350, width: 2, rangeX: 0, rangeY: 80, speed: 1.0 },
    // Горизонтальная — через опасную зону (Зона 4)
    { x: 3300, y: 280, width: 2, rangeX: 100, rangeY: 0, speed: 1.5 },
    // Вертикальная — подъем к секрету (Зона 5)
    { x: 4600, y: 250, width: 2, rangeX: 0, rangeY: 100, speed: 0.8 },
    // Диагональная — финальное испытание (Зона 6)
    { x: 5300, y: 330, width: 2, rangeX: 60, rangeY: 40, speed: 1.3 },
  ],
  npcs: [
    // Зона 1 — обучающий
    { x: 170, y: 568, message: 'Осторожно, тут машины! Прыгай по платформам наверх.' },
    // Зона 2 — подсказка о канализации
    { x: 800, y: 568, message: 'Видишь люк? Там внизу тоже есть щенки!' },
    // Зона 3 — совет про крыши
    { x: 2300, y: 568, message: 'На крышах безопаснее, но шипы коварны...' },
    // Зона 5 — подсказка про пауэрапы
    { x: 4100, y: 568, message: 'Магнит притянет все монеты! Ищи его.' },
    // Зона 7 — финал
    { x: 5800, y: 568, message: 'Приют уже рядом! Все питомцы спасены?' },
  ],
};

export default level1;

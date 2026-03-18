// Палитра Дайлапии
export const COLORS = {
  gold: 0xd4a843,
  brown: 0x8b6914,
  green: 0x4a7c59,
  beige: 0xf5e6cc,
  dark: 0x2c1810,
  white: 0xffffff,
  red: 0xe74c3c,
  blue: 0x3498db,
  lightBlue: 0x87ceeb,
  gray: 0x888888,
  snow: 0xe8e8f0,
} as const;

export const CSS_COLORS = {
  gold: '#D4A843',
  brown: '#8B6914',
  green: '#4A7C59',
  beige: '#F5E6CC',
  dark: '#2C1810',
} as const;

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const TILE_SIZE = 32;

// Физика игрока
export const PLAYER = {
  speed: 200,
  jumpForce: -480,
  gravity: 800,
  width: 48,
  height: 64,
  maxHealth: 3,
} as const;

// Враги
export const ENEMY = {
  width: 42,
  height: 58,
} as const;

// Настройки животных
export const ANIMAL = {
  width: 48,
  height: 40,
  rescueTime: 1000, // ms
} as const;

// Монеты
export const COIN = {
  size: 22,
  value: 10,
} as const;

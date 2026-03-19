export interface Position {
  x: number;
  y: number;
}

export interface PlatformData {
  x: number;
  y: number;
  width: number; // в тайлах
  texture?: string;
}

export interface AnimalProfile {
  breed: string;
  color: string;
  age: string;
  story: string;
  needs: string;
  goalAmount: number;
  currentAmount: number;
}

export interface AnimalSpawn {
  id: string;
  x: number;
  y: number;
  type: 'puppy' | 'kitten';
  name: string;
  profile?: AnimalProfile;
}

export interface CoinSpawn {
  x: number;
  y: number;
}

export interface ObstacleData {
  type: 'car' | 'falling' | 'coldzone' | 'hatch' | 'dogcatcher' | 'pigeon' | 'spike';
  x: number;
  y: number;
  width?: number;
  height?: number;
  speed?: number;
  direction?: 'left' | 'right';
  targetHatch?: string;
  hatchId?: string;
  patrolRange?: number;
  variant?: string; // car color variant: 'red', 'blue', 'yellow', 'white', 'green'
}

export interface CollectibleData {
  type: 'food' | 'blanket' | 'full_heart' | 'magnet' | 'shield' | 'speed_boost';
  x: number;
  y: number;
}

export interface MovingPlatformData {
  x: number;
  y: number;
  width: number; // в тайлах
  texture?: string;
  rangeX?: number;  // горизонтальный размах (пиксели)
  rangeY?: number;  // вертикальный размах (пиксели)
  speed?: number;   // скорость движения
}

export interface NPCData {
  x: number;
  y: number;
  message: string;
}

export interface LevelData {
  id: number;
  name: string;
  nameRu: string;
  theme: 'city' | 'construction' | 'winter';
  width: number;
  height: number;
  bgColor: number;
  playerStart: Position;
  exitPoint: Position;
  platforms: PlatformData[];
  animals: AnimalSpawn[];
  coins: CoinSpawn[];
  obstacles: ObstacleData[];
  collectibles?: CollectibleData[];
  movingPlatforms?: MovingPlatformData[];
  npcs?: NPCData[];
  timeLimit?: number;
  requiredRescues: number;
  requiredCollectibles?: number;
}

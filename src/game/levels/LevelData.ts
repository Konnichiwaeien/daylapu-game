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

export interface AnimalSpawn {
  id: string;
  x: number;
  y: number;
  type: 'puppy' | 'kitten';
  name: string;
}

export interface CoinSpawn {
  x: number;
  y: number;
}

export interface ObstacleData {
  type: 'car' | 'falling' | 'coldzone' | 'hatch' | 'dogcatcher';
  x: number;
  y: number;
  width?: number;
  height?: number;
  speed?: number;
  direction?: 'left' | 'right';
  targetHatch?: string;
  hatchId?: string;
  patrolRange?: number;
}

export interface CollectibleData {
  type: 'food' | 'blanket';
  x: number;
  y: number;
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
  timeLimit?: number;
  requiredRescues: number;
  requiredCollectibles?: number;
}

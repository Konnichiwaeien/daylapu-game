import level1 from './level1';
import level2 from './level2';
import level3 from './level3';
import { LevelData } from './LevelData';

export const levels: LevelData[] = [level1, level2, level3];

export function getLevel(id: number): LevelData | undefined {
  return levels.find(l => l.id === id);
}

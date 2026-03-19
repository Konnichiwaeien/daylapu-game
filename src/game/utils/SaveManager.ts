const SAVE_KEY = 'daylapu_save';

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: number;
}

export interface SaveData {
  completedLevels: number[];
  highScores: Record<number, number>;
  totalCoins: number;
  rescuedAnimals: RescuedAnimal[];
  leaderboards: Record<number, LeaderboardEntry[]>;
}

export interface RescuedAnimal {
  id: string;
  type: 'puppy' | 'kitten' | 'dog' | 'cat';
  name: string;
  level: number;
  rescuedAt: number;
}

const defaultSave: SaveData = {
  completedLevels: [],
  highScores: {},
  totalCoins: 0,
  rescuedAnimals: [],
  leaderboards: {},
};

export function loadSave(): SaveData {
  if (typeof window === 'undefined') return { ...defaultSave };
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...defaultSave };
    
    // Merge with defaultSave to ensure new fields like leaderboards exist
    const parsed = JSON.parse(raw);
    return { 
      ...defaultSave, 
      ...parsed,
      leaderboards: parsed.leaderboards || {}
    };
  } catch {
    return { ...defaultSave };
  }
}

export function saveSave(data: SaveData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function completeLevel(levelId: number, score: number, animals: RescuedAnimal[]) {
  const data = loadSave();
  if (!data.completedLevels.includes(levelId)) {
    data.completedLevels.push(levelId);
  }
  if (!data.highScores[levelId] || score > data.highScores[levelId]) {
    data.highScores[levelId] = score;
  }
  for (const animal of animals) {
    if (!data.rescuedAnimals.find(a => a.id === animal.id)) {
      data.rescuedAnimals.push(animal);
    }
  }
  saveSave(data);
  return data;
}

export function addCoins(amount: number) {
  const data = loadSave();
  data.totalCoins += amount;
  saveSave(data);
  return data;
}

export function saveLeaderboardEntry(levelId: number, name: string, score: number) {
  const data = loadSave();
  if (!data.leaderboards[levelId]) {
    data.leaderboards[levelId] = [];
  }
  
  data.leaderboards[levelId].push({
    name,
    score,
    date: Date.now()
  });
  
  // Sort descending and keep top 10
  data.leaderboards[levelId].sort((a, b) => b.score - a.score);
  data.leaderboards[levelId] = data.leaderboards[levelId].slice(0, 10);
  
  saveSave(data);
  return data.leaderboards[levelId];
}

export function getLeaderboard(levelId: number): LeaderboardEntry[] {
  const data = loadSave();
  return data.leaderboards[levelId] || [];
}

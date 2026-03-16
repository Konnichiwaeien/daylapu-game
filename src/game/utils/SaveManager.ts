const SAVE_KEY = 'daylapu_save';

export interface SaveData {
  completedLevels: number[];
  highScores: Record<number, number>;
  totalCoins: number;
  rescuedAnimals: RescuedAnimal[];
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
};

export function loadSave(): SaveData {
  if (typeof window === 'undefined') return { ...defaultSave };
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...defaultSave };
    return { ...defaultSave, ...JSON.parse(raw) };
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

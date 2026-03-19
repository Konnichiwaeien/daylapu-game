// Система достижений — хранение в localStorage

const ACH_KEY = 'daylapu_achievements';

export interface AchievementDef {
  id: string;
  icon: string;
  name: string;
  description: string;
}

export interface AchievementState {
  unlocked: boolean;
  unlockedAt: number | null;
}

// === ОПРЕДЕЛЕНИЯ ДОСТИЖЕНИЙ ===
export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_rescue', icon: '🐾', name: 'Первый шаг', description: 'Спаси первое животное' },
  { id: 'all_rescues', icon: '🐕', name: 'Спаситель', description: 'Спаси всех животных на уровне' },
  { id: 'all_coins', icon: '💰', name: 'Нумизмат', description: 'Собери все монеты на уровне' },
  { id: 'no_damage', icon: '🛡️', name: 'Неуязвимый', description: 'Пройди уровень без урона' },
  { id: 'sewer_explorer', icon: '🕳️', name: 'Диггер', description: 'Посети канализацию' },
  { id: 'speed_demon', icon: '⚡', name: 'Скоростной', description: 'Пройди уровень менее чем за 90 секунд' },
  { id: 'powerup_collector', icon: '🧲', name: 'Собиратель', description: 'Подбери все 3 типа пауэрапов за один уровень' },
  { id: 'rooftop_king', icon: '👑', name: 'Король крыш', description: 'Достигни максимальной высоты' },
  { id: 'hatch_master', icon: '🚪', name: 'Путешественник', description: 'Используй все люки на уровне' },
  { id: 'full_clear', icon: '⭐', name: 'Полное прохождение', description: 'Все монеты + все животные + без урона' },
];

// === ЗАГРУЗКА / СОХРАНЕНИЕ ===

export function loadAchievements(): Record<string, AchievementState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ACH_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveAchievements(data: Record<string, AchievementState>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACH_KEY, JSON.stringify(data));
}

export function isUnlocked(id: string): boolean {
  const data = loadAchievements();
  return data[id]?.unlocked === true;
}

/**
 * Разблокирует достижение. Возвращает true если оно НОВОЕ (первый раз).
 */
export function unlockAchievement(id: string): boolean {
  const data = loadAchievements();
  if (data[id]?.unlocked) return false; // Уже было
  data[id] = { unlocked: true, unlockedAt: Date.now() };
  saveAchievements(data);
  return true;
}

export function getUnlockedCount(): number {
  const data = loadAchievements();
  return Object.values(data).filter(a => a.unlocked).length;
}

/**
 * Полный список достижений с текущим статусом (для UI).
 */
export function getAllAchievementsWithStatus(): (AchievementDef & AchievementState)[] {
  const data = loadAchievements();
  return ACHIEVEMENTS.map(def => ({
    ...def,
    unlocked: data[def.id]?.unlocked || false,
    unlockedAt: data[def.id]?.unlockedAt || null,
  }));
}

// === ПРОВЕРКА УСЛОВИЙ (вызывается из GameScene) ===

export interface LevelStats {
  coinsCollected: number;
  totalCoins: number;
  rescued: number;
  requiredRescues: number;
  totalAnimals: number;
  damageTaken: number;
  timeSpent: number;
  visitedSewer: boolean;
  minY: number; // Минимальная достигнутая Y-координата
  usedHatches: Set<string>;
  totalHatches: number;
  powerupsCollected: Set<string>; // 'magnet' | 'shield' | 'speed_boost'
  levelCompleted: boolean;
}

/**
 * Проверяет все достижения по текущей статистике уровня.
 * Возвращает массив НОВЫХ разблокированных достижений.
 */
export function checkAchievements(stats: LevelStats): AchievementDef[] {
  const newlyUnlocked: AchievementDef[] = [];

  function tryUnlock(id: string) {
    if (unlockAchievement(id)) {
      const def = ACHIEVEMENTS.find(a => a.id === id);
      if (def) newlyUnlocked.push(def);
    }
  }

  // Первый шаг — спас хотя бы одно животное
  if (stats.rescued > 0) {
    tryUnlock('first_rescue');
  }

  // Диггер — посетил канализацию
  if (stats.visitedSewer) {
    tryUnlock('sewer_explorer');
  }

  // Король крыш — y < 50
  if (stats.minY < 50) {
    tryUnlock('rooftop_king');
  }

  // Только при завершении уровня:
  if (stats.levelCompleted) {
    // Спаситель — все животные
    if (stats.rescued >= stats.totalAnimals && stats.totalAnimals > 0) {
      tryUnlock('all_rescues');
    }

    // Нумизмат — все монеты
    if (stats.coinsCollected >= stats.totalCoins && stats.totalCoins > 0) {
      tryUnlock('all_coins');
    }

    // Неуязвимый — без урона
    if (stats.damageTaken === 0) {
      tryUnlock('no_damage');
    }

    // Скоростной — менее 90 секунд
    if (stats.timeSpent < 90) {
      tryUnlock('speed_demon');
    }

    // Собиратель — все 3 типа пауэрапов 
    if (stats.powerupsCollected.has('magnet') && 
        stats.powerupsCollected.has('shield') && 
        stats.powerupsCollected.has('speed_boost')) {
      tryUnlock('powerup_collector');
    }

    // Путешественник — все люки
    if (stats.totalHatches > 0 && stats.usedHatches.size >= stats.totalHatches) {
      tryUnlock('hatch_master');
    }

    // Полное прохождение — всё-всё-всё
    if (stats.coinsCollected >= stats.totalCoins &&
        stats.rescued >= stats.totalAnimals &&
        stats.damageTaken === 0 &&
        stats.totalCoins > 0 && stats.totalAnimals > 0) {
      tryUnlock('full_clear');
    }
  }

  return newlyUnlocked;
}

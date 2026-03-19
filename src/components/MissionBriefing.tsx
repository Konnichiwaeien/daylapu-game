'use client';

import { useEffect, useState, useCallback } from 'react';

interface MissionData {
  levelId: number;
  levelName: string;
  theme: string;
  requiredRescues: number;
  requiredCollectibles?: number;
  timeLimit?: number;
}

const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: 'Ночной Сургут — спасай бездомных щенков и котят на городских улицах! Берегись машин и голубей.',
  2: 'На стройке брошены котята! Спасай их из опасных зон, избегай падающих кирпичей и используй люки.',
  3: 'Зимний шторм! Собери корм и одеяла для приюта. Время ограничено — торопись!',
};

const CONTROLS = [
  { keys: '← →  или  A D', action: 'Бегать' },
  { keys: '↑  или  W', action: 'Прыгать' },
  { keys: 'E', action: 'Спасти животное' },
  { keys: 'F', action: 'Стрелять сердечками' },
  { keys: 'ESC', action: 'Пауза' },
];

export default function MissionBriefing() {
  const [mission, setMission] = useState<MissionData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const data = (e as CustomEvent<MissionData>).detail;
      setMission(data);
      setVisible(true);
    };
    window.addEventListener('mission-briefing', handler);
    return () => { window.removeEventListener('mission-briefing', handler); };
  }, []);

  const handleStart = useCallback(() => {
    setVisible(false);
    setMission(null);
    window.dispatchEvent(new CustomEvent('mission-briefing-closed'));
  }, []);

  // Также закрывать по пробелу или Enter
  useEffect(() => {
    if (!visible) return;
    const keyHandler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible, handleStart]);

  if (!visible || !mission) return null;

  const desc = LEVEL_DESCRIPTIONS[mission.levelId] || 'Спаси всех животных и доберись до приюта!';

  return (
    <div style={s.overlay}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.border}>
          {/* Заголовок */}
          <div style={s.header}>
            <span style={s.emoji}>📋</span>
            <span style={s.headerText}>ЗАДАНИЕ</span>
            <span style={s.emoji}>📋</span>
          </div>

          {/* Имя уровня */}
          <div style={s.levelName}>{mission.levelName}</div>

          {/* Описание */}
          <div style={s.descBlock}>
            <div style={s.descText}>{desc}</div>
          </div>

          {/* Цели */}
          <div style={s.goalsBlock}>
            <div style={s.sectionTitle}>🎯 Цели:</div>
            <div style={s.goalItem}>🐾 Спасти животных: {mission.requiredRescues}</div>
            {mission.requiredCollectibles && (
              <div style={s.goalItem}>📦 Собрать предметов: {mission.requiredCollectibles}</div>
            )}
            {mission.timeLimit && (
              <div style={s.goalItem}>⏱️ Ограничение: {mission.timeLimit} сек</div>
            )}
            <div style={s.goalItem}>🏠 Добраться до приюта</div>
          </div>

          {/* Управление */}
          <div style={s.controlsBlock}>
            <div style={s.sectionTitle}>🎮 Управление:</div>
            <div style={s.controlsGrid}>
              {CONTROLS.map((c, i) => (
                <div key={i} style={s.controlRow}>
                  <span style={s.controlKeys}>{c.keys}</span>
                  <span style={s.controlAction}>{c.action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Кнопка старт */}
          <button style={s.startBtn} onClick={handleStart}>
            ▶ НАЧАТЬ МИССИЮ
          </button>

          <div style={s.hint}>Нажми ПРОБЕЛ или кликни по кнопке</div>
        </div>
      </div>
    </div>
  );
}

const pixelFont = '"Press Start 2P", "Courier New", monospace';
const sansFont = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    width: '100%',
    maxWidth: 560,
    margin: '0 16px',
  },
  border: {
    background: '#1a1a2e',
    border: '4px solid #D4A843',
    borderRadius: 0,
    padding: 24,
    boxShadow: '0 0 0 2px #2C1810, 0 0 0 6px #D4A843, 8px 8px 0 rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 10,
  },
  emoji: {
    fontSize: 28,
  },
  headerText: {
    fontFamily: pixelFont,
    fontSize: 24,
    color: '#FFD700',
    textShadow: '2px 2px 0 #8B6914',
    letterSpacing: 3,
  },
  levelName: {
    fontFamily: pixelFont,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center' as const,
    marginBottom: 14,
    textShadow: '1px 1px 0 #000',
  },
  descBlock: {
    marginBottom: 14,
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '2px solid #333355',
  },
  descText: {
    fontFamily: sansFont,
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 1.6,
  },
  goalsBlock: {
    marginBottom: 14,
    padding: '10px 14px',
    background: 'rgba(74, 124, 89, 0.15)',
    border: '2px solid #4A7C59',
  },
  sectionTitle: {
    fontFamily: pixelFont,
    fontSize: 12,
    color: '#FFD700',
    marginBottom: 8,
  },
  goalItem: {
    fontFamily: sansFont,
    fontSize: 15,
    color: '#AADDBB',
    marginBottom: 4,
    paddingLeft: 4,
  },
  controlsBlock: {
    marginBottom: 16,
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '2px solid #333355',
  },
  controlsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
  },
  controlRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlKeys: {
    fontFamily: pixelFont,
    fontSize: 11,
    color: '#D4A843',
  },
  controlAction: {
    fontFamily: sansFont,
    fontSize: 14,
    color: '#CCCCCC',
  },
  startBtn: {
    width: '100%',
    padding: '14px 20px',
    fontFamily: pixelFont,
    fontSize: 16,
    color: '#FFFFFF',
    background: 'linear-gradient(to bottom, #4A7C59, #3a6a49)',
    border: '3px solid #FFD700',
    borderRadius: 0,
    cursor: 'pointer',
    textAlign: 'center' as const,
    marginBottom: 8,
    textShadow: '1px 1px 0 #000',
    letterSpacing: 1,
    boxShadow: '0 4px 0 #2a5a35, inset 0 1px 0 rgba(255,255,255,0.2)',
  },
  hint: {
    fontFamily: sansFont,
    fontSize: 12,
    color: '#666677',
    textAlign: 'center' as const,
  },
};

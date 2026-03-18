'use client';

import { useEffect, useState, useCallback } from 'react';

interface AnimalData {
  name: string;
  type: 'puppy' | 'kitten';
  profile?: {
    breed: string;
    color: string;
    age: string;
    story: string;
    needs: string;
    goalAmount: number;
    currentAmount: number;
  };
}

export default function RescueModal() {
  const [animal, setAnimal] = useState<AnimalData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const data = (e as CustomEvent<AnimalData>).detail;
      setAnimal(data);
      setVisible(true);
    };
    window.addEventListener('animal-rescued', handler);
    return () => { window.removeEventListener('animal-rescued', handler); };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setAnimal(null);
    window.dispatchEvent(new CustomEvent('rescue-modal-closed'));
  }, []);

  const handleDonate = useCallback(() => {
    window.open('https://daylapu.ru/donate', '_blank');
  }, []);

  if (!visible || !animal) return null;

  const profile = animal.profile;
  const progress = profile
    ? Math.min(100, Math.round((profile.currentAmount / profile.goalAmount) * 100))
    : 0;
  const emoji = animal.type === 'puppy' ? '🐕' : '🐱';

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Пиксельная рамка */}
        <div style={styles.border}>
          {/* Заголовок */}
          <div style={styles.header}>
            <span style={styles.headerEmoji}>{emoji}</span>
            <span style={styles.headerText}>СПАСЁН!</span>
            <span style={styles.headerEmoji}>{emoji}</span>
          </div>

          {/* Имя */}
          <div style={styles.name}>{animal.name}</div>

          {profile ? (
            <>
              {/* Инфо-блок */}
              <div style={styles.infoGrid}>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Порода:</span>
                  <span style={styles.value}>{profile.breed}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Окрас:</span>
                  <span style={styles.value}>{profile.color}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Возраст:</span>
                  <span style={styles.value}>{profile.age}</span>
                </div>
              </div>

              {/* История */}
              <div style={styles.storyBlock}>
                <div style={styles.storyTitle}>История</div>
                <div style={styles.storyText}>{profile.story}</div>
              </div>

              {/* Нужды */}
              <div style={styles.needsBlock}>
                <div style={styles.needsTitle}>Нужды:</div>
                <div style={styles.needsText}>{profile.needs}</div>
              </div>

              {/* Прогресс-бар сбора */}
              <div style={styles.progressSection}>
                <div style={styles.progressLabel}>
                  Собрано {profile.currentAmount.toLocaleString('ru-RU')} ₽
                  из {profile.goalAmount.toLocaleString('ru-RU')} ₽
                </div>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${progress}%` }}>
                    {progress > 15 && <span style={styles.progressPercent}>{progress}%</span>}
                  </div>
                </div>
              </div>

              {/* Кнопка доната */}
              <button style={styles.donateBtn} onClick={handleDonate}>
                ❤️ ПОМОЧЬ {animal.name.toUpperCase()}
              </button>
            </>
          ) : (
            <div style={styles.storyText}>
              {animal.name} теперь в безопасности!
            </div>
          )}

          {/* Кнопка закрыть */}
          <button style={styles.closeBtn} onClick={handleClose}>
            ПРОДОЛЖИТЬ ИГРУ ▸
          </button>
        </div>
      </div>
    </div>
  );
}

const pixelFont = '"Press Start 2P", "Courier New", monospace';

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
    padding: 28,
    boxShadow: '0 0 0 2px #2C1810, 0 0 0 6px #D4A843, 8px 8px 0 rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  headerEmoji: {
    fontSize: 32,
  },
  headerText: {
    fontFamily: pixelFont,
    fontSize: 24,
    color: '#FFD700',
    textShadow: '2px 2px 0 #8B6914',
    letterSpacing: 3,
  },
  name: {
    fontFamily: pixelFont,
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center' as const,
    marginBottom: 18,
    textShadow: '1px 1px 0 #000',
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
    marginBottom: 14,
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '2px solid #333355',
  },
  infoRow: {
    display: 'flex',
    gap: 8,
  },
  label: {
    fontFamily: pixelFont,
    fontSize: 14,
    color: '#D4A843',
    minWidth: 100,
  },
  value: {
    fontFamily: pixelFont,
    fontSize: 14,
    color: '#CCCCCC',
  },
  storyBlock: {
    marginBottom: 14,
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '2px solid #333355',
  },
  storyTitle: {
    fontFamily: pixelFont,
    fontSize: 16,
    color: '#D4A843',
    marginBottom: 8,
  },
  storyText: {
    fontFamily: pixelFont,
    fontSize: 14,
    color: '#BBBBBB',
    lineHeight: 1.7,
  },
  needsBlock: {
    marginBottom: 14,
    padding: '10px 16px',
    background: 'rgba(74, 124, 89, 0.15)',
    border: '2px solid #4A7C59',
  },
  needsTitle: {
    fontFamily: pixelFont,
    fontSize: 14,
    color: '#66BB77',
    marginBottom: 6,
  },
  needsText: {
    fontFamily: pixelFont,
    fontSize: 14,
    color: '#AADDBB',
    lineHeight: 1.6,
  },
  progressSection: {
    marginBottom: 14,
  },
  progressLabel: {
    fontFamily: pixelFont,
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 18,
    background: '#2a2a3e',
    border: '2px solid #555577',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(to right, #4A7C59, #66BB77)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'width 0.5s ease',
  },
  progressPercent: {
    fontFamily: pixelFont,
    fontSize: 12,
    color: '#FFFFFF',
    textShadow: '1px 1px 0 #000',
  },
  donateBtn: {
    width: '100%',
    padding: '14px 20px',
    fontFamily: pixelFont,
    fontSize: 16,
    color: '#FFFFFF',
    background: 'linear-gradient(to bottom, #e74c3c, #c0392b)',
    border: '3px solid #FFD700',
    borderRadius: 0,
    cursor: 'pointer',
    textAlign: 'center' as const,
    marginBottom: 12,
    textShadow: '1px 1px 0 #000',
    letterSpacing: 1,
    boxShadow: '0 4px 0 #8B2500, inset 0 1px 0 rgba(255,255,255,0.2)',
  },
  closeBtn: {
    width: '100%',
    padding: '12px 20px',
    fontFamily: pixelFont,
    fontSize: 14,
    color: '#D4A843',
    background: 'transparent',
    border: '2px solid #555566',
    borderRadius: 0,
    cursor: 'pointer',
    textAlign: 'center' as const,
    letterSpacing: 1,
  },
};

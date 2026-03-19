'use client';
import { useState, useEffect } from 'react';
import { getAllAchievementsWithStatus, getUnlockedCount, ACHIEVEMENTS } from '@/game/utils/AchievementManager';

interface AchievementDisplay {
  id: string;
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt: number | null;
}

export default function AchievementsModal({ onClose }: { onClose: () => void }) {
  const [achievements, setAchievements] = useState<AchievementDisplay[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    setAchievements(getAllAchievementsWithStatus());
    setUnlockedCount(getUnlockedCount());
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#1a1a2e',
          border: '2px solid #d4a843',
          borderRadius: 16,
          padding: '24px 28px',
          maxWidth: 480,
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          color: '#f5e6cc',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#d4a843', margin: 0 }}>
            🏆 Достижения
          </h2>
          <span style={{ fontSize: 14, color: '#8b6914' }}>
            {unlockedCount}/{ACHIEVEMENTS.length}
          </span>
        </div>

        {/* Прогресс-бар */}
        <div style={{
          height: 6,
          backgroundColor: '#333',
          borderRadius: 3,
          marginBottom: 20,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%`,
            backgroundColor: '#d4a843',
            borderRadius: 3,
            transition: 'width 0.3s',
          }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {achievements.map(ach => (
            <div
              key={ach.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '10px 14px',
                borderRadius: 10,
                backgroundColor: ach.unlocked ? 'rgba(212,168,67,0.12)' : 'rgba(255,255,255,0.03)',
                border: ach.unlocked ? '1px solid rgba(212,168,67,0.4)' : '1px solid rgba(255,255,255,0.06)',
                opacity: ach.unlocked ? 1 : 0.5,
              }}
            >
              <span style={{ fontSize: 28, filter: ach.unlocked ? 'none' : 'grayscale(1)' }}>
                {ach.icon}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: ach.unlocked ? '#d4a843' : '#666',
                }}>
                  {ach.name}
                </div>
                <div style={{ fontSize: 12, color: ach.unlocked ? '#aaa' : '#555' }}>
                  {ach.description}
                </div>
              </div>
              {ach.unlocked && (
                <span style={{ fontSize: 11, color: '#4a7c59' }}>✓</span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 20,
            width: '100%',
            padding: '10px 0',
            borderRadius: 8,
            border: '1px solid #d4a843',
            backgroundColor: 'transparent',
            color: '#d4a843',
            fontSize: 14,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}

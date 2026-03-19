'use client';

import React, { useEffect, useState } from 'react';
import { getLeaderboard, saveLeaderboardEntry, LeaderboardEntry } from '@/game/utils/SaveManager';

export default function LeaderboardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [levelId, setLevelId] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [levelName, setLevelName] = useState<string>('');
  
  const [playerName, setPlayerName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const handleShowLeaderboard = (e: Event) => {
      const customEvent = e as CustomEvent;
      const data = customEvent.detail;
      setLevelId(data.levelId);
      setScore(data.score);
      setLevelName(data.levelName);
      
      // Сброс стейта
      setIsSubmitted(false);
      setPlayerName('');
      setLeaderboard(getLeaderboard(data.levelId));
      setIsOpen(true);
    };

    window.addEventListener('show-leaderboard', handleShowLeaderboard);
    return () => {
      window.removeEventListener('show-leaderboard', handleShowLeaderboard);
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameToSave = playerName.trim() || 'Аноним';
    const updatedLeaderboard = saveLeaderboardEntry(levelId, nameToSave, score);
    setLeaderboard(updatedLeaderboard);
    setIsSubmitted(true);
  };

  const handleSkip = () => {
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      color: '#fff',
    }}>
      <div style={{
        backgroundColor: '#1E1E2E',
        border: '4px solid #FFD700',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
      }}>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <h2 style={{ color: '#FFD700', fontSize: '20px', marginBottom: '20px' }}>Уровень Пройден!</h2>
            <p style={{ fontSize: '14px', marginBottom: '10px', color: '#AAA' }}>{levelName}</p>
            <p style={{ fontSize: '18px', marginBottom: '30px', color: '#FFF' }}>Твой счёт: <span style={{ color: '#FFD700' }}>{score}</span></p>
            
            <div style={{ marginBottom: '20px' }}>
              <input 
                type="text" 
                placeholder="Введи своё имя..." 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={12}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  fontFamily: '"Press Start 2P", monospace',
                  width: '100%',
                  boxSizing: 'border-box',
                  backgroundColor: '#000',
                  color: '#FFD700',
                  border: '2px solid #555',
                  outline: 'none',
                  textAlign: 'center'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                type="submit"
                style={{
                  padding: '12px 20px',
                  fontSize: '12px',
                  fontFamily: '"Press Start 2P", monospace',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: '2px solid #FFF',
                  cursor: 'pointer'
                }}
              >
                Сохранить
              </button>
              <button 
                type="button"
                onClick={handleSkip}
                style={{
                  padding: '12px 20px',
                  fontSize: '12px',
                  fontFamily: '"Press Start 2P", monospace',
                  backgroundColor: '#666',
                  color: 'white',
                  border: '2px solid #FFF',
                  cursor: 'pointer'
                }}
              >
                Пропустить
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h2 style={{ color: '#FFD700', fontSize: '20px', marginBottom: '10px' }}>Таблица Лидеров</h2>
            <p style={{ fontSize: '12px', marginBottom: '20px', color: '#AAA' }}>{levelName}</p>
            
            <div style={{ 
              backgroundColor: '#000', 
              padding: '15px', 
              border: '2px solid #555',
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              {leaderboard.length === 0 ? (
                <p style={{ fontSize: '12px', textAlign: 'center', color: '#666' }}>Пока нет рекордов</p>
              ) : (
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: '#FFD700', borderBottom: '2px solid #555' }}>
                      <th style={{ padding: '8px', textAlign: 'left' }}>#</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Имя</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Счет</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={index} style={{ 
                        borderBottom: '1px solid #333',
                        color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#FFF',
                        backgroundColor: entry.score === score && entry.name === (playerName || 'Аноним') ? '#333355' : 'transparent'
                      }}>
                        <td style={{ padding: '8px' }}>{index + 1}</td>
                        <td style={{ padding: '8px' }}>{entry.name}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{entry.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <button 
              onClick={handleClose}
              style={{
                padding: '12px 20px',
                fontSize: '12px',
                fontFamily: '"Press Start 2P", monospace',
                backgroundColor: '#FFd700',
                color: '#000',
                border: '2px solid #FFF',
                cursor: 'pointer'
              }}
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

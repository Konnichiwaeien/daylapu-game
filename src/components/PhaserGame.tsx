'use client';

import { useEffect, useRef } from 'react';
import { EventBus } from '@/game/EventBus';

const GAME_CONTAINER_ID = 'phaser-game';

export default function PhaserGame() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // Динамический импорт Phaser (client-only)
    import('@/game/main').then(({ createGame }) => {
      if (gameRef.current) return;
      gameRef.current = createGame(GAME_CONTAINER_ID);
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      EventBus.removeAllListeners();
    };
  }, []);

  return (
    <div
      id={GAME_CONTAINER_ID}
      style={{
        width: '100%',
        maxWidth: '1040px',
        margin: '0 auto',
        aspectRatio: '4/3',
      }}
    />
  );
}

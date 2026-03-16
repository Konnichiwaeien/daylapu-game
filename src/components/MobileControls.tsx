'use client';

import { useEffect, useState } from 'react';
import { EventBus } from '@/game/EventBus';

export default function MobileControls() {
  const [isMobile, setIsMobile] = useState(false);
  const [isInGame, setIsInGame] = useState(false);

  useEffect(() => {
    setIsMobile(navigator.maxTouchPoints > 0);

    const onSceneReady = (scene: { scene: { key: string } }) => {
      setIsInGame(scene.scene.key === 'GameScene');
    };
    EventBus.on('current-scene-ready', onSceneReady);

    return () => {
      EventBus.off('current-scene-ready', onSceneReady);
    };
  }, []);

  if (!isMobile || !isInGame) return null;

  const btnBase: React.CSSProperties = {
    width: 56,
    height: 56,
    borderRadius: '50%',
    backgroundColor: 'rgba(212, 168, 67, 0.6)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    touchAction: 'none',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 140,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {/* Left side: movement */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          bottom: 20,
          display: 'flex',
          gap: 8,
          pointerEvents: 'auto',
        }}
      >
        <button
          style={btnBase}
          onTouchStart={() => EventBus.emit('mobile-left-down')}
          onTouchEnd={() => EventBus.emit('mobile-left-up')}
        >
          ◀
        </button>
        <button
          style={btnBase}
          onTouchStart={() => EventBus.emit('mobile-right-down')}
          onTouchEnd={() => EventBus.emit('mobile-right-up')}
        >
          ▶
        </button>
      </div>

      {/* Right side: actions */}
      <div
        style={{
          position: 'absolute',
          right: 16,
          bottom: 20,
          display: 'flex',
          gap: 8,
          pointerEvents: 'auto',
        }}
      >
        <button
          style={{ ...btnBase, backgroundColor: 'rgba(231, 76, 60, 0.6)' }}
          onTouchStart={() => EventBus.emit('mobile-shoot')}
        >
          ❤
        </button>
        <button
          style={{ ...btnBase, backgroundColor: 'rgba(74, 124, 89, 0.6)' }}
          onTouchStart={() => EventBus.emit('mobile-interact')}
        >
          E
        </button>
        <button
          style={{ ...btnBase, backgroundColor: 'rgba(74, 124, 89, 0.7)', width: 64, height: 64 }}
          onTouchStart={() => EventBus.emit('mobile-jump')}
        >
          ▲
        </button>
      </div>
    </div>
  );
}

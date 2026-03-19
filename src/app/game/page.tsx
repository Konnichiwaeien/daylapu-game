'use client';

import dynamic from 'next/dynamic';
import MobileControls from '@/components/MobileControls';
import RescueModal from '@/components/RescueModal';
import MissionBriefing from '@/components/MissionBriefing';
import LeaderboardModal from '@/components/LeaderboardModal';

const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      maxWidth: 1040,
      margin: '0 auto',
      aspectRatio: '4/3',
      backgroundColor: '#2C1810',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#D4A843',
      fontSize: 18,
    }}>
      Загрузка игры...
    </div>
  ),
});

export default function GamePage() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <PhaserGame />
      <MobileControls />
      <RescueModal />
      <MissionBriefing />
      <LeaderboardModal />
    </main>
  );
}

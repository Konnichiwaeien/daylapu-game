'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadSave, RescuedAnimal } from '@/game/utils/SaveManager';

export default function CollectionPage() {
  const [animals, setAnimals] = useState<RescuedAnimal[]>([]);
  const [totalCoins, setTotalCoins] = useState(0);

  useEffect(() => {
    const save = loadSave();
    setAnimals(save.rescuedAnimals);
    setTotalCoins(save.totalCoins);
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#2C1810' }}>
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/game"
            className="text-sm font-bold"
            style={{ color: '#D4A843' }}
          >
            ← К игре
          </Link>
          <h1
            className="text-2xl font-bold"
            style={{ color: '#D4A843' }}
          >
            Коллекция Героев
          </h1>
          <span style={{ color: '#D4A843' }}>🐾 {totalCoins}</span>
        </div>

        {animals.length === 0 ? (
          <div className="text-center py-20" style={{ color: '#8B6914' }}>
            <p className="text-lg mb-4">Пока здесь пусто...</p>
            <p className="text-sm">Спаси животных в игре, и они появятся в твоей коллекции!</p>
            <Link
              href="/game"
              className="inline-block mt-6 px-6 py-3 rounded-lg font-bold"
              style={{ backgroundColor: '#4A7C59', color: '#fff' }}
            >
              Играть
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {animals.map((animal) => (
              <div
                key={animal.id}
                className="rounded-xl p-4 text-center"
                style={{
                  backgroundColor: '#3d2a1a',
                  border: '2px solid #D4A843',
                }}
              >
                <div className="text-4xl mb-2">
                  {animal.type === 'puppy' || animal.type === 'dog' ? '🐕' : '🐈'}
                </div>
                <div className="font-bold text-lg" style={{ color: '#F5E6CC' }}>
                  {animal.name}
                </div>
                <div className="text-xs mt-1" style={{ color: '#8B6914' }}>
                  {animal.type === 'puppy' ? 'Щенок' : animal.type === 'kitten' ? 'Котёнок' : animal.type === 'dog' ? 'Собака' : 'Кот'}
                </div>
                <div className="text-xs mt-1" style={{ color: '#666' }}>
                  Уровень {animal.level}
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          className="mt-8 rounded-xl p-6 text-center"
          style={{ backgroundColor: '#3d2a1a', border: '1px solid #4A7C59' }}
        >
          <p style={{ color: '#4A7C59' }} className="text-sm font-bold mb-2">
            Каждое спасённое животное в игре — реальная история!
          </p>
          <p style={{ color: '#8B6914' }} className="text-xs">
            Фонд «Дай лапу» помогает бездомным животным Сургута.
            100 лапок = микродонат 10₽ реальному приюту.
          </p>
        </div>
      </div>
    </main>
  );
}

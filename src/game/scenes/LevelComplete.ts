import * as Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '@/lib/constants';
import { getLevel, levels } from '../levels';
import { EventBus } from '../EventBus';

interface LevelCompleteData {
  levelId: number;
  score: number;
  coins: number;
  rescued: number;
  timeLeft: number;
}

export class LevelComplete extends Phaser.Scene {
  private data!: LevelCompleteData;

  constructor() {
    super('LevelComplete');
  }

  init(data: LevelCompleteData) {
    this.data = data;
  }

  create() {
    const d = this.data;
    const level = getLevel(d.levelId);
    this.cameras.main.setBackgroundColor(COLORS.dark);

    // Заголовок
    this.add.text(GAME_WIDTH / 2, 60, 'УРОВЕНЬ ПРОЙДЕН!', {
      fontSize: '36px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 105, level?.nameRu || '', {
      fontSize: '18px',
      color: '#D4A843',
    }).setOrigin(0.5);

    // Статистика
    const stats = [
      { label: 'Спасено животных', value: `${d.rescued}`, icon: '🐕' },
      { label: 'Собрано лапок', value: `${d.coins}`, icon: '🐾' },
      { label: 'Бонус за время', value: `${d.timeLeft * 5}`, icon: '⏱' },
      { label: 'Итого', value: `${d.score}`, icon: '⭐' },
    ];

    stats.forEach((stat, i) => {
      const y = 170 + i * 50;
      this.add.text(GAME_WIDTH / 2 - 150, y, `${stat.icon} ${stat.label}`, {
        fontSize: '18px',
        color: '#F5E6CC',
      });
      this.add.text(GAME_WIDTH / 2 + 150, y, stat.value, {
        fontSize: '22px',
        color: '#FFD700',
        fontStyle: 'bold',
      }).setOrigin(1, 0);
    });

    // Разделитель
    const line = this.add.graphics();
    line.lineStyle(1, COLORS.gold, 0.5);
    line.lineBetween(GAME_WIDTH / 2 - 180, 390, GAME_WIDTH / 2 + 180, 390);

    // Реальная информация (placeholder)
    this.add.text(GAME_WIDTH / 2, 415, 'В реальности фонд «Дай лапу» спасает', {
      fontSize: '14px',
      color: '#A0A0A0',
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 435, 'сотни животных каждый год в Сургуте!', {
      fontSize: '14px',
      color: '#A0A0A0',
    }).setOrigin(0.5);

    // Кнопки
    const nextLevelExists = levels.some(l => l.id === d.levelId + 1);

    if (nextLevelExists) {
      this.createButton(GAME_WIDTH / 2, 490, 'СЛЕДУЮЩИЙ УРОВЕНЬ', () => {
        this.scene.start('GameScene', { levelId: d.levelId + 1 });
      });
    }

    this.createButton(GAME_WIDTH / 2, 540, 'К УРОВНЯМ', () => {
      this.scene.start('LevelSelect');
    });

    // Анимация появления
    this.cameras.main.fadeIn(500);

    EventBus.emit('current-scene-ready', this);
    EventBus.emit('level-complete', d);
  }

  private createButton(x: number, y: number, text: string, onClick: () => void) {
    const bg = this.add.rectangle(x, y, 280, 40, COLORS.green)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => bg.setFillStyle(COLORS.gold))
      .on('pointerout', () => bg.setFillStyle(COLORS.green))
      .on('pointerdown', onClick);

    this.add.text(x, y, text, {
      fontSize: '16px',
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }
}

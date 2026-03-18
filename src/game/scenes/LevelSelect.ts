import * as Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '@/lib/constants';
import { levels } from '../levels';
import { loadSave } from '../utils/SaveManager';
import { EventBus } from '../EventBus';

export class LevelSelect extends Phaser.Scene {
  constructor() {
    super('LevelSelect');
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.beige);
    const save = loadSave();

    this.add.text(GAME_WIDTH / 2, 60, 'ВЫБЕРИ УРОВЕНЬ', {
      fontSize: '32px',
      color: '#2C1810',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    levels.forEach((level, index) => {
      const y = 160 + index * 120;
      const isUnlocked = index === 0 || save.completedLevels.includes(levels[index - 1].id);
      const isCompleted = save.completedLevels.includes(level.id);

      // Карточка уровня
      const cardColor = isUnlocked ? COLORS.green : COLORS.gray;
      const card = this.add.rectangle(GAME_WIDTH / 2, y, 500, 90, cardColor, 0.9)
        .setStrokeStyle(2, isCompleted ? COLORS.gold : COLORS.dark);

      if (isUnlocked) {
        card.setInteractive({ useHandCursor: true })
          .on('pointerover', () => card.setFillStyle(COLORS.gold, 0.9))
          .on('pointerout', () => card.setFillStyle(COLORS.green, 0.9))
          .on('pointerdown', () => {
            this.scene.start('GameScene', { levelId: level.id });
          });
      }

      // Номер уровня
      this.add.text(GAME_WIDTH / 2 - 210, y - 15, `${level.id}`, {
        fontSize: '32px',
        color: '#FFFFFF',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // Название
      this.add.text(GAME_WIDTH / 2 - 50, y - 15, level.nameRu, {
        fontSize: '16px',
        color: '#FFFFFF',
        fontStyle: 'bold',
      }).setOrigin(0, 0.5);

      // Описание
      const desc = level.theme === 'city' ? 'Спасти 3 щенков из коробки'
        : level.theme === 'construction' ? 'Вытащить котят из подвала'
        : 'Собрать корм и одеяла в буре';
      this.add.text(GAME_WIDTH / 2 - 50, y + 12, desc, {
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
        color: '#E0E0E0',
      }).setOrigin(0, 0.5);

      // Статус
      if (isCompleted) {
        const score = save.highScores[level.id] || 0;
        this.add.text(GAME_WIDTH / 2 + 190, y, `${score}`, {
          fontSize: '16px',
          color: '#FFD700',
          fontStyle: 'bold',
        }).setOrigin(0.5);
      } else if (!isUnlocked) {
        this.add.text(GAME_WIDTH / 2 + 190, y, '🔒', {
          fontSize: '24px',
        }).setOrigin(0.5);
      }
    });

    // Кнопка назад
    const back = this.add.text(50, 30, '← Назад', {
      fontSize: '16px',
      color: '#8B6914',
      fontStyle: 'bold',
    }).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('MainMenu'));

    EventBus.emit('current-scene-ready', this);
  }
}

import * as Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '@/lib/constants';
import { generatePlaceholderAssets } from '../utils/AssetGenerator';

export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  create() {
    // Прогресс-бар
    const barW = 300;
    const barH = 20;
    const barX = (GAME_WIDTH - barW) / 2;
    const barY = GAME_HEIGHT / 2;

    this.cameras.main.setBackgroundColor(COLORS.dark);

    const border = this.add.rectangle(GAME_WIDTH / 2, barY, barW + 4, barH + 4)
      .setStrokeStyle(2, COLORS.gold);

    const bar = this.add.rectangle(barX + 2, barY, 0, barH, COLORS.gold)
      .setOrigin(0, 0.5);

    const loadText = this.add.text(GAME_WIDTH / 2, barY - 30, 'Загрузка...', {
      fontSize: '18px',
      color: '#D4A843',
    }).setOrigin(0.5);

    // Генерируем placeholder-ассеты
    generatePlaceholderAssets(this);

    // Имитируем прогресс
    this.tweens.add({
      targets: bar,
      width: barW,
      duration: 500,
      onComplete: () => {
        loadText.setText('Готово!');
        this.time.delayedCall(300, () => {
          this.scene.start('MainMenu');
        });
      },
    });
  }
}

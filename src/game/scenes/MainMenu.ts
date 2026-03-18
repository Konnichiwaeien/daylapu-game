import * as Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '@/lib/constants';
import { EventBus } from '../EventBus';

export class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.beige);

    // Заголовок
    this.add.text(GAME_WIDTH / 2, 120, 'МИССИЯ:', {
      fontSize: '24px',
      color: '#8B6914',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 170, 'ДАЙ ЛАПУ', {
      fontSize: '48px',
      color: '#2C1810',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Подзаголовок
    this.add.text(GAME_WIDTH / 2, 230, 'Спаси животных на улицах Сургута!', {
      fontSize: '16px',
      color: '#4A7C59',
    }).setOrigin(0.5);

    // Лапка-декор
    const paw = this.add.graphics();
    paw.fillStyle(COLORS.gold);
    paw.fillCircle(GAME_WIDTH / 2, 290, 15);
    paw.fillCircle(GAME_WIDTH / 2 - 12, 270, 7);
    paw.fillCircle(GAME_WIDTH / 2, 265, 7);
    paw.fillCircle(GAME_WIDTH / 2 + 12, 270, 7);

    // Кнопка "Играть"
    this.createButton(GAME_WIDTH / 2, 380, 'ИГРАТЬ', () => {
      this.scene.start('CharacterSelect');
    });

    // Кнопка "Коллекция"
    this.createButton(GAME_WIDTH / 2, 450, 'КОЛЛЕКЦИЯ ГЕРОЕВ', () => {
      EventBus.emit('navigate', '/collection');
    });

    // Версия
    this.add.text(GAME_WIDTH / 2, 560, 'Благотворительный фонд «Дай лапу» — Сургут', {
      fontSize: '8px',
      color: '#8B6914',
    }).setOrigin(0.5);

    EventBus.emit('current-scene-ready', this);
  }

  private createButton(x: number, y: number, text: string, onClick: () => void) {
    const bg = this.add.rectangle(x, y, 250, 45, COLORS.green)
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

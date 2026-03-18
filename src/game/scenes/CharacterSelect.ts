import * as Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT, PLAYER } from '@/lib/constants';

export type CharacterId = 'alexandra' | 'dmitry';

const CHARACTERS: {
  id: CharacterId;
  name: string;
  title: string;
  desc: string;
  sprite: string;
  projectile: string;
}[] = [
  {
    id: 'alexandra',
    name: 'Александра',
    title: 'Глава фонда',
    desc: 'Спасла 200+ животных.\nАтакует сердечками —\nеё суперсила это любовь.\nВраги не выдерживают.',
    sprite: 'player_sheet',
    projectile: 'heart_projectile',
  },
  {
    id: 'dmitry',
    name: 'Дмитрий',
    title: 'Разработчик & визионер',
    desc: 'Написал эту игру за ночь.\nАтакует строчками кода.\nБаги — это фичи.\nCtrl+S спасает жизни.',
    sprite: 'player2_sheet',
    projectile: 'code_projectile',
  },
];

export class CharacterSelect extends Phaser.Scene {
  private selectedIndex = 0;
  private cards: Phaser.GameObjects.Container[] = [];
  private selectIndicator!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('CharacterSelect');
  }

  create() {
    this.cameras.main.setBackgroundColor(0x0a0a1a);

    // Заголовок
    this.add.text(GAME_WIDTH / 2, 40, 'ВЫБЕРИ ГЕРОЯ', {
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      fontSize: '24px',
      color: '#FFD700',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    const cardW = 280;
    const cardH = 460;
    const gap = 60;
    const startX = GAME_WIDTH / 2 - (cardW + gap) / 2;

    // Индикатор выбора (подсветка)
    this.selectIndicator = this.add.rectangle(startX, GAME_HEIGHT / 2 - 15, cardW + 8, cardH + 8, 0xFFD700, 0.3)
      .setStrokeStyle(3, 0xFFD700);

    for (let i = 0; i < CHARACTERS.length; i++) {
      const ch = CHARACTERS[i];
      const x = startX + i * (cardW + gap);
      const y = GAME_HEIGHT / 2 - 15;

      const container = this.add.container(x, y);

      // Фон карточки
      const bg = this.add.rectangle(0, 0, cardW, cardH, 0x1a1a2e)
        .setStrokeStyle(2, 0x555577);
      container.add(bg);

      // Спрайт персонажа (из spritesheet, кадр 0)
      const sprite = this.add.sprite(0, -140, ch.sprite, 0).setScale(2.5);
      container.add(sprite);

      // Имя
      const name = this.add.text(0, -60, ch.name, {
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        fontSize: '16px',
        color: '#FFFFFF',
        stroke: '#000',
        strokeThickness: 2,
      }).setOrigin(0.5);
      container.add(name);

      // Роль
      const title = this.add.text(0, -35, ch.title, {
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
        color: '#FFD700',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      container.add(title);

      // Описание
      const desc = this.add.text(0, 30, ch.desc, {
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
        color: '#E0E0E0',
        align: 'center',
        lineSpacing: 8,
      }).setOrigin(0.5);
      container.add(desc);

      // Снаряд
      const projSprite = this.add.sprite(0, 110, ch.projectile).setScale(2.2);
      container.add(projSprite);

      const projLabel = this.add.text(0, 150, ch.id === 'alexandra' ? 'Оружие: Сердечки' : 'Оружие: Код', {
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#BBBBBB',
      }).setOrigin(0.5);
      container.add(projLabel);

      // Интерактивность
      bg.setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.selectedIndex = i;
          this.updateSelection();
          this.confirmSelection();
        })
        .on('pointerover', () => {
          this.selectedIndex = i;
          this.updateSelection();
        });

      this.cards.push(container);
    }

    // Кнопка выбрать
    const confirmBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 60, '▸ ВЫБРАТЬ И ИГРАТЬ', {
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      fontSize: '16px',
      color: '#FFD700',
      stroke: '#000',
      strokeThickness: 2,
      backgroundColor: '#333355',
      padding: { x: 20, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    confirmBtn.on('pointerover', () => confirmBtn.setColor('#FFFFFF'));
    confirmBtn.on('pointerout', () => confirmBtn.setColor('#FFD700'));
    confirmBtn.on('pointerdown', () => this.confirmSelection());

    // Кнопка назад
    const backBtn = this.add.text(80, GAME_HEIGHT - 30, '← НАЗАД', {
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      fontSize: '8px',
      color: '#888888',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => this.scene.start('MainMenu'));
    backBtn.on('pointerover', () => backBtn.setColor('#FFFFFF'));
    backBtn.on('pointerout', () => backBtn.setColor('#888888'));

    // Клавиатура
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-LEFT', () => { this.selectedIndex = 0; this.updateSelection(); });
      this.input.keyboard.on('keydown-RIGHT', () => { this.selectedIndex = 1; this.updateSelection(); });
      this.input.keyboard.on('keydown-ENTER', () => this.confirmSelection());
      this.input.keyboard.on('keydown-SPACE', () => this.confirmSelection());
    }

    this.updateSelection();
  }

  private updateSelection() {
    const cardW = 280;
    const gap = 60;
    const startX = GAME_WIDTH / 2 - (cardW + gap) / 2;
    const x = startX + this.selectedIndex * (cardW + gap);
    this.selectIndicator.setPosition(x, GAME_HEIGHT / 2 - 15);

    // Масштабирование выбранной карточки
    this.cards.forEach((card, i) => {
      if (i === this.selectedIndex) {
        this.tweens.add({ targets: card, scaleX: 1.05, scaleY: 1.05, duration: 150 });
      } else {
        this.tweens.add({ targets: card, scaleX: 0.95, scaleY: 0.95, duration: 150 });
      }
    });
  }

  private confirmSelection() {
    const ch = CHARACTERS[this.selectedIndex];
    // Сохраняем выбор в реестре данных
    this.registry.set('characterId', ch.id);
    this.scene.start('LevelSelect');
  }
}

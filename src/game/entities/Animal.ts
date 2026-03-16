import * as Phaser from 'phaser';
import { COLORS } from '@/lib/constants';

export class Animal extends Phaser.Physics.Arcade.Sprite {
  animalId: string;
  animalType: 'puppy' | 'kitten';
  animalName: string;
  isRescued: boolean = false;
  private baseY: number = 0;
  private rescueIndicator: Phaser.GameObjects.Text | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: 'puppy' | 'kitten',
    id: string,
    name: string
  ) {
    const texture = type === 'puppy' ? 'puppy' : 'kitten';
    super(scene, x, y, texture);
    this.animalId = id;
    this.animalType = type;
    this.animalName = name;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body — no gravity conflicts

    // Небольшое покачивание (без физики, только визуальное)
    this.baseY = y;
    scene.tweens.add({
      targets: this,
      y: y - 4,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Подсказка "E"
    this.rescueIndicator = scene.add.text(x, y - 20, '[E]', {
      fontSize: '10px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0);
  }

  showRescueHint() {
    if (!this.isRescued && this.rescueIndicator) {
      this.rescueIndicator.setAlpha(1);
      this.rescueIndicator.setPosition(this.x, this.y - 20);
    }
  }

  hideRescueHint() {
    if (this.rescueIndicator) {
      this.rescueIndicator.setAlpha(0);
    }
  }

  rescue(scene: Phaser.Scene) {
    if (this.isRescued) return;
    this.isRescued = true;
    this.hideRescueHint();

    // Остановить все текущие tweens (bobbing и т.д.)
    scene.tweens.killTweensOf(this);

    // Анимация спасения — текст
    const text = scene.add.text(this.x, this.y - 30, `${this.animalName} спасён!`, {
      fontSize: '14px',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    scene.tweens.add({
      targets: text,
      y: text.y - 40,
      alpha: 0,
      duration: 1500,
      onComplete: () => text.destroy(),
    });

    // Животное исчезает
    scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0,
      scaleY: 0,
      duration: 500,
      onComplete: () => {
        this.rescueIndicator?.destroy();
        this.rescueIndicator = null;
        this.setActive(false);
        this.setVisible(false);
        this.body?.enable && ((this.body as Phaser.Physics.Arcade.Body).enable = false);
      },
    });
  }

  destroy(fromScene?: boolean) {
    this.rescueIndicator?.destroy();
    super.destroy(fromScene);
  }
}

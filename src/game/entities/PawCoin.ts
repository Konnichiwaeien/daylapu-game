import * as Phaser from 'phaser';
import { COIN } from '@/lib/constants';

export class PawCoin extends Phaser.Physics.Arcade.Sprite {
  value: number = COIN.value;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'coin');
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static

    // Плавный «переворот» монетки (scaleX -1 → 1)
    scene.tweens.add({
      targets: this,
      scaleX: { from: 1, to: -1 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Лёгкое покачивание вверх-вниз
    scene.tweens.add({
      targets: this,
      y: y - 4,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  collect(scene: Phaser.Scene) {
    // Анимация сбора
    const text = scene.add.text(this.x, this.y - 10, `+${this.value}`, {
      fontSize: '12px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    scene.tweens.add({
      targets: text,
      y: text.y - 25,
      alpha: 0,
      duration: 600,
      onComplete: () => text.destroy(),
    });

    this.destroy();
  }
}

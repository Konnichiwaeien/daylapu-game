import * as Phaser from 'phaser';
import { COIN } from '@/lib/constants';

export class PawCoin extends Phaser.Physics.Arcade.Sprite {
  value: number = COIN.value;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'coin');
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static

    // Вращение
    scene.tweens.add({
      targets: this,
      angle: 360,
      duration: 2000,
      repeat: -1,
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

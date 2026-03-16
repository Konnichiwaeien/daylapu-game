import * as Phaser from 'phaser';
import { ENEMY } from '@/lib/constants';

export class DogCatcher extends Phaser.Physics.Arcade.Sprite {
  health = 2;
  private patrolLeft: number;
  private patrolRight: number;
  private moveSpeed: number;
  private movingRight = true;
  private isHurt = false;

  constructor(scene: Phaser.Scene, x: number, y: number, patrolRange: number = 150, speed: number = 60) {
    super(scene, x, y, 'dogcatcher');
    this.patrolLeft = x - patrolRange;
    this.patrolRight = x + patrolRange;
    this.moveSpeed = speed;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(600);
    body.setCollideWorldBounds(true);
    body.setSize(ENEMY.width - 8, ENEMY.height - 4);
  }

  update() {
    if (!this.active) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    if (this.movingRight) {
      body.setVelocityX(this.moveSpeed);
      this.setFlipX(false);
    } else {
      body.setVelocityX(-this.moveSpeed);
      this.setFlipX(true);
    }

    // Разворот на краях патруля
    if (this.x >= this.patrolRight) {
      this.movingRight = false;
    } else if (this.x <= this.patrolLeft) {
      this.movingRight = true;
    }
  }

  hitByHeart(scene: Phaser.Scene) {
    if (this.isHurt) return;
    this.isHurt = true;
    this.health--;

    // Мигание красным
    this.setTint(0xff0000);
    scene.time.delayedCall(200, () => {
      this.clearTint();
      this.isHurt = false;

      if (this.health <= 0) {
        this.die(scene);
      }
    });
  }

  private die(scene: Phaser.Scene) {
    // Показать текст "Побеждён!"
    const text = scene.add.text(this.x, this.y - 20, 'Побеждён!', {
      fontSize: '12px',
      color: '#FF6666',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    scene.tweens.add({
      targets: text,
      y: text.y - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => text.destroy(),
    });

    // Исчезание
    scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0,
      scaleY: 0,
      duration: 400,
      onComplete: () => {
        this.setActive(false);
        this.setVisible(false);
        (this.body as Phaser.Physics.Arcade.Body).enable = false;
      },
    });
  }
}

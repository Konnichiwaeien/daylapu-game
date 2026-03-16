import * as Phaser from 'phaser';
import { ObstacleData } from '../levels/LevelData';

export class Car extends Phaser.Physics.Arcade.Sprite {
  private startX: number;
  private moveSpeed: number;
  private moveDirection: 'left' | 'right';
  private range = 600;

  constructor(scene: Phaser.Scene, data: ObstacleData) {
    super(scene, data.x, data.y, 'car');
    this.startX = data.x;
    this.moveSpeed = data.speed || 150;
    this.moveDirection = data.direction || 'right';

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.setAllowGravity(false);

    if (this.moveDirection === 'left') {
      this.setFlipX(true);
    }
  }

  update() {
    const speed = this.moveDirection === 'right' ? this.moveSpeed : -this.moveSpeed;
    this.setVelocityX(speed);

    // Зацикливаем движение
    if (this.moveDirection === 'right' && this.x > this.startX + this.range) {
      this.x = this.startX - 100;
    } else if (this.moveDirection === 'left' && this.x < this.startX - this.range) {
      this.x = this.startX + 100;
    }
  }
}

export class FallingObject extends Phaser.Physics.Arcade.Sprite {
  private startX: number;
  private startY: number;
  private fallSpeed: number;
  private respawnDelay = 2000;

  constructor(scene: Phaser.Scene, data: ObstacleData) {
    super(scene, data.x, data.y, 'brick');
    this.startX = data.x;
    this.startY = data.y;
    this.fallSpeed = data.speed || 120;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocityY(this.fallSpeed);
  }

  update() {
    // Респавн когда падает ниже экрана
    if (this.y > 650) {
      this.setActive(false);
      this.setVisible(false);
      this.scene.time.delayedCall(this.respawnDelay, () => {
        this.setPosition(this.startX + Phaser.Math.Between(-30, 30), this.startY);
        this.setActive(true);
        this.setVisible(true);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocityY(this.fallSpeed);
      });
    }
  }
}

export class ColdZone extends Phaser.GameObjects.Rectangle {
  zoneBody: Phaser.Physics.Arcade.Body | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x + width / 2, y + height / 2, width, height, 0x87ceeb, 0.25);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }
}

export class Hatch extends Phaser.Physics.Arcade.Sprite {
  hatchId: string;
  targetHatchId: string;
  private indicator: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, data: ObstacleData) {
    super(scene, data.x, data.y, 'hatch');
    this.hatchId = data.hatchId || '';
    this.targetHatchId = data.targetHatch || '';

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.indicator = scene.add.text(data.x, data.y - 20, '[E]', {
      fontSize: '10px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0);
  }

  showHint() {
    this.indicator.setAlpha(1);
  }

  hideHint() {
    this.indicator.setAlpha(0);
  }

  destroy(fromScene?: boolean) {
    this.indicator?.destroy();
    super.destroy(fromScene);
  }
}

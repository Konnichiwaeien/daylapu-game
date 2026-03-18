import * as Phaser from 'phaser';
import { ObstacleData } from '../levels/LevelData';

const CAR_VARIANTS = ['car_red', 'car_blue', 'car_yellow', 'car_white', 'car_green'];

export class Car extends Phaser.Physics.Arcade.Sprite {
  private moveSpeed: number;
  private moveDirection: 'left' | 'right';
  private spawnX: number;
  private spawnRange: number;
  private respawning = false;

  constructor(scene: Phaser.Scene, data: ObstacleData) {
    // Выбираем текстуру по варианту или случайно
    const variant = data.variant || ['red', 'blue', 'yellow', 'white', 'green'][Phaser.Math.Between(0, 4)];
    const texKey = `car_${variant}`;
    // Ставим машину так, чтобы колёса были на земле (y=568)
    // Текстура 40px, origin 0.5 → центр на y=548 чтобы низ был на 568
    super(scene, data.x, 548, texKey);
    this.spawnX = data.x;
    this.moveSpeed = data.speed || 150;
    this.moveDirection = data.direction || 'right';
    this.spawnRange = 600; // машина проезжает 600px и уезжает

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.setAllowGravity(false);
    body.setSize(56, 24);
    body.setOffset(4, 10);

    if (this.moveDirection === 'left') {
      this.setFlipX(true);
    }

    // Начальная позиция — за экраном со стороны входа
    this.x = this.moveDirection === 'right'
      ? this.spawnX - this.spawnRange
      : this.spawnX + this.spawnRange;
  }

  update() {
    if (this.respawning) return;

    const speed = this.moveDirection === 'right' ? this.moveSpeed : -this.moveSpeed;
    this.setVelocityX(speed);

    // Машина проехала свой маршрут — плавно уезжает за экран, потом респавн
    const distFromSpawn = Math.abs(this.x - this.spawnX);
    if (distFromSpawn > this.spawnRange) {
      // Проверяем что машина уехала в правильном направлении
      const goingAway = (this.moveDirection === 'right' && this.x > this.spawnX + this.spawnRange)
        || (this.moveDirection === 'left' && this.x < this.spawnX - this.spawnRange);

      if (goingAway) {
        this.respawning = true;
        this.setVelocityX(0);
        this.setActive(false);
        this.setVisible(false);

        // Через паузу — появляется снова с другой стороны
        const delay = Phaser.Math.Between(1500, 4000);
        this.scene.time.delayedCall(delay, () => {
          // Случайный новый вариант машины
          const newVariant = CAR_VARIANTS[Phaser.Math.Between(0, CAR_VARIANTS.length - 1)];
          this.setTexture(newVariant);

          // Спавн с начальной стороны
          this.x = this.moveDirection === 'right'
            ? this.spawnX - this.spawnRange
            : this.spawnX + this.spawnRange;

          this.setActive(true);
          this.setVisible(true);
          this.respawning = false;
        });
      }
    }
  }
}

export class Pigeon extends Phaser.Physics.Arcade.Sprite {
  private startX: number;
  private startY: number;
  private swoopRange: number;
  private phase: 'glide' | 'swoop' | 'return' = 'glide';
  private glideSpeed: number;
  private glideDirection: number;
  private swoopTimer = 0;
  private swoopCooldown: number;

  constructor(scene: Phaser.Scene, data: ObstacleData) {
    super(scene, data.x, data.y || 120, 'pigeon');
    this.startX = data.x;
    this.startY = data.y || 120;
    this.swoopRange = data.patrolRange || 200;
    this.glideSpeed = (data.speed || 40);
    this.glideDirection = data.direction === 'left' ? -1 : 1;
    this.swoopCooldown = Phaser.Math.Between(120, 240); // frames

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(20, 14);
    body.setOffset(6, 8);

    this.setDepth(4);
  }

  update() {
    if (!this.active) return;
    const body = this.body as Phaser.Physics.Arcade.Body;

    this.swoopTimer++;

    if (this.phase === 'glide') {
      // Летит горизонтально, покачиваясь
      body.setVelocityX(this.glideSpeed * this.glideDirection);
      body.setVelocityY(Math.sin(this.swoopTimer * 0.05) * 15);

      // Разворот на краях зоны
      if (this.x > this.startX + this.swoopRange) {
        this.glideDirection = -1;
        this.setFlipX(true);
      } else if (this.x < this.startX - this.swoopRange) {
        this.glideDirection = 1;
        this.setFlipX(false);
      }

      // Периодически пикирует вниз
      if (this.swoopTimer > this.swoopCooldown) {
        this.phase = 'swoop';
        this.swoopTimer = 0;
      }
    } else if (this.phase === 'swoop') {
      // Пикирует вниз — опасно!
      body.setVelocityY(180);
      body.setVelocityX(this.glideSpeed * this.glideDirection * 0.5);

      // Долетел достаточно низко — разворот вверх
      if (this.y > this.startY + 220) {
        this.phase = 'return';
      }
    } else if (this.phase === 'return') {
      // Возвращается наверх
      body.setVelocityY(-100);
      body.setVelocityX(this.glideSpeed * this.glideDirection * 0.3);

      if (this.y <= this.startY) {
        this.y = this.startY;
        this.phase = 'glide';
        this.swoopTimer = 0;
        this.swoopCooldown = Phaser.Math.Between(120, 240);
      }
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

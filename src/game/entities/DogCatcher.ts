import * as Phaser from 'phaser';
import { ENEMY } from '@/lib/constants';

export class DogCatcher extends Phaser.Physics.Arcade.Sprite {
  health = 2;
  private patrolLeft: number;
  private patrolRight: number;
  private moveSpeed: number;
  private chaseSpeed: number;
  private movingRight = true;
  private isHurt = false;
  private aiState: 'patrol' | 'alert' | 'chase' = 'patrol';
  private alertTimer = 0;
  private detectionRange = 250;
  private chaseRange = 400;
  private playerRef: Phaser.Physics.Arcade.Sprite | null = null;
  private exclamation: Phaser.GameObjects.Text | null = null;
  private jumpCooldown = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, patrolRange: number = 150, speed: number = 60) {
    super(scene, x, y, 'dogcatcher');
    this.patrolLeft = x - patrolRange;
    this.patrolRight = x + patrolRange;
    this.moveSpeed = speed;
    this.chaseSpeed = speed * 1.8;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(600);
    body.setCollideWorldBounds(true);
    body.setSize(ENEMY.width - 8, ENEMY.height - 4);
    body.setBounce(0, 0);

    // Знак ! над головой (скрыт)
    this.exclamation = scene.add.text(x, y - 40, '!', {
      fontSize: '20px',
      color: '#FF4444',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0).setDepth(10);
  }

  setPlayer(player: Phaser.Physics.Arcade.Sprite) {
    this.playerRef = player;
  }

  update() {
    if (!this.active) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    // Обновляем позицию восклицательного знака
    if (this.exclamation) {
      this.exclamation.setPosition(this.x, this.y - 40);
    }

    this.jumpCooldown = Math.max(0, this.jumpCooldown - 1);

    // Проверяем расстояние до игрока
    const distToPlayer = this.playerRef
      ? Phaser.Math.Distance.Between(this.x, this.y, this.playerRef.x, this.playerRef.y)
      : Infinity;

    const playerAbove = this.playerRef ? this.playerRef.y < this.y - 40 : false;

    switch (this.aiState) {
      case 'patrol':
        this.doPatrol(body);

        // Заметил игрока?
        if (distToPlayer < this.detectionRange) {
          this.aiState = 'alert';
          this.alertTimer = 45; // ~0.75 секунды насторожённости
          if (this.exclamation) this.exclamation.setAlpha(1);
          body.setVelocityX(0);
        }
        break;

      case 'alert':
        // Стоит, повернувшись к игроку, с ! над головой
        body.setVelocityX(0);
        if (this.playerRef) {
          this.setFlipX(this.playerRef.x < this.x);
        }

        this.alertTimer--;
        if (this.alertTimer <= 0) {
          this.aiState = 'chase';
        }
        break;

      case 'chase':
        this.doChase(body, distToPlayer, playerAbove);

        // Потерял игрока?
        if (distToPlayer > this.chaseRange) {
          this.aiState = 'patrol';
          if (this.exclamation) this.exclamation.setAlpha(0);
        }
        break;
    }
  }

  private doPatrol(body: Phaser.Physics.Arcade.Body) {
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

  private doChase(body: Phaser.Physics.Arcade.Body, dist: number, playerAbove: boolean) {
    if (!this.playerRef) return;

    const dirX = this.playerRef.x < this.x ? -1 : 1;
    this.setFlipX(dirX < 0);

    // Бежит к игроку быстрее чем патрулирует
    body.setVelocityX(this.chaseSpeed * dirX);

    // Прыжок — если игрок выше и догхантер на земле
    if (playerAbove && body.blocked.down && this.jumpCooldown <= 0 && dist < 200) {
      body.setVelocityY(-350);
      this.jumpCooldown = 90; // ~1.5 сек до следующего прыжка
    }
  }

  hitByHeart(scene: Phaser.Scene) {
    if (this.isHurt || !this.active) return;
    this.isHurt = true;
    this.health--;

    // Отбрасывание
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body || !body.enable) return;
    const knockDir = this.playerRef && this.playerRef.x < this.x ? 1 : -1;
    body.setVelocityX(200 * knockDir);
    body.setVelocityY(-150);

    // Мигание красным
    this.setTint(0xff0000);

    if (this.health <= 0) {
      // Умирает сразу — не ждём таймер
      this.isHurt = false;
      this.die(scene);
    } else {
      scene.time.delayedCall(200, () => {
        if (!this.active || !this.scene) return;
        this.clearTint();
        this.isHurt = false;
      });
    }
  }

  private die(scene: Phaser.Scene) {
    // Скрываем !
    if (this.exclamation) {
      this.exclamation.destroy();
      this.exclamation = null;
    }

    // Сразу отключаем физику и столкновения
    this.setActive(false);
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) body.enable = false;

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
        this.setVisible(false);
      },
    });
  }

  destroy(fromScene?: boolean) {
    this.exclamation?.destroy();
    super.destroy(fromScene);
  }
}

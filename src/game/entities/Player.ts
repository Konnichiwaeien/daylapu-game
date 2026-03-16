import * as Phaser from 'phaser';
import { PLAYER, COLORS } from '@/lib/constants';

export class Player extends Phaser.Physics.Arcade.Sprite {
  health: number = PLAYER.maxHealth;
  coins: number = 0;
  rescued: number = 0;
  isInvincible: boolean = false;
  private invincibleTimer: Phaser.Time.TimerEvent | null = null;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private interactKey!: Phaser.Input.Keyboard.Key;
  private shootKey!: Phaser.Input.Keyboard.Key;

  // Мобильное управление
  mobileLeft = false;
  mobileRight = false;
  mobileJump = false;
  mobileInteract = false;
  mobileShoot = false;

  facingRight = true;

  // Стрельба
  private lastShotTime = 0;
  private shootCooldown = 500;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player_sheet', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(PLAYER.width - 4, PLAYER.height - 2);
    body.setGravityY(PLAYER.gravity);

    // Создаём анимации
    if (!scene.anims.exists('player-idle')) {
      scene.anims.create({
        key: 'player-idle',
        frames: [{ key: 'player_sheet', frame: 0 }],
        frameRate: 1,
        repeat: -1,
      });
      scene.anims.create({
        key: 'player-walk',
        frames: [
          { key: 'player_sheet', frame: 1 },
          { key: 'player_sheet', frame: 2 },
          { key: 'player_sheet', frame: 3 },
          { key: 'player_sheet', frame: 4 },
          { key: 'player_sheet', frame: 5 },
          { key: 'player_sheet', frame: 6 },
        ],
        frameRate: 10,
        repeat: -1,
      });
      scene.anims.create({
        key: 'player-jump',
        frames: [{ key: 'player_sheet', frame: 7 }],
        frameRate: 1,
        repeat: 0,
      });
    }

    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.wasd = {
        W: scene.input.keyboard.addKey('W'),
        A: scene.input.keyboard.addKey('A'),
        S: scene.input.keyboard.addKey('S'),
        D: scene.input.keyboard.addKey('D'),
      };
      this.interactKey = scene.input.keyboard.addKey('E');
      this.shootKey = scene.input.keyboard.addKey('F');
    }
  }

  update() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const onFloor = body.blocked.down;

    // Движение
    const left = this.cursors?.left.isDown || this.wasd?.A.isDown || this.mobileLeft;
    const right = this.cursors?.right.isDown || this.wasd?.D.isDown || this.mobileRight;
    const jump = this.cursors?.up.isDown || this.cursors?.space?.isDown || this.wasd?.W.isDown || this.mobileJump;

    if (left) {
      this.setVelocityX(-PLAYER.speed);
      this.facingRight = false;
      this.setFlipX(true);
    } else if (right) {
      this.setVelocityX(PLAYER.speed);
      this.facingRight = true;
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (jump && onFloor) {
      this.setVelocityY(PLAYER.jumpForce);
    }

    // Анимации
    if (!onFloor) {
      this.play('player-jump', true);
    } else if (left || right) {
      this.play('player-walk', true);
    } else {
      this.play('player-idle', true);
    }

    // Мигание при неуязвимости
    if (this.isInvincible) {
      this.setAlpha(Math.sin(this.scene.time.now * 0.01) > 0 ? 1 : 0.3);
    } else {
      this.setAlpha(1);
    }
  }

  wantsInteract(): boolean {
    const pressed = this.interactKey?.isDown || this.mobileInteract;
    if (this.mobileInteract) this.mobileInteract = false;
    return pressed;
  }

  wantsShoot(): boolean {
    const pressed = this.shootKey?.isDown || this.mobileShoot;
    if (this.mobileShoot) this.mobileShoot = false;
    if (!pressed) return false;

    const now = this.scene.time.now;
    if (now - this.lastShotTime < this.shootCooldown) return false;
    this.lastShotTime = now;
    return true;
  }

  takeDamage() {
    if (this.isInvincible) return;

    this.health--;
    this.isInvincible = true;

    // Красная вспышка
    this.setTint(COLORS.red);
    this.scene.time.delayedCall(200, () => this.clearTint());

    // Неуязвимость на 1.5 сек
    this.invincibleTimer = this.scene.time.delayedCall(1500, () => {
      this.isInvincible = false;
      this.setAlpha(1);
    });
  }

  collectCoin(value: number) {
    this.coins += value;
  }

  rescueAnimal() {
    this.rescued++;
  }

  isDead(): boolean {
    return this.health <= 0;
  }

  destroy(fromScene?: boolean) {
    this.invincibleTimer?.destroy();
    super.destroy(fromScene);
  }
}

import * as Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, COIN } from '@/lib/constants';
import { Player } from '../entities/Player';
import { Animal } from '../entities/Animal';
import { PawCoin } from '../entities/PawCoin';
import { Car, FallingObject, ColdZone, Hatch, Pigeon } from '../entities/Obstacle';
import { DogCatcher } from '../entities/DogCatcher';
import { getLevel } from '../levels';
import { LevelData, ObstacleData } from '../levels/LevelData';
import { completeLevel, addCoins, RescuedAnimal } from '../utils/SaveManager';
import { EventBus } from '../EventBus';
import { buildCityBackground, buildConstructionBackground, buildWinterBackground } from '../utils/BackgroundBuilder';
import { playCoin, playDamage, playRescue, playHeart, playEnemyDeath, playLevelComplete, startMusic, stopMusic } from '../utils/SoundManager';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private animals!: Phaser.GameObjects.Group;
  private coins!: Phaser.Physics.Arcade.StaticGroup;
  private obstacles!: Phaser.GameObjects.Group;
  private coldZones: ColdZone[] = [];
  private hatches: Hatch[] = [];
  private spikes!: Phaser.Physics.Arcade.StaticGroup;
  private dogCatchers!: Phaser.GameObjects.Group;
  private hearts!: Phaser.Physics.Arcade.Group;
  private exitZone!: Phaser.GameObjects.Rectangle;

  private levelData!: LevelData;
  private hudHealth!: Phaser.GameObjects.Text;
  private hudCoins!: Phaser.GameObjects.Text;
  private hudRescued!: Phaser.GameObjects.Text;
  private hudTimer!: Phaser.GameObjects.Text;
  private timeLeft: number = 0;
  private timerEvent: Phaser.Time.TimerEvent | null = null;
  private collectiblesCount: number = 0;
  private hudCollectibles!: Phaser.GameObjects.Text;
  private isPaused = false;
  private isLevelComplete = false;

  // Снежинки для зимнего уровня
  private snowEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  constructor() {
    super('GameScene');
  }

  init(data: { levelId: number }) {
    const level = getLevel(data.levelId);
    if (!level) {
      this.scene.start('LevelSelect');
      return;
    }
    this.levelData = level;
    this.isLevelComplete = false;
    this.collectiblesCount = 0;
  }

  create() {
    const ld = this.levelData;
    if (!ld) return;

    // Гарантировать что физика не заморожена (после Game Over)
    this.physics.resume();
    this.isPaused = false;

    // Мир
    this.physics.world.setBounds(0, 0, ld.width, ld.height);

    // Фон с параллаксом
    switch (ld.theme) {
      case 'city':
        buildCityBackground(this, ld.width);
        break;
      case 'construction':
        buildConstructionBackground(this, ld.width);
        break;
      case 'winter':
        buildWinterBackground(this, ld.width);
        break;
    }

    // Платформы
    this.platforms = this.physics.add.staticGroup();
    for (const p of ld.platforms) {
      let texture = p.texture;
      if (!texture) {
        if (p.y >= 560) {
          texture = ld.theme === 'winter' ? 'road_snow' : 'road';
        } else {
          texture = ld.theme === 'winter' ? 'ground_snow' : 'ground';
        }
      }
      for (let i = 0; i < p.width; i++) {
        this.platforms.create(p.x + i * TILE_SIZE + TILE_SIZE / 2, p.y + TILE_SIZE / 2, texture);
      }
    }

    // Игрок — с выбранным персонажем
    const characterId = this.registry.get('characterId') || 'alexandra';
    this.player = new Player(this, ld.playerStart.x, ld.playerStart.y, characterId);
    this.physics.add.collider(this.player, this.platforms);

    // Камера
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, ld.width, ld.height);

    // Животные
    this.animals = this.add.group();
    for (const a of ld.animals) {
      const animal = new Animal(this, a.x, a.y, a.type, a.id, a.name, a.profile);
      this.animals.add(animal);
    }

    // Монеты
    this.coins = this.physics.add.staticGroup();
    for (const c of ld.coins) {
      const coin = new PawCoin(this, c.x, c.y);
      this.coins.add(coin);
    }
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, undefined, this);

    // Collectibles (корм, одеяла — уровень 3)
    if (ld.collectibles) {
      for (const c of ld.collectibles) {
        const sprite = this.physics.add.staticSprite(c.x, c.y, c.type === 'food' ? 'food' : 'blanket');
        sprite.setData('collectibleType', c.type);
        this.coins.add(sprite); // Используем ту же группу для overlap
      }
    }

    // Препятствия
    this.obstacles = this.add.group();
    this.coldZones = [];
    this.hatches = [];
    this.spikes = this.physics.add.staticGroup();
    this.dogCatchers = this.add.group();
    this.hearts = this.physics.add.group({ allowGravity: false });

    for (const o of ld.obstacles) {
      switch (o.type) {
        case 'car': {
          const car = new Car(this, o as any);
          this.obstacles.add(car);
          this.physics.add.overlap(this.player, car, this.hitObstacle, undefined, this);
          break;
        }
        case 'falling': {
          const obj = new FallingObject(this, o as any);
          this.obstacles.add(obj);
          this.physics.add.overlap(this.player, obj, this.hitObstacle, undefined, this);
          break;
        }
        case 'coldzone': {
          const zone = new ColdZone(this, o.x, o.y, o.width || 160, o.height || 160);
          this.coldZones.push(zone);
          break;
        }
        case 'hatch': {
          const hatch = new Hatch(this, o as any);
          this.hatches.push(hatch);
          this.physics.add.collider(hatch, this.platforms);
          break;
        }
        case 'dogcatcher': {
          const dc = new DogCatcher(this, o.x, o.y, o.patrolRange || 150, o.speed || 60);
          dc.setPlayer(this.player);
          this.dogCatchers.add(dc);
          this.physics.add.collider(dc, this.platforms);
          this.physics.add.overlap(this.player, dc, this.hitObstacle, undefined, this);
          break;
        }
        case 'pigeon': {
          const pigeon = new Pigeon(this, o as any);
          this.obstacles.add(pigeon);
          this.physics.add.overlap(this.player, pigeon, this.hitObstacle, undefined, this);
          break;
        }
        case 'spike': {
          const spike = this.spikes.create(o.x, o.y, 'spike') as Phaser.Physics.Arcade.Sprite;
          spike.setOrigin(0.5, 1); // Привязка к низу — ставим на платформу
          spike.refreshBody();
          break;
        }
      }
    }

    // Колья наносят урон
    this.physics.add.overlap(this.player, this.spikes, this.hitObstacle, undefined, this);

    // Сердечки vs догхантеры
    this.physics.add.overlap(this.hearts, this.dogCatchers, this.heartHitDogCatcher, undefined, this);

    // Сердечки vs голуби и другие obstacles
    this.physics.add.overlap(this.hearts, this.obstacles, this.heartHitObstacle, undefined, this);

    // Выход (приют)
    const exitSprite = this.add.sprite(ld.exitPoint.x, ld.exitPoint.y, 'shelter');
    this.exitZone = this.add.rectangle(ld.exitPoint.x, ld.exitPoint.y + 10, 60, 54, 0x000000, 0);
    this.physics.add.existing(this.exitZone, true);
    this.physics.add.overlap(this.player, this.exitZone, this.reachExit, undefined, this);

    // Снег для зимнего уровня
    if (ld.theme === 'winter') {
      this.createSnowEffect();
    }

    // Таймер (уровень 3)
    if (ld.timeLimit) {
      this.timeLeft = ld.timeLimit;
      this.timerEvent = this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.timeLeft--;
          this.updateHUD();
          if (this.timeLeft <= 0) {
            this.playerDie();
          }
        },
        loop: true,
      });
    }

    // HUD
    this.createHUD();

    // Пауза
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-ESC', () => this.togglePause());
      this.input.keyboard.on('keydown-P', () => this.togglePause());
    }

    // Музыка
    startMusic();

    EventBus.emit('current-scene-ready', this);

    // Мобильное управление через EventBus
    EventBus.on('mobile-left-down', () => { if (this.player) this.player.mobileLeft = true; });
    EventBus.on('mobile-left-up', () => { if (this.player) this.player.mobileLeft = false; });
    EventBus.on('mobile-right-down', () => { if (this.player) this.player.mobileRight = true; });
    EventBus.on('mobile-right-up', () => { if (this.player) this.player.mobileRight = false; });
    EventBus.on('mobile-jump', () => { if (this.player) this.player.mobileJump = true; this.time.delayedCall(150, () => { if (this.player) this.player.mobileJump = false; }); });
    EventBus.on('mobile-interact', () => { if (this.player) this.player.mobileInteract = true; });
    EventBus.on('mobile-shoot', () => { if (this.player) this.player.mobileShoot = true; });
  }

  update(_time: number) {
    if (this.isPaused || this.isLevelComplete) return;

    this.player.update();

    // Обновление препятствий
    this.obstacles.getChildren().forEach((obj) => {
      if (obj instanceof Car || obj instanceof FallingObject || obj instanceof Pigeon) {
        obj.update();
      }
    });

    // Обновление догхантеров
    this.dogCatchers.getChildren().forEach((obj) => {
      const dc = obj as DogCatcher;
      if (dc.active) dc.update();
    });

    // Стрельба сердечками
    if (this.player.wantsShoot()) {
      this.shootHeart();
    }

    // Проверка близости к животным
    this.animals.getChildren().forEach((obj) => {
      const animal = obj as Animal;
      if (!animal || animal.isRescued || !animal.active || !animal.visible) return;

      // Покачивание
      animal.updateBob(_time);

      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, animal.x, animal.y);
      if (dist < 50) {
        animal.showRescueHint();
        if (this.player.wantsInteract()) {
          animal.rescue(this);
          this.player.rescueAnimal();
          playRescue();
          this.updateHUD();

          // Показать модальное окно с профилем питомца
          window.dispatchEvent(new CustomEvent('animal-rescued', {
            detail: {
              name: animal.animalName,
              type: animal.animalType,
              profile: animal.animalProfile,
            },
          }));
          // Пауза игры пока модал открыт
          this.pauseForModal();
        }
      } else {
        animal.hideRescueHint();
      }
    });

    // Проверка люков
    this.hatches.forEach(hatch => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, hatch.x, hatch.y);
      if (dist < 40) {
        hatch.showHint();
        if (this.player.wantsInteract()) {
          const target = this.hatches.find(h => h.hatchId === hatch.targetHatchId);
          if (target) {
            this.player.setPosition(target.x, target.y - 40);
          }
        }
      } else {
        hatch.hideHint();
      }
    });

    // Зоны холода
    for (const zone of this.coldZones) {
      const zoneBody = zone.body as Phaser.Physics.Arcade.Body;
      if (zoneBody && this.physics.overlap(this.player, zone)) {
        // Замедление
        this.player.setVelocityX(this.player.body!.velocity.x * 0.6);
        // Периодический урон
        if (!this.isPaused && !this.player.isInvincible && Math.random() < 0.01) {
          this.player.takeDamage();
          this.updateHUD();
          if (this.player.isDead()) {
            this.playerDie();
          }
        }
      }
    }

    // Падение в пропасть
    if (this.player.y > this.levelData.height - 10 && !this.isPaused) {
      this.playerDie();
    }
  }

  private collectCoin(_player: unknown, coinObj: unknown) {
    const obj = coinObj as Phaser.Physics.Arcade.Sprite;
    const collectibleType = obj.getData('collectibleType');

    if (collectibleType) {
      // Это корм или одеяло
      this.collectiblesCount++;
      playCoin();
      const label = collectibleType === 'food' ? 'Корм!' : 'Одеяло!';
      const text = this.add.text(obj.x, obj.y - 10, label, {
        fontSize: '16px',
        color: '#FFD700',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 2,
      }).setOrigin(0.5);
      this.tweens.add({
        targets: text,
        y: text.y - 25,
        alpha: 0,
        duration: 800,
        onComplete: () => text.destroy(),
      });
      obj.destroy();
      this.updateHUD();
    } else if (obj instanceof PawCoin) {
      this.player.collectCoin(obj.value);
      playCoin();
      obj.collect(this);
      this.updateHUD();
    }
  }

  private hitObstacle(playerObj?: any, obstacleObj?: any) {
    if (this.isPaused || this.isLevelComplete || this.player.isInvincible) return;
    this.player.takeDamage();
    playDamage();
    
    // Knockback
    if (obstacleObj && obstacleObj.x !== undefined) {
      const dir = this.player.x < obstacleObj.x ? -1 : 1;
      this.player.setVelocity(dir * 250, -300);
    } else {
      this.player.setVelocityY(-300);
    }

    this.updateHUD();
    if (this.player.isDead()) {
      this.playerDie();
    }
  }

  private reachExit() {
    if (this.isLevelComplete) return;

    const ld = this.levelData;
    // Проверяем условия
    if (this.player.rescued < ld.requiredRescues) {
      this.showMessage(`Спаси ещё ${ld.requiredRescues - this.player.rescued} животных!`);
      return;
    }
    if (ld.requiredCollectibles && this.collectiblesCount < ld.requiredCollectibles) {
      this.showMessage(`Собери ещё ${ld.requiredCollectibles - this.collectiblesCount} предметов!`);
      return;
    }

    this.isLevelComplete = true;
    this.timerEvent?.destroy();
    stopMusic();
    playLevelComplete();

    // Сохраняем прогресс
    const score = this.player.coins + this.player.rescued * 100 + this.timeLeft * 5;
    const rescuedAnimals: RescuedAnimal[] = [];
    this.animals.getChildren().forEach(obj => {
      const a = obj as Animal;
      if (a.isRescued) {
        rescuedAnimals.push({
          id: a.animalId,
          type: a.animalType === 'puppy' ? 'puppy' : 'kitten',
          name: a.animalName,
          level: ld.id,
          rescuedAt: Date.now(),
        });
      }
    });

    completeLevel(ld.id, score, rescuedAnimals);
    addCoins(this.player.coins);

    this.scene.start('LevelComplete', {
      levelId: ld.id,
      score,
      coins: this.player.coins,
      rescued: this.player.rescued,
      timeLeft: this.timeLeft,
    });
  }

  private shootHeart() {
    playHeart();
    const dir = this.player.facingRight ? 1 : -1;
    const projectileKey = this.player.characterId === 'dmitry' ? 'code_projectile' : 'heart_projectile';
    const heart = this.hearts.create(
      this.player.x + dir * 20,
      this.player.y - 5,
      projectileKey
    ) as Phaser.Physics.Arcade.Sprite;
    heart.setVelocityX(dir * (this.player.characterId === 'dmitry' ? 420 : 350));
    heart.setDepth(5);
    if (this.player.characterId === 'dmitry') heart.setFlipX(dir < 0);

    // Удалить через 2 секунды
    this.time.delayedCall(2000, () => {
      if (heart.active) this.killHeart(heart);
    });
  }

  private killHeart(heart: Phaser.Physics.Arcade.Sprite) {
    heart.setActive(false);
    heart.setVisible(false);
    const b = heart.body as Phaser.Physics.Arcade.Body;
    if (b) b.enable = false;
    // Уничтожить в следующем кадре — безопасно
    this.time.delayedCall(0, () => {
      if (heart && heart.scene) heart.destroy();
    });
  }

  private heartHitObstacle(heartObj: unknown, obstacleObj: unknown) {
    const heart = heartObj as Phaser.Physics.Arcade.Sprite;
    const obstacle = obstacleObj as Phaser.Physics.Arcade.Sprite;
    if (!obstacle.active || !heart.active) return;
    this.killHeart(heart);
    playEnemyDeath();
    obstacle.setActive(false);
    obstacle.setVisible(false);
    const body = obstacle.body as Phaser.Physics.Arcade.Body;
    if (body) body.enable = false;
  }

  private heartHitDogCatcher(obj1: any, obj2: any) {
    const dc = obj1.hitByHeart ? obj1 : (obj2.hitByHeart ? obj2 : null);
    const heart = obj1 === dc ? obj2 : obj1;

    if (!dc || !heart) return;
    if (!dc.active || !heart.active) return;
    this.killHeart(heart);
    playEnemyDeath();
    dc.hitByHeart(this);
  }

  private playerDie() {
    if (this.isLevelComplete || this.isPaused) return;
    this.isPaused = true;
    this.player.setVelocity(0);
    this.player.setTint(COLORS.red);
    this.player.isInvincible = true; // Навсегда неуязвим при смерти
    this.timerEvent?.destroy();
    stopMusic();
    this.physics.pause(); // Остановить всю физику

    this.cameras.main.shake(300, 0.01);
    this.time.delayedCall(800, () => {
      this.showGameOver();
    });
  }

  private showGameOver() {
    // Затемнение
    const overlay = this.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8
    ).setScrollFactor(0).setDepth(300);
    overlay.setAlpha(0);
    this.tweens.add({ targets: overlay, alpha: 1, duration: 500 });

    // Заголовок
    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, 'GAME OVER', {
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      fontSize: '32px',
      color: '#FF4444',
      stroke: '#000',
      strokeThickness: 4,
    }).setScrollFactor(0).setDepth(301).setOrigin(0.5).setAlpha(0);

    // Подзаголовок
    const subtitle = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, 'Животные всё ещё ждут помощи...', {
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      fontSize: '14px',
      color: '#AAAAAA',
    }).setScrollFactor(0).setDepth(301).setOrigin(0.5).setAlpha(0);

    // Статистика
    const stats = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, `Спасено: ${this.player.rescued}/${this.levelData.requiredRescues}  |  Лапок: ${this.player.coins}`, {
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      fontSize: '14px',
      color: '#D4A843',
    }).setScrollFactor(0).setDepth(301).setOrigin(0.5).setAlpha(0);

    // Кнопка "Попробовать снова"
    const retryBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, '▸ ПОПРОБОВАТЬ СНОВА', {
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      fontSize: '16px',
      color: '#FFD700',
      stroke: '#000',
      strokeThickness: 2,
      backgroundColor: '#333355',
      padding: { x: 16, y: 10 },
    }).setScrollFactor(0).setDepth(301).setOrigin(0.5).setAlpha(0).setInteractive({ useHandCursor: true });

    // Кнопка "К уровням"
    const menuBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 110, 'К УРОВНЯМ', {
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      fontSize: '8px',
      color: '#888888',
      stroke: '#000',
      strokeThickness: 2,
    }).setScrollFactor(0).setDepth(301).setOrigin(0.5).setAlpha(0).setInteractive({ useHandCursor: true });

    // Анимация появления
    this.tweens.add({ targets: title, alpha: 1, y: title.y + 10, duration: 600, delay: 200 });
    this.tweens.add({ targets: subtitle, alpha: 1, duration: 600, delay: 500 });
    this.tweens.add({ targets: stats, alpha: 1, duration: 600, delay: 700 });
    this.tweens.add({ targets: retryBtn, alpha: 1, duration: 600, delay: 900 });
    this.tweens.add({ targets: menuBtn, alpha: 1, duration: 600, delay: 1100 });

    // Hover эффекты
    retryBtn.on('pointerover', () => retryBtn.setColor('#FFFFFF'));
    retryBtn.on('pointerout', () => retryBtn.setColor('#FFD700'));
    menuBtn.on('pointerover', () => menuBtn.setColor('#FFFFFF'));
    menuBtn.on('pointerout', () => menuBtn.setColor('#888888'));

    // Действия
    retryBtn.on('pointerdown', () => {
      this.cleanup();
      this.scene.restart({ levelId: this.levelData.id });
    });
    menuBtn.on('pointerdown', () => {
      this.cleanup();
      this.scene.start('LevelSelect');
    });
  }

  private createHUD() {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '16px',
      color: '#FFFFFF',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    };

    // Здоровье
    this.hudHealth = this.add.text(16, 16, '', style).setScrollFactor(0).setDepth(100);

    // Монеты
    this.hudCoins = this.add.text(16, 40, '', style).setScrollFactor(0).setDepth(100);

    // Спасённые
    this.hudRescued = this.add.text(16, 64, '', style).setScrollFactor(0).setDepth(100);

    // Таймер (если есть)
    this.hudTimer = this.add.text(GAME_WIDTH - 16, 16, '', {
      ...style,
      fontSize: '24px',
    }).setScrollFactor(0).setDepth(100).setOrigin(1, 0);

    // Collectibles
    this.hudCollectibles = this.add.text(16, 88, '', style).setScrollFactor(0).setDepth(100);

    // Название уровня
    const levelTitle = this.add.text(GAME_WIDTH / 2, 16, this.levelData.nameRu, {
      fontSize: '16px',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 2,
    }).setScrollFactor(0).setDepth(100).setOrigin(0.5, 0);

    this.updateHUD();
  }

  private updateHUD() {
    const hearts = '❤️'.repeat(this.player.health) + '🖤'.repeat(Math.max(0, 3 - this.player.health));
    this.hudHealth.setText(hearts);
    this.hudCoins.setText(`🐾 ${this.player.coins}`);
    this.hudRescued.setText(`🐕 ${this.player.rescued}/${this.levelData.requiredRescues}`);

    if (this.levelData.timeLimit) {
      const color = this.timeLeft <= 15 ? '#FF4444' : '#FFFFFF';
      this.hudTimer.setColor(color);
      this.hudTimer.setText(`⏱ ${this.timeLeft}с`);
    }

    if (this.levelData.requiredCollectibles) {
      this.hudCollectibles.setText(`📦 ${this.collectiblesCount}/${this.levelData.requiredCollectibles}`);
    }
  }

  private showMessage(text: string) {
    const msg = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, text, {
      fontSize: '16px',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 16, y: 8 },
    }).setScrollFactor(0).setOrigin(0.5).setDepth(200);

    this.tweens.add({
      targets: msg,
      alpha: 0,
      y: msg.y - 30,
      duration: 2000,
      delay: 500,
      onComplete: () => msg.destroy(),
    });
  }

  private createSnowEffect() {
    // Создаём частицы снега
    this.snowEmitter = this.add.particles(0, -10, 'snowflake', {
      x: { min: 0, max: this.levelData.width },
      quantity: 2,
      frequency: 100,
      lifespan: 6000,
      gravityY: 40,
      speedX: { min: -20, max: -50 },
      speedY: { min: 30, max: 60 },
      scale: { min: 0.3, max: 1 },
      alpha: { start: 0.8, end: 0 },
    });
  }

  private togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.physics.pause();
      const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6)
        .setScrollFactor(0).setDepth(300).setName('pauseOverlay');
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, 'ПАУЗА', {
        fontSize: '32px',
        color: '#FFD700',
        fontStyle: 'bold',
      }).setScrollFactor(0).setDepth(301).setOrigin(0.5).setName('pauseText');
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, 'ESC — продолжить', {
        fontSize: '16px',
        color: '#FFFFFF',
      }).setScrollFactor(0).setDepth(301).setOrigin(0.5).setName('pauseHint');
    } else {
      this.physics.resume();
      this.children.getByName('pauseOverlay')?.destroy();
      this.children.getByName('pauseText')?.destroy();
      this.children.getByName('pauseHint')?.destroy();
    }
  }

  private pauseForModal() {
    this.isPaused = true;
    this.physics.pause();

    const resumeHandler = () => {
      this.isPaused = false;
      this.physics.resume();
      window.removeEventListener('rescue-modal-closed', resumeHandler);
    };
    window.addEventListener('rescue-modal-closed', resumeHandler);
  }

  private cleanup() {
    this.physics.resume(); // Разблокировать физику перед рестартом
    stopMusic();
    EventBus.off('mobile-left-down');
    EventBus.off('mobile-left-up');
    EventBus.off('mobile-right-down');
    EventBus.off('mobile-right-up');
    EventBus.off('mobile-jump');
    EventBus.off('mobile-interact');
    EventBus.off('mobile-shoot');
    this.snowEmitter?.destroy();
    this.timerEvent?.destroy();
  }

  shutdown() {
    this.cleanup();
  }
}

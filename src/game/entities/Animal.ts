import * as Phaser from 'phaser';

export class Animal extends Phaser.Physics.Arcade.Sprite {
  animalId: string;
  animalType: 'puppy' | 'kitten';
  animalName: string;
  isRescued: boolean = false;
  private rescueIndicator: Phaser.GameObjects.Text | null = null;
  private bobOffset: number = 0;
  private bobBase: number;

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
    this.bobBase = y;

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    // Подсказка "E"
    this.rescueIndicator = scene.add.text(x, y - 26, '[E]', {
      fontSize: '10px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0);
  }

  // Вызывать из GameScene.update() — покачивание без tweens
  updateBob(time: number) {
    if (this.isRescued) return;
    this.bobOffset = Math.sin(time * 0.003) * 4;
    this.y = this.bobBase + this.bobOffset;
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

    // Животное исчезает — после анимации полностью убираем
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
        const body = this.body as Phaser.Physics.Arcade.StaticBody;
        if (body) body.enable = false;
        // Убираем из display list чтобы не было мерцания
        this.setPosition(-1000, -1000);
      },
    });
  }

  destroy(fromScene?: boolean) {
    this.rescueIndicator?.destroy();
    super.destroy(fromScene);
  }
}

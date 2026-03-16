import * as Phaser from 'phaser';
import { COLORS } from '@/lib/constants';

export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    // Простой загрузочный экран
    this.cameras.main.setBackgroundColor(COLORS.dark);
    this.scene.start('Preloader');
  }
}

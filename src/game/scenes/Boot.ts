import * as Phaser from 'phaser';
import { COLORS } from '@/lib/constants';

export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.cameras.main.setBackgroundColor(COLORS.dark);
  }

  create() {
    this.scene.start('Preloader');
  }
}

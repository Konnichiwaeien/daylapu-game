import * as Phaser from 'phaser';
import { COLORS } from '@/lib/constants';
import { generatePlaceholderAssets } from '../utils/AssetGenerator';

export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.cameras.main.setBackgroundColor(COLORS.dark);
  }

  create() {
    generatePlaceholderAssets(this);
    this.scene.start('MainMenu');
  }
}

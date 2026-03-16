import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '@/lib/constants';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { LevelSelect } from './scenes/LevelSelect';
import { GameScene } from './scenes/GameScene';
import { LevelComplete } from './scenes/LevelComplete';

export function createGame(parent: string): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    backgroundColor: '#2C1810',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [Boot, Preloader, MainMenu, LevelSelect, GameScene, LevelComplete],
    pixelArt: true,
    roundPixels: true,
  };

  const game = new Phaser.Game(config);
  (window as unknown as Record<string, unknown>).__PHASER_GAME__ = game;
  return game;
}

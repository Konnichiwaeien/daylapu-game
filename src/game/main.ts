import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '@/lib/constants';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { CharacterSelect } from './scenes/CharacterSelect';
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
    scene: [Preloader, MainMenu, CharacterSelect, LevelSelect, GameScene, LevelComplete],
    pixelArt: true,
    roundPixels: true,
    autoFocus: true,
    fps: {
      forceSetTimeOut: true,
      target: 60,
    },
  };

  (config as any).resolution = 2;
  const game = new Phaser.Game(config);
  (window as unknown as Record<string, unknown>).__PHASER_GAME__ = game;
  return game;
}

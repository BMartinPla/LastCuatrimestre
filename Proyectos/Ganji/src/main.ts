import Phaser from 'phaser';
import { BootScene } from './scenes/boot-scene';
import { CharacterSelectScene } from './scenes/char-select-scene';
import { GameScene } from './scenes/game-scene';
import { MapSelectScene } from './scenes/map-select-scene';
import { MenuScene } from './scenes/menu-scene';
import { ShopScene } from './scenes/shop-scene';
import { UIScene } from './scenes/ui-scene';

declare global {
  interface Window {
    __GANJI_SCENES__?: () => string;
    __GANJI_GAME__?: Phaser.Game;
    __GANJI_CONST__?: () => Record<string, number>;
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: '#0b0e1a',
  pixelArt: true,
  parent: 'app',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, MenuScene, CharacterSelectScene, MapSelectScene, ShopScene, GameScene, UIScene]
});

window.__GANJI_SCENES__ = () =>
  game.scene
    .getScenes()
    .map((s) => `${s.scene.settings.key}:${s.scene.settings.status}`)
    .join(',');
window.__GANJI_GAME__ = game;
window.__GANJI_CONST__ = () => Phaser.Scenes as unknown as Record<string, number>;

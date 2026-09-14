import Phaser from 'phaser';

export interface Button {
  container: Phaser.GameObjects.Container;
  setFocused(focused: boolean): void;
}

export function makeTextButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  onClick: () => void
): Button {
  const container = scene.add.container(x, y);
  const bg = scene.add
    .rectangle(0, 0, width, height, 0x1a2238)
    .setStrokeStyle(2, 0x4a5a7a)
    .setInteractive({ useHandCursor: true });
  const text = scene.add
    .text(0, 0, label, { fontFamily: 'monospace', fontSize: '20px', color: '#e8e4d8' })
    .setOrigin(0.5);

  const setFocused = (focused: boolean): void => {
    bg.setStrokeStyle(2, focused ? 0xe9b44c : 0x4a5a7a);
    text.setColor(focused ? '#e9b44c' : '#e8e4d8');
  };

  bg.on('pointerover', () => setFocused(true));
  bg.on('pointerout', () => setFocused(false));
  bg.on('pointerdown', () => onClick());

  container.add([bg, text]);
  return { container, setFocused };
}

export function addMenuBackground(scene: Phaser.Scene, groundKey: string): void {
  scene.add.tileSprite(480, 270, 960, 540, groundKey).setScrollFactor(0).setDepth(-10);
  scene.add.rectangle(480, 270, 960, 540, 0x0b0e1a, 0.45).setScrollFactor(0).setDepth(-9);
  scene.add
    .particles(0, 0, 'spark', {
      x: { min: 0, max: 960 },
      y: -8,
      lifespan: 9000,
      speedY: { min: 18, max: 42 },
      speedX: { min: -16, max: -4 },
      scale: { min: 0.6, max: 1.3 },
      alpha: { start: 0.45, end: 0 },
      frequency: 400,
      quantity: 1,
      tint: 0xe8a7b8
    })
    .setScrollFactor(0)
    .setDepth(-5);
}

import Phaser from 'phaser';
import type { RunState } from '../systems/upgrade-system';

export type PlayerKeys = Record<string, Phaser.Input.Keyboard.Key>;

export class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  run!: RunState;
  iFrames = 0;
  facing = new Phaser.Math.Vector2(1, 0);

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(15);
    this.setCircle(9);
    this.setOffset(Math.max(0, this.width / 2 - 9), Math.max(0, this.height / 2 - 9));
    this.setCollideWorldBounds(true);
  }

  handleInput(keys: PlayerKeys, dt: number): void {
    const speed = this.run.stats.moveSpeed;
    const held = (k: string): boolean => keys[k]?.isDown ?? false;
    let dx = 0;
    let dy = 0;
    if (held('LEFT') || held('A')) dx -= 1;
    if (held('RIGHT') || held('D')) dx += 1;
    if (held('UP') || held('W')) dy -= 1;
    if (held('DOWN') || held('S')) dy += 1;

    const len = Math.hypot(dx, dy);
    if (len > 0) {
      const nx = dx / len;
      const ny = dy / len;
      this.facing.set(nx, ny);
      this.setVelocity(nx * speed, ny * speed);
    } else {
      this.setVelocity(0, 0);
    }

    if (this.iFrames > 0) {
      this.iFrames -= dt;
      if (this.iFrames <= 0) {
        this.setAlpha(1);
      } else {
        this.setAlpha(Math.sin(this.iFrames * 40) > 0 ? 0.4 : 1);
      }
    }
  }
}

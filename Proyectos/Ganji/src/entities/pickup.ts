import Phaser from 'phaser';

export type PickupKind = 'xp' | 'gold';

export class Pickup extends Phaser.GameObjects.Image {
  kind: PickupKind = 'xp';
  value = 0;
  scatterVX = 0;
  scatterVY = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.setDepth(1);
    this.setActive(false);
    this.setVisible(false);
  }

  spawn(x: number, y: number, kind: PickupKind, value: number): void {
    this.kind = kind;
    this.value = value;
    this.setTexture(kind === 'xp' ? 'xp-spirit' : 'coin');
    const angle = Math.random() * Math.PI * 2;
    const force = 30 + Math.random() * 50;
    this.scatterVX = Math.cos(angle) * force;
    this.scatterVY = Math.sin(angle) * force;
    this.setPosition(x, y).setActive(true).setVisible(true).setScale(1).setAlpha(1);
  }

  release(): void {
    this.setActive(false);
    this.setVisible(false);
  }

  /** Devuelve true si fue recogida. */
  updatePickup(
    dt: number,
    playerX: number,
    playerY: number,
    magnetRadius: number,
    collectRadius: number
  ): boolean {
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const distSq = dx * dx + dy * dy;

    if (distSq < collectRadius * collectRadius) {
      this.release();
      return true;
    }

    const scatterDecay = 0.0001 ** dt;
    this.scatterVX *= scatterDecay;
    this.scatterVY *= scatterDecay;

    if (distSq < magnetRadius * magnetRadius) {
      const dist = Math.sqrt(distSq) || 1;
      const pull = 420;
      this.x += ((dx / dist) * pull + this.scatterVX) * dt;
      this.y += ((dy / dist) * pull + this.scatterVY) * dt;
    } else {
      this.x += this.scatterVX * dt;
      this.y += this.scatterVY * dt;
    }
    return false;
  }
}

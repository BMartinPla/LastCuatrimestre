import Phaser from 'phaser';

export class EnemyProjectile extends Phaser.GameObjects.Image {
  vx = 0;
  vy = 0;
  damage = 0;
  life = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, '__DEFAULT');
    this.setDepth(18);
    this.setActive(false);
    this.setVisible(false);
  }

  fire(x: number, y: number, angle: number, speed: number, damage: number, textureKey: string): void {
    this.setTexture(textureKey);
    this.setPosition(x, y);
    this.setRotation(angle);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.damage = damage;
    this.life = 4;
    this.setActive(true).setVisible(true).setScale(1).setAlpha(1);
  }

  release(): void {
    this.setActive(false).setVisible(false);
  }

  /** Devuelve true si golpeó al jugador. */
  updateProjectile(dt: number, playerX: number, playerY: number, hitRadius: number): boolean {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    if (dx * dx + dy * dy < hitRadius * hitRadius) {
      this.release();
      return true;
    }
    return false;
  }

  get expired(): boolean {
    return this.life <= 0;
  }
}

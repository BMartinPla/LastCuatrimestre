import Phaser from 'phaser';
import type { EnemyDef } from '../data/types';

let nextEnemyUid = 1;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  def: EnemyDef | null = null;
  hp = 0;
  maxHp = 0;
  spawnTimer = 0;
  attackCd = 0;
  rangedTimer = 0;
  minionTimer = 0;
  kbX = 0;
  kbY = 0;
  wobblePhase = 0;
  enemyUid = 0;
  isBossLike = false;
  aura: Phaser.GameObjects.Image | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '__DEFAULT');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(10);
    this.setActive(false);
    this.setVisible(false);
    if (this.body) {
      this.body.enable = false;
    }
  }

  spawn(x: number, y: number, def: EnemyDef, hpMult: number): void {
    this.def = def;
    this.enemyUid = nextEnemyUid++;
    this.maxHp = Math.floor(def.hp * hpMult);
    this.hp = this.maxHp;
    this.spawnTimer = 0.35;
    this.attackCd = 0;
    this.rangedTimer = def.ranged ? 1 + Math.random() * 2 : 0;
    this.minionTimer = def.spawns ? def.spawns.every : 0;
    this.kbX = 0;
    this.kbY = 0;
    this.wobblePhase = Math.random() * Math.PI * 2;
    this.isBossLike = Boolean(def.isBoss || def.isMiniBoss);
    this.setPosition(x, y);
    this.setTexture(def.textureKey);
    this.setScale(def.scale);
    this.setAlpha(0);
    this.setActive(true);
    this.setVisible(true);
    this.clearTint();
    const r = def.radius;
    this.body.setCircle(r);
    this.body.setOffset(this.width / 2 - r, this.height / 2 - r);
    this.body.enable = true;
    this.body.reset(x, y);

    if (this.isBossLike && !this.aura) {
      this.aura = this.scene.add
        .image(x, y, 'aura')
        .setDepth(9)
        .setScale(def.isBoss ? 2.4 : 1.1);
    }
    if (this.aura) {
      this.aura.setPosition(x, y).setVisible(true);
    }
  }

  release(): void {
    this.setActive(false);
    this.setVisible(false);
    this.body.enable = false;
    this.body.stop();
    if (this.aura) {
      this.aura.setVisible(false);
    }
    this.def = null;
  }

  /** Movimiento por frame; devuelve sin efectos. dt en segundos. */
  chase(dt: number, playerX: number, playerY: number): void {
    if (!this.def) return;
    const def = this.def;

    if (this.spawnTimer > 0) {
      this.spawnTimer -= dt;
      this.setAlpha(Math.min(1, 1 - this.spawnTimer / 0.35));
      this.body.setVelocity(0, 0);
      return;
    }
    this.setAlpha(1);

    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    let vx = (dx / dist) * def.speed;
    let vy = (dy / dist) * def.speed;

    if (def.wobble) {
      this.wobblePhase += dt * 6;
      const perpX = -dy / dist;
      const perpY = dx / dist;
      const wobble = Math.sin(this.wobblePhase) * def.speed * 0.45;
      vx += perpX * wobble;
      vy += perpY * wobble;
    }

    vx += this.kbX;
    vy += this.kbY;
    this.kbX *= 0.0005 ** dt;
    this.kbY *= 0.0005 ** dt;
    if (Math.abs(this.kbX) < 2) this.kbX = 0;
    if (Math.abs(this.kbY) < 2) this.kbY = 0;

    this.body.setVelocity(vx, vy);
    this.setFlipX(dx < 0);
    // Aliento: pulso de escala por enemigo (fase desfasada por uid)
    const breath = Math.sin(this.wobblePhase * 2 + this.enemyUid * 1.7) * 0.025;
    this.setScale(def.scale, def.scale * (1 + breath));

    if (this.aura) {
      this.aura.setPosition(this.x, this.y);
    }

    if (this.attackCd > 0) this.attackCd -= dt;
  }

  applyKnockback(dirX: number, dirY: number, force: number): void {
    const resist = this.def ? this.def.knockbackResist : 1;
    const f = force * (1 - resist);
    this.kbX += dirX * f;
    this.kbY += dirY * f;
  }
}

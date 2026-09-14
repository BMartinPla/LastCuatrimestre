import Phaser from 'phaser';
import type { Enemy } from './enemy';

let nextProjUid = 1;

export interface ProjConfig {
  x: number;
  y: number;
  angle: number;
  speed: number;
  damage: number;
  pierce: number;
  life: number;
  textureKey: string;
  homing?: boolean;
  target?: Enemy | null;
  seek?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitAngle?: number;
  rehit?: number;
  knockback?: number;
  tag?: string;
  scale?: number;
}

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  damage = 0;
  pierceLeft = 0;
  life = 0;
  projUid = 0;
  homing = false;
  target: Enemy | null = null;
  seekRadPerSec = 0;
  speed = 0;
  hitIds = new Set<number>();
  knockback = 140;
  tag = '';
  orbitRadius = 0;
  orbitAngle = 0;
  orbitSpeed = 0;
  rehitTimer = 0;
  rehitInterval = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '__DEFAULT');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(20);
    this.setActive(false);
    this.setVisible(false);
    if (this.body) {
      this.body.enable = false;
    }
  }

  fire(cfg: ProjConfig): void {
    this.projUid = nextProjUid++;
    this.hitIds.clear();
    this.setPosition(cfg.x, cfg.y);
    this.setTexture(cfg.textureKey)
      .setActive(true)
      .setVisible(true)
      .setAlpha(1)
      .setScale(cfg.scale ?? 1);
    this.damage = cfg.damage;
    this.pierceLeft = cfg.pierce;
    this.life = cfg.life;
    this.homing = cfg.homing ?? false;
    this.target = cfg.homing ? (cfg.target ?? null) : null;
    this.seekRadPerSec = cfg.seek ?? 0;
    this.speed = cfg.speed;
    this.knockback = cfg.knockback ?? 140;
    this.tag = cfg.tag ?? '';
    this.orbitRadius = cfg.orbitRadius ?? 0;
    this.orbitAngle = cfg.orbitAngle ?? 0;
    this.orbitSpeed = cfg.orbitSpeed ?? 0;
    this.rehitInterval = cfg.rehit ?? 0;
    this.rehitTimer = this.rehitInterval;
    this.body.enable = true;
    this.body.reset(cfg.x, cfg.y);
    this.body.setCircle(Math.max(3, (this.width * (cfg.scale ?? 1)) / 2 - 2));
    this.body.setOffset(
      this.width / 2 - this.body.radius,
      this.height / 2 - this.body.radius
    );
    this.body.setVelocity(Math.cos(cfg.angle) * cfg.speed, Math.sin(cfg.angle) * cfg.speed);
    this.setRotation(cfg.angle);
  }

  release(): void {
    this.setActive(false);
    this.setVisible(false);
    this.body.enable = false;
    this.body.stop();
    this.target = null;
    this.tag = '';
  }

  /** Devuelve true si expiró. playerX/Y para órbitas. */
  updateProjectile(dt: number, playerX: number, playerY: number): boolean {
    if (this.orbitRadius > 0) {
      this.orbitAngle += this.orbitSpeed * dt;
      const x = playerX + Math.cos(this.orbitAngle) * this.orbitRadius;
      const y = playerY + Math.sin(this.orbitAngle) * this.orbitRadius;
      this.setPosition(x, y);
      this.setRotation(this.orbitAngle + Math.PI / 2);
      this.body.setVelocity(0, 0);
      if (this.rehitInterval > 0) {
        this.rehitTimer -= dt;
        if (this.rehitTimer <= 0) {
          this.rehitTimer = this.rehitInterval;
          this.hitIds.clear();
        }
      }
    } else if (this.homing && this.target && this.target.active) {
      const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
      const current = Math.atan2(this.body.velocity.y, this.body.velocity.x);
      let diff = angle - current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      const maxTurn = this.seekRadPerSec * dt;
      const turned = Math.abs(diff) < maxTurn ? diff : Math.sign(diff) * maxTurn;
      const newAngle = current + turned;
      this.body.setVelocity(Math.cos(newAngle) * this.speed, Math.sin(newAngle) * this.speed);
      this.setRotation(newAngle);
    }
    this.life -= dt;
    return this.life <= 0;
  }
}

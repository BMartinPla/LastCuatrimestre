import Phaser from 'phaser';
import { CHARACTERS } from '../data/characters';
import { ENEMIES } from '../data/enemies';
import { MAPS } from '../data/maps';
import type { MapDef, UpgradeDef, WeaponLevelDef } from '../data/types';
import { WEAPONS } from '../data/weapons';
import { Enemy } from '../entities/enemy';
import { Pickup } from '../entities/pickup';
import { Player, type PlayerKeys } from '../entities/player';
import { Projectile } from '../entities/projectile';
import { EventBus } from '../systems/event-bus';
import { applyArmor, computeDamage } from '../systems/damage-system';
import { hpMultiplier, SpawnDirector } from '../systems/spawn-director';
import { SpatialHash } from '../systems/spatial-hash';
import { AudioManager } from '../systems/audio-manager';
import type { SaveSystem } from '../systems/save-system';
import { weaponStats } from '../systems/upgrade-system';
import { EnemyProjectile } from '../entities/enemy-projectile';
import {
  addGold,
  applyUpgrade,
  consumeLevelUp,
  createRunState,
  gainXp,
  rollDraft,
  type RunState
} from '../systems/upgrade-system';

const MAX_ALIVE = 220;
const MAX_ENEMIES = 260;
const MAX_PROJECTILES = 200;
const MAX_PICKUPS = 420;
const CONTACT_COOLDOWN = 0.8;
const PLAYER_IFRAMES = 0.6;

declare global {
  interface Window {
    __GANJI_DEBUG__?: {
      getState: () => {
        elapsed: number;
        playerX: number;
        playerY: number;
        hp: number;
        level: number;
        xp: number;
        gold: number;
        kills: number;
        enemiesActive: number;
        projectilesActive: number;
        pickupsActive: number;
        draftOpen: boolean;
        bossAlive: boolean;
        weapons: string[];
      } | null;
      grantXp: (n: number) => void;
      chooseDraft: (i: number) => void;
      forceBoss: () => void;
      killAll: () => void;
    };
  }
}

interface DamageText {
  text: Phaser.GameObjects.Text;
  life: number;
}

export class GameScene extends Phaser.Scene {
  private bus!: EventBus;
  private audio = new AudioManager();
  private run!: RunState;
  private mapDef!: MapDef;
  private director!: SpawnDirector;
  private player!: Player;
  private inputKeys!: PlayerKeys;
  private characterId = 'ronin';
  private enemyFree: Enemy[] = [];
  private enemyActive: Enemy[] = [];
  private enemyGroup!: Phaser.Physics.Arcade.Group;
  private projFree: Projectile[] = [];
  private projActive: Projectile[] = [];
  private projGroup!: Phaser.Physics.Arcade.Group;
  private pickupFree: Pickup[] = [];
  private pickupActive: Pickup[] = [];
  private dmgFree: DamageText[] = [];
  private dmgActive: DamageText[] = [];
  private weaponTimers = new Map<string, number>();
  private boss: Enemy | null = null;
  private elapsed = 0;
  private runEnded = false;
  private draftOpen = false;
  private currentDraft: UpgradeDef[] = [];
  private freeze = 0;
  private xpCombo = 0;
  private xpComboTimer = 0;
  private save!: SaveSystem;
  private revivesUsed = 0;
  private enemyProjFree: EnemyProjectile[] = [];
  private enemyProjActive: EnemyProjectile[] = [];
  private strikeFx!: Phaser.GameObjects.Particles.ParticleEmitter;
  private deathFx!: Phaser.GameObjects.Particles.ParticleEmitter;
  private bossFx!: Phaser.GameObjects.Particles.ParticleEmitter;
  private dustFx!: Phaser.GameObjects.Particles.ParticleEmitter;
  private hash = new SpatialHash<Enemy>(72);
  private aliveCounts = new Map<string, number>();

  constructor() {
    super('game');
  }

  init(data: { mapId?: string; characterId?: string }): void {
    const mapId = data.mapId ?? this.registry.get('gameConfig')?.mapId ?? 'bamboo';
    this.characterId = data.characterId ?? this.registry.get('gameConfig')?.characterId ?? 'ronin';
    const map = MAPS[mapId] ?? MAPS['bamboo'];
    if (!map) throw new Error('Mapa no encontrado');
    this.mapDef = map;
    this.registry.set('gameConfig', { mapId: this.mapDef.id, characterId: this.characterId });
    this.elapsed = 0;
    this.runEnded = false;
    this.draftOpen = false;
    this.boss = null;
    this.freeze = 0;
    this.revivesUsed = 0;
    this.currentDraft = [];
    this.weaponTimers.clear();
    this.aliveCounts.clear();
    // La instancia de escena se reutiliza entre partidas: limpiar pools y
    // listas activas (los game objects anteriores fueron destruidos).
    this.enemyFree = [];
    this.enemyActive = [];
    this.projFree = [];
    this.projActive = [];
    this.pickupFree = [];
    this.pickupActive = [];
    this.dmgFree = [];
    this.dmgActive = [];
    this.enemyProjFree = [];
    this.enemyProjActive = [];
  }

  create(): void {
    const ws = this.mapDef.worldSize;
    this.physics.world.setBounds(0, 0, ws, ws);

    this.bus = new EventBus();
    this.audio = this.registry.get('audio') as AudioManager;
    this.save = this.registry.get('save') as SaveSystem;
    this.run = createRunState(this.characterId, this.save?.get().shop);
    this.registry.set('bus', this.bus);
    this.registry.set('run', this.run);
    const hookAlive = { value: true };
    this.events.once('shutdown', () => {
      this.bus.clear();
      hookAlive.value = false;
    });

    this.input.once('pointerdown', () => this.audio?.unlock());
    this.input.keyboard?.once('keydown', () => this.audio?.unlock());

    const char = CHARACTERS[this.characterId];
    if (!char) throw new Error(`Personaje no encontrado: ${this.characterId}`);
    this.add.tileSprite(0, 0, ws, ws, this.mapDef.groundTextureKey).setOrigin(0).setDepth(-10);
    this.addPetals();

    this.player = new Player(this, ws / 2, ws / 2, char.textureKey);
    this.player.run = this.run;

    const cam = this.cameras.main;
    cam.setBounds(0, 0, ws, ws);
    cam.startFollow(this.player, true, 0.12, 0.12);
    cam.setDeadzone(100, 70);
    cam.setBackgroundColor('#0b0e1a');
    cam.filters?.internal.addGlow(0x9ad8ff, 0.35, 0, 0.6);
    cam.filters?.internal.addVignette(0.5, 0.5, 0.72, 0.42, 0x0a0d16);

    // Respiración del jugador (bob sutil continuo)
    this.tweens.add({
      targets: this.player,
      scaleY: { from: 1, to: 0.96 },
      duration: 640,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.buildPools();

    const kb = this.input.keyboard;
    if (kb) {
      this.inputKeys = kb.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT') as PlayerKeys;
    }

    this.director = new SpawnDirector(this.mapDef.wave);
    this.weaponTimers.set(char.startingWeaponId, 0.4);

    this.physics.add.overlap(
      this.player,
      this.enemyGroup,
      (_obj1: unknown, obj2: unknown) => this.onPlayerEnemyOverlap(obj2 as Enemy),
      undefined,
      this
    );
    this.physics.add.overlap(
      this.projGroup,
      this.enemyGroup,
      (obj1: unknown, obj2: unknown) => this.onProjEnemyOverlap(obj1 as Projectile, obj2 as Enemy),
      undefined,
      this
    );

    this.bus.on('draft-choice', (p) => this.onDraftChoice(p));
    this.scene.launch('ui');

    this.bus.emit('hp-changed', { hp: this.run.hp, maxHp: this.run.stats.maxHp });
    this.bus.emit('xp-changed', { xp: 0, xpToNext: 5, level: 1 });
    this.bus.emit('gold-changed', { gold: 0 });

    // Hook de verificación automatizada (smoke tests).
    /* eslint-disable @typescript-eslint/no-this-alias */
    const sceneRef = this;
    window.__GANJI_DEBUG__ = {
      getState: () => {
        if (!hookAlive.value || !sceneRef.run) return null;
        return {
          mapId: sceneRef.mapDef.id,
          elapsed: sceneRef.elapsed,
          playerX: Math.round(sceneRef.player.x),
          playerY: Math.round(sceneRef.player.y),
          hp: sceneRef.run.hp,
          level: sceneRef.run.level,
          xp: sceneRef.run.xp,
          gold: sceneRef.run.gold,
          kills: sceneRef.run.kills,
          enemiesActive: sceneRef.enemyActive.length,
          projectilesActive: sceneRef.projActive.length,
          pickupsActive: sceneRef.pickupActive.length,
          draftOpen: sceneRef.draftOpen,
          bossAlive: sceneRef.boss !== null,
          weapons: sceneRef.run.weapons.map((w) => `${w.id}:${w.level}${w.evolved ? '*' : ''}`)
        };
      },
      grantXp: (n: number) => {
        gainXp(sceneRef.run, n);
      },
      chooseDraft: (i: number) => {
        const draft = sceneRef.currentDraft[i];
        if (draft && sceneRef.draftOpen) {
          sceneRef.bus.emit('draft-choice', { upgradeId: draft.id });
        }
      },
      forceBoss: () => {
        const wave = sceneRef.mapDef.wave;
        if (!wave.bossEnemyId) return;
        const def = ENEMIES[wave.bossEnemyId];
        const free = sceneRef.enemyFree[sceneRef.enemyFree.length - 1];
        if (!def || !free) return;
        sceneRef.enemyFree.pop();
        const pos = sceneRef.ringSpawnPosition();
        free.spawn(pos.x, pos.y, def, hpMultiplier(sceneRef.elapsed));
        sceneRef.enemyActive.push(free);
        sceneRef.boss = free;
        sceneRef.bus.emit('boss-spawned', { name: def.name, maxHp: free.maxHp });
        sceneRef.audio?.play('roar');
        sceneRef.cameras.main.shake(350, 0.006);
      },
      killAll: () => {
        for (const e of [...sceneRef.enemyActive]) {
          if (!e.active || !e.def) continue;
          e.hp = 1;
          sceneRef.damageEnemy(e, 999999, 0, -1, 0);
        }
      }
    };
    /* eslint-enable @typescript-eslint/no-this-alias */
  }

  private buildPools(): void {
    this.enemyGroup = this.physics.add.group();
    this.projGroup = this.physics.add.group();
    for (let i = 0; i < MAX_ENEMIES; i++) {
      const e = new Enemy(this, 0, 0);
      this.enemyGroup.add(e);
      this.enemyFree.push(e);
    }
    for (let i = 0; i < MAX_PROJECTILES; i++) {
      const p = new Projectile(this, 0, 0);
      this.projGroup.add(p);
      this.projFree.push(p);
    }
    for (let i = 0; i < MAX_PICKUPS; i++) {
      this.pickupFree.push(new Pickup(this, 0, 0, 'xp-spirit'));
    }
    for (let i = 0; i < 80; i++) {
      this.enemyProjFree.push(new EnemyProjectile(this));
    }
    for (let i = 0; i < 40; i++) {
      const text = this.add
        .text(0, 0, '', {
          fontSize: '14px',
          fontFamily: 'monospace',
          color: '#f5efe0',
          stroke: '#11151f',
          strokeThickness: 3
        })
        .setDepth(30)
        .setOrigin(0.5)
        .setActive(false)
        .setVisible(false);
      this.dmgFree.push({ text, life: 0 });
    }
  }

  private addPetals(): void {
    this.add
      .particles(0, 0, 'spark', {
        x: { min: 0, max: 960 },
        y: -8,
        lifespan: 9000,
        speedY: { min: 18, max: 42 },
        speedX: { min: -16, max: -4 },
        scale: { min: 0.6, max: 1.3 },
        alpha: { start: 0.45, end: 0 },
        frequency: 500,
        quantity: 1,
        tint: 0xe8a7b8
      })
      .setScrollFactor(0)
      .setDepth(-5);

    this.strikeFx = this.add
      .particles(0, 0, 'spark', {
        speed: { min: 100, max: 300 },
        lifespan: { min: 150, max: 400 },
        scale: { start: 1.4, end: 0 },
        tint: 0xf5f0c8,
        emitting: false
      })
      .setDepth(25);
    this.deathFx = this.add
      .particles(0, 0, 'spark', {
        speed: { min: 40, max: 170 },
        lifespan: { min: 180, max: 450 },
        scale: { start: 1.1, end: 0 },
        tint: 0x64d8e8,
        emitting: false
      })
      .setDepth(25);
    this.bossFx = this.add
      .particles(0, 0, 'spark', {
        speed: { min: 80, max: 320 },
        lifespan: { min: 300, max: 900 },
        scale: { start: 1.8, end: 0 },
        tint: 0xc73e3a,
        emitting: false
      })
      .setDepth(25);
    this.dustFx = this.add
      .particles(0, 0, 'spark', {
        speed: { min: 15, max: 60 },
        lifespan: { min: 150, max: 350 },
        scale: { start: 0.8, end: 0 },
        alpha: { start: 0.5, end: 0 },
        tint: 0x4a5a7a,
        emitting: false
      })
      .setDepth(25);
  }

  update(_time: number, delta: number): void {
    const rawDt = Math.min(delta / 1000, 0.05);

    if (this.freeze > 0) {
      this.freeze -= rawDt;
      this.physics.world.isPaused = true;
      return;
    }
    this.physics.world.isPaused = false;
    if (this.runEnded || this.draftOpen) return;
    const dt = rawDt;
    this.elapsed += dt;
    this.run.elapsed = this.elapsed;
    this.bus.emit('time-changed', { elapsed: this.elapsed });

    if (this.xpComboTimer > 0) {
      this.xpComboTimer -= dt;
      if (this.xpComboTimer <= 0) this.xpCombo = 0;
    }

    this.player.handleInput(this.inputKeys, dt);

    this.updateSpawning(dt);
    this.updateEnemies(dt);
    this.tickWeapons(dt);
    this.updateProjectiles(dt);
    this.updateEnemyProjectiles(dt);
    this.updatePickups(dt);
    this.updateDamageTexts(dt);

    if (this.run.pendingLevelUps > 0 && !this.draftOpen) {
      this.openDraft();
    }
  }

  // ---------- Spawning ----------

  private updateSpawning(dt: number): void {
    this.aliveCounts.clear();
    for (const e of this.enemyActive) {
      const id = e.def?.id;
      if (id) this.aliveCounts.set(id, (this.aliveCounts.get(id) ?? 0) + 1);
    }
    this.director.reportAlive(this.aliveCounts);
    const requests = this.director.update(dt, this.elapsed, this.enemyActive.length, MAX_ALIVE);
    for (const req of requests) {
      const def = ENEMIES[req.enemyId];
      if (!def) continue;
      const free = this.enemyFree.pop();
      if (!free) break;
      const pos = this.ringSpawnPosition();
      free.spawn(pos.x, pos.y, def, hpMultiplier(this.elapsed));
      this.enemyActive.push(free);
      if (!req.isBoss) {
        this.dustFx.emitParticleAt(pos.x, pos.y, 3);
      }
      if (req.isBoss) {
        this.boss = free;
        this.bus.emit('boss-spawned', { name: def.name, maxHp: free.maxHp });
        this.audio.play('roar');
        this.cameras.main.shake(350, 0.006);
        if (free.aura) {
          this.tweens.add({
            targets: free.aura,
            scale: free.aura.scale * 1.25,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
        }
      }
    }
  }

  private ringSpawnPosition(): { x: number; y: number } {
    const angle = Math.random() * Math.PI * 2;
    const r = 620;
    const ws = this.mapDef.worldSize;
    const x = Phaser.Math.Clamp(this.player.x + Math.cos(angle) * r, 24, ws - 24);
    const y = Phaser.Math.Clamp(this.player.y + Math.sin(angle) * r, 24, ws - 24);
    return { x, y };
  }

  // ---------- Enemigos ----------

  private updateEnemies(dt: number): void {
    this.hash.clear();
    for (const e of this.enemyActive) {
      this.hash.insert(e);
    }
    for (let i = this.enemyActive.length - 1; i >= 0; i--) {
      const e = this.enemyActive[i];
      if (!e || !e.active || !e.def) {
        if (e && !e.active) this.enemyActive.splice(i, 1);
        continue;
      }
      e.chase(dt, this.player.x, this.player.y);
      this.separate(e);
      this.updateEnemySpecials(e, dt);
      if (e.isBossLike && this.boss === e) {
        this.bus.emit('boss-hp-changed', { hp: e.hp, maxHp: e.maxHp });
      }
    }
  }

  private updateEnemySpecials(e: Enemy, dt: number): void {
    const def = e.def;
    if (!def || !e.active) return;
    if (def.ranged) {
      if (e.rangedTimer > 0) {
        e.rangedTimer -= dt;
      } else {
        const dx = this.player.x - e.x;
        const dy = this.player.y - e.y;
        if (dx * dx + dy * dy < 700 * 700) {
          e.rangedTimer = def.ranged.every;
          const proj = this.enemyProjFree.pop();
          if (proj) {
            const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.15;
            proj.fire(e.x, e.y, angle, def.ranged.speed, def.ranged.damage, def.ranged.textureKey);
            this.enemyProjActive.push(proj);
          }
        }
      }
    }
    if (def.spawns) {
      if (e.minionTimer > 0) {
        e.minionTimer -= dt;
      } else {
        e.minionTimer = def.spawns.every;
        const free = this.enemyFree.pop();
        if (free) {
          const minionDef = ENEMIES[def.spawns.enemyId];
          if (minionDef) {
            const x = e.x + (Math.random() - 0.5) * 120;
            const y = e.y + (Math.random() - 0.5) * 120;
            free.spawn(x, y, minionDef, hpMultiplier(this.elapsed));
            this.enemyActive.push(free);
          }
        }
      }
    }
  }

  private updateEnemyProjectiles(dt: number): void {
    const hitR = 14;
    for (let i = this.enemyProjActive.length - 1; i >= 0; i--) {
      const proj = this.enemyProjActive[i];
      if (!proj) continue;
      const hit = proj.updateProjectile(dt, this.player.x, this.player.y, hitR);
      if (hit) {
        this.damagePlayer(proj.damage);
      }
      if (hit || proj.expired) {
        proj.release();
        this.enemyProjActive.splice(i, 1);
        this.enemyProjFree.push(proj);
      }
    }
  }

  private separate(e: Enemy): void {
    const near = this.hash.query(e.x, e.y);
    let pushX = 0;
    let pushY = 0;
    for (const other of near) {
      if (other === e || !other.active) continue;
      const dx = e.x - other.x;
      const dy = e.y - other.y;
      const distSq = dx * dx + dy * dy;
      const minDist = (e.def?.radius ?? 8) + (other.def?.radius ?? 8);
      if (distSq > 0.01 && distSq < minDist * minDist) {
        const dist = Math.sqrt(distSq);
        const push = ((minDist - dist) / minDist) * 40;
        pushX += (dx / dist) * push;
        pushY += (dy / dist) * push;
      }
    }
    if (pushX !== 0 || pushY !== 0) {
      e.x += pushX * 0.016;
      e.y += pushY * 0.016;
    }
  }

  private onPlayerEnemyOverlap(enemyObj: Enemy): void {
    const enemy = enemyObj;
    if (!enemy.active || !enemy.def || enemy.attackCd > 0 || this.runEnded) return;
    enemy.attackCd = CONTACT_COOLDOWN;
    this.damagePlayer(enemy.def.damage);
  }

  private damagePlayer(amount: number): void {
    if (this.player.iFrames > 0 || this.runEnded) return;
    const dmg = applyArmor(amount, this.run.stats.armor);
    this.run.hp = Math.max(0, this.run.hp - dmg);
    this.player.iFrames = PLAYER_IFRAMES;
    this.player.setTint(0xff6b6b);
    this.time.delayedCall(120, () => {
      if (this.player.active) this.player.clearTint();
    });
    this.cameras.main.shake(90, 0.004);
    this.audio.play('hurt');
    this.bus.emit('hp-changed', { hp: this.run.hp, maxHp: this.run.stats.maxHp });
    this.bus.emit('player-hurt', { amount: dmg });
    if (this.run.hp <= 0) {
      this.tryReviveOrGameOver();
    }
  }

  private tryReviveOrGameOver(): void {
    if (this.run.stats.revives > this.revivesUsed) {
      this.revivesUsed += 1;
      this.run.hp = Math.floor(this.run.stats.maxHp * 0.5);
      this.player.iFrames = 2;
      this.audio.play('levelup');
      this.bus.emit('hp-changed', { hp: this.run.hp, maxHp: this.run.stats.maxHp });
      this.bus.emit('revived', {});
      this.bus.emit('player-hurt', { amount: 0 });
      // aparta a los enemigos cercanos
      for (const e of this.enemyActive) {
        if (!e.active || !e.def) continue;
        const dx = e.x - this.player.x;
        const dy = e.y - this.player.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 300) {
          e.applyKnockback(dx / dist, dy / dist, 520);
        }
      }
      this.cameras.main.shake(200, 0.006);
      return;
    }
    this.gameOver(false);
  }

  private gameOver(victory: boolean): void {
    if (this.runEnded) return;
    this.runEnded = true;
    this.physics.pause();
    if (!victory) {
      this.player.setTint(0x8f1d1d).setTintMode(Phaser.TintModes.FILL);
      this.cameras.main.shake(250, 0.01);
    }
    this.audio.play(victory ? 'victory' : 'gameover');
    const stats = {
      elapsed: this.elapsed,
      kills: this.run.kills,
      level: this.run.level,
      gold: this.run.gold
    };
    let unlocks: string[] = [];
    if (this.save) {
      unlocks = this.save.applyRunResults(
        { gold: this.run.gold, kills: this.run.kills, level: this.run.level, elapsed: this.elapsed },
        this.mapDef.id,
        victory
      );
    }
    this.bus.emit('run-saved', { unlocks });
    this.bus.emit(victory ? 'victory' : 'game-over', stats);
  }

  private onProjEnemyOverlap(projObj: Projectile, enemyObj: Enemy): void {
    const proj = projObj;
    const enemy = enemyObj;
    if (!proj.active || !enemy.active || !enemy.def) return;
    if (proj.hitIds.has(enemy.enemyUid)) return;
    proj.hitIds.add(enemy.enemyUid);

    const vx = proj.body.velocity.x;
    const vy = proj.body.velocity.y;
    const len = Math.hypot(vx, vy) || 1;
    this.damageEnemy(enemy, proj.damage, vx / len, vy / len, proj.knockback);

    if (proj.pierceLeft > 0) {
      proj.pierceLeft -= 1;
    } else {
      this.releaseProjectile(proj);
    }
  }

  // ---------- Armas ----------

  private tickWeapons(dt: number): void {
    for (const owned of this.run.weapons) {
      let timer = this.weaponTimers.get(owned.id);
      if (timer === undefined) {
        timer = 0;
      }
      timer -= dt;
      if (timer <= 0) {
        const level = weaponStats(owned);
        timer = level.cooldown * this.run.stats.cooldownMult;
        this.fireWeapon(owned, level);
      }
      this.weaponTimers.set(owned.id, timer);
    }
  }

  private fireWeapon(owned: import('../data/types').OwnedWeapon, level: WeaponLevelDef): void {
    const def = WEAPONS[owned.id];
    if (!def) return;
    switch (def.behavior) {
      case 'arc':
        this.fireArc(level);
        break;
      case 'spread':
        this.fireSpread(level);
        break;
      case 'homing':
        this.fireHoming(level);
        break;
      case 'orbit':
        this.fireOrbit(owned.id, level);
        break;
      case 'nova':
        this.fireNova(level);
        break;
      case 'sniper':
        this.fireSniper(level);
        break;
      case 'strike':
        this.fireStrike(level);
        break;
      case 'wave':
        this.fireWave(level);
        break;
    }
  }

  /** Libera los proyectiles orbitales de un arma (para refrescar al re-disparar). */
  private releaseOrbiters(tag: string): void {
    for (let i = this.projActive.length - 1; i >= 0; i--) {
      const proj = this.projActive[i];
      if (proj && proj.tag === tag) {
        this.releaseProjectile(proj);
      }
    }
  }

  private fireOrbit(weaponId: string, level: WeaponLevelDef): void {
    const tag = `orbit-${weaponId}`;
    this.releaseOrbiters(tag);
    const radius = level.area * this.run.stats.areaMult;
    const speed = level.speed ?? 3;
    for (let i = 0; i < level.count; i++) {
      const proj = this.projFree.pop();
      if (!proj) break;
      proj.fire({
        x: this.player.x,
        y: this.player.y,
        angle: 0,
        speed: 0,
        damage: level.damage,
        pierce: 9999,
        life: level.cooldown * this.run.stats.cooldownMult + 0.6,
        textureKey: WEAPONS[weaponId]?.textureKey ?? 'bo',
        orbitRadius: radius,
        orbitSpeed: speed,
        orbitAngle: (i / level.count) * Math.PI * 2 + (Math.random() * 0.2 - 0.1),
        rehit: 0.45,
        knockback: 120,
        tag,
        scale: 1
      });
      this.projActive.push(proj);
    }
  }

  private fireNova(level: WeaponLevelDef): void {
    this.audio.play('throw');
    const speed = (level.speed ?? 180) * this.run.stats.speedMult;
    for (let i = 0; i < level.count; i++) {
      const angle = (i / level.count) * Math.PI * 2 + this.elapsed;
      const proj = this.projFree.pop();
      if (!proj) break;
      proj.fire({
        x: this.player.x,
        y: this.player.y,
        angle,
        speed,
        damage: level.damage,
        pierce: level.pierce ?? 2,
        life: 1.5,
        textureKey: 'flame',
        knockback: 100
      });
      this.projActive.push(proj);
    }
  }

  private fireSniper(level: WeaponLevelDef): void {
    this.audio.play('throw');
    const speed = (level.speed ?? 820) * this.run.stats.speedMult;
    const shots = level.count;
    for (let i = 0; i < shots; i++) {
      const target = this.nthNearestEnemy(i, 900);
      const angle = target
        ? Math.atan2(target.y - this.player.y, target.x - this.player.x)
        : Math.atan2(this.player.facing.y, this.player.facing.x);
      const proj = this.projFree.pop();
      if (!proj) break;
      proj.fire({
        x: this.player.x,
        y: this.player.y,
        angle,
        speed,
        damage: level.damage,
        pierce: level.pierce ?? 3,
        life: 1.6,
        textureKey: 'arrow',
        knockback: 260
      });
      this.projActive.push(proj);
    }
  }

  private fireStrike(level: WeaponLevelDef): void {
    const range = level.area;
    const candidates = this.enemyActive.filter(
      (e) => e.active && e.def && e.x >= this.player.x - range && e.x <= this.player.x + range && e.y >= this.player.y - range && e.y <= this.player.y + range
    );
    if (candidates.length === 0) return;
    this.audio.play('crit');
    const strikes = Math.min(level.count, candidates.length);
    for (let i = 0; i < strikes; i++) {
      const idx = Math.floor(Math.random() * candidates.length);
      const enemy = candidates.splice(idx, 1)[0];
      if (!enemy || !enemy.active) continue;
      const bolt = this.add
        .image(enemy.x, enemy.y - 20, 'bolt')
        .setDepth(26)
        .setScale(1 + Math.random() * 0.4)
        .setRotation(Math.random() * 0.3 - 0.15)
        .setAlpha(0.95);
      this.tweens.add({
        targets: bolt,
        alpha: 0,
        duration: 160,
        onComplete: () => bolt.destroy()
      });
      this.strikeFx.emitParticleAt(enemy.x, enemy.y, 6);
      this.damageEnemy(enemy, level.damage, Math.random() - 0.5, Math.random() - 0.5, 60);
    }
  }

  private fireWave(level: WeaponLevelDef): void {
    this.audio.play('swing');
    const radius = level.area * this.run.stats.areaMult;
    const facingAngle = Math.atan2(this.player.facing.y, this.player.facing.x);
    for (let i = 0; i < level.count; i++) {
      const angle = facingAngle + (i - (level.count - 1) / 2) * 0.5;
      this.doWavePulse(angle, radius, level.damage);
    }
  }

  private doWavePulse(angle: number, radius: number, baseDamage: number): void {
    const px = this.player.x + Math.cos(angle) * radius * 0.6;
    const py = this.player.y + Math.sin(angle) * radius * 0.6;
    const fan = this.add
      .image(px, py, 'fan')
      .setRotation(angle + Math.PI / 2)
      .setDepth(12)
      .setScale(radius / 40)
      .setAlpha(0.9);
    this.tweens.add({
      targets: fan,
      alpha: 0,
      scale: fan.scale * 1.3,
      x: px + Math.cos(angle) * 40,
      y: py + Math.sin(angle) * 40,
      duration: 220,
      onComplete: () => fan.destroy()
    });

    const halfArc = 1.35;
    for (const enemy of this.enemyActive) {
      if (!enemy.active || !enemy.def) continue;
      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      const distSq = dx * dx + dy * dy;
      if (distSq > radius * radius) continue;
      const angleTo = Math.atan2(dy, dx);
      let diff = angleTo - angle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      if (Math.abs(diff) > halfArc) continue;
      const dist = Math.sqrt(distSq) || 1;
      this.damageEnemy(enemy, baseDamage, dx / dist, dy / dist, 520);
    }
  }

  private fireArc(level: WeaponLevelDef): void {
    const radius = level.area * this.run.stats.areaMult;
    const facingAngle = Math.atan2(this.player.facing.y, this.player.facing.x);
    this.doArcSlash(facingAngle, radius, level.damage);
    if (level.count >= 2) {
      this.time.delayedCall(140, () => {
        if (!this.runEnded) this.doArcSlash(facingAngle + Math.PI, radius, level.damage);
      });
    }
    if (level.count >= 3) {
      this.time.delayedCall(280, () => {
        if (!this.runEnded) {
          this.doArcSlash(
            facingAngle + (Math.random() < 0.5 ? -1 : 1) * 1.2,
            radius,
            level.damage
          );
        }
      });
    }
  }

  private doArcSlash(angle: number, radius: number, baseDamage: number): void {
    this.audio.play('swing');
    const px = this.player.x + Math.cos(angle) * radius * 0.55;
    const py = this.player.y + Math.sin(angle) * radius * 0.55;
    const slash = this.add
      .image(px, py, 'slash')
      .setRotation(angle + Math.PI / 2)
      .setDepth(12)
      .setScale(radius / 30)
      .setAlpha(0.95);
    this.tweens.add({
      targets: slash,
      alpha: 0,
      scale: slash.scale * 1.2,
      duration: 150,
      onComplete: () => slash.destroy()
    });

    const halfArc = 1.0;
    for (const enemy of this.enemyActive) {
      if (!enemy.active || !enemy.def) continue;
      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      const distSq = dx * dx + dy * dy;
      if (distSq > radius * radius) continue;
      const angleTo = Math.atan2(dy, dx);
      let diff = angleTo - angle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      if (Math.abs(diff) > halfArc) continue;
      const dist = Math.sqrt(distSq) || 1;
      this.damageEnemy(enemy, baseDamage, dx / dist, dy / dist, 180);
    }
  }

  private fireSpread(level: WeaponLevelDef): void {
    this.audio.play('throw');
    const target = this.nearestEnemy(700);
    const speed = (level.speed ?? 500) * this.run.stats.speedMult;
    const baseAngle = target
      ? Math.atan2(target.y - this.player.y, target.x - this.player.x)
      : Math.atan2(this.player.facing.y, this.player.facing.x);
    const count = level.count;
    const spread = 0.22;
    for (let i = 0; i < count; i++) {
      const offset = count === 1 ? 0 : (i - (count - 1) / 2) * spread;
      const proj = this.projFree.pop();
      if (!proj) break;
      proj.fire({
        x: this.player.x,
        y: this.player.y,
        angle: baseAngle + offset,
        speed,
        damage: level.damage,
        pierce: level.pierce ?? 0,
        life: 1.2,
        textureKey: 'kunai',
        knockback: 140
      });
      this.projActive.push(proj);
    }
  }

  private fireHoming(level: WeaponLevelDef): void {
    this.audio.play('chime');
    const speed = (level.speed ?? 260) * this.run.stats.speedMult;
    for (let i = 0; i < level.count; i++) {
      const target = this.nthNearestEnemy(i, 500);
      const angle = target
        ? Math.atan2(target.y - this.player.y, target.x - this.player.x)
        : Math.random() * Math.PI * 2;
      const proj = this.projFree.pop();
      if (!proj) break;
      proj.fire({
        x: this.player.x,
        y: this.player.y,
        angle: angle + (Math.random() - 0.5) * 0.6,
        speed,
        damage: level.damage,
        pierce: 0,
        life: 3,
        textureKey: 'talisman',
        homing: true,
        target,
        seek: 5,
        knockback: 100
      });
      this.projActive.push(proj);
    }
  }

  private nearestEnemy(maxDist: number): Enemy | null {
    return this.nthNearestEnemy(0, maxDist);
  }

  private nthNearestEnemy(index: number, maxDist: number): Enemy | null {
    const candidates: { enemy: Enemy; distSq: number }[] = [];
    for (const enemy of this.enemyActive) {
      if (!enemy.active || !enemy.def) continue;
      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      const distSq = dx * dx + dy * dy;
      if (distSq <= maxDist * maxDist) {
        candidates.push({ enemy, distSq });
      }
    }
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => a.distSq - b.distSq);
    const picked = candidates[Math.min(index, candidates.length - 1)];
    return picked ? picked.enemy : null;
  }

  // ---------- Daño y muerte ----------

  private damageEnemy(
    enemy: Enemy,
    baseDamage: number,
    dirX: number,
    dirY: number,
    kbForce: number
  ): void {
    if (!enemy.active || !enemy.def) return;
    const s = this.run.stats;
    const result = computeDamage(
      baseDamage,
      s.damageMult,
      0,
      s.critChance,
      s.critMult,
      Math.random
    );
    enemy.hp -= result.amount;
    enemy.applyKnockback(dirX, dirY, kbForce);
    enemy.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    if (result.crit) {
      this.audio.play('crit');
      this.freeze = Math.max(this.freeze, 0.045);
      this.cameras.main.shake(60, 0.0015);
    } else {
      this.audio.play('hit');
    }
    this.time.delayedCall(50, () => {
      if (enemy.active) enemy.clearTint();
    });
    this.spawnDamageText(enemy.x, enemy.y - 14, result.amount, result.crit);
    if (enemy.hp <= 0) {
      this.killEnemy(enemy);
    }
  }

  private killEnemy(enemy: Enemy): void {
    const def = enemy.def;
    if (!def) return;
    this.run.kills += 1;
    this.bus.emit('enemy-killed', { x: enemy.x, y: enemy.y, isBoss: enemy.isBossLike });
    this.audio.play('kill');
    this.spawnPickup(enemy.x, enemy.y, 'xp', def.xp);
    const goldChance = def.goldChance * (1 + 0.03 * this.run.stats.luck);
    if (Math.random() < goldChance) {
      this.spawnPickup(enemy.x, enemy.y, 'gold', def.goldAmount);
    }
    if (this.boss === enemy) {
      this.boss = null;
      this.bus.emit('boss-died', { name: def.name });
      this.bossFx.emitParticleAt(enemy.x, enemy.y, 40);
      this.freeze = Math.max(this.freeze, def.isBoss ? 0.26 : 0.14);
      this.cameras.main.shake(def.isBoss ? 320 : 180, 0.007);
      if (this.mapDef.wave.victoryOnBossKill && def.isBoss) {
        this.gameOver(true);
      }
    } else {
      this.deathFx.emitParticleAt(enemy.x, enemy.y, 7);
    }
    enemy.release();
    const idx = this.enemyActive.indexOf(enemy);
    if (idx >= 0) this.enemyActive.splice(idx, 1);
    this.enemyFree.push(enemy);
  }

  private spawnPickup(x: number, y: number, kind: 'xp' | 'gold', value: number): void {
    const pickup = this.pickupFree.pop();
    if (!pickup) return;
    pickup.spawn(x, y, kind, value);
    this.pickupActive.push(pickup);
  }

  private updatePickups(dt: number): void {
    const magnet = this.run.stats.magnetRadius;
    for (let i = this.pickupActive.length - 1; i >= 0; i--) {
      const pickup = this.pickupActive[i];
      if (!pickup) continue;
      const collected = pickup.updatePickup(dt, this.player.x, this.player.y, magnet, 24);
      if (collected) {
        this.pickupActive.splice(i, 1);
        this.pickupFree.push(pickup);
        if (pickup.kind === 'xp') {
          this.audio.play('xp', this.xpCombo);
          this.xpCombo += 1;
          this.xpComboTimer = 1;
          gainXp(this.run, pickup.value);
          this.bus.emit('xp-changed', {
            xp: this.run.xp,
            xpToNext: this.xpToNext(),
            level: this.run.level
          });
        } else {
          this.audio.play('coin');
          addGold(this.run, pickup.value);
          this.bus.emit('gold-changed', { gold: this.run.gold });
        }
      }
    }
  }

  private xpToNext(): number {
    return 5 + (this.run.level - 1) * 8;
  }

  // ---------- Proyectiles ----------

  private updateProjectiles(dt: number): void {
    const ws = this.mapDef.worldSize;
    for (let i = this.projActive.length - 1; i >= 0; i--) {
      const proj = this.projActive[i];
      if (!proj) continue;
      if (!proj.active) {
        this.projActive.splice(i, 1);
        continue;
      }
      const expired = proj.updateProjectile(dt, this.player.x, this.player.y);
      const orbit = proj.orbitRadius > 0;
      const out =
        !orbit && (proj.x < 0 || proj.y < 0 || proj.x > ws || proj.y > ws);
      if (expired || out) {
        this.releaseProjectile(proj);
      }
    }
  }

  private releaseProjectile(proj: Projectile): void {
    proj.release();
    const idx = this.projActive.indexOf(proj);
    if (idx >= 0) this.projActive.splice(idx, 1);
    this.projFree.push(proj);
  }

  // ---------- Textos de daño ----------

  private spawnDamageText(x: number, y: number, amount: number, crit: boolean): void {
    const slot = this.dmgFree.pop();
    if (!slot) return;
    slot.text
      .setPosition(x + Phaser.Math.Between(-8, 8), y)
      .setText(crit ? `${amount}!` : `${amount}`)
      .setColor(crit ? '#ffb347' : '#f5efe0')
      .setFontSize(crit ? 18 : 14)
      .setAlpha(1)
      .setActive(true)
      .setVisible(true);
    slot.life = 0.5;
    this.dmgActive.push(slot);
  }

  private updateDamageTexts(dt: number): void {
    for (let i = this.dmgActive.length - 1; i >= 0; i--) {
      const slot = this.dmgActive[i];
      if (!slot) continue;
      slot.life -= dt;
      slot.text.y -= 34 * dt;
      slot.text.setAlpha(Math.max(0, slot.life / 0.5));
      if (slot.life <= 0) {
        slot.text.setActive(false).setVisible(false);
        this.dmgActive.splice(i, 1);
        this.dmgFree.push(slot);
      }
    }
  }

  // ---------- Draft de mejoras ----------

  private openDraft(): void {
    consumeLevelUp(this.run);
    this.currentDraft = rollDraft(this.run, Math.random);
    this.draftOpen = true;
    this.audio.play('levelup');
    this.bus.emit('request-draft', { draft: this.currentDraft });
    this.scene.pause();
  }

  private onDraftChoice(payload: { upgradeId: string }): void {
    if (!this.draftOpen) return;
    const upgrade = this.currentDraft.find((u) => u.id === payload.upgradeId);
    if (upgrade) {
      applyUpgrade(this.run, upgrade);
      if (upgrade.kind === 'new-weapon' && upgrade.targetId) {
        this.weaponTimers.set(upgrade.targetId, 0.3);
        this.bus.emit('weapon-acquired', { weaponId: upgrade.targetId, level: 1 });
      } else if (upgrade.kind === 'weapon-level' && upgrade.targetId) {
        const owned = this.run.weapons.find((w) => w.id === upgrade.targetId);
        if (owned) {
          this.bus.emit('weapon-upgraded', { weaponId: owned.id, level: owned.level });
        }
      } else if (upgrade.kind === 'evolution' && upgrade.targetId) {
        const owned = this.run.weapons.find((w) => w.id === upgrade.targetId);
        if (owned) {
          this.bus.emit('weapon-upgraded', { weaponId: owned.id, level: owned.level });
        }
      }
      this.bus.emit('hp-changed', { hp: this.run.hp, maxHp: this.run.stats.maxHp });
    }
    this.draftOpen = false;
    this.scene.resume();
    if (this.run.pendingLevelUps > 0) {
      this.openDraft();
    }
  }
}

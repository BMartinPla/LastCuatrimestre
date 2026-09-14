import Phaser from 'phaser';
import { WEAPONS } from '../data/weapons';
import type { AudioManager } from '../systems/audio-manager';
import type { EventBus, UpgradeDefLite } from '../systems/event-bus';
import type { RunState } from '../systems/upgrade-system';

const PAPER = '#e8e4d8';
const GOLD = '#e9b44c';
const GOLD_HEX = 0xe9b44c;

export class UIScene extends Phaser.Scene {
  private bus!: EventBus;
  private run!: RunState;

  private hpFill!: Phaser.GameObjects.Rectangle;
  private hpText!: Phaser.GameObjects.Text;
  private xpFill!: Phaser.GameObjects.Rectangle;
  private timerText!: Phaser.GameObjects.Text;
  private goldText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private weaponSlots: Phaser.GameObjects.Container[] = [];
  private weaponRow!: Phaser.GameObjects.Container;

  private bossBar!: Phaser.GameObjects.Container;
  private bossName!: Phaser.GameObjects.Text;
  private bossFill!: Phaser.GameObjects.Rectangle;

  private draftModal!: Phaser.GameObjects.Container;
  private draftCards: UpgradeDefLite[] = [];
  private draftTitle!: Phaser.GameObjects.Text;
  private draftCardTexts: {
    name: Phaser.GameObjects.Text;
    desc: Phaser.GameObjects.Text;
    icon: Phaser.GameObjects.Text;
  }[] = [];
  private draftOpen = false;
  private gameEnded = false;
  private paused = false;
  private pendingUnlocks: string[] = [];
  private audio!: AudioManager;
  private hurtFlash!: Phaser.GameObjects.Rectangle;
  private bigFlash!: Phaser.GameObjects.Rectangle;
  private toast!: Phaser.GameObjects.Text;
  private toastTween: Phaser.Tweens.Tween | null = null;

  private pauseOverlay!: Phaser.GameObjects.Container;
  private endOverlay!: Phaser.GameObjects.Container;
  private endTitle!: Phaser.GameObjects.Text;
  private endStats!: Phaser.GameObjects.Text;

  constructor() {
    super('ui');
  }

  create(): void {
    // La instancia se reutiliza entre partidas: limpiar estado previo.
    this.gameEnded = false;
    this.paused = false;
    this.draftOpen = false;
    this.pendingUnlocks = [];
    this.draftCardTexts = [];
    this.draftCards = [];
    this.weaponSlots = [];
    this.toastTween = null;

    this.bus = this.registry.get('bus') as EventBus;
    this.run = this.registry.get('run') as RunState;
    this.audio = this.registry.get('audio') as AudioManager;

    this.buildHud();
    this.buildBossBar();
    this.buildFlashes();
    this.buildDraftModal();
    this.buildPauseOverlay();
    this.buildEndOverlay();

    this.bus.on('hp-changed', (p) => this.setHp(p.hp, p.maxHp));
    this.bus.on('xp-changed', (p) => this.setXp(p.xp, p.xpToNext, p.level));
    this.bus.on('gold-changed', (p) => this.goldText.setText(`${p.gold}`));
    this.bus.on('time-changed', (p) => {
      const m = Math.floor(p.elapsed / 60);
      const s = Math.floor(p.elapsed % 60);
      this.timerText.setText(`${m}:${s.toString().padStart(2, '0')}`);
    });
    this.bus.on('weapon-acquired', () => this.refreshWeaponRow());
    this.bus.on('weapon-upgraded', () => this.refreshWeaponRow());
    this.bus.on('boss-spawned', (p) => {
      this.bossName.setText(p.name);
      this.bossFill.setScale(1, 1);
      this.bossBar.setVisible(true);
    });
    this.bus.on('boss-hp-changed', (p) => {
      this.bossFill.setScale(Math.max(0.001, p.hp / p.maxHp), 1);
    });
    this.bus.on('boss-died', () => {
      this.bossBar.setVisible(false);
      this.flashScreen(this.bigFlash, 0.45, 300);
    });
    this.bus.on('player-hurt', () => this.flashScreen(this.hurtFlash, 0.22, 220));
    this.bus.on('request-draft', () => this.flashScreen(this.bigFlash, 0.14, 200));
    this.bus.on('request-draft', (p) => this.showDraft(p.draft));
    this.bus.on('game-over', (p) => this.showEnd(false, p));
    this.bus.on('victory', (p) => this.showEnd(true, p));
    this.bus.on('run-saved', (p) => {
      this.pendingUnlocks = p.unlocks;
    });

    this.input.keyboard?.on('keydown-ESC', () => {
      if (this.gameEnded) {
        this.goMenu();
      } else {
        this.togglePause();
      }
    });
    this.input.keyboard?.on('keydown-M', () => this.toggleMute());
    this.input.keyboard?.on('keydown-R', () => {
      if (this.gameEnded) this.restart();
    });
    this.input.keyboard?.on('keydown-ONE', () => this.chooseCard(0));
    this.input.keyboard?.on('keydown-TWO', () => this.chooseCard(1));
    this.input.keyboard?.on('keydown-THREE', () => this.chooseCard(2));

    this.refreshWeaponRow();
    this.setHp(this.run.hp, this.run.stats.maxHp);
    this.setXp(this.run.xp, 5, this.run.level);
    this.goldText.setText(`${this.run.gold}`);
  }

  // ---------- HUD ----------

  private buildHud(): void {
    this.add.rectangle(480, 0, 960, 8, 0x0d1220).setOrigin(0.5, 0);
    this.xpFill = this.add.rectangle(0, 0, 960, 8, 0x64d8e8).setOrigin(0, 0);

    this.add.rectangle(16, 20, 204, 16, 0x3a1216).setOrigin(0, 0);
    this.hpFill = this.add.rectangle(18, 22, 200, 12, 0xc73e3a).setOrigin(0, 0);
    this.hpText = this.add
      .text(16, 40, '', { fontFamily: 'monospace', fontSize: '13px', color: PAPER })
      .setDepth(2);

    this.timerText = this.add
      .text(480, 24, '0:00', {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: PAPER,
        fontStyle: 'bold'
      })
      .setOrigin(0.5, 0);

    this.add.image(872, 30, 'coin').setDepth(1);
    this.goldText = this.add
      .text(944, 22, '0', { fontFamily: 'monospace', fontSize: '18px', color: GOLD })
      .setOrigin(1, 0);

    this.levelText = this.add
      .text(944, 12, 'Nv 1', { fontFamily: 'monospace', fontSize: '11px', color: '#8fa3c7' })
      .setOrigin(1, 1);

    this.weaponRow = this.add.container(16, 496);
  }

  private refreshWeaponRow(): void {
    for (const slot of this.weaponSlots) {
      slot.destroy();
    }
    this.weaponSlots = [];
    this.run.weapons.forEach((weapon, i) => {
      const def = WEAPONS[weapon.id];
      if (!def) return;
      const c = this.add.container(i * 36, 0);
      const bg = this.add.rectangle(0, 0, 30, 30, 0x1a2238).setStrokeStyle(1, 0x4a5a7a);
      const label = this.add
        .text(0, -2, def.name.charAt(0), {
          fontFamily: 'monospace',
          fontSize: '15px',
          color: PAPER
        })
        .setOrigin(0.5, 0.5);
      const lvl = this.add
        .text(0, 10, `${weapon.level}`, {
          fontFamily: 'monospace',
          fontSize: '10px',
          color: GOLD
        })
        .setOrigin(0.5, 0.5);
      c.add([bg, label, lvl]);
      this.weaponRow.add(c);
      this.weaponSlots.push(c);
    });
  }

  private setHp(hp: number, maxHp: number): void {
    const frac = maxHp > 0 ? Phaser.Math.Clamp(hp / maxHp, 0, 1) : 0;
    this.hpFill.setScale(Math.max(0.001, frac), 1);
    this.hpText.setText(`${Math.ceil(hp)} / ${maxHp}`);
  }

  private setXp(xp: number, xpToNext: number, level: number): void {
    const frac = xpToNext > 0 ? Phaser.Math.Clamp(xp / xpToNext, 0, 1) : 0;
    this.xpFill.setScale(Math.max(0.001, frac), 1);
    this.levelText.setText(`Nv ${level}`);
  }

  // ---------- Barra de jefe ----------

  private buildBossBar(): void {
    this.bossBar = this.add.container(0, 0).setVisible(false).setDepth(10);
    this.bossName = this.add
      .text(480, 446, '', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: PAPER,
        fontStyle: 'bold'
      })
      .setOrigin(0.5, 0);
    const bg = this.add.rectangle(480, 468, 404, 14, 0x3a1216).setOrigin(0.5, 0);
    this.bossFill = this.add.rectangle(282, 470, 396, 10, 0xc73e3a).setOrigin(0, 0);
    this.bossBar.add([this.bossName, bg, this.bossFill]);
  }

  // ---------- Draft ----------

  private buildDraftModal(): void {
    this.draftModal = this.add.container(0, 0).setVisible(false).setDepth(100);
    const dim = this.add.rectangle(480, 270, 960, 540, 0x000000, 0.7);
    dim.setInteractive();
    this.draftTitle = this.add
      .text(480, 90, 'Elige una bendición', {
        fontFamily: 'monospace',
        fontSize: '26px',
        color: GOLD,
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    this.draftModal.add([dim, this.draftTitle]);

    for (let i = 0; i < 3; i++) {
      const x = 480 + (i - 1) * 290;
      const card = this.add.container(x, 280);
      const bg = this.add
        .rectangle(0, 0, 260, 300, 0x1a2238)
        .setStrokeStyle(2, 0x4a5a7a)
        .setInteractive({ useHandCursor: true });
      const icon = this.add
        .text(0, -90, '', { fontFamily: 'monospace', fontSize: '48px', color: PAPER })
        .setOrigin(0.5);
      const name = this.add
        .text(0, -20, '', { fontFamily: 'monospace', fontSize: '19px', color: GOLD })
        .setOrigin(0.5);
      const desc = this.add
        .text(0, 30, '', {
          fontFamily: 'monospace',
          fontSize: '13px',
          color: PAPER,
          align: 'center',
          wordWrap: { width: 220 }
        })
        .setOrigin(0.5, 0);
      const hint = this.add
        .text(0, 130, `[${i + 1}]`, { fontFamily: 'monospace', fontSize: '13px', color: '#8fa3c7' })
        .setOrigin(0.5);
      card.add([bg, icon, name, desc, hint]);
      bg.on('pointerover', () => bg.setStrokeStyle(2, GOLD_HEX));
      bg.on('pointerout', () => bg.setStrokeStyle(2, 0x4a5a7a));
      bg.on('pointerdown', () => this.chooseCard(i));
      this.draftModal.add(card);
      this.draftCardTexts.push({ name, desc, icon });
    }
  }

  private showDraft(draft: UpgradeDefLite[]): void {
    this.draftCards = draft;
    this.draftOpen = true;
    draft.forEach((upgrade, i) => {
      const texts = this.draftCardTexts[i];
      if (texts) {
        texts.name.setText(upgrade.name);
        texts.desc.setText(upgrade.desc);
        texts.icon.setText(this.iconFor(upgrade.icon));
      }
    });
    this.draftTitle.setText('神 — Elige una bendición');
    this.draftModal.setVisible(true);
  }

  private iconFor(icon: string): string {
    switch (icon) {
      case 'katana':
        return '刀';
      case 'kunai':
        return '針';
      case 'talisman':
        return '札';
      case 'bo':
        return '棒';
      case 'mask':
        return '鬼';
      case 'kasha':
        return '火';
      case 'raiju':
        return '雷';
      case 'bow':
        return '弓';
      case 'fan':
        return '扇';
      case 'damage':
        return '怒';
      case 'cooldown':
        return '禅';
      case 'area':
        return '圏';
      case 'speed':
        return '風';
      case 'vitality':
        return '体';
      case 'magnet':
        return '磁';
      case 'armor':
        return '鎧';
      case 'luck':
        return '運';
      case 'heal':
        return '癒';
      default:
        if (icon.startsWith('evo-')) return '覚';
        return '★';
    }
  }

  private chooseCard(i: number): void {
    if (!this.draftOpen) return;
    const card = this.draftCards[i];
    if (!card) return;
    this.draftOpen = false;
    this.draftModal.setVisible(false);
    this.bus.emit('draft-choice', { upgradeId: card.id });
  }

  // ---------- Flashes y toast ----------

  private buildFlashes(): void {
    this.hurtFlash = this.add
      .rectangle(480, 270, 960, 540, 0xc73e3a, 0)
      .setDepth(80);
    this.bigFlash = this.add
      .rectangle(480, 270, 960, 540, 0xf5efe0, 0)
      .setDepth(80);
    this.toast = this.add
      .text(944, 60, '', { fontFamily: 'monospace', fontSize: '15px', color: GOLD })
      .setOrigin(1, 0)
      .setDepth(120)
      .setAlpha(0);
  }

  private flashScreen(rect: Phaser.GameObjects.Rectangle, peakAlpha: number, ms: number): void {
    rect.setAlpha(peakAlpha);
    this.tweens.add({
      targets: rect,
      alpha: 0,
      duration: ms,
      ease: 'Cubic.easeOut'
    });
  }

  private showToast(msg: string): void {
    this.toast.setText(msg).setAlpha(1);
    this.toastTween?.remove();
    this.toastTween = this.tweens.add({
      targets: this.toast,
      alpha: 0,
      delay: 900,
      duration: 400
    });
  }

  private toggleMute(): void {
    this.audio?.setMuted(!this.audio.isMuted);
    this.showToast(this.audio?.isMuted ? 'AUDIO OFF' : 'AUDIO ON');
  }

  // ---------- Pausa ----------

  private buildPauseOverlay(): void {
    this.pauseOverlay = this.add.container(0, 0).setVisible(false).setDepth(90);
    const dim = this.add.rectangle(480, 270, 960, 540, 0x000000, 0.6);
    dim.setInteractive();
    const title = this.add
      .text(480, 240, '休 — PAUSA', {
        fontFamily: 'monospace',
        fontSize: '40px',
        color: PAPER,
        fontStyle: 'bold'
      })
      .setOrigin(0.5);
    const hint = this.add
      .text(480, 300, 'Esc continuar · M audio', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#8fa3c7'
      })
      .setOrigin(0.5);
    this.pauseOverlay.add([dim, title, hint]);
  }

  private togglePause(): void {
    if (this.gameEnded || this.draftOpen) return;
    this.paused = !this.paused;
    this.pauseOverlay.setVisible(this.paused);
    if (this.paused) {
      this.scene.pause('game');
    } else {
      this.scene.resume('game');
    }
  }

  // ---------- Fin de partida ----------

  private buildEndOverlay(): void {
    this.endOverlay = this.add.container(0, 0).setVisible(false).setDepth(110);
    const dim = this.add.rectangle(480, 270, 960, 540, 0x000000, 0.78);
    dim.setInteractive();
    this.endTitle = this.add
      .text(480, 130, '', { fontFamily: 'monospace', fontSize: '44px', fontStyle: 'bold' })
      .setOrigin(0.5);
    this.endStats = this.add
      .text(480, 210, '', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: PAPER,
        align: 'center',
        lineSpacing: 7
      })
      .setOrigin(0.5, 0);
    const unlocksText = this.add
      .text(480, 350, '', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: GOLD,
        align: 'center',
        lineSpacing: 6
      })
      .setOrigin(0.5, 0);
    const retry = this.add
      .text(390, 440, '[R] Reintentar', { fontFamily: 'monospace', fontSize: '17px', color: GOLD })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    retry.on('pointerdown', () => this.restart());
    const menu = this.add
      .text(560, 440, '[ESC] Menú', { fontFamily: 'monospace', fontSize: '17px', color: PAPER })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    menu.on('pointerdown', () => this.goMenu());
    this.endOverlay.add([dim, this.endTitle, this.endStats, unlocksText, retry, menu]);
    this.tweens.add({
      targets: retry,
      alpha: 0.25,
      duration: 600,
      yoyo: true,
      repeat: -1
    });
    this.endUnlocksText = unlocksText;
  }

  private endUnlocksText!: Phaser.GameObjects.Text;

  private showEnd(
    victory: boolean,
    stats: { elapsed: number; kills: number; level: number; gold: number }
  ): void {
    this.gameEnded = true;
    const m = Math.floor(stats.elapsed / 60);
    const s = Math.floor(stats.elapsed % 60);
    this.endTitle
      .setText(victory ? '勝 — ¡VICTORIA!' : '死 — HAS CAÍDO')
      .setColor(victory ? GOLD : '#c73e3a');
    this.endStats.setText(
      `Sobreviviste ${m}:${s.toString().padStart(2, '0')}\n` +
        `Yokai eliminados: ${stats.kills}\n` +
        `Nivel alcanzado: ${stats.level}\n` +
        `Oro ganado: ${stats.gold}`
    );
    this.endUnlocksText.setText(
      this.pendingUnlocks.length > 0
        ? `¡Desbloqueado!\n${this.pendingUnlocks.join('\n')}`
        : ''
    );
    this.endOverlay.setVisible(true);
    if (this.paused) {
      this.paused = false;
      this.pauseOverlay.setVisible(false);
      this.scene.resume('game');
    }
  }

  private restart(): void {
    this.scene.stop('game');
    this.scene.start('game');
  }

  private goMenu(): void {
    this.scene.stop('game');
    this.scene.start('menu');
  }
}

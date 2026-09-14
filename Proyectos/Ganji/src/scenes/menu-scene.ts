import Phaser from 'phaser';
import type { AudioManager } from '../systems/audio-manager';
import type { SaveSystem } from '../systems/save-system';
import { addMenuBackground } from '../ui/widgets';

interface MenuItem {
  label: string;
  action: () => void;
  btn: { setFocused(f: boolean): void };
}

export class MenuScene extends Phaser.Scene {
  private items: MenuItem[] = [];
  private selected = 0;
  private audio!: AudioManager;

  constructor() {
    super('menu');
  }

  create(): void {
    this.audio = this.registry.get('audio') as AudioManager;
    const save = this.registry.get('save') as SaveSystem;
    this.items = [];
    this.selected = 0;

    addMenuBackground(this, 'ground-bamboo');

    this.add
      .text(480, 110, '巌 侍', {
        fontFamily: 'monospace',
        fontSize: '30px',
        color: '#c73e3a'
      })
      .setOrigin(0.5);
    this.add
      .text(480, 175, 'G A N J I', {
        fontFamily: 'monospace',
        fontSize: '64px',
        color: '#e8e4d8',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);
    this.add
      .text(480, 225, 'El último ronin · Sobrevive la noche de los yokai', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#8fa3c7'
      })
      .setOrigin(0.5);

    const unlocked = save.get().charsUnlocked.length;
    const maps = save.get().mapsUnlocked.length;
    this.add
      .text(480, 470, `Personajes ${unlocked}/5 · Mapas ${maps}/3 · Oro ${save.get().gold}`, {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#8fa3c7'
      })
      .setOrigin(0.5);
    this.add
      .text(480, 505, 'W/S navegar · ENTER seleccionar · M audio', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#4a5a7a'
      })
      .setOrigin(0.5);

    const play = (): void => {
      this.scene.start('charSelect');
    };
    const shop = (): void => {
      this.scene.start('shop');
    };

    this.items = [
      { label: '  JUGAR  ', action: play, btn: null as never },
      { label: '  TIENDA  ', action: shop, btn: null as never }
    ];

    this.items.forEach((item, i) => {
      const btn = this.addButton(i, 480, 300 + i * 70, item.label, item.action);
      item.btn = btn;
    });

    this.input.keyboard?.on('keydown-W', () => this.move(-1));
    this.input.keyboard?.on('keydown-UP', () => this.move(-1));
    this.input.keyboard?.on('keydown-S', () => this.move(1));
    this.input.keyboard?.on('keydown-DOWN', () => this.move(1));
    this.input.keyboard?.on('keydown-ENTER', () => this.confirm());
    this.input.keyboard?.on('keydown-SPACE', () => this.confirm());
    this.input.keyboard?.on('keydown-M', () => this.toggleMute());

    this.input.once('pointerdown', () => this.audio?.unlock());
    this.input.keyboard?.once('keydown', () => this.audio?.unlock());

    this.refreshFocus();
  }

  private addButton(idx: number, x: number, y: number, label: string, action: () => void): { setFocused(f: boolean): void } {
    const bg = this.add
      .rectangle(x, y, 260, 48, 0x1a2238)
      .setStrokeStyle(2, 0x4a5a7a)
      .setInteractive({ useHandCursor: true });
    const text = this.add
      .text(x, y, label, { fontFamily: 'monospace', fontSize: '22px', color: '#e8e4d8' })
      .setOrigin(0.5);
    bg.on('pointerover', () => {
      this.selected = idx;
      this.refreshFocus();
    });
    bg.on('pointerdown', () => action());
    return {
      setFocused: (f: boolean) => {
        bg.setStrokeStyle(2, f ? 0xe9b44c : 0x4a5a7a);
        text.setColor(f ? '#e9b44c' : '#e8e4d8');
      }
    };
  }

  private move(dir: number): void {
    this.selected = (this.selected + dir + this.items.length) % this.items.length;
    this.refreshFocus();
  }

  private confirm(): void {
    const item = this.items[this.selected];
    item?.action();
  }

  private refreshFocus(): void {
    this.items.forEach((item, i) => item.btn?.setFocused(i === this.selected));
  }

  private toggleMute(): void {
    this.audio?.setMuted(!this.audio.isMuted);
  }
}

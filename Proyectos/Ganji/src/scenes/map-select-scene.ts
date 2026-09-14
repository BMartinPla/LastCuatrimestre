import Phaser from 'phaser';
import { ENEMIES } from '../data/enemies';
import { MAP_SELECT_ORDER, MAPS } from '../data/maps';
import type { SaveSystem } from '../systems/save-system';
import { addMenuBackground } from '../ui/widgets';

interface Card {
  mapId: string;
  setFocused(f: boolean): void;
}

export class MapSelectScene extends Phaser.Scene {
  private cards: Card[] = [];
  private selected = 0;

  constructor() {
    super('mapSelect');
  }

  create(): void {
    addMenuBackground(this, 'ground-bamboo');
    const save = this.registry.get('save') as SaveSystem;
    this.cards = [];
    this.selected = 0;

    this.add
      .text(480, 80, 'Elige el campo de batalla', {
        fontFamily: 'monospace',
        fontSize: '30px',
        color: '#e8e4d8',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);
    this.add
      .text(480, 508, '←/→ o A/D navegar · ENTER jugar · ESC volver', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#4a5a7a'
      })
      .setOrigin(0.5);

    const unlockedMaps = save.get().mapsUnlocked;
    const best = save.get().bestTime;
    const count = MAP_SELECT_ORDER.length;
    const spacing = 260;
    const startX = 480 - ((count - 1) * spacing) / 2;

    MAP_SELECT_ORDER.forEach((mapId, i) => {
      const map = MAPS[mapId];
      if (!map) return;
      const x = startX + i * spacing;
      const unlocked = unlockedMaps.includes(mapId);
      const bg = this.add
        .rectangle(x, 280, 220, 280, unlocked ? 0x1a2238 : 0x10141f)
        .setStrokeStyle(2, 0x4a5a7a)
        .setInteractive({ useHandCursor: true });

      this.add
        .text(x, 170, unlocked ? map.name : '???', {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: unlocked ? '#e9b44c' : '#4a5a7a',
          wordWrap: { width: 190 },
          align: 'center'
        })
        .setOrigin(0.5, 0);

      if (unlocked) {
        const boss = ENEMIES[map.wave.bossEnemyId ?? ''];
        const bestTime = best[mapId] ?? 0;
        const m = Math.floor(bestTime / 60);
        const s = Math.floor(bestTime % 60);
        this.add
          .text(
            x,
            280,
            `Jefe: ${boss?.name ?? '???'}\nMejor tiempo: ${m}:${s.toString().padStart(2, '0')}`,
            {
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#8fa3c7',
              align: 'center',
              lineSpacing: 6
            }
          )
          .setOrigin(0.5, 0);
        bg.on('pointerdown', () => {
          this.selected = i;
          this.refreshFocus();
          this.choose();
        });
        bg.on('pointerover', () => {
          this.selected = i;
          this.refreshFocus();
        });
      } else {
        this.add
          .text(x, 300, '鍵\nSobrevive el mapa\nanterior', {
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#c73e3a',
            align: 'center',
            lineSpacing: 4
          })
          .setOrigin(0.5, 0);
      }

      this.cards.push({
        mapId,
        setFocused: (f: boolean) => {
          bg.setStrokeStyle(2, f ? 0xe9b44c : 0x4a5a7a);
        }
      });
    });

    this.input.keyboard?.on('keydown-LEFT', () => this.move(-1));
    this.input.keyboard?.on('keydown-A', () => this.move(-1));
    this.input.keyboard?.on('keydown-RIGHT', () => this.move(1));
    this.input.keyboard?.on('keydown-D', () => this.move(1));
    this.input.keyboard?.on('keydown-ENTER', () => this.choose());
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('charSelect'));

    this.refreshFocus();
  }

  private move(dir: number): void {
    this.selected = (this.selected + dir + this.cards.length) % this.cards.length;
    this.refreshFocus();
  }

  private choose(): void {
    const card = this.cards[this.selected];
    if (!card) return;
    const save = this.registry.get('save') as SaveSystem;
    if (!save.get().mapsUnlocked.includes(card.mapId)) return;
    const characterId = this.registry.get('selChar') ?? 'ronin';
    this.scene.start('game', { mapId: card.mapId, characterId });
  }

  private refreshFocus(): void {
    this.cards.forEach((c, i) => c.setFocused(i === this.selected));
  }
}

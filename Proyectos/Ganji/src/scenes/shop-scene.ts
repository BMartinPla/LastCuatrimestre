import Phaser from 'phaser';
import { SHOP_ITEMS, shopCost } from '../data/shop';import type { AudioManager } from '../systems/audio-manager';
import type { SaveSystem } from '../systems/save-system';
import { buy } from '../systems/shop-system';
import { addMenuBackground } from '../ui/widgets';

interface ShopCell {
  itemId: string;
  bg: Phaser.GameObjects.Rectangle;
  costText: Phaser.GameObjects.Text;
  pipsText: Phaser.GameObjects.Text;
  setFocused(f: boolean): void;
  refresh(): void;
}

export class ShopScene extends Phaser.Scene {
  private cells: ShopCell[] = [];
  private selected = 0;
  private goldText!: Phaser.GameObjects.Text;
  private save!: SaveSystem;
  private audio!: AudioManager;

  constructor() {
    super('shop');
  }

  create(): void {
    this.save = this.registry.get('save') as SaveSystem;
    this.audio = this.registry.get('audio') as AudioManager;
    this.cells = [];
    this.selected = 0;

    addMenuBackground(this, 'ground-temple');

    this.add
      .text(480, 46, 'Tienda del Mercader', {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#e8e4d8',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);
    this.add.image(700, 46, 'coin').setScale(1.4);
    this.goldText = this.add
      .text(716, 46, `${this.save.get().gold}`, {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#e9b44c'
      })
      .setOrigin(0, 0.5);
    this.add
      .text(480, 508, 'Navega con flechas · ENTER compra · ESC volver', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#4a5a7a'
      })
      .setOrigin(0.5);

    const ids = Object.keys(SHOP_ITEMS);
    const cols = 4;
    const cellW = 225;
    const cellH = 118;
    const startX = 480 - ((cols - 1) * cellW) / 2;
    const startY = 150;

    ids.forEach((itemId, i) => {
      const item = SHOP_ITEMS[itemId];
      if (!item) return;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * cellW;
      const y = startY + row * (cellH + 12);

      const bg = this.add
        .rectangle(x, y, cellW - 10, cellH, 0x1a2238)
        .setStrokeStyle(2, 0x4a5a7a)
        .setInteractive({ useHandCursor: true });

      const icon = this.add
        .text(x - (cellW - 10) / 2 + 22, y, item.icon, {
          fontFamily: 'monospace',
          fontSize: '26px',
          color: '#c73e3a'
        })
        .setOrigin(0.5);
      void icon;

      const nameText = this.add
        .text(x - (cellW - 10) / 2 + 44, y - 30, item.name, {
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#e8e4d8'
        })
        .setOrigin(0, 0.5);

      this.add
        .text(x - (cellW - 10) / 2 + 12, y - 8, item.desc, {
          fontFamily: 'monospace',
          fontSize: '10px',
          color: '#8fa3c7',
          wordWrap: { width: cellW - 34 },
          lineSpacing: 2
        })
        .setOrigin(0, 0);

      const pipsText = this.add
        .text(x - (cellW - 10) / 2 + 12, y + cellH / 2 - 22, '', {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#e9b44c'
        })
        .setOrigin(0, 0.5);

      const costText = this.add
        .text(x + (cellW - 10) / 2 - 12, y + cellH / 2 - 22, '', {
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#e9b44c'
        })
        .setOrigin(1, 0.5);

      const cell: ShopCell = {
        itemId,
        bg,
        costText,
        pipsText,
        setFocused: (f: boolean) => {
          bg.setStrokeStyle(2, f ? 0xe9b44c : 0x4a5a7a);
        },
        refresh: () => {
          const shop = this.save.get().shop;
          const level = shop[itemId] ?? 0;
          const maxed = level >= item.maxLevel;
          const cost = shopCost(item, level);
          pipsText.setText('●'.repeat(level) + '○'.repeat(item.maxLevel - level));
          costText.setText(maxed ? 'MÁX' : `${cost}mon`);
          costText.setColor(maxed ? '#4a5a7a' : '#e9b44c');
          nameText.setColor('#e8e4d8');
        }
      };

      bg.on('pointerover', () => {
        this.selected = i;
        this.refreshFocus();
      });
      bg.on('pointerdown', () => {
        this.selected = i;
        this.refreshFocus();
        this.buySelected();
      });

      this.cells.push(cell);
      cell.refresh();
    });

    this.input.keyboard?.on('keydown-LEFT', () => this.move(-1, 0));
    this.input.keyboard?.on('keydown-A', () => this.move(-1, 0));
    this.input.keyboard?.on('keydown-RIGHT', () => this.move(1, 0));
    this.input.keyboard?.on('keydown-D', () => this.move(1, 0));
    this.input.keyboard?.on('keydown-UP', () => this.move(0, -1));
    this.input.keyboard?.on('keydown-W', () => this.move(0, -1));
    this.input.keyboard?.on('keydown-DOWN', () => this.move(0, 1));
    this.input.keyboard?.on('keydown-S', () => this.move(0, 1));
    this.input.keyboard?.on('keydown-ENTER', () => this.buySelected());
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('menu'));

    this.refreshFocus();
  }

  private move(dx: number, dy: number): void {
    const cols = 4;
    const count = this.cells.length;
    let idx = this.selected;
    if (dx !== 0) idx = (idx + dx + count) % count;
    if (dy !== 0) idx = (idx + dy * cols + count) % count;
    this.selected = idx;
    this.refreshFocus();
  }

  private buySelected(): void {
    const cell = this.cells[this.selected];
    if (!cell) return;
    const ok = buy(this.save, cell.itemId);
    if (ok) {
      this.audio?.unlock();
      this.audio?.play('coin');
    } else {
      this.audio?.play('hit');
    }
    this.goldText.setText(`${this.save.get().gold}`);
    for (const c of this.cells) {
      c.refresh();
    }
  }

  private refreshFocus(): void {
    this.cells.forEach((c, i) => c.setFocused(i === this.selected));
  }
}

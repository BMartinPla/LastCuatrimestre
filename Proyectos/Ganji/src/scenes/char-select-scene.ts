import Phaser from 'phaser';
import { CHARACTER_SELECT_ORDER, CHARACTERS } from '../data/characters';
import { WEAPONS } from '../data/weapons';
import { CHARACTER_UNLOCKS, type SaveSystem } from '../systems/save-system';
import { addMenuBackground } from '../ui/widgets';

interface Card {
  charId: string;
  bg: Phaser.GameObjects.Rectangle;
  setFocused(f: boolean): void;
}

export class CharacterSelectScene extends Phaser.Scene {
  private cards: Card[] = [];
  private selected = 0;

  constructor() {
    super('charSelect');
  }

  create(): void {
    addMenuBackground(this, 'ground-temple');
    const save = this.registry.get('save') as SaveSystem;
    this.cards = [];
    this.selected = 0;

    this.add
      .text(480, 60, 'Elige tu guerrero', {
        fontFamily: 'monospace',
        fontSize: '30px',
        color: '#e8e4d8',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);
    this.add
      .text(480, 508, '←/→ o A/D navegar · ENTER elegir · ESC volver', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#4a5a7a'
      })
      .setOrigin(0.5);

    const unlockedChars = save.get().charsUnlocked;
    const count = CHARACTER_SELECT_ORDER.length;
    const spacing = 180;
    const startX = 480 - ((count - 1) * spacing) / 2;

    CHARACTER_SELECT_ORDER.forEach((charId, i) => {
      const char = CHARACTERS[charId];
      if (!char) return;
      const x = startX + i * spacing;
      const unlocked = unlockedChars.includes(charId);
      const bg = this.add
        .rectangle(x, 280, 150, 300, unlocked ? 0x1a2238 : 0x10141f)
        .setStrokeStyle(2, 0x4a5a7a)
        .setInteractive({ useHandCursor: true });

      const sprite = this.add.image(x, 190, char.textureKey).setScale(unlocked ? 3 : 2.2);
      if (!unlocked) {
        sprite.setAlpha(0.25);
      }

      const nameText = this.add
        .text(x, 250, unlocked ? char.name : '???', {
          fontFamily: 'monospace',
          fontSize: '17px',
          color: unlocked ? '#e9b44c' : '#4a5a7a'
        })
        .setOrigin(0.5);

      this.add
        .text(
          x,
          300,
          `Vida ${char.hp}\nVel ${char.speed}\n${WEAPONS[char.startingWeaponId]?.name ?? ''}`,
          {
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#8fa3c7',
            align: 'center',
            lineSpacing: 4
          }
        )
        .setOrigin(0.5, 0);

      if (!unlocked) {
        const req = CHARACTER_UNLOCKS[charId];
        this.add
          .text(x, 400, `鍵\n${req?.requirementText ?? ''}`, {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#c73e3a',
            align: 'center',
            wordWrap: { width: 130 },
            lineSpacing: 4
          })
          .setOrigin(0.5, 0);
      } else {
        bg.on('pointerdown', () => {
          this.selected = i;
          this.refreshFocus();
          this.choose();
        });
        bg.on('pointerover', () => {
          this.selected = i;
          this.refreshFocus();
        });
      }

      this.cards.push({
        charId,
        bg,
        setFocused: (f: boolean) => {
          bg.setStrokeStyle(2, f ? 0xe9b44c : 0x4a5a7a);
          nameText.setColor(f && unlocked ? '#e9b44c' : unlocked ? '#e9b44c' : '#4a5a7a');
        }
      });
    });

    this.input.keyboard?.on('keydown-LEFT', () => this.move(-1));
    this.input.keyboard?.on('keydown-A', () => this.move(-1));
    this.input.keyboard?.on('keydown-RIGHT', () => this.move(1));
    this.input.keyboard?.on('keydown-D', () => this.move(1));
    this.input.keyboard?.on('keydown-ENTER', () => this.choose());
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('menu'));

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
    if (!save.get().charsUnlocked.includes(card.charId)) return;
    this.registry.set('selChar', card.charId);
    this.scene.start('mapSelect');
  }

  private refreshFocus(): void {
    this.cards.forEach((c, i) => c.setFocused(i === this.selected));
  }
}

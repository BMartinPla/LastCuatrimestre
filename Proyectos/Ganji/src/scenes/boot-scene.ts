import Phaser from 'phaser';
import { AudioManager } from '../systems/audio-manager';
import { SaveSystem } from '../systems/save-system';
import { CHARACTER_MAPS } from '../art/characters';
import { ENEMY_MAPS } from '../art/enemies';
import { paintPixelMap } from '../art/palette';

/**
 * Escena de arranque: singletons (guardado + audio) y texturas — pixel art
 * autoría propia (mapas de píxeles) para personajes/yokai, procedural para
 * FX y suelos. Paleta ukiyo-e.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create(): void {
    if (!this.registry.get('save')) {
      const save = new SaveSystem();
      const audio = new AudioManager();
      audio.setMuted(save.get().muted);
      this.registry.set('save', save);
      this.registry.set('audio', audio);
    }
    this.generateTextures();
    this.scene.start('menu');
  }

  private makeTex(
    key: string,
    w: number,
    h: number,
    draw: (g: Phaser.GameObjects.Graphics) => void
  ): void {
    if (this.textures.exists(key)) return;
    const g = this.add.graphics();
    draw(g);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  private lcg(seed: number): () => number {
    let s = seed;
    return () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
  }

  private generateTextures(): void {
    // --- Pixel art autoría propia (personajes + yokai) ---
    for (const [key, map] of Object.entries(CHARACTER_MAPS)) {
      paintPixelMap(this, key, map);
    }
    for (const [key, map] of Object.entries(ENEMY_MAPS)) {
      paintPixelMap(this, key, map);
    }

    const INK = 0x131a2c;
    const PAPER = 0xe8e4d8;

    // ---- Suelo: bambú nocturno ----
    this.makeTex('ground-bamboo', 256, 256, (g) => {
      g.fillStyle(INK);
      g.fillRect(0, 0, 256, 256);
      const rnd = this.lcg(1234);
      for (let x = 8; x < 256; x += 34) {
        const w = 8 + Math.floor(rnd() * 5);
        g.fillStyle(0x1a2438, 1);
        g.fillRect(x, 0, w, 256);
        g.fillStyle(0x0d1220, 1);
        for (let y = 12; y < 256; y += 52) {
          g.fillRect(x - 1, y + Math.floor(rnd() * 8), w + 2, 3);
        }
      }
      g.fillStyle(0x223048, 0.5);
      for (let i = 0; i < 60; i++) {
        g.fillRect(Math.floor(rnd() * 256), Math.floor(rnd() * 256), 2, 2);
      }
    });

    // ---- Ronin ----
    this.makeTex('ronin', 20, 26, (g) => {
      g.fillStyle(0x26314f);
      g.fillRect(6, 11, 8, 10);
      g.fillStyle(0xc73e3a);
      g.fillRect(6, 15, 8, 2);
      g.fillStyle(0xe8c39e);
      g.fillCircle(10, 7, 5);
      g.fillStyle(0x11151f);
      g.fillRect(4, 3, 12, 3);
      g.fillStyle(0x11151f);
      g.fillRect(7, 21, 2, 4);
      g.fillRect(11, 21, 2, 4);
      g.fillStyle(0xb9c0c9);
      g.fillRect(15, 4, 2, 8);
      g.fillStyle(0x4a3b2a);
      g.fillRect(14, 11, 4, 2);
    });

    // ---- Kunoichi ----
    this.makeTex('kunoichi', 20, 26, (g) => {
      g.fillStyle(0x4a3b6b);
      g.fillRect(6, 11, 8, 10);
      g.fillStyle(0xb04a7a);
      g.fillRect(6, 15, 8, 2);
      g.fillStyle(0xe8c39e);
      g.fillRect(6, 4, 8, 5);
      g.fillStyle(0x4a3b6b);
      g.fillRect(4, 2, 12, 4);
      g.fillStyle(0x11151f);
      g.fillRect(8, 6, 1.5, 1.5);
      g.fillRect(11, 6, 1.5, 1.5);
      g.fillStyle(0x2b2240);
      g.fillRect(7, 21, 2, 4);
      g.fillRect(11, 21, 2, 4);
    });

    // ---- Sohei ----
    this.makeTex('sohei', 22, 28, (g) => {
      g.fillStyle(0x8f6a3a);
      g.fillRect(6, 12, 10, 11);
      g.fillStyle(0xd9a441);
      g.fillRect(6, 12, 10, 3);
      g.fillStyle(0xe8c39e);
      g.fillCircle(11, 8, 5);
      g.fillStyle(0x3a2b1a);
      g.fillRect(6, 2, 10, 4);
      g.fillStyle(0x11151f);
      g.fillRect(8, 23, 2, 4);
      g.fillRect(12, 23, 2, 4);
      g.fillStyle(0x6b4a2a);
      g.fillRect(16, 6, 2, 18);
      g.fillStyle(0xe9b44c);
      g.fillRect(15, 4, 4, 3);
    });

    // ---- Onmyoji ----
    this.makeTex('onmyoji', 20, 26, (g) => {
      g.fillStyle(0xe8e4d8);
      g.fillRect(6, 11, 8, 11);
      g.fillStyle(0xc73e3a);
      g.fillRect(6, 15, 8, 2);
      g.fillStyle(0xe8c39e);
      g.fillCircle(10, 8, 4.5);
      g.fillStyle(0x4a5a7a);
      g.fillTriangle(3, 8, 17, 8, 10, 1);
      g.fillStyle(0x11151f);
      g.fillRect(7, 22, 2, 3);
      g.fillRect(11, 22, 2, 3);
      g.fillStyle(0xe9b44c);
      g.fillRect(15, 10, 2, 12);
    });

    // ---- Kensei ----
    this.makeTex('kensei', 20, 26, (g) => {
      g.fillStyle(0xe8e4d8);
      g.fillRect(6, 11, 8, 10);
      g.fillStyle(0x64a8d8);
      g.fillRect(6, 15, 8, 2);
      g.fillStyle(0xe8c39e);
      g.fillCircle(10, 7, 5);
      g.fillStyle(0x64a8d8);
      g.fillRect(4, 2, 12, 4);
      g.fillStyle(0x11151f);
      g.fillRect(7, 21, 2, 4);
      g.fillRect(11, 21, 2, 4);
      g.fillStyle(0xd8dee8);
      g.fillRect(16, 3, 2, 9);
      g.fillStyle(0xe9b44c);
      g.fillRect(14, 11, 5, 2);
    });

    // ---- Armas nuevas ----
    this.makeTex('bo', 8, 34, (g) => {
      g.fillStyle(0x6b4a2a);
      g.fillRect(3, 2, 3, 30);
      g.fillStyle(0xe9b44c);
      g.fillRect(2, 0, 5, 4);
      g.fillRect(2, 30, 5, 4);
    });

    this.makeTex('mask', 20, 20, (g) => {
      g.fillStyle(0xc73e3a);
      g.fillCircle(10, 11, 7);
      g.fillStyle(0xe9e2d0);
      g.fillTriangle(3, 8, 6, 1, 8, 7);
      g.fillTriangle(12, 7, 14, 1, 17, 8);
      g.fillStyle(0x11151f);
      g.fillCircle(7, 9, 1.8);
      g.fillCircle(13, 9, 1.8);
      g.fillStyle(0xe9e2d0);
      g.fillRect(8, 15, 4, 2);
    });

    this.makeTex('flame', 14, 14, (g) => {
      g.fillStyle(0xd95f2b, 0.9);
      g.fillCircle(7, 8, 6);
      g.fillStyle(0xe9b44c, 1);
      g.fillCircle(7, 7, 3.5);
      g.fillStyle(0xf5efe0, 0.9);
      g.fillCircle(7, 6, 1.5);
    });

    this.makeTex('bolt', 12, 42, (g) => {
      g.fillStyle(0xf5f0c8, 1);
      g.fillRect(5, 0, 3, 12);
      g.fillRect(2, 12, 3, 10);
      g.fillRect(7, 22, 3, 10);
      g.fillRect(4, 32, 3, 10);
    });

    this.makeTex('arrow', 24, 6, (g) => {
      g.fillStyle(0xb9c0c9);
      g.fillTriangle(0, 0, 0, 6, 8, 3);
      g.fillStyle(0x6b4a2a);
      g.fillRect(8, 2.5, 14, 1.5);
      g.fillStyle(0xe9e2d0);
      g.fillRect(20, 1, 3, 4);
    });

    this.makeTex('fan', 44, 44, (g) => {
      g.fillStyle(0x64a8d8, 0.75);
      g.beginPath();
      g.moveTo(22, 36);
      g.arc(22, 36, 30, -2.2, -0.9);
      g.closePath();
      g.fillPath();
      g.fillStyle(0xe8e4d8, 0.6);
      g.beginPath();
      g.moveTo(22, 36);
      g.arc(22, 36, 26, -2, -1.1);
      g.closePath();
      g.fillPath();
    });

    this.makeTex('ice-shard', 10, 16, (g) => {
      g.fillStyle(0xbfe8f5, 0.95);
      g.fillTriangle(5, 0, 1, 8, 9, 8);
      g.fillTriangle(1, 8, 9, 8, 5, 15);
      g.fillStyle(0x8fd0e8, 0.9);
      g.fillRect(4, 6, 2, 5);
    });

    // ---- Kodama ----
    this.makeTex('kodama', 18, 18, (g) => {
      g.fillStyle(0x7fb069);
      g.fillCircle(9, 10, 7);
      g.fillStyle(0x5d8f4a);
      g.fillCircle(9, 3, 3);
      g.fillStyle(0x11151f);
      g.fillCircle(6, 9, 1.4);
      g.fillCircle(12, 9, 1.4);
      g.fillStyle(0x2f4a2a);
      g.fillRect(7, 13, 4, 1.5);
    });

    // ---- Oni ----
    this.makeTex('oni', 22, 24, (g) => {
      g.fillStyle(0xe9e2d0);
      g.fillTriangle(6, 6, 9, 2, 11, 6);
      g.fillTriangle(11, 6, 13, 2, 16, 6);
      g.fillStyle(0xb5443c);
      g.fillRect(5, 6, 12, 13);
      g.fillStyle(0xf5d76e);
      g.fillCircle(8, 10, 1.6);
      g.fillCircle(14, 10, 1.6);
      g.fillStyle(0x4a3b2a);
      g.fillRect(5, 15, 12, 4);
      g.fillStyle(0x8f3b34);
      g.fillRect(7, 19, 3, 4);
      g.fillRect(12, 19, 3, 4);
    });

    // ---- Kappa ----
    this.makeTex('kappa', 20, 20, (g) => {
      g.fillStyle(0x5a7d9a);
      g.fillRect(6, 1, 8, 3);
      g.fillStyle(0x4f9d74);
      g.fillCircle(10, 7, 5);
      g.fillRect(4, 9, 12, 8);
      g.fillStyle(0xf5d76e);
      g.fillCircle(8, 7, 1.4);
      g.fillCircle(12, 7, 1.4);
      g.fillStyle(0x2f5d44);
      g.fillRect(5, 17, 4, 2);
      g.fillRect(11, 17, 4, 2);
    });

    // ---- Tengu ----
    this.makeTex('tengu', 22, 22, (g) => {
      g.fillStyle(0x1d2438);
      g.fillTriangle(2, 8, 8, 12, 3, 15);
      g.fillTriangle(20, 8, 14, 12, 19, 15);
      g.fillStyle(0xc73e3a);
      g.fillCircle(11, 8, 6);
      g.fillStyle(0xe0b089);
      g.fillRect(10, 8, 2, 6);
      g.fillStyle(0x11151f);
      g.fillCircle(8.5, 6, 1.3);
      g.fillCircle(13.5, 6, 1.3);
      g.fillStyle(0x26314f);
      g.fillRect(7, 14, 8, 7);
    });

    // ---- Oni Bruto ----
    this.makeTex('brute', 30, 30, (g) => {
      g.fillStyle(0xe9e2d0);
      g.fillTriangle(7, 8, 11, 1, 14, 7);
      g.fillTriangle(16, 7, 19, 1, 23, 8);
      g.fillStyle(0x8f3b34);
      g.fillRect(6, 7, 18, 20);
      g.fillStyle(0xc9a27a);
      g.fillRect(10, 15, 10, 8);
      g.fillStyle(0xf5d76e);
      g.fillCircle(11, 11, 2);
      g.fillCircle(19, 11, 2);
      g.fillStyle(0x11151f);
      g.fillRect(9, 10, 4, 1.6);
      g.fillRect(17, 10, 4, 1.6);
      g.fillStyle(0x4a3b2a);
      g.fillRect(6, 22, 18, 5);
    });

    // ---- Oni Élite ----
    this.makeTex('elite', 34, 36, (g) => {
      g.fillStyle(0xe9e2d0);
      g.fillTriangle(7, 8, 11, 0, 15, 7);
      g.fillTriangle(19, 7, 23, 0, 27, 8);
      g.fillStyle(0xa03028);
      g.fillRect(5, 7, 24, 25);
      g.fillStyle(0xe9b44c);
      g.fillRect(5, 13, 24, 4);
      g.fillRect(9, 21, 16, 3);
      g.fillStyle(0xf5d76e);
      g.fillCircle(12, 10, 2.4);
      g.fillCircle(22, 10, 2.4);
      g.fillStyle(0x11151f);
      g.fillRect(9, 9, 5, 2);
      g.fillRect(20, 9, 5, 2);
      g.fillStyle(0xe9b44c);
      g.fillRect(14, 28, 6, 2);
    });

    // ---- Gashadokuro (jefe) ----
    this.makeTex('gashadokuro', 48, 56, (g) => {
      g.fillStyle(PAPER);
      g.fillRect(12, 2, 24, 20);
      g.fillRect(16, 22, 16, 6);
      g.fillStyle(0x11151f);
      g.fillCircle(19, 11, 4.5);
      g.fillCircle(29, 11, 4.5);
      g.fillTriangle(19, 19, 24, 14, 29, 19);
      for (let i = 0; i < 4; i++) {
        g.fillStyle(0x11151f);
        g.fillRect(18 + i * 4, 23, 2, 4);
      }
      g.fillStyle(PAPER);
      g.fillRect(22, 28, 4, 24);
      g.fillRect(10, 32, 12, 3);
      g.fillRect(26, 32, 12, 3);
      g.fillRect(6, 30, 4, 12);
      g.fillRect(38, 30, 4, 12);
    });

    // ---- Enemigos nuevos ----
    this.makeTex('hitodama', 14, 16, (g) => {
      g.fillStyle(0x64d8e8, 0.75);
      g.fillCircle(7, 8, 5.5);
      g.fillTriangle(4, 11, 7, 16, 10, 11);
      g.fillStyle(0xb8f4fa, 1);
      g.fillCircle(7, 7, 2.5);
      g.fillStyle(0x11151f);
      g.fillRect(5, 6, 1.5, 1.5);
      g.fillRect(8, 6, 1.5, 1.5);
    });

    this.makeTex('karasu', 22, 18, (g) => {
      g.fillStyle(0x11151f);
      g.fillEllipse(11, 9, 16, 9);
      g.fillCircle(17, 6, 4);
      g.fillTriangle(20, 6, 24, 7, 20, 9);
      g.fillStyle(0x1d2438);
      g.fillTriangle(6, 8, 0, 2, 9, 5);
      g.fillStyle(0xc73e3a);
      g.fillCircle(18, 5, 1);
    });

    this.makeTex('jorogumo', 26, 22, (g) => {
      g.fillStyle(0x2b2240);
      for (let i = 0; i < 4; i++) {
        g.fillTriangle(13, 10, 2 + i * 3, 2 + i, 5 + i * 4, 12);
        g.fillTriangle(13, 12, 2 + i * 3, 20 - i, 5 + i * 4, 10);
      }
      g.fillStyle(0x4a3b6b);
      g.fillCircle(13, 11, 6);
      g.fillStyle(0xc73e3a);
      g.fillCircle(11, 9, 1.5);
      g.fillCircle(15, 9, 1.5);
    });

    this.makeTex('kodama_elder', 24, 24, (g) => {
      g.fillStyle(0x5d8f4a);
      g.fillCircle(12, 13, 9);
      g.fillStyle(0x4a7a3a);
      g.fillCircle(12, 4, 4);
      g.fillStyle(0xe8e4d8);
      g.fillCircle(9, 12, 1.8);
      g.fillCircle(15, 12, 1.8);
      g.fillStyle(0x2f4a2a);
      g.fillRect(8, 17, 8, 2);
      g.fillStyle(0x3a5a30);
      g.fillRect(4, 6, 4, 3);
    });

    this.makeTex('nurikabe', 36, 34, (g) => {
      g.fillStyle(0x4a5a58);
      g.fillRect(4, 4, 28, 28);
      g.fillStyle(0x5d706e);
      g.fillRect(8, 8, 20, 12);
      g.fillStyle(0x11151f);
      g.fillCircle(13, 22, 2.5);
      g.fillCircle(23, 22, 2.5);
      g.fillStyle(0x8fa3a0);
      g.fillRect(4, 28, 28, 4);
    });

    this.makeTex('yuki_onna', 20, 26, (g) => {
      g.fillStyle(0xe8f0f8);
      g.fillRect(6, 11, 8, 12);
      g.fillStyle(0xbfe8f5);
      g.fillRect(6, 15, 8, 3);
      g.fillStyle(0xe8c39e);
      g.fillCircle(10, 7, 4.5);
      g.fillStyle(0x8fd0e8);
      g.fillRect(5, 2, 10, 4);
      g.fillStyle(0x11151f);
      g.fillRect(8, 6, 1.5, 1.5);
      g.fillRect(11, 6, 1.5, 1.5);
      g.fillStyle(0xbfe8f5, 0.7);
      g.fillTriangle(2, 11, 6, 6, 6, 13);
      g.fillTriangle(18, 11, 14, 6, 14, 13);
    });

    this.makeTex('warlord', 30, 32, (g) => {
      g.fillStyle(0xe9e2d0);
      g.fillTriangle(8, 8, 12, 0, 16, 8);
      g.fillTriangle(14, 8, 18, 0, 22, 8);
      g.fillStyle(0x7a1f1f);
      g.fillRect(6, 7, 18, 22);
      g.fillStyle(0xe9b44c);
      g.fillRect(6, 14, 18, 4);
      g.fillRect(10, 24, 10, 3);
      g.fillStyle(0xf5d76e);
      g.fillCircle(12, 11, 2.2);
      g.fillCircle(18, 11, 2.2);
      g.fillStyle(0x11151f);
      g.fillRect(9, 10, 5, 2);
      g.fillRect(16, 10, 5, 2);
    });

    this.makeTex('karakasa', 30, 34, (g) => {
      g.fillStyle(0xc73e3a);
      g.beginPath();
      g.arc(15, 14, 13, Math.PI, 0);
      g.closePath();
      g.fillPath();
      g.fillStyle(0xe9e2d0);
      for (let i = 0; i < 4; i++) {
        g.fillRect(3 + i * 7, 14, 2, 4);
      }
      g.fillStyle(0x4a3b2a);
      g.fillRect(14, 14, 2, 16);
      g.fillStyle(0xf5d76e);
      g.fillCircle(12, 10, 2);
      g.fillStyle(0x11151f);
      g.fillCircle(12, 10, 1);
      g.fillStyle(0x11151f);
      g.fillRect(9, 4, 2, 3);
      g.fillRect(14, 4, 2, 3);
    });

    this.makeTex('orochi', 56, 60, (g) => {
      g.fillStyle(0x2f5d44);
      g.fillRect(24, 18, 8, 38);
      for (let i = 0; i < 3; i++) {
        const hx = 10 + i * 18;
        g.fillStyle(0x3f7d5c);
        g.fillEllipse(hx, 12, 14, 18);
        g.fillStyle(0xf5d76e);
        g.fillCircle(hx - 3, 8, 2);
        g.fillCircle(hx + 3, 8, 2);
        g.fillStyle(0xc73e3a);
        g.fillRect(hx - 1, 16, 2, 6);
        g.fillStyle(0x11151f);
        g.fillRect(hx - 4, 7, 3, 2);
        g.fillRect(hx + 1, 7, 3, 2);
      }
    });

    // ---- Suelos ----
    this.makeTex('ground-temple', 256, 256, (g) => {
      g.fillStyle(0x2b2036);
      g.fillRect(0, 0, 256, 256);
      const rnd = this.lcg(777);
      for (let y = 0; y < 256; y += 32) {
        for (let x = 0; x < 256; x += 64) {
          const offset = (y / 32) % 2 === 0 ? 0 : 32;
          g.fillStyle(0x382a44, 0.9);
          g.fillRect(x + offset + 1, y + 1, 62, 30);
          g.fillStyle(0x241a2e, 0.8);
          g.fillRect(x + offset + 1, y + 28, 62, 3);
        }
      }
      g.fillStyle(0x4a3b5a, 0.5);
      for (let i = 0; i < 40; i++) {
        g.fillRect(Math.floor(rnd() * 256), Math.floor(rnd() * 256), 2, 2);
      }
    });

    this.makeTex('ground-frozen', 256, 256, (g) => {
      g.fillStyle(0x1d2b3e);
      g.fillRect(0, 0, 256, 256);
      const rnd = this.lcg(4242);
      for (let i = 0; i < 26; i++) {
        const x = rnd() * 256;
        const y = rnd() * 256;
        g.fillStyle(0x2a3d55, 0.8);
        g.fillTriangle(x, y, x + 30 + rnd() * 20, y + 8, x + 12, y + 22 + rnd() * 14);
        g.fillStyle(0xbfe8f5, 0.25);
        g.fillRect(x + 8, y + 6, 18, 2);
      }
      g.fillStyle(0x3a5a7a, 0.5);
      for (let i = 0; i < 50; i++) {
        g.fillRect(Math.floor(rnd() * 256), Math.floor(rnd() * 256), 2, 2);
      }
    });

    // ---- Proyectiles ----
    this.makeTex('kunai', 14, 8, (g) => {
      g.fillStyle(0xb9c0c9);
      g.fillTriangle(0, 0, 0, 8, 10, 4);
      g.fillStyle(0x4a3b2a);
      g.fillRect(10, 3, 4, 2);
    });

    this.makeTex('talisman', 10, 14, (g) => {
      g.fillStyle(PAPER);
      g.fillRect(1, 1, 8, 12);
      g.fillStyle(0xc73e3a);
      g.fillRect(1, 5, 8, 3);
      g.fillStyle(0x11151f);
      g.fillRect(4, 2, 2, 1.5);
    });

    this.makeTex('slash', 72, 72, (g) => {
      g.lineStyle(10, 0xf5efe0, 0.35);
      g.beginPath();
      g.arc(36, 36, 26, -0.85, 0.85);
      g.strokePath();
      g.lineStyle(6, 0xf5efe0, 0.9);
      g.beginPath();
      g.arc(36, 36, 26, -0.75, 0.75);
      g.strokePath();
    });

    // ---- Pickups ----
    this.makeTex('xp-spirit', 12, 12, (g) => {
      g.fillStyle(0x64d8e8, 0.35);
      g.fillCircle(6, 6, 6);
      g.fillStyle(0xb8f4fa, 1);
      g.fillCircle(6, 6, 3);
    });

    this.makeTex('coin', 12, 12, (g) => {
      g.fillStyle(0xb5862e);
      g.fillCircle(6, 6, 6);
      g.fillStyle(0xe9b44c);
      g.fillCircle(6, 6, 5);
      g.fillStyle(0x8f6a1e);
      g.fillRect(4.5, 4.5, 3, 3);
    });

    // ---- FX ----
    this.makeTex('spark', 5, 5, (g) => {
      g.fillStyle(0xffffff, 1);
      g.fillCircle(2.5, 2.5, 2.5);
    });

    this.makeTex('aura', 64, 64, (g) => {
      g.lineStyle(4, 0xc73e3a, 0.55);
      g.strokeCircle(32, 32, 28);
    });
  }
}

/**
 * Paleta ukiyo-e compartida y contrato del pintor de píxeles.
 */
export interface PhaserSceneLike {
  textures: {
    exists(key: string): boolean;
    createCanvas(
      key: string,
      width: number,
      height: number
    ): Phaser.Textures.CanvasTexture | null;
  };
}

export const PALETTE: Record<string, number> = {
  K: 0x10141f, // tinta (outline)
  D: 0x1d2438, // navy oscuro
  B: 0x26314f, // indigo base
  L: 0x3a4a6e, // indigo claro
  W: 0xe8e4d8, // papel
  E: 0xe8c39e, // piel
  S: 0xc9a27a, // piel sombra
  R: 0xc73e3a, // rojo
  r: 0x8f2b28, // rojo oscuro
  G: 0xe9b44c, // dorado
  g: 0xb5862e, // dorado oscuro
  N: 0x6b4a2a, // marrón
  n: 0x8f6a3a, // marrón claro
  P: 0x4a3b6b, // púrpura
  p: 0x2b2240, // púrpura oscuro
  F: 0x64a8d8, // azul
  f: 0x2a5a8c, // azul oscuro
  V: 0x7fb069, // verde
  v: 0x5d8f4a, // verde oscuro
  C: 0x64d8e8, // cian
  c: 0xb8f4fa, // cian pálido
  T: 0x3a7d8c, // teal
  O: 0xd95f2b, // naranja
  Y: 0xf5d76e, // amarillo
  A: 0x8fa3a0, // gris
  a: 0x4a5a58, // gris oscuro
  M: 0xe8a7b8, // rosa
  I: 0xbfe8f5, // hielo
  i: 0x8fd0e8, // hielo sombra
  X: 0x1d2438  // casi tinta
};

export interface PhaserSceneLike {
  textures: {
    exists(key: string): boolean;
    createCanvas(key: string, w: number, h: number): Phaser.Textures.CanvasTexture | null;
  };
}

/**
 * Pinta un mapa de píxeles como textura canvas con outline automático de
 * tinta alrededor de la silueta. Filas cortas se rellenan con transparencia.
 */
export function paintPixelMap(
  scene: PhaserSceneLike,
  key: string,
  rows: string[],
  extraPalette?: Record<string, number>
): void {
  if (scene.textures.exists(key)) return;
  if (rows.length === 0) return;

  const palette: Record<string, number> = { ...PALETTE, ...extraPalette };
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));

  const grid: (number | null)[][] = [];
  for (let y = 0; y < h; y++) {
    const row: (number | null)[] = [];
    const src = rows[y] ?? '';
    for (let x = 0; x < w; x++) {
      const ch: string = src.charAt(x) ?? '.';
      row.push(!ch || ch === '.' || ch === ' ' ? null : (palette[ch] ?? 0xff00ff));
    }
    grid.push(row);
  }

  const outlined: (number | null)[][] = grid.map((row) => [...row]);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if ((grid[y]?.[x] ?? null) !== null) continue;
      const near =
        (y > 0 && (grid[y - 1]?.[x] ?? null) !== null) ||
        (y < h - 1 && (grid[y + 1]?.[x] ?? null) !== null) ||
        (x > 0 && (grid[y]?.[x - 1] ?? null) !== null) ||
        (x < w - 1 && (grid[y]?.[x + 1] ?? null) !== null);
      if (near) {
        const o = outlined[y];
        if (o) o[x] = 0x10141f;
      }
    }
  }

  const tex = scene.textures.createCanvas(key, w + 2, h + 2);
  if (!tex) return;
  const ctx = tex.getContext();
  for (let y = 0; y < h; y++) {
    const orow = outlined[y];
    if (!orow) continue;
    for (let x = 0; x < w; x++) {
      const color = outlined[y]?.[x];
      if (color !== null && color !== undefined) {
        ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        ctx.fillRect(x + 1, y + 1, 1, 1);
      }
    }
  }
  tex.refresh();
}

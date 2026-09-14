/**
 * Rejilla espacial uniforme para consultas de vecindad (separación de
 * enemigos, etc.). Reconstruida por frame; consultas O(vecinos).
 */
export class SpatialHash<T extends { x: number; y: number }> {
  private cellSize: number;
  private cells = new Map<number, T[]>();

  constructor(cellSize = 64) {
    this.cellSize = cellSize;
  }

  private key(x: number, y: number): number {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    return cx * 73856093 ^ cy * 19349663;
  }

  clear(): void {
    this.cells.clear();
  }

  insert(item: T): void {
    const k = this.key(item.x, item.y);
    const bucket = this.cells.get(k);
    if (bucket) {
      bucket.push(item);
    } else {
      this.cells.set(k, [item]);
    }
  }

  /** Items en la celda del punto y sus 8 vecinas. */
  query(x: number, y: number): T[] {
    const result: T[] = [];
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const bucket = this.cells.get((cx + dx) * 73856093 ^ (cy + dy) * 19349663);
        if (bucket) {
          result.push(...bucket);
        }
      }
    }
    return result;
  }
}

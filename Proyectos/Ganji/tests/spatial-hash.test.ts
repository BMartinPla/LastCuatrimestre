import { describe, expect, it } from 'vitest';
import { SpatialHash } from '../src/systems/spatial-hash';

interface Point {
  x: number;
  y: number;
  id: string;
}

describe('SpatialHash', () => {
  it('encuentra vecinos cercanos', () => {
    const hash = new SpatialHash<Point>(72);
    hash.insert({ x: 100, y: 100, id: 'a' });
    hash.insert({ x: 110, y: 105, id: 'b' });
    hash.insert({ x: 400, y: 400, id: 'far' });
    const result = hash.query(105, 100);
    const ids = result.map((p) => p.id);
    expect(ids).toContain('a');
    expect(ids).toContain('b');
    expect(ids).not.toContain('far');
  });

  it('clear vacia la rejilla', () => {
    const hash = new SpatialHash<Point>(72);
    hash.insert({ x: 100, y: 100, id: 'a' });
    hash.clear();
    expect(hash.query(100, 100)).toHaveLength(0);
  });

  it('maneja coordenadas negativas', () => {
    const hash = new SpatialHash<Point>(72);
    hash.insert({ x: -50, y: -50, id: 'neg' });
    expect(hash.query(-55, -45).map((p) => p.id)).toContain('neg');
  });
});

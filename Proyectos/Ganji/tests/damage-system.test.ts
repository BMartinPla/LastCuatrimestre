import { describe, expect, it } from 'vitest';
import { applyArmor, computeDamage } from '../src/systems/damage-system';

describe('damage-system', () => {
  it('aplica multiplicador de daño', () => {
    const r = computeDamage(10, 1.5, 0, 0, 2, () => 0.99);
    expect(r.amount).toBe(15);
    expect(r.crit).toBe(false);
  });

  it('critico multiplica', () => {
    const r = computeDamage(10, 1, 0, 0.5, 2, () => 0.1);
    expect(r.crit).toBe(true);
    expect(r.amount).toBe(20);
  });

  it('la armadura reduce sin bajar de 1', () => {
    const r = computeDamage(10, 1, 4, 0, 2, () => 0.99);
    expect(r.amount).toBe(6);
    const r2 = computeDamage(2, 1, 10, 0, 2, () => 0.99);
    expect(r2.amount).toBe(1);
  });

  it('applyArmor no baja de 1', () => {
    expect(applyArmor(5, 10)).toBe(1);
    expect(applyArmor(5, 2)).toBe(3);
  });
});

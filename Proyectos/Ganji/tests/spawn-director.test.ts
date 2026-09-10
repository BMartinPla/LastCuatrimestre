import { describe, expect, it } from 'vitest';
import { hpMultiplier, SpawnDirector } from '../src/systems/spawn-director';
import type { WaveConfigDef } from '../src/data/types';

const simpleWave: WaveConfigDef = {
  entries: [{ enemyId: 'a', startAt: 0, rate: 2, rateRampPerMinute: 0, maxAlive: 10 }]
};

describe('SpawnDirector', () => {
  it('spawnea según la tasa', () => {
    const d = new SpawnDirector(simpleWave);
    expect(d.update(1, 1, 0, 220)).toHaveLength(2);
    expect(d.update(0.5, 1.5, 0, 220)).toHaveLength(1);
  });

  it('respeta startAt', () => {
    const wave: WaveConfigDef = {
      entries: [{ enemyId: 'a', startAt: 5, rate: 2, rateRampPerMinute: 0, maxAlive: 10 }]
    };
    const d = new SpawnDirector(wave);
    expect(d.update(1, 1, 0, 220)).toHaveLength(0);
    expect(d.update(1, 5, 0, 220)).toHaveLength(2);
  });

  it('respeta el presupuesto de vivos', () => {
    const d = new SpawnDirector(simpleWave);
    expect(d.update(1, 1, 5, 5)).toHaveLength(0);
    expect(d.update(1, 1, 4, 5)).toHaveLength(1);
  });

  it('respeta maxAlive por entrada', () => {
    const wave: WaveConfigDef = {
      entries: [{ enemyId: 'a', startAt: 0, rate: 10, rateRampPerMinute: 0, maxAlive: 2 }]
    };
    const d = new SpawnDirector(wave);
    d.reportAlive(new Map([['a', 2]]));
    expect(d.update(1, 1, 2, 220)).toHaveLength(0);
  });

  it('el ramp aumenta la tasa con el tiempo', () => {
    const wave: WaveConfigDef = {
      entries: [{ enemyId: 'a', startAt: 0, rate: 0, rateRampPerMinute: 60, maxAlive: 10 }]
    };
    const d = new SpawnDirector(wave);
    expect(d.update(1, 1, 0, 220)).toHaveLength(1);
  });

  it('spawnea mini-jefe y jefe una sola vez', () => {
    const wave: WaveConfigDef = {
      entries: [],
      miniBossAt: 5,
      miniBossEnemyId: 'mini',
      bossAt: 10,
      bossEnemyId: 'boss'
    };
    const d = new SpawnDirector(wave);
    const at5 = d.update(1, 5, 0, 220);
    expect(at5).toEqual([{ enemyId: 'mini', isBoss: true }]);
    expect(d.update(1, 6, 0, 220)).toHaveLength(0);
    const at10 = d.update(1, 10, 0, 220);
    expect(at10).toEqual([{ enemyId: 'boss', isBoss: true }]);
    expect(d.update(1, 11, 0, 220)).toHaveLength(0);
  });

  it('hpMultiplier escala +6% por minuto', () => {
    expect(hpMultiplier(0)).toBeCloseTo(1);
    expect(hpMultiplier(120)).toBeCloseTo(1.12);
  });
});

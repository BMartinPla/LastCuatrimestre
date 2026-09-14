import type { WaveConfigDef, WaveEntryDef } from '../data/types';

export interface SpawnRequest {
  enemyId: string;
  isBoss: boolean;
}

interface EntryAccumulator {
  entry: WaveEntryDef;
  accumulator: number;
}

export class SpawnDirector {
  private wave: WaveConfigDef;
  private accumulators: EntryAccumulator[];
  private miniBossSpawned = false;
  private bossSpawned = false;

  constructor(wave: WaveConfigDef) {
    this.wave = wave;
    this.accumulators = wave.entries.map((entry) => ({ entry, accumulator: 0 }));
  }

  /** Devuelve peticiones de spawn para este tick. dt en segundos, elapsed en segundos. */
  update(dt: number, elapsed: number, aliveCount: number, maxAlive: number): SpawnRequest[] {
    const requests: SpawnRequest[] = [];
    const minutes = elapsed / 60;
    const aliveBudget = Math.max(0, maxAlive - aliveCount);
    let spawned = 0;

    for (const acc of this.accumulators) {
      if (elapsed < acc.entry.startAt) continue;
      const rate = acc.entry.rate + acc.entry.rateRampPerMinute * minutes;
      acc.accumulator += rate * dt;
      while (acc.accumulator >= 1 && spawned < aliveBudget) {
        acc.accumulator -= 1;
        if (spawned < aliveBudget && this.countAliveFor(acc.entry) < acc.entry.maxAlive) {
          requests.push({ enemyId: acc.entry.enemyId, isBoss: false });
          spawned++;
        }
      }
      if (acc.accumulator > 5) acc.accumulator = 5;
    }

    if (
      !this.miniBossSpawned &&
      this.wave.miniBossAt !== undefined &&
      elapsed >= this.wave.miniBossAt
    ) {
      this.miniBossSpawned = true;
      if (this.wave.miniBossEnemyId) {
        requests.push({ enemyId: this.wave.miniBossEnemyId, isBoss: true });
      }
    }

    if (!this.bossSpawned && this.wave.bossAt !== undefined && elapsed >= this.wave.bossAt) {
      this.bossSpawned = true;
      if (this.wave.bossEnemyId) {
        requests.push({ enemyId: this.wave.bossEnemyId, isBoss: true });
      }
    }

    return requests;
  }

  private aliveCounts = new Map<string, number>();

  reportAlive(counts: Map<string, number>): void {
    this.aliveCounts = counts;
  }

  private countAliveFor(entry: WaveEntryDef): number {
    return this.aliveCounts.get(entry.enemyId) ?? 0;
  }

  get isBossSpawned(): boolean {
    return this.bossSpawned;
  }
}

/** Multiplicador de vida según el tiempo transcurrido (+6% por minuto). */
export function hpMultiplier(elapsed: number): number {
  return 1 + (elapsed / 60) * 0.06;
}

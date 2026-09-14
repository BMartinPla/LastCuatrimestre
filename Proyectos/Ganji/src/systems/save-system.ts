/**
 * Guardado versionado en localStorage (o storage inyectable para tests).
 */

export interface SaveData {
  version: number;
  gold: number;
  totalKills: number;
  victories: number;
  bestTime: Record<string, number>;
  mapsUnlocked: string[];
  charsUnlocked: string[];
  shop: Record<string, number>;
  muted: boolean;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const SAVE_KEY = 'ganji.save';
export const SAVE_VERSION = 1;

export function defaultSave(): SaveData {
  return {
    version: SAVE_VERSION,
    gold: 0,
    totalKills: 0,
    victories: 0,
    bestTime: {},
    mapsUnlocked: ['bamboo'],
    charsUnlocked: ['ronin'],
    shop: {},
    muted: false
  };
}

export class SaveSystem {
  private storage: StorageLike | null;
  private data: SaveData;

  constructor(storage: StorageLike | null = null) {
    this.storage = storage ?? defaultStorage();
    this.data = this.load();
  }

  get(): SaveData {
    return this.data;
  }

  private load(): SaveData {
    if (!this.storage) return defaultSave();
    try {
      const raw = this.storage.getItem(SAVE_KEY);
      if (!raw) return defaultSave();
      const parsed: unknown = JSON.parse(raw);
      return migrate(parsed);
    } catch {
      return defaultSave();
    }
  }

  persist(): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch {
      // storage lleno o no disponible: el juego sigue sin persistir
    }
  }

  reset(): void {
    this.data = defaultSave();
    this.persist();
  }

  addGold(amount: number): void {
    this.data.gold += amount;
    this.persist();
  }

  spendGold(amount: number): boolean {
    if (this.data.gold < amount) return false;
    this.data.gold -= amount;
    this.persist();
    return true;
  }

  setShopLevel(itemId: string, level: number): void {
    this.data.shop[itemId] = level;
    this.persist();
  }

  setMuted(muted: boolean): void {
    this.data.muted = muted;
    this.persist();
  }

  /** Registra los resultados de una run y devuelve desbloqueos nuevos. */
  applyRunResults(run: {
    gold: number;
    kills: number;
    level: number;
    elapsed: number;
  }, mapId: string, victory: boolean): string[] {
    const unlocks: string[] = [];
    this.data.gold += run.gold;
    this.data.totalKills += run.kills;
    if (victory) {
      this.data.victories += 1;
    }

    const prevBest = this.data.bestTime[mapId] ?? 0;
    if (run.elapsed > prevBest) {
      this.data.bestTime[mapId] = Math.floor(run.elapsed);
    }

    for (const [charId, char] of Object.entries(CHARACTER_UNLOCKS)) {
      if (this.data.charsUnlocked.includes(charId)) continue;
      let met = false;
      switch (char.unlockType) {
        case 'level':
          met = run.level >= char.threshold;
          break;
        case 'kills':
          met = this.data.totalKills >= char.threshold;
          break;
        case 'time':
          met = run.elapsed >= char.threshold;
          break;
        case 'victory':
          met = this.data.victories >= char.threshold;
          break;
      }
      if (met) {
        this.data.charsUnlocked.push(charId);
        unlocks.push(char.name);
      }
    }

    if (victory) {
      const order = MAP_ORDER;
      const idx = order.indexOf(mapId);
      const next = idx >= 0 ? order[idx + 1] : undefined;
      if (next && !this.data.mapsUnlocked.includes(next)) {
        this.data.mapsUnlocked.push(next);
        unlocks.push(next);
      }
    }

    this.persist();
    return unlocks;
  }
}

export const MAP_ORDER = ['bamboo', 'temple', 'frozen'];

export interface CharacterUnlockDef {
  name: string;
  unlockType: 'level' | 'kills' | 'time' | 'victory';
  threshold: number;
  requirementText: string;
}

export const CHARACTER_UNLOCKS: Record<string, CharacterUnlockDef> = {
  kunoichi: {
    name: 'Kunoichi',
    unlockType: 'level',
    threshold: 15,
    requirementText: 'Alcanza el nivel 15 en una run'
  },
  sohei: {
    name: 'Sohei',
    unlockType: 'kills',
    threshold: 1000,
    requirementText: 'Elimina 1000 yokai en total'
  },
  onmyoji: {
    name: 'Onmyoji',
    unlockType: 'time',
    threshold: 600,
    requirementText: 'Sobrevive 10 minutos en una run'
  },
  kensei: {
    name: 'Kensei',
    unlockType: 'victory',
    threshold: 1,
    requirementText: 'Derrota a un jefe final'
  }
};

/** Migra savedata de versiones anteriores. */
export function migrate(parsed: unknown): SaveData {
  const base = defaultSave();
  if (typeof parsed !== 'object' || parsed === null) return base;
  const p = parsed as Record<string, unknown>;
  const version = typeof p['version'] === 'number' ? p['version'] : 0;

  if (version > SAVE_VERSION) return base;
  if (version < 1) return base;

  return {
    version: SAVE_VERSION,
    gold: numberOr(p['gold'], 0),
    totalKills: numberOr(p['totalKills'], 0),
    victories: numberOr(p['victories'], 0),
    bestTime: recordOr(p['bestTime']),
    mapsUnlocked: stringArrayOr(p['mapsUnlocked'], base.mapsUnlocked),
    charsUnlocked: stringArrayOr(p['charsUnlocked'], base.charsUnlocked),
    shop: recordOr(p['shop']),
    muted: typeof p['muted'] === 'boolean' ? p['muted'] : false
  };
}

function numberOr(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function recordOr(v: unknown): Record<string, number> {
  if (typeof v !== 'object' || v === null) return {};
  const out: Record<string, number> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (typeof val === 'number') out[k] = val;
  }
  return out;
}

function stringArrayOr(v: unknown, fallback: string[]): string[] {
  if (!Array.isArray(v)) return fallback;
  const arr = v.filter((x): x is string => typeof x === 'string');
  return arr.length > 0 || fallback.length === 0 ? arr : fallback;
}

function defaultStorage(): StorageLike | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
  } catch {
    // bloqueado (privacy mode): sin persistencia
  }
  return null;
}

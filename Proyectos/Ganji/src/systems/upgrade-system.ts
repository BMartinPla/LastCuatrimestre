import { CHARACTERS } from '../data/characters';
import { PASSIVES } from '../data/passives';
import type { OwnedWeapon, PlayerStats, UpgradeDef, WeaponLevelDef } from '../data/types';
import {
  ALL_WEAPON_IDS,
  EVOLUTION_PASSIVE_LEVEL,
  MAX_WEAPONS,
  MAX_WEAPON_LEVEL,
  WEAPONS,
  getWeaponStats
} from '../data/weapons';
import { applyShopToStats } from './shop-system';

export interface RunState {
  characterId: string;
  baseStats: PlayerStats;
  stats: PlayerStats;
  weapons: OwnedWeapon[];
  passives: Record<string, number>;
  hp: number;
  xp: number;
  level: number;
  pendingLevelUps: number;
  gold: number;
  kills: number;
  elapsed: number;
}

export function baseStatsFor(characterId: string): PlayerStats {
  const char = CHARACTERS[characterId];
  if (!char) throw new Error(`Personaje desconocido: ${characterId}`);
  return {
    maxHp: char.hp,
    moveSpeed: char.speed,
    damageMult: 1,
    cooldownMult: 1,
    areaMult: 1,
    speedMult: 1,
    magnetRadius: 55,
    armor: 0,
    luck: 0,
    growth: 1,
    critChance: 0.05,
    critMult: 2,
    goldMult: 1,
    revives: 0
  };
}

export function createRunState(characterId: string, shopLevels?: Record<string, number>): RunState {
  const char = CHARACTERS[characterId];
  if (!char) throw new Error(`Personaje desconocido: ${characterId}`);
  const base = baseStatsFor(characterId);
  if (shopLevels) {
    applyShopToStats(base, shopLevels);
  }
  const stats = { ...base };
  const state: RunState = {
    characterId,
    baseStats: base,
    stats,
    weapons: [{ id: char.startingWeaponId, level: 1 }],
    passives: {},
    hp: base.maxHp,
    xp: 0,
    level: 1,
    pendingLevelUps: 0,
    gold: 0,
    kills: 0,
    elapsed: 0
  };
  return state;
}

export function xpForLevel(level: number): number {
  return 5 + (level - 1) * 8;
}

/** Devuelve la cantidad de niveles pendientes tras ganar XP. */
export function gainXp(run: RunState, amount: number): number {
  const total = amount * run.stats.growth;
  run.xp += total;
  let leveled = 0;
  while (run.xp >= xpForLevel(run.level)) {
    run.xp -= xpForLevel(run.level);
    run.level += 1;
    leveled += 1;
  }
  run.pendingLevelUps += leveled;
  return leveled;
}

export function addGold(run: RunState, amount: number): number {
  const gained = Math.max(1, Math.floor(amount * run.stats.goldMult));
  run.gold += gained;
  return gained;
}

/** Recalcula stats desde la base aplicando las pasivas poseídas. */
export function recomputeStats(run: RunState): void {
  const s: PlayerStats = { ...run.baseStats };
  for (const [passiveId, level] of Object.entries(run.passives)) {
    const def = PASSIVES[passiveId];
    if (def && level > 0) {
      def.apply(s, level);
    }
  }
  const prevMax = run.stats.maxHp;
  run.stats = s;
  if (s.maxHp > prevMax) {
    run.hp += s.maxHp - prevMax;
  }
  run.hp = Math.min(run.hp, s.maxHp);
}

export function applyUpgrade(run: RunState, upgrade: UpgradeDef): void {
  switch (upgrade.kind) {
    case 'new-weapon':
      if (upgrade.targetId && !run.weapons.some((w) => w.id === upgrade.targetId)) {
        run.weapons.push({ id: upgrade.targetId, level: 1 });
      }
      break;
    case 'weapon-level': {
      const weapon = run.weapons.find((w) => w.id === upgrade.targetId);
      if (weapon && weapon.level < MAX_WEAPON_LEVEL) {
        weapon.level += 1;
      }
      break;
    }
    case 'evolution': {
      const weapon = run.weapons.find((w) => w.id === upgrade.targetId);
      if (weapon) {
        weapon.evolved = true;
      }
      break;
    }
    case 'passive':
      if (upgrade.targetId) {
        const current = run.passives[upgrade.targetId] ?? 0;
        const def = PASSIVES[upgrade.targetId];
        if (def && current < def.maxLevel) {
          run.passives[upgrade.targetId] = current + 1;
        }
        recomputeStats(run);
      }
      break;
    case 'heal':
      run.hp = Math.min(run.stats.maxHp, run.hp + Math.floor(run.stats.maxHp * 0.3));
      break;
  }
}

/** Stats efectivos de un arma poseída. */
export function weaponStats(owned: OwnedWeapon): WeaponLevelDef {
  const def = WEAPONS[owned.id];
  if (!def) return { damage: 1, cooldown: 1, area: 1, count: 1 };
  return getWeaponStats(def, owned);
}

export interface DraftContext {
  run: RunState;
}

/** Genera el draft de mejoras para subir de nivel (3 opciones únicas). */
export function rollDraft(run: RunState, rng: () => number): UpgradeDef[] {
  const pool: UpgradeDef[] = [];

  for (const weaponId of ALL_WEAPON_IDS) {
    const def = WEAPONS[weaponId];
    if (!def) continue;
    const owned = run.weapons.find((w) => w.id === weaponId);
    if (!owned) {
      if (run.weapons.length < MAX_WEAPONS) {
        pool.push({
          id: `new-${weaponId}`,
          kind: 'new-weapon',
          name: def.name,
          desc: def.desc,
          icon: weaponId,
          targetId: weaponId
        });
      }
    } else if (owned.level < MAX_WEAPON_LEVEL) {
      pool.push({
        id: `lvl-${weaponId}-${owned.level + 1}`,
        kind: 'weapon-level',
        name: `${def.name} Nv.${owned.level + 1}`,
        desc: 'Mejora este arma.',
        icon: weaponId,
        targetId: weaponId
      });
    } else if (!owned.evolved && def.evolution) {
      const reqLevel = run.passives[def.evolution.requires] ?? 0;
      if (reqLevel >= EVOLUTION_PASSIVE_LEVEL) {
        pool.push({
          id: `evo-${weaponId}`,
          kind: 'evolution',
          name: def.evolution.name,
          desc: def.evolution.desc,
          icon: `evo-${weaponId}`,
          targetId: weaponId
        });
      }
    }
  }

  for (const passive of Object.values(PASSIVES)) {
    const current = run.passives[passive.id] ?? 0;
    if (current < passive.maxLevel) {
      pool.push({
        id: `pas-${passive.id}-${current + 1}`,
        kind: 'passive',
        name: passive.name,
        desc: passive.desc,
        icon: passive.id,
        targetId: passive.id
      });
    }
  }

  const shuffled = shuffle(pool, rng);
  const draft = shuffled.slice(0, 3);

  if (draft.length < 3) {
    draft.push({
      id: 'heal',
      kind: 'heal',
      name: 'Reposo',
      desc: 'Recupera 30% de la vida máxima.',
      icon: 'heal'
    });
  }
  return draft;
}

export function shuffle<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const a = copy[i];
    const b = copy[j];
    if (a === undefined || b === undefined) continue;
    copy[i] = b;
    copy[j] = a;
  }
  return copy;
}

export function consumeLevelUp(run: RunState): boolean {
  if (run.pendingLevelUps <= 0) return false;
  run.pendingLevelUps -= 1;
  return true;
}

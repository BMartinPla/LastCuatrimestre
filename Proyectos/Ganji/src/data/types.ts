export type WeaponBehavior = 'arc' | 'spread' | 'homing' | 'orbit' | 'nova' | 'sniper' | 'strike' | 'wave';

export interface WeaponLevelDef {
  damage: number;
  cooldown: number;
  area: number;
  count: number;
  speed?: number;
  pierce?: number;
}

export interface WeaponDef {
  id: string;
  name: string;
  desc: string;
  behavior: WeaponBehavior;
  levels: WeaponLevelDef[];
}

export interface EnemyDef {
  id: string;
  name: string;
  textureKey: string;
  hp: number;
  speed: number;
  damage: number;
  radius: number;
  xp: number;
  goldChance: number;
  goldAmount: number;
  knockbackResist: number;
  scale: number;
  wobble?: boolean;
  isBoss?: boolean;
  isMiniBoss?: boolean;
  ranged?: { every: number; speed: number; damage: number; textureKey: string };
  spawns?: { enemyId: string; every: number };
}

export interface WaveEntryDef {
  enemyId: string;
  startAt: number;
  rate: number;
  rateRampPerMinute: number;
  maxAlive: number;
}

export interface WaveConfigDef {
  entries: WaveEntryDef[];
  miniBossAt?: number;
  miniBossEnemyId?: string;
  bossAt?: number;
  bossEnemyId?: string;
  victoryOnBossKill?: boolean;
}

export interface MapDef {
  id: string;
  name: string;
  groundTextureKey: string;
  worldSize: number;
  wave: WaveConfigDef;
}

export interface CharacterDef {
  id: string;
  name: string;
  desc: string;
  hp: number;
  speed: number;
  startingWeaponId: string;
  textureKey: string;
}

export interface PlayerStats {
  maxHp: number;
  moveSpeed: number;
  damageMult: number;
  cooldownMult: number;
  areaMult: number;
  speedMult: number;
  magnetRadius: number;
  armor: number;
  luck: number;
  growth: number;
  critChance: number;
  critMult: number;
  goldMult: number;
  revives: number;
}

export type PassiveId =
  | 'damage'
  | 'cooldown'
  | 'area'
  | 'speed'
  | 'vitality'
  | 'magnet'
  | 'armor'
  | 'luck';

export interface PassiveDef {
  id: PassiveId;
  name: string;
  desc: string;
  maxLevel: number;
  apply: (stats: PlayerStats, level: number) => void;
}

export type UpgradeKind = 'new-weapon' | 'weapon-level' | 'passive' | 'heal' | 'evolution';

export interface UpgradeDef {
  id: string;
  kind: UpgradeKind;
  name: string;
  desc: string;
  icon: string;
  targetId?: string;
}

export interface OwnedWeapon {
  id: string;
  level: number;
  evolved?: boolean;
}

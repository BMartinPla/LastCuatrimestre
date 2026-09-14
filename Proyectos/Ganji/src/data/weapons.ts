import type { PassiveId, WeaponDef, WeaponLevelDef } from './types';
import type { OwnedWeapon } from './types';

export interface EvolutionDef {
  name: string;
  desc: string;
  requires: PassiveId;
  mult: {
    damage: number;
    area: number;
    cooldown: number;
    count: number;
    pierce: number;
    speed: number;
  };
}

export interface WeaponDefFull extends WeaponDef {
  textureKey: string;
  evolution?: EvolutionDef;
}

export const WEAPONS: Record<string, WeaponDefFull> = {
  katana: {
    id: 'katana',
    name: 'Katana',
    desc: 'Corte en arco frente al portador.',
    behavior: 'arc',
    textureKey: 'slash',
    levels: [
      { damage: 22, cooldown: 1.1, area: 70, count: 1 },
      { damage: 26, cooldown: 1.1, area: 75, count: 1 },
      { damage: 30, cooldown: 1.0, area: 80, count: 1 },
      { damage: 34, cooldown: 1.0, area: 85, count: 2 },
      { damage: 40, cooldown: 0.95, area: 90, count: 2 },
      { damage: 46, cooldown: 0.9, area: 95, count: 2 },
      { damage: 54, cooldown: 0.85, area: 105, count: 2 },
      { damage: 64, cooldown: 0.8, area: 115, count: 3 }
    ],
    evolution: {
      name: 'Tsubame Gaeshi',
      desc: 'La estocada imposible: tres cortes simultáneos.',
      requires: 'area',
      mult: { damage: 2, area: 1.35, cooldown: 0.75, count: 1, pierce: 0, speed: 1 }
    }
  },
  kunai: {
    id: 'kunai',
    name: 'Kunai',
    desc: 'Dardos perforantes hacia el enemigo cercano.',
    behavior: 'spread',
    textureKey: 'kunai',
    levels: [
      { damage: 12, cooldown: 0.9, area: 640, count: 2, speed: 520, pierce: 1 },
      { damage: 14, cooldown: 0.9, area: 640, count: 2, speed: 530, pierce: 1 },
      { damage: 14, cooldown: 0.85, area: 640, count: 3, speed: 530, pierce: 1 },
      { damage: 17, cooldown: 0.85, area: 680, count: 3, speed: 540, pierce: 2 },
      { damage: 20, cooldown: 0.8, area: 680, count: 4, speed: 540, pierce: 2 },
      { damage: 23, cooldown: 0.8, area: 720, count: 4, speed: 550, pierce: 3 },
      { damage: 26, cooldown: 0.75, area: 720, count: 5, speed: 560, pierce: 3 },
      { damage: 30, cooldown: 0.7, area: 760, count: 6, speed: 580, pierce: 4 }
    ],
    evolution: {
      name: 'Kunai Fudou',
      desc: 'Dardos imbuydos de furia inmovilizante.',
      requires: 'damage',
      mult: { damage: 2.2, area: 1, cooldown: 0.7, count: 2, pierce: 2, speed: 1.2 }
    }
  },
  talisman: {
    id: 'talisman',
    name: 'Talismán Ofuda',
    desc: 'Papeles encantados que persiguen a los yokai.',
    behavior: 'homing',
    textureKey: 'talisman',
    levels: [
      { damage: 16, cooldown: 1.4, area: 0, count: 2, speed: 260 },
      { damage: 19, cooldown: 1.35, area: 0, count: 3, speed: 265 },
      { damage: 22, cooldown: 1.3, area: 0, count: 3, speed: 275 },
      { damage: 26, cooldown: 1.25, area: 0, count: 4, speed: 285 },
      { damage: 31, cooldown: 1.2, area: 0, count: 4, speed: 295 },
      { damage: 37, cooldown: 1.15, area: 0, count: 5, speed: 305 },
      { damage: 44, cooldown: 1.1, area: 0, count: 5, speed: 315 },
      { damage: 52, cooldown: 1.0, area: 0, count: 6, speed: 330 }
    ],
    evolution: {
      name: 'Kotodama',
      desc: 'Palabras del poder que no fallan su marca.',
      requires: 'cooldown',
      mult: { damage: 2.4, area: 1, cooldown: 0.65, count: 2, pierce: 0, speed: 1.3 }
    }
  },
  bo: {
    id: 'bo',
    name: 'Bō Sagrado',
    desc: 'El bástigo del monje gira a tu alrededor.',
    behavior: 'orbit',
    textureKey: 'bo',
    levels: [
      { damage: 15, cooldown: 2.2, area: 52, count: 1, speed: 3.4 },
      { damage: 18, cooldown: 2.15, area: 56, count: 1, speed: 3.5 },
      { damage: 21, cooldown: 2.1, area: 60, count: 2, speed: 3.6 },
      { damage: 25, cooldown: 2.05, area: 64, count: 2, speed: 3.8 },
      { damage: 30, cooldown: 2.0, area: 68, count: 2, speed: 4.0 },
      { damage: 36, cooldown: 1.95, area: 72, count: 3, speed: 4.2 },
      { damage: 43, cooldown: 1.9, area: 76, count: 3, speed: 4.4 },
      { damage: 51, cooldown: 1.8, area: 82, count: 4, speed: 4.6 }
    ],
    evolution: {
      name: 'Bō Truenante',
      desc: 'Cada giro resuena con el trueno del monte.',
      requires: 'area',
      mult: { damage: 2.3, area: 1.4, cooldown: 0.8, count: 1, pierce: 0, speed: 1.4 }
    }
  },
  mask: {
    id: 'mask',
    name: 'Máscara Oni',
    desc: 'El espíritu del oni orbita y devora.',
    behavior: 'orbit',
    textureKey: 'mask',
    levels: [
      { damage: 20, cooldown: 2.6, area: 72, count: 1, speed: 2.6 },
      { damage: 24, cooldown: 2.55, area: 76, count: 1, speed: 2.7 },
      { damage: 28, cooldown: 2.5, area: 80, count: 2, speed: 2.8 },
      { damage: 33, cooldown: 2.45, area: 84, count: 2, speed: 3.0 },
      { damage: 39, cooldown: 2.4, area: 88, count: 2, speed: 3.2 },
      { damage: 46, cooldown: 2.3, area: 92, count: 3, speed: 3.4 },
      { damage: 54, cooldown: 2.2, area: 96, count: 3, speed: 3.6 },
      { damage: 63, cooldown: 2.1, area: 102, count: 4, speed: 3.8 }
    ],
    evolution: {
      name: 'Máscara Hambrienta',
      desc: 'El oni ya no distingue amigos ni enemigos.',
      requires: 'magnet',
      mult: { damage: 2.2, area: 1.35, cooldown: 0.7, count: 2, pierce: 0, speed: 1.3 }
    }
  },
  kasha: {
    id: 'kasha',
    name: 'Fuego Kasha',
    desc: 'Anillo de llamas del carro demoníaco.',
    behavior: 'nova',
    textureKey: 'flame',
    levels: [
      { damage: 18, cooldown: 1.7, area: 0, count: 6, speed: 170, pierce: 2 },
      { damage: 21, cooldown: 1.65, area: 0, count: 7, speed: 175, pierce: 2 },
      { damage: 25, cooldown: 1.6, area: 0, count: 8, speed: 180, pierce: 3 },
      { damage: 29, cooldown: 1.55, area: 0, count: 9, speed: 185, pierce: 3 },
      { damage: 34, cooldown: 1.5, area: 0, count: 10, speed: 190, pierce: 4 },
      { damage: 40, cooldown: 1.45, area: 0, count: 11, speed: 195, pierce: 4 },
      { damage: 47, cooldown: 1.4, area: 0, count: 12, speed: 200, pierce: 5 },
      { damage: 55, cooldown: 1.3, area: 0, count: 14, speed: 210, pierce: 6 }
    ],
    evolution: {
      name: 'Infierno Kasha',
      desc: 'El suelo mismo arde a tu paso.',
      requires: 'damage',
      mult: { damage: 2.1, area: 1, cooldown: 0.7, count: 4, pierce: 2, speed: 1.2 }
    }
  },
  raiju: {
    id: 'raiju',
    name: 'Rayo Raijū',
    desc: 'El bestia del trueno golpea a los enemigos al azar.',
    behavior: 'strike',
    textureKey: 'bolt',
    levels: [
      { damage: 38, cooldown: 2.4, area: 520, count: 1 },
      { damage: 44, cooldown: 2.3, area: 540, count: 1 },
      { damage: 51, cooldown: 2.2, area: 560, count: 2 },
      { damage: 59, cooldown: 2.1, area: 580, count: 2 },
      { damage: 68, cooldown: 2.0, area: 600, count: 3 },
      { damage: 78, cooldown: 1.9, area: 620, count: 3 },
      { damage: 90, cooldown: 1.8, area: 640, count: 4 },
      { damage: 104, cooldown: 1.7, area: 660, count: 5 }
    ],
    evolution: {
      name: 'Cólera de Raijū',
      desc: 'La tormenta entera desciende sobre los yokai.',
      requires: 'cooldown',
      mult: { damage: 2, area: 1.3, cooldown: 0.6, count: 3, pierce: 0, speed: 1 }
    }
  },
  bow: {
    id: 'bow',
    name: 'Arco Largo',
    desc: 'Flecha certera que atraviesa filas enteras.',
    behavior: 'sniper',
    textureKey: 'arrow',
    levels: [
      { damage: 42, cooldown: 1.7, area: 800, count: 1, speed: 820, pierce: 3 },
      { damage: 48, cooldown: 1.65, area: 800, count: 1, speed: 830, pierce: 3 },
      { damage: 55, cooldown: 1.6, area: 820, count: 1, speed: 840, pierce: 4 },
      { damage: 63, cooldown: 1.55, area: 820, count: 2, speed: 850, pierce: 4 },
      { damage: 72, cooldown: 1.5, area: 840, count: 2, speed: 860, pierce: 5 },
      { damage: 82, cooldown: 1.45, area: 840, count: 2, speed: 870, pierce: 5 },
      { damage: 93, cooldown: 1.4, area: 860, count: 3, speed: 880, pierce: 6 },
      { damage: 105, cooldown: 1.3, area: 860, count: 3, speed: 900, pierce: 7 }
    ],
    evolution: {
      name: 'Arco del Cielo',
      desc: 'Cada flecha cae como un castigo divino.',
      requires: 'damage',
      mult: { damage: 2.2, area: 1, cooldown: 0.7, count: 1, pierce: 3, speed: 1.3 }
    }
  },
  fan: {
    id: 'fan',
    name: 'Abanico de Hierro',
    desc: 'Onda de viento que empuja y corta.',
    behavior: 'wave',
    textureKey: 'fan',
    levels: [
      { damage: 14, cooldown: 1.5, area: 130, count: 1 },
      { damage: 17, cooldown: 1.45, area: 140, count: 1 },
      { damage: 20, cooldown: 1.4, area: 150, count: 1 },
      { damage: 24, cooldown: 1.35, area: 160, count: 2 },
      { damage: 29, cooldown: 1.3, area: 170, count: 2 },
      { damage: 34, cooldown: 1.25, area: 180, count: 2 },
      { damage: 40, cooldown: 1.2, area: 195, count: 3 },
      { damage: 47, cooldown: 1.1, area: 210, count: 3 }
    ],
    evolution: {
      name: 'Ventisca Fubuki',
      desc: 'El viento arrastra a los yokai como hojas.',
      requires: 'area',
      mult: { damage: 2, area: 1.4, cooldown: 0.7, count: 1, pierce: 0, speed: 1 }
    }
  }
};

export const ALL_WEAPON_IDS: string[] = [
  'katana',
  'kunai',
  'talisman',
  'bo',
  'mask',
  'kasha',
  'raiju',
  'bow',
  'fan'
];

export const MAX_WEAPONS = 4;
export const MAX_WEAPON_LEVEL = 8;
export const EVOLUTION_PASSIVE_LEVEL = 3;

/** Stats efectivos del arma (nivel + evolución). */
export function getWeaponStats(def: WeaponDefFull, owned: OwnedWeapon): WeaponLevelDef {
  const base = def.levels[owned.level - 1];
  if (!base) {
    return def.levels[0] ?? { damage: 1, cooldown: 1, area: 1, count: 1 };
  }
  if (!owned.evolved || !def.evolution) return base;
  const m = def.evolution.mult;
  const stats: WeaponLevelDef = {
    damage: base.damage * m.damage,
    cooldown: base.cooldown * m.cooldown,
    area: base.area * m.area,
    count: base.count + m.count
  };
  if (base.speed !== undefined) {
    stats.speed = base.speed * m.speed;
  }
  if (base.pierce !== undefined) {
    stats.pierce = base.pierce + m.pierce;
  }
  return stats;
}

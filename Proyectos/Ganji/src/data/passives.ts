import type { PassiveDef } from './types';

/**
 * Las pasivas se aplican SIEMPRE sobre stats frescos (copiada la base del
 * personaje) y en orden; apply() debe asumir eso y recalcular en función del
 * nivel acumulado. upgrade-system.recomputeStats() garantiza el flujo.
 */
export const PASSIVES: Record<string, PassiveDef> = {
  damage: {
    id: 'damage',
    name: 'Ira del Ronin',
    desc: '+12% daño de todas las armas.',
    maxLevel: 5,
    apply: (s, lvl) => {
      s.damageMult = 1 + 0.12 * lvl;
    }
  },
  cooldown: {
    id: 'cooldown',
    name: 'Aliento Zen',
    desc: '-8% tiempo de recarga.',
    maxLevel: 5,
    apply: (s, lvl) => {
      s.cooldownMult = Math.max(0.4, 1 - 0.08 * lvl);
    }
  },
  area: {
    id: 'area',
    name: 'Presencia',
    desc: '+12% área de efecto.',
    maxLevel: 5,
    apply: (s, lvl) => {
      s.areaMult = 1 + 0.12 * lvl;
    }
  },
  speed: {
    id: 'speed',
    name: 'Zancada',
    desc: '+8% velocidad de movimiento.',
    maxLevel: 5,
    apply: (s, lvl) => {
      s.moveSpeed = s.moveSpeed * 1.08 ** lvl;
    }
  },
  vitality: {
    id: 'vitality',
    name: 'Cuerpo de Hierro',
    desc: '+25 vida máxima.',
    maxLevel: 5,
    apply: (s, lvl) => {
      s.maxHp = Math.floor(s.maxHp + 25 * lvl);
    }
  },
  magnet: {
    id: 'magnet',
    name: 'Imán Espiritual',
    desc: '+40% radio de recolección.',
    maxLevel: 5,
    apply: (s, lvl) => {
      s.magnetRadius = Math.floor(s.magnetRadius * 1.4 ** lvl);
    }
  },
  armor: {
    id: 'armor',
    name: 'Armadura',
    desc: '-2 daño recibido por golpe.',
    maxLevel: 5,
    apply: (s, lvl) => {
      s.armor = 2 * lvl;
    }
  },
  luck: {
    id: 'luck',
    name: 'Fortuna',
    desc: '+3% prob. de crítico y de oro.',
    maxLevel: 5,
    apply: (s, lvl) => {
      s.luck = lvl;
      s.critChance = 0.05 + 0.03 * lvl;
    }
  }
};

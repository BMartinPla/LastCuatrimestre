import type { PlayerStats } from './types';

export interface ShopItemDef {
  id: string;
  name: string;
  desc: string;
  maxLevel: number;
  baseCost: number;
  icon: string;
  apply: (stats: PlayerStats, level: number) => void;
}

export const SHOP_ITEMS: Record<string, ShopItemDef> = {
  might: {
    id: 'might',
    name: 'Ira',
    desc: '+6% daño por nivel.',
    maxLevel: 5,
    baseCost: 60,
    icon: '怒',
    apply: (s, lvl) => {
      s.damageMult += 0.06 * lvl;
    }
  },
  alacrity: {
    id: 'alacrity',
    name: 'Celeridad',
    desc: '-4% recarga por nivel.',
    maxLevel: 5,
    baseCost: 80,
    icon: '禅',
    apply: (s, lvl) => {
      s.cooldownMult = Math.max(0.4, s.cooldownMult - 0.04 * lvl);
    }
  },
  vigor: {
    id: 'vigor',
    name: 'Vigor',
    desc: '+12 vida máxima por nivel.',
    maxLevel: 5,
    baseCost: 50,
    icon: '体',
    apply: (s, lvl) => {
      s.maxHp += 12 * lvl;
    }
  },
  swiftness: {
    id: 'swiftness',
    name: 'Ligereza',
    desc: '+4% velocidad por nivel.',
    maxLevel: 5,
    baseCost: 55,
    icon: '風',
    apply: (s, lvl) => {
      s.moveSpeed = s.moveSpeed * (1 + 0.04 * lvl);
    }
  },
  reach: {
    id: 'reach',
    name: 'Alcance',
    desc: '+6% área por nivel.',
    maxLevel: 5,
    baseCost: 65,
    icon: '圏',
    apply: (s, lvl) => {
      s.areaMult += 0.06 * lvl;
    }
  },
  attraction: {
    id: 'attraction',
    name: 'Atracción',
    desc: '+20% imán por nivel.',
    maxLevel: 5,
    baseCost: 40,
    icon: '磁',
    apply: (s, lvl) => {
      s.magnetRadius = Math.floor(s.magnetRadius * (1 + 0.2 * lvl));
    }
  },
  fortune: {
    id: 'fortune',
    name: 'Fortuna',
    desc: '+2% crítico y suerte por nivel.',
    maxLevel: 5,
    baseCost: 70,
    icon: '運',
    apply: (s, lvl) => {
      s.critChance += 0.02 * lvl;
      s.luck += lvl;
    }
  },
  wisdom: {
    id: 'wisdom',
    name: 'Sabiduría',
    desc: '+4% experiencia por nivel.',
    maxLevel: 3,
    baseCost: 90,
    icon: '知',
    apply: (s, lvl) => {
      s.growth += 0.04 * lvl;
    }
  },
  greed: {
    id: 'greed',
    name: 'Codicia',
    desc: '+12% oro por nivel.',
    maxLevel: 5,
    baseCost: 60,
    icon: '金',
    apply: (s, lvl) => {
      s.goldMult = s.goldMult + 0.12 * lvl;
    }
  },
  bulwark: {
    id: 'bulwark',
    name: 'Muralla',
    desc: '-1 daño recibido por nivel.',
    maxLevel: 5,
    baseCost: 75,
    icon: '鎧',
    apply: (s, lvl) => {
      s.armor += lvl;
    }
  },
  revival: {
    id: 'revival',
    name: 'Segunda Vida',
    desc: 'Revives una vez con 50% de vida.',
    maxLevel: 1,
    baseCost: 500,
    icon: '命',
    apply: (s, lvl) => {
      s.revives = (s.revives ?? 0) + lvl;
    }
  },
  focus: {
    id: 'focus',
    name: 'Concentración',
    desc: '+10% daño crítico por nivel.',
    maxLevel: 3,
    baseCost: 120,
    icon: '中',
    apply: (s, lvl) => {
      s.critMult += 0.1 * lvl;
    }
  }
};

export function shopCost(item: ShopItemDef, currentLevel: number): number {
  return Math.round((item.baseCost * Math.pow(currentLevel + 1, 1.5)) / 5) * 5;
}

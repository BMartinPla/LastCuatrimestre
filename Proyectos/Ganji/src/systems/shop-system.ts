import { SHOP_ITEMS, shopCost, type ShopItemDef } from '../data/shop';
import type { PlayerStats } from '../data/types';
import type { SaveSystem } from './save-system';

export interface ShopEntry {
  item: ShopItemDef;
  level: number;
  cost: number;
  maxed: boolean;
  affordable: boolean;
}

export function shopEntries(save: SaveSystem): ShopEntry[] {
  const shop = save.get().shop;
  const gold = save.get().gold;
  return Object.values(SHOP_ITEMS).map((item) => {
    const level = shop[item.id] ?? 0;
    const cost = shopCost(item, level);
    const maxed = level >= item.maxLevel;
    return { item, level, cost, maxed, affordable: !maxed && gold >= cost };
  });
}

/** Devuelve true si la compra procede. */
export function buy(save: SaveSystem, itemId: string): boolean {
  const item = SHOP_ITEMS[itemId];
  if (!item) return false;
  const shop = save.get().shop;
  const level = shop[itemId] ?? 0;
  if (level >= item.maxLevel) return false;
  const cost = shopCost(item, level);
  if (!save.spendGold(cost)) return false;
  save.setShopLevel(itemId, level + 1);
  return true;
}

/** Aplica las mejoras permanentes a los stats base del personaje. */
export function applyShopToStats(stats: PlayerStats, shopLevels: Record<string, number>): void {
  for (const [id, level] of Object.entries(shopLevels)) {
    const item = SHOP_ITEMS[id];
    if (item && level > 0) {
      item.apply(stats, level);
    }
  }
  stats.maxHp = Math.floor(stats.maxHp);
  stats.moveSpeed = Math.floor(stats.moveSpeed);
}

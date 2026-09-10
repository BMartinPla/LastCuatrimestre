import { describe, expect, it } from 'vitest';
import { SHOP_ITEMS, shopCost } from '../src/data/shop';
import { migrate, SaveSystem, type StorageLike } from '../src/systems/save-system';
import { buy, applyShopToStats } from '../src/systems/shop-system';

class MemoryStorage implements StorageLike {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
}

describe('SaveSystem', () => {
  it('persiste y recarga', () => {
    const storage = new MemoryStorage();
    const save = new SaveSystem(storage);
    save.addGold(120);
    const save2 = new SaveSystem(storage);
    expect(save2.get().gold).toBe(120);
  });

  it('spendGold valida fondos', () => {
    const save = new SaveSystem(new MemoryStorage());
    expect(save.spendGold(50)).toBe(false);
    save.addGold(100);
    expect(save.spendGold(50)).toBe(true);
    expect(save.get().gold).toBe(50);
  });

  it('corrupto devuelve default', () => {
    const storage = new MemoryStorage();
    storage.setItem('ganji.save', '{no json');
    const save = new SaveSystem(storage);
    expect(save.get().gold).toBe(0);
    expect(save.get().charsUnlocked).toContain('ronin');
  });

  it('migra versiones futuras a default', () => {
    const migrated = migrate({ version: 99, gold: 999 });
    expect(migrated.version).toBe(1);
    expect(migrated.gold).toBe(0);
  });

  it('applyRunResults registra oro, kills y desbloqueos', () => {
    const save = new SaveSystem(new MemoryStorage());
    save.addGold(0);
    // 999 kills desbloquean al Sohei
    const unlocks = save.applyRunResults(
      { gold: 40, kills: 1200, level: 7, elapsed: 120 },
      'bamboo',
      false
    );
    expect(save.get().gold).toBe(40);
    expect(save.get().totalKills).toBe(1200);
    expect(save.get().bestTime['bamboo']).toBe(120);
    expect(unlocks).toContain('Sohei');
    expect(save.get().charsUnlocked).toContain('sohei');
  });

  it('la victoria desbloquea el siguiente mapa', () => {
    const save = new SaveSystem(new MemoryStorage());
    const unlocks = save.applyRunResults(
      { gold: 10, kills: 5, level: 4, elapsed: 910 },
      'bamboo',
      true
    );
    expect(save.get().victories).toBe(1);
    expect(save.get().mapsUnlocked).toContain('temple');
    expect(unlocks).toContain('temple');
    // victoria en kensei se desbloquea con 1
    expect(save.get().charsUnlocked).toContain('kensei');
  });

  it('no desbloquea dos veces', () => {
    const save = new SaveSystem(new MemoryStorage());
    save.applyRunResults({ gold: 0, kills: 1200, level: 2, elapsed: 60 }, 'bamboo', false);
    const again = save.applyRunResults(
      { gold: 0, kills: 100, level: 2, elapsed: 61 },
      'bamboo',
      false
    );
    expect(again).not.toContain('Sohei');
  });
});

describe('ShopSystem', () => {
  it('el costo escala por nivel', () => {
    const item = SHOP_ITEMS['might'];
    if (!item) throw new Error('item missing');
    const c0 = shopCost(item, 0);
    const c1 = shopCost(item, 1);
    const c2 = shopCost(item, 2);
    expect(c0).toBe(item.baseCost);
    expect(c1).toBeGreaterThan(c0);
    expect(c2).toBeGreaterThan(c1);
  });

  it('compra aplica nivel y descuenta oro', () => {
    const save = new SaveSystem(new MemoryStorage());
    save.addGold(500);
    expect(buy(save, 'might')).toBe(true);
    expect(save.get().shop['might']).toBe(1);
    expect(save.get().gold).toBeLessThan(500);
  });

  it('no compra por encima del máximo', () => {
    const save = new SaveSystem(new MemoryStorage());
    save.addGold(100000);
    for (let i = 0; i < 10; i++) {
      buy(save, 'revival');
    }
    expect(save.get().shop['revival']).toBe(1);
  });

  it('applyShopToStats modifica stats base', () => {
    const stats = {
      maxHp: 100,
      moveSpeed: 220,
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
    applyShopToStats(stats, { might: 5, bulwark: 3, revival: 1 });
    expect(stats.damageMult).toBeCloseTo(1.3);
    expect(stats.armor).toBe(3);
    expect(stats.revives).toBe(1);
  });
});

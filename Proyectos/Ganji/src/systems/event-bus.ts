export type GameEventMap = {
  'hp-changed': { hp: number; maxHp: number };
  'xp-changed': { xp: number; xpToNext: number; level: number };
  'gold-changed': { gold: number };
  'time-changed': { elapsed: number };
  'weapon-acquired': { weaponId: string; level: number };
  'weapon-upgraded': { weaponId: string; level: number };
  'boss-spawned': { name: string; maxHp: number };
  'boss-hp-changed': { hp: number; maxHp: number };
  'boss-died': { name: string };
  'game-over': { elapsed: number; kills: number; level: number; gold: number };
  'victory': { elapsed: number; kills: number; level: number; gold: number };
  'player-hurt': { amount: number };
  'enemy-killed': { x: number; y: number; isBoss: boolean };
  'request-draft': { draft: UpgradeDefLite[] };
  'draft-choice': { upgradeId: string };
  'run-saved': { unlocks: string[] };
  'revived': Record<string, never>;
};

export type GameEventKey = keyof GameEventMap;

export interface UpgradeDefLite {
  id: string;
  kind: string;
  name: string;
  desc: string;
  icon: string;
}

type AnyHandler = (p: never) => void;

export class EventBus {
  private handlers = new Map<GameEventKey, Set<AnyHandler>>();

  on<K extends GameEventKey>(key: K, handler: (p: GameEventMap[K]) => void): () => void {
    let set = this.handlers.get(key);
    if (!set) {
      set = new Set();
      this.handlers.set(key, set);
    }
    set.add(handler as AnyHandler);
    return () => this.off(key, handler);
  }

  off<K extends GameEventKey>(key: K, handler: (p: GameEventMap[K]) => void): void {
    this.handlers.get(key)?.delete(handler as AnyHandler);
  }

  emit<K extends GameEventKey>(key: K, payload: GameEventMap[K]): void {
    const set = this.handlers.get(key);
    if (!set) return;
    for (const handler of set) {
      (handler as (p: GameEventMap[K]) => void)(payload);
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}

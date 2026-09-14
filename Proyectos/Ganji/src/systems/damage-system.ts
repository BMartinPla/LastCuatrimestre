export interface DamageResult {
  amount: number;
  crit: boolean;
}

const EPSILON = 1e-9;

export function computeDamage(
  baseDamage: number,
  damageMult: number,
  targetArmor: number,
  critChance: number,
  critMult: number,
  rng: () => number
): DamageResult {
  const crit = rng() < critChance;
  let amount = baseDamage * damageMult;
  if (crit) amount *= critMult;
  amount = Math.max(1, amount - targetArmor);
  return { amount: Math.max(1, Math.floor(amount + EPSILON)), crit };
}

export function applyArmor(damage: number, armor: number): number {
  return Math.max(1, Math.floor(damage - armor));
}

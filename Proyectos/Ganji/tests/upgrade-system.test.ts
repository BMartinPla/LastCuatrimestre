import { describe, expect, it } from 'vitest';
import {
  addGold,
  applyUpgrade,
  createRunState,
  consumeLevelUp,
  gainXp,
  rollDraft,
  weaponStats,
  xpForLevel
} from '../src/systems/upgrade-system';

const rng = (): number => 0.5;

describe('run state', () => {
  it('crea estado inicial del ronin con katana', () => {
    const run = createRunState('ronin');
    expect(run.hp).toBe(100);
    expect(run.level).toBe(1);
    expect(run.weapons).toEqual([{ id: 'katana', level: 1 }]);
    expect(run.stats.moveSpeed).toBe(220);
  });

  it('falla con personaje desconocido', () => {
    expect(() => createRunState('nope')).toThrow();
  });
});

describe('xp y niveles', () => {
  it('calcula la curva de xp', () => {
    expect(xpForLevel(1)).toBe(5);
    expect(xpForLevel(2)).toBe(13);
    expect(xpForLevel(3)).toBe(21);
  });

  it('acumula niveles pendientes en cascada', () => {
    const run = createRunState('ronin');
    const leveled = gainXp(run, xpForLevel(1) + xpForLevel(2));
    expect(leveled).toBe(2);
    expect(run.pendingLevelUps).toBe(2);
    expect(run.level).toBe(3);
    consumeLevelUp(run);
    expect(run.pendingLevelUps).toBe(1);
  });

  it('no otorga niveles si la xp no alcanza', () => {
    const run = createRunState('ronin');
    expect(gainXp(run, 1)).toBe(0);
    expect(run.level).toBe(1);
  });

  it('aplica growth multiplicador', () => {
    const run = createRunState('ronin');
    run.stats.growth = 2;
    gainXp(run, 2);
    expect(run.xp).toBe(4);
  });
});

describe('mejoras', () => {
  it('añade arma nueva sin duplicar', () => {
    const run = createRunState('ronin');
    applyUpgrade(run, {
      id: 'new-kunai',
      kind: 'new-weapon',
      name: 'Kunai',
      desc: '',
      icon: 'kunai',
      targetId: 'kunai'
    });
    applyUpgrade(run, {
      id: 'new-kunai-2',
      kind: 'new-weapon',
      name: 'Kunai',
      desc: '',
      icon: 'kunai',
      targetId: 'kunai'
    });
    expect(run.weapons).toHaveLength(2);
  });

  it('sube nivel de arma hasta el máximo', () => {
    const run = createRunState('ronin');
    for (let i = 0; i < 20; i++) {
      applyUpgrade(run, {
        id: `lvl-${i}`,
        kind: 'weapon-level',
        name: '',
        desc: '',
        icon: 'katana',
        targetId: 'katana'
      });
    }
    expect(run.weapons[0]?.level).toBe(8);
  });

  it('aplica pasiva y recalcula stats desde la base', () => {
    const run = createRunState('ronin');
    applyUpgrade(run, {
      id: 'pas-vitality-1',
      kind: 'passive',
      name: '',
      desc: '',
      icon: 'vitality',
      targetId: 'vitality'
    });
    expect(run.stats.maxHp).toBe(125);
    expect(run.hp).toBe(125);
    applyUpgrade(run, {
      id: 'pas-vitality-2',
      kind: 'passive',
      name: '',
      desc: '',
      icon: 'vitality',
      targetId: 'vitality'
    });
    expect(run.stats.maxHp).toBe(150);
    expect(run.hp).toBe(150);
  });

  it('luck sube el critico', () => {
    const run = createRunState('ronin');
    applyUpgrade(run, {
      id: 'pas-luck-1',
      kind: 'passive',
      name: '',
      desc: '',
      icon: 'luck',
      targetId: 'luck'
    });
    expect(run.stats.critChance).toBeCloseTo(0.08);
    expect(run.stats.luck).toBe(1);
  });

  it('oro suma', () => {
    const run = createRunState('ronin');
    addGold(run, 10);
    addGold(run, 5);
    expect(run.gold).toBe(15);
  });
});

describe('draft', () => {
  it('genera 3 opciones únicas', () => {
    const run = createRunState('ronin');
    const draft = rollDraft(run, rng);
    expect(draft).toHaveLength(3);
    const ids = new Set(draft.map((d) => d.id));
    expect(ids.size).toBe(3);
  });

  it('no propone armas nuevas con las 4 posesionadas', () => {
    const run = createRunState('ronin');
    run.weapons = [
      { id: 'katana', level: 1 },
      { id: 'kunai', level: 1 },
      { id: 'talisman', level: 1 },
      { id: 'bo', level: 1 }
    ];
    const draft = rollDraft(run, rng);
    expect(draft.every((d) => d.kind !== 'new-weapon')).toBe(true);
  });

  it('propone evolución con arma al máximo y pasiva requerida', () => {
    const run = createRunState('ronin');
    run.weapons = [{ id: 'katana', level: 8 }];
    const draft = rollDraft(run, rng);
    expect(draft.some((d) => d.kind === 'evolution')).toBe(false);
    run.passives = { area: 3 };
    const draft2 = rollDraft(run, rng);
    expect(draft2.some((d) => d.kind === 'evolution' && d.targetId === 'katana')).toBe(true);
  });

  it('aplica evolución al arma poseída', () => {
    const run = createRunState('ronin');
    run.weapons = [{ id: 'katana', level: 8 }];
    applyUpgrade(run, {
      id: 'evo-katana',
      kind: 'evolution',
      name: '',
      desc: '',
      icon: '',
      targetId: 'katana'
    });
    expect(run.weapons[0]?.evolved).toBe(true);
    const owned = run.weapons[0];
    if (!owned) throw new Error('weapon missing');
    const stats = weaponStats(owned);
    expect(stats.damage).toBeCloseTo(64 * 2);
    expect(stats.count).toBe(3 + 1);
  });

  it('los stats de tienda se aplican al crear la run', () => {
    const run = createRunState('ronin', { might: 5, vigor: 2 });
    expect(run.stats.damageMult).toBeCloseTo(1 + 0.06 * 5);
    expect(run.stats.maxHp).toBe(100 + 12 * 2);
    expect(run.hp).toBe(run.stats.maxHp);
  });

  it('goldMult aplica al oro recogido', () => {
    const run = createRunState('ronin', { greed: 5 });
    const gained = addGold(run, 10);
    expect(gained).toBe(Math.floor(10 * 1.6));
    expect(run.gold).toBe(gained);
  });
});

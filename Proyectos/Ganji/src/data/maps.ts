import type { MapDef } from './types';

export const MAPS: Record<string, MapDef> = {
  bamboo: {
    id: 'bamboo',
    name: 'Bosque de Bambú',
    groundTextureKey: 'ground-bamboo',
    worldSize: 2400,
    wave: {
      entries: [
        { enemyId: 'kodama', startAt: 0, rate: 0.6, rateRampPerMinute: 0.5, maxAlive: 40 },
        { enemyId: 'oni', startAt: 30, rate: 0.5, rateRampPerMinute: 0.4, maxAlive: 30 },
        { enemyId: 'kappa', startAt: 120, rate: 0.4, rateRampPerMinute: 0.3, maxAlive: 25 },
        { enemyId: 'tengu', startAt: 240, rate: 0.3, rateRampPerMinute: 0.35, maxAlive: 25 },
        { enemyId: 'hitodama', startAt: 330, rate: 0.5, rateRampPerMinute: 0.4, maxAlive: 30 },
        { enemyId: 'brute', startAt: 360, rate: 0.12, rateRampPerMinute: 0.2, maxAlive: 12 },
        { enemyId: 'jorogumo', startAt: 480, rate: 0.2, rateRampPerMinute: 0.25, maxAlive: 15 }
      ],
      miniBossAt: 300,
      miniBossEnemyId: 'oni_elite',
      bossAt: 900,
      bossEnemyId: 'gashadokuro',
      victoryOnBossKill: true
    }
  },
  temple: {
    id: 'temple',
    name: 'Templo de Sakurayama',
    groundTextureKey: 'ground-temple',
    worldSize: 2600,
    wave: {
      entries: [
        { enemyId: 'kappa', startAt: 0, rate: 0.6, rateRampPerMinute: 0.5, maxAlive: 35 },
        { enemyId: 'hitodama', startAt: 20, rate: 0.6, rateRampPerMinute: 0.5, maxAlive: 35 },
        { enemyId: 'tengu', startAt: 60, rate: 0.5, rateRampPerMinute: 0.45, maxAlive: 30 },
        { enemyId: 'karasu', startAt: 150, rate: 0.4, rateRampPerMinute: 0.4, maxAlive: 28 },
        { enemyId: 'jorogumo', startAt: 240, rate: 0.35, rateRampPerMinute: 0.35, maxAlive: 22 },
        { enemyId: 'oni_warlord', startAt: 420, rate: 0.15, rateRampPerMinute: 0.25, maxAlive: 14 },
        { enemyId: 'brute', startAt: 540, rate: 0.25, rateRampPerMinute: 0.3, maxAlive: 18 }
      ],
      miniBossAt: 300,
      miniBossEnemyId: 'nurikabe_champ',
      bossAt: 900,
      bossEnemyId: 'karakasa',
      victoryOnBossKill: true
    }
  },
  frozen: {
    id: 'frozen',
    name: 'Montaña Congelada',
    groundTextureKey: 'ground-frozen',
    worldSize: 2800,
    wave: {
      entries: [
        { enemyId: 'kodama_elder', startAt: 0, rate: 0.55, rateRampPerMinute: 0.5, maxAlive: 30 },
        { enemyId: 'brute', startAt: 30, rate: 0.3, rateRampPerMinute: 0.4, maxAlive: 24 },
        { enemyId: 'yuki_onna', startAt: 90, rate: 0.25, rateRampPerMinute: 0.3, maxAlive: 14 },
        { enemyId: 'nurikabe', startAt: 180, rate: 0.2, rateRampPerMinute: 0.25, maxAlive: 12 },
        { enemyId: 'oni_warlord', startAt: 300, rate: 0.3, rateRampPerMinute: 0.35, maxAlive: 20 },
        { enemyId: 'karasu', startAt: 360, rate: 0.5, rateRampPerMinute: 0.45, maxAlive: 30 },
        { enemyId: 'jorogumo', startAt: 480, rate: 0.4, rateRampPerMinute: 0.4, maxAlive: 24 }
      ],
      miniBossAt: 300,
      miniBossEnemyId: 'warlord_champ',
      bossAt: 900,
      bossEnemyId: 'orochi',
      victoryOnBossKill: true
    }
  }
};

export const MAP_SELECT_ORDER: string[] = ['bamboo', 'temple', 'frozen'];

import type { CharacterDef } from './types';

export const CHARACTERS: Record<string, CharacterDef> = {
  ronin: {
    id: 'ronin',
    name: 'Ronin',
    desc: 'Errante sin señor. Katana al cinto y nada que perder.',
    hp: 100,
    speed: 220,
    startingWeaponId: 'katana',
    textureKey: 'ronin'
  },
  kunoichi: {
    id: 'kunoichi',
    name: 'Kunoichi',
    desc: 'Sombra veloz. Lluvia de kunai perforante.',
    hp: 80,
    speed: 265,
    startingWeaponId: 'kunai',
    textureKey: 'kunoichi'
  },
  sohei: {
    id: 'sohei',
    name: 'Sohei',
    desc: 'Monje guerrero. El bō sagrado gira a su alrededor.',
    hp: 140,
    speed: 190,
    startingWeaponId: 'bo',
    textureKey: 'sohei'
  },
  onmyoji: {
    id: 'onmyoji',
    name: 'Onmyoji',
    desc: 'Maestro del yin-yang. Talismanes que persiguen.',
    hp: 85,
    speed: 210,
    startingWeaponId: 'talisman',
    textureKey: 'onmyoji'
  },
  kensei: {
    id: 'kensei',
    name: 'Kensei',
    desc: 'Espada santo viviente. Arco de alcance divino.',
    hp: 110,
    speed: 230,
    startingWeaponId: 'bow',
    textureKey: 'kensei'
  }
};

export const CHARACTER_SELECT_ORDER: string[] = ['ronin', 'kunoichi', 'sohei', 'onmyoji', 'kensei'];

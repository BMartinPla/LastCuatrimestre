/**
 * Pixel art de personajes — autoría a nivel de píxel, paleta ukiyo-e.
 * Orientados a la DERECHA (el juego voltea con flipX).
 * Leyenda: K tinta · D navy oscuro · B indigo · L indigo claro · W papel
 * E piel · R rojo · G dorado · N marrón · n marrón claro · P púrpura ·
 * p púrpura oscuro · F azul · C cian · c cian pálido
 */

export const RONIN: string[] = [
  '.......GGG..........',
  '......KDDDK.........',
  '.....KKDDDDKK.......',
  '.....KRRRRRRK.......',
  '.....KEEEEEEK.......',
  '.....KEKEEKEK.......',
  '......KEEEEK........',
  '.......KEEK.........',
  '....KKBBBBLKK.......',
  '...KBBLLBBBBLK......',
  '..KBBLLBBBBLBBK.....',
  '..KBRRRRRRRBBBK.....',
  '..KBBLLBBBBLBBK..WK.',
  '..KDBBBBBBBBBDK..WK.',
  '...KDBBBBBBBDK...WK.',
  '...KDDDDDDDDK....WK.',
  '...KDBBBBBBDK.....W.',
  '...KDBBLLBBDK.......',
  '...KDBBBBBBDK.......',
  '....KDDBBDDK........',
  '....KDDDDDDK........',
  '.....KDDDDK.........',
  '.....KDK.KDK........',
  '.....KDK.KDK........',
  '......KK..KK........',
  '....................'
];

export const KUNOICHI: string[] = [
  '.........KKK........',
  '........KPPPPK......',
  '.......KPPPPPPK.....',
  '......KPPPPPPPPK....',
  '......KEEEEEEK......',
  '......KEKEEKEK......',
  '......KPPPPPPEK.....',
  '.....KPPPPPPK.......',
  '....KPBBBPPKPK......',
  '...KPPLLPBPPBK......',
  '..KPBPPPPPPBPPK.....',
  '..KPPRRRRRRPPBK.....',
  '..KPPPPPPPPPPPK..P..',
  '..KPPLLPBPLLPK...P..',
  '..KPPLPBPLLPK....P..',
  '...KPPPPPPPPK.......',
  '...KPPPPPPPPK.......',
  '....KPPPPPPK........',
  '....KPPPPPPK........',
  '.....KPPPPPK........',
  '.....KPPKPPK........',
  '.....KPK.KPK........',
  '......K...K.........',
  '....................'
];

export const SOHEI: string[] = [
  '........KKKK........',
  '.......KEEEEEK......',
  '.......KEKEEKEK.....',
  '.......KEEEEEEK.....',
  '........KEEEK.......',
  '.....KKWWWWWKKK.....',
  '....KWWWWWWWWWK.....',
  '...KWWGWWWWWGWWK....',
  '..KWWWWWWWWWWWWWK...',
  '..KWWGGGGGGGWWWK....',
  '..KWWWWWWWWWWWWK....',
  '..KWWWWRRRWWWWK..N..',
  '..KWWWRRRRRWWWK..N..',
  '...KWWWWWWWWWK...N..',
  '...KWWWWWWWWK....N..',
  '...KWWWWWWWWK..G.N..',
  '...KWWGGWWWWK....N..',
  '...KWWWWWWWWK...nN..',
  '....KWWWWWWK.....N..',
  '....KWWWWWWK.....N..',
  '.....KWWWWK......N..',
  '.....KWKWKK.....G.N.',
  '......WK.KW.........',
  '....................'
];

export const ONMYOJI: string[] = [
  '.....KKKKKKKK.......',
  '....KWWWWWWWWK......',
  '...KWBBBBBBBWK......',
  '..KWBBBBBBBBBWK.....',
  '..KEEEEEEEEEEK..N.n.',
  '..KEKKEEKKEEK...N.n.',
  '..KEEEEEEEEEK....N..',
  '...KEEEEEEK......N..',
  '....KKKKKK.......N..',
  '...KWWWWWWWK.....N..',
  '..KWWWWWWWWWK...nN..',
  '..KWWRRRRRWWK....N..',
  '..KWWWWWWWWWK....N..',
  '..KWWWWWWWWWK..c.c..',
  '..KWWWWWWWWWK.......',
  '..KWWRRWWWWRK.......',
  '..KWWWWWWWWWK.......',
  '...KWWWWWWK.........',
  '....KWWWWK..........',
  '.....KKKK...........',
  '....................'
];

export const KENSEI: string[] = [
  '.......KKK.........',
  '......KWWWWK.......',
  '.....KWWWWWWK......',
  '.....KWEEEEWK......',
  '.....KEKEEKEK......',
  '......KEEEEK.......',
  '.......KFFK........',
  '....KKFFFFKK.......',
  '...KFFWWFFFFK......',
  '..KFWWWWWWWFFK.....',
  '..KFWWWWWWWFFK.....',
  '..KFFFRRRFFFFK...W.',
  '..KFWWWWWWWFFK....W',
  '..KFFWWFFFFFK.....W',
  '...KFFFFFFFK.......',
  '...KFFFFKFFK.......',
  '....KFFK.FFK.......',
  '.....KFK.KFK.....G.',
  '......K...K.......W',
  '..................N.'
];

export const CHARACTER_MAPS: Record<string, string[]> = {
  ronin: RONIN,
  kunoichi: KUNOICHI,
  sohei: SOHEI,
  onmyoji: ONMYOJI,
  kensei: KENSEI
};

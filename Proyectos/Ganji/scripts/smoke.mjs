import { createServer } from 'vite';
import { chromium } from 'playwright-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SHOT_DIR = new URL('./shots/', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
const errors = [];

function assert(cond, msg) {
  if (!cond) throw new Error(`ASSERT FALLÓ: ${msg}`);
  console.log(`  ✓ ${msg}`);
}

async function main() {
  const server = await createServer({ server: { port: 5199 } });
  await server.listen();

  const browser = await chromium.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });

  const errors = [];
  page.on('console', (msg) => {
    const entry = `[${msg.type()}] ${msg.text()}`;
    if (msg.type() === 'error' || msg.type() === 'warning') errors.push(entry);
  });
  page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`));

  await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  const scenes = () => page.evaluate(() => window.__GANJI_SCENES__?.());
  console.log('  escenas al inicio:', await scenes());
  await page.screenshot({ path: `${SHOT_DIR}menu.png` });

  console.log('=== FASE A: menú → tienda → menú ===');
  await page.keyboard.press('s');
  await page.waitForTimeout(200);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${SHOT_DIR}shop.png` });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  // El menú reinicia su selección a JUGAR (0), no hace falta navegar.

  console.log('=== FASE B: selección personaje/mapa ===');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${SHOT_DIR}charselect.png` });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${SHOT_DIR}mapselect.png` });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);

  const get = () => page.evaluate(() => window.__GANJI_DEBUG__?.getState());

  console.log('=== FASE 1: arranque de partida ===');
  let s = await get();
  assert(s, 'la partida arrancó desde el flujo de menús');
  assert(s.weapons.includes('katana:1'), 'ronin empieza con katana Nv1');

  console.log('=== FASE 2: movimiento ===');
  const before = s;
  await page.keyboard.down('d');
  await page.waitForTimeout(1000);
  await page.keyboard.up('d');
  s = await get();
  assert(s.playerX > before.playerX + 100, `el jugador se mueve (${before.playerX}→${s.playerX})`);

  console.log('=== FASE 3: oleadas y combate (14s) ===');
  await page.waitForTimeout(14000);
  s = await get();
  assert(s.enemiesActive > 0, `enemigos activos (${s.enemiesActive})`);
  assert(s.elapsed > 10, `tiempo corre (${s.elapsed.toFixed(1)}s)`);
  await page.screenshot({ path: `${SHOT_DIR}game-1.png` });

  console.log('=== FASE 4: combate sostenido ===');
  const seq = ['w', 'd', 's', 'a'];
  for (let i = 0; i < 4; i++) {
    await page.keyboard.down(seq[i]);
    await page.waitForTimeout(700);
    await page.keyboard.up(seq[i]);
  }
  await page.waitForTimeout(6000);
  s = await get();
  await page.screenshot({ path: `${SHOT_DIR}game-2.png` });
  console.log(`  estado: lvl=${s.level} xp=${s.xp} kills=${s.kills} gold=${s.gold} hp=${s.hp} enemies=${s.enemiesActive}`);
  assert(s.kills > 0 || s.xp > 0 || s.enemiesActive > 0, 'hay actividad de combate');
  assert(s.hp > 0 && s.hp <= 100, `hp en rango (${s.hp})`);

  console.log('=== FASE 5: level-up draft en cadena ===');
  const levelBefore = s.level;
  await page.evaluate(() => window.__GANJI_DEBUG__.grantXp(60));
  await page.waitForTimeout(600);
  s = await get();
  assert(s.draftOpen, 'draft se abre con XP');
  let choices = 0;
  while (s.draftOpen && choices < 10) {
    await page.keyboard.press('1');
    await page.waitForTimeout(450);
    s = await get();
    choices += 1;
  }
  assert(!s.draftOpen, `drafts cerrados tras ${choices} elecciones`);
  assert(s.level > levelBefore, `nivel sube (${levelBefore}→${s.level})`);
  console.log(`  armas: ${s.weapons.join(', ')}`);

  console.log('=== FASE 6: audio mute ===');
  await page.keyboard.press('m');
  await page.waitForTimeout(250);
  await page.keyboard.press('m');
  await page.waitForTimeout(250);
  s = await get();
  assert(!s.draftOpen, 'sin errores tras toggles de audio');

  console.log('=== FASE 7: pausa y reanudación ===');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const pausedSnap = await get();
  await page.screenshot({ path: `${SHOT_DIR}pause.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const resumed = await get();
  assert(
    Math.abs(pausedSnap.elapsed - resumed.elapsed) < 1.5,
    `pausa congela (${pausedSnap.elapsed.toFixed(1)} ≈ ${resumed.elapsed.toFixed(1)})`
  );

  console.log('=== FASE 8: jefe → victoria → guardado → desbloqueo ===');
  await page.evaluate(() => window.__GANJI_DEBUG__.forceBoss());
  await page.waitForTimeout(600);
  s = await get();
  assert(s.bossAlive, 'el jefe aparece');
  await page.screenshot({ path: `${SHOT_DIR}boss.png` });
  await page.evaluate(() => window.__GANJI_DEBUG__.killAll());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${SHOT_DIR}victory.png` });
  const saveRaw = await page.evaluate(() => localStorage.getItem('ganji.save'));
  const saveData = JSON.parse(saveRaw ?? '{}');
  assert(saveData.mapsUnlocked?.includes('temple'), `victoria desbloquea templo (${JSON.stringify(saveData.mapsUnlocked)})`);
  assert(saveData.victories >= 1, 'victoria registrada en el guardado');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  s = await get();
  assert(s === null, 'ESC vuelve al menú (escena de juego cerrada)');

  console.log('=== FASE 9: el mapa desbloqueado es jugable ===');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  console.log('  escenas tras ESC extra:', await scenes());
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  const dump = await page.evaluate(() => {
    const g = window.__GANJI_GAME__;
    if (!g) return 'NO GAME REF';
    return {
      fps: Math.round(g.loop.actualFps),
      running: g.isRunning,
      nScenes: g.scene.scenes.length,
      scenes: g.scene.scenes.map((sc) => `${sc.scene.settings.key}:${sc.scene.settings.status}`)
    };
  });
  console.log('  dump tras Enter 1:', JSON.stringify(dump));
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  console.log('  tras Enter 2:', await scenes());
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(900);
  console.log('  tras Enter 3:', await scenes());
  s = await get();
  assert(s !== null, 'la partida arranca en el mapa nuevo');
  assert(s.mapId === 'temple', `mapa correcto (${s.mapId})`);

  console.log('=== RESULTADO ===');
  console.log('errors:', errors.length === 0 ? 'NONE' : errors.slice(0, 15).join('\n'));
  await browser.close();
  await server.close();
  if (errors.length > 0) process.exit(1);
  console.log('SMOKE OK — todas las assertions pasaron');
}

main().catch((err) => {
  console.error('SMOKE FAILED:', err.message || err);
  if (typeof errors !== 'undefined' && errors.length > 0) {
    console.error('ERRORES CAPTURADOS:');
    errors.slice(0, 20).forEach((e) => console.error('  ' + e.slice(0, 300)));
  }
  process.exit(1);
});

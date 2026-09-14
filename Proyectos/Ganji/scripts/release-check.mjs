import { preview } from 'vite';
import { chromium } from 'playwright-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const errors = [];

function assert(cond, msg) {
  if (!cond) throw new Error(`ASSERT FALLÓ: ${msg}`);
  console.log(`  ✓ ${msg}`);
}

async function main() {
  const server = await preview({ preview: { port: 5180, strictPort: true } });

  const browser = await chromium.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`);
  });
  page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`));

  await page.goto('http://localhost:5180/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  let scenes = await page.evaluate(() => window.__GANJI_SCENES__?.());
  console.log(`  escenas: ${scenes}`);
  assert(scenes.includes('menu'), 'producción arranca en el menú');

  // flujo rápido hasta partida
  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(900);
  scenes = await page.evaluate(() => window.__GANJI_SCENES__?.());
  assert(scenes.includes('game'), `la partida arranca en producción (${scenes})`);

  const state = await page.evaluate(() => window.__GANJI_DEBUG__?.getState());
  assert(state, 'hook de debug funciona en producción');
  await page.waitForTimeout(8000);
  const s = await page.evaluate(() => window.__GANJI_DEBUG__?.getState());
  assert(s && s.enemiesActive > 0, `enemigos spawneando (${s?.enemiesActive})`);

  console.log('errores:', errors.length === 0 ? 'NONE' : errors.slice(0, 10).join('\n'));
  await browser.close();
  await new Promise((resolve) => server.httpServer?.close(() => resolve(undefined)));
  if (errors.length > 0) process.exit(1);
  console.log('RELEASE OK — build de producción verificado E2E');
}

main().catch((err) => {
  console.error('RELEASE FAILED:', err.message || err);
  if (errors && errors.length > 0) {
    errors.slice(0, 10).forEach((e) => console.error('  ' + e.slice(0, 200)));
  }
  process.exit(1);
});

import { createServer } from 'vite';
import { chromium } from 'playwright-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const server = await createServer({ server: { port: 5198 } });
  await server.listen();
  const browser = await chromium.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });
  const page = await browser.newPage();
  page.on('pageerror', (e) => {
    console.log('PAGEERROR:', e.message);
    if (e.stack) {
      e.stack.split('\n').slice(0, 8).forEach((l) => console.log('  STACK:', l.trim().slice(0, 180)));
    }
  });
  page.on('console', (m) => console.log(`[${m.type()}]`, m.text().slice(0, 200)));
  await page.goto('http://localhost:5198/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log('--- ENTER #1 (menu -> charSelect) ---');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  console.log('DUMP 1:', JSON.stringify(await page.evaluate(() => window.__GANJI_SCENES__())));
  console.log('--- ESC (charSelect -> menu) ---');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  console.log('DUMP 2:', JSON.stringify(await page.evaluate(() => window.__GANJI_SCENES__())));
  console.log('--- ENTER #2 (menu -> charSelect otra vez) ---');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1200);
  console.log('DUMP 3:', JSON.stringify(await page.evaluate(() => window.__GANJI_SCENES__())));
  const consts = await page.evaluate(() => {
    const g = window.__GANJI_GAME__;
    return {
      menuStatus: g.scene.scenes[0].scene.settings.status,
      CONST: window.__GANJI_CONST__ ? window.__GANJI_CONST__() : null
    };
  });
  console.log(JSON.stringify(consts, null, 1));
  await browser.close();
  await server.close();
}
main().catch((e) => {
  console.error('FAIL', e.message);
  process.exit(1);
});

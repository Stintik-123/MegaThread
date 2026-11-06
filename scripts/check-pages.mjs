/* Быстрая проверка: страницы открываются, консоль чистая, горизонтального скролла нет. */
import { chromium } from 'playwright';
import { listen } from './serve.mjs';

const { server, port } = await listen(0);
const BASE = `http://127.0.0.1:${port}`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errs = [];
page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));

const routes = ['#/', '#/catalog', '#/cat/media', '#/cat/torrents', '#/collections', '#/tags', '#/about', '#/rules', '#/favorites'];
for (const r of routes) {
  await page.goto(BASE + '/index.html' + r, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const active = await page.$eval('.view.is-active', (n) => n.id).catch(() => 'нет');
  console.log(r.padEnd(16), '→', active);
}

// палитра поиска
await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
await page.keyboard.press('Control+k');
await page.fill('#palette-input', 'торрент');
await page.waitForTimeout(500);
console.log('палитра:', (await page.$$('#palette-results .palette__item')).length, 'результатов');
await page.keyboard.press('Escape');

// горизонтальный скролл
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log('горизонтальный скролл:', overflow);

const real = errs.filter((e) => !/favicon|manifest|sw\.js/i.test(e));
console.log('ошибки консоли:', real.length ? real.join(' | ') : 'нет');

await browser.close();
server.close();
process.exit(real.length ? 1 : 0);

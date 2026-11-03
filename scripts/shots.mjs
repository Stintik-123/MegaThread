/* Снимает скриншоты сайта в разных состояниях для визуальной проверки.
   Запуск: node scripts/shots.mjs */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { listen } from './serve.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.shots');

const { server, port } = await listen(0);
const BASE = `http://127.0.0.1:${port}`;

const browser = await chromium.launch();

const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await desktop.newPage();

await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(OUT, '01-home.png') });

await page.fill('#search', 'vpn');
await page.waitForSelector('#search-results .hit');
await page.waitForTimeout(250);
await page.screenshot({ path: path.join(OUT, '02-search.png'), clip: { x: 0, y: 0, width: 1440, height: 700 } });
await page.fill('#search', '');

await page.goto(BASE + '/index.html#/cat/privacy', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(OUT, '03-category.png') });

await page.click('#cat-tags .chip:has-text("VPN")');
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(OUT, '04-filtered.png') });

await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
await page.click('#start-grid .pick__name');
await page.waitForSelector('#res-dialog[open]');
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(OUT, '05-dialog.png') });

await desktop.close();

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const m = await mobile.newPage();
await m.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
await m.waitForTimeout(400);
await m.screenshot({ path: path.join(OUT, '06-mobile.png') });
await mobile.close();

const dark = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' });
const d = await dark.newPage();
await d.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
await d.waitForTimeout(400);
await d.screenshot({ path: path.join(OUT, '07-dark.png') });
await dark.close();

await browser.close();
server.close();
console.log('Скриншоты в .shots/');

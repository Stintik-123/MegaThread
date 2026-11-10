/* Снимает скриншоты страниц сайта в .shots/ для визуальной проверки.
   Запуск: node scripts/shots-new.mjs */
import { chromium } from 'playwright';
import { listen } from './serve.mjs';

const { server, port } = await listen(0);
const BASE = `http://127.0.0.1:${port}`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const shots = [
  ['01-home', BASE + '/index.html'],
  ['02-category', BASE + '/index.html#/cat/torrents'],
  ['03-catalog', BASE + '/index.html#/catalog'],
  ['04-collections', BASE + '/index.html#/collections'],
];

for (const [name, url] of shots) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `.shots/${name}.png`, fullPage: false });
  console.log('снимок', name);
}

// палитра поиска
await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
await page.keyboard.press('Control+k');
await page.fill('#palette-input', 'торренты');
await page.waitForTimeout(700);
await page.screenshot({ path: '.shots/05-palette.png' });
console.log('снимок 05-palette');

// тёмная тема
await page.keyboard.press('Escape');
await page.click('#theme-toggle');
await page.waitForTimeout(500);
await page.screenshot({ path: '.shots/06-dark.png' });
console.log('снимок 06-dark');

// тёмная тема + подборки: проверяем обрезку длинных названий и тихие статусы
await page.goto(BASE + '/index.html#/collections', { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
await page.screenshot({ path: '.shots/08-dark-collections.png' });
console.log('снимок 08-dark-collections');

// мобильный
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: '.shots/07-mobile.png' });
console.log('снимок 07-mobile');

await browser.close();
server.close();

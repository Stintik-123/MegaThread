/* Скриншот страницы подборки «Файлообменники»: там длинные onion-адреса.
   Запуск: node scripts/shot-collection.mjs */
import { chromium } from 'playwright';
import { listen } from './serve.mjs';

const { server, port } = await listen(0);
const BASE = `http://127.0.0.1:${port}`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

await page.goto(BASE + '/index.html#/collections', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const opened = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('.colcard')];
  const card = cards.find((c) => /Файл/i.test(c.textContent || ''));
  if (!card) return null;
  const btn = card.querySelector('.colcard__more');
  if (!btn) return null;
  btn.click();
  return true;
});
console.log('перешли в подборку:', opened);

await page.waitForTimeout(1200);
await page.screenshot({ path: '.shots/10-collection-detail.png' });
console.log('снимок 10-collection-detail');

const over = await page.$$eval('.row__name', (els) =>
  els.filter((e) => e.scrollWidth > e.clientWidth + 1).length
);
console.log('обрезанных длинных названий в списке:', over);

await browser.close();
server.close();

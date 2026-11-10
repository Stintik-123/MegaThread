/* Проверка переполнения в подборках: ищем названия, которые не влезают в карточку.
   Запуск: node scripts/check-overflow.mjs */
import { chromium } from 'playwright';
import { listen } from './serve.mjs';

const { server, port } = await listen(0);
const BASE = `http://127.0.0.1:${port}`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

await page.goto(BASE + '/index.html#/collections', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);

const more = await page.$$('.colcard__more');
console.log('карточек подборок:', (await page.$$('.colcard')).length, '· кнопок «показать все»:', more.length);

const bad = await page.$$eval('.colcard__list li', (items) =>
  items
    .map((li) => {
      const b = li.querySelector('button');
      const tag = li.querySelector('.colcard__tag');
      if (!b) return null;
      const liBox = li.getBoundingClientRect();
      const bBox = b.getBoundingClientRect();
      const tBox = tag ? tag.getBoundingClientRect() : null;
      const card = li.closest('.colcard').getBoundingClientRect();
      return {
        name: b.textContent.trim(),
        clipped: b.scrollWidth > b.clientWidth + 1,
        outOfCard: bBox.right > card.right + 1,
        overTag: tBox ? bBox.right > tBox.left + 1 : false,
        liWidth: Math.round(liBox.width),
      };
    })
    .filter((x) => x && (x.outOfCard || x.overTag))
);

console.log('Строк, вылезающих за карточку:', bad.length);
for (const b of bad.slice(0, 10)) console.log(' ', b.name, JSON.stringify(b));

const clipped = await page.$$eval('.colcard__list button', (bs) => bs.filter((b) => b.scrollWidth > b.clientWidth + 1).length);
console.log('Обрезанных многоточием названий:', clipped);

// скриншот самой длинной строки
const longest = await page.evaluate(() => {
  const bs = [...document.querySelectorAll('.colcard__list button')];
  bs.sort((a, b) => b.textContent.length - a.textContent.length);
  const el = bs[0];
  if (!el) return null;
  const card = el.closest('.colcard');
  card.scrollIntoView({ block: 'center' });
  card.setAttribute('data-shot-card', '1');
  return el.textContent.trim();
});
console.log('Самое длинное название:', longest);
await page.waitForTimeout(400);
const cardBox = await page.evaluate(() => {
  const card = document.querySelector('[data-shot-card]');
  if (!card) return null;
  card.scrollIntoView({ block: 'center' });
  const r = card.getBoundingClientRect();
  return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: Math.max(0, r.height) };
});
await page.waitForTimeout(300);
if (cardBox) {
  try {
    await page.screenshot({ path: '.shots/09-long-name.png', clip: cardBox });
  } catch {
    await page.screenshot({ path: '.shots/09-long-name.png' });
  }
}
console.log('снимок 09-long-name');

await browser.close();
server.close();

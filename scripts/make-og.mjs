/* Рисует OG-обложку icons/og-image.png (1200×630) в headless Chromium.
   Запуск: node scripts/make-og.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Аватар вставляем прямо в разметку: file:// с кириллицей в пути не загружается. */
const AVATAR_DATA =
  'data:image/png;base64,' +
  fs.readFileSync(path.join(ROOT, 'icons', 'RuPiracy.png')).toString('base64');

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px; height: 630px;
    background: #fafafa;
    color: #111111;
    font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    padding: 72px 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 24px solid #111111;
  }
  .mark { display: flex; align-items: center; gap: 16px; }
  .mark svg { width: 44px; height: 44px; }
  .mark img { width: 46px; height: 46px; border-radius: 10px; object-fit: cover; display: block; }
  .mark span { font-size: 30px; font-weight: 700; letter-spacing: -.02em; }
  .mark em { font-style: normal; color: #171717; }
  h1 { font-size: 74px; font-weight: 700; letter-spacing: -.03em; line-height: 1.05; max-width: 900px; }
  .sub { margin-top: 24px; font-size: 28px; color: #525252; }
  .rule { height: 3px; background: #111111; margin: 40px 0 32px; }
  .row { display: flex; gap: 56px; }
  .stat b { display: block; font-size: 40px; font-weight: 700; font-family: ui-monospace, Consolas, monospace; }
  .stat span { font-size: 19px; color: #737373; }
</style></head>
<body>
  <div class="mark">
    <img src="${AVATAR_DATA}" alt="" width="46" height="46">
    <span>Mega<em>Thread</em></span>
  </div>
  <div>
    <h1>Пиратский сборник трекеров и раздач</h1>
    <p class="sub">Кино, аниме, игры, книги, музыка, обход блокировок. Без аккаунтов.</p>
    <div class="rule"></div>
    <div class="row">
      <div class="stat"><b>1386</b><span>ресурсов</span></div>
      <div class="stat"><b>9</b><span>разделов</span></div>
      <div class="stat"><b>1376</b><span>открываются сразу</span></div>
      <div class="stat"><b>43</b><span>меток</span></div>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.screenshot({ path: path.join(ROOT, 'icons', 'og-image.png') });
await browser.close();

const size = fs.statSync(path.join(ROOT, 'icons', 'og-image.png')).size;
console.log('icons/og-image.png готов, ' + Math.round(size / 1024) + ' КБ');

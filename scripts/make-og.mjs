/* Рисует OG-обложку icons/og-image.png (1200×630) в headless Chromium.
   Запуск: node scripts/make-og.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px; height: 630px;
    background: #ffffff;
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
  .mark span { font-size: 30px; font-weight: 700; letter-spacing: -.02em; }
  .mark em { font-style: normal; color: #0b4fc7; }
  h1 { font-size: 74px; font-weight: 700; letter-spacing: -.03em; line-height: 1.05; max-width: 900px; }
  .sub { margin-top: 24px; font-size: 28px; color: #55555c; }
  .rule { height: 3px; background: #111111; margin: 40px 0 32px; }
  .row { display: flex; gap: 56px; }
  .stat b { display: block; font-size: 40px; font-weight: 700; font-family: ui-monospace, Consolas, monospace; }
  .stat span { font-size: 19px; color: #86868f; }
</style></head>
<body>
  <div class="mark">
    <svg viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="2.4" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h9"/></svg>
    <span>Mega<em>Thread</em></span>
  </div>
  <div>
    <h1>Бесплатные ресурсы интернета в одном каталоге</h1>
    <p class="sub">Кино, игры, софт, ИИ, приватность, книги. Без аккаунтов.</p>
    <div class="rule"></div>
    <div class="row">
      <div class="stat"><b>186</b><span>ресурсов</span></div>
      <div class="stat"><b>12</b><span>категорий</span></div>
      <div class="stat"><b>42</b><span>метки</span></div>
      <div class="stat"><b>0 ₽</b><span>и без регистрации</span></div>
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

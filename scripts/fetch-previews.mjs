/* Собирает скриншоты (JPEG-превью) для всех уникальных доменов из js/data.js.
   Запуск: node scripts/fetch-previews.mjs
   Результат: previews/*.jpg + previews/manifest.json + previews/index.html */
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { RESOURCES } from '../js/data.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'previews');
const DATA_FILE = path.join(ROOT, 'js', 'data.js');

const CONCURRENCY = 4;
const VIEWPORT = { width: 1280, height: 800 };
const SCALE = 0.5;
const NAV_TIMEOUT = 20000;
const SETTLE_MS = 2500;
const JPEG_QUALITY = 50;

/** Домен -> уникальное имя файла. '1337x.to' -> '1337x-to.jpg' */
function fileNameFor(domain) {
  const slug = domain.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${slug || 'domain'}.jpg`;
}

/** Уникальные домены из всех ресурсов каталога. */
function collectDomains(resources) {
  const seen = new Set();
  for (const r of resources) {
    if (!r || typeof r.url !== 'string' || !r.url.trim()) continue;
    let host;
    try {
      host = new URL(r.url).hostname.toLowerCase();
    } catch {
      continue;
    }
    if (!host) continue;
    if (host.startsWith('www.')) host = host.slice(4);
    if (!host) continue;
    seen.add(host);
  }
  return [...seen].sort();
}

/** HTML-заглушка для недоступных сайтов. */
function placeholderHtml(domain) {
  const safe = domain.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  html,body{margin:0;height:100%;}
  body{background:#e9e9ec;display:flex;flex-direction:column;align-items:center;justify-content:center;
       font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}
  .d{font-size:52px;font-weight:700;color:#55555c;letter-spacing:-0.5px;max-width:90%;text-align:center;
     word-break:break-word;}
  .s{margin-top:14px;font-size:18px;color:#8b8b93;}
</style></head>
<body><div class="d">${safe}</div><div class="s">превью недоступно</div></body></html>`;
}

async function shootPlaceholder(context, domain, file) {
  const page = await context.newPage();
  try {
    await page.setViewportSize(VIEWPORT);
    await page.setContent(placeholderHtml(domain), { waitUntil: 'load' });
    await page.screenshot({ path: file, type: 'jpeg', quality: JPEG_QUALITY, scale: 'device' });
  } finally {
    await page.close().catch(() => {});
  }
}

async function shootSite(context, domain, file, timeout = NAV_TIMEOUT) {
  const page = await context.newPage();
  try {
    await page.setViewportSize(VIEWPORT);
    await page.goto(`https://${domain}`, { waitUntil: 'domcontentloaded', timeout });
    await page.waitForTimeout(SETTLE_MS);
    await page.screenshot({ path: file, type: 'jpeg', quality: JPEG_QUALITY, scale: 'device' });
  } finally {
    await page.close().catch(() => {});
  }
}

function shortError(err) {
  const msg = String(err?.message || err).split('\n')[0].trim();
  return msg.length > 120 ? msg.slice(0, 117) + '...' : msg;
}

/** Собирает index.html для визуальной проверки. */
async function writeIndexHtml(domains, items) {
  const cards = domains.map((d) => {
    const file = items[d];
    const label = d.replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    return `    <figure class="card">
      <img src="${file}" alt="${label}" loading="lazy">
      <figcaption>${label}</figcaption>
    </figure>`;
  }).join('\n');

  const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MegaThread — превью (${domains.length})</title>
<style>
  body{margin:0;padding:24px;background:#f5f5f7;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#222}
  h1{font-size:22px;margin:0 0 18px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
  .card{margin:0;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.12)}
  .card img{display:block;width:100%;height:auto;aspect-ratio:8/5;object-fit:cover;background:#e9e9ec}
  .card figcaption{padding:8px 10px;font-size:13px;color:#55555c;word-break:break-all}
</style>
</head>
<body>
  <h1>MegaThread — превью доменов (${domains.length})</h1>
  <div class="grid">
${cards}
  </div>
</body>
</html>
`;
  await fs.writeFile(path.join(OUT, 'index.html'), html, 'utf8');
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });

  const domains = collectDomains(RESOURCES);
  console.log(`Доменов: ${domains.length}`);

  const browser = await chromium.launch();
  const results = new Map(); // domain -> { file, real, error }
  let real = 0;
  let stub = 0;
  let hard = 0;

  const contexts = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    contexts.push(await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: SCALE,
      ignoreHTTPSErrors: true,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/131.0.0.0 Safari/537.36',
      locale: 'ru-RU',
    }));
  }

  let cursor = 0;
  const errors = [];
  const worker = async (ctx) => {
    nextDomain: for (;;) {
      const i = cursor++;
      if (i >= domains.length) return;
      const domain = domains[i];
      const file = fileNameFor(domain);
      const target = path.join(OUT, file);
      try {
        await shootSite(ctx, domain, target);
        real++;
        results.set(domain, { file, real: true });
        console.log(`OK ${domain}`);
      } catch (err) {
        let reason = shortError(err);
        // Повторная попытка: часть сайтов не успевает ответить за 20 с (ретраи идут по каждому домену).
        for (let attempt = 1; attempt <= 2; attempt++) {
          await new Promise((r) => setTimeout(r, 1500));
          try {
            await shootSite(ctx, domain, target, NAV_TIMEOUT + 15000);
            real++;
            results.set(domain, { file, real: true });
            console.log(`OK ${domain}`);
            continue nextDomain;
          } catch (err2) {
            reason = shortError(err2);
          }
        }
        try {
          await shootPlaceholder(ctx, domain, target);
          stub++;
          results.set(domain, { file, real: false });
          console.log(`FAIL ${domain}: ${reason}`);
        } catch (err2) {
          hard++;
          errors.push([domain, reason, shortError(err2)]);
          console.log(`FAIL ${domain}: ${reason} (заглушка не создана: ${shortError(err2)})`);
        }
      }
    }
  };

  try {
    await Promise.all(contexts.map(worker));
  } finally {
    for (const ctx of contexts) await ctx.close().catch(() => {});
    await browser.close().catch(() => {});
  }

  // manifest.json
  const items = {};
  for (const d of domains) {
    const r = results.get(d);
    if (r) items[d] = r.file;
  }
  const manifest = { generated: new Date().toISOString(), items };
  await fs.writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  await writeIndexHtml(domains, items);

  console.log(`Итого: успешно ${real}, заглушек ${stub}, жёстких ошибок ${hard}`);
  console.log(`manifest: ${path.join(OUT, 'manifest.json')}`);

  if (errors.length) {
    console.log('Не удалось создать превью:');
    for (const [d, r1, r2] of errors) console.log(`  - ${d}: ${r1} / ${r2}`);
  }

  const missing = domains.filter((d) => !items[d]);
  if (missing.length) {
    console.log(`ВНИМАНИЕ: без файла (${missing.length}): ${missing.join(', ')}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Фатальная ошибка:', err);
    process.exit(0);
  });

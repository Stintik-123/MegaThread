/* Снимает превью для всех доменов каталога.
   Логика: если сайт отдаёт ошибку (HTTP >= 400, 404-страница, антибот-заглушка),
   вместо кадра сохраняется аккуратная заглушка «превью недоступно».
   Имя файла совпадает с previewFile() из js/render.js: домен без www, не-буквы → '-'.
   Запуск: node scripts/fetch-previews-piracy.mjs
   Окружение: LIMIT=1375 CONC=10 FORCE=1 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { RESOURCES } from '../js/data.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'previews');

const LIMIT = Number(process.env.LIMIT || process.argv[2] || 1375);
const CONC = Number(process.env.CONC || 10);
const FORCE = process.env.FORCE === '1';
const VIEWPORT = { width: 1280, height: 800 };
const SCALE = 0.5;
const NAV_TIMEOUT = 15000;
const SETTLE_MS = 1800;
const JPEG_QUALITY = 45;

/* Признаки того, что вместо сайта отдали ошибку или заглушку. */
const ERROR_PATTERNS = [
  '404', 'not found', '404 not found', 'page not found',
  'access denied', 'forbidden', '403 forbidden', 'blocked',
  'just a moment', 'attention required', 'checking your browser',
  'enable javascript and cookies', 'cloudflare', 'ddos protection',
  "site can't be reached", 'this site is blocked', 'problem loading',
  'domain not found', 'no such host', 'server error', 'internal error',
  'service unavailable', 'запрещено', 'не найдено', 'страница не найдена',
  'доступ ограничен', 'заблокирован', 'ошибка сервера',
];

function fileNameFor(domain) {
  return domain.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.jpg';
}

/** Уникальные домены, отсортированные по популярности (число ресурсов на домен). */
function collectDomains(resources) {
  const counts = new Map();
  const first = new Map();
  let idx = 0;
  for (const r of resources) {
    if (!r || typeof r.url !== 'string') continue;
    let host;
    try {
      host = new URL(r.url).hostname.toLowerCase();
    } catch {
      continue;
    }
    if (host.startsWith('www.')) host = host.slice(4);
    if (!host) continue;
    counts.set(host, (counts.get(host) || 0) + 1);
    if (!first.has(host)) first.set(host, idx++);
  }
  return [...counts.keys()].sort((a, b) => {
    const d = counts.get(b) - counts.get(a);
    return d !== 0 ? d : first.get(a) - first.get(b);
  });
}

/** Страница-заглушка в стиле сайта: только домен и пометка. */
function placeholderHtml(domain) {
  const safe = domain.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>
  html,body{margin:0;height:100%;}
  body{background:#e9e9ec;display:flex;flex-direction:column;align-items:center;justify-content:center;
       font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}
  .d{font-size:52px;font-weight:700;color:#55555c;letter-spacing:-.5px;max-width:90%;text-align:center;word-break:break-word;}
  .s{margin-top:14px;font-size:18px;color:#8b8b93;}
  </style></head><body><div class="d">${safe}</div><div class="s">превью недоступно</div></body></html>`;
}

async function savePlaceholder(context, domain, file) {
  const page = await context.newPage();
  try {
    await page.setViewportSize(VIEWPORT);
    await page.setContent(placeholderHtml(domain), { waitUntil: 'load' });
    await page.screenshot({ path: file, type: 'jpeg', quality: JPEG_QUALITY, scale: 'device' });
  } finally {
    await page.close().catch(() => {});
  }
}

/** Возвращает 'ok' | 'error' | 'blocked'. */
async function classify(page, domain) {
  let response = null;
  try {
    response = await page.goto(`https://${domain}`, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
  } catch {
    try {
      response = await page.goto(`http://${domain}`, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
    } catch {
      return 'error';
    }
  }
  if (response && response.status() >= 400) return 'error';
  await page.waitForTimeout(SETTLE_MS);
  let probe = '';
  try {
    probe = ((await page.title()) || '') + ' ' + (await page.evaluate(() => document.body ? document.body.innerText : '')).slice(0, 1200);
  } catch {
    return 'error';
  }
  const low = probe.toLowerCase();
  for (const p of ERROR_PATTERNS) {
    if (low.includes(p)) return 'blocked';
  }
  return 'ok';
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const domains = collectDomains(RESOURCES);
  let targets = domains.slice(0, LIMIT);
  if (process.env.STUBS === '1') {
    let list = [];
    try {
      const raw = JSON.parse(await fs.readFile(path.join(OUT, 'stubs.json'), 'utf8'));
      list = raw.domains || [];
    } catch { /* нет списка — обработаем все */ }
    const set = new Set(list);
    targets = domains.filter((d) => set.has(d));
    console.log(`Повторный проход по заглушкам: ${targets.length}`);
  }
  console.log(`Доменов в каталоге: ${domains.length}, обрабатываем: ${targets.length}`);

  const browser = await chromium.launch();
  const contexts = [];
  for (let i = 0; i < CONC; i++) {
    contexts.push(await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: SCALE,
      ignoreHTTPSErrors: true,
      locale: 'ru-RU',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/131.0.0.0 Safari/537.36',
    }));
  }

  const stats = { real: 0, placeholder: 0, skipped: 0, failed: 0 };
  const stubList = [];
  let cursor = 0;

  const worker = async (ctx) => {
    for (;;) {
      const i = cursor++;
      if (i >= targets.length) return;
      const domain = targets[i];
      const file = path.join(OUT, fileNameFor(domain));
      if (!FORCE) {
        try { await fs.stat(file); stats.skipped++; continue; } catch { /* нет файла */ }
      }
      const page = await ctx.newPage();
      let state = 'error';
      try {
        await page.setViewportSize(VIEWPORT);
        state = await classify(page, domain);
        if (state === 'ok') {
          await page.screenshot({ path: file, type: 'jpeg', quality: JPEG_QUALITY, scale: 'device' });
          stats.real++;
          console.log(`OK    ${domain}`);
        } else {
          await savePlaceholder(ctx, domain, file);
          stats.placeholder++;
          stubList.push(domain);
          console.log(`STUB  ${domain} (${state})`);
        }
      } catch (err) {
        try {
          await savePlaceholder(ctx, domain, file);
          stats.placeholder++;
          stubList.push(domain);
          console.log(`STUB  ${domain} (ошибка съёмки)`);
        } catch {
          stats.failed++;
          console.log(`FAIL  ${domain}: ${String(err?.message || err).split('\n')[0].slice(0, 80)}`);
        }
      } finally {
        await page.close().catch(() => {});
      }
    }
  };

  try {
    await Promise.all(contexts.map(worker));
  } finally {
    for (const ctx of contexts) await ctx.close().catch(() => {});
    await browser.close().catch(() => {});
  }

  // manifest: домен -> файл для всех доменов каталога, у которых файл есть
  const items = {};
  for (const d of domains) {
    const file = fileNameFor(d);
    try {
      const st = await fs.stat(path.join(OUT, file));
      if (st.size > 800) items[d] = file;
    } catch { /* нет файла — пропуск */ }
  }
  await fs.writeFile(path.join(OUT, 'manifest.json'),
    JSON.stringify({ generated: new Date().toISOString(), items }, null, 2) + '\n', 'utf8');
  await fs.writeFile(path.join(OUT, 'stubs.json'),
    JSON.stringify({ generated: new Date().toISOString(), domains: stubList }, null, 2) + '\n', 'utf8');

  console.log(`Итог: кадров ${stats.real}, заглушек ${stats.placeholder}, пропущено ${stats.skipped}, без файла ${stats.failed}`);
  console.log(`В манифесте доменов: ${Object.keys(items).length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error('Фатал:', e); process.exit(1); });

/* Собирает живые скриншоты (JPEG) для доменов из js/data.js.
   Имя файла совпадает с previewFile() из js/render.js: домен без www, не-буквы → '-'.
   Запуск: node scripts/fetch-previews-piracy.mjs [лимит]
   Окружение: LIMIT=240 CONC=8 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { RESOURCES } from '../js/data.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'previews');

const LIMIT = Number(process.env.LIMIT || process.argv[2] || 240);
const CONC = Number(process.env.CONC || 8);
const VIEWPORT = { width: 1280, height: 800 };
const SCALE = 0.5;
const NAV_TIMEOUT = 18000;
const SETTLE_MS = 1800;
const JPEG_QUALITY = 45;

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

async function shoot(context, domain, file) {
  const page = await context.newPage();
  try {
    await page.setViewportSize(VIEWPORT);
    await page.goto(`https://${domain}`, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
    await page.waitForTimeout(SETTLE_MS);
    await page.screenshot({ path: file, type: 'jpeg', quality: JPEG_QUALITY, scale: 'device' });
  } finally {
    await page.close().catch(() => {});
  }
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const domains = collectDomains(RESOURCES);
  const targets = domains.slice(0, LIMIT);
  console.log(`Всего доменов: ${domains.length}, берём: ${targets.length}`);

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

  const ok = [];
  const failed = [];
  const skipped = [];
  let cursor = 0;

  const worker = async (ctx) => {
    for (;;) {
      const i = cursor++;
      if (i >= targets.length) return;
      const domain = targets[i];
      const file = path.join(OUT, fileNameFor(domain));
      let exists = false;
      try { await fs.stat(file); exists = true; } catch { /* нет файла */ }
      if (exists) { skipped.push(domain); continue; }
      let done = false;
      for (let attempt = 0; attempt < 2 && !done; attempt++) {
        try {
          await shoot(ctx, domain, file);
          ok.push(domain);
          console.log(`OK   ${domain}`);
          done = true;
        } catch (err) {
          const msg = String(err?.message || err).split('\n')[0].trim();
          if (attempt === 1) {
            failed.push(`${domain} — ${msg.slice(0, 80)}`);
            console.log(`FAIL ${domain}: ${msg.slice(0, 80)}`);
          } else {
            await new Promise((r) => setTimeout(r, 800));
          }
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

  // manifest: домен -> файл для всех доменов, у которых файл реально есть
  const items = {};
  for (const d of domains) {
    const file = fileNameFor(d);
    try {
      const st = await fs.stat(path.join(OUT, file));
      if (st.size > 1200) items[d] = file;
    } catch { /* нет файла — пропускаем */ }
  }
  const manifest = { generated: new Date().toISOString(), items };
  await fs.writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  console.log(`Снято: ${ok.length}, пропущено (уже есть): ${skipped.length}, не удалось: ${failed.length}, в манифесте: ${Object.keys(items).length}`);
  if (failed.length) console.log('Мимо:\n  ' + failed.join('\n  '));
}

main().then(() => process.exit(0)).catch((e) => { console.error('Фатал:', e); process.exit(1); });

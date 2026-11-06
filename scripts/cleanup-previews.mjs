/* Удаляет превью, домены которых больше нет в каталоге (js/data.js).
   Запуск: node scripts/cleanup-previews.mjs
   Файлы остаются в истории git, удаление обратимо через git checkout. */
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { RESOURCES } from '../js/data.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'previews');

const hosts = new Set();
for (const r of RESOURCES) {
  try {
    let h = new URL(r.url).hostname.toLowerCase();
    if (h.startsWith('www.')) h = h.slice(4);
    if (h) hosts.add(h);
  } catch { /* пропуск */ }
}

const files = await fs.readdir(OUT);
let removed = 0;
let kept = 0;
for (const f of files) {
  if (!f.endsWith('.jpg')) continue;
  const domain = f.replace(/\.jpg$/, '').replace(/-/g, '.');
  const candidates = [domain];
  // slug без www-префикса и со слиянием дефисов
  for (const h of hosts) {
    if (h.replace(/[^a-z0-9]/g, '-') === f.replace(/\.jpg$/, '')) candidates.push(h);
  }
  const alive = candidates.some((c) => hosts.has(c)) ||
    [...hosts].some((h) => h.replace(/[^a-z0-9]/g, '-') === f.replace(/\.jpg$/, ''));
  if (alive) { kept++; continue; }
  await fs.unlink(path.join(OUT, f));
  removed++;
}
console.log(`Удалено превью несуществующих доменов: ${removed}, оставлено: ${kept}`);

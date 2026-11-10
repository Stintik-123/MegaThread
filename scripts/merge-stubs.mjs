/* Объединяет список заглушек: текущий previews/stubs.json + список из git HEAD.
   Запуск: node scripts/merge-stubs.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'previews', 'stubs.json');

function readJson(text, fallback) {
  try {
    return JSON.parse(text.replace(/^\uFEFF/, '').trim());
  } catch {
    return fallback;
  }
}

let head = { domains: [] };
try {
  const raw = execFileSync('git', ['show', 'HEAD:previews/stubs.json'], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
  });
  head = readJson(raw, { domains: [] });
} catch {
  console.log('Списка заглушек в git HEAD нет — беру текущий.');
}

const cur = readJson(fs.readFileSync(FILE, 'utf8'), { domains: [] });
const merged = [...new Set([...(head.domains || []), ...(cur.domains || [])])].sort();

fs.writeFileSync(FILE, JSON.stringify({ generated: new Date().toISOString(), domains: merged }, null, 2) + '\n');
console.log(`В git HEAD: ${(head.domains || []).length}, в текущем: ${(cur.domains || []).length}, объединено: ${merged.length}`);

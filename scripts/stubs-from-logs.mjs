/* Собирает точный список заглушек из логов съёмки (.shots/previews-*.txt).
   Формат строки: STUB  <домен> (причина)
   Запуск: node scripts/stubs-from-logs.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.join(ROOT, '.shots');

function readLog(file) {
  const buf = fs.readFileSync(file);
  const text = (buf[0] === 0xff && buf[1] === 0xfe ? buf.toString('utf16le') : buf.toString('utf8'));
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^(STUB|OK)\s+(\S+)/);
    if (m) out.push({ status: m[1], domain: m[2] });
  }
  return out;
}

const files = fs
  .readdirSync(SHOTS)
  .filter((f) => /^previews.*\.txt$/i.test(f))
  .map((f) => {
    const p = path.join(SHOTS, f);
    return { f, mtime: fs.statSync(p).mtimeMs };
  })
  .sort((a, b) => a.mtime - b.mtime);

/* Последнее упоминание домена решает: сначала был заглушкой, потом сняли кадр. */
const state = new Map();
for (const { f } of files) {
  const entries = readLog(path.join(SHOTS, f));
  for (const e of entries) state.set(e.domain, e.status);
  console.log(`${f}: ${entries.length} решений`);
}

const unique = [...state.entries()]
  .filter(([, status]) => status === 'STUB')
  .map(([domain]) => domain)
  .sort();
fs.writeFileSync(
  path.join(ROOT, 'previews', 'stubs.json'),
  JSON.stringify({ generated: new Date().toISOString(), domains: unique }, null, 2) + '\n'
);
console.log(`Уникальных заглушек: ${unique.length}`);

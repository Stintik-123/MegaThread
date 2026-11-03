import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(ROOT, 'previews');
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
const items = manifest.items || {};
const keys = Object.keys(items);
console.log('в манифесте доменов:', keys.length);
console.log('generated:', manifest.generated);

const missing = keys.filter((k) => !fs.existsSync(path.join(dir, items[k])));
console.log('файлов на диске нет:', missing.length, missing.slice(0, 5).join(', '));

const jpgs = fs.readdirSync(dir).filter((f) => f.endsWith('.jpg'));
console.log('jpg на диске:', jpgs.length);
const extra = jpgs.filter((f) => !Object.values(items).includes(f));
console.log('jpg без записи в манифесте:', extra.length, extra.slice(0, 5).join(', '));

let total = 0;
for (const f of jpgs) total += fs.statSync(path.join(dir, f)).size;
console.log('суммарный размер:', (total / 1024 / 1024).toFixed(2), 'МБ');
console.log('средний:', Math.round(total / jpgs.length / 1024), 'КБ');

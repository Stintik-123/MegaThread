/* Удаляет превью-заглушки (файл меньше 5 КБ — это старые placeholder-картинки),
   чтобы fetch-previews-piracy.mjs снял их заново.
   Запуск: node scripts/drop-stub-previews.mjs */
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'previews');

const files = await fs.readdir(OUT);
let removed = 0;
for (const f of files) {
  if (!f.endsWith('.jpg')) continue;
  const p = path.join(OUT, f);
  const st = await fs.stat(p);
  if (st.size < 5000) {
    await fs.unlink(p);
    removed++;
  }
}
console.log('Заглушек удалено: ' + removed);

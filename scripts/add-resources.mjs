/* Добавляет новые ресурсы в js/data.js: дедупликация по URL и имени,
   пересчёт количества в шапке файла. */
import fs from 'node:fs';

const dataPath = 'js/data.js';
const snippet = fs.readFileSync('scripts/new-resources.snippet.js', 'utf8');

let src = fs.readFileSync(dataPath, 'utf8');

const existingUrls = new Set(
  [...src.matchAll(/"url":\s*"([^"]+)"/g)].map((m) => m[1].replace(/^www\./, '').replace(/\/+$/, ''))
);
const existingNames = new Set([...src.matchAll(/"name":\s*"([^"]+)"/g)].map((m) => m[1]));

// разбираем сниппет на объекты
const blocks = snippet.split(/\n(?=  \{)/).map((b) => b.trim()).filter(Boolean);
const entries = [];
for (const b of blocks) {
  const clean = b.replace(/,\s*$/, '');
  const url = (clean.match(/"url":\s*"([^"]+)"/) || [])[1];
  const name = (clean.match(/"name":\s*"([^"]+)"/) || [])[1];
  if (!url || !name) continue;
  const key = url.replace(/^www\./, '').replace(/\/+$/, '');
  if (existingUrls.has(key)) {
    console.log('дубль по URL, пропускаем:', name);
    continue;
  }
  if (existingNames.has(name)) {
    console.log('дубль по имени, пропускаем:', name);
    continue;
  }
  existingUrls.add(key);
  existingNames.add(name);
  entries.push('  ' + clean);
}

if (!entries.length) {
  console.log('нечего добавлять');
  process.exit(0);
}

// вставляем перед закрывающей скобкой массива RESOURCES
const marker = '\n];\n\nexport const CAT_BY_ID';
const idx = src.lastIndexOf(marker);
if (idx < 0) {
  console.error('не нашёл конец массива RESOURCES');
  process.exit(1);
}
src = src.slice(0, idx + 1) + entries.join(',\n') + ',\n' + src.slice(idx + 1);

// пересчитываем число ресурсов в шапке
const total = [...src.matchAll(/"url":\s*"([^"]+)"/g)].length;
src = src.replace(/\/\/ \d+ категорий, \d+ ресурсов\./, `// 13 категорий, ${total} ресурсов.`);

// нейтрализуем упоминание РФ в описании раздела обхода
src = src.replace(
  'VPN, конфиги и инструменты, которые работают в России',
  'VPN, конфиги и инструменты для обхода блокировок'
);

fs.writeFileSync(dataPath, src, 'utf8');
console.log('добавлено ресурсов:', entries.length);
console.log('всего ресурсов в каталоге:', total);

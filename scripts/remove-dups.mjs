/* Убирает дубли каталога: оставляет копию в разделе torrents. */
import fs from 'node:fs';

const path = 'js/data.js';
let src = fs.readFileSync(path, 'utf8');

for (const name of ['1337x', 'Nyaa']) {
  const re = new RegExp(
    '  \\{\\n    "cat": "media",\\n    "name": "' + name + '",[\\s\\S]*?\\n  \\},\\n',
    'g'
  );
  const before = src.length;
  src = src.replace(re, '');
  console.log(name, before !== src.length ? 'дубль в media удалён' : 'не найден');
}

fs.writeFileSync(path, src, 'utf8');
const total = [...src.matchAll(/"url":\s*"([^"]+)"/g)].length;
src = src.replace(/\/\/ \d+ категорий, \d+ ресурсов\./, `// 13 категорий, ${total} ресурсов.`);
fs.writeFileSync(path, src, 'utf8');
console.log('ресурсов в каталоге:', total);

// Проверка покрытия групп: каждый ресурс категории попадает ровно в одну группу.
// Запуск: node scripts/check-groups.mjs
import { RESOURCES, CATEGORIES } from '../js/data.js';
import { CATEGORY_GROUPS, groupResources } from '../js/groups.js';

let failed = 0;

const catIds = CATEGORIES.map((c) => c.id);
const groupIds = Object.keys(CATEGORY_GROUPS);

console.log('Категорий в data.js: ' + catIds.length);
console.log('Категорий в CATEGORY_GROUPS: ' + groupIds.length);
console.log('Ресурсов в каталоге: ' + RESOURCES.length);

if (groupIds.length !== 13) {
  console.log('FAIL: в CATEGORY_GROUPS не 13 категорий');
  failed++;
}

for (const id of catIds) {
  if (!CATEGORY_GROUPS[id]) {
    console.log('FAIL: нет групп для категории ' + id);
    failed++;
  }
}

for (const id of groupIds) {
  if (!catIds.includes(id)) {
    console.log('FAIL: в CATEGORY_GROUPS есть неизвестная категория ' + id);
    failed++;
  }
  const groups = CATEGORY_GROUPS[id];
  if (!Array.isArray(groups) || groups.length < 2 || groups.length > 5) {
    console.log('FAIL: у ' + id + ' неверное число групп: ' + (groups ? groups.length : 'нет'));
    failed++;
  }
  for (const g of groups) {
    if (!g.id || !g.title || !Array.isArray(g.tags) || !g.tags.length) {
      console.log('FAIL: некорректная группа в ' + id + ': ' + JSON.stringify(g));
      failed++;
    }
    if (typeof g.desc !== 'string') {
      console.log('FAIL: у группы ' + id + '/' + g.id + ' нет строки описания');
      failed++;
    }
  }
}

for (const id of catIds) {
  const res = RESOURCES.filter((r) => r.cat === id);
  const groups = groupResources(id, res);
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const names = groups.flatMap((g) => g.items.map((r) => r.name));
  const unique = new Set(names);

  if (total !== res.length) {
    console.log('FAIL: ' + id + ' — сумма групп ' + total + ' != ' + res.length);
    failed++;
  }
  if (unique.size !== res.length) {
    console.log('FAIL: ' + id + ' — дубликаты: ' + unique.size + ' уникальных из ' + res.length);
    failed++;
  }
  for (const r of res) {
    if (!names.includes(r.name)) {
      console.log('FAIL: ' + id + ' — потерян ресурс ' + r.name);
      failed++;
    }
  }
  // Порядок внутри группы сохраняется.
  for (const g of groups) {
    const order = g.items.map((r) => res.indexOf(r));
    const sorted = [...order].sort((a, b) => a - b);
    if (JSON.stringify(order) !== JSON.stringify(sorted)) {
      console.log('FAIL: ' + id + '/' + g.id + ' — нарушен порядок ресурсов');
      failed++;
    }
  }
  const other = groups.find((g) => g.id === 'other');
  console.log(
    'ok  ' +
      id.padEnd(10) +
      ' ресурсов: ' +
      String(res.length).padStart(3) +
      ' | групп: ' +
      String(groups.length).padStart(2) +
      ' | ' +
      groups
        .map((g) => g.title + ' (' + g.items.length + ')' + (g.id === 'other' ? ' !' : ''))
        .join(', ')
  );
}

console.log('');
if (failed) {
  console.log('Провалено проверок: ' + failed);
  process.exit(1);
}
console.log('ok — все категории покрыты, потерь и дублей нет');

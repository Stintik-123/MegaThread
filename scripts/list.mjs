import { CATEGORIES, RESOURCES } from '../js/data.js';

for (const c of CATEGORIES) {
  const items = RESOURCES.filter((r) => r.cat === c.id);
  console.log('\n## ' + c.title + ' (' + items.length + ')');
  console.log(items.map((r) => '  ' + r.name).join(' | '));
}
console.log('\nВСЕГО:', RESOURCES.length);
